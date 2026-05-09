"use client";

import Link from "next/link";
import type { CourseTopic } from "@/data/courseTopics";

export type LessonCanvasProps = {
  moduleLabel: string;
  topic: CourseTopic | null;
  secondaryTopic: CourseTopic | null;
  isFinalReview: boolean;
  understanding: string;
  onUnderstandingChange: (value: string) => void;
  onContinue: () => void;
};

export function LessonCanvas({
  moduleLabel,
  topic,
  secondaryTopic,
  isFinalReview,
  understanding,
  onUnderstandingChange,
  onContinue,
}: LessonCanvasProps) {
  const objective =
    topic?.examFocus[0] ??
    (isFinalReview
      ? "Integrate themes across the course and prioritize exam-ready retrieval."
      : "Select a module from the list to load learning objectives from the syllabus.");

  const explanationLead = topic?.description ?? "";
  const contrast =
    secondaryTopic && topic
      ? `Contrast with ${secondaryTopic.title}: ${secondaryTopic.description}`
      : "";

  return (
    <article
      className="flex min-h-0 flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/35 shadow-[0_0_0_1px_rgba(24,24,27,0.35)]"
      aria-labelledby="lesson-title"
    >
      <header className="border-b border-zinc-800/80 px-5 py-5 sm:px-8 sm:py-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/85">
          Active lesson
        </p>
        <h2
          id="lesson-title"
          className="mt-2 text-xl font-semibold tracking-tight text-zinc-50 sm:text-2xl"
        >
          {isFinalReview ? "Course final review" : topic?.title ?? moduleLabel}
        </h2>
        {!isFinalReview && topic ? (
          <p className="mt-1 text-xs text-zinc-500">{topic.category}</p>
        ) : null}
      </header>

      <div className="flex flex-1 flex-col gap-6 px-5 py-6 sm:px-8">
        <section aria-labelledby="objective-heading">
          <h3
            id="objective-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Learning objective
          </h3>
          <p className="prose-reading mt-2 text-sm leading-relaxed text-zinc-300">
            {objective}
          </p>
          {topic && topic.examFocus.length > 1 ? (
            <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-zinc-500">
              {topic.examFocus.slice(1, 4).map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
          ) : null}
        </section>

        <section aria-labelledby="concept-heading">
          <h3
            id="concept-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Concept explanation
          </h3>
          {isFinalReview ? (
            <div className="prose-reading mt-2 space-y-3 text-sm leading-relaxed text-zinc-300">
              <p>
                Use this checkpoint to rotate weak topics: run a short quiz, teach-back one
                idea aloud, then skim notes. Tie ethics, deployment, and modeling vocabulary
                together — exams often bridge units.
              </p>
              <p className="text-zinc-500">
                Jump to{" "}
                <Link href="/review" className="text-cyan-400 hover:text-cyan-300">
                  Review hub
                </Link>{" "}
                or{" "}
                <Link href="/final-exam" className="text-cyan-400 hover:text-cyan-300">
                  Final exam prep
                </Link>{" "}
                when you are ready for longer retrieval blocks.
              </p>
            </div>
          ) : (
            <div className="prose-reading mt-2 space-y-3 text-sm leading-relaxed text-zinc-300">
              {explanationLead ? <p>{explanationLead}</p> : (
                <p className="text-zinc-500">
                  Choose a module on the left to pull syllabus copy from the catalog.
                </p>
              )}
              {secondaryTopic ? (
                <p className="border-l-2 border-indigo-500/40 pl-4 text-zinc-400">
                  {contrast}
                </p>
              ) : null}
              {topic?.keyTerms?.length ? (
                <p className="text-xs text-zinc-500">
                  <span className="font-medium text-zinc-400">Key terms:</span>{" "}
                  {topic.keyTerms.slice(0, 8).join(" · ")}
                </p>
              ) : null}
            </div>
          )}
        </section>

        <section
          className="rounded-xl border border-dashed border-zinc-700/90 bg-zinc-950/50 px-4 py-5"
          aria-labelledby="checkpoint-heading"
        >
          <h3
            id="checkpoint-heading"
            className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
          >
            Interactive checkpoint
          </h3>
          <p className="mt-2 text-sm text-zinc-500">
            Placeholder — MCQ, drag-sort, or lab widget can mount here without changing
            this shell.             Try{" "}
            <Link
              href="/interactive-demo"
              className="font-medium text-cyan-400 hover:text-cyan-300"
            >
              Interactive Lab
            </Link>{" "}
            for live step types.
          </p>
        </section>

        <section aria-labelledby="understand-heading">
          <label htmlFor="understanding-note" className="block">
            <span
              id="understand-heading"
              className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500"
            >
              What I understand
            </span>
            <textarea
              id="understanding-note"
              value={understanding}
              onChange={(e) => onUnderstandingChange(e.target.value)}
              rows={4}
              placeholder="In your own words — what is the core claim of this lesson?"
              className="mt-2 w-full resize-y rounded-xl border border-zinc-700/90 bg-zinc-950 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600"
            />
          </label>
        </section>

        <div className="mt-auto flex flex-wrap gap-3 border-t border-zinc-800/80 pt-6">
          <button
            type="button"
            onClick={onContinue}
            className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-cyan-500"
          >
            Continue
          </button>
          {topic ? (
            <Link
              href={`/topics/${topic.id}`}
              className="rounded-xl border border-zinc-700 px-5 py-2.5 text-sm font-medium text-zinc-200 hover:border-zinc-600"
            >
              Full topic brief
            </Link>
          ) : null}
        </div>
      </div>
    </article>
  );
}
