"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { LibraryItem } from "@/lib/learning-library-data";
import { LIBRARY_KIND_LABELS } from "@/lib/learning-library-data";
import { statusDisplay } from "@/lib/master-detail-utils";

const KIND_BADGE: Record<
  LibraryItem["kind"],
  string
> = {
  lesson:
    "border-cyan-500/35 bg-cyan-500/10 text-cyan-100/95",
  concept:
    "border-violet-500/35 bg-violet-500/10 text-violet-100/95",
  quiz:
    "border-amber-500/35 bg-amber-500/10 text-amber-100/95",
  flashcards:
    "border-emerald-500/35 bg-emerald-500/10 text-emerald-100/95",
  project:
    "border-rose-500/35 bg-rose-500/10 text-rose-100/95",
  review:
    "border-sky-500/35 bg-sky-500/10 text-sky-100/95",
  ai_prompt_pack:
    "border-fuchsia-500/35 bg-fuchsia-500/10 text-fuchsia-100/95",
  final_exam_prep:
    "border-orange-500/35 bg-orange-500/10 text-orange-100/95",
};

const DIFF_BADGE: Record<LibraryItem["difficulty"], string> = {
  intro: "border-zinc-600 bg-zinc-800/70 text-zinc-300",
  core: "border-zinc-500/60 bg-zinc-800/50 text-zinc-200",
  stretch: "border-indigo-500/35 bg-indigo-500/10 text-indigo-100/90",
};

function difficultyLabel(d: LibraryItem["difficulty"]) {
  switch (d) {
    case "intro":
      return "Intro";
    case "core":
      return "Core";
    case "stretch":
      return "Stretch";
  }
}

type Props = { item: LibraryItem };

export function LibraryCard({ item }: Props) {
  const status = statusDisplay(item.status);
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.article
      initial={false}
      whileHover={
        reduce
          ? undefined
          : {
              y: -2,
              transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] },
            }
      }
      className="group flex h-full flex-col rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/80 to-zinc-950/90 p-5 shadow-[0_1px_0_rgba(255,255,255,0.04)_inset] transition-colors duration-200 hover:border-cyan-500/25 hover:shadow-lg hover:shadow-cyan-950/25 sm:p-6"
    >
      <div className="flex flex-wrap items-start justify-between gap-2">
        <span
          className={`inline-flex rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide ${KIND_BADGE[item.kind]}`}
        >
          {LIBRARY_KIND_LABELS[item.kind]}
        </span>
        <span
          className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-medium ${DIFF_BADGE[item.difficulty]}`}
          title="Estimated cognitive load"
        >
          {difficultyLabel(item.difficulty)}
        </span>
      </div>

      <h3 className="mt-5 text-lg font-semibold leading-snug tracking-tight text-zinc-50">
        {item.title}
      </h3>
      <p className="prose-reading mt-3 line-clamp-3 flex-1 text-sm text-zinc-400">
        {item.description}
      </p>

      <dl className="mt-5 grid gap-2.5 border-t border-zinc-800/80 pt-5 text-xs text-zinc-500">
        <div className="flex justify-between gap-3">
          <dt className="text-zinc-600">Module</dt>
          <dd className="text-right font-medium text-zinc-300">{item.module}</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-zinc-600">Est. time</dt>
          <dd className="text-right text-zinc-300">{item.estimatedMinutes} min</dd>
        </div>
        <div className="flex justify-between gap-3">
          <dt className="text-zinc-600">Status</dt>
          <dd className="text-right">
            <span
              className="font-medium text-zinc-200"
              title={status.hint}
            >
              {status.label}
            </span>
          </dd>
        </div>
      </dl>

      <div className="mt-6 flex flex-wrap gap-3">
        <Link
          href={item.primaryAction.href}
          className="inline-flex min-h-11 flex-1 min-w-[10rem] items-center justify-center rounded-xl bg-cyan-500/90 px-4 py-3 text-center text-sm font-semibold text-zinc-950 transition-colors hover:bg-cyan-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/80"
        >
          {item.primaryAction.label}
        </Link>
        <Link
          href={item.secondaryAction.href}
          className="inline-flex min-h-11 flex-1 min-w-[10rem] items-center justify-center rounded-xl border border-zinc-700/90 bg-zinc-900/40 px-4 py-3 text-center text-sm font-medium text-zinc-200 transition-colors hover:border-zinc-600 hover:bg-zinc-800/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500"
        >
          {item.secondaryAction.label}
        </Link>
      </div>
    </motion.article>
  );
}
