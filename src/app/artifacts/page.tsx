"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { MarkdownContent } from "@/components/markdown-content";
import { buildArtifact } from "@/lib/api-client";
import { markActionComplete, setLastStudiedTopic } from "@/lib/local-progress";

const TYPES = [
  "One-page explainer",
  "Workflow diagram text",
  "Risk checklist",
  "Case study",
  "Lab report",
  "Cheat sheet",
] as const;

export default function ArtifactsPage() {
  return (
    <Suspense fallback={<p className="text-sm text-zinc-500">Loading…</p>}>
      <ArtifactsInner />
    </Suspense>
  );
}

function ArtifactsInner() {
  const search = useSearchParams();
  const [topicId, setTopicId] = useState("");
  const [artifactType, setArtifactType] = useState<string>(TYPES[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [out, setOut] = useState<string | null>(null);

  useEffect(() => {
    const t = search.get("topic");
    if (t) setTopicId(t);
  }, [search]);

  const run = useCallback(async () => {
    if (!topicId) {
      setError("Select a topic.");
      return;
    }
    setError(null);
    setLoading(true);
    setOut(null);
    try {
      setLastStudiedTopic(topicId);
      const res = await buildArtifact({ topic: topicId, artifactType });
      setOut(res.output);
      markActionComplete(topicId, "artifact");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed.");
    } finally {
      setLoading(false);
    }
  }, [topicId, artifactType]);

  async function copy() {
    if (!out) return;
    await navigator.clipboard.writeText(out);
  }

  return (
    <>
      <PageHeader
        title="Portfolio artifacts"
        description="Generate Markdown artifacts you can drop in a portfolio or CMS."
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

          <label className="block text-xs font-medium text-zinc-500">
            Artifact type
            <select
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              value={artifactType}
              onChange={(e) => setArtifactType(e.target.value)}
            >
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            onClick={run}
            disabled={loading}
          >
            Generate
          </button>
          {out ? (
            <button
              type="button"
              className="ml-2 rounded-xl border border-zinc-600 px-4 py-2 text-sm text-zinc-200"
              onClick={copy}
            >
              Copy Markdown
            </button>
          ) : null}
        </div>

        <ResponsePanel
          loading={loading}
          error={error}
          emptyMessage="Artifact preview shows here."
        >
          {out ? <MarkdownContent content={out} /> : null}
        </ResponsePanel>
      </div>
    </>
  );
}
