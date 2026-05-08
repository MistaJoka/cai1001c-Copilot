import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildStudyBuddyPrompt } from "@/lib/prompts/studyBuddy";
import { getTopicById } from "@/data/courseTopics";
import {
  LIMIT_MESSAGE,
  LIMIT_STUDY_ACTION,
  LIMIT_TOPIC_ID,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

type Body = {
  message?: string;
  topic?: string;
  action?: string;
};

export async function POST(req: Request) {
  const json = await readJsonBody(req);
  if (!json.ok) return json.response;

  try {
    const body = json.data as Body;
    const message = typeof body.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json(
        { error: "Missing message." },
        { status: 400 },
      );
    }
    const tooMsg = rejectIfTooLong(message, LIMIT_MESSAGE, "message");
    if (tooMsg) return tooMsg;

    const topicRaw =
      typeof body.topic === "string" ? body.topic.trim() : "";
    if (topicRaw) {
      const tooTopic = rejectIfTooLong(topicRaw, LIMIT_TOPIC_ID, "topic");
      if (tooTopic) return tooTopic;
    }
    const topicMeta = topicRaw ? getTopicById(topicRaw) : undefined;
    const topicLine = topicMeta
      ? `${topicMeta.title} — ${topicMeta.description.slice(0, 200)}`
      : topicRaw || undefined;

    let action: string | undefined;
    if (typeof body.action === "string") {
      const tooAct = rejectIfTooLong(
        body.action,
        LIMIT_STUDY_ACTION,
        "action",
      );
      if (tooAct) return tooAct;
      action = body.action;
    }

    const prompt = buildStudyBuddyPrompt({
      message,
      topic: topicLine,
      action,
    });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  } catch (err) {
    logRouteError("study-buddy", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Something went wrong.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
