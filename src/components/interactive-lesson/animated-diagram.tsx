"use client";

import { motion } from "framer-motion";
import { useEffect } from "react";
import type { AnimatedDiagramStep } from "@/lib/interactive-lesson/types";

type Props = {
  step: AnimatedDiagramStep;
  onGateChange?: (allowed: boolean) => void;
};

const container = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.04,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 6 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.22 },
  },
};

const connector = {
  hidden: { opacity: 0, scale: 0.85 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.18 } },
};

/**
 * Lightweight flow strip — geometric nodes + connectors, SVG kept minimal.
 *
 * TODO(Gemini): generate diagram node labels from syllabus bullets (structured JSON validated).
 */
export function AnimatedDiagram({ step, onGateChange }: Props) {
  useEffect(() => {
    onGateChange?.(true);
  }, [step.id, onGateChange]);

  const staggered = step.nodes.flatMap((node, i) => {
    const els = [
      <motion.li key={node.id} variants={item}>
        <div className="rounded-2xl border border-cyan-500/35 bg-zinc-950 px-5 py-3 text-center shadow-sm shadow-cyan-900/30 transition-transform hover:scale-[1.02]">
          <span className="text-sm font-medium text-cyan-100">{node.label}</span>
        </div>
      </motion.li>,
    ];
    if (i < step.nodes.length - 1) {
      els.push(
        <motion.li
          key={`${node.id}-connector`}
          variants={connector}
          aria-hidden
          className="flex h-10 items-center justify-center py-1 text-xl text-zinc-600"
        >
          ↓
        </motion.li>,
      );
    }
    return els;
  });

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      {step.title ? (
        <h3 className="text-sm font-semibold text-zinc-100">{step.title}</h3>
      ) : null}

      <motion.ul
        variants={container}
        initial="hidden"
        animate="visible"
        className="mx-auto mt-6 flex max-w-md list-none flex-col items-center gap-1"
        role="presentation"
      >
        {staggered}
      </motion.ul>

      {step.caption ? (
        <p className="mt-6 border-t border-zinc-800 pt-4 text-xs leading-relaxed text-zinc-500">
          {step.caption}
        </p>
      ) : null}
    </div>
  );
}
