export type StudyAction =
  | "explain"
  | "quiz"
  | "flashcards"
  | "gap-check"
  | "teach-back"
  | "notes"
  | "artifact"
  | "final-exam";

export type ConfidenceLevel = "low" | "medium" | "high";

export type StudyProgress = {
  topicId: string;
  confidence: ConfidenceLevel;
  lastQuizScore?: number;
  completedActions: StudyAction[];
  updatedAt: string;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export type ProgressMap = Record<string, StudyProgress>;
