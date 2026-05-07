"use client";

import { AnimatePresence, motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  /** null = hide */
  state: "correct" | "incorrect" | null;
  children?: ReactNode;
};

/**
 * Brief correctness / celebration cue — keep subtle per reduced-motion prefs.
 */
export function MasteryFeedback({ state, children }: Props) {
  return (
    <AnimatePresence>
      {state ? (
        <motion.div
          key={state}
          role="status"
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.2 }}
          className={`mt-4 rounded-xl border px-4 py-3 text-sm font-medium ${
            state === "correct"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/40 bg-rose-500/10 text-rose-200"
          }`}
        >
          {state === "correct"
            ? "Nice — that's right."
            : "Not quite — adjust and try again."}
          {children ? (
            <div className="mt-2 border-t border-white/10 pt-2 font-normal text-zinc-300">
              {children}
            </div>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
