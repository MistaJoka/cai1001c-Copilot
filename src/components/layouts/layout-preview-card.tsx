import Link from "next/link";
import type { LayoutRegistryEntry } from "@/components/layouts/layout-types";
import { StatusPill } from "@/components/layouts/status-pill";

type Props = {
  entry: LayoutRegistryEntry;
  className?: string;
};

export function LayoutPreviewCard({ entry, className = "" }: Props) {
  return (
    <article
      className={`group flex h-full flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/30 p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.25)] transition-colors hover:border-cyan-500/25 hover:bg-zinc-900/45 sm:p-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            {entry.id.replace(/-/g, " · ")}
          </p>
          <h3 className="mt-1 text-lg font-semibold tracking-tight text-zinc-50">
            {entry.title}
          </h3>
        </div>
        <StatusPill status={entry.status} />
      </div>

      <p className="mt-3 flex-1 text-sm leading-relaxed text-zinc-400">
        {entry.description}
      </p>

      <p className="mt-4 text-xs leading-relaxed text-zinc-500">
        <span className="font-medium text-zinc-400">Best for:</span> {entry.bestUse}
      </p>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label="Primary components">
        {entry.primaryComponents.map((c) => (
          <li
            key={c}
            className="rounded-lg border border-zinc-800/80 bg-zinc-950/50 px-2 py-0.5 text-[11px] text-zinc-400"
          >
            {c}
          </li>
        ))}
      </ul>

      <p className="mt-4 border-t border-zinc-800/70 pt-4 text-xs leading-relaxed text-zinc-500">
        <span className="font-medium text-cyan-200/80">Learning value:</span>{" "}
        {entry.learningValue}
      </p>

      <Link
        href={entry.route}
        className="mt-5 inline-flex items-center text-sm font-medium text-cyan-400 transition-colors group-hover:text-cyan-300"
      >
        Open route →
      </Link>
    </article>
  );
}
