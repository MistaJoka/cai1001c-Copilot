"use client";

import { useCallback, useState } from "react";
import { ResponsePanel } from "@/components/response-panel";
import {
  askStudyBuddy,
  generateFlashcards,
  generateQuiz,
  runGapCheck,
} from "@/lib/api-client";
import type { NotebookDraft } from "@/lib/notebook-copilot-storage";
import {
  compileNotebookForPrompt,
  gapCheckResponseToMarkdown,
  quizResponseToMarkdown,
} from "@/lib/notebook-copilot-storage";
import type { FlashcardsResponse } from "@/lib/schemas/flashcards";

type CopilotActionId =
  | "explain"
  | "gaps"
  | "flashcards"
  | "quiz"
  | "summarize"
  | "simplify"
  | "example";

const ACTIONS: ReadonlyArray<{
  id: CopilotActionId;
  label: string;
  detail: string;
  studyBuddyAction?: string;
}> = [
  {
    id: "explain",
    label: "Explain this note",
    detail: "Walk through the note as a tutor would.",
    studyBuddyAction: "explain-note",
  },
  {
    id: "gaps",
    label: "Find gaps",
    detail: "Structured gap check against what you wrote.",
  },
  {
    id: "flashcards",
    label: "Turn into flashcards",
    detail: "Generate a deck from this note.",
  },
  {
    id: "quiz",
    label: "Create quiz",
    detail:
      "Uses catalog topic context via /api/gemini/quiz (pairs with your topic id).",
  },
  {
    id: "summarize",
    label: "Summarize",
    detail: "Compress to exam-ready bullets.",
    studyBuddyAction: "summarize-note",
  },
  {
    id: "simplify",
    label: "Simplify",
    detail: "Plain-language rewrite for tired brains.",
    studyBuddyAction: "simplify-note",
  },
  {
    id: "example",
    label: "Give real-world example",
    detail: "Concrete scenario tied to your note.",
    studyBuddyAction: "real-world-example",
  },
];

type Props = {
  draft: NotebookDraft;
  onFlashcardsReady: (data: FlashcardsResponse) => void;
};

export function CopilotActionsPanel({ draft, onFlashcardsReady }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [markdown, setMarkdown] = useState<string | null>(null);

  const text = compileNotebookForPrompt(draft);

  const run = useCallback(
    async (id: CopilotActionId) => {
      if (!draft.topicId.trim()) {
        setError("Pick a topic first.");
        return;
      }
      if (!text.trim()) {
        setError("Write something in your note before running copilot actions.");
        return;
      }
      setError(null);
      setMarkdown(null);
      setLoading(true);
      try {
        if (id === "gaps") {
          const data = await runGapCheck({
            topic: draft.topicId,
            studentAnswers: text,
          });
          setMarkdown(gapCheckResponseToMarkdown(data));
          return;
        }
        if (id === "flashcards") {
          const data = await generateFlashcards({
            topic: draft.topicId,
            sourceText: text,
            count: 10,
          });
          onFlashcardsReady(data);
          setMarkdown(
            `## Flashcards generated\n\nDeck **${data.topic}** — ${data.cards.length} cards. Open the **Flashcards** tab to review, or jump to the full flashcards flow.`,
          );
          return;
        }
        if (id === "quiz") {
          const data = await generateQuiz({
            topic: draft.topicId,
            count: 6,
          });
          setMarkdown(quizResponseToMarkdown(data));
          return;
        }
        const cfg = ACTIONS.find((a) => a.id === id);
        const action = cfg?.studyBuddyAction;
        const res = await askStudyBuddy({
          topic: draft.topicId,
          action,
          message: text,
        });
        setMarkdown(res.output);
      } catch (e) {
        setError(e instanceof Error ? e.message : "Request failed.");
      } finally {
        setLoading(false);
      }
    },
    [draft.topicId, onFlashcardsReady, text],
  );

  return (
    <div className="flex h-full min-h-0 flex-col gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-5">
      <div>
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          AI copilot
        </p>
        <p className="mt-1 text-sm text-zinc-400">
          Runs against your saved draft fields using Gemini routes already wired in the app.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ACTIONS.map((a) => (
          <button
            key={a.id}
            type="button"
            disabled={loading}
            onClick={() => run(a.id)}
            className="min-h-[4.25rem] rounded-xl border border-zinc-800/90 bg-zinc-900/40 px-4 py-3 text-left text-sm transition-colors hover:border-cyan-500/35 hover:bg-zinc-900/70 disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
          >
            <span className="font-medium text-zinc-100">{a.label}</span>
            <span className="mt-0.5 block text-xs text-zinc-500">{a.detail}</span>
          </button>
        ))}
      </div>

      <div className="min-h-[200px] flex-1 overflow-y-auto">
        <ResponsePanel
          loading={loading}
          error={error}
          markdown={markdown}
          emptyMessage="Choose an action — output lands here without leaving your notebook context."
        />
      </div>
    </div>
  );
}
