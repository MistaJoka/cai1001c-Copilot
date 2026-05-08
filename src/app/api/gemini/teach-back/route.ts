import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildTeachBackJsonPrompt } from "@/lib/prompts/teachBackPrompt";
import { TeachBackResponseSchema } from "@/lib/schemas/teachBack";
import { getTopicById } from "@/data/courseTopics";
import {
  LIMIT_MESSAGE,
  LIMIT_TOPIC_ID,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

type Body = {
  topic?: string;
  message?: string;
};

export async function POST(req: Request) {
  const json = await readJsonBody(req);
  if (!json.ok) return json.response;

  try {
    const body = json.data as Body;
    const message =
      typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json({ error: "Missing message." }, { status: 400 });
    }
    const tooM = rejectIfTooLong(message, LIMIT_MESSAGE, "message");
    if (tooM) return tooM;

    const topicId = typeof body.topic === "string" ? body.topic.trim() : "";
    if (topicId) {
      const tooT = rejectIfTooLong(topicId, LIMIT_TOPIC_ID, "topic");
      if (tooT) return tooT;
    }
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
    logRouteError("teach-back", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Teach-back scoring failed.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
