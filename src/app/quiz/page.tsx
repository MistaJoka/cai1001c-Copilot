"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { QuizCard } from "@/components/quiz-card";
import { QuizScoreLogger } from "@/components/quiz-score-logger";
import { generateQuiz } from "@/lib/api-client";
import { addQuizAttempt } from "@/lib/study-ledger";
import { markActionComplete, setLastStudiedTopic } from "@/lib/local-progress";
import type { QuizResponse } from "@/lib/schemas/quiz";

export default function QuizPage() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <QuizInner />
    </Suspense>
  );
}

function QuizInner() {
  const search = useSearchParams();
  const [topicId, setTopicId] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pack, setPack] = useState<QuizResponse | null>(null);
  const [attemptId, setAttemptId] = useState<string | null>(null);

  useEffect(() => {
    const t = search.get("topic");
    if (t) setTopicId(t);
  }, [search]);

  useEffect(() => {
    if (!pack || !topicId) {
      setAttemptId(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      const id = await addQuizAttempt({
        topicId,
        questionCount: pack.questions.length,
        topicLabel: pack.topic,
      });
      if (!cancelled) setAttemptId(id);
    })();
    return () => {
      cancelled = true;
    };
  }, [pack, topicId]);

  const run = useCallback(async () => {
    if (!topicId) {
      setError("Select a topic.");
      return;
    }
    setError(null);
    setLoading(true);
    setPack(null);
    try {
      setLastStudiedTopic(topicId);
      const raw = search.get("count");
      const parsed = raw ? Number.parseInt(raw, 10) : NaN;
      const count = Number.isFinite(parsed)
        ? Math.min(20, Math.max(1, parsed))
        : 8;
      const data = await generateQuiz({ topic: topicId, count });
      setPack(data);
      markActionComplete(topicId, "quiz");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  }, [topicId, search]);

  return (
    <>
      <PageHeader
        title="Quiz"
        description="Structured multiple-choice / T-F / short answer mix from Gemini (JSON)."
      />

      <div className="mb-6 flex flex-wrap items-end gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <label className="block text-xs font-medium text-zinc-500">
          Topic
          <select
            className="mt-1 w-full min-w-[220px] rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            value={topicId}
            onChange={(e) => setTopicId(e.target.value)}
          >
            <option value="">Select…</option>
            {courseTopics.map((t) => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </label>
        <button
          type="button"
          className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          onClick={run}
          disabled={loading}
        >
          Generate quiz
        </button>
      </div>

      <ResponsePanel
        loading={loading}
        error={error}
        emptyMessage="Quiz loads here."
      >
        {pack ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <p className="text-sm font-medium text-zinc-200">{pack.topic}</p>
              {pack.questions.map((q, i) => (
                <QuizCard key={q.id || String(i)} question={q} index={i} />
              ))}
            </div>
            {topicId ? (
              <QuizScoreLogger
                topicId={topicId}
                attemptId={attemptId}
                questionCount={pack.questions.length}
              />
            ) : (
              <p className="text-xs text-zinc-500">
                Select a topic to enable score tracking.
              </p>
            )}
          </div>
        ) : null}
      </ResponsePanel>
    </>
  );
}
