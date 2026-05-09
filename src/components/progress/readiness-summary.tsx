"use client";

type Props = {
  readinessScore: number;
  completedLessons: number;
  totalLessons: number;
  weakSegments: number;
  checkpointsCleared: number;
  totalCheckpoints: number;
  reviewGatesVisited: number;
  totalReviewGates: number;
};

export function ReadinessSummary({
  readinessScore,
  completedLessons,
  totalLessons,
  weakSegments,
  checkpointsCleared,
  totalCheckpoints,
  reviewGatesVisited,
  totalReviewGates,
}: Props) {
  const tiles = [
    {
      label: "Path readiness",
      value: `${readinessScore}%`,
      hint: "Blend of unlocked segment mastery (local browser only).",
    },
    {
      label: "Modules cleared",
      value: `${completedLessons}/${totalLessons}`,
      hint: "Module tiles at ≥78% mastery.",
    },
    {
      label: "Weak-area flags",
      value: String(weakSegments),
      hint: "Segments with low-confidence catalog topics.",
    },
    {
      label: "Boss checkpoints",
      value: `${checkpointsCleared}/${totalCheckpoints}`,
      hint: "Quiz checkpoints at ≥45% linked mastery.",
    },
    {
      label: "Review gates",
      value: `${reviewGatesVisited}/${totalReviewGates}`,
      hint: "Gates with study-run / gap exposure started.",
    },
  ] as const;

  return (
    <section
      className="rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.06] via-zinc-900/30 to-zinc-950/90 p-5 sm:p-6"
      aria-label="Quest readiness summary"
    >
      <h2 className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-200/90">
        Command telemetry
      </h2>
      <p className="mt-2 max-w-3xl text-sm text-zinc-400">
        Lightweight ops-style counters — not a grade. Calibrate with your instructor;
        data never leaves this browser unless you export from Insights.
      </p>
      <ul className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {tiles.map((t) => (
          <li
            key={t.label}
            className="rounded-xl border border-zinc-800/90 bg-zinc-950/45 px-4 py-5 sm:px-5"
          >
            <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
              {t.label}
            </p>
            <p className="mt-2 text-2xl font-semibold tabular-nums text-zinc-50">
              {t.value}
            </p>
            <p className="mt-2 text-xs leading-snug text-zinc-600">{t.hint}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
