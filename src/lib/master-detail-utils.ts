import type { ProgressMap } from "@/types";

export type LessonRowStatus = "not_started" | "in_progress" | "completed" | "weak";

export type LessonFilter =
  | "all"
  | "not_started"
  | "in_progress"
  | "completed"
  | "weak";

const CATEGORY_EST_MINUTES: Record<string, number> = {
  Foundations: 34,
  "AI Workflow": 40,
  "Machine Learning": 48,
  Tools: 30,
  "Enterprise AI": 38,
  "Responsible AI": 36,
  "Computer Vision": 44,
  "Natural Language Processing": 46,
  "Robotics & Autonomy": 42,
};

export function estimatedMinutesForLesson(category: string, topicId: string): number {
  const base = CATEGORY_EST_MINUTES[category] ?? 40;
  const jitter = (topicId.length % 9) - 4;
  return Math.max(18, base + jitter);
}

export function topicMasteryPct(topicId: string, progress: ProgressMap): number {
  const p = progress[topicId];
  if (!p) return 0;
  const base =
    p.confidence === "high" ? 100 : p.confidence === "medium" ? 68 : 34;
  const bonus = Math.min(22, (p.completedActions?.length ?? 0) * 4);
  return Math.min(100, Math.round(base + bonus));
}

export function lessonRowStatus(
  topicId: string,
  progress: ProgressMap,
): LessonRowStatus {
  const p = progress[topicId];
  if (!p) return "not_started";
  if (p.confidence === "low") return "weak";
  const m = topicMasteryPct(topicId, progress);
  if (p.confidence === "high" || m >= 78) return "completed";
  return "in_progress";
}

export function rowMatchesFilter(
  status: LessonRowStatus,
  filter: LessonFilter,
): boolean {
  if (filter === "all") return true;
  return status === filter;
}

export const LESSON_FILTER_LABELS: Record<LessonFilter, string> = {
  all: "All",
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  weak: "Weak areas",
};

export function statusDisplay(status: LessonRowStatus): {
  label: string;
  hint: string;
} {
  switch (status) {
    case "not_started":
      return { label: "Not started", hint: "No local progress recorded yet." };
    case "in_progress":
      return { label: "In progress", hint: "Confidence or actions in flight." };
    case "completed":
      return { label: "Completed", hint: "High confidence or mastery threshold met." };
    case "weak":
      return {
        label: "Weak area",
        hint: "Low confidence — prioritize retrieval here.",
      };
  }
}
