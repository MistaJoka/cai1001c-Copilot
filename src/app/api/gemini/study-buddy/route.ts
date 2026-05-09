import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { resolveTopic, withGeminiRoute } from "@/lib/api-route";
import { buildStudyBuddyPrompt } from "@/lib/prompts/studyBuddy";
import {
  LIMIT_MESSAGE,
  LIMIT_STUDY_ACTION,
  LIMIT_TOPIC_ID,
} from "@/lib/gemini-body-limits";

const Body = z.object({
  message: z.string().trim().min(1, "Missing message.").max(LIMIT_MESSAGE),
  topic: z.string().trim().max(LIMIT_TOPIC_ID).optional(),
  action: z.string().max(LIMIT_STUDY_ACTION).optional(),
});

export const POST = withGeminiRoute(
  "study-buddy",
  "Something went wrong.",
  async (raw) => {
    const body = Body.parse(raw);
    const t = resolveTopic(body.topic);
    const topicLine = t?.meta
      ? `${t.meta.title} — ${t.meta.description.slice(0, 200)}`
      : t?.id;

    const prompt = buildStudyBuddyPrompt({
      message: body.message,
      topic: topicLine,
      action: body.action,
    });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  },
);
