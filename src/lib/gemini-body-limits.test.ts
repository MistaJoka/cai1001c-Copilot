import { describe, it, expect } from "vitest";
import {
  LIMIT_MESSAGE,
  rejectIfTooLong,
} from "./gemini-body-limits";

describe("gemini-body-limits", () => {
  it("rejectIfTooLong returns null when under max", () => {
    expect(rejectIfTooLong("hi", LIMIT_MESSAGE, "message")).toBeNull();
  });

  it("rejectIfTooLong returns 413 Response when over max", async () => {
    const res = rejectIfTooLong("x".repeat(10), 9, "message");
    expect(res).not.toBeNull();
    const r = res!;
    expect(r.status).toBe(413);
    const body = (await r.json()) as { error: string };
    expect(body.error).toContain("message");
  });
});
