import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildArtifactPrompt } from "@/lib/prompts/artifact";
import { getTopicById } from "@/data/courseTopics";
import {
  LIMIT_ARTIFACT_TYPE,
  LIMIT_TOPIC_ID,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

type Body = {
  topic?: string;
  artifactType?: string;
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
    const tooT = rejectIfTooLong(topicId, LIMIT_TOPIC_ID, "topic");
    if (tooT) return tooT;

    if (typeof body.artifactType === "string") {
      const tooA = rejectIfTooLong(
        body.artifactType,
        LIMIT_ARTIFACT_TYPE,
        "artifactType",
      );
      if (tooA) return tooA;
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
    logRouteError("artifact", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Artifact generation failed.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
