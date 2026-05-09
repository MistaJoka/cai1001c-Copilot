import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/gemini";
import { resolveTopic, withGeminiRoute } from "@/lib/api-route";
import { buildQuizPrompt } from "@/lib/prompts/quiz";
import { QuizResponseSchema } from "@/lib/schemas/quiz";
import {
  LIMIT_QUIZ_COUNT,
  LIMIT_QUIZ_MODE,
  LIMIT_TOPIC_ID,
} from "@/lib/gemini-body-limits";

const Body = z.object({
  topic: z.string().trim().min(1, "Missing topic.").max(LIMIT_TOPIC_ID),
  count: z.number().int().positive().max(LIMIT_QUIZ_COUNT).optional(),
  mode: z.string().trim().max(LIMIT_QUIZ_MODE).optional(),
});

export const POST = withGeminiRoute("quiz", "Quiz generation failed.", async (raw) => {
  const body = Body.parse(raw);
  const t = resolveTopic(body.topic)!;
  const topicLine = t.meta
    ? `${t.meta.title} (${t.meta.category}): ${t.meta.description}`
    : t.id;
  const prompt = buildQuizPrompt({
    topic: topicLine,
    count: body.count ?? 10,
    mode: body.mode || undefined,
  });
  const data = await generateJson(prompt, QuizResponseSchema);
  return NextResponse.json(data);
});
