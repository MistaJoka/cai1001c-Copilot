"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useState } from "react";
import type { SliderSimStep } from "@/lib/interactive-lesson/types";
import { MasteryFeedback } from "@/components/interactive-lesson/mastery-feedback";

type Props = {
  step: SliderSimStep;
  onGateChange?: (allowed: boolean) => void;
  onResult?: (correct: boolean) => void;
};

export function SliderSimulation({ step, onGateChange, onResult }: Props) {
  const stepSz = typeof step.step === "number" && step.step > 0 ? step.step : 1;
  const tol = typeof step.tolerance === "number" ? step.tolerance : 0;

  const clamp = useCallback(
    (n: number) => Math.min(step.max, Math.max(step.min, n)),
    [step.min, step.max],
  );

  const [value, setValue] = useState(() => {
    const raw =
      typeof step.defaultValue === "number"
        ? step.defaultValue
        : Math.round((step.min + step.max) / 2);
    return Math.min(step.max, Math.max(step.min, raw));
  });
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const raw =
      typeof step.defaultValue === "number"
        ? step.defaultValue
        : Math.round((step.min + step.max) / 2);
    setValue(clamp(raw));
    setChecked(false);
    onGateChange?.(false);
  }, [step.id, step.defaultValue, step.min, step.max, onGateChange, clamp]);

  const inRange = Math.abs(Number(value) - step.targetValue) <= tol;

  const verify = () => {
    setChecked(true);
    onResult?.(inRange);
    if (!step.requireCorrect) {
      onGateChange?.(true);
      return;
    }
    if (inRange) onGateChange?.(true);
    else onGateChange?.(false);
  };

  const feedback =
    checked && step.requireCorrect
      ? inRange
        ? ("correct" as const)
        : ("incorrect" as const)
      : checked && !step.requireCorrect
        ? ("correct" as const)
        : null;

  const locked = !!(checked && inRange && step.requireCorrect);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <p className="text-sm leading-relaxed text-zinc-200">{step.question}</p>
      {step.hint ? (
        <p className="mt-2 text-xs italic text-zinc-500">{step.hint}</p>
      ) : null}

      <div className="mt-6">
        <motion.div
          className="mb-4 flex justify-center"
          animate={{ scale: checked && inRange ? [1, 1.03, 1] : 1 }}
          transition={{ duration: 0.35 }}
        >
          <span className="text-4xl tabular-nums font-semibold text-cyan-300">
            {value}
            {step.unit ? (
              <span className="ml-1 text-lg font-normal text-zinc-500">{step.unit}</span>
            ) : null}
          </span>
        </motion.div>

        <label className="block text-xs font-medium text-zinc-500">
          Adjust
          <input
            type="range"
            className="mt-2 block w-full accent-cyan-500 disabled:opacity-45"
            min={step.min}
            max={step.max}
            step={stepSz}
            disabled={locked}
            value={value}
            onChange={(e) => {
              setChecked(false);
              setValue(Number(e.target.value));
              if (step.requireCorrect) onGateChange?.(false);
            }}
            aria-valuemin={step.min}
            aria-valuemax={step.max}
            aria-valuenow={value}
          />
        </label>
      </div>

      {!locked ? (
        <motion.button
          type="button"
          whileTap={{ scale: 0.99 }}
          onClick={verify}
          className="mt-6 w-full rounded-xl bg-cyan-600 py-3 text-sm font-medium text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          Check value
        </motion.button>
      ) : null}
      <MasteryFeedback state={step.requireCorrect ? feedback : checked ? feedback : null} />
    </div>
  );
}
