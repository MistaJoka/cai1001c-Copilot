import type { ProgressMap } from "@/types";

export const PROGRESS_STORAGE_KEY = "gapcloser-progress-v1";
export const LAST_TOPIC_STORAGE_KEY = "gapcloser-last-topic-v1";

export const GAPCLOSER_PROGRESS_EVENT = "gapcloser-progress-changed";

export function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function readProgressMap(): ProgressMap {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

export function readLastTopicId(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(LAST_TOPIC_STORAGE_KEY);
}

export function dispatchProgressChanged(): void {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GAPCLOSER_PROGRESS_EVENT));
}
