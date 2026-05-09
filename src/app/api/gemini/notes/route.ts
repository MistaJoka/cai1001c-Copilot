import { NextResponse } from "next/server";
import { z } from "zod";
import { generateText } from "@/lib/gemini";
import { withGeminiRoute } from "@/lib/api-route";
import { buildNotesPrompt } from "@/lib/prompts/notesBuilder";
import { LIMIT_SOURCE_TEXT_NOTES } from "@/lib/gemini-body-limits";

const Body = z.object({
  sourceText: z
    .string()
    .trim()
    .min(1, "Missing sourceText.")
    .max(LIMIT_SOURCE_TEXT_NOTES),
});

export const POST = withGeminiRoute(
  "notes",
  "Notes build failed.",
  async (raw) => {
    const body = Body.parse(raw);
    const prompt = buildNotesPrompt({ sourceText: body.sourceText });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  },
);
