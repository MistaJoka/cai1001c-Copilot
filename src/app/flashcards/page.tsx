"use client";

import { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { Flashcard } from "@/components/flashcard";
import { generateFlashcards } from "@/lib/api-client";
import { addDeckSnapshot } from "@/lib/study-ledger";
import { markActionComplete, setLastStudiedTopic } from "@/lib/local-progress";
import type { FlashcardsResponse } from "@/lib/schemas/flashcards";

const COUNTS = [5, 10, 15] as const;

export default function FlashcardsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <FlashcardsInner />
    </Suspense>
  );
}

function FlashcardsInner() {
  const search = useSearchParams();
  const [topicId, setTopicId] = useState("");
  const [sourceText, setSourceText] = useState("");
  const [count, setCount] = useState<number>(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [deck, setDeck] = useState<FlashcardsResponse | null>(null);

  useEffect(() => {
    const t = search.get("topic");
    if (t) setTopicId(t);
  }, [search]);

  useEffect(() => {
    if (!deck || !topicId) return;
    void addDeckSnapshot({
      topicId,
      cardCount: deck.cards.length,
      topicLabel: deck.topic,
    });
  }, [deck, topicId]);

  const md = useMemo(() => {
    if (!deck) return "";
    const lines = deck.cards.map(
      (c) => `### ${c.type}\n**${c.front}**\n\n${c.back}\n`,
    );
    return `# ${deck.topic}\n\n${lines.join("\n")}`;
  }, [deck]);

  const run = useCallback(async () => {
    if (!topicId) {
      setError("Select a topic.");
      return;
    }
    setError(null);
    setLoading(true);
    setDeck(null);
    try {
      setLastStudiedTopic(topicId);
      const data = await generateFlashcards({
        topic: topicId,
        sourceText: sourceText.trim() || undefined,
        count,
      });
      setDeck(data);
      markActionComplete(topicId, "flashcards");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  }, [topicId, sourceText, count]);

  async function copyMd() {
    if (!md) return;
    await navigator.clipboard.writeText(md);
  }

  return (
    <>
      <PageHeader
        title="Flashcards"
        description="Structured JSON from Gemini, rendered as flip cards. Copy as Markdown for Notion or Obsidian."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <label className="block text-xs font-medium text-zinc-500">
            Topic
            <select
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              value={topicId}
              onChange={(e) => setTopicId(e.target.value)}
            >
              <option value="">Select…</option>
              {courseTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-zinc-500">
            Optional source text
            <textarea
              className="mt-1 min-h-24 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
              placeholder="Paste lecture snippet…"
            />
          </label>

          <div className="flex flex-wrap gap-2">
            {COUNTS.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCount(c)}
                className={`rounded-xl border px-3 py-1.5 text-xs font-medium ${
                  count === c
                    ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200"
                    : "border-zinc-700 text-zinc-300"
                }`}
              >
                {c} cards
              </button>
            ))}
          </div>

          <button
            type="button"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            onClick={run}
            disabled={loading}
          >
            Generate
          </button>

          {deck ? (
            <button
              type="button"
              className="ml-2 rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-200"
              onClick={copyMd}
            >
              Copy as Markdown
            </button>
          ) : null}
        </div>

        <ResponsePanel
          loading={loading}
          error={error}
          emptyMessage="Generated deck shows here."
        >
          {deck ? (
            <div className="space-y-3">
              <p className="text-sm font-medium text-zinc-200">{deck.topic}</p>
              <div className="grid max-h-[70vh] gap-3 overflow-y-auto pr-1 sm:grid-cols-1">
                {deck.cards.map((c, i) => (
                  <Flashcard key={`${c.front}-${i}`} card={c} />
                ))}
              </div>
            </div>
          ) : null}
        </ResponsePanel>
      </div>
    </>
  );
}
