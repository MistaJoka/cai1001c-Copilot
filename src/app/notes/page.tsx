"use client";

import Link from "next/link";
import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { buildNotes } from "@/lib/api-client";

export default function NotesPage() {
  const [source, setSource] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [out, setOut] = useState<string | null>(null);

  async function run() {
    if (!source.trim()) {
      setError("Paste some class content.");
      return;
    }
    setError(null);
    setLoading(true);
    setOut(null);
    try {
      const res = await buildNotes({ sourceText: source.trim() });
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
        title="Notes Builder"
        description="Paste raw course content. Gemini returns structured study notes in Markdown."
      />
      <p className="mb-6 text-sm text-zinc-400">
        Prefer typing your own notebook with copilot actions? Open the{" "}
        <Link
          href="/notes/copilot"
          className="rounded-sm font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
        >
          Notebook + AI copilot
        </Link>{" "}
        layout — this paste-to-notes flow stays unchanged here.
      </p>
      <div className="grid min-w-0 gap-6 lg:grid-cols-2 lg:gap-8">
        <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-5 shadow-[0_0_0_1px_rgba(24,24,27,0.35)] sm:p-6">
          <textarea
            className="min-h-[min(22rem,50dvh)] w-full rounded-xl border border-zinc-800/90 bg-zinc-950 px-4 py-3 text-sm leading-relaxed text-zinc-100 placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Paste slides, reading notes, or lecture transcript…"
          />
          <button
            type="button"
            className="mt-5 inline-flex min-h-11 items-center justify-center rounded-xl bg-cyan-600 px-6 py-3 text-sm font-semibold text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300 disabled:opacity-50"
            onClick={run}
            disabled={loading}
          >
            Build study notes
          </button>
        </div>
        <ResponsePanel
          loading={loading}
          error={error}
          markdown={out}
          emptyMessage="Notes render here."
        />
      </div>
    </>
  );
}
