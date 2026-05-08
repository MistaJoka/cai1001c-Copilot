import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildQuizPrompt } from "@/lib/prompts/quiz";
import { QuizResponseSchema } from "@/lib/schemas/quiz";
import { getTopicById } from "@/data/courseTopics";
import {
  LIMIT_QUIZ_COUNT,
  LIMIT_QUIZ_MODE,
  LIMIT_TOPIC_ID,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

type Body = {
  topic?: string;
  count?: number;
  mode?: string;
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
      body.count > LIMIT_QUIZ_COUNT
    ) {
      return NextResponse.json(
        { error: `count cannot exceed ${LIMIT_QUIZ_COUNT}.` },
        { status: 413 },
      );
    }

    const meta = getTopicById(topicId);
    const topicLine = meta
      ? `${meta.title} (${meta.category}): ${meta.description}`
      : topicId;
    const count =
      typeof body.count === "number" && body.count > 0 ? body.count : 10;
    const mode = typeof body.mode === "string" ? body.mode.trim() : undefined;
    if (mode) {
      const tooMode = rejectIfTooLong(mode, LIMIT_QUIZ_MODE, "mode");
      if (tooMode) return tooMode;
    }

    const prompt = buildQuizPrompt({
      topic: topicLine,
      count,
      mode,
    });
    const data = await generateJson(prompt, QuizResponseSchema);
    return NextResponse.json(data);
  } catch (err) {
    logRouteError("quiz", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Quiz generation failed.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
