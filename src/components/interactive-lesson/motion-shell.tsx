"use client";

import { MotionConfig } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Central place for motion policy. Framer respects `prefers-reduced-motion` via `user`.
 * Wrap interactive lessons so all descendants inherit sane defaults.
 */
export function MotionShell({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
