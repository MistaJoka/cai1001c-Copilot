import { GoogleGenAI } from "@google/genai";
import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { parseJsonWithSchema } from "@/lib/parse-json-with-schema";
import { FlashcardsResponseSchema } from "@/lib/schemas/flashcards";
import { GapCheckResponseSchema } from "@/lib/schemas/gapCheck";
import { QuizResponseSchema } from "@/lib/schemas/quiz";
import { TeachBackResponseSchema } from "@/lib/schemas/teachBack";

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

export function isGeminiMock(): boolean {
  return process.env.GEMINI_MOCK?.trim().toLowerCase() === "true";
}

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (isGeminiMock()) {
    throw new Error("GEMINI_MOCK is enabled; getClient must not be called.");
  }
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey || apiKey === "replace_with_your_gemini_api_key") {
    throw new Error(
      "Missing GEMINI_API_KEY. Add it to .env.local or set GEMINI_MOCK=true.",
    );
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey });
  }
  return client;
}

function jsonSchemaForZod<T>(schema: z.ZodType<T>): Record<string, unknown> {
  const jsonSchema = zodToJsonSchema(schema, {
    $refStrategy: "none",
  }) as Record<string, unknown> & { $schema?: string };
  delete jsonSchema.$schema;
  return jsonSchema;
}

/** Deterministic JSON fixtures matching each structured route (schema identity). */
function mockGenerateJson<T>(schema: z.ZodType<T>): T {
  const schemaRef = schema as z.ZodType<unknown>;
  if (schemaRef === QuizResponseSchema) {
    return QuizResponseSchema.parse({
      topic: "Mock topic (GEMINI_MOCK)",
      questions: [
        {
          id: "mock-q1",
          type: "multiple_choice",
          question:
            "Mock: GEMINI_MOCK is on — no live model call. Use this to test the quiz UI.",
          choices: ["Option A", "Option B", "Option C"],
          correctAnswer: "Option A",
          explanation: "Placeholder explanation for layout and scoring UI.",
          commonTrap: "Treating mock content as ground truth.",
        },
      ],
    }) as T;
  }
  if (schemaRef === FlashcardsResponseSchema) {
    return FlashcardsResponseSchema.parse({
      topic: "Mock topic (GEMINI_MOCK)",
      cards: [
        {
          front: "Mock flashcard front",
          back: "Mock back — disable GEMINI_MOCK and set GEMINI_API_KEY for real decks.",
          type: "definition",
        },
      ],
    }) as T;
  }
  if (schemaRef === GapCheckResponseSchema) {
    return GapCheckResponseSchema.parse({
      topic: "Mock",
      strengths: ["Mock: you stated one idea clearly."],
      gaps: ["Mock: add a concrete example from the unit."],
      misconceptions: [],
      repairLesson:
        "Mock repair block — review the key definition and teach it back in one minute.",
      nextStudyActions: ["Run flashcards", "Short teach-back"],
      followUpQuestions: ["How would you explain this to a teammate?"],
      confidenceScore: 55,
    }) as T;
  }
  if (schemaRef === TeachBackResponseSchema) {
    return TeachBackResponseSchema.parse({
      score: 7,
      strengths: ["Mock: structure is readable."],
      gaps: ["Mock: missing a numeric or real-world tie-in."],
      improvedAnswer:
        "Mock improved paragraph for checking the teach-back panel layout.",
      nextAttemptPrompt:
        "Mock: explain again with one example and one limitation.",
    }) as T;
  }
  throw new Error(
    "Mock mode: add a fixture for this schema or call a supported route only.",
  );
}

function mockGenerateText(): string {
  return [
    "## Mock AI response (`GEMINI_MOCK=true`)",
    "",
    "No request was sent to Gemini. Stub Markdown for UI testing only.",
    "",
    "- **Tip:** unset `GEMINI_MOCK` and set a valid `GEMINI_API_KEY` for real answers.",
    "",
    "Lorem markdown: list item one, list item two.",
  ].join("\n");
}

export async function generateText(prompt: string): Promise<string> {
  void prompt;
  if (isGeminiMock()) {
    return mockGenerateText();
  }
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
  });
  return response.text?.trim() ?? "";
}

export async function generateJson<T>(
  prompt: string,
  schema: z.ZodType<T>,
): Promise<T> {
  if (isGeminiMock()) {
    void prompt;
    return mockGenerateJson(schema);
  }
  const ai = getClient();
  const response = await ai.models.generateContent({
    model: GEMINI_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseJsonSchema: jsonSchemaForZod(schema),
    },
  });
  const text = response.text?.trim();
  if (!text) {
    throw new Error("Gemini returned an empty JSON response.");
  }
  const parsed = parseJsonWithSchema(text, schema);
  if (!parsed.ok) {
    if (parsed.error === "invalid_json") {
      throw new Error("Gemini returned invalid JSON.");
    }
    throw new Error("Gemini JSON did not match expected shape.");
  }
  return parsed.data;
}
