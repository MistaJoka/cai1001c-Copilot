import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { buildTeachBackJsonPrompt } from "@/lib/prompts/teachBackPrompt";
import { TeachBackResponseSchema } from "@/lib/schemas/teachBack";
import { getTopicById } from "@/data/courseTopics";

type Body = {
  topic?: string;
  message?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json({ error: "Missing message." }, { status: 400 });
    }
    const topicId = typeof body.topic === "string" ? body.topic.trim() : "";
    const meta = topicId ? getTopicById(topicId) : undefined;
    const topicLine = meta
      ? `${meta.title} (${meta.category}): ${meta.description}`
      : topicId || "Not specified";

    const prompt = buildTeachBackJsonPrompt({
      topic: topicLine,
      studentExplanation: message,
    });
    const data = await generateJson(prompt, TeachBackResponseSchema);
    return NextResponse.json(data);
  } catch (err) {
    console.error("[teach-back]", err);
    return NextResponse.json(
      { error: "Teach-back scoring failed." },
      { status: 500 },
    );
  }
}
