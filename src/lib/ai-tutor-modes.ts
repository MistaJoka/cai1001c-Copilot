import type { StudyAction } from "@/types";

export type TutorModeId =
  | "explain"
  | "quiz"
  | "example"
  | "understand"
  | "flashcards"
  | "summarize"
  | "realworld";

export type TutorMode = {
  id: TutorModeId;
  label: string;
  /** Routes through existing Study Buddy (`askStudyBuddy`) or teach-back API */
  channel: "buddy" | "teach-back";
  /** Passed to `/api/gemini/study-buddy` when channel is buddy */
  buddyAction?: string;
  /** Optional seed for the composer when empty */
  presetMessage?: string;
  /** Local progress tagging when the API call succeeds */
  progressAction?: StudyAction;
};

export const AI_TUTOR_MODES: readonly TutorMode[] = [
  {
    id: "explain",
    label: "Explain simply",
    channel: "buddy",
    buddyAction: "explain",
    progressAction: "explain",
  },
  {
    id: "quiz",
    label: "Quiz me",
    channel: "buddy",
    buddyAction: "quiz",
    presetMessage:
      "Ask me a few sharp quiz questions on this topic with brief explanations after each answer.",
    progressAction: "quiz",
  },
  {
    id: "example",
    label: "Give example",
    channel: "buddy",
    buddyAction: "explain",
    presetMessage:
      "Give me a concrete real-world example that illustrates the main idea.",
    progressAction: "explain",
  },
  {
    id: "understand",
    label: "Check my understanding",
    channel: "teach-back",
    presetMessage:
      "Here is my explanation in my own words — critique gaps and misconceptions:",
    progressAction: "teach-back",
  },
  {
    id: "flashcards",
    label: "Create flashcards",
    channel: "buddy",
    buddyAction: "flashcards",
    presetMessage:
      "Draft a compact set of flashcard fronts/backs I can rehearse tonight.",
    progressAction: "flashcards",
  },
  {
    id: "summarize",
    label: "Summarize topic",
    channel: "buddy",
    buddyAction: "notes",
    presetMessage:
      "Summarize the essential ideas I must remember for an exam in tight bullets.",
    progressAction: "notes",
  },
  {
    id: "realworld",
    label: "Connect to real-world use",
    channel: "buddy",
    buddyAction: "explain",
    presetMessage:
      "Connect this topic to how teams ship or monitor AI in production—constraints, risks, and stakeholders.",
    progressAction: "explain",
  },
] as const;

export function getTutorMode(id: TutorModeId): TutorMode | undefined {
  return AI_TUTOR_MODES.find((m) => m.id === id);
}
