import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildStudyBuddyPrompt } from "@/lib/prompts/studyBuddy";
import { getTopicById } from "@/data/courseTopics";

type Body = {
  message?: string;
  topic?: string;
  action?: string;
};

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json(
        { error: "Missing message." },
        { status: 400 },
      );
    }
    const topicMeta = body.topic ? getTopicById(body.topic) : undefined;
    const topicLine = topicMeta
      ? `${topicMeta.title} — ${topicMeta.description.slice(0, 200)}`
      : body.topic || undefined;

    const prompt = buildStudyBuddyPrompt({
      message,
      topic: topicLine,
      action: body.action,
    });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  } catch (err) {
    console.error("[study-buddy]", err);
    const msg =
      err instanceof Error ? err.message : "Failed to generate response.";
    return NextResponse.json(
      { error: msg.includes("GEMINI_API_KEY") ? msg : "Something went wrong." },
      { status: 500 },
    );
  }
}
