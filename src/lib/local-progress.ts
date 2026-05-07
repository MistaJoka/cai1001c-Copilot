import type { ConfidenceLevel, ProgressMap, StudyAction, StudyProgress } from "@/types";

const STORAGE_KEY = "gapcloser-progress-v1";
const LAST_TOPIC_KEY = "gapcloser-last-topic-v1";

/** Fired on same-tab progress writes; `storage` event covers other tabs. */
export const GAPCLOSER_PROGRESS_EVENT = "gapcloser-progress-changed";

function canUseStorage(): boolean {
  return typeof window !== "undefined" && typeof localStorage !== "undefined";
}

export function getProgress(): ProgressMap {
  if (!canUseStorage()) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeProgress(map: ProgressMap) {
  if (!canUseStorage()) return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(GAPCLOSER_PROGRESS_EVENT));
}

export function getTopicProgress(topicId: string): StudyProgress | undefined {
  return getProgress()[topicId];
}

export function saveTopicProgress(
  topicId: string,
  update: Partial<Omit<StudyProgress, "topicId" | "updatedAt">> & {
    confidence?: ConfidenceLevel;
  },
) {
  if (!canUseStorage()) return;
  const map = getProgress();
  const prev = map[topicId];
  const next: StudyProgress = {
    topicId,
    confidence: update.confidence ?? prev?.confidence ?? "low",
    lastQuizScore: update.lastQuizScore ?? prev?.lastQuizScore,
    completedActions: update.completedActions ?? prev?.completedActions ?? [],
    updatedAt: new Date().toISOString(),
  };
  map[topicId] = next;
  writeProgress(map);
}

export function markActionComplete(topicId: string, action: StudyAction) {
  if (!canUseStorage()) return;
  const map = getProgress();
  const prev = map[topicId];
  const existing = prev?.completedActions ?? [];
  if (existing.includes(action)) {
    saveTopicProgress(topicId, {
      ...prev,
      completedActions: existing,
    });
    return;
  }
  saveTopicProgress(topicId, {
    ...prev,
    completedActions: [...existing, action],
  });
}

export function setLastStudiedTopic(topicId: string) {
  if (!canUseStorage()) return;
  localStorage.setItem(LAST_TOPIC_KEY, topicId);
  window.dispatchEvent(new Event(GAPCLOSER_PROGRESS_EVENT));
}

export function getLastStudiedTopic(): string | null {
  if (!canUseStorage()) return null;
  return localStorage.getItem(LAST_TOPIC_KEY);
}

export function setTopicConfidence(topicId: string, confidence: ConfidenceLevel) {
  saveTopicProgress(topicId, { confidence });
}
