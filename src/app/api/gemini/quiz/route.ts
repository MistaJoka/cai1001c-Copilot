import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { buildQuizPrompt } from "@/lib/prompts/quiz";
import { QuizResponseSchema } from "@/lib/schemas/quiz";
import { getTopicById } from "@/data/courseTopics";

type Body = {
  topic?: string;
  count?: number;
  mode?: string;
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
      ? `${meta.title} (${meta.category}): ${meta.description}`
      : topicId;
    const count =
      typeof body.count === "number" && body.count > 0 ? body.count : 10;
    const mode = typeof body.mode === "string" ? body.mode : undefined;

    const prompt = buildQuizPrompt({
      topic: topicLine,
      count,
      mode,
    });
    const data = await generateJson(prompt, QuizResponseSchema);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[quiz]", err);
    return NextResponse.json(
      { error: "Quiz generation failed." },
      { status: 500 },
    );
  }
}
