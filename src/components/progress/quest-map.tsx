"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import {
  QUEST_PATH_MODULES,
  type QuestPathModuleDef,
} from "@/data/questPathModules";
import {
  GAPCLOSER_PROGRESS_EVENT,
  getProgress,
} from "@/lib/local-progress";
import type { ProgressMap } from "@/types";
import { QuestNode, type QuestPathStatus } from "@/components/progress/quest-node";
import { ReadinessSummary } from "@/components/progress/readiness-summary";

type NodeModel = {
  def: QuestPathModuleDef;
  segmentLabel: string;
  masteryPct: number;
  status: QuestPathStatus;
  weakArea: boolean;
  align: "left" | "right";
};

function blendMastery(topicIds: readonly string[], progress: ProgressMap): number {
  if (topicIds.length === 0) return 0;
  let sum = 0;
  for (const id of topicIds) {
    const p = progress[id];
    if (!p) {
      sum += 0;
      continue;
    }
    const base =
      p.confidence === "high" ? 100 : p.confidence === "medium" ? 68 : 36;
    const actBonus = Math.min(18, (p.completedActions?.length ?? 0) * 4);
    sum += Math.min(100, base + actBonus);
  }
  return Math.round(sum / topicIds.length);
}

function segmentHasFootprint(
  def: QuestPathModuleDef,
  progress: ProgressMap,
): boolean {
  return def.topicIds.some((id) => progress[id]);
}

function deriveStatus(
  unlocked: boolean,
  masteryPct: number,
  def: QuestPathModuleDef,
  progress: ProgressMap,
): QuestPathStatus {
  if (!unlocked) return "locked";
  const touched = segmentHasFootprint(def, progress);
  if (masteryPct >= 78) return "completed";
  if (masteryPct > 12 || touched) return "in_progress";
  return "available";
}

export function QuestMap() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

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

  const nodes = useMemo((): NodeModel[] => {
    let moduleNum = 0;
    const out: NodeModel[] = [];

    for (let i = 0; i < QUEST_PATH_MODULES.length; i++) {
      const def = QUEST_PATH_MODULES[i];
      const masteryPct = blendMastery(def.topicIds, progress);

      let unlocked = i === 0;
      if (i > 0) {
        const prev = out[i - 1];
        unlocked =
          prev.status !== "locked" &&
          (prev.masteryPct >= 18 ||
            prev.status === "completed" ||
            segmentHasFootprint(prev.def, progress));
      }

      const status = deriveStatus(unlocked, masteryPct, def, progress);
      const weakArea =
        unlocked &&
        def.topicIds.some((id) => progress[id]?.confidence === "low");

      const segmentLabel =
        def.kind === "module"
          ? `Module ${++moduleNum}`
          : def.kind === "boss"
            ? "Boss checkpoint"
            : "Review gate";

      out.push({
        def,
        segmentLabel,
        masteryPct,
        status,
        weakArea,
        align: i % 2 === 0 ? "right" : "left",
      });
    }
    return out;
  }, [progress]);

  const stats = useMemo(() => {
    const modules = nodes.filter((n) => n.def.kind === "module");
    const bosses = nodes.filter((n) => n.def.kind === "boss");
    const gates = nodes.filter((n) => n.def.kind === "review_gate");

    const completedLessons = modules.filter(
      (n) => n.status === "completed",
    ).length;
    const weakSegments = nodes.filter((n) => n.weakArea).length;

    const checkpointsCleared = bosses.filter((n) => n.masteryPct >= 45).length;

    const reviewGatesVisited = gates.filter(
      (n) =>
        n.masteryPct >= 25 ||
        n.def.topicIds.some((id) => progress[id]?.completedActions?.length),
    ).length;

    const unlocked = nodes.filter((n) => n.status !== "locked");
    const readinessScore =
      unlocked.length === 0
        ? 0
        : Math.round(
            unlocked.reduce((s, n) => s + n.masteryPct, 0) / unlocked.length,
          );

    return {
      readinessScore,
      completedLessons,
      totalLessons: modules.length,
      weakSegments,
      checkpointsCleared,
      totalCheckpoints: bosses.length,
      reviewGatesVisited,
      totalReviewGates: gates.length,
    };
  }, [nodes, progress]);

  return (
    <div className="min-w-0 space-y-10 sm:space-y-12">
      <ReadinessSummary
        readinessScore={stats.readinessScore}
        completedLessons={stats.completedLessons}
        totalLessons={stats.totalLessons}
        weakSegments={stats.weakSegments}
        checkpointsCleared={stats.checkpointsCleared}
        totalCheckpoints={stats.totalCheckpoints}
        reviewGatesVisited={stats.reviewGatesVisited}
        totalReviewGates={stats.totalReviewGates}
      />

      <div className="relative min-w-0 overflow-x-hidden">
        <div
          className="pointer-events-none absolute left-8 top-4 bottom-4 w-px bg-gradient-to-b from-cyan-500/35 via-zinc-700/90 to-zinc-800 lg:left-1/2 lg:-translate-x-px"
          aria-hidden
        />

        <ol className="relative space-y-10 lg:space-y-14">
          {nodes.map((n) => (
            <li key={n.def.id} className="relative">
              <span
                className="absolute left-8 flex h-4 w-4 -translate-x-1/2 items-center justify-center rounded-full border border-cyan-500/50 bg-zinc-950 shadow-[0_0_12px_rgba(34,211,238,0.22)] lg:left-1/2"
                aria-hidden
              >
                <span className="h-1.5 w-1.5 rounded-full bg-cyan-400/90" />
              </span>
              <div
                className={`pl-14 lg:pl-0 ${
                  n.align === "right"
                    ? "lg:flex lg:justify-end lg:pr-[calc(50%+1.25rem)]"
                    : "lg:flex lg:justify-start lg:pl-[calc(50%+1.25rem)]"
                }`}
              >
                <QuestNode
                  nodeId={n.def.id}
                  segmentLabel={n.segmentLabel}
                  title={n.def.title}
                  kind={n.def.kind}
                  status={n.status}
                  masteryPct={n.masteryPct}
                  estimatedMinutes={n.def.estimatedMinutes}
                  ctaHref={n.def.ctaHref}
                  ctaLabel={n.def.ctaLabel}
                  weakArea={n.weakArea}
                  align={n.align}
                />
              </div>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
