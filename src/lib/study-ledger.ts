"use client";

import type { ProgressMap } from "@/types";

const DB_NAME = "gapcloser-ledger-v1";
const DB_VERSION = 1;

const PROGRESS_STORAGE_KEY = "gapcloser-progress-v1";
const LAST_TOPIC_STORAGE_KEY = "gapcloser-last-topic-v1";

export const GAPCLOSER_LEDGER_EVENT = "gapcloser-ledger-changed";

export type QuizAttemptRecord = {
  id: string;
  topicId: string;
  /** ISO */
  createdAt: string;
  questionCount: number;
  topicLabel: string;
  scorePercent?: number;
};

export type DeckSnapshotRecord = {
  id: string;
  topicId: string;
  createdAt: string;
  cardCount: number;
  topicLabel: string;
};

export type StudyRunStepKind = "gap-check" | "quiz" | "flashcards";

export type StudyRunStepRecord = {
  kind: StudyRunStepKind;
  status: "completed" | "skipped" | "failed";
  at: string;
  detail?: string;
};

export type StudyRunRecord = {
  id: string;
  topicId: string;
  startedAt: string;
  finishedAt?: string;
  steps: StudyRunStepRecord[];
};

export type LedgerExportV1 = {
  exportedAt: string;
  version: 1;
  localProgress: ProgressMap;
  lastTopicId: string | null;
  ledger: {
    quizAttempts: QuizAttemptRecord[];
    deckSnapshots: DeckSnapshotRecord[];
    studyRuns: StudyRunRecord[];
  };
};

function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function dispatchLedgerChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GAPCLOSER_LEDGER_EVENT));
}

function openDb(): Promise<IDBDatabase> {
  if (!hasIndexedDb()) {
    return Promise.reject(new Error("IndexedDB not available."));
  }
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, DB_VERSION);
    req.onerror = () => reject(req.error ?? new Error("IndexedDB open failed"));
    req.onsuccess = () => resolve(req.result);
    req.onupgradeneeded = () => {
      const db = req.result;
      if (!db.objectStoreNames.contains("quizAttempts")) {
        const q = db.createObjectStore("quizAttempts", { keyPath: "id" });
        q.createIndex("byTopic", "topicId");
        q.createIndex("byCreated", "createdAt");
      }
      if (!db.objectStoreNames.contains("deckSnapshots")) {
        const d = db.createObjectStore("deckSnapshots", { keyPath: "id" });
        d.createIndex("byTopic", "topicId");
        d.createIndex("byCreated", "createdAt");
      }
      if (!db.objectStoreNames.contains("studyRuns")) {
        const r = db.createObjectStore("studyRuns", { keyPath: "id" });
        r.createIndex("byTopic", "topicId");
        r.createIndex("byStarted", "startedAt");
      }
    };
  });
}

