"use client";

import Link from "next/link";
import { EmptyState } from "@/components/layouts/empty-state";
import type { CourseTopic } from "@/data/courseTopics";
import type { ProgressMap } from "@/types";
import {
  estimatedMinutesForLesson,
  lessonRowStatus,
  statusDisplay,
  topicMasteryPct,
} from "@/lib/master-detail-utils";

type Props = {
  topic: CourseTopic | null;
  progress: ProgressMap;
  showBack: boolean;
  onBack: () => void;
};

export function LessonDetailPane({ topic, progress, showBack, onBack }: Props) {
  if (!topic) {
    return (
      <div className="flex min-h-[min(44dvh,420px)] flex-col justify-center px-4 py-10 sm:px-8 lg:min-h-[calc(100dvh-14rem)]">
        <EmptyState
          title="No lesson selected"
          description="Pick a topic from the list to load objectives, vocabulary, practice links, and tutor shortcuts."
        />
      </div>
    );
  }

  const status = lessonRowStatus(topic.id, progress);
  const meta = statusDisplay(status);
  const mastery = topicMasteryPct(topic.id, progress);
  const est = estimatedMinutesForLesson(topic.category, topic.id);
  const tq = encodeURIComponent(topic.id);

  const actions = [
    {
      label: "Study run",
      href: `/study-run?topic=${tq}`,
      hint: "Guided gap → quiz → cards",
    },
    {
      label: "Gap check",
      href: `/gap-check?topic=${tq}`,
      hint: "Explain cold",
    },
    {
      label: "Interactive lab",
      href: "/learn/interactive",
      hint: "Structured drills",
    },
    {
      label: "Full topic brief",
      href: `/topics/${topic.id}`,
      hint: "Deep catalog page",
    },
  ] as const;

  return (
    <div className="flex min-h-0 flex-col lg:max-h-[calc(100dvh-12rem)] lg:overflow-y-auto">
      <header className="sticky top-0 z-10 border-b border-zinc-800/90 bg-zinc-950/90 px-4 py-4 backdrop-blur-md sm:px-6">
        <div className="flex flex-wrap items-start gap-3">
          {showBack ? (
            <button
              type="button"
              onClick={onBack}
              className="min-h-11 rounded-xl border border-zinc-700 px-4 py-2.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800/80 lg:hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
            >
              ← Back to list
            </button>
          ) : null}
          <div className="min-w-0 flex-1">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/85">
              {topic.category}
            </p>
            <h2 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl">
              {topic.title}
            </h2>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-zinc-500">
              <span
                className="rounded-md border border-zinc-700 bg-zinc-900/50 px-2 py-1 font-medium text-zinc-300"
                title={meta.hint}
              >
                {meta.label}
              </span>
              <span aria-hidden>·</span>
              <span>~{est} min estimated</span>
              <span aria-hidden>·</span>
              <span className="tabular-nums">Mastery {mastery}%</span>
            </div>
          </div>
        </div>
      </header>

      <div className="space-y-8 px-4 py-6 sm:px-6">
        <section aria-labelledby="obj-heading">
          <h3
            id="obj-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Learning objectives
          </h3>
          <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm leading-relaxed text-zinc-300">
            {topic.examFocus.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ol>
        </section>

        <section aria-labelledby="sum-heading">
          <h3
            id="sum-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Summary
          </h3>
          <p className="prose-reading mt-3 text-sm leading-relaxed text-zinc-400">
            {topic.description}
          </p>
        </section>

        <section aria-labelledby="voc-heading">
          <h3
            id="voc-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Key vocabulary
          </h3>
          <ul className="mt-3 flex flex-wrap gap-2">
            {topic.keyTerms.map((term) => (
              <li
                key={term}
                className="rounded-lg border border-zinc-800 bg-zinc-900/40 px-2.5 py-1 text-xs text-zinc-300"
              >
                {term}
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="practice-heading">
          <h3
            id="practice-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Practice actions
          </h3>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {actions.map((a) => (
              <li key={a.href}>
                <Link
                  href={a.href}
                  className="flex min-h-[4.25rem] flex-col justify-center rounded-xl border border-zinc-800/90 bg-zinc-900/35 px-4 py-3.5 text-sm font-medium text-cyan-200 hover:border-cyan-500/35 hover:bg-zinc-900/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
                >
                  {a.label}
                  <span className="mt-1 text-xs font-normal text-zinc-500">
                    {a.hint}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>

        <section aria-labelledby="assess-heading">
          <h3
            id="assess-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Related assessments
          </h3>
          <div className="mt-3 flex flex-wrap gap-3">
            <Link
              href={`/quiz?topic=${tq}&count=5`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              Related quiz
            </Link>
            <Link
              href={`/flashcards?topic=${tq}`}
              className="inline-flex min-h-11 items-center justify-center rounded-xl border border-zinc-700 px-5 py-3 text-sm font-medium text-zinc-200 hover:border-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
            >
              Related flashcards
            </Link>
          </div>
        </section>

        <section aria-labelledby="ai-heading">
          <h3
            id="ai-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Ask AI about this lesson
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Opens the tutor workspace with this topic id and an explain-style hint.
          </p>
          <Link
            href={`/ai-tutor?topic=${tq}`}
            className="mt-4 inline-flex min-h-11 items-center justify-center rounded-xl border border-indigo-500/35 bg-indigo-500/10 px-5 py-3 text-sm font-semibold text-indigo-100 hover:bg-indigo-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-400/70"
          >
            Open AI tutor
          </Link>
        </section>

        {topic.examples.length ? (
          <section aria-labelledby="ex-heading">
            <h3
              id="ex-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
            >
              Examples
            </h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-zinc-400">
              {topic.examples.map((ex) => (
                <li key={ex}>{ex}</li>
              ))}
            </ul>
          </section>
        ) : null}
      </div>
    </div>
  );
}
