type Args = {
  lessonId: string;
  stepId: string;
  stepType: string;
  /** Condensed step payload (author JSON); server already strips secrets */
  stepSummary: string;
  learnerNote?: string;
};

/**
 * Short, actionable hint for the current lesson step — CAI1001C / GapCloser tone.
 */
export function buildLessonHintPrompt(input: Args): string {
  const note = input.learnerNote?.trim()
    ? `\nLearner wrote (optional): ${input.learnerNote.trim().slice(0, 800)}`
    : "";
  return `You are a concise study coach for CAI1001C (AI literacy, ethical use, applied projects).

The learner is in an interactive lesson (NOT Brilliant-proprietary content; avoid referencing any commercial course).

Lesson id: ${input.lessonId}
Step id: ${input.stepId}
Step type: ${input.stepType}

Step JSON summary:
${input.stepSummary}
${note}

Write ONE short hint (max 120 words):
- Point at the key concept or decision this step checks.
- Never give away exact answers to multiple-choice labels or sort orders verbatim; nudge reasoning instead.
- Suggest one concrete next action (what to look for, what to compare, how to test their idea).
- Plain text, no markdown headings, no emoji unless necessary for clarity.`;
}
