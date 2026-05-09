"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import type { LessonStep } from "@/lib/interactive-lesson/types";
import { fetchLessonHint } from "@/lib/api-client";

type Props = {
  lessonId: string;
  step: LessonStep;
};

function stepToJson(step: LessonStep): Record<string, unknown> {
  return JSON.parse(JSON.stringify(step)) as Record<string, unknown>;
}

export function LessonHintPanel({ lessonId, step }: Props) {
  const [hint, setHint] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const load = async () => {
    setError(null);
    setLoading(true);
    try {
      const { hint: h } = await fetchLessonHint({
        lessonId,
        stepId: step.id,
        stepType: step.type,
        step: stepToJson(step),
      });
      setHint(h.trim());
    } catch (e) {
      setHint(null);
      setError(e instanceof Error ? e.message : "Hint failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-5 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
          Coach hint (Gemini)
        </p>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={load}
          disabled={loading}
          className="rounded-lg border border-zinc-600 px-3 py-1.5 text-xs font-medium text-zinc-200 hover:bg-zinc-800 disabled:opacity-45"
        >
          {loading ? "Thinking…" : hint ? "Refresh hint" : "Get a hint"}
        </motion.button>
      </div>
      <AnimatePresence initial={false}>
        {error ? (
          <motion.p
            key="err"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 text-sm text-rose-300"
            role="alert"
          >
            {error}
          </motion.p>
        ) : null}
        {hint ? (
          <motion.p
            key="hint"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm leading-relaxed text-zinc-300"
          >
            {hint}
          </motion.p>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
