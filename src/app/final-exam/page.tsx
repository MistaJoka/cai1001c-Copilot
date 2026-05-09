"use client";

import { useEffect, useState } from "react";
import { courseTopics } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { buildFinalExamPrep } from "@/lib/api-client";
import { getProgress } from "@/lib/local-progress";

export default function FinalExamPage() {
  const [selected, setSelected] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [out, setOut] = useState<string | null>(null);

  useEffect(() => {
    const p = getProgress();
    const weak = courseTopics
      .filter((t) => p[t.id]?.confidence !== "high")
      .map((t) => t.id);
    setSelected(weak);
  }, []);

  function toggle(id: string) {
    setSelected((s) =>
      s.includes(id) ? s.filter((x) => x !== id) : [...s, id],
    );
  }

  async function run() {
    setError(null);
    setLoading(true);
    setOut(null);
    try {
      const res = await buildFinalExamPrep({
        weakTopics: selected.length ? selected : undefined,
      });
      setOut(res.output);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <PageHeader
        title="Final exam prep"
        description="Sends weak-topic labels to Gemini and returns a full Markdown prep packet."
      />

      <div className="mb-6 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
        <h2 className="text-sm font-semibold text-zinc-200">Topic checklist</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {courseTopics.map((t) => (
            <li key={t.id}>
              <label className="flex cursor-pointer items-start gap-2 text-sm text-zinc-300">
                <input
                  type="checkbox"
                  className="mt-1 rounded border-zinc-600"
                  checked={selected.includes(t.id)}
                  onChange={() => toggle(t.id)}
                />
                <span>{t.title}</span>
              </label>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-xs text-zinc-500">
          Checked topics are treated as weaker areas in the prep plan.
        </p>
      </div>

      <button
        type="button"
        className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
        onClick={run}
        disabled={loading}
      >
        Generate prep plan
      </button>

      <div className="mt-6">
        <ResponsePanel
          loading={loading}
          error={error}
          markdown={out}
          emptyMessage="Prep packet shows here."
        />
      </div>
    </>
  );
}
