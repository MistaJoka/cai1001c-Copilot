import { GoogleGenAI } from "@google/genai";
import type { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";

export const GEMINI_MODEL =
  process.env.GEMINI_MODEL?.trim() || "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("Missing GEMINI_API_KEY. Add it to .env.local.");
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

export async function generateText(prompt: string): Promise<string> {
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
  return schema.parse(JSON.parse(text));
}
