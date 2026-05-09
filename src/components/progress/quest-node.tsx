"use client";

import Link from "next/link";
import type { QuestNodeKind } from "@/data/questPathModules";

export type QuestPathStatus = "locked" | "available" | "in_progress" | "completed";

type Props = {
  nodeId: string;
  segmentLabel: string;
  title: string;
  kind: QuestNodeKind;
  status: QuestPathStatus;
  masteryPct: number;
  estimatedMinutes: number;
  ctaHref: string;
  ctaLabel: string;
  weakArea?: boolean;
  align: "left" | "right";
};

const STATUS_COPY: Record<
  QuestPathStatus,
  { label: string; icon: string; hint: string }
> = {
  locked: {
    label: "Locked",
    icon: "◆",
    hint: "Complete the prior segment to unlock.",
  },
  available: {
    label: "Available",
    icon: "◇",
    hint: "Ready to start.",
  },
  in_progress: {
    label: "In progress",
    icon: "◈",
    hint: "Active — push mastery higher.",
  },
  completed: {
    label: "Completed",
    icon: "✓",
    hint: "Objective cleared at current fidelity.",
  },
};

export function QuestNode({
  nodeId,
  segmentLabel,
  title,
  kind,
  status,
  masteryPct,
  estimatedMinutes,
  ctaHref,
  ctaLabel,
  weakArea,
  align,
}: Props) {
  const cfg = STATUS_COPY[status];
  const locked = status === "locked";

  const frameKind =
    kind === "boss"
      ? "border-indigo-500/35 bg-indigo-500/[0.06]"
      : kind === "review_gate"
        ? "border-amber-500/30 bg-amber-500/[0.05]"
        : "border-zinc-800/90 bg-zinc-900/40";

  return (
    <div
      className={`relative w-full max-w-md ${align === "right" ? "lg:ml-auto" : "lg:mr-auto"}`}
    >
      <article
        className={`rounded-2xl border p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.35)] backdrop-blur-sm ${frameKind}`}
        aria-labelledby={`quest-node-title-${nodeId}`}
      >
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
              {segmentLabel}
            </p>
            <h3
              id={`quest-node-title-${nodeId}`}
              className="mt-1 text-lg font-semibold tracking-tight text-zinc-50"
            >
              {title}
            </h3>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-medium ${
                status === "completed"
                  ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-100"
                  : status === "in_progress"
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100"
                    : status === "locked"
                      ? "border-zinc-700 bg-zinc-950 text-zinc-500"
                      : "border-zinc-600 bg-zinc-900 text-zinc-300"
              }`}
              title={cfg.hint}
            >
              <span aria-hidden className="text-xs">
                {cfg.icon}
              </span>
              {cfg.label}
            </span>
            {weakArea ? (
              <span className="rounded-full border border-rose-500/35 bg-rose-500/10 px-2.5 py-1 text-[11px] font-medium text-rose-100">
                Weak-area flag
              </span>
            ) : null}
          </div>
        </div>

        <dl className="mt-4 grid grid-cols-2 gap-3 text-sm">
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              Mastery
            </dt>
            <dd className="mt-1 tabular-nums text-zinc-100">
              <span className="text-lg font-semibold">{masteryPct}%</span>
              <span className="sr-only"> percent synthesised from local confidence</span>
            </dd>
          </div>
          <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-3 py-2">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-zinc-500">
              Est. time
            </dt>
            <dd className="mt-1 text-zinc-200">{estimatedMinutes} min</dd>
          </div>
        </dl>

        <p className="mt-3 text-xs text-zinc-500">{cfg.hint}</p>

        <div className="mt-5">
          {locked ? (
            <span className="inline-flex w-full cursor-not-allowed items-center justify-center rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 text-sm font-medium text-zinc-600">
              Locked — finish prior segment
            </span>
          ) : (
            <Link
              href={ctaHref}
              className="flex w-full items-center justify-center rounded-xl bg-cyan-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </article>
    </div>
  );
}
