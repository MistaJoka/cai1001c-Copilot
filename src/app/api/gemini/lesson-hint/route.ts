import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildLessonHintPrompt } from "@/lib/prompts/lessonHint";
import {
  LIMIT_LESSON_STEP_JSON,
  LIMIT_LESSON_STRING_ID,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

const bodySchema = z.object({
  lessonId: z.string().min(1).max(LIMIT_LESSON_STRING_ID),
  stepId: z.string().min(1).max(LIMIT_LESSON_STRING_ID),
  stepType: z.string().min(1).max(LIMIT_LESSON_STRING_ID),
  /** Serialized lesson step JSON from the client */
  step: z.unknown().optional(),
  learnerNote: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  const json = await readJsonBody(req);
  if (!json.ok) return json.response;

  try {
    const parsed = bodySchema.parse(json.data);
    let stepSummary = "(no step payload)";
    if (parsed.step !== undefined) {
      let serialized: string;
      try {
        serialized = JSON.stringify(parsed.step);
      } catch {
        return NextResponse.json(
          { error: "step could not be serialized." },
          { status: 400 },
        );
      }
      const tooStep = rejectIfTooLong(
        serialized,
        LIMIT_LESSON_STEP_JSON,
        "step",
      );
      if (tooStep) return tooStep;
      stepSummary = serialized.slice(0, 8000);
    }

    const prompt = buildLessonHintPrompt({
      lessonId: parsed.lessonId,
      stepId: parsed.stepId,
      stepType: parsed.stepType,
      stepSummary,
      learnerNote: parsed.learnerNote,
    });

    const output = await generateText(prompt);
    return NextResponse.json({ hint: output });
  } catch (err) {
    logRouteError("lesson-hint", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Could not fetch a hint right now. Try again shortly.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
