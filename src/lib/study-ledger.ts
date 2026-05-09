"use client";

import { readLastTopicId, readProgressMap } from "@/lib/storage-keys";
import type { ProgressMap } from "@/types";

const DB_NAME = "gapcloser-ledger-v1";
const DB_VERSION = 1;

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

type StoreName = "quizAttempts" | "deckSnapshots" | "studyRuns";

function hasIndexedDb(): boolean {
  return typeof indexedDB !== "undefined";
}

function dispatchLedgerChanged() {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new Event(GAPCLOSER_LEDGER_EVENT));
}

function newRowId(prefix: string): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
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
      const ensure = (
        name: StoreName,
        indexes: ReadonlyArray<{ name: string; keyPath: string }>,
      ) => {
        if (db.objectStoreNames.contains(name)) return;
        const store = db.createObjectStore(name, { keyPath: "id" });
        for (const ix of indexes) store.createIndex(ix.name, ix.keyPath);
      };
      ensure("quizAttempts", [
        { name: "byTopic", keyPath: "topicId" },
        { name: "byCreated", keyPath: "createdAt" },
      ]);
      ensure("deckSnapshots", [
        { name: "byTopic", keyPath: "topicId" },
        { name: "byCreated", keyPath: "createdAt" },
      ]);
      ensure("studyRuns", [
        { name: "byTopic", keyPath: "topicId" },
        { name: "byStarted", keyPath: "startedAt" },
      ]);
    };
  });
}

async function withStore<T>(
  name: StoreName,
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => Promise<T> | T,
): Promise<T> {
  const db = await openDb();
  const tx = db.transaction(name, mode);
  const store = tx.objectStore(name);
  const result = await fn(store);
  await new Promise<void>((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
    tx.onabort = () => reject(tx.error);
  });
  return result;
}

async function listAllSorted<T>(
  name: StoreName,
  sortKey: keyof T,
): Promise<T[]> {
  if (!hasIndexedDb()) return [];
  return withStore(name, "readonly", (store) =>
    new Promise<T[]>((resolve, reject) => {
      const req = store.getAll();
      req.onsuccess = () => {
        const rows = (req.result as T[]) ?? [];
        rows.sort((a, b) =>
          String(b[sortKey]).localeCompare(String(a[sortKey])),
        );
        resolve(rows);
      };
      req.onerror = () => reject(req.error);
    }),
  );
}

export async function addQuizAttempt(
  input: Omit<QuizAttemptRecord, "id" | "createdAt">,
): Promise<string | null> {
  if (!hasIndexedDb()) return null;
  const row: QuizAttemptRecord = {
    ...input,
    id: newRowId("q"),
    createdAt: new Date().toISOString(),
  };
  await withStore("quizAttempts", "readwrite", (store) => {
    store.put(row);
  });
  dispatchLedgerChanged();
  return row.id;
}

export async function updateQuizAttemptScore(
  id: string,
  scorePercent: number,
): Promise<void> {
  if (!hasIndexedDb()) return;
  const clamped = Math.max(0, Math.min(100, Math.round(scorePercent)));
  await withStore("quizAttempts", "readwrite", (store) =>
    new Promise<void>((resolve, reject) => {
      const req = store.get(id);
      req.onsuccess = () => {
        const prev = req.result as QuizAttemptRecord | undefined;
        if (!prev) {
          resolve();
          return;
        }
        store.put({ ...prev, scorePercent: clamped });
        resolve();
      };
      req.onerror = () => reject(req.error);
    }),
  );
  dispatchLedgerChanged();
}

export function listQuizAttempts(): Promise<QuizAttemptRecord[]> {
  return listAllSorted<QuizAttemptRecord>("quizAttempts", "createdAt");
}

export async function addDeckSnapshot(
  input: Omit<DeckSnapshotRecord, "id" | "createdAt">,
): Promise<string | null> {
  if (!hasIndexedDb()) return null;
  const row: DeckSnapshotRecord = {
    ...input,
    id: newRowId("d"),
    createdAt: new Date().toISOString(),
  };
  await withStore("deckSnapshots", "readwrite", (store) => {
    store.put(row);
  });
  dispatchLedgerChanged();
  return row.id;
}

export function listDeckSnapshots(): Promise<DeckSnapshotRecord[]> {
  return listAllSorted<DeckSnapshotRecord>("deckSnapshots", "createdAt");
}

export async function putStudyRun(row: StudyRunRecord): Promise<void> {
  if (!hasIndexedDb()) return;
  await withStore("studyRuns", "readwrite", (store) => {
    store.put(row);
  });
  dispatchLedgerChanged();
}

export function listStudyRuns(): Promise<StudyRunRecord[]> {
  return listAllSorted<StudyRunRecord>("studyRuns", "startedAt");
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
