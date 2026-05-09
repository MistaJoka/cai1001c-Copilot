"use client";

import Link from "next/link";
import { useCallback, useMemo, useState } from "react";
import type { CourseTopic } from "@/data/courseTopics";
import { AiSidePanel } from "@/components/ai/ai-side-panel";
import { LessonCanvas } from "@/components/learn/lesson-canvas";
import { ModuleNavigator } from "@/components/learn/module-navigator";

export type ResolvedCommandCenterModule = {
  id: string;
  label: string;
  topicId: string | null;
  topic: CourseTopic | null;
  secondaryTopic: CourseTopic | null;
};

type MobileTab = "lesson" | "modules" | "ai";

type Props = {
  modules: ResolvedCommandCenterModule[];
};

export function CommandCenterLayout({ modules }: Props) {
  const [activeId, setActiveId] = useState(modules[0]?.id ?? "");
  const [mobileTab, setMobileTab] = useState<MobileTab>("lesson");
  const [understandingByModule, setUnderstandingByModule] = useState<
    Record<string, string>
  >({});

  const active = useMemo(
    () => modules.find((m) => m.id === activeId) ?? modules[0],
    [modules, activeId],
  );

  const navModules = useMemo(
    () =>
      modules.map((m) => ({
        id: m.id,
        label: m.label,
        topic: m.topic,
      })),
    [modules],
  );

  const understanding = understandingByModule[active?.id ?? ""] ?? "";

  const setUnderstanding = useCallback(
    (value: string) => {
      const id = active?.id;
      if (!id) return;
      setUnderstandingByModule((prev) => ({ ...prev, [id]: value }));
    },
    [active?.id],
  );

  const handleContinue = useCallback(() => {
    const idx = modules.findIndex((m) => m.id === activeId);
    const next = modules[(idx + 1) % modules.length];
    if (next) {
      setActiveId(next.id);
      setMobileTab("lesson");
    }
  }, [modules, activeId]);

  if (!active) {
    return (
      <p className="text-sm text-zinc-500">
        No modules configured for this workspace.
      </p>
    );
  }

  const isFinalReview = active.topicId === null;

  return (
    <div className="w-full">
      <nav
        className="mb-6 flex flex-wrap items-center gap-2 text-sm text-zinc-500"
        aria-label="Breadcrumb"
      >
        <Link href="/" className="text-cyan-400 hover:text-cyan-300">
          Home
        </Link>
        <span aria-hidden className="text-zinc-700">
          /
        </span>
        <span className="text-zinc-400">Learn</span>
        <span aria-hidden className="text-zinc-700">
          /
        </span>
        <span className="text-zinc-300">Command center</span>
      </nav>

      {/* Mobile tabs */}
      <div
        className="mb-5 flex gap-1 rounded-xl border border-zinc-800/90 bg-zinc-950/70 p-1 lg:hidden"
        role="tablist"
        aria-label="Workspace sections"
      >
        {(
          [
            ["lesson", "Lesson"],
            ["modules", "Modules"],
            ["ai", "AI Help"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={mobileTab === id}
            onClick={() => setMobileTab(id)}
            className={`min-h-11 flex-1 rounded-lg px-3 py-2.5 text-xs font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
              mobileTab === id
                ? "bg-cyan-500/15 text-cyan-200"
                : "text-zinc-500 hover:text-zinc-300"
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Desktop three-zone */}
      <div className="hidden min-h-[min(720px,85vh)] gap-6 lg:grid lg:grid-cols-12 lg:items-start">
        <div className="sticky top-24 col-span-3 max-h-[calc(100vh-8rem)] min-w-0 overflow-y-auto overscroll-contain pr-1">
          <ModuleNavigator
            modules={navModules}
            activeId={activeId}
            onSelect={setActiveId}
          />
        </div>
        <div className="col-span-6 min-w-0 overflow-x-hidden">
          <LessonCanvas
            moduleLabel={active.label}
            topic={active.topic}
            secondaryTopic={active.secondaryTopic}
            isFinalReview={isFinalReview}
            understanding={understanding}
            onUnderstandingChange={setUnderstanding}
            onContinue={handleContinue}
          />
        </div>
        <div className="sticky top-24 col-span-3 max-h-[calc(100vh-8rem)] min-w-0 overflow-y-auto overscroll-contain pl-1">
          <AiSidePanel topicId={active.topicId} moduleLabel={active.label} />
        </div>
      </div>

      {/* Mobile stacked */}
      <div className="flex min-w-0 flex-col gap-6 lg:hidden">
        {mobileTab === "modules" ? (
          <ModuleNavigator
            modules={navModules}
            activeId={activeId}
            onSelect={(id) => {
              setActiveId(id);
              setMobileTab("lesson");
            }}
          />
        ) : null}
        {mobileTab === "lesson" ? (
          <LessonCanvas
            moduleLabel={active.label}
            topic={active.topic}
            secondaryTopic={active.secondaryTopic}
            isFinalReview={isFinalReview}
            understanding={understanding}
            onUnderstandingChange={setUnderstanding}
            onContinue={handleContinue}
          />
        ) : null}
        {mobileTab === "ai" ? (
          <AiSidePanel topicId={active.topicId} moduleLabel={active.label} />
        ) : null}
      </div>
    </div>
  );
}
