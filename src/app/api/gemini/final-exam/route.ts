import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { withGeminiRoute } from "@/lib/api-route";
import { getTopicById } from "@/data/courseTopics";
import { buildFinalExamPrompt } from "@/lib/prompts/finalExam";
import {
  LIMIT_TOPIC_ID,
  LIMIT_WEAK_TOPICS_COUNT,
} from "@/lib/gemini-body-limits";

const Body = z.object({
  weakTopics: z
    .array(z.string().max(LIMIT_TOPIC_ID))
    .max(LIMIT_WEAK_TOPICS_COUNT)
    .optional(),
});

export const POST = withGeminiRoute(
  "final-exam",
  "Final exam prep failed.",
  async (raw) => {
    const body = Body.parse(raw);
    const labels = (body.weakTopics ?? []).map(
      (id) => getTopicById(id)?.title ?? id,
    );

    const prompt = buildFinalExamPrompt({
      weakTopics: labels.length ? labels : undefined,
    });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  },
);
