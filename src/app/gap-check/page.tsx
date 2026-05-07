"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { ProgressRing } from "@/components/progress-ring";
import { runGapCheck } from "@/lib/api-client";
import { markActionComplete, setLastStudiedTopic } from "@/lib/local-progress";
import type { GapCheckResponse } from "@/lib/schemas/gapCheck";

const PROMPT = `Explain what you know about this topic.
Give:
1. Definition
2. Example
3. Why it matters
4. Common mistake`;

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
      const payload = `${PROMPT}\n\n${answer.trim()}`;
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
              {PROMPT}
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
                <Section title="Strengths" items={result.strengths} />
                <Section title="Gaps" items={result.gaps} tone="rose" />
                <Section title="Misconceptions" items={result.misconceptions} tone="amber" />
                <div>
                  <h3 className="text-xs font-semibold uppercase text-zinc-500">
                    Repair lesson
                  </h3>
                  <p className="mt-1 text-zinc-300">{result.repairLesson}</p>
                </div>
                <Section title="Next actions" items={result.nextStudyActions} />
                <Section title="Follow-up questions" items={result.followUpQuestions} />
              </div>
            ) : null}
          </ResponsePanel>
        </div>
      </div>
    </>
  );
}

function Section({
  title,
  items,
  tone,
}: {
  title: string;
  items: string[];
  tone?: "rose" | "amber";
}) {
  const border =
    tone === "rose"
      ? "border-rose-500/20"
      : tone === "amber"
        ? "border-amber-500/20"
        : "border-zinc-800";
  return (
    <div className={`rounded-xl border ${border} bg-zinc-950/40 p-3`}>
      <h3 className="text-xs font-semibold uppercase text-zinc-500">{title}</h3>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-zinc-300">
        {items.map((x, i) => (
          <li key={i}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
