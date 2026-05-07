"use client";

import Link from "next/link";
import { Suspense, useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import { ProgressRing } from "@/components/progress-ring";
import { ResponsePanel } from "@/components/response-panel";
import { QuizCard } from "@/components/quiz-card";
import { Flashcard } from "@/components/flashcard";
import { QuizScoreLogger } from "@/components/quiz-score-logger";
import {
  generateFlashcards,
  generateQuiz,
  runGapCheck,
} from "@/lib/api-client";
import { markActionComplete, setLastStudiedTopic } from "@/lib/local-progress";
import {
  addDeckSnapshot,
  addQuizAttempt,
  putStudyRun,
  type StudyRunRecord,
  type StudyRunStepRecord,
} from "@/lib/study-ledger";
import type { FlashcardsResponse } from "@/lib/schemas/flashcards";
import type { GapCheckResponse } from "@/lib/schemas/gapCheck";
import type { QuizResponse } from "@/lib/schemas/quiz";

const GAP_PROMPT = `Explain what you know about this topic.
Give:
1. Definition
2. Example
3. Why it matters
4. Common mistake`;

type Phase = "pick" | "gap" | "gap_review" | "quiz" | "flashcards" | "done";

const DEFAULT_GAP_SEED =
  "• Definition: …\n• Example: …\n• Why it matters: …\n• Common mistake: …\n(Replace bullets with your own words.)";

export default function StudyRunPage() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <StudyRunInner />
    </Suspense>
  );
}

