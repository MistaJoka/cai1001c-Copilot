import type { LibraryDifficulty, LibraryKind } from "@/lib/learning-library-data";
import { LIBRARY_KIND_LABELS } from "@/lib/learning-library-data";
import type { LessonRowStatus } from "@/lib/master-detail-utils";

export type LibraryKindFilter = "all" | LibraryKind;
export type LibraryDifficultyFilter = "all" | LibraryDifficulty;
export type LibraryStatusFilter = "all" | LessonRowStatus;

type Props = {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  kind: LibraryKindFilter;
  onKindChange: (value: LibraryKindFilter) => void;
  module: string;
  onModuleChange: (value: string) => void;
  modules: readonly string[];
  difficulty: LibraryDifficultyFilter;
  onDifficultyChange: (value: LibraryDifficultyFilter) => void;
  status: LibraryStatusFilter;
  onStatusChange: (value: LibraryStatusFilter) => void;
  weakOnly: boolean;
  onWeakOnlyChange: (value: boolean) => void;
  resultCount: number;
  totalCount: number;
};

const KIND_OPTIONS: LibraryKindFilter[] = [
  "all",
  "lesson",
  "concept",
  "quiz",
  "flashcards",
  "project",
  "review",
  "ai_prompt_pack",
  "final_exam_prep",
];

const DIFF_OPTIONS: LibraryDifficultyFilter[] = [
  "all",
  "intro",
  "core",
  "stretch",
];

const STATUS_OPTIONS: LibraryStatusFilter[] = [
  "all",
  "not_started",
  "in_progress",
  "completed",
  "weak",
];

const STATUS_LABELS: Record<LessonRowStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  weak: "Weak area",
};

const selectClass =
  "w-full rounded-xl border border-zinc-800 bg-zinc-950/80 px-3 py-2.5 text-sm text-zinc-100 outline-none transition focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/30";

export function LibraryFilters({
  searchQuery,
  onSearchChange,
  kind,
  onKindChange,
  module,
  onModuleChange,
  modules,
  difficulty,
  onDifficultyChange,
  status,
  onStatusChange,
  weakOnly,
  onWeakOnlyChange,
  resultCount,
  totalCount,
}: Props) {
  return (
    <div className="rounded-2xl border border-zinc-800/90 bg-zinc-950/50 p-5 shadow-inner shadow-black/20">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0 flex-1">
          <label htmlFor="library-search" className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Search
          </label>
          <input
            id="library-search"
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Titles, modules, types, descriptions…"
            autoComplete="off"
            className={`${selectClass} mt-1.5`}
          />
        </div>
        <p className="text-sm text-zinc-500 lg:shrink-0 lg:pb-2 lg:text-right">
          <span className="font-medium text-zinc-300">{resultCount}</span>
          <span className="text-zinc-600"> / </span>
          <span>{totalCount}</span>
          <span className="text-zinc-600"> resources</span>
        </p>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <div>
          <label htmlFor="library-kind" className="text-xs font-medium text-zinc-500">
            Type
          </label>
          <select
            id="library-kind"
            value={kind}
            onChange={(e) =>
              onKindChange(e.target.value as LibraryKindFilter)
            }
            className={`${selectClass} mt-1.5`}
          >
            {KIND_OPTIONS.map((k) => (
              <option key={k} value={k}>
                {k === "all" ? "All types" : LIBRARY_KIND_LABELS[k]}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="library-module" className="text-xs font-medium text-zinc-500">
            Module
          </label>
          <select
            id="library-module"
            value={module}
            onChange={(e) => onModuleChange(e.target.value)}
            className={`${selectClass} mt-1.5`}
          >
            <option value="all">All modules</option>
            {modules.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="library-difficulty" className="text-xs font-medium text-zinc-500">
            Difficulty
          </label>
          <select
            id="library-difficulty"
            value={difficulty}
            onChange={(e) =>
              onDifficultyChange(e.target.value as LibraryDifficultyFilter)
            }
            className={`${selectClass} mt-1.5`}
          >
            <option value="all">All levels</option>
            {DIFF_OPTIONS.filter((d) => d !== "all").map((d) => (
              <option key={d} value={d}>
                {d === "intro" ? "Intro" : d === "core" ? "Core" : "Stretch"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="library-status" className="text-xs font-medium text-zinc-500">
            Status
          </label>
          <select
            id="library-status"
            value={status}
            onChange={(e) =>
              onStatusChange(e.target.value as LibraryStatusFilter)
            }
            className={`${selectClass} mt-1.5`}
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All statuses" : STATUS_LABELS[s]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3 text-sm text-zinc-300 transition hover:border-zinc-700">
        <input
          type="checkbox"
          checked={weakOnly}
          onChange={(e) => onWeakOnlyChange(e.target.checked)}
          className="h-4 w-4 rounded border-zinc-600 bg-zinc-950 text-cyan-500 focus:ring-cyan-500/40"
        />
        <span>
          <span className="font-medium text-zinc-200">Weak areas only</span>
          <span className="mt-0.5 block text-xs text-zinc-500">
            Surfaces items tied to topics marked low confidence in local progress.
          </span>
        </span>
      </label>
    </div>
  );
}
