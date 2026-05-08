import { NextResponse } from "next/server";
import { generateJson } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildGapCheckPrompt } from "@/lib/prompts/gapCheck";
import { GapCheckResponseSchema } from "@/lib/schemas/gapCheck";
import { getTopicById } from "@/data/courseTopics";
import {
  LIMIT_STUDENT_ANSWERS,
  LIMIT_TOPIC_ID,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

type Body = {
  topic?: string;
  studentAnswers?: string;
};

export async function POST(req: Request) {
  const json = await readJsonBody(req);
  if (!json.ok) return json.response;

  try {
    const body = json.data as Body;
    const topicId = typeof body.topic === "string" ? body.topic.trim() : "";
    const studentAnswers =
      typeof body.studentAnswers === "string" ? body.studentAnswers.trim() : "";
    if (!topicId || !studentAnswers) {
      return NextResponse.json(
        { error: "Missing topic or studentAnswers." },
        { status: 400 },
      );
    }
    const tooT = rejectIfTooLong(topicId, LIMIT_TOPIC_ID, "topic");
    if (tooT) return tooT;
    const tooA = rejectIfTooLong(
      studentAnswers,
      LIMIT_STUDENT_ANSWERS,
      "studentAnswers",
    );
    if (tooA) return tooA;

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
    logRouteError("gap-check", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Gap check failed. Try again.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
