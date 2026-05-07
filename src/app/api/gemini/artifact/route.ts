import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildArtifactPrompt } from "@/lib/prompts/artifact";
import { getTopicById } from "@/data/courseTopics";

type Body = {
  topic?: string;
  artifactType?: string;
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
      ? `${meta.title} — ${meta.description}`
      : topicId;
    const artifactType =
      typeof body.artifactType === "string" ? body.artifactType : undefined;

    const prompt = buildArtifactPrompt({ topic: topicLine, artifactType });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  } catch (err) {
    console.error("[artifact]", err);
    return NextResponse.json(
      { error: "Artifact generation failed." },
      { status: 500 },
    );
  }
}
