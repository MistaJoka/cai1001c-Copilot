"use client";

import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { MultipleChoiceStep } from "@/lib/interactive-lesson/types";
import { MasteryFeedback } from "@/components/interactive-lesson/mastery-feedback";

type Props = {
  step: MultipleChoiceStep;
  onGateChange?: (allowed: boolean) => void;
  onResult?: (correct: boolean) => void;
};

export function MultipleChoiceCard({ step, onGateChange, onResult }: Props) {
  const single = step.correctOptionIds.length <= 1;
  const sortedCorrect = useMemo(
    () => [...step.correctOptionIds].sort().join("|"),
    [step.correctOptionIds],
  );

  const [selected, setSelected] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setSelected([]);
    setSubmitted(false);
    onGateChange?.(false);
  }, [step.id, step.requireCorrect, onGateChange]);

  const pick = (id: string) => {
    if (single) {
      setSelected([id]);
    } else {
      setSelected((prev) =>
        prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
      );
    }
  };

  const check = () => {
    const key = [...selected].sort().join("|");
    const correct = key === sortedCorrect && selected.length > 0;
    setSubmitted(true);
    onResult?.(correct);
    if (!step.requireCorrect) onGateChange?.(true);
    else if (correct) onGateChange?.(true);
    else {
      onGateChange?.(false);
    }
  };

  const feedback =
    submitted &&
    ((!step.requireCorrect && selected.length > 0) || step.requireCorrect)
      ? [...selected].sort().join("|") === sortedCorrect
        ? ("correct" as const)
        : ("incorrect" as const)
      : null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <p className="text-sm leading-relaxed text-zinc-200">{step.question}</p>
        <fieldset className="mt-4 flex flex-col gap-2" name={`lesson-mc-${step.id}`}>
        <legend className="sr-only">Answer choices</legend>
        {step.options.map((opt) => {
          const checked = selected.includes(opt.id);
          return (
            <motion.button
              key={opt.id}
              type="button"
              onClick={() => pick(opt.id)}
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.985 }}
              className={`rounded-xl border px-3 py-3 text-left text-sm transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                checked
                  ? "border-cyan-500/60 bg-cyan-500/10 text-cyan-50"
                  : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-600"
              }`}
              role={single ? "radio" : "checkbox"}
              aria-checked={checked}
            >
              {opt.label}
            </motion.button>
          );
        })}
      </fieldset>
      {selected.length ? (
        <motion.button
          type="button"
          onClick={check}
          className="mt-4 w-full rounded-xl bg-cyan-600 py-3 text-sm font-medium text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:opacity-40"
          whileTap={{ scale: 0.99 }}
          disabled={!selected.length}
        >
          Check answer
        </motion.button>
      ) : null}
      <MasteryFeedback state={step.requireCorrect ? feedback : null} />
    </div>
  );
}
