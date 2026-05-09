"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import {
  GAPCLOSER_PROGRESS_EVENT,
  getProgress,
} from "@/lib/local-progress";
import type { LessonFilter } from "@/lib/master-detail-utils";
import { lessonRowStatus, rowMatchesFilter } from "@/lib/master-detail-utils";
import { LessonDetailPane } from "@/components/learn/lesson-detail-pane";
import { LessonListPane } from "@/components/learn/lesson-list-pane";

type MobilePhase = "list" | "detail";

export function MasterDetailLayout() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<LessonFilter>("all");
  const [mobilePhase, setMobilePhase] = useState<MobilePhase>("list");

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

  useEffect(() => {
    const t = searchParams.get("topic")?.trim();
    if (t && courseTopics.some((c) => c.id === t)) {
      setSelectedId(t);
      setMobilePhase("detail");
    }
  }, [searchParams]);

  useEffect(() => {
    if (selectedId) return;
    const firstVisible = courseTopics.find((topic) =>
      rowMatchesFilter(lessonRowStatus(topic.id, progress), filter),
    );
    setSelectedId(firstVisible?.id ?? null);
  }, [selectedId, filter, progress]);

  useEffect(() => {
    if (!selectedId) return;
    const st = lessonRowStatus(selectedId, progress);
    if (rowMatchesFilter(st, filter)) return;
    const next = courseTopics.find((topic) =>
      rowMatchesFilter(lessonRowStatus(topic.id, progress), filter),
    );
    setSelectedId(next?.id ?? null);
    setMobilePhase("list");
  }, [filter, progress, selectedId]);

  const selectedTopic = useMemo(
    () => courseTopics.find((t) => t.id === selectedId) ?? null,
    [selectedId],
  );

  const handleSelect = (id: string) => {
    setSelectedId(id);
    setMobilePhase("detail");
  };

  const showList = mobilePhase === "list";
  const showDetail = mobilePhase === "detail";

  return (
    <div className="flex min-h-[min(62dvh,560px)] flex-col overflow-hidden rounded-2xl border border-zinc-800/90 bg-zinc-950/35 shadow-[0_0_0_1px_rgba(24,24,27,0.35)] lg:min-h-[calc(100dvh-13rem)] lg:flex-row">
      <div
        className={`min-h-0 flex-1 border-zinc-800/90 lg:block lg:max-w-[min(100%,420px)] lg:shrink-0 lg:border-r ${
          showList ? "flex min-h-0 flex-col" : "hidden"
        } lg:flex`}
      >
        <LessonListPane
          topics={courseTopics}
          progress={progress}
          selectedId={selectedId}
          onSelect={handleSelect}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filter={filter}
          onFilterChange={setFilter}
        />
      </div>
      <div
        className={`min-h-0 min-w-0 flex-1 lg:block ${
          showDetail ? "flex min-h-0 flex-col" : "hidden"
        } lg:flex`}
      >
        <LessonDetailPane
          topic={selectedTopic}
          progress={progress}
          showBack={showDetail}
          onBack={() => setMobilePhase("list")}
        />
      </div>
    </div>
  );
}
