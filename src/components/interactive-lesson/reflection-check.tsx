"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { ReflectionCheckStep } from "@/lib/interactive-lesson/types";

type Props = {
  step: ReflectionCheckStep;
  onGateChange?: (allowed: boolean) => void;
};

const DEFAULT_MIN = 10;

/**
 * Open reflection gate — correctness is length-only for MVP reliability.
 *
 * TODO(Gemini): optional empathic tutor reply surfaced after learner commits sentence.
 */
export function ReflectionCheck({ step, onGateChange }: Props) {
  const min = typeof step.minChars === "number" ? step.minChars : DEFAULT_MIN;

  const [text, setText] = useState("");

  const okLength = text.trim().length >= min && min >= 0;

  const hint = useMemo(
    () => `Write at least ${min} characters to continue.`,
    [min],
  );

  useEffect(() => {
    setText("");
    onGateChange?.(false);
  }, [step.id, onGateChange]);

  useEffect(() => {
    if (step.requireCorrect) {
      onGateChange?.(okLength);
      return;
    }
    /* Exploratory lesson: typing enough still unlocks continuity */
    onGateChange?.(okLength);
  }, [okLength, step.requireCorrect, onGateChange]);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <p className="text-sm leading-relaxed text-zinc-200">{step.prompt}</p>
      <p className="mt-3 text-xs text-zinc-500">{hint}</p>

      <label className="mt-4 block">
        <span className="sr-only">Reflection</span>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={4}
          className="w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 transition-shadow focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 aria-invalid:border-rose-500/40 aria-invalid:bg-rose-950/20"
          aria-invalid={!okLength}
        />
      </label>

      {step.coachNote ? (
        <p className="mt-4 border-t border-zinc-800 pt-4 text-xs text-zinc-500">
          Tip: {step.coachNote}
        </p>
      ) : null}

      {okLength ? (
        <motion.p
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-3 text-xs font-medium text-emerald-400/90"
          role="status"
        >
          Locked in — tap Next when you are ready.
        </motion.p>
      ) : null}
    </div>
  );
}
