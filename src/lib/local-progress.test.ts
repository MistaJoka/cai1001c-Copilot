import { describe, it, expect, beforeEach, vi } from "vitest";

const EVENT = "gapcloser-progress-changed";
const STORAGE_KEY = "gapcloser-progress-v1";

function installBrowserGlobals(storageState: Record<string, string>) {
  const dispatchEvent = vi.fn();
  const localStorageMock = {
    getItem: (k: string) =>
      Object.prototype.hasOwnProperty.call(storageState, k)
        ? storageState[k]
        : null,
    setItem: (k: string, v: string) => {
      storageState[k] = v;
    },
  };
  vi.stubGlobal("window", { dispatchEvent } as unknown as Window);
  vi.stubGlobal("localStorage", localStorageMock);
  return { dispatchEvent, storageState };
}

describe("local-progress", () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  it("getProgress returns empty object when stored JSON is corrupt", async () => {
    const store: Record<string, string> = {
      [STORAGE_KEY]: "{broken",
    };
    installBrowserGlobals(store);
    vi.resetModules();
    const { getProgress } = await import("./local-progress");
    expect(getProgress()).toEqual({});
  });

  it("saveTopicProgress persists and dispatches progress event", async () => {
    const store: Record<string, string> = {};
    const { dispatchEvent } = installBrowserGlobals(store);
    vi.resetModules();
    const { saveTopicProgress, getProgress } = await import("./local-progress");
    saveTopicProgress("ai-ethics", { confidence: "high" });
    const map = getProgress();
    expect(map["ai-ethics"]?.confidence).toBe("high");
    expect(dispatchEvent).toHaveBeenCalled();
    const ev = dispatchEvent.mock.calls.find(
      (c) => (c[0] as Event).type === EVENT,
    );
    expect(ev).toBeDefined();
  });
});
