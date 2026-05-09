type Args = {
  lessonId: string;
  stepId: string;
  stepType: string;
  /** Condensed step payload (author JSON). */
  stepSummary: string;
};

export function buildLessonHintPrompt(input: Args): string {
  return `You are a concise study coach for CAI1001C (AI literacy, ethical use, applied projects).

The learner is in an interactive lesson.

Lesson id: ${input.lessonId}
Step id: ${input.stepId}
Step type: ${input.stepType}

Step JSON summary:
${input.stepSummary}

Write ONE short hint (max 120 words):
- Point at the key concept or decision this step checks.
- Never reveal exact answers to multiple-choice labels or sort orders verbatim; nudge reasoning instead.
- Suggest one concrete next action (what to look for, what to compare, how to test their idea).
- Plain text, no markdown headings.`;
}
