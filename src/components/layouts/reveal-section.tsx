"use client";

import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";

type Props = {
  children: ReactNode;
  className?: string;
  /** Stagger offset in seconds — keep small (≤0.12) to avoid feeling sluggish. */
  delay?: number;
};

/**
 * Subtle section entrance for portfolio-style pages. Respects reduced motion.
 */
export function RevealSection({ children, className, delay = 0 }: Props) {
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.div
      className={className}
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: reduce ? 0 : 0.36,
        delay: reduce ? 0 : delay,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      {children}
    </motion.div>
  );
}
