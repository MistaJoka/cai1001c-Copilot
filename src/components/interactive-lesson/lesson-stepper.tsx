"use client";

import { motion } from "framer-motion";

type Props = {
  stepIndex: number;
  totalSteps: number;
  /** Whether “Next” / “Finish” is allowed right now */
  canAdvance: boolean;
  onBack: () => void;
  onNext: () => void;
  backLabel?: string;
  nextLabel?: string;
  finishLabel?: string;
};

/**
 * Lightweight chrome under the rendered step — gestures stay in widgets above.
 */
export function LessonStepper({
  stepIndex,
  totalSteps,
  canAdvance,
  onBack,
  onNext,
  backLabel = "Back",
  nextLabel = "Next step",
  finishLabel = "Finish lesson",
}: Props) {
  const isLast = totalSteps <= 1 || stepIndex >= totalSteps - 1;
  const nextText = isLast ? finishLabel : nextLabel;

  return (
    <footer className="mt-8 flex flex-col gap-4 border-t border-zinc-800 pt-6 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-zinc-500" aria-live="polite">
        Step {Math.min(stepIndex + 1, Math.max(totalSteps, 1))} of{" "}
        {Math.max(totalSteps, 1)}
        {!canAdvance ? " · complete this step to continue." : ""}
      </p>
      <div className="flex flex-wrap gap-3">
        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          onClick={onBack}
          disabled={stepIndex <= 0}
          className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-900 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
        >
          {backLabel}
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: canAdvance ? 0.99 : 1 }}
          onClick={onNext}
          disabled={!canAdvance}
          className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm hover:bg-cyan-500 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          {nextText}
        </motion.button>
      </div>
    </footer>
  );
}
