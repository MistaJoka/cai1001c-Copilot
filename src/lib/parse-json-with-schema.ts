import type { z } from "zod";

type Failure =
  | { ok: false; error: "invalid_json" }
  | { ok: false; error: "schema"; issues: z.ZodIssue[] };

type Result<T> = { ok: true; data: T } | Failure;

/** Parse text as JSON then validate with Zod (no Gemini). */
export function parseJsonWithSchema<T>(
  text: string,
  schema: z.ZodType<T>,
): Result<T> {
  let raw: unknown;
  try {
    raw = JSON.parse(text);
  } catch {
    return { ok: false, error: "invalid_json" };
  }
  const parsed = schema.safeParse(raw);
  if (!parsed.success) {
    return { ok: false, error: "schema", issues: parsed.error.issues };
  }
  return { ok: true, data: parsed.data };
}
