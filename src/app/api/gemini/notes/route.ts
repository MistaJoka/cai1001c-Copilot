import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { logRouteError, publicErrorFromCaught } from "@/lib/api-route-error";
import { readJsonBody } from "@/lib/request-json";
import { buildNotesPrompt } from "@/lib/prompts/notesBuilder";
import {
  LIMIT_SOURCE_TEXT_NOTES,
  rejectIfTooLong,
} from "@/lib/gemini-body-limits";

type Body = { sourceText?: string };

export async function POST(req: Request) {
  const json = await readJsonBody(req);
  if (!json.ok) return json.response;

  try {
    const body = json.data as Body;
    const sourceText =
      typeof body.sourceText === "string" ? body.sourceText.trim() : "";
    if (!sourceText) {
      return NextResponse.json(
        { error: "Missing sourceText." },
        { status: 400 },
      );
    }
    const too = rejectIfTooLong(
      sourceText,
      LIMIT_SOURCE_TEXT_NOTES,
      "sourceText",
    );
    if (too) return too;

    const prompt = buildNotesPrompt({ sourceText });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  } catch (err) {
    logRouteError("notes", err);
    const { message, status } = publicErrorFromCaught(
      err,
      "Notes build failed.",
    );
    return NextResponse.json({ error: message }, { status });
  }
}
