import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { resolveTopic, withGeminiRoute } from "@/lib/api-route";
import { buildArtifactPrompt } from "@/lib/prompts/artifact";
import {
  LIMIT_ARTIFACT_TYPE,
  LIMIT_TOPIC_ID,
} from "@/lib/gemini-body-limits";

const Body = z.object({
  topic: z.string().trim().min(1, "Missing topic.").max(LIMIT_TOPIC_ID),
  artifactType: z.string().max(LIMIT_ARTIFACT_TYPE).optional(),
});

export const POST = withGeminiRoute(
  "artifact",
  "Artifact generation failed.",
  async (raw) => {
    const body = Body.parse(raw);
    const t = resolveTopic(body.topic)!;
    const topicLine = t.meta
      ? `${t.meta.title} — ${t.meta.description}`
      : t.id;

    const prompt = buildArtifactPrompt({
      topic: topicLine,
      artifactType: body.artifactType,
    });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  },
);
