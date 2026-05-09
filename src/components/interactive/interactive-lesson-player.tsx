"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
} from "framer-motion";
import type {
  BrilliantLessonStep,
  SortInteraction,
} from "@/data/interactiveBrilliantLesson";
import { MatchActivity } from "@/components/interactive/match-activity";
import { MultipleChoiceCheckpoint } from "@/components/interactive/multiple-choice-checkpoint";
import { SortActivity } from "@/components/interactive/sort-activity";
import { TrueFalseCheckpoint } from "@/components/interactive/true-false-checkpoint";

type Props = {
  steps: readonly BrilliantLessonStep[];
};

function scrambleIds(ids: string[], salt: string): string[] {
  const arr = [...ids];
  let h = 0;
  for (let i = 0; i < salt.length; i++) {
    h = (h * 31 + salt.charCodeAt(i)) >>> 0;
  }
  for (let i = arr.length - 1; i > 0; i--) {
    h = (h * 1664525 + 1013904223) >>> 0;
    const j = h % (i + 1);
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr;
}

function initialSortOrder(interaction: SortInteraction): string[] {
  const ids = interaction.items.map((item: { id: string }) => item.id);
  const salt = `${interaction.correctOrder.join("-")}-v1`;
  let order = scrambleIds(ids, salt);
  let guard = 0;
  while (
    JSON.stringify(order) === JSON.stringify(interaction.correctOrder) &&
    guard++ < 12
  ) {
    order = [...order].reverse();
  }
  return order;
}

function emptyMatchState(leftIds: string[]): Record<string, string> {
  return Object.fromEntries(leftIds.map((id) => [id, ""]));
}

function validateStep(
  step: BrilliantLessonStep,
  mc: string | null,
  tf: boolean | null,
  sortOrder: string[],
  match: Record<string, string>,
): boolean {
  const x = step.interaction;
  switch (x.type) {
    case "multiple-choice":
      return mc === x.correctId;
    case "true-false":
      return tf === x.correct;
    case "sort":
      return JSON.stringify(sortOrder) === JSON.stringify(x.correctOrder);
    case "match":
      return x.left.every((l) => match[l.id] === x.correct[l.id]);
    default:
      return false;
  }
}

export function InteractiveLessonPlayer({ steps }: Props) {
  const reduceMotion = Boolean(useReducedMotion());
  const [stepIndex, setStepIndex] = useState(0);
  const [attemptKey, setAttemptKey] = useState(0);
  const [hintOpen, setHintOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [correct, setCorrect] = useState<boolean | null>(null);

  const [mc, setMc] = useState<string | null>(null);
  const [tf, setTf] = useState<boolean | null>(null);
  const [sortOrder, setSortOrder] = useState<string[]>([]);
  const [match, setMatch] = useState<Record<string, string>>({});

  const step = steps[stepIndex];
  const finished = stepIndex >= steps.length;
  const isLast = stepIndex === steps.length - 1;

  useEffect(() => {
    const current = steps[stepIndex];
    if (!current) return;
    setHintOpen(false);
    setSubmitted(false);
    setCorrect(null);
    setMc(null);
    setTf(null);
    setMatch(
      current.interaction.type === "match"
        ? emptyMatchState(current.interaction.left.map((l) => l.id))
        : {},
    );
    if (current.interaction.type === "sort") {
      setSortOrder(initialSortOrder(current.interaction));
    } else {
      setSortOrder([]);
    }
  }, [stepIndex, attemptKey, steps]);

  const canCheck = useMemo(() => {
    if (!step) return false;
    const x = step.interaction;
    switch (x.type) {
      case "multiple-choice":
        return mc != null;
      case "true-false":
        return tf != null;
      case "sort":
        return sortOrder.length === x.items.length;
      case "match":
        return x.left.every((l) => match[l.id]);
      default:
        return false;
    }
  }, [step, mc, tf, sortOrder, match]);

  const checkAnswer = useCallback(() => {
    if (!step || !canCheck) return;
    const ok = validateStep(step, mc, tf, sortOrder, match);
    setSubmitted(true);
    setCorrect(ok);
  }, [step, canCheck, mc, tf, sortOrder, match]);

  const tryAgain = useCallback(() => {
    setAttemptKey((k) => k + 1);
    setSubmitted(false);
    setCorrect(null);
    setHintOpen(false);
  }, []);

  const continueNext = useCallback(() => {
    if (!correct) return;
    setStepIndex((i) => i + 1);
    setAttemptKey(0);
  }, [correct]);

  const restartLesson = useCallback(() => {
    setStepIndex(0);
    setAttemptKey((k) => k + 1);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Enter" || e.ctrlKey || e.metaKey || e.altKey || e.shiftKey)
        return;
      const t = e.target as HTMLElement | null;
      if (t?.closest("textarea")) return;
      if (finished) return;
      if (submitted && correct) return;
      if (submitted && !correct) return;
      if (!canCheck || submitted) return;
      e.preventDefault();
      checkAnswer();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [canCheck, submitted, correct, checkAnswer, finished]);

  if (finished) {
    return (
      <motion.div
        role="status"
        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: reduceMotion ? 0 : 0.35 }}
        className="rounded-2xl border border-emerald-500/25 bg-emerald-500/5 px-6 py-10 text-center"
      >
        <p className="text-lg font-semibold text-emerald-100">
          Lesson complete
        </p>
        <p className="mt-2 text-sm text-zinc-400">
          You finished all checkpoints — revisit any topic from the Topic Map when
          you study for exams.
        </p>
        <button
          type="button"
          onClick={restartLesson}
          className="mt-6 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          Start again from step 1
        </button>
      </motion.div>
    );
  }

  const transition = {
    duration: reduceMotion ? 0 : 0.32,
    ease: [0.22, 1, 0.36, 1] as const,
  };

  return (
    <div className="w-full space-y-6">
      {/* Progress */}
      <nav aria-label="Lesson progress">
        <ol className="flex flex-wrap items-center gap-2">
          {steps.map((s, i) => {
            const done = i < stepIndex;
            const current = i === stepIndex;
            return (
              <li key={s.id} className="flex items-center gap-2">
                <span
                  className={`flex h-8 min-w-8 items-center justify-center rounded-full border text-xs font-semibold tabular-nums ${
                    done
                      ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-200"
                      : current
                        ? "border-cyan-500/50 bg-cyan-500/15 text-cyan-200"
                        : "border-zinc-800 bg-zinc-950 text-zinc-600"
                  }`}
                  aria-current={current ? "step" : undefined}
                  title={s.unitLabel}
                >
                  {done ? "✓" : i + 1}
                </span>
                {i < steps.length - 1 ? (
                  <span
                    className={`hidden h-px w-6 sm:block ${
                      done ? "bg-emerald-500/40" : "bg-zinc-800"
                    }`}
                    aria-hidden
                  />
                ) : null}
              </li>
            );
          })}
        </ol>
        <motion.div
          className="mt-3 h-1 overflow-hidden rounded-full bg-zinc-800"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={steps.length}
          aria-valuenow={stepIndex + 1}
          aria-label="Progress through lesson steps"
          initial={false}
          animate={{
            opacity: 1,
          }}
        >
          <motion.div
            className="h-full rounded-full bg-cyan-500/70"
            initial={false}
            animate={{
              width: `${((stepIndex + 1) / steps.length) * 100}%`,
            }}
            transition={{ type: "spring", stiffness: 120, damping: 22 }}
          />
        </motion.div>
      </nav>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${step.id}-${attemptKey}`}
          role="region"
          aria-labelledby="lesson-step-title"
          initial={reduceMotion ? false : { opacity: 0, x: 14 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, x: -10 }}
          transition={transition}
          className="grid gap-6 lg:grid-cols-5 lg:gap-8"
        >
          {/* Concept card */}
          <div className="rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/55 to-zinc-950/80 p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.35)] sm:p-6 lg:col-span-2">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-cyan-400/85">
              {step.unitLabel}
            </p>
            <h2
              id="lesson-step-title"
              className="mt-2 text-lg font-semibold tracking-tight text-zinc-50"
            >
              {step.conceptTitle}
            </h2>
            <p className="prose-reading mt-3 text-sm leading-relaxed text-zinc-400">
              {step.conceptBody}
            </p>
          </div>

          {/* Interaction column */}
          <div className="space-y-5 lg:col-span-3">
            <div>
              <h3 className="text-sm font-semibold text-zinc-200">
                {step.questionPrompt}
              </h3>
              <div className="mt-4">
                {step.interaction.type === "multiple-choice" ? (
                  <MultipleChoiceCheckpoint
                    name={step.id}
                    options={step.interaction.options}
                    value={mc}
                    onChange={setMc}
                    disabled={submitted}
                    showResults={submitted}
                    correctId={step.interaction.correctId}
                  />
                ) : null}
                {step.interaction.type === "true-false" ? (
                  <TrueFalseCheckpoint
                    value={tf}
                    onChange={setTf}
                    disabled={submitted}
                    showResults={submitted}
                    correct={step.interaction.correct}
                  />
                ) : null}
                {step.interaction.type === "sort" ? (
                  <SortActivity
                    items={step.interaction.items}
                    order={sortOrder}
                    onReorder={setSortOrder}
                    disabled={submitted}
                    showResults={submitted}
                    correctOrder={step.interaction.correctOrder}
                  />
                ) : null}
                {step.interaction.type === "match" ? (
                  <MatchActivity
                    left={step.interaction.left}
                    right={step.interaction.right}
                    value={match}
                    onChange={setMatch}
                    disabled={submitted}
                    showResults={submitted}
                    correct={step.interaction.correct}
                  />
                ) : null}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setHintOpen((o) => !o)}
                className="min-h-11 rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
                aria-expanded={hintOpen}
              >
                {hintOpen ? "Hide hint" : "Show hint"}
              </button>
              {!submitted ? (
                <button
                  type="button"
                  onClick={checkAnswer}
                  disabled={!canCheck}
                  className="min-h-11 rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
                >
                  Check answer
                </button>
              ) : null}
              {submitted && !correct ? (
                <button
                  type="button"
                  onClick={tryAgain}
                  className="min-h-11 rounded-xl border border-amber-500/40 bg-amber-500/10 px-5 py-2.5 text-sm font-semibold text-amber-100 hover:bg-amber-500/15 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-amber-400/70"
                >
                  Try again
                </button>
              ) : null}
              {submitted && correct ? (
                <button
                  type="button"
                  onClick={continueNext}
                  className="min-h-11 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-emerald-300"
                >
                  {isLast ? "Finish lesson" : "Continue"}
                </button>
              ) : null}
            </div>

            <AnimatePresence initial={false}>
              {hintOpen ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={reduceMotion ? undefined : { opacity: 0, height: 0 }}
                  transition={transition}
                  className="overflow-hidden rounded-xl border border-indigo-500/25 bg-indigo-500/5 px-4 py-3 text-sm text-indigo-100/95"
                  role="note"
                >
                  <span className="font-semibold text-indigo-200">Hint: </span>
                  {step.hint}
                </motion.div>
              ) : null}
            </AnimatePresence>

            <AnimatePresence initial={false}>
              {submitted && correct !== null ? (
                <motion.div
                  initial={reduceMotion ? false : { opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={transition}
                  aria-live="polite"
                  className={`rounded-xl border px-4 py-4 text-sm leading-relaxed ${
                    correct
                      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-50"
                      : "border-rose-500/40 bg-rose-500/10 text-rose-50"
                  }`}
                >
                  <p className="flex items-start gap-2 font-semibold">
                    <span aria-hidden className="mt-0.5">
                      {correct ? "✓" : "✗"}
                    </span>
                    <span>{correct ? "Correct." : "Not quite."}</span>
                  </p>
                  <p className="mt-2 text-zinc-200/95">
                    {correct ? step.explainCorrect : step.explainIncorrect}
                  </p>
                </motion.div>
              ) : null}
            </AnimatePresence>

            <p className="text-xs text-zinc-600">
              Tip: press{" "}
              <kbd className="rounded border border-zinc-700 bg-zinc-900 px-1.5 py-0.5 font-mono text-zinc-400">
                Enter
              </kbd>{" "}
              to check when an answer is ready (outside text fields).
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
