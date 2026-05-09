"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import type { LayoutRegistryEntry } from "@/components/layouts/layout-types";
import { StatusPill } from "@/components/layouts/status-pill";

type Props = {
  entry: LayoutRegistryEntry;
  className?: string;
};

export function LayoutCatalogCard({ entry, className = "" }: Props) {
  const reduce = Boolean(useReducedMotion());

  return (
    <motion.article
      initial={false}
      whileHover={
        reduce
          ? undefined
          : {
              y: -3,
              transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
            }
      }
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-gradient-to-b from-zinc-900/50 to-zinc-950/80 p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.35)] transition-colors duration-300 ease-out hover:border-cyan-500/35 hover:shadow-[0_24px_48px_-28px_rgba(34,211,238,0.22)] sm:p-6 ${className}`}
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-500/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden
      />

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-zinc-600">
            {entry.id}
          </p>
          <h3 className="mt-1 text-xl font-semibold tracking-tight text-zinc-50">
            {entry.title}
          </h3>
        </div>
        <StatusPill status={entry.status} />
      </div>

      <dl className="mt-6 flex flex-1 flex-col gap-5 text-sm">
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Description
          </dt>
          <dd className="mt-2 leading-relaxed text-zinc-400">{entry.description}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Best use
          </dt>
          <dd className="mt-2 leading-relaxed text-zinc-300">{entry.bestUse}</dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Key components
          </dt>
          <dd className="mt-3">
            <ul className="flex flex-wrap gap-2" aria-label="Key components">
              {entry.primaryComponents.map((c) => (
                <li
                  key={c}
                  className="rounded-lg border border-zinc-700/80 bg-zinc-950/70 px-2.5 py-1.5 text-xs font-medium text-zinc-400 transition-colors duration-200 group-hover:border-zinc-600/90 group-hover:text-zinc-300"
                >
                  {c}
                </li>
              ))}
            </ul>
          </dd>
        </div>
        <div>
          <dt className="text-[11px] font-semibold uppercase tracking-[0.16em] text-zinc-500">
            Route
          </dt>
          <dd className="mt-2">
            <code className="break-all rounded-lg border border-zinc-800/90 bg-zinc-950/80 px-2.5 py-1.5 font-mono text-[12px] text-cyan-200/90">
              {entry.route}
            </code>
          </dd>
        </div>
      </dl>

      <div className="mt-8 border-t border-zinc-800/70 pt-6">
        <Link
          href={entry.route}
          className="flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-cyan-600 px-4 py-3 text-sm font-semibold text-white shadow-sm transition-colors duration-200 hover:bg-cyan-500 hover:shadow-[0_0_24px_-4px_rgba(34,211,238,0.45)] active:scale-[0.99] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
        >
          Open layout
          <span aria-hidden className="transition-transform duration-200 group-hover:translate-x-0.5">
            →
          </span>
        </Link>
      </div>
    </motion.article>
  );
}
