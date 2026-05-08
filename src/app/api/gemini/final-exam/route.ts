import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildFinalExamPrompt } from "@/lib/prompts/finalExam";
import { getTopicById } from "@/data/courseTopics";
import {
  LIMIT_TOPIC_ID,
  LIMIT_WEAK_TOPICS_COUNT,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

type Body = { weakTopics?: unknown };

export async function POST(req: Request) {
  const json = await readJsonBody(req);
  if (!json.ok) return json.response;

  try {
    const body = json.data as Body;
    const raw = Array.isArray(body.weakTopics) ? body.weakTopics : [];
    if (raw.length > LIMIT_WEAK_TOPICS_COUNT) {
      return NextResponse.json(
        {
          error: `weakTopics cannot list more than ${LIMIT_WEAK_TOPICS_COUNT} items.`,
        },
        { status: 413 },
      );
    }
    const ids = raw.filter((id): id is string => typeof id === "string");
    for (let i = 0; i < ids.length; i++) {
      const too = rejectIfTooLong(
        ids[i],
        LIMIT_TOPIC_ID,
        `weakTopics[${i}]`,
      );
      if (too) return too;
    }
    const labels = ids
      .map((id) => {
        const t = getTopicById(id);
        return t ? t.title : id;
      })
      .filter(Boolean);

    const prompt = buildFinalExamPrompt({
      weakTopics: labels.length ? labels : undefined,
    });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  } catch (err) {
    logRouteError("final-exam", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Final exam prep failed.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
