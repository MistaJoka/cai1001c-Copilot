"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { courseTopics } from "@/data/courseTopics";
import {
  GAPCLOSER_PROGRESS_EVENT,
  getLastStudiedTopic,
  getProgress,
  getTopicProgress,
} from "@/lib/local-progress";
import { PageHeader } from "@/components/page-header";
import { ProgressRing } from "@/components/progress-ring";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { InsightsTeaser } from "@/components/insights-teaser";

const CARDS = [
  {
    href: "/interactive-demo",
    title: "Interactive Lab",
    desc: "Structured drills — tap, drag, match, simulate — with immediate feedback.",
  },
  {
    href: "/study-buddy",
    title: "Study Buddy",
    desc: "Gemini tutor: deeper explanations, analogies, and worked misunderstandings.",
  },
  {
    href: "/gap-check",
    title: "Gap Check",
    desc: "You explain in your words; model returns gap list + what to re-study.",
  },
  {
    href: "/flashcards",
    title: "Flashcards",
    desc: "Topic-tagged cards with definitions you can regenerate as you improve.",
  },
  {
    href: "/notes",
    title: "Notes Builder",
    desc: "Turn messy lecture text into tight hierarchies and exam-ready bullets.",
  },
  {
    href: "/quiz",
    title: "Quiz",
    desc: "MCQ / short answer tied to syllabus language and distractors.",
  },
  {
    href: "/final-exam",
    title: "Final Exam Prep",
    desc: "Weak-area routing + high-yield review sequence (local progress aware).",
  },
  {
    href: "/artifacts",
    title: "Portfolio Artifact",
    desc: "One-page artifact you can show employers: claim, proof, reflection.",
  },
] as const;

const STUDY_FLOW = [
  {
    step: 1,
    title: "Choose a topic",
    detail: "Open the map and pick the concept you are accountable for next.",
    href: "/topics",
    cta: "Topic map",
  },
  {
    step: 2,
    title: "Build understanding",
    detail: "Use the lab for interaction, Study Buddy for depth and nuance.",
    href: "/interactive-demo",
    cta: "Interactive Lab",
  },
  {
    step: 3,
    title: "Surface gaps",
    detail: "Gap Check exposes blind spots; Quiz and flashcards lock in wording.",
    href: "/gap-check",
    cta: "Gap Check",
  },
  {
    step: 4,
    title: "Consolidate",
    detail: "Notes distill; Final Exam prep stress-tests readiness before the real thing.",
    href: "/final-exam",
    cta: "Exam prep",
  },
] as const;

const TOOL_GROUPS: {
  label: string;
  hint: string;
  items: readonly { href: string; title: string; desc: string }[];
}[] = [
  {
    label: "Learn & explain",
    hint: "Mental models first — no shame in re-running these.",
    items: [
      CARDS[0],
      CARDS[1],
      CARDS[4],
    ],
  },
  {
    label: "Test & retrieve",
    hint: "Spacing beats cramming. Mix modalities.",
    items: [
      CARDS[2],
      CARDS[5],
      CARDS[3],
    ],
  },
  {
    label: "Prove & package",
    hint: "Output you can ship: exam readiness + portfolio signal.",
    items: [
      CARDS[6],
      CARDS[7],
    ],
  },
];

