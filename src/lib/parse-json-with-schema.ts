import type { z } from "zod";

export type ParseJsonWithSchemaFailure =
  | { ok: false; error: "invalid_json" }
  | { ok: false; error: "schema"; issues: z.ZodIssue[] };

export type ParseJsonWithSchemaResult<T> =
  | { ok: true; data: T }
  | ParseJsonWithSchemaFailure;

/** Parse text as JSON then validate with Zod (no Gemini). */
export function parseJsonWithSchema<T>(
  text: string,
  schema: z.ZodType<T>,
): ParseJsonWithSchemaResult<T> {
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
