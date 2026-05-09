import { NextResponse } from "next/server";
import { z } from "zod";
import { generateJson } from "@/lib/gemini";
import { resolveTopic, withGeminiRoute } from "@/lib/api-route";
import { buildTeachBackJsonPrompt } from "@/lib/prompts/teachBackPrompt";
import { TeachBackResponseSchema } from "@/lib/schemas/teachBack";
import { LIMIT_MESSAGE, LIMIT_TOPIC_ID } from "@/lib/gemini-body-limits";

const Body = z.object({
  message: z.string().trim().min(1, "Missing message.").max(LIMIT_MESSAGE),
  topic: z.string().trim().max(LIMIT_TOPIC_ID).optional(),
});

export const POST = withGeminiRoute(
  "teach-back",
  "Teach-back scoring failed.",
  async (raw) => {
    const body = Body.parse(raw);
    const t = resolveTopic(body.topic);
    const topicLine = t?.meta
      ? `${t.meta.title} (${t.meta.category}): ${t.meta.description}`
      : t?.id ?? "Not specified";

    const prompt = buildTeachBackJsonPrompt({
      topic: topicLine,
      studentExplanation: body.message,
    });
    const data = await generateJson(prompt, TeachBackResponseSchema);
    return NextResponse.json(data);
  },
);
