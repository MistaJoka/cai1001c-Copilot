import type { ConfidenceLevel, ProgressMap, StudyAction, StudyProgress } from "@/types";
import {
  GAPCLOSER_PROGRESS_EVENT,
  LAST_TOPIC_STORAGE_KEY,
  PROGRESS_STORAGE_KEY,
  canUseStorage,
  dispatchProgressChanged,
  readLastTopicId,
  readProgressMap,
} from "@/lib/storage-keys";

export { GAPCLOSER_PROGRESS_EVENT };

export function getProgress(): ProgressMap {
  return readProgressMap();
}

function writeProgress(map: ProgressMap) {
  if (!canUseStorage()) return;
  localStorage.setItem(PROGRESS_STORAGE_KEY, JSON.stringify(map));
  dispatchProgressChanged();
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
  const existing = getProgress()[topicId]?.completedActions ?? [];
  if (existing.includes(action)) return;
  saveTopicProgress(topicId, { completedActions: [...existing, action] });
}

export function setLastStudiedTopic(topicId: string) {
  if (!canUseStorage()) return;
  localStorage.setItem(LAST_TOPIC_STORAGE_KEY, topicId);
  dispatchProgressChanged();
}

export function getLastStudiedTopic(): string | null {
  return readLastTopicId();
}

export function setTopicConfidence(topicId: string, confidence: ConfidenceLevel) {
  saveTopicProgress(topicId, { confidence });
}
