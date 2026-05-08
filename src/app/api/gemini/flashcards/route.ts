import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildFlashcardsPrompt } from "@/lib/prompts/flashcards";
import { FlashcardsResponseSchema } from "@/lib/schemas/flashcards";
import { getTopicById } from "@/data/courseTopics";
import {
  LIMIT_FLASHCARD_COUNT,
  LIMIT_SOURCE_TEXT_FLASHCARDS,
  LIMIT_TOPIC_ID,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

type Body = {
  topic?: string;
  sourceText?: string;
  count?: number;
};

export async function POST(req: Request) {
  const json = await readJsonBody(req);
  if (!json.ok) return json.response;

  try {
    const body = json.data as Body;
    const topicId = typeof body.topic === "string" ? body.topic.trim() : "";
    if (!topicId) {
      return NextResponse.json({ error: "Missing topic." }, { status: 400 });
    }
    const tooTopic = rejectIfTooLong(topicId, LIMIT_TOPIC_ID, "topic");
    if (tooTopic) return tooTopic;

    if (
      typeof body.count === "number" &&
      body.count > LIMIT_FLASHCARD_COUNT
    ) {
      return NextResponse.json(
        { error: `count cannot exceed ${LIMIT_FLASHCARD_COUNT}.` },
        { status: 413 },
      );
    }

    const meta = getTopicById(topicId);
    const topicLine = meta
      ? `${meta.title}. ${meta.description}`
      : topicId;
    const trimmedSource =
      typeof body.sourceText === "string"
        ? body.sourceText.trim()
        : undefined;
    if (trimmedSource) {
      const tooSrc = rejectIfTooLong(
        trimmedSource,
        LIMIT_SOURCE_TEXT_FLASHCARDS,
        "sourceText",
      );
      if (tooSrc) return tooSrc;
    }
    const count =
      typeof body.count === "number" && body.count > 0 ? body.count : 10;

    const prompt = buildFlashcardsPrompt({
      topic: topicLine,
      sourceText: trimmedSource || undefined,
      count,
    });
    const data = await generateJson(prompt, FlashcardsResponseSchema);
    return NextResponse.json(data);
  } catch (err) {
    logRouteError("flashcards", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Flashcard generation failed.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
