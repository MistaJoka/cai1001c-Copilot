import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/gemini";
import { resolveTopic, withGeminiRoute } from "@/lib/api-route";
import { buildFlashcardsPrompt } from "@/lib/prompts/flashcards";
import { FlashcardsResponseSchema } from "@/lib/schemas/flashcards";
import {
  LIMIT_FLASHCARD_COUNT,
  LIMIT_SOURCE_TEXT_FLASHCARDS,
  LIMIT_TOPIC_ID,
} from "@/lib/gemini-body-limits";

const Body = z.object({
  topic: z.string().trim().min(1, "Missing topic.").max(LIMIT_TOPIC_ID),
  sourceText: z
    .string()
    .max(LIMIT_SOURCE_TEXT_FLASHCARDS)
    .transform((s) => s.trim())
    .optional(),
  count: z.number().int().positive().max(LIMIT_FLASHCARD_COUNT).optional(),
});

export const POST = withGeminiRoute(
  "flashcards",
  "Flashcard generation failed.",
  async (raw) => {
    const body = Body.parse(raw);
    const t = resolveTopic(body.topic)!;
    const topicLine = t.meta ? `${t.meta.title}. ${t.meta.description}` : t.id;
    const prompt = buildFlashcardsPrompt({
      topic: topicLine,
      sourceText: body.sourceText || undefined,
      count: body.count ?? 10,
    });
    const data = await generateJson(prompt, FlashcardsResponseSchema);
    return NextResponse.json(data);
  },
);
