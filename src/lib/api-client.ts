import type { FlashcardsResponse } from "@/lib/schemas/flashcards";
import type { GapCheckResponse } from "@/lib/schemas/gapCheck";
import type { QuizResponse } from "@/lib/schemas/quiz";
import type { TeachBackResponse } from "@/lib/schemas/teachBack";

async function postJson<T>(
  path: string,
  body: unknown,
): Promise<T> {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg =
      typeof json?.error === "string" ? json.error : `Request failed (${res.status})`;
    throw new Error(msg);
  }
  return json as T;
}

export async function askStudyBuddy(input: {
  message: string;
  topic?: string;
  action?: string;
}): Promise<{ output: string }> {
  return postJson("/api/gemini/study-buddy", input);
}

export async function runGapCheck(input: {
  topic: string;
  studentAnswers: string;
}): Promise<GapCheckResponse> {
  return postJson("/api/gemini/gap-check", input);
}

export async function generateFlashcards(input: {
  topic: string;
  sourceText?: string;
  count?: number;
}): Promise<FlashcardsResponse> {
  return postJson("/api/gemini/flashcards", input);
}

export async function generateQuiz(input: {
  topic: string;
  count?: number;
  mode?: string;
}): Promise<QuizResponse> {
  return postJson("/api/gemini/quiz", input);
}

export async function buildNotes(input: {
  sourceText: string;
}): Promise<{ output: string }> {
  return postJson("/api/gemini/notes", input);
}

export async function buildFinalExamPrep(input: {
  weakTopics?: string[];
}): Promise<{ output: string }> {
  return postJson("/api/gemini/final-exam", input);
}

export async function runTeachBack(input: {
  topic?: string;
  message: string;
}): Promise<TeachBackResponse> {
  return postJson("/api/gemini/teach-back", input);
}

export async function buildArtifact(input: {
  topic: string;
  artifactType?: string;
}): Promise<{ output: string }> {
  return postJson("/api/gemini/artifact", input);
}

export async function fetchLessonHint(input: {
  lessonId: string;
  stepId: string;
  stepType: string;
  step: Record<string, unknown>;
}): Promise<{ hint: string }> {
  return postJson("/api/gemini/lesson-hint", input);
}