export async function addQuizAttempt(
  input: Omit<QuizAttemptRecord, "id" | "createdAt">,
): Promise<string | null> {
  if (!hasIndexedDb()) return null;
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `q-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const row: QuizAttemptRecord = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
  };
  await new Promise<void>((resolve, reject) => {
    openDb()
      .then((db) => {
        const tx = db.transaction("quizAttempts", "readwrite");
        tx.objectStore("quizAttempts").put(row);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
      .catch(reject);
  });
  dispatchLedgerChanged();
  return id;
}

export async function updateQuizAttemptScore(id: string, scorePercent: number): Promise<void> {
  if (!hasIndexedDb()) return;
  const clamped = Math.max(0, Math.min(100, Math.round(scorePercent)));
  const db = await openDb();
  await new Promise<void>((resolve, reject) => {
    const tx = db.transaction("quizAttempts", "readwrite");
    const store = tx.objectStore("quizAttempts");
    const req = store.get(id);
    req.onsuccess = () => {
      const prev = req.result as QuizAttemptRecord | undefined;
      if (!prev) {
        resolve();
        return;
      }
      store.put({ ...prev, scorePercent: clamped });
    };
    req.onerror = () => reject(req.error);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
  dispatchLedgerChanged();
}

export async function listQuizAttempts(): Promise<QuizAttemptRecord[]> {
  if (!hasIndexedDb()) return [];
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("quizAttempts", "readonly");
    const req = tx.objectStore("quizAttempts").getAll();
    req.onsuccess = () => {
      const rows = (req.result as QuizAttemptRecord[]) ?? [];
      rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      resolve(rows);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function addDeckSnapshot(
  input: Omit<DeckSnapshotRecord, "id" | "createdAt">,
): Promise<string | null> {
  if (!hasIndexedDb()) return null;
  const id =
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `d-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const row: DeckSnapshotRecord = {
    ...input,
    id,
    createdAt: new Date().toISOString(),
  };
  await new Promise<void>((resolve, reject) => {
    openDb()
      .then((db) => {
        const tx = db.transaction("deckSnapshots", "readwrite");
        tx.objectStore("deckSnapshots").put(row);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
      .catch(reject);
  });
  dispatchLedgerChanged();
  return id;
}

export async function listDeckSnapshots(): Promise<DeckSnapshotRecord[]> {
  if (!hasIndexedDb()) return [];
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("deckSnapshots", "readonly");
    const req = tx.objectStore("deckSnapshots").getAll();
    req.onsuccess = () => {
      const rows = (req.result as DeckSnapshotRecord[]) ?? [];
      rows.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
      resolve(rows);
    };
    req.onerror = () => reject(req.error);
  });
}

export async function putStudyRun(row: StudyRunRecord): Promise<void> {
  if (!hasIndexedDb()) return;
  await new Promise<void>((resolve, reject) => {
    openDb()
      .then((db) => {
        const tx = db.transaction("studyRuns", "readwrite");
        tx.objectStore("studyRuns").put(row);
        tx.oncomplete = () => resolve();
        tx.onerror = () => reject(tx.error);
      })
      .catch(reject);
  });
  dispatchLedgerChanged();
}

export async function listStudyRuns(): Promise<StudyRunRecord[]> {
  if (!hasIndexedDb()) return [];
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("studyRuns", "readonly");
    const req = tx.objectStore("studyRuns").getAll();
    req.onsuccess = () => {
      const rows = (req.result as StudyRunRecord[]) ?? [];
      rows.sort((a, b) => b.startedAt.localeCompare(a.startedAt));
      resolve(rows);
    };
    req.onerror = () => reject(req.error);
  });
}

function readProgressMap(): ProgressMap {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(PROGRESS_STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as ProgressMap;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function readLastTopicId(): string | null {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(LAST_TOPIC_STORAGE_KEY);
}

export async function buildLedgerExport(): Promise<LedgerExportV1> {
  const [quizAttempts, deckSnapshots, studyRuns] = await Promise.all([
    listQuizAttempts(),
    listDeckSnapshots(),
    listStudyRuns(),
  ]);
  return {
    exportedAt: new Date().toISOString(),
    version: 1,
    localProgress: readProgressMap(),
    lastTopicId: readLastTopicId(),
    ledger: { quizAttempts, deckSnapshots, studyRuns },
  };
}

export function downloadLedgerJson(payload: LedgerExportV1): void {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `gapcloser-backup-${payload.exportedAt.slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

/** Average of scored quiz attempts per topicId (excluding unscored). */
export async function averageQuizScoreByTopic(): Promise<Record<string, number>> {
  const attempts = await listQuizAttempts();
  const map: Record<string, { sum: number; n: number }> = {};
  for (const a of attempts) {
    if (a.scorePercent == null) continue;
    if (!map[a.topicId]) map[a.topicId] = { sum: 0, n: 0 };
    map[a.topicId].sum += a.scorePercent;
    map[a.topicId].n += 1;
  }
  const out: Record<string, number> = {};
  for (const [topicId, { sum, n }] of Object.entries(map)) {
    if (n > 0) out[topicId] = Math.round(sum / n);
  }
  return out;
}
