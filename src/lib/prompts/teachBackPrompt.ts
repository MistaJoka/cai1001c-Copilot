import { BASE_STUDY_BUDDY_PROMPT } from "./base";

export function buildTeachBackJsonPrompt(input: {
  topic: string;
  studentExplanation: string;
}) {
  return `
${BASE_STUDY_BUDDY_PROMPT}

You are evaluating a teach-back: the student explains the topic in their own words.

Topic context:
${input.topic}

Student explanation:
${input.studentExplanation}

Return only valid JSON matching the schema (score 0-10, strengths array, gaps array, improvedAnswer string, nextAttemptPrompt string). Be constructive and specific.
`.trim();
}
