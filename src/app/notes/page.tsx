"use client";

import { useState } from "react";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { MarkdownContent } from "@/components/markdown-content";
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
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5">
          <textarea
            className="min-h-80 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            placeholder="Paste slides, reading notes, or lecture transcript…"
          />
          <button
            type="button"
            className="mt-4 rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            onClick={run}
            disabled={loading}
          >
            Build study notes
          </button>
        </div>
        <ResponsePanel
          loading={loading}
          error={error}
          emptyMessage="Notes render here."
        >
          {out ? <MarkdownContent content={out} /> : null}
        </ResponsePanel>
      </div>
    </>
  );
}
