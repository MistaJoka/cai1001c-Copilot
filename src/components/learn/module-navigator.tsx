"use client";

import type { CourseTopic } from "@/data/courseTopics";

export type NavigatorModule = {
  id: string;
  label: string;
  topic: CourseTopic | null;
};

type Props = {
  modules: NavigatorModule[];
  activeId: string;
  onSelect: (id: string) => void;
  className?: string;
};

export function ModuleNavigator({
  modules,
  activeId,
  onSelect,
  className = "",
}: Props) {
  return (
    <nav
      className={`flex flex-col gap-1 ${className}`}
      aria-label="Course modules"
    >
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
        CAI1001C modules
      </p>
      <ul className="space-y-1">
        {modules.map((m, index) => {
          const active = m.id === activeId;
          return (
            <li key={m.id}>
              <button
                type="button"
                onClick={() => onSelect(m.id)}
                aria-current={active ? "true" : undefined}
                className={`flex w-full items-start gap-3 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                  active
                    ? "border-cyan-500/40 bg-cyan-500/10 text-cyan-100"
                    : "border-transparent bg-zinc-950/40 text-zinc-400 hover:border-zinc-700/80 hover:bg-zinc-900/50 hover:text-zinc-200"
                }`}
              >
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-[11px] font-semibold text-zinc-500">
                  {index + 1}
                </span>
                <span className="min-w-0 leading-snug">
                  <span className="block font-medium">{m.label}</span>
                  {m.topic ? (
                    <span className="mt-0.5 block truncate text-xs text-zinc-600">
                      {m.topic.title}
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
