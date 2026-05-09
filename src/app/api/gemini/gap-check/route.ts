import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/gemini";
import { resolveTopic, withGeminiRoute } from "@/lib/api-route";
import { buildGapCheckPrompt } from "@/lib/prompts/gapCheck";
import { GapCheckResponseSchema } from "@/lib/schemas/gapCheck";
import {
  LIMIT_STUDENT_ANSWERS,
  LIMIT_TOPIC_ID,
} from "@/lib/gemini-body-limits";

const Body = z.object({
  topic: z.string().trim().min(1, "Missing topic.").max(LIMIT_TOPIC_ID),
  studentAnswers: z
    .string()
    .trim()
    .min(1, "Missing studentAnswers.")
    .max(LIMIT_STUDENT_ANSWERS),
});

export const POST = withGeminiRoute(
  "gap-check",
  "Gap check failed. Try again.",
  async (raw) => {
    const body = Body.parse(raw);
    const t = resolveTopic(body.topic)!;
    const topicLabel = t.meta
      ? `${t.meta.title} (${t.meta.category})`
      : t.id;

    const prompt = buildGapCheckPrompt({
      topic: topicLabel,
      studentAnswers: body.studentAnswers,
    });
    const data = await generateJson(prompt, GapCheckResponseSchema);
    return NextResponse.json(data);
  },
);
