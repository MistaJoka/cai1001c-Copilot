"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { MarkdownContent } from "@/components/markdown-content";
import { TeachBackPanel } from "@/components/teach-back-panel";
import {
  AI_TUTOR_COURSE_CONTEXTS,
  topicsForContext,
} from "@/lib/ai-tutor-contexts";
import {
  AI_TUTOR_MODES,
  type TutorModeId,
  getTutorMode,
} from "@/lib/ai-tutor-modes";
import { askStudyBuddy, runTeachBack } from "@/lib/api-client";
import { getTopicById } from "@/data/courseTopics";
import {
  markActionComplete,
  setLastStudiedTopic,
} from "@/lib/local-progress";
import type { TeachBackResponse } from "@/lib/schemas/teachBack";

type ThreadUser = { kind: "user"; id: string; text: string };
type ThreadAssistant = { kind: "assistant"; id: string; markdown: string };
type ThreadTeachBack = { kind: "teachback"; id: string; data: TeachBackResponse };
type ThreadItem = ThreadUser | ThreadAssistant | ThreadTeachBack;

const SUGGESTED_CHIPS = [
  "Explain the difference between automation and machine learning in two sentences.",
  "What should I memorize first for supervised learning?",
  "Give me a teach-back prompt to test whether I understand neural nets.",
  "How does training data quality show up as failure at deployment?",
  "What is one ethics checklist item I should never skip?",
] as const;

function newId(): string {
  return typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : `m-${Date.now()}`;
}

