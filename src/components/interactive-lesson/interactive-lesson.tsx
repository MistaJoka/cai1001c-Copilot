"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useLayoutEffect, useRef, useState } from "react";
import type {
  InteractiveLessonDocument,
  StepResultPayload,
} from "@/lib/interactive-lesson/types";
import { LessonStepper } from "@/components/interactive-lesson/lesson-stepper";
import { MotionShell } from "@/components/interactive-lesson/motion-shell";
import { ProgressPath } from "@/components/interactive-lesson/progress-path";
import { StepRenderer } from "@/components/interactive-lesson/step-renderer";
import { LessonHintPanel } from "@/components/interactive-lesson/lesson-hint-panel";

type Props = {
  lesson: InteractiveLessonDocument;
  /**
   * Mirrors `prefers-reduced-motion` when passed from parent. Shortens lateral step
   * transitions beyond Framer Motion's built-in preference.
   */
  reduceMotionHints?: boolean;
};

export function InteractiveLesson({
  lesson,
  reduceMotionHints = false,
}: Props) {
  const steps = lesson.steps;
  const [index, setIndex] = useState(0);
  const [advance, setAdvance] = useState(false);
  const [finished, setFinished] = useState(false);
  const outcomesRef = useRef<StepResultPayload[]>([]);

  useLayoutEffect(() => {
    setAdvance(false);
  }, [index]);

  useLayoutEffect(() => {
    if (steps.length === 0) setAdvance(true);
  }, [steps.length]);

  const recordOutcome = useCallback((stepId: string, correct?: boolean) => {
    const trimmed = outcomesRef.current.filter((r) => r.stepId !== stepId);
    outcomesRef.current = [...trimmed, { stepId, correct }];
  }, []);

  const restart = () => {
    setIndex(0);
    setAdvance(false);
    setFinished(false);
    outcomesRef.current = [];
  };

  if (steps.length === 0) {
    return (
      <MotionShell>
        <p className="text-sm text-zinc-400">This lesson has no steps yet.</p>
      </MotionShell>
    );
  }

  if (finished) {
    return (
      <MotionShell>
        <motion.div
          role="status"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24 }}
          className="rounded-2xl border border-emerald-500/35 bg-emerald-500/5 p-8 text-center"
        >
          <p className="text-xl font-semibold text-emerald-200">Lesson complete</p>
          <p className="mt-2 text-sm text-zinc-400">
            Nice pace — reinforcement beats endless scrolling.
          </p>
          <button
            type="button"
            onClick={restart}
            className="mt-6 rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          >
            Run again
          </button>
        </motion.div>
      </MotionShell>
    );
  }

  const step = steps[index]!;

  return (
    <MotionShell>
      <article className="mx-auto max-w-2xl" aria-labelledby="interactive-lesson-title">
        <header className="mb-6 border-b border-zinc-800 pb-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
            Guided practice
          </p>
          <h1 id="interactive-lesson-title" className="mt-2 text-2xl font-semibold text-zinc-50">
            {lesson.title}
          </h1>
          {lesson.subtitle ? (
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">{lesson.subtitle}</p>
          ) : null}
        </header>

        <ProgressPath
          total={steps.length}
          currentIndex={index}
          ids={steps.map((s) => s.id)}
        />

        {step.headline ? (
          <p className="mb-4 text-xs font-semibold uppercase tracking-wide text-cyan-500/90">
            {step.headline}
          </p>
        ) : null}

        {step.teaching ? (
          <div className="mb-4 rounded-2xl border border-zinc-800/90 bg-zinc-900/45 px-4 py-3 text-sm leading-relaxed text-zinc-200">
            {step.teaching}
          </div>
        ) : null}

        <AnimatePresence mode="wait">
          <motion.div
            key={step.id}
            initial={{ opacity: 0, x: reduceMotionHints ? 0 : 14 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: reduceMotionHints ? 0 : -12 }}
            transition={{
              duration: reduceMotionHints ? 0.12 : 0.22,
              ease: [0.22, 0.94, 0.36, 1],
            }}
          >
            <StepRenderer
              step={step}
              onGateChange={setAdvance}
              onOutcome={(stepId, correct) => recordOutcome(stepId, correct)}
            />
            {step.coachClose ? (
              <p className="mt-4 rounded-xl border border-zinc-800/60 bg-zinc-950/50 px-3 py-2 text-sm text-zinc-400">
                {step.coachClose}
              </p>
            ) : null}
          </motion.div>
        </AnimatePresence>

        <LessonHintPanel lessonId={lesson.id} step={step} />

        <LessonStepper
          stepIndex={index}
          totalSteps={steps.length}
          canAdvance={advance}
          onBack={() => setIndex((i) => Math.max(0, i - 1))}
          onNext={() => {
            if (index >= steps.length - 1) {
              setFinished(true);
              return;
            }
            setIndex((i) => i + 1);
          }}
        />

      </article>
    </MotionShell>
  );
}
