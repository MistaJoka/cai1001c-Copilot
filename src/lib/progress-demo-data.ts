/**
 * Static weak-area + study-action vignettes for dashboards and layout demos.
 * Does not replace browser-local progress — narrative hints only.
 */

import type { StudyAction, WeakArea } from "@/lib/course-content";

export const DEMO_WEAK_AREAS: readonly WeakArea[] = [
  {
    id: "weak-supervised-learning",
    topicId: "supervised-learning",
    title: "Supervised vs unsupervised boundaries",
    rationale:
      "Quiz items often blur labeling assumptions — rehearse definitions with contrast pairs.",
    suggestedMinutes: 28,
  },
  {
    id: "weak-ai-ethics",
    topicId: "ai-ethics",
    title: "Bias lifecycle framing",
    rationale:
      "Exam prompts ask for mitigation across data → deploy; rehearse concrete checkpoints.",
    suggestedMinutes: 32,
  },
  {
    id: "weak-neural-networks",
    topicId: "neural-networks",
    title: "Capacity vs generalization story",
    rationale:
      "Boss checkpoints probe why bigger nets alone don’t fix bad data or objectives.",
    suggestedMinutes: 35,
  },
];

export const DEMO_STUDY_ACTIONS: readonly StudyAction[] = [
  {
    id: "demo-gap-supervised",
    label: "Gap check · supervised learning",
    hint: "Cold-recall objectives before the next quiz.",
    href: "/gap-check?topic=supervised-learning",
    topicId: "supervised-learning",
    progressAction: "gap-check",
  },
  {
    id: "demo-quiz-neural",
    label: "Quiz · neural networks",
    hint: "Eight retrieval questions tied to catalog context.",
    href: "/quiz?topic=neural-networks&count=8",
    topicId: "neural-networks",
    progressAction: "quiz",
  },
  {
    id: "demo-flash-ai-terminology",
    label: "Flashcards · AI terminology",
    hint: "Lock vocabulary before history + foundations segments.",
    href: "/flashcards?topic=ai-terminology",
    topicId: "ai-terminology",
    progressAction: "flashcards",
  },
  {
    id: "demo-teachback-deployment",
    label: "Teach-back · deployment readiness",
    hint: "Narrate risks before the review gate.",
    href: "/ai-tutor?topic=deployment",
    topicId: "deployment",
    progressAction: "explain",
  },
];
