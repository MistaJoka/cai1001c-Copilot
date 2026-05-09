import {
  courseTopics,
  getTopicById,
  type CourseTopic,
} from "@/data/courseTopics";

export type AiTutorCourseContext = {
  id: string;
  label: string;
  /** Preferred catalog ids — unknown ids are ignored at runtime */
  topicIds: readonly string[];
};

/** Course buckets for the context selector (labels fixed per product brief). */
export const AI_TUTOR_COURSE_CONTEXTS: readonly AiTutorCourseContext[] = [
  {
    id: "ai-basics",
    label: "AI Basics",
    topicIds: [
      "ai-terminology",
      "ai-history",
      "ai-project-cycle",
      "digital-literacy",
    ],
  },
  {
    id: "machine-learning",
    label: "Machine Learning",
    topicIds: [
      "supervised-learning",
      "unsupervised-learning",
      "modeling",
      "classification",
      "model-training",
    ],
  },
  {
    id: "neural-networks",
    label: "Neural Networks",
    topicIds: [
      "neural-networks",
      "linear-classifiers",
      "decision-trees-ml",
      "python-classification-labs",
    ],
  },
  {
    id: "ethics",
    label: "Ethics",
    topicIds: [
      "ai-ethics",
      "algorithmic-privacy-fairness",
      "computing-ethics-lifecycle",
    ],
  },
  {
    id: "final-review",
    label: "Final Review",
    topicIds: ["evaluation", "deployment", "enterprise-ai-readiness"],
  },
] as const;

export function topicsForContext(contextId: string): CourseTopic[] {
  const bucket = AI_TUTOR_COURSE_CONTEXTS.find((c) => c.id === contextId);
  if (!bucket) return [];
  const seen = new Set(courseTopics.map((t) => t.id));
  return bucket.topicIds
    .filter((id) => seen.has(id))
    .map((id) => getTopicById(id))
    .filter((t): t is CourseTopic => Boolean(t));
}
