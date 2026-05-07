import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { buildFlashcardsPrompt } from "@/lib/prompts/flashcards";
import { FlashcardsResponseSchema } from "@/lib/schemas/flashcards";
import { getTopicById } from "@/data/courseTopics";

type Body = {
  topic?: string;
  sourceText?: string;
  count?: number;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const topicId = typeof body.topic === "string" ? body.topic.trim() : "";
    if (!topicId) {
      return NextResponse.json({ error: "Missing topic." }, { status: 400 });
    }
    const meta = getTopicById(topicId);
    const topicLine = meta
      ? `${meta.title}. ${meta.description}`
      : topicId;
    const sourceText =
      typeof body.sourceText === "string" ? body.sourceText : undefined;
    const count =
      typeof body.count === "number" && body.count > 0 ? body.count : 10;

    const prompt = buildFlashcardsPrompt({
      topic: topicLine,
      sourceText: sourceText?.trim() || undefined,
      count,
    });
    const data = await generateJson(prompt, FlashcardsResponseSchema);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[flashcards]", err);
    return NextResponse.json(
      { error: "Flashcard generation failed." },
      { status: 500 },
    );
  }
}
