"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { ProgressRing } from "@/components/progress-ring";
import {
  GAP_STUDENT_PROMPT,
  GapResultSection,
} from "@/components/gap-result-section";
import { runGapCheck } from "@/lib/api-client";
import { markActionComplete, setLastStudiedTopic } from "@/lib/local-progress";
import type { GapCheckResponse } from "@/lib/schemas/gapCheck";

export default function GapCheckPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-zinc-500" role="status">
          Loading…
        </p>
      }
    >
      <GapCheckInner />
    </Suspense>
  );
}

function GapCheckInner() {
  const search = useSearchParams();
  const [topicId, setTopicId] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GapCheckResponse | null>(null);

  useEffect(() => {
    const t = search.get("topic");
    if (t) setTopicId(t);
  }, [search]);

  async function submit() {
    if (!topicId || !answer.trim()) {
      setError("Pick a topic and write your answer.");
      return;
    }
    setError(null);
    setLoading(true);
    setResult(null);
    try {
      setLastStudiedTopic(topicId);
      const payload = `${GAP_STUDENT_PROMPT}\n\n${answer.trim()}`;
      const data = await runGapCheck({ topic: topicId, studentAnswers: payload });
      setResult(data);
      markActionComplete(topicId, "gap-check");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Gap check failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Gap Check"
        description="You explain first. Gemini returns strengths, gaps, and a repair lesson as structured JSON."
      />

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <label className="block text-xs font-medium text-zinc-500">
            Topic
            <select
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
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

          <div className="rounded-xl border border-zinc-800 bg-zinc-950/50 p-3 text-xs text-zinc-400">
            <p className="font-medium text-zinc-300">Prompt to answer</p>
            <pre className="mt-2 whitespace-pre-wrap font-sans text-zinc-400">
              {GAP_STUDENT_PROMPT}
            </pre>
          </div>

          <textarea
            className="min-h-48 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            value={answer}
            onChange={(e) => setAnswer(e.target.value)}
            placeholder="Your answer…"
          />

          <button
            type="button"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            onClick={submit}
            disabled={loading}
          >
            Run gap check
          </button>
        </div>

        <div>
          <ResponsePanel
            loading={loading}
            error={error}
            emptyMessage="Submit your answer to see structured feedback."
          >
            {result ? (
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-4">
                  <ProgressRing value={result.confidenceScore} max={100} />
                  <div>
                    <p className="font-medium text-zinc-200">Confidence score</p>
                    <p className="text-zinc-500">{result.topic}</p>
                  </div>
                </div>
                <GapResultSection title="Strengths" items={result.strengths} />
                <GapResultSection title="Gaps" items={result.gaps} tone="rose" />
                <GapResultSection title="Misconceptions" items={result.misconceptions} tone="amber" />
                <div>
                  <h3 className="text-xs font-semibold uppercase text-zinc-500">
                    Repair lesson
                  </h3>
                  <p className="mt-1 text-zinc-300">{result.repairLesson}</p>
                </div>
                <GapResultSection title="Next actions" items={result.nextStudyActions} />
                <GapResultSection title="Follow-up questions" items={result.followUpQuestions} />
              </div>
            ) : null}
          </ResponsePanel>
        </div>
      </div>
    </>
  );
}
