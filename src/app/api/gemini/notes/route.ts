import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildNotesPrompt } from "@/lib/prompts/notesBuilder";

type Body = { sourceText?: string };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const sourceText =
      typeof body.sourceText === "string" ? body.sourceText.trim() : "";
    if (!sourceText) {
      return NextResponse.json(
        { error: "Missing sourceText." },
        { status: 400 },
      );
    }
    const prompt = buildNotesPrompt({ sourceText });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  } catch (err) {
    console.error("[notes]", err);
    return NextResponse.json(
      { error: "Notes build failed." },
      { status: 500 },
    );
  }
}
