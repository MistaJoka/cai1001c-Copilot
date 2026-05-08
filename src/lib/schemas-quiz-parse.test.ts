import { describe, it, expect } from "vitest";
import { QuizResponseSchema } from "./schemas/quiz";
import { parseJsonWithSchema } from "./parse-json-with-schema";

describe("QuizResponseSchema via parseJsonWithSchema", () => {
  it("accepts valid quiz JSON", () => {
    const raw = JSON.stringify({
      topic: "Test Topic",
      questions: [
        {
          id: "1",
          type: "multiple_choice",
          question: "Q?",
          choices: ["a", "b"],
          correctAnswer: "a",
          explanation: "because",
          commonTrap: "trap",
        },
      ],
    });
    const r = parseJsonWithSchema(raw, QuizResponseSchema);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.data.questions).toHaveLength(1);
  });

  it("rejects invalid JSON text", () => {
    const r = parseJsonWithSchema("{ not json", QuizResponseSchema);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toBe("invalid_json");
  });

  it("rejects JSON that fails schema", () => {
    const r = parseJsonWithSchema(
      JSON.stringify({
        topic: "x",
        questions: [{ id: "1", type: "multiple_choice" }],
      }),
      QuizResponseSchema,
    );
    expect(r.ok).toBe(false);
    if (!r.ok && r.error === "schema") {
      expect(r.issues.length).toBeGreaterThan(0);
    }
  });
});
