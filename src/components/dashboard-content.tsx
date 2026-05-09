"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { RevealSection } from "@/components/layouts/reveal-section";
import { courseTopics, type CourseTopic } from "@/data/courseTopics";
import {
  GAPCLOSER_PROGRESS_EVENT,
  getLastStudiedTopic,
  getProgress,
  getTopicProgress,
} from "@/lib/local-progress";
import {
  GAPCLOSER_LEDGER_EVENT,
  listDeckSnapshots,
  listQuizAttempts,
  listStudyRuns,
} from "@/lib/study-ledger";
import { PageHeader } from "@/components/page-header";
import { Panel } from "@/components/layouts/panel";
import { SectionHeader } from "@/components/layouts/section-header";
import { StatusPill } from "@/components/layouts/status-pill";
import { ProgressRing } from "@/components/layouts/progress-ring";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { InsightsTeaser } from "@/components/insights-teaser";
function withTopic(href: string, topicId: string | null): string {
  if (!topicId) return href;
  const join = href.includes("?") ? "&" : "?";
  return `${href}${join}topic=${encodeURIComponent(topicId)}`;
}

function formatShortDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleString(undefined, {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

type ActionCardProps = {
  href: string;
  title: string;
  subtitle: string;
  badge?: string;
};

function ActionCard({ href, title, subtitle, badge }: ActionCardProps) {
  const reduce = Boolean(useReducedMotion());
  return (
    <motion.div
      className="h-full min-h-[8.5rem]"
      initial={false}
      whileHover={
        reduce ? undefined : { y: -2, transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] } }
      }
    >
      <Link
        href={href}
        className="group flex h-full min-h-[8.5rem] flex-col rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-5 transition-colors duration-200 hover:border-cyan-500/30 hover:bg-zinc-900/55 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
      >
        <div className="flex items-start justify-between gap-2">
          <p className="font-medium text-cyan-100 group-hover:text-cyan-50">
            {title}
          </p>
          {badge ? (
            <span className="shrink-0 rounded-md border border-zinc-700/80 px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-500">
              {badge}
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">{subtitle}</p>
        <span className="mt-3 text-xs font-medium text-cyan-400/90 group-hover:text-cyan-300">
          Open →
        </span>
      </Link>
    </motion.div>
  );
}

type ActivityRow = { id: string; at: string; text: string };

export function DashboardContent() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [progressTick, setProgressTick] = useState(0);
  const [ledgerTick, setLedgerTick] = useState(0);
  const [activity, setActivity] = useState<ActivityRow[]>([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const bump = () => setProgressTick((n) => n + 1);
    window.addEventListener(GAPCLOSER_PROGRESS_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(GAPCLOSER_PROGRESS_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  useEffect(() => {
    const bump = () => setLedgerTick((n) => n + 1);
    window.addEventListener(GAPCLOSER_LEDGER_EVENT, bump);
    return () => window.removeEventListener(GAPCLOSER_LEDGER_EVENT, bump);
  }, []);

  const loadActivity = useCallback(async () => {
    try {
      const [quizzes, decks, runs] = await Promise.all([
        listQuizAttempts(),
        listDeckSnapshots(),
        listStudyRuns(),
      ]);
      const rows: { id: string; at: string; text: string }[] = [];

      for (const q of quizzes.slice(0, 20)) {
        const score =
          q.scorePercent != null ? ` · ${q.scorePercent}%` : "";
        rows.push({
          id: `quiz-${q.id}`,
          at: q.createdAt,
          text: `Quiz · ${q.topicLabel}${score} · ${q.questionCount} Q`,
        });
      }
      for (const d of decks.slice(0, 20)) {
        rows.push({
          id: `deck-${d.id}`,
          at: d.createdAt,
          text: `Flashcards saved · ${d.topicLabel} · ${d.cardCount} cards`,
        });
      }
      for (const r of runs.slice(0, 20)) {
        const meta = courseTopics.find((t) => t.id === r.topicId);
        const title = meta?.title ?? r.topicId;
        const done = r.steps.filter((s) => s.status === "completed").length;
        rows.push({
          id: `run-${r.id}`,
          at: r.startedAt,
          text: `Study run · ${title} · ${done}/${r.steps.length} steps`,
        });
      }

      rows.sort((a, b) => b.at.localeCompare(a.at));
      setActivity(rows.slice(0, 8));
    } catch {
      setActivity([]);
    }
  }, []);

  useEffect(() => {
    if (!mounted) return;
    void loadActivity();
  }, [loadActivity, ledgerTick, mounted]);

  const progress = useMemo(() => {
    void pathname;
    void progressTick;
    return mounted ? getProgress() : {};
  }, [mounted, pathname, progressTick]);

  const lastId = mounted ? getLastStudiedTopic() : null;
  const lastTopic: CourseTopic | null = lastId
    ? courseTopics.find((t) => t.id === lastId) ?? null
    : null;

  const weakTopicsFull = useMemo(() => {
    return courseTopics.filter((t) => {
      const p = progress[t.id];
      return !p || p.confidence === "low";
    });
  }, [progress]);

  const weakPreview = weakTopicsFull.slice(0, 6);

  const focusTopicId = weakTopicsFull[0]?.id ?? lastId ?? null;
  const focusTopicTitle =
    weakTopicsFull[0]?.title ?? lastTopic?.title ?? null;

  const startedCount = Object.keys(progress).length;
  const readiness = Math.round(
    (startedCount / Math.max(courseTopics.length, 1)) * 100,
  );

  const mediumHighCount = useMemo(() => {
    return courseTopics.filter((t) => {
      const c = progress[t.id]?.confidence;
      return c === "medium" || c === "high";
    }).length;
  }, [progress]);

  const aiSuggestion = useMemo(() => {
    const w = weakTopicsFull[0];
    if (w) {
      return {
        title: "Repair the weakest link first",
        body: (
          <>
            Spend ~10 minutes on{" "}
            <strong className="font-semibold text-zinc-200">{w.title}</strong>:
            run Gap Check in your own words, then redo the top missed idea with the
            Interactive Lab or Study Buddy.
          </>
        ),
      };
    }
    if (lastTopic) {
      return {
        title: "Consolidate what you last touched",
        body: (
          <>
            You were recently in{" "}
            <strong className="font-semibold text-zinc-200">
              {lastTopic.title}
            </strong>
            . Take a short quiz (5 questions), then skim flashcards for vocabulary
            only.
          </>
        ),
      };
    }
    return {
      title: "Calibrate the map",
      body: (
        <>
          Open the Topic Map and rate confidence on three exam-critical concepts —
          that unlocks weak-area routing on this dashboard.
        </>
      ),
    };
  }, [weakTopicsFull, lastTopic]);

  const nextLessonHref = lastTopic
    ? `/topics/${lastTopic.id}`
    : "/topics";
  const continueLabHref = "/interactive-demo";

  return (
    <>
      <PageHeader
        eyebrow="CAI1001C · layout #9 · command center"
        title="Study command center"
        description="One screen for what to do next: weak spots, fast actions, and local readiness. Progress and activity stay in this browser until you export from Insights."
        summaryPoints={[
          "Topic context passes through ?topic= when you launch tools from here.",
          "Confidence ratings feed weak-area picks — update them on the Topic Map.",
          "Gemini output is a coach, not a gradebook — verify facts with course materials.",
        ]}
      />

      <RevealSection delay={0}>
        <Panel className="mb-6 border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.05] via-zinc-900/25 to-transparent">
          <SectionHeader
            eyebrow="At a glance"
            title="Questions this dashboard answers"
            description="Skim left→right on large screens; tap through on mobile."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                What now?
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">
                {focusTopicTitle ? (
                  <>
                    Focus{" "}
                    <Link
                      href={`/topics/${focusTopicId}`}
                      className="text-cyan-400 underline-offset-2 hover:underline"
                    >
                      {focusTopicTitle}
                    </Link>
                  </>
                ) : (
                  "Pick a topic from the map to personalize actions."
                )}
              </p>
              {weakTopicsFull.length ? (
                <div className="mt-2">
                  <StatusPill status="partial" label="Weak signal" />
                </div>
              ) : (
                <div className="mt-2">
                  <StatusPill status="available" label="Balanced" />
                </div>
              )}
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Weak on?
              </p>
              <p className="mt-2 text-sm text-zinc-200">
                {weakPreview.length
                  ? `${weakPreview.length} topic${weakPreview.length === 1 ? "" : "s"} rated low or unset`
                  : "No low-confidence topics — nice."}
              </p>
              <Link
                href="/topics"
                className="mt-3 inline-flex text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                Topic map →
              </Link>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Next lesson?
              </p>
              <p className="mt-2 text-sm text-zinc-200">
                {lastTopic ? (
                  <>
                    Resume{" "}
                    <Link
                      href={nextLessonHref}
                      className="font-medium text-cyan-400 hover:text-cyan-300"
                    >
                      {lastTopic.title}
                    </Link>
                  </>
                ) : (
                  "Open any topic brief to establish a “continue” trail."
                )}
              </p>
              <Link
                href={continueLabHref}
                className="mt-3 inline-flex text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                Interactive lab →
              </Link>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                5–10 min win?
              </p>
              <p className="mt-2 text-sm text-zinc-200">
                Micro quiz + one retrieval pass beats passive rereading.
              </p>
              <Link
                href={
                  focusTopicId
                    ? `/quiz?topic=${encodeURIComponent(focusTopicId)}&count=5`
                    : "/quiz"
                }
                className="mt-3 inline-flex text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                5-question quiz →
              </Link>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/45 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wide text-zinc-500">
                Exam ready?
              </p>
              <div className="mt-2 flex items-center gap-3">
                <ProgressRing value={readiness} size="sm" />
                <p className="text-sm text-zinc-200">
                  <span className="tabular-nums font-semibold text-zinc-50">
                    {readiness}%
                  </span>{" "}
                  coverage · {mediumHighCount} med/high topics
                </p>
              </div>
              <Link
                href="/insights"
                className="mt-3 inline-flex text-xs font-medium text-cyan-400 hover:text-cyan-300"
              >
                Full progress →
              </Link>
            </div>
          </div>
        </Panel>
      </RevealSection>

      <RevealSection delay={0.04}>
        <Panel className="mb-6">
          <SectionHeader
            eyebrow="Plan"
            title="Today’s study plan"
            description="A tight loop you can finish in one sitting. Links prefer your current focus topic when we know it."
            actions={
              <Link
                href="/review"
                className="rounded-xl border border-zinc-700 bg-zinc-900/50 px-3 py-2 text-xs font-medium text-zinc-200 hover:border-zinc-600"
              >
                Review hub
              </Link>
            }
          />
          <ol className="mt-6 grid gap-4 md:grid-cols-3">
            <li className="rounded-xl border border-zinc-800/90 bg-zinc-950/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Step 1 · Surface
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">
                Explain cold — Gap Check
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Say it without notes; capture blind spots early.
              </p>
              <Link
                href={withTopic("/gap-check", focusTopicId)}
                className="mt-3 inline-flex text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Start gap check →
              </Link>
            </li>
            <li className="rounded-xl border border-zinc-800/90 bg-zinc-950/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Step 2 · Retrieve
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">
                Five forced recalls — Quiz
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Fast signal on wording and distractors.
              </p>
              <Link
                href={
                  focusTopicId
                    ? `/quiz?topic=${encodeURIComponent(focusTopicId)}&count=5`
                    : "/quiz"
                }
                className="mt-3 inline-flex text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Take quiz →
              </Link>
            </li>
            <li className="rounded-xl border border-zinc-800/90 bg-zinc-950/35 p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
                Step 3 · Consolidate
              </p>
              <p className="mt-2 text-sm font-medium text-zinc-100">
                Guided run — Study Run
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                Chains gap → quiz → cards with logging.
              </p>
              <Link
                href={withTopic("/study-run", focusTopicId)}
                className="mt-3 inline-flex text-sm font-medium text-cyan-400 hover:text-cyan-300"
              >
                Start study run →
              </Link>
            </li>
          </ol>
        </Panel>
      </RevealSection>

      <div className="mb-6 grid gap-5 lg:grid-cols-2">
        <RevealSection delay={0.08}>
          <Panel density="compact">
            <SectionHeader
              eyebrow="Resume"
              title="Continue learning"
              description="Jump back into your last topic or open the interactive lab."
            />
            <div className="mt-5 rounded-xl border border-zinc-800/80 bg-zinc-950/40 p-4">
              {lastTopic ? (
                <>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      href={`/topics/${lastTopic.id}`}
                      className="text-lg font-semibold text-zinc-50 hover:text-cyan-200"
                    >
                      {lastTopic.title}
                    </Link>
                    <ConfidenceBadge
                      level={getTopicProgress(lastTopic.id)?.confidence ?? null}
                    />
                  </div>
                  <p className="mt-2 text-sm text-zinc-500">
                    {lastTopic.category}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Link
                      href="/interactive-demo"
                      className="rounded-xl bg-cyan-600/90 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
                    >
                      Continue lesson
                    </Link>
                    <Link
                      href={`/topics/${lastTopic.id}`}
                      className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-200 hover:border-zinc-600"
                    >
                      Topic brief
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm text-zinc-400">
                  No recent topic yet —{" "}
                  <Link href="/topics" className="text-cyan-400 hover:text-cyan-300">
                    open the Topic Map
                  </Link>{" "}
                  and choose where to start.
                </p>
              )}
            </div>
          </Panel>
        </RevealSection>

        <RevealSection delay={0.1}>
          <Panel density="compact">
            <SectionHeader
              eyebrow="Radar"
              title="Weak areas"
              description="Topics with low confidence or never rated — prioritize these before cramming new material."
              actions={
                <Link
                  href="/topics"
                  className="text-xs font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Rate topics →
                </Link>
              }
            />
            <ul className="mt-5 space-y-2">
              {weakPreview.length ? (
                weakPreview.map((t) => (
                  <li key={t.id}>
                    <Link
                      href={`/topics/${t.id}`}
                      className="flex items-center justify-between gap-3 rounded-xl border border-zinc-800/80 bg-zinc-950/35 px-3 py-2.5 transition-colors hover:border-cyan-500/25"
                    >
                      <span className="text-sm font-medium text-zinc-200">
                        {t.title}
                      </span>
                      <ConfidenceBadge
                        level={getTopicProgress(t.id)?.confidence ?? null}
                      />
                    </Link>
                  </li>
                ))
              ) : (
                <li className="rounded-xl border border-dashed border-zinc-700/80 px-4 py-6 text-center text-sm text-zinc-500">
                  Nothing flagged — update Topic Map ratings if this feels wrong.
                </li>
              )}
            </ul>
          </Panel>
        </RevealSection>
      </div>

      <RevealSection delay={0.12}>
        <Panel className="mb-6">
          <SectionHeader
            eyebrow="Fast lane"
            title="Quick actions"
            description="Eight high-leverage jumps — each opens an existing flow. Topic-aware links activate when a focus topic is known."
          />
          <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <ActionCard
              href="/interactive-demo"
              title="Continue lesson"
              subtitle="Structured interactive lab — all step types."
              badge="Learn"
            />
            <ActionCard
              href={
                focusTopicId
                  ? `/quiz?topic=${encodeURIComponent(focusTopicId)}&count=5`
                  : "/quiz"
              }
              title="5-question quiz"
              subtitle="Forced recall with instant scoring."
              badge="5–8 min"
            />
            <ActionCard
              href={withTopic("/flashcards", focusTopicId)}
              title="Review flashcards"
              subtitle="Generate or regenerate a deck for your topic."
              badge="Retrieve"
            />
            <ActionCard
              href={withTopic("/ai-tutor", focusTopicId)}
              title="Ask AI Tutor"
              subtitle="Gemini explanations tuned to CAI1001C language."
              badge="Chat"
            />
            <ActionCard
              href="/notes"
              title="Open notes"
              subtitle="Paste messy sources → structured Markdown notes."
              badge="Capture"
            />
            <ActionCard
              href={withTopic("/study-run", focusTopicId)}
              title="Start study run"
              subtitle="Gap → quiz → flashcards with ledger logging."
              badge="Guided"
            />
            <ActionCard
              href={withTopic("/gap-check", focusTopicId)}
              title="Check gaps"
              subtitle="Teach-back style gap analysis + repair prompts."
              badge="Diagnose"
            />
            <ActionCard
              href="/final-exam"
              title="Practice final exam"
              subtitle="Exam-shaped prep using local weak signals."
              badge="Exam"
            />
          </div>
        </Panel>
      </RevealSection>

      <RevealSection delay={0.14}>
        <Panel className="mb-6" density="compact">
          <SectionHeader
            eyebrow="Ledger"
            title="Recent activity"
            description="Latest quiz attempts, saved decks, and study runs from this browser."
          />
          <ul className="mt-5 divide-y divide-zinc-800/80 rounded-xl border border-zinc-800/80">
            {activity.length ? (
              activity.map((row) => (
                <li
                  key={row.id}
                  className="flex flex-wrap items-baseline justify-between gap-2 px-4 py-3 text-sm"
                >
                  <span className="text-zinc-300">{row.text}</span>
                  <time
                    className="text-xs tabular-nums text-zinc-600"
                    dateTime={row.at}
                  >
                    {formatShortDate(row.at)}
                  </time>
                </li>
              ))
            ) : (
              <li className="px-4 py-10 text-center text-sm text-zinc-500">
                No ledger events yet — finish a quiz or study run and they will
                appear here.
              </li>
            )}
          </ul>
        </Panel>
      </RevealSection>

      <div className="mb-6 grid gap-5 lg:grid-cols-5">
        <RevealSection delay={0.16} className="lg:col-span-3">
          <Panel>
            <SectionHeader
              eyebrow="Coverage"
              title="Readiness meter"
              description="Approximate coverage from topics touched in this browser plus confidence mix — not an official grade."
            />
            <div className="mt-6 flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <ProgressRing value={readiness} size="lg" label="Course readiness" />
              <div className="min-w-0 flex-1 space-y-3 text-sm">
                <p className="text-zinc-300">
                  <span className="font-semibold text-zinc-100">
                    {startedCount}
                  </span>{" "}
                  / {courseTopics.length} topics with saved progress
                </p>
                <p className="text-zinc-500">
                  {mediumHighCount} topics at medium or high confidence ·{" "}
                  {weakTopicsFull.length} need attention
                </p>
                <Link
                  href="/insights"
                  className="inline-flex text-sm font-medium text-cyan-400 hover:text-cyan-300"
                >
                  Open Progress & insights →
                </Link>
              </div>
            </div>
          </Panel>
        </RevealSection>

        <RevealSection delay={0.18} className="lg:col-span-2">
          <Panel className="h-full border-indigo-500/10 bg-gradient-to-b from-indigo-500/[0.04] to-transparent">
            <SectionHeader
              eyebrow="Coach"
              title="AI suggested next step"
              description="Rule-based hint from your local signals — no API call."
              actions={<StatusPill status="planned" label="Heuristic" />}
            />
            <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-cyan-200/90">
              {aiSuggestion.title}
            </p>
            <p className="prose-reading mt-3 text-sm leading-relaxed text-zinc-400">
              {aiSuggestion.body}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              <Link
                href={withTopic("/ai-tutor", focusTopicId)}
                className="rounded-xl bg-cyan-600/90 px-4 py-2 text-xs font-semibold text-white hover:bg-cyan-500"
              >
                Ask tutor
              </Link>
              <Link
                href={withTopic("/gap-check", focusTopicId)}
                className="rounded-xl border border-zinc-700 px-4 py-2 text-xs font-medium text-zinc-200 hover:border-zinc-600"
              >
                Gap check
              </Link>
            </div>
          </Panel>
        </RevealSection>
      </div>

      <RevealSection delay={0.2}>
        <div className="mb-8">
          <InsightsTeaser />
        </div>
      </RevealSection>
    </>
  );
}
