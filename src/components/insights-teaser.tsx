"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  GAPCLOSER_LEDGER_EVENT,
  listDeckSnapshots,
  listQuizAttempts,
  listStudyRuns,
} from "@/lib/study-ledger";

export function InsightsTeaser() {
  const [mounted, setMounted] = useState(false);
  const [quizN, setQuizN] = useState(0);
  const [deckN, setDeckN] = useState(0);
  const [runN, setRunN] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const load = async () => {
      try {
        const [q, d, r] = await Promise.all([
          listQuizAttempts(),
          listDeckSnapshots(),
          listStudyRuns(),
        ]);
        setQuizN(q.length);
        setDeckN(d.length);
        setRunN(r.length);
      } catch {
        /* noop */
      }
    };
    void load();
    const bump = () => void load();
    window.addEventListener(GAPCLOSER_LEDGER_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(GAPCLOSER_LEDGER_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, [mounted]);

  if (!mounted) {
    return (
      <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/25 p-6 backdrop-blur-sm">
        <p className="text-sm text-zinc-500">Loading study log…</p>
      </div>
    );
  }

  return (
    <section className="rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.06] via-zinc-900/30 to-zinc-950/80 p-6 md:p-7">
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h2 className="text-base font-semibold text-zinc-100">
            Local study log · analytics
          </h2>
          <p className="prose-reading mt-2 max-w-2xl text-sm text-zinc-400">
            Quiz attempts and flashcard generations save in IndexedDB on this device. Open insights for weakest topics or export JSON for backup — no login required yet.
          </p>
          <dl className="mt-5 grid gap-4 sm:grid-cols-3">
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Quiz sessions
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-50">
                {quizN}
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Deck snapshots
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-50">
                {deckN}
              </dd>
            </div>
            <div className="rounded-xl border border-zinc-800/80 bg-zinc-950/40 px-4 py-3">
              <dt className="text-xs uppercase tracking-wide text-zinc-500">
                Guided runs
              </dt>
              <dd className="mt-1 text-2xl font-semibold tabular-nums text-zinc-50">
                {runN}
              </dd>
            </div>
          </dl>
        </div>
        <div className="flex shrink-0 flex-col gap-2">
          <Link
            href="/insights"
            className="rounded-xl bg-emerald-600 px-4 py-2.5 text-center text-sm font-medium text-white hover:bg-emerald-500"
          >
            Open insights →
          </Link>
          <Link
            href="/study-run"
            className="rounded-xl border border-zinc-600 px-4 py-2.5 text-center text-sm font-medium text-zinc-200 hover:bg-zinc-800/70"
          >
            Start guided study run →
          </Link>
        </div>
      </div>
    </section>
  );
}