export function DashboardContent() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [progressTick, setProgressTick] = useState(0);

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

  const progress = useMemo(() => {
    void pathname;
    void progressTick;
    return mounted ? getProgress() : {};
  }, [mounted, pathname, progressTick]);
  const lastId = mounted ? getLastStudiedTopic() : null;
  const lastTopic = lastId
    ? courseTopics.find((t) => t.id === lastId)
    : null;

  const weakPlaceholders = useMemo(() => {
    return courseTopics
      .filter((t) => {
        const p = progress[t.id];
        return !p || p.confidence === "low";
      })
      .slice(0, 3)
      .map((t) => t.title);
  }, [progress]);

  const startedCount = Object.keys(progress).length;
  const readiness = Math.round(
    (startedCount / Math.max(courseTopics.length, 1)) * 100,
  );

  return (
    <>
      <PageHeader
        eyebrow="CAI1001C · guided study"
        title="Dashboard"
        description="This workspace connects your course topics to Gemini-powered flows: interactive practice, tutoring, spaced retrieval, gap repair, and exam-shaped review. Progress stays in this browser — use it to prioritize weak areas, not as an official grade."
        summaryPoints={[
          "Every tool pulls topic context when you start from Topic Map or topic pages.",
          "Confidence ratings (low / medium / high) steer weak-topic lists and prep.",
          "Gemini outputs are study aids — verify critical facts against course materials.",
        ]}
      />

      <div className="rounded-2xl border border-cyan-500/15 bg-gradient-to-br from-cyan-500/[0.07] via-zinc-900/40 to-zinc-950/80 p-6 shadow-[0_0_0_1px_rgba(24,24,27,0.4)] md:p-8">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-200/90">
              Suggested path
            </h2>
            <p className="prose-reading mt-2 max-w-2xl text-zinc-200">
              Follow the loop in order when time is tight: pick a topic, build the
              model, test retrieval, then consolidate. Skipping straight to quiz works,
              but you get cleaner scores after an explanation pass.
            </p>
          </div>
        </div>
        <ol className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {STUDY_FLOW.map((s, i) => (
            <li
              key={s.step}
              className="relative rounded-xl border border-zinc-800/90 bg-zinc-950/40 p-4 pl-5 transition-colors hover:border-cyan-500/25"
            >
              <div className="absolute left-0 top-4 h-8 w-1 rounded-full bg-gradient-to-b from-cyan-400 to-indigo-500/80" />
              <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
                Step {s.step}
              </p>
              <p className="mt-1 font-semibold text-zinc-50">{s.title}</p>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{s.detail}</p>
              <Link
                href={s.href}
                className="mt-3 inline-flex text-sm font-medium text-cyan-300 hover:text-cyan-200"
              >
                {s.cta} →
              </Link>
              {i < STUDY_FLOW.length - 1 ? (
                <span
                  className="pointer-events-none absolute -right-2 top-1/2 hidden h-px w-4 -translate-y-1/2 bg-gradient-to-r from-cyan-500/40 to-transparent xl:block"
                  aria-hidden
                />
              ) : null}
            </li>
          ))}
        </ol>
      </div>

      <div className="mt-8">
        <InsightsTeaser />
      </div>

      <div className="mt-8 grid gap-4 lg:grid-cols-3">
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Course map
          </p>
          <p className="mt-2 text-3xl font-semibold tabular-nums text-zinc-50">
            {courseTopics.length}
            <span className="text-base font-normal text-zinc-500">
              {" "}
              topics
            </span>
          </p>
        </div>
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-5 shadow-sm backdrop-blur-sm">
          <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
            Needs attention
          </p>
          <ul className="mt-2 space-y-2 text-sm text-zinc-300">
            {weakPlaceholders.length ? (
              weakPlaceholders.map((t) => (
                <li key={t} className="flex items-start gap-2">
                  <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                  <span className="leading-snug">{t}</span>
                </li>
              ))
            ) : (
              <li className="text-zinc-500">
                Rate confidence on Topic Map cards to populate this list.
              </li>
            )}
          </ul>
        </div>
        <div className="flex items-center gap-4 rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-5 shadow-sm backdrop-blur-sm">
          <ProgressRing value={readiness} label="Readiness" />
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-zinc-500">
              Exam readiness (local)
            </p>
            <p className="prose-reading mt-1 text-zinc-400">
              Approximate coverage from topics you have opened at least once in this
              browser — calibrate with your instructor&rsquo;s expectations.
            </p>
          </div>
        </div>
      </div>

      <section className="mt-12">
        <h2 className="text-base font-semibold text-zinc-100">All tools</h2>
        <p className="prose-reading mt-2 max-w-3xl text-zinc-400">
          Grouped by intent. Same destinations as the nav — here with richer labels so
          you know when to use each.
        </p>
        <div className="mt-6 grid gap-8 lg:grid-cols-3">
          {TOOL_GROUPS.map((group) => (
            <div key={group.label}>
              <h3 className="text-sm font-semibold text-cyan-200/90">
                {group.label}
              </h3>
              <p className="mt-1 text-xs leading-relaxed text-zinc-500">{group.hint}</p>
              <ul className="mt-4 space-y-3">
                {group.items.map((c) => (
                  <li key={c.href}>
                    <Link
                      href={c.href}
                      className="group block rounded-xl border border-zinc-800/90 bg-zinc-900/25 p-4 transition-all duration-200 hover:border-cyan-500/35 hover:bg-zinc-900/50"
                    >
                      <p className="font-medium text-cyan-200 group-hover:text-cyan-100">
                        {c.title}
                      </p>
                      <p className="mt-1.5 text-sm leading-relaxed text-zinc-400">
                        {c.desc}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-12 rounded-2xl border border-zinc-800/90 bg-zinc-900/25 p-6 backdrop-blur-sm">
        <h2 className="text-base font-semibold text-zinc-100">Resume</h2>
        {lastTopic ? (
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Link
              href={`/topics/${lastTopic.id}`}
              className="text-sm font-medium text-cyan-400 hover:text-cyan-300"
            >
              {lastTopic.title}
            </Link>
            <ConfidenceBadge
              level={getTopicProgress(lastTopic.id)?.confidence ?? null}
            />
            <Link
              href="/topics"
              className="text-xs text-zinc-500 hover:text-zinc-300"
            >
              Browse all topics →
            </Link>
          </div>
        ) : (
          <p className="mt-2 text-sm text-zinc-500">
            Open a topic to begin — progress saves in this browser.
          </p>
        )}
      </section>
    </>
  );
}
