"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CopilotActionsPanel } from "@/components/notes/copilot-actions-panel";
import { NotebookEditor } from "@/components/notes/notebook-editor";
import { courseTopics } from "@/data/courseTopics";
import {
  createInitialDraft,
  loadNotebookDraft,
  SAMPLE_NOTEBOOK_TOPIC_IDS,
  saveNotebookDraft,
  topicOptionLabel,
} from "@/lib/notebook-copilot-storage";
import type { NotebookDraft } from "@/lib/notebook-copilot-storage";
import type { FlashcardsResponse } from "@/lib/schemas/flashcards";

type MobileTab = "notes" | "copilot" | "flashcards";

const INITIAL_TOPIC = "sample-what-is-ai";

function tabBtn(active: boolean) {
  return `min-h-11 flex-1 rounded-lg px-3 py-2.5 text-sm font-medium transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
    active
      ? "bg-cyan-500/15 text-cyan-100 ring-1 ring-cyan-500/35"
      : "text-zinc-400 hover:bg-zinc-800/60 hover:text-zinc-200"
  }`;
}

export function NotebookCopilotLayout() {
  const [mounted, setMounted] = useState(false);
  const [mobileTab, setMobileTab] = useState<MobileTab>("notes");
  const [draft, setDraft] = useState<NotebookDraft>(() =>
    createInitialDraft(INITIAL_TOPIC),
  );
  const [flashcards, setFlashcards] = useState<FlashcardsResponse | null>(null);

  const topicOptions = useMemo(() => {
    const samples = SAMPLE_NOTEBOOK_TOPIC_IDS.map((id) => ({
      id,
      label: topicOptionLabel(id),
    }));
    const course = courseTopics.map((t) => ({
      id: t.id,
      label: topicOptionLabel(t.id),
    }));
    return [...samples, ...course];
  }, []);

  useEffect(() => {
    const stored = loadNotebookDraft(INITIAL_TOPIC);
    setDraft(stored ?? createInitialDraft(INITIAL_TOPIC));
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const id = window.setTimeout(() => {
      saveNotebookDraft(draft);
    }, 450);
    return () => window.clearTimeout(id);
  }, [draft, mounted]);

  const handleTopicChange = useCallback((nextTopicId: string) => {
    setDraft((prev) => {
      saveNotebookDraft(prev);
      const next = loadNotebookDraft(nextTopicId) ?? createInitialDraft(nextTopicId);
      return next;
    });
    setFlashcards(null);
  }, []);

  const handleDraftChange = useCallback((patch: Partial<NotebookDraft>) => {
    setDraft((d) => ({ ...d, ...patch, topicId: d.topicId }));
  }, []);

  const onFlashcardsReady = useCallback((data: FlashcardsResponse) => {
    setFlashcards(data);
    setMobileTab("flashcards");
  }, []);

  const notesPane = (
    <NotebookEditor
      draft={draft}
      topicOptions={topicOptions}
      onTopicChange={handleTopicChange}
      onDraftChange={handleDraftChange}
    />
  );

  const copilotPane = (
    <CopilotActionsPanel draft={draft} onFlashcardsReady={onFlashcardsReady} />
  );

  const flashcardsPane = (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-5">
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        Flashcards
      </p>
      <p className="mt-1 text-sm text-zinc-400">
        Generated decks from the copilot stay on this device for this session.
        Open the full flashcards experience anytime.
      </p>
      <Link
        href={`/flashcards?topic=${encodeURIComponent(draft.topicId)}`}
        className="mt-4 inline-flex rounded-xl bg-cyan-500/90 px-4 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-cyan-400"
      >
        Open flashcards · {topicOptionLabel(draft.topicId)}
      </Link>
      {!flashcards ? (
        <p className="mt-6 text-sm text-zinc-500">
          Run <strong className="text-zinc-300">Turn into flashcards</strong> in the
          copilot to populate this tab with a quick preview.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {flashcards.cards.map((c, i) => (
            <li
              key={`${c.front}-${i}`}
              className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4"
            >
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                {c.type.replace(/_/g, " ")}
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">{c.front}</p>
              <p className="mt-2 text-sm text-zinc-400">{c.back}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );

  return (
    <div className="space-y-6 sm:space-y-8">
      <div className="hidden min-w-0 lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,440px)] lg:items-start lg:gap-8">
        <div className="min-w-0">{notesPane}</div>
        <div className="sticky top-24 flex max-h-[calc(100vh-8rem)] min-h-[min(560px,calc(100vh-8rem))] flex-col overflow-hidden">
          {copilotPane}
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-5 lg:hidden">
        <div
          className="flex gap-1 rounded-xl border border-zinc-800 bg-zinc-950/60 p-1"
          role="tablist"
          aria-label="Notebook workspace"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "notes"}
            className={tabBtn(mobileTab === "notes")}
            onClick={() => setMobileTab("notes")}
          >
            Notes
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "copilot"}
            className={tabBtn(mobileTab === "copilot")}
            onClick={() => setMobileTab("copilot")}
          >
            AI Copilot
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={mobileTab === "flashcards"}
            className={tabBtn(mobileTab === "flashcards")}
            onClick={() => setMobileTab("flashcards")}
          >
            Flashcards
          </button>
        </div>
        {mobileTab === "notes" ? notesPane : null}
        {mobileTab === "copilot" ? copilotPane : null}
        {mobileTab === "flashcards" ? flashcardsPane : null}
      </div>
    </div>
  );
}
