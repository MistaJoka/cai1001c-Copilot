import { BASE_STUDY_BUDDY_PROMPT } from "./base";

export function buildFlashcardsPrompt(input: {
  topic?: string;
  sourceText?: string;
  count?: number;
}) {
  return `
${BASE_STUDY_BUDDY_PROMPT}

Create ${input.count || 10} useful flashcards.

Topic:
${input.topic || "Not specified"}

Source text:
${input.sourceText || "No source text provided."}

Card types to include:
- definition
- example
- compare
- scenario
- common mistake
- exam trap

Return only valid JSON matching the schema (topic string, cards array with front, back, type one of: definition, example, compare, scenario, common_mistake, exam_trap).
`.trim();
}
