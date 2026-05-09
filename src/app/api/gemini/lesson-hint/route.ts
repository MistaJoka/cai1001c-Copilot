import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { withGeminiRoute } from "@/lib/api-route";
import { buildLessonHintPrompt } from "@/lib/prompts/lessonHint";
import {
  LIMIT_LESSON_STEP_JSON,
  LIMIT_LESSON_STRING_ID,
} from "@/lib/gemini-body-limits";

const Body = z.object({
  lessonId: z.string().min(1).max(LIMIT_LESSON_STRING_ID),
  stepId: z.string().min(1).max(LIMIT_LESSON_STRING_ID),
  stepType: z.string().min(1).max(LIMIT_LESSON_STRING_ID),
  step: z.unknown().optional(),
});

export const POST = withGeminiRoute(
  "lesson-hint",
  "Could not fetch a hint right now. Try again shortly.",
  async (raw) => {
    const body = Body.parse(raw);

    let stepSummary = "(no step payload)";
    if (body.step !== undefined) {
      let serialized: string;
      try {
        serialized = JSON.stringify(body.step);
      } catch {
        return NextResponse.json(
          { error: "step could not be serialized." },
          { status: 400 },
        );
      }
      if (serialized.length > LIMIT_LESSON_STEP_JSON) {
        return NextResponse.json(
          {
            error: `step is too long (max ${LIMIT_LESSON_STEP_JSON} characters).`,
          },
          { status: 413 },
        );
      }
      stepSummary = serialized.slice(0, 8000);
    }

    const prompt = buildLessonHintPrompt({
      lessonId: body.lessonId,
      stepId: body.stepId,
      stepType: body.stepType,
      stepSummary,
    });
    const output = await generateText(prompt);
    return NextResponse.json({ hint: output });
  },
);
