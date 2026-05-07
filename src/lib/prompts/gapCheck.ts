import { BASE_STUDY_BUDDY_PROMPT } from "./base";

export function buildGapCheckPrompt(input: {
  topic: string;
  studentAnswers: string;
}) {
  return `
${BASE_STUDY_BUDDY_PROMPT}

You are running Gap Check Mode.

Topic:
${input.topic}

Student answers:
${input.studentAnswers}

Analyze the answers.

Identify:
- what the student understands
- what the student is missing
- misconceptions
- next study action
- one repair lesson
- three follow-up questions

Return only valid JSON matching the schema provided by the API (topic, strengths, gaps, misconceptions, repairLesson, nextStudyActions array, followUpQuestions array, confidenceScore 0-100).
`.trim();
}
