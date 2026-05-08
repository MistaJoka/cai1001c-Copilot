import { describe, it, expect } from "vitest";
import { getTopicById, courseTopics } from "./courseTopics";

describe("courseTopics", () => {
  it("getTopicById returns meta for known id", () => {
    const t = getTopicById("ai-ethics");
    expect(t).toBeDefined();
    expect(t?.title).toBe("AI Ethics, Bias, Privacy, and Safety");
  });

  it("getTopicById returns undefined for unknown id", () => {
    expect(getTopicById("not-a-real-topic")).toBeUndefined();
  });

  it("ids are unique", () => {
    const ids = courseTopics.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
