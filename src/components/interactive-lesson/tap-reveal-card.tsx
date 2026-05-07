"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { TapRevealStep } from "@/lib/interactive-lesson/types";

type Props = {
  step: TapRevealStep;
  onGateChange?: (allowed: boolean) => void;
};

export function TapRevealCard({ step, onGateChange }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    onGateChange?.(false);
    setOpen(false);
  }, [step.id, onGateChange]);

  const toggle = () => {
    setOpen((v) => {
      const next = !v;
      if (next) onGateChange?.(true);
      return next;
    });
  };

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      <p className="text-sm leading-relaxed text-zinc-200">{step.prompt}</p>
      <motion.button
        type="button"
        onClick={toggle}
        whileTap={{ scale: 0.98 }}
        className={`mt-4 w-full rounded-xl border px-4 py-3 text-left text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400 ${
          open
            ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-100"
            : "border-zinc-700 bg-zinc-950 text-zinc-200 hover:border-zinc-600"
        }`}
        aria-expanded={open}
      >
        {open ? "Hide" : "Tap to reveal"}
      </motion.button>
      <AnimatePresence initial={false}>
        {open ? (
          <motion.div
            key="revealed"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.22 }}
            className="overflow-hidden"
          >
            <p className="mt-3 border-t border-zinc-800 pt-3 text-sm leading-relaxed text-zinc-300">
              {step.reveal}
            </p>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
