"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { courseTopics, getTopicById } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import {
  averageQuizScoreByTopic,
  buildLedgerExport,
  downloadLedgerJson,
  GAPCLOSER_LEDGER_EVENT,
  listDeckSnapshots,
  listQuizAttempts,
  listStudyRuns,
} from "@/lib/study-ledger";
import {
  GAPCLOSER_PROGRESS_EVENT,
  getProgress,
} from "@/lib/local-progress";
import type { StudyProgress } from "@/types";

type WeakRow = {
  topicId: string;
  title: string;
  reason: string;
  score?: number;
  confidence?: StudyProgress["confidence"];
};

const ACTIONS = ["explain", "quiz", "flashcards", "gap-check"] as const;

function completionPct(p?: StudyProgress): number {
  if (!p?.completedActions?.length) return 0;
  const done = ACTIONS.filter((a) => p.completedActions.includes(a)).length;
  return Math.round((done / ACTIONS.length) * 100);
}

export default function InsightsPage() {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const bump = () => setTick((x) => x + 1);
    window.addEventListener(GAPCLOSER_LEDGER_EVENT, bump);
    window.addEventListener(GAPCLOSER_PROGRESS_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(GAPCLOSER_LEDGER_EVENT, bump);
      window.removeEventListener(GAPCLOSER_PROGRESS_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const [quizAttempts, setQuizAttempts] = useState<
    Awaited<ReturnType<typeof listQuizAttempts>>
  >([]);
  const [decks, setDecks] = useState<Awaited<ReturnType<typeof listDeckSnapshots>>>(
    [],
  );
  const [runs, setRuns] = useState<Awaited<ReturnType<typeof listStudyRuns>>>(
    [],
  );
  const [avgByTopic, setAvgByTopic] = useState<Record<string, number>>({});

  const refresh = useCallback(async () => {
    try {
      const [q, d, r, avg] = await Promise.all([
        listQuizAttempts(),
        listDeckSnapshots(),
        listStudyRuns(),
        averageQuizScoreByTopic(),
      ]);
      setQuizAttempts(q);
      setDecks(d);
      setRuns(r);
      setAvgByTopic(avg);
    } catch {
      /* noop */
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh, tick]);

  const weakTopics = useMemo((): WeakRow[] => {
    void tick;
    const progress = getProgress();
    const rows: WeakRow[] = [];
    for (const t of courseTopics) {
      const p = progress[t.id];
      const avg = avgByTopic[t.id];
      if (avg != null && avg < 72) {
        rows.push({
          topicId: t.id,
          title: t.title,
          reason: `Average logged quiz score ${avg}%`,
          score: avg,
          confidence: p?.confidence,
        });
      } else if (p?.confidence === "low") {
        rows.push({
          topicId: t.id,
          title: t.title,
          reason: "Confidence flagged low",
          confidence: "low",
        });
      }
    }
    rows.sort((a, b) => (a.score ?? 100) - (b.score ?? 100));
    return rows.slice(0, 8);
  }, [avgByTopic, tick]);

  const topicCompletion = useMemo(() => {
    void tick;
    const progress = getProgress();
    return courseTopics
      .map((t) => ({
        topic: t,
        pct: completionPct(progress[t.id]),
      }))
      .sort((a, b) => a.pct - b.pct);
  }, [tick]);

  async function exportAll() {
    const payload = await buildLedgerExport();
    downloadLedgerJson(payload);
  }

  return (
    <>
      <PageHeader
        title="Insights"
        description="Trends built from IndexedDB quiz logs plus local progress keys. Scoped to this browser only."
      />

      <div className="mb-6 flex flex-wrap gap-3">
        <button
          type="button"
          className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
          onClick={() => void exportAll()}
        >
          Export backup JSON
        </button>
        <Link
          href="/study-run"
          className="rounded-xl border border-zinc-600 px-4 py-2 text-sm font-medium text-zinc-200 hover:bg-zinc-800/80"
        >
          Guided study run
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">
            Attention list
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Mix of logged quiz averages (&lt; 72%) and topics still at low confidence.
          </p>
          <ul className="mt-4 space-y-3">
            {weakTopics.length ? (
              weakTopics.map((row) => (
                <li
                  key={row.topicId}
                  className="flex flex-wrap items-baseline justify-between gap-2 rounded-xl border border-zinc-800/90 bg-zinc-950/40 px-4 py-3"
                >
                  <div>
                    <Link
                      href={`/topics/${row.topicId}`}
                      className="font-medium text-cyan-300 hover:text-cyan-200"
                    >
                      {row.title}
                    </Link>
                    <p className="text-xs text-zinc-500">{row.reason}</p>
                  </div>
                  <div className="flex gap-2 text-xs">
                    {row.score != null ? (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-300">
                        {row.score}% avg
                      </span>
                    ) : null}
                    {row.confidence ? (
                      <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-zinc-300">
                        {row.confidence}
                      </span>
                    ) : null}
                  </div>
                </li>
              ))
            ) : (
              <li className="text-sm text-zinc-500">
                No weak signals yet. Log quiz scores after each generated quiz, or flag low-confidence topics from the Topic Map.
              </li>
            )}
          </ul>
        </section>

        <section className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">
            Tool loop completion (estimate)
          </h2>
          <p className="mt-1 text-xs text-zinc-500">
            Tracks explain · quiz · flashcards · gap-check actions per topic.
          </p>
          <div className="mt-5 max-h-72 space-y-2 overflow-y-auto pr-2">
            {topicCompletion.slice(0, 12).map(({ topic, pct }) => (
              <div key={topic.id}>
                <div className="mb-1 flex justify-between text-xs">
                  <span className="truncate text-zinc-300">{topic.title}</span>
                  <span className="tabular-nums text-zinc-500">{pct}%</span>
                </div>
                <div className="h-2 rounded-full bg-zinc-800">
                  <div
                    className="h-2 rounded-full bg-gradient-to-r from-cyan-500 to-emerald-500"
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <section className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/35 p-5">
        <h2 className="text-sm font-semibold text-zinc-100">Quiz log</h2>
        <p className="mt-1 text-xs text-zinc-500">
          Most recent first. Percent shows only after you save a score on the Quiz page or during a guided run.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-xs uppercase text-zinc-500">
                <th className="py-2 pr-3 font-medium">When</th>
                <th className="py-2 pr-3 font-medium">Topic</th>
                <th className="py-2 pr-3 font-medium">Qs</th>
                <th className="py-2 font-medium">Score</th>
              </tr>
            </thead>
            <tbody className="text-zinc-300">
              {quizAttempts.slice(0, 20).map((a) => {
                const title = getTopicById(a.topicId)?.title ?? a.topicId;
                return (
                  <tr key={a.id} className="border-b border-zinc-800/60">
                    <td className="py-2 pr-3 text-xs text-zinc-500 whitespace-nowrap">
                      {new Date(a.createdAt).toLocaleString()}
                    </td>
                    <td className="py-2 pr-3">
                      <Link
                        className="text-cyan-300 hover:text-cyan-200"
                        href={`/topics/${a.topicId}`}
                      >
                        {title}
                      </Link>
                    </td>
                    <td className="tabular-nums py-2 pr-3">{a.questionCount}</td>
                    <td className="tabular-nums py-2">
                      {a.scorePercent != null ? `${a.scorePercent}%` : "—"}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          {!quizAttempts.length ? (
            <p className="py-8 text-center text-sm text-zinc-500">
              Generate a quiz to create the first ledger entry.
            </p>
          ) : null}
        </div>
      </section>

      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">Deck snapshots</h2>
          <ul className="mt-4 space-y-2 text-sm text-zinc-300">
            {decks.slice(0, 8).map((d) => (
              <li
                key={d.id}
                className="flex justify-between rounded-lg border border-zinc-800/80 bg-zinc-950/30 px-3 py-2"
              >
                <span className="truncate pr-3">
                  {getTopicById(d.topicId)?.title ?? d.topicId}
                </span>
                <span className="shrink-0 text-xs text-zinc-500">
                  {d.cardCount} cards · {new Date(d.createdAt).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
          {!decks.length ? (
            <p className="mt-4 text-sm text-zinc-500">None yet.</p>
          ) : null}
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/35 p-5">
          <h2 className="text-sm font-semibold text-zinc-100">Guided study runs</h2>
          <ul className="mt-4 space-y-3 text-sm text-zinc-300">
            {runs.slice(0, 8).map((r) => (
              <li
                key={r.id}
                className="rounded-lg border border-zinc-800/80 bg-zinc-950/30 px-3 py-2"
              >
                <p className="font-medium text-zinc-200">
                  {getTopicById(r.topicId)?.title ?? r.topicId}
                </p>
                <p className="text-xs text-zinc-500">
                  {new Date(r.startedAt).toLocaleString()}
                  {r.finishedAt
                    ? ` → ${new Date(r.finishedAt).toLocaleTimeString()}`
                    : ""}
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {r.steps.map((s, idx) => (
                    <span
                      key={`${r.id}-${idx}-${s.at}`}
                      className={`rounded-full px-2 py-0.5 text-[11px] ${
                        s.status === "completed"
                          ? "bg-emerald-500/15 text-emerald-200"
                          : s.status === "skipped"
                            ? "bg-zinc-800 text-zinc-400"
                            : "bg-rose-500/15 text-rose-200"
                      }`}
                    >
                      {s.kind}:{s.status}
                    </span>
                  ))}
                </div>
              </li>
            ))}
          </ul>
          {!runs.length ? (
            <p className="mt-4 text-sm text-zinc-500">None yet.</p>
          ) : null}
        </div>
      </section>
    </>
  );
}
