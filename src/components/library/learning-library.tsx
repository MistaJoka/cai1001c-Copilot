"use client";

import { useEffect, useMemo, useState } from "react";
import { EmptyState } from "@/components/layouts/empty-state";
import { LibraryCard } from "@/components/library/library-card";
import { LibraryFilters } from "@/components/library/library-filters";
import type {
  LibraryDifficultyFilter,
  LibraryKindFilter,
  LibraryStatusFilter,
} from "@/components/library/library-filters";
import {
  buildLearningLibraryItems,
  librarySearchBlob,
} from "@/lib/learning-library-data";
import { GAPCLOSER_PROGRESS_EVENT, getProgress } from "@/lib/local-progress";
import { usePathname } from "next/navigation";

function SearchIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

export function LearningLibrary() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [kind, setKind] = useState<LibraryKindFilter>("all");
  const [moduleFilter, setModuleFilter] = useState<string>("all");
  const [difficulty, setDifficulty] =
    useState<LibraryDifficultyFilter>("all");
  const [status, setStatus] = useState<LibraryStatusFilter>("all");
  const [weakOnly, setWeakOnly] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const bump = () => setTick((n) => n + 1);
    window.addEventListener(GAPCLOSER_PROGRESS_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(GAPCLOSER_PROGRESS_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const progress = useMemo(() => {
    void pathname;
    void tick;
    return mounted ? getProgress() : {};
  }, [mounted, pathname, tick]);

  const items = useMemo(
    () => buildLearningLibraryItems(progress),
    [progress],
  );

  const modules = useMemo(() => {
    const set = new Set(items.map((i) => i.module));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [items]);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filtered = useMemo(() => {
    return items.filter((item) => {
      if (weakOnly && !item.isWeak) return false;
      if (kind !== "all" && item.kind !== kind) return false;
      if (moduleFilter !== "all" && item.module !== moduleFilter) return false;
      if (difficulty !== "all" && item.difficulty !== difficulty) return false;
      if (status !== "all" && item.status !== status) return false;
      if (normalizedQuery) {
        const blob = librarySearchBlob(item);
        if (!blob.includes(normalizedQuery)) return false;
      }
      return true;
    });
  }, [
    items,
    weakOnly,
    kind,
    moduleFilter,
    difficulty,
    status,
    normalizedQuery,
  ]);

  const clearFilters = () => {
    setSearchQuery("");
    setKind("all");
    setModuleFilter("all");
    setDifficulty("all");
    setStatus("all");
    setWeakOnly(false);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      <LibraryFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        kind={kind}
        onKindChange={setKind}
        module={moduleFilter}
        onModuleChange={setModuleFilter}
        modules={modules}
        difficulty={difficulty}
        onDifficultyChange={setDifficulty}
        status={status}
        onStatusChange={setStatus}
        weakOnly={weakOnly}
        onWeakOnlyChange={setWeakOnly}
        resultCount={filtered.length}
        totalCount={items.length}
      />

      {filtered.length === 0 ? (
        <EmptyState
          icon={<SearchIcon />}
          title="No resources match these filters"
          description="Try clearing weak-area mode, widening the module or type, or shortening your search. The full catalog stays client-side for instant tweaks."
          action={
            <button
              type="button"
              onClick={clearFilters}
              className="rounded-xl bg-cyan-500/90 px-4 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-cyan-400"
            >
              Reset filters
            </button>
          }
        />
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <LibraryCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
