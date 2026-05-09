"use client";

import { motion } from "framer-motion";

type Props = {
  total: number;
  currentIndex: number;
  ids: string[];
};

export function ProgressPath({ total, currentIndex, ids }: Props) {
  const pct =
    total <= 1 ? 100 : Math.min(100, Math.round((currentIndex / (total - 1)) * 100));

  return (
    <div className="mb-6">
      <div
        className="mb-2 flex items-center justify-between text-xs font-medium text-zinc-500"
        aria-live="polite"
      >
        <span>
          Step {Math.min(total, currentIndex + 1)} of {total}
        </span>
        <span>{pct}% along path</span>
      </div>
      <div
        className="relative h-2 overflow-hidden rounded-full bg-zinc-800"
        role="progressbar"
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={pct}
        aria-label="Lesson progress"
      >
        <motion.div
          className="absolute inset-y-0 left-0 rounded-full bg-cyan-500/80"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ type: "spring", stiffness: 120, damping: 20 }}
        />
      </div>
      <div className="mt-3 flex gap-1" aria-hidden>
        {ids.map((id, i) => (
          <span
            key={id}
            className={`h-1.5 flex-1 rounded-full ${
              i <= currentIndex ? "bg-cyan-500/50" : "bg-zinc-800"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