export function AiTutorWorkspace() {
  const searchParams = useSearchParams();
  const threadEndRef = useRef<HTMLDivElement>(null);

  const [contextId, setContextId] = useState<string>(
    AI_TUTOR_COURSE_CONTEXTS[0]?.id ?? "ai-basics",
  );
  const [topicId, setTopicId] = useState<string>("");
  const [modeId, setModeId] = useState<TutorModeId>("explain");
  const [message, setMessage] = useState("");
  const [thread, setThread] = useState<ThreadItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const topicOptions = useMemo(() => topicsForContext(contextId), [contextId]);

  useEffect(() => {
    const t = searchParams.get("topic")?.trim();
    if (!t || !getTopicById(t)) return;
    setTopicId(t);
    const ctx = AI_TUTOR_COURSE_CONTEXTS.find((c) =>
      topicsForContext(c.id).some((x) => x.id === t),
    );
    if (ctx) setContextId(ctx.id);
  }, [searchParams]);

  useEffect(() => {
    if (
      topicId &&
      !topicOptions.some((x) => x.id === topicId)
    ) {
      setTopicId(topicOptions[0]?.id ?? "");
    }
  }, [contextId, topicId, topicOptions]);

  useEffect(() => {
    threadEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [thread, loading]);

  const applyModePreset = useCallback((id: TutorModeId) => {
    const mode = getTutorMode(id);
    if (!mode?.presetMessage) return;
    setMessage((prev) => (prev.trim() ? prev : mode.presetMessage ?? ""));
  }, []);

  const send = useCallback(async () => {
    const trimmed = message.trim();
    if (!trimmed || loading) return;
    const mode = getTutorMode(modeId);
    if (!mode) return;

    setError(null);
    setLoading(true);
    const userMsg: ThreadUser = {
      kind: "user",
      id: newId(),
      text: trimmed,
    };
    setThread((prev) => [...prev, userMsg]);
    setMessage("");

    try {
      if (topicId) {
        setLastStudiedTopic(topicId);
      }

      if (mode.channel === "teach-back") {
        const data = await runTeachBack({
          message: trimmed,
          topic: topicId || undefined,
        });
        setThread((prev) => [
          ...prev,
          { kind: "teachback", id: newId(), data },
        ]);
        if (topicId && mode.progressAction) {
          markActionComplete(topicId, mode.progressAction);
        }
      } else {
        const { output } = await askStudyBuddy({
          message: trimmed,
          topic: topicId || undefined,
          action: mode.buddyAction,
        });
        setThread((prev) => [
          ...prev,
          { kind: "assistant", id: newId(), markdown: output },
        ]);
        if (topicId && mode.progressAction) {
          markActionComplete(topicId, mode.progressAction);
        }
      }
    } catch (e) {
      const msg =
        e instanceof Error ? e.message : "Something went wrong. Try again.";
      setError(msg);
      setThread((prev) => [
        ...prev,
        {
          kind: "assistant",
          id: newId(),
          markdown: `**Could not reach the tutor**\n\n${msg}`,
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [loading, message, modeId, topicId]);

  const topicQuery = topicId
    ? `?topic=${encodeURIComponent(topicId)}`
    : "";

  return (
    <div className="flex min-w-0 flex-col gap-6 lg:grid lg:grid-cols-[minmax(0,1fr)_280px] lg:items-start lg:gap-8">
      <section
        className="flex min-h-[70dvh] flex-1 flex-col rounded-2xl border border-zinc-800/90 bg-zinc-950/40 lg:min-h-[calc(100dvh-14rem)]"
        aria-label="AI tutor chat"
      >
        <div className="border-b border-zinc-800/80 px-4 py-4 sm:px-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-end">
            <label className="block min-w-[160px] flex-1 text-xs font-medium text-zinc-500">
              Course context
              <select
                value={contextId}
                onChange={(e) => {
                  setContextId(e.target.value);
                  setTopicId("");
                }}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
              >
                {AI_TUTOR_COURSE_CONTEXTS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="block min-w-[200px] flex-1 text-xs font-medium text-zinc-500">
              Topic (optional)
              <select
                value={topicId}
                onChange={(e) => setTopicId(e.target.value)}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
              >
                <option value="">General — no catalog topic id</option>
                {topicOptions.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.title}
                  </option>
                ))}
              </select>
            </label>
            <label className="block w-full text-xs font-medium text-zinc-500 sm:min-w-[220px] sm:flex-1">
              Mode
              <select
                value={modeId}
                onChange={(e) => {
                  const id = e.target.value as TutorModeId;
                  setModeId(id);
                  applyModePreset(id);
                }}
                className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
              >
                {AI_TUTOR_MODES.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div
            className="mt-3 flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
            role="group"
            aria-label="Suggested modes"
          >
            {AI_TUTOR_MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => {
                  setModeId(m.id);
                  applyModePreset(m.id);
                }}
                className={`shrink-0 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
                  modeId === m.id
                    ? "border-cyan-500/45 bg-cyan-500/15 text-cyan-100"
                    : "border-zinc-700 bg-zinc-900/50 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div
          className="flex flex-1 flex-col overflow-hidden"
          role="log"
          aria-live="polite"
          aria-relevant="additions"
        >
          <div className="flex-1 space-y-4 overflow-y-auto px-4 py-4 sm:px-5">
            {thread.length === 0 && !loading ? (
              <div className="rounded-xl border border-dashed border-zinc-700/90 bg-zinc-950/50 px-4 py-10 text-center">
                <p className="text-sm font-medium text-zinc-300">
                  Tutor workspace
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Pick a course context, optionally bind a catalog topic, choose a
                  mode, then write or tap a suggestion. Responses use your existing
                  Study Buddy / teach-back APIs.
                </p>
              </div>
            ) : null}

            {thread.map((item) =>
              item.kind === "user" ? (
                <div
                  key={item.id}
                  className="ml-auto max-w-[min(100%,42rem)] rounded-2xl border border-cyan-500/25 bg-cyan-500/10 px-4 py-3 text-sm text-cyan-50"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-cyan-400/80">
                    You
                  </p>
                  <p className="mt-1 whitespace-pre-wrap">{item.text}</p>
                </div>
              ) : item.kind === "assistant" ? (
                <div
                  key={item.id}
                  className="mr-auto max-w-[min(100%,48rem)] rounded-2xl border border-zinc-800/90 bg-zinc-900/45 px-4 py-3 text-sm text-zinc-200"
                >
                  <p className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Tutor
                  </p>
                  <div className="prose-reading mt-2 max-w-none prose-invert prose-p:leading-relaxed prose-headings:text-zinc-100 [&_*]:text-inherit">
                    <MarkdownContent content={item.markdown} />
                  </div>
                </div>
              ) : (
                <div key={item.id} className="mr-auto w-full max-w-[min(100%,48rem)]">
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
                    Teach-back review
                  </p>
                  <TeachBackPanel data={item.data} />
                </div>
              ),
            )}

            {loading ? (
              <div
                className="mr-auto flex items-center gap-2 rounded-2xl border border-zinc-800/90 bg-zinc-900/35 px-4 py-3 text-sm text-zinc-400"
                role="status"
              >
                <span
                  className="inline-block h-4 w-4 animate-pulse rounded-full bg-cyan-500/50"
                  aria-hidden
                />
                Waiting for Gemini…
              </div>
            ) : null}

            <div ref={threadEndRef} />
          </div>

          {error ? (
            <div
              className="border-t border-rose-500/25 bg-rose-950/20 px-4 py-2 text-xs text-rose-200"
              role="alert"
            >
              {error}
            </div>
          ) : null}

          <div className="border-t border-zinc-800/80 px-4 py-4 sm:px-5">
            <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-zinc-600">
              Suggested prompts
            </p>
            <div className="mb-3 flex flex-wrap gap-2">
              {SUGGESTED_CHIPS.map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => setMessage(chip)}
                  className="rounded-full border border-zinc-700 bg-zinc-900/50 px-3 py-1.5 text-left text-xs text-zinc-300 hover:border-cyan-500/35 hover:text-cyan-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
                >
                  {chip}
                </button>
              ))}
            </div>
            <label htmlFor="ai-tutor-input" className="sr-only">
              Message to tutor
            </label>
            <textarea
              id="ai-tutor-input"
              rows={3}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Ask in your own words…"
              disabled={loading}
              className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 disabled:opacity-60"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void send();
                }
              }}
            />
            <div className="mt-3 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => void send()}
                disabled={loading || !message.trim()}
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
              >
                Send
              </button>
              <button
                type="button"
                onClick={() => {
                  setThread([]);
                  setError(null);
                }}
                disabled={loading}
                className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-300 hover:bg-zinc-800/80 disabled:opacity-40"
              >
                Clear thread
              </button>
            </div>
            <p className="mt-2 text-[11px] text-zinc-600">
              Shift+Enter for newline. Uses{" "}
              <code className="rounded bg-zinc-900 px-1">/api/gemini/study-buddy</code>{" "}
              and{" "}
              <code className="rounded bg-zinc-900 px-1">/api/gemini/teach-back</code>.
            </p>
          </div>
        </div>
      </section>

      <aside
        className="hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-5 lg:block"
        aria-label="Study actions"
      >
        <h2 className="text-sm font-semibold text-zinc-100">Study actions</h2>
        <p className="mt-1 text-xs leading-relaxed text-zinc-500">
          Jump into structured flows with the same topic context when available.
        </p>
        <ul className="mt-4 space-y-2 text-sm">
          <li>
            <Link
              href={`/gap-check${topicQuery}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-cyan-200 hover:border-cyan-500/30"
            >
              Gap check
            </Link>
          </li>
          <li>
            <Link
              href={
                topicId
                  ? `/quiz?topic=${encodeURIComponent(topicId)}&count=5`
                  : "/quiz"
              }
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-cyan-200 hover:border-cyan-500/30"
            >
              5-question quiz
            </Link>
          </li>
          <li>
            <Link
              href={`/flashcards${topicQuery}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-cyan-200 hover:border-cyan-500/30"
            >
              Flashcards
            </Link>
          </li>
          <li>
            <Link
              href={`/study-run${topicQuery}`}
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-cyan-200 hover:border-cyan-500/30"
            >
              Study run
            </Link>
          </li>
          <li>
            <Link
              href="/notes"
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-cyan-200 hover:border-cyan-500/30"
            >
              Notes builder
            </Link>
          </li>
          <li>
            <Link
              href="/final-exam"
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-cyan-200 hover:border-cyan-500/30"
            >
              Final exam prep
            </Link>
          </li>
          <li>
            <Link
              href="/topics"
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-zinc-300 hover:border-zinc-600"
            >
              Topic map
            </Link>
          </li>
          <li>
            <Link
              href="/study-buddy"
              className="block rounded-xl border border-zinc-800 bg-zinc-900/40 px-3 py-2 text-zinc-400 hover:border-zinc-600"
            >
              Legacy Study Buddy layout
            </Link>
          </li>
        </ul>
      </aside>
    </div>
  );
}
