"use client";

import { useState } from "react";
import {
  updateQuizAttemptScore,
} from "@/lib/study-ledger";
import { saveTopicProgress } from "@/lib/local-progress";

type Props = {
  topicId: string;
  attemptId: string | null;
  questionCount: number;
};

export function QuizScoreLogger({ topicId, attemptId, questionCount }: Props) {
  const [correctRaw, setCorrectRaw] = useState("");
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    if (!attemptId || questionCount <= 0) return;
    const correct = Number.parseInt(correctRaw, 10);
    if (
      !Number.isFinite(correct) ||
      correct < 0 ||
      correct > questionCount
    ) {
      return;
    }
    const pct = Math.round((correct / questionCount) * 100);
    await updateQuizAttemptScore(attemptId, pct);
    saveTopicProgress(topicId, { lastQuizScore: pct });
    setSaved(true);
  }

  if (!attemptId) {
    return (
      <p className="text-xs text-zinc-500">
        Ledger unavailable (IndexedDB blocked). Quiz still works; scores will not trend.
      </p>
    );
  }

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-950/50 p-4">
      <p className="text-sm font-medium text-zinc-200">Log quiz score</p>
      <p className="mt-1 text-xs text-zinc-500">
        After you reveal answers and self-grade, enter how many you got correct (insights + dashboard use this).
      </p>
      <div className="mt-3 flex flex-wrap items-end gap-3">
        <label className="text-xs font-medium text-zinc-500">
          Correct (0–{questionCount})
          <input
            type="number"
            min={0}
            max={questionCount}
            className="mt-1 block w-28 rounded-lg border border-zinc-700 bg-zinc-950 px-2 py-1.5 text-sm text-zinc-100"
            value={correctRaw}
            onChange={(e) => {
              setSaved(false);
              setCorrectRaw(e.target.value);
            }}
          />
        </label>
        <button
          type="button"
          className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
          onClick={() => void handleSave()}
          disabled={saved || !correctRaw}
        >
          {saved ? "Saved" : "Save score"}
        </button>
      </div>
    </div>
  );
}
