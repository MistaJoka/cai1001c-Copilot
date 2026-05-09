"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { MiniSimulationStep } from "@/lib/interactive-lesson/types";

type Props = {
  step: MiniSimulationStep;
  onGateChange?: (allowed: boolean) => void;
  onResult?: (correct: boolean) => void;
};

export function MiniSimulation({ step, onGateChange, onResult }: Props) {
  const [pick, setPick] = useState<string | null>(null);

  useEffect(() => {
    setPick(null);
    onGateChange?.(false);
  }, [step.id, onGateChange]);

  const needsRec = !!(step.requireCorrect && step.recommendedChoiceId);

  const select = (id: string) => {
    setPick(id);

    const okRecommended =
      !step.requireCorrect ||
      !step.recommendedChoiceId ||
      id === step.recommendedChoiceId;

    onResult?.(okRecommended);

    if (!needsRec) {
      onGateChange?.(true);
    } else if (step.recommendedChoiceId && id === step.recommendedChoiceId) {
      onGateChange?.(true);
    } else {
      onGateChange?.(false);
    }
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <h3 className="text-lg font-semibold text-zinc-50">{step.title}</h3>
      {step.description ? (
        <p className="mt-2 text-sm text-zinc-400">{step.description}</p>
      ) : null}

      <div className="mt-5 flex flex-col gap-3" role="group" aria-label="Simulation choices">
        {step.choices.map((c) => {
          const active = pick === c.id;
          const isRec = !!(
            active &&
            step.recommendedChoiceId &&
            c.id === step.recommendedChoiceId
          );

          return (
            <motion.button
              key={c.id}
              type="button"
              onClick={() => select(c.id)}
              aria-pressed={active}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.995 }}
              className={`rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                active && isRec
                  ? "border-emerald-500/50 bg-emerald-500/10 text-emerald-100 shadow-[0_0_0_1px_rgba(16,185,129,0.25)]"
                  : active && !isRec
                    ? "border-amber-500/35 bg-amber-500/5 text-zinc-200"
                    : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-600"
              }`}
            >
              <span className="font-medium">{c.label}</span>
              {active ? (
                <motion.span
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`mt-2 block border-t pt-2 text-xs ${
                    isRec ? "text-emerald-200/95" : "text-zinc-500"
                  }`}
                >
                  {isRec
                    ? outcomeCopy.recommended(step)
                    : outcomeCopy.alt(step, c.id)}
                </motion.span>
              ) : null}
            </motion.button>
          );
        })}
      </div>

    </div>
  );
}

const outcomeCopy = {
  recommended(step: MiniSimulationStep) {
    switch (step.recommendedChoiceId) {
      case "c2":
        return "Linking misses to explanations tightens retrieval — strongest fix-up loop.";
      default:
        return "Solid pick — aligns with spaced practice loops.";
    }
  },
  alt(_step: MiniSimulationStep, choiceId: string) {
    if (choiceId === "c1") return "Guess-only practice rarely moves long-term retention.";
    if (choiceId === "c3")
      return "Letter-chasing fades fast under novel question stems.";
    return "Try contrasting this option with others before moving on.";
  },
};
