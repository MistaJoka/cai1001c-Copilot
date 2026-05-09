import { courseTopics } from "@/data/courseTopics";
import type { ProgressMap } from "@/types";
import type { LessonRowStatus } from "@/lib/master-detail-utils";
import {
  estimatedMinutesForLesson,
  lessonRowStatus,
} from "@/lib/master-detail-utils";
import { LAYOUT_GLOBAL_LIBRARY_ROWS } from "@/lib/layout-demo-data";

export type LibraryKind =
  | "lesson"
  | "concept"
  | "quiz"
  | "flashcards"
  | "project"
  | "review"
  | "ai_prompt_pack"
  | "final_exam_prep";

export type LibraryDifficulty = "intro" | "core" | "stretch";

export type LibraryItem = {
  id: string;
  kind: LibraryKind;
  /** When set, status / weak flags follow local progress. */
  topicId?: string;
  title: string;
  description: string;
  module: string;
  estimatedMinutes: number;
  difficulty: LibraryDifficulty;
  status: LessonRowStatus;
  isWeak: boolean;
  primaryAction: { label: string; href: string };
  secondaryAction: { label: string; href: string };
};

export const LIBRARY_KIND_LABELS: Record<LibraryKind, string> = {
  lesson: "Lesson",
  concept: "Concept",
  quiz: "Quiz",
  flashcards: "Flashcard deck",
  project: "Project",
  review: "Review set",
  ai_prompt_pack: "AI prompt pack",
  final_exam_prep: "Final exam prep",
};

const STRETCH_MODULES = new Set([
  "Enterprise AI",
  "Robotics & Autonomy",
  "Computer Vision",
]);

export function difficultyForModule(category: string): LibraryDifficulty {
  if (category === "Foundations") return "intro";
  if (STRETCH_MODULES.has(category)) return "stretch";
  return "core";
}

function topicStatus(topicId: string, progress: ProgressMap): {
  status: LessonRowStatus;
  isWeak: boolean;
} {
  const status = lessonRowStatus(topicId, progress);
  return { status, isWeak: status === "weak" };
}

function mockGlobalItems(): Omit<LibraryItem, "status" | "isWeak">[] {
  return LAYOUT_GLOBAL_LIBRARY_ROWS.map((row) => ({
    id: row.id,
    kind: row.catalogKind,
    title: row.title,
    description: row.description,
    module: row.module,
    estimatedMinutes: row.estimatedMinutes,
    difficulty: row.difficulty,
    primaryAction: { label: row.primaryLabel, href: row.primaryHref },
    secondaryAction: { label: row.secondaryLabel, href: row.secondaryHref },
  }));
}

export function buildLearningLibraryItems(progress: ProgressMap): LibraryItem[] {
  const fromTopics: LibraryItem[] = [];

  for (const topic of courseTopics) {
    const diff = difficultyForModule(topic.category);
    const estBase = estimatedMinutesForLesson(topic.category, topic.id);
    const { status, isWeak } = topicStatus(topic.id, progress);

    const conceptBlurb =
      topic.examFocus[0] ??
      (topic.description.length > 140
        ? `${topic.description.slice(0, 140)}…`
        : topic.description);

    fromTopics.push(
      {
        id: `lesson-${topic.id}`,
        kind: "lesson",
        topicId: topic.id,
        title: topic.title,
        description: topic.description,
        module: topic.category,
        estimatedMinutes: estBase,
        difficulty: diff,
        status,
        isWeak,
        primaryAction: {
          label: "Open lesson",
          href: `/topics/${topic.id}`,
        },
        secondaryAction: {
          label: "Study run",
          href: `/study-run?topic=${encodeURIComponent(topic.id)}`,
        },
      },
      {
        id: `concept-${topic.id}`,
        kind: "concept",
        topicId: topic.id,
        title: `${topic.title}: objectives`,
        description: conceptBlurb,
        module: topic.category,
        estimatedMinutes: Math.max(12, Math.round(estBase * 0.35)),
        difficulty: diff,
        status,
        isWeak,
        primaryAction: {
          label: "Gap check",
          href: `/gap-check?topic=${encodeURIComponent(topic.id)}`,
        },
        secondaryAction: {
          label: "Ask AI",
          href: `/ai-tutor?topic=${encodeURIComponent(topic.id)}`,
        },
      },
      {
        id: `quiz-${topic.id}`,
        kind: "quiz",
        topicId: topic.id,
        title: `Quiz · ${topic.title}`,
        description: `Retrieval set mapped to “${topic.title}” with instant feedback.`,
        module: topic.category,
        estimatedMinutes: Math.max(15, Math.round(estBase * 0.28)),
        difficulty: diff,
        status,
        isWeak,
        primaryAction: {
          label: "Start quiz",
          href: `/quiz?topic=${encodeURIComponent(topic.id)}&count=8`,
        },
        secondaryAction: {
          label: "Lesson page",
          href: `/topics/${topic.id}`,
        },
      },
      {
        id: `deck-${topic.id}`,
        kind: "flashcards",
        topicId: topic.id,
        title: `Deck · ${topic.title}`,
        description: `Key terms and prompts aligned with ${topic.title}.`,
        module: topic.category,
        estimatedMinutes: Math.max(12, Math.round(estBase * 0.22)),
        difficulty: diff,
        status,
        isWeak,
        primaryAction: {
          label: "Review deck",
          href: `/flashcards?topic=${encodeURIComponent(topic.id)}`,
        },
        secondaryAction: {
          label: "Mini quiz",
          href: `/quiz?topic=${encodeURIComponent(topic.id)}&count=5`,
        },
      },
    );
  }

  const globals: LibraryItem[] = mockGlobalItems().map((row) => ({
    ...row,
    status: "not_started",
    isWeak: false,
  }));

  return [...fromTopics, ...globals];
}

export function librarySearchBlob(item: LibraryItem): string {
  return [
    item.title,
    item.description,
    item.module,
    LIBRARY_KIND_LABELS[item.kind],
  ]
    .join(" ")
    .toLowerCase();
}
