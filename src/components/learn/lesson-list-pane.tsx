"use client";

import { EmptyState } from "@/components/layouts/empty-state";
import type { CourseTopic } from "@/data/courseTopics";
import type { ProgressMap } from "@/types";
import {
  estimatedMinutesForLesson,
  lessonRowStatus,
  LESSON_FILTER_LABELS,
  rowMatchesFilter,
  statusDisplay,
  topicMasteryPct,
  type LessonFilter,
} from "@/lib/master-detail-utils";

type Props = {
  topics: CourseTopic[];
  progress: ProgressMap;
  selectedId: string | null;
  onSelect: (id: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filter: LessonFilter;
  onFilterChange: (f: LessonFilter) => void;
};

const FILTERS: LessonFilter[] = [
  "all",
  "not_started",
  "in_progress",
  "completed",
  "weak",
];

export function LessonListPane({
  topics,
  progress,
  selectedId,
  onSelect,
  searchQuery,
  onSearchChange,
  filter,
  onFilterChange,
}: Props) {
  const q = searchQuery.trim().toLowerCase();

  const visible = topics.filter((t) => {
    const status = lessonRowStatus(t.id, progress);
    if (!rowMatchesFilter(status, filter)) return false;
    if (!q) return true;
    return (
      t.title.toLowerCase().includes(q) ||
      t.category.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex h-full min-h-0 flex-col bg-zinc-950/60 lg:max-h-[calc(100dvh-12rem)]">
      <div className="shrink-0 border-b border-zinc-800/90 p-4 sm:p-5">
        <label htmlFor="lesson-search" className="sr-only">
          Search lessons
        </label>
        <input
          id="lesson-search"
          type="search"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search topics, modules…"
          autoComplete="off"
          className="min-h-11 w-full rounded-xl border border-zinc-700 bg-zinc-900/60 px-3 py-2.5 text-sm text-zinc-100 placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
        />
        <div
          className="mt-3 flex flex-wrap gap-2"
          role="toolbar"
          aria-label="Lesson filters"
        >
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => onFilterChange(f)}
              aria-pressed={filter === f}
              className={`min-h-9 rounded-full border px-3 py-2 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
                filter === f
                  ? "border-cyan-500/45 bg-cyan-500/15 text-cyan-100"
                  : "border-zinc-700 bg-zinc-900/40 text-zinc-400 hover:border-zinc-600"
              }`}
            >
              {LESSON_FILTER_LABELS[f]}
            </button>
          ))}
        </div>
      </div>

      <ul
        className="min-h-0 flex-1 space-y-2 overflow-y-auto overscroll-contain p-2 sm:p-3"
        aria-label="Lesson list"
      >
        {visible.length === 0 ? (
          <li className="list-none p-2">
            <EmptyState
              title="No lessons match"
              description="Try clearing filters, widening search, or switching back to “All” to repopulate the catalog."
            />
          </li>
        ) : (
          visible.map((t) => {
            const status = lessonRowStatus(t.id, progress);
            const meta = statusDisplay(status);
            const mastery = topicMasteryPct(t.id, progress);
            const est = estimatedMinutesForLesson(t.category, t.id);
            const active = selectedId === t.id;

            return (
              <li key={t.id}>
                <button
                  type="button"
                  onClick={() => onSelect(t.id)}
                  aria-current={active ? "true" : undefined}
                  className={`flex min-h-[4.25rem] w-full flex-col gap-2 rounded-xl border px-4 py-3.5 text-left transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
                    active
                      ? "border-cyan-500/45 bg-cyan-500/10"
                      : "border-transparent bg-zinc-900/30 hover:border-zinc-700/80 hover:bg-zinc-900/50"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="min-w-0 font-medium leading-snug text-zinc-100">
                      {t.title}
                    </span>
                    <span
                      className={`shrink-0 rounded-md border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                        status === "completed"
                          ? "border-emerald-500/35 bg-emerald-500/10 text-emerald-100"
                          : status === "weak"
                            ? "border-rose-500/35 bg-rose-500/10 text-rose-100"
                            : status === "in_progress"
                              ? "border-cyan-500/35 bg-cyan-500/10 text-cyan-100"
                              : "border-zinc-600 bg-zinc-950 text-zinc-500"
                      }`}
                      title={meta.hint}
                    >
                      {meta.label}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-zinc-500">
                    <span>Module · {t.category}</span>
                    <span aria-hidden>·</span>
                    <span>~{est} min</span>
                    <span aria-hidden>·</span>
                    <span className="tabular-nums text-zinc-400">
                      Mastery {mastery}%
                    </span>
                  </div>
                </button>
              </li>
            );
          })
        )}
      </ul>
    </div>
  );
}
