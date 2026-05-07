"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { PredictRevealStep } from "@/lib/interactive-lesson/types";

type Props = {
  step: PredictRevealStep;
  onGateChange?: (allowed: boolean) => void;
};

/**
 * Prediction box + gated reveal — encourages generation before absorbing the answer.
 *
 * TODO(Gemini): optionally compare learner typing to canonical ideas (soft scoring, Markdown).
 */
export function PredictReveal({ step, onGateChange }: Props) {
  const [prediction, setPrediction] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setPrediction("");
    setOpen(false);
    onGateChange?.(false);
  }, [step.id, onGateChange]);

  const toggleReveal = () => {
    setOpen((o) => {
      const next = !o;
      if (next) onGateChange?.(true);
      else onGateChange?.(false);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <p className="text-sm leading-relaxed text-zinc-200">{step.question}</p>

      <label className="mt-4 block">
        <span className="text-xs font-medium text-zinc-500">Your prediction</span>
        <textarea
          value={prediction}
          onChange={(e) => setPrediction(e.target.value)}
          placeholder={step.placeholder ?? "Write in your own words…"}
          rows={3}
          className="mt-2 w-full resize-y rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400"
        />
      </label>

      <motion.button
        type="button"
        onClick={toggleReveal}
        whileTap={{ scale: 0.98 }}
        className={`mt-4 w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
          open
            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-100"
            : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-600"
        }`}
        aria-expanded={open}
      >
        {open ? "Hide explanation" : "Reveal explanation"}
      </motion.button>

      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="rev"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            {step.revealTitle ? (
              <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-cyan-500/90">
                {step.revealTitle}
              </p>
            ) : null}
            <p className="mt-3 border-t border-zinc-800 pt-3 text-sm leading-relaxed text-zinc-300">
              {step.reveal}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
