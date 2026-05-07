import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { buildGapCheckPrompt } from "@/lib/prompts/gapCheck";
import { GapCheckResponseSchema } from "@/lib/schemas/gapCheck";
import { getTopicById } from "@/data/courseTopics";

type Body = {
  topic?: string;
  studentAnswers?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const topicId = typeof body.topic === "string" ? body.topic.trim() : "";
    const studentAnswers =
      typeof body.studentAnswers === "string" ? body.studentAnswers.trim() : "";
    if (!topicId || !studentAnswers) {
      return NextResponse.json(
        { error: "Missing topic or studentAnswers." },
        { status: 400 },
      );
    }
    const meta = getTopicById(topicId);
    const topicLabel = meta
      ? `${meta.title} (${meta.category})`
      : topicId;

    const prompt = buildGapCheckPrompt({
      topic: topicLabel,
      studentAnswers,
    });
    const data = await generateJson(prompt, GapCheckResponseSchema);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[gap-check]", err);
    return NextResponse.json(
      { error: "Gap check failed. Try again." },
      { status: 500 },
    );
  }
}
