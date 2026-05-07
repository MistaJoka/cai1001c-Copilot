"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { useReducedMotion } from "framer-motion";
import { useMemo } from "react";
import { PageHeader } from "@/components/page-header";
import { sampleInteractiveLesson } from "@/data/sampleInteractiveLesson";
import { aiVsNotAiLesson } from "@/data/lessons/aiVsNotAiLesson";
import { useHydrated } from "@/lib/use-hydrated";

const InteractiveLesson = dynamic(
  () =>
    import("@/components/interactive-lesson/interactive-lesson").then(
      (m) => m.InteractiveLesson,
    ),
  {
    ssr: false,
    loading: () => (
      <p className="text-sm text-zinc-500">Loading interactive lesson…</p>
    ),
  },
);

type Props = {
  /** From server `searchParams` — avoids `useSearchParams` hydration pitfalls */
  mode?: string;
};

export function InteractiveDemoClient({ mode }: Props) {
  const hydrated = useHydrated();
  const reduceMotionPref = Boolean(useReducedMotion());

  const lesson = useMemo(
    () => (mode === "lab" ? sampleInteractiveLesson : aiVsNotAiLesson),
    [mode],
  );

  const title =
    mode === "lab"
      ? "Interactive lesson lab (all step types)"
      : "Demo lesson · AI vs automation";

  const description =
    mode === "lab"
      ? "Smoke-test JSON for every step type in one stroll."
      : "Twelve paced steps: teaching line, single focal interaction, coach close, optional Gemini hints.";

  return (
    <>
      <PageHeader title={title} description={description} />

      <p className="mb-4 text-sm text-zinc-500">
        <Link href="/topics" className="text-cyan-400 hover:text-cyan-300">
          ← Topic map
        </Link>
        <span className="mx-2 text-zinc-700" aria-hidden>
          ·
        </span>
        <Link
          href={mode === "lab" ? "/interactive-demo" : "/interactive-demo?mode=lab"}
          className="text-cyan-400 hover:text-cyan-300"
        >
          {mode === "lab" ? "← Themed lesson" : "Open all-types lab →"}
        </Link>
        <span className="mx-2 text-zinc-700" aria-hidden>
          ·
        </span>
        <span>
          Reduced motion:{" "}
          <span className={hydrated && reduceMotionPref ? "text-emerald-400" : "text-zinc-300"}>
            {hydrated ? (reduceMotionPref ? "on" : "off") : "—"}
          </span>
        </span>
      </p>

      <section className="mb-10 rounded-2xl border border-zinc-800 bg-zinc-900/30 p-5 text-sm leading-relaxed text-zinc-400">
        <p className="font-semibold text-zinc-200">Engine notes</p>
        <ul className="mt-3 list-disc space-y-2 pl-5">
          <li>
            Framer Motion + dnd-kit handle transitions, taps, drag-sort, and pairing.{" "}
            <code className="rounded bg-zinc-950 px-1">teaching</code> /{" "}
            <code className="rounded bg-zinc-950 px-1">coachClose</code> live on each step JSON.
          </li>
          <li>
            “Get a hint” calls <code className="rounded bg-zinc-950 px-1">/api/gemini/lesson-hint</code>{" "}
            (server-only key); safe to skip offline — button surfaces errors gracefully.
          </li>
        </ul>
      </section>

      <InteractiveLesson
        lesson={lesson}
        reduceMotionHints={hydrated && reduceMotionPref}
      />
    </>
  );
}
