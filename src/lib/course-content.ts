import { courseTopics, getTopicById } from "@/data/courseTopics";
import type { StudyAction as ProgressStudyAction } from "@/types";

/** CAI1001C syllabus grouping — one row per distinct `courseTopics` category. */
export type CourseModule = {
  id: string;
  title: string;
  categoryLabel: string;
  topicIds: readonly string[];
};

/** Catalog-backed lesson shell (1:1 with a topic when present). */
export type Lesson = {
  id: string;
  moduleId: string;
  topicId: string;
  title: string;
  summary: string;
  category: string;
};

export type Concept = {
  id: string;
  lessonId: string;
  topicId: string;
  title: string;
  summary: string;
};

export type QuizSummary = {
  id: string;
  topicId: string;
  title: string;
  questionCount: number;
  href: string;
};

export type FlashcardDeckSummary = {
  id: string;
  topicId: string;
  title: string;
  estimatedCards: number;
  href: string;
};

export type ProjectSummary = {
  id: string;
  title: string;
  description: string;
  module: string;
  estimatedMinutes: number;
  difficulty: "intro" | "core" | "stretch";
  primaryHref: string;
  primaryLabel: string;
  secondaryHref: string;
  secondaryLabel: string;
};

export type WeakArea = {
  id: string;
  topicId: string;
  title: string;
  rationale: string;
  suggestedMinutes: number;
};

/**
 * Layout/demo study affordance — optional link to persisted {@link ProgressStudyAction}.
 */
export type StudyAction = {
  id: string;
  label: string;
  hint?: string;
  href: string;
  topicId?: string;
  progressAction?: ProgressStudyAction;
};

export type QuestNodeKind = "module" | "boss" | "review_gate";

export type QuestNode = {
  id: string;
  title: string;
  kind: QuestNodeKind;
  topicIds: readonly string[];
  estimatedMinutes: number;
  ctaHref: string;
  ctaLabel: string;
};

export type NotebookSample = {
  id: string;
  title: string;
  body: string;
  keyTakeaways: string;
  confusingPoints: string;
  questionsLater: string;
};

function slugPart(raw: string): string {
  const s = raw
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s.length > 0 ? s : "topic";
}

function buildCourseModules(): CourseModule[] {
  const order: string[] = [];
  const topicIdsByCat = new Map<string, string[]>();

  for (const t of courseTopics) {
    if (!topicIdsByCat.has(t.category)) {
      order.push(t.category);
      topicIdsByCat.set(t.category, []);
    }
    topicIdsByCat.get(t.category)!.push(t.id);
  }

  const used = new Set<string>();
  return order.map((category) => {
    const base = `mod-${slugPart(category)}`;
    let id = base;
    let n = 1;
    while (used.has(id)) {
      id = `${base}-${n}`;
      n += 1;
    }
    used.add(id);
    return {
      id,
      title: category,
      categoryLabel: category,
      topicIds: topicIdsByCat.get(category)! as readonly string[],
    };
  });
}

export const COURSE_MODULES: readonly CourseModule[] = buildCourseModules();

const moduleIdByTopicId = new Map<string, string>();
for (const m of COURSE_MODULES) {
  for (const tid of m.topicIds) {
    moduleIdByTopicId.set(tid, m.id);
  }
}

function buildLessons(): Lesson[] {
  return courseTopics.map((t) => ({
    id: `lesson-${t.id}`,
    moduleId: moduleIdByTopicId.get(t.id) ?? "mod-unknown",
    topicId: t.id,
    title: t.title,
    summary: t.description,
    category: t.category,
  }));
}

export const COURSE_LESSONS: readonly Lesson[] = buildLessons();

function buildConcepts(): Concept[] {
  const out: Concept[] = [];
  for (const t of courseTopics) {
    for (let i = 0; i < Math.min(2, t.keyTerms.length); i++) {
      const term = t.keyTerms[i]!;
      const slug = slugPart(term);
      out.push({
        id: `concept-${t.id}-${slug}`,
        lessonId: `lesson-${t.id}`,
        topicId: t.id,
        title: term,
        summary:
          t.examFocus[i] ??
          t.examFocus[0] ??
          t.description.slice(0, 160),
      });
    }
  }
  return out;
}

export const COURSE_CONCEPTS: readonly Concept[] = buildConcepts();

export const COURSE_QUIZ_SUMMARIES: readonly QuizSummary[] = courseTopics.map(
  (t) => ({
    id: `quiz-${t.id}`,
    topicId: t.id,
    title: `Quiz · ${t.title}`,
    questionCount: 8,
    href: `/quiz?topic=${encodeURIComponent(t.id)}&count=8`,
  }),
);

export const COURSE_FLASHCARD_DECK_SUMMARIES: readonly FlashcardDeckSummary[] =
  courseTopics.map((t) => ({
    id: `deck-${t.id}`,
    topicId: t.id,
    title: `Deck · ${t.title}`,
    estimatedCards: 10,
    href: `/flashcards?topic=${encodeURIComponent(t.id)}`,
  }));

const lessonByTopic = new Map(COURSE_LESSONS.map((l) => [l.topicId, l]));
const moduleById = new Map(COURSE_MODULES.map((m) => [m.id, m]));

export function getCourseModule(id: string): CourseModule | undefined {
  return moduleById.get(id);
}

export function getLessonByTopicId(topicId: string): Lesson | undefined {
  return lessonByTopic.get(topicId);
}

export function getQuizSummaryForTopic(topicId: string): QuizSummary | undefined {
  return COURSE_QUIZ_SUMMARIES.find((q) => q.topicId === topicId);
}

export function getDeckSummaryForTopic(
  topicId: string,
): FlashcardDeckSummary | undefined {
  return COURSE_FLASHCARD_DECK_SUMMARIES.find((d) => d.topicId === topicId);
}

export function listConceptsForTopic(topicId: string): Concept[] {
  return COURSE_CONCEPTS.filter((c) => c.topicId === topicId);
}

/** Guard for layout configs — ensures topic ids still exist in the catalog. */
export function isCatalogTopicId(id: string): boolean {
  return Boolean(getTopicById(id));
}