function StudyRunInner() {
  const search = useSearchParams();
  const [topicId, setTopicId] = useState("");
  const [phase, setPhase] = useState<Phase>("pick");
  const runIdRef = useRef(
    typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `run-${Date.now()}`,
  );
  const startedAtRef = useRef("");
  const stepsRef = useRef<StudyRunStepRecord[]>([]);

  const [gapAnswer, setGapAnswer] = useState(DEFAULT_GAP_SEED);
  const [gapResult, setGapResult] = useState<GapCheckResponse | null>(null);
  const [quizPack, setQuizPack] = useState<QuizResponse | null>(null);
  const [quizAttemptId, setQuizAttemptId] = useState<string | null>(null);
  const [deck, setDeck] = useState<FlashcardsResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = search.get("topic");
    if (t) setTopicId(t);
  }, [search]);

  const persistRun = useCallback(
    async (steps: StudyRunStepRecord[], finished?: boolean) => {
      if (!topicId || !startedAtRef.current) return;
      const row: StudyRunRecord = {
        id: runIdRef.current,
        topicId,
        startedAt: startedAtRef.current,
        steps,
        finishedAt: finished ? new Date().toISOString() : undefined,
      };
      stepsRef.current = steps;
      await putStudyRun(row);
    },
    [topicId],
  );

  const appendStep = useCallback(
    async (step: StudyRunStepRecord, finished?: boolean) => {
      const next = [...stepsRef.current, step];
      await persistRun(next, finished);
    },
    [persistRun],
  );

  async function handleStartRun() {
    if (!topicId) {
      setError("Select a topic.");
      return;
    }
    setError(null);
    setGapAnswer(DEFAULT_GAP_SEED);
    setGapResult(null);
    setQuizPack(null);
    setQuizAttemptId(null);
    setDeck(null);
    stepsRef.current = [];
    startedAtRef.current = new Date().toISOString();
    setLastStudiedTopic(topicId);
    await persistRun([]);
    setPhase("gap");
  }

  async function handleSkipGap() {
    await appendStep({
      kind: "gap-check",
      status: "skipped",
      at: new Date().toISOString(),
    });
    setPhase("quiz");
    await loadQuizGeneration();
  }

  async function handleSubmitGap() {
    if (!topicId.trim() || !gapAnswer.trim()) {
      setError("Write a short answer or use Skip.");
      return;
    }
    setLoading(true);
    setError(null);
    setGapResult(null);
    try {
      const payload = `${GAP_PROMPT}\n\n${gapAnswer.trim()}`;
      const data = await runGapCheck({
        topic: topicId,
        studentAnswers: payload,
      });
      setGapResult(data);
      markActionComplete(topicId, "gap-check");
      await appendStep({
        kind: "gap-check",
        status: "completed",
        at: new Date().toISOString(),
      });
      setPhase("gap_review");
    } catch (e) {
      await appendStep({
        kind: "gap-check",
        status: "failed",
        at: new Date().toISOString(),
        detail: e instanceof Error ? e.message : "gap check failed",
      });
      setError(e instanceof Error ? e.message : "Gap check failed.");
    } finally {
      setLoading(false);
    }
  }

  async function loadQuizGeneration() {
    if (!topicId) return;
    setLoading(true);
    setError(null);
    setQuizPack(null);
    setQuizAttemptId(null);
    try {
      const pack = await generateQuiz({ topic: topicId, count: 8 });
      setQuizPack(pack);
      markActionComplete(topicId, "quiz");
      const ledgerId = await addQuizAttempt({
        topicId,
        questionCount: pack.questions.length,
        topicLabel: pack.topic,
      });
      setQuizAttemptId(ledgerId);
    } catch (e) {
      await appendStep({
        kind: "quiz",
        status: "failed",
        at: new Date().toISOString(),
        detail: e instanceof Error ? e.message : "quiz generation failed",
      });
      setError(e instanceof Error ? e.message : "Quiz generation failed.");
    } finally {
      setLoading(false);
    }
  }

  async function handleContinueFromGapReviewToQuiz() {
    setPhase("quiz");
    await loadQuizGeneration();
  }

  async function handleContinueAfterQuiz() {
    if (!quizPack || !topicId) return;
    await appendStep({
      kind: "quiz",
      status: "completed",
      at: new Date().toISOString(),
    });
    setPhase("flashcards");
    setLoading(true);
    setError(null);
    setDeck(null);
    try {
      const deckData = await generateFlashcards({ topic: topicId, count: 8 });
      setDeck(deckData);
      markActionComplete(topicId, "flashcards");
      await addDeckSnapshot({
        topicId,
        cardCount: deckData.cards.length,
        topicLabel: deckData.topic,
      });
      await appendStep(
        {
          kind: "flashcards",
          status: "completed",
          at: new Date().toISOString(),
        },
        true,
      );
      setPhase("done");
    } catch (e) {
      await appendStep({
        kind: "flashcards",
        status: "failed",
        at: new Date().toISOString(),
        detail: e instanceof Error ? e.message : "flashcards failed",
      });
      setError(e instanceof Error ? e.message : "Flashcards failed.");
    } finally {
      setLoading(false);
    }
  }

  const topicTitle =
    courseTopics.find((t) => t.id === topicId)?.title ?? topicId ?? "";

  return (
    <>
      <PageHeader
        title="Guided study run"
        description="Scaffold → gap reflection (skip or graded) → timed quiz bundle → flashcard deck — each step feeds the ledger and progress flags."
      />

      {phase === "pick" ? (
        <div className="mb-8 space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <label className="block text-xs font-medium text-zinc-500">
            Topic
            <select
              className="mt-1 w-full max-w-md rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
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
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-500"
              onClick={() => void handleStartRun()}
            >
              Start guided run
            </button>
            <Link
              href="/insights"
              className="rounded-xl border border-zinc-600 px-4 py-2.5 text-sm font-medium text-zinc-200 hover:bg-zinc-800/80"
            >
              View insights →
            </Link>
          </div>
        </div>
      ) : null}

      {phase !== "pick" && topicId ? (
        <>
          <p className="mb-6 text-sm text-zinc-400">
            Run on{" "}
            <Link className="text-cyan-400 hover:text-cyan-300" href={`/topics/${topicId}`}>
              {topicTitle}
            </Link>
          </p>

          <ResponsePanel
            loading={loading}
            error={error}
            emptyMessage=""
          />

          {phase === "gap" ? (
            <div className="grid gap-6 lg:grid-cols-2">
              <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
                <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3 text-xs text-zinc-400">
                  <p className="font-medium text-zinc-300">Respond to</p>
                  <pre className="mt-2 whitespace-pre-wrap font-sans">{GAP_PROMPT}</pre>
                </div>
                <textarea
                  className="min-h-44 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
                  value={gapAnswer}
                  onChange={(e) => setGapAnswer(e.target.value)}
                  disabled={loading}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-40"
                    onClick={() => void handleSubmitGap()}
                    disabled={loading}
                  >
                    Submit for gap feedback
                  </button>
                  <button
                    type="button"
                    className="rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                    onClick={() => void handleSkipGap()}
                    disabled={loading}
                  >
                    Skip to quiz
                  </button>
                </div>
              </div>
              <div className="rounded-2xl border border-zinc-800 bg-zinc-950/40 p-5 text-sm">
                <p className="text-xs font-semibold uppercase text-zinc-500">
                  How this step helps
                </p>
                <p className="mt-3 text-zinc-400">
                  You surface blind spots before the quiz fires. Prefer submit at least once; skip only if time-boxed.
                </p>
              </div>
            </div>
          ) : null}

          {phase === "gap_review" && gapResult ? (
            <div className="mb-10 space-y-4 rounded-2xl border border-emerald-500/20 bg-zinc-900/50 p-6">
              <div className="flex flex-wrap items-center gap-4">
                <ProgressRing value={gapResult.confidenceScore} max={100} />
                <div>
                  <p className="font-medium text-zinc-200">Gap snapshot</p>
                  <p className="text-sm text-zinc-500">{gapResult.topic}</p>
                </div>
              </div>
              <RunSection title="Strengths" items={gapResult.strengths} />
              <RunSection title="Gaps" items={gapResult.gaps} tone="rose" />
              <RunSection title="Misconceptions" items={gapResult.misconceptions} tone="amber" />
              <div>
                <p className="text-xs font-semibold uppercase text-zinc-500">Repair lesson</p>
                <p className="mt-2 text-sm text-zinc-300">{gapResult.repairLesson}</p>
              </div>
              <button
                type="button"
                className="rounded-xl bg-cyan-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-cyan-500 disabled:opacity-40"
                onClick={() => void handleContinueFromGapReviewToQuiz()}
                disabled={loading}
              >
                Continue to quiz →
              </button>
            </div>
          ) : null}

          {phase === "quiz" || phase === "flashcards" || phase === "done" ? (
            <div className="space-y-6">
              {quizPack ? (
                <>
                  <div className="space-y-4">
                    <p className="text-sm font-medium text-zinc-200">{quizPack.topic}</p>
                    {quizPack.questions.map((q, i) => (
                      <QuizCard key={q.id || String(i)} question={q} index={i} />
                    ))}
                  </div>
                  {topicId ? (
                    <QuizScoreLogger
                      topicId={topicId}
                      attemptId={quizAttemptId}
                      questionCount={quizPack.questions.length}
                    />
                  ) : null}
                  {phase === "quiz" ? (
                    <button
                      type="button"
                      className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-emerald-500 disabled:opacity-40"
                      onClick={() => void handleContinueAfterQuiz()}
                      disabled={loading}
                    >
                      Continue to flashcards
                    </button>
                  ) : null}
                </>
              ) : phase === "quiz" && !loading ? (
                <p className="text-sm text-zinc-500">Quiz did not load. Check earlier errors.</p>
              ) : null}

              {(phase === "flashcards" || phase === "done") && deck ? (
                <div className="space-y-4 border-t border-zinc-800 pt-8">
                  <h2 className="text-base font-semibold text-zinc-100">Deck</h2>
                  <p className="text-sm text-zinc-400">{deck.topic}</p>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {deck.cards.map((c, i) => (
                      <Flashcard key={`${c.front}-${i}`} card={c} />
                    ))}
                  </div>
                  {phase === "done" ? (
                    <div className="flex flex-wrap gap-3 pt-4">
                      <Link
                        href="/insights"
                        className="rounded-xl bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 hover:bg-white"
                      >
                        Review insights →
                      </Link>
                      <button
                        type="button"
                        className="rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-200 hover:bg-zinc-800"
                        onClick={() => {
                          setPhase("pick");
                          setGapResult(null);
                          setQuizPack(null);
                          setDeck(null);
                          setQuizAttemptId(null);
                          stepsRef.current = [];
                          startedAtRef.current = "";
                        }}
                      >
                        Start another run
                      </button>
                    </div>
                  ) : null}
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </>
  );
}

function RunSection({
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
      ? "border-rose-500/25"
      : tone === "amber"
        ? "border-amber-500/25"
        : "border-zinc-800";
  return (
    <div className={`rounded-xl border ${border} bg-zinc-950/50 p-3`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-300">
        {items.map((x, i) => (
          <li key={`${title}-${i}`}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
