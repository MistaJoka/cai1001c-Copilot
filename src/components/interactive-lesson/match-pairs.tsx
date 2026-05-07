"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { MatchPairsStep } from "@/lib/interactive-lesson/types";
import { MasteryFeedback } from "@/components/interactive-lesson/mastery-feedback";

type Props = {
  step: MatchPairsStep;
  onGateChange?: (allowed: boolean) => void;
  onResult?: (correct: boolean) => void;
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function pairsCanonical(
  mapping: Record<string, string>,
  expected: MatchPairsStep["pairs"],
): boolean {
  if (expected.length === 0) return false;
  for (const p of expected) {
    if (mapping[p.leftId] !== p.rightId) return false;
  }
  const rights = Object.values(mapping).filter((v): v is string => Boolean(v));
  const uniqueRights = new Set(rights);
  return rights.length === expected.length && uniqueRights.size === expected.length;
}

/**
 * Click-to-match (keyboard-accessible buttons). Brilliant-style tactile pairing without cloning another product’s UX.
 *
 * TODO: Optional drag-lines between paired nodes via dnd-kit for advanced lessons.
 * TODO(Gemini): scaffold incorrect pair rationale when learner checks wrong answers.
 */
export function MatchPairs({ step, onGateChange, onResult }: Props) {
  const [leftOrder, setLeftOrder] = useState<string[]>(() =>
    [...step.left.map((l) => l.id)].sort(),
  );
  const [rightOrder, setRightOrder] = useState<string[]>(() =>
    [...step.right.map((r) => r.id)].sort(),
  );
  const [selectedLeft, setSelectedLeft] = useState<string | null>(null);
  const [pairs, setPairs] = useState<Record<string, string>>({});
  const [checked, setChecked] = useState(false);

  const reset = useCallback(() => {
    setSelectedLeft(null);
    setPairs({});
    setChecked(false);
    onGateChange?.(false);
  }, [onGateChange]);

  useEffect(() => {
    setLeftOrder(shuffle(step.left.map((l) => l.id)));
    setRightOrder(shuffle(step.right.map((r) => r.id)));
    reset();
  }, [step, reset]);

  const labelsLeft = useMemo(() => new Map(step.left.map((x) => [x.id, x.label])), [step.left]);
  const labelsRight = useMemo(
    () => new Map(step.right.map((x) => [x.id, x.label])),
    [step.right],
  );

  const onPickLeft = (id: string) => {
    setChecked(false);
    setSelectedLeft((prev) => (prev === id ? null : id));
    if (step.requireCorrect) onGateChange?.(false);
  };

  const onPickRight = (id: string) => {
    if (!selectedLeft) return;
    setChecked(false);
    setPairs((p) => ({ ...p, [selectedLeft]: id }));
    setSelectedLeft(null);
    if (step.requireCorrect) onGateChange?.(false);
  };

  const verified = (): boolean =>
    pairsCanonical(pairs, step.pairs) && step.pairs.length > 0;

  const verify = () => {
    setChecked(true);
    const ok = verified();
    onResult?.(ok);
    if (!step.requireCorrect) {
      onGateChange?.(true);
      return;
    }
    if (ok) onGateChange?.(true);
    else onGateChange?.(false);
  };

  const feedback =
    checked && step.requireCorrect
      ? verified()
        ? ("correct" as const)
        : ("incorrect" as const)
      : checked && !step.requireCorrect
        ? ("correct" as const)
        : null;

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      {step.instructions ? (
        <p className="text-sm text-zinc-300">{step.instructions}</p>
      ) : null}

      <p className="mt-4 text-xs text-zinc-500">
        Tap a concept, then tap its matching description. Swap by selecting a different pair on the left.
      </p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2">
        <div>
          <h3 className="text-xs font-semibold uppercase text-zinc-500">Ideas</h3>
          <div className="mt-3 flex flex-col gap-2" role="group" aria-label="Match left concepts">
            {leftOrder.map((id) => {
              const active = selectedLeft === id;
              const pairedRight = pairs[id];
              return (
                <motion.button
                  key={id}
                  type="button"
                  onClick={() => onPickLeft(id)}
                  aria-pressed={active}
                  whileTap={{ scale: 0.99 }}
                  className={`rounded-xl border px-3 py-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
                    active
                      ? "border-cyan-500/70 bg-cyan-500/15 text-cyan-50"
                      : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-600"
                  }`}
                >
                  <span className="block font-medium">{labelsLeft.get(id)}</span>
                  {pairedRight ? (
                    <span className="mt-1 block text-xs text-cyan-400/90">
                      → {labelsRight.get(pairedRight)}
                    </span>
                  ) : null}
                </motion.button>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-semibold uppercase text-zinc-500">Descriptions</h3>
          <div className="mt-3 flex flex-col gap-2" role="group" aria-label="Match right descriptions">
            {rightOrder.map((id) => (
              <motion.button
                key={id}
                type="button"
                disabled={!selectedLeft}
                onClick={() => onPickRight(id)}
                whileTap={{ scale: selectedLeft ? 0.99 : 1 }}
                aria-disabled={!selectedLeft}
                className={`rounded-xl border px-3 py-3 text-left text-sm focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 disabled:opacity-35 ${
                  !selectedLeft
                    ? "border-zinc-800 bg-zinc-950/80 text-zinc-500"
                    : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-cyan-500/35"
                }`}
              >
                {labelsRight.get(id)}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <motion.button
          type="button"
          onClick={verify}
          className="rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          whileTap={{ scale: 0.99 }}
          disabled={
            Object.values(pairs).filter(Boolean).length !== step.pairs.length
          }
        >
          Check pairs
        </motion.button>
        <button
          type="button"
          onClick={() => {
            reset();
          }}
          className="rounded-xl border border-zinc-700 px-4 py-2.5 text-sm text-zinc-300 hover:bg-zinc-900"
        >
          Clear
        </button>
      </div>

      <MasteryFeedback state={step.requireCorrect ? feedback : checked ? feedback : null} />
    </div>
  );
}
