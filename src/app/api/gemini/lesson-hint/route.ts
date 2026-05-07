import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { buildLessonHintPrompt } from "@/lib/prompts/lessonHint";

const bodySchema = z.object({
  lessonId: z.string().min(1),
  stepId: z.string().min(1),
  stepType: z.string().min(1),
  /** Serialized lesson step JSON from the client */
  step: z.any().optional(),
  learnerNote: z.string().max(2000).optional(),
});

export async function POST(req: Request) {
  try {
    const raw = await req.json();
    const parsed = bodySchema.parse(raw);
    const stepSummary =
      parsed.step !== undefined
        ? JSON.stringify(parsed.step).slice(0, 8000)
        : "(no step payload)";

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
    console.error("[lesson-hint]", err);
    const msg = err instanceof Error ? err.message : "Failed.";
    return NextResponse.json(
      {
        error: msg.includes("GEMINI_API_KEY")
          ? msg
          : "Could not fetch a hint right now. Try again shortly.",
      },
      { status: err instanceof z.ZodError ? 400 : 500 },
    );
  }
}
