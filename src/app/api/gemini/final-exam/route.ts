import { NextResponse } from "next/server";
import { generateText } from "@/lib/gemini";
import { buildFinalExamPrompt } from "@/lib/prompts/finalExam";
import { getTopicById } from "@/data/courseTopics";

type Body = { weakTopics?: string[] };

export async function POST(req: Request) {
  try {
    const body = (await req.json()) as Body;
    const ids = Array.isArray(body.weakTopics) ? body.weakTopics : [];
    const labels = ids
      .map((id) => {
        const t = getTopicById(String(id));
        return t ? t.title : String(id);
      })
      .filter(Boolean);

    const prompt = buildFinalExamPrompt({
      weakTopics: labels.length ? labels : undefined,
    });
    const output = await generateText(prompt);
    return NextResponse.json({ output });
  } catch (err) {
    console.error("[final-exam]", err);
    return NextResponse.json(
      { error: "Final exam prep failed." },
      { status: 500 },
    );
  }
}
