import { BASE_STUDY_BUDDY_PROMPT } from "./base";

export function buildQuizPrompt(input: {
  topic: string;
  count?: number;
  mode?: string;
}) {
  return `
${BASE_STUDY_BUDDY_PROMPT}

Create a ${input.mode || "normal"} quiz.

Topic:
${input.topic}

Question count:
${input.count || 10}

Use mixed question types:
- multiple_choice (provide choices array)
- true_false (choices optional)
- short_answer
- scenario

Return only valid JSON matching the schema: topic, questions array with id, type, question, choices optional, correctAnswer, explanation, commonTrap.
`.trim();
}
