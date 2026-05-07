"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";
import { ResponsePanel } from "@/components/response-panel";
import { TeachBackPanel } from "@/components/teach-back-panel";
import { askStudyBuddy, runTeachBack } from "@/lib/api-client";
import { markActionComplete, setLastStudiedTopic } from "@/lib/local-progress";
import type { TeachBackResponse } from "@/lib/schemas/teachBack";
import type { StudyAction } from "@/types";

const ACTIONS: { key: string; label: string; action?: StudyAction }[] = [
  { key: "explain", label: "Explain Simply", action: "explain" },
  { key: "quiz", label: "Quiz Me", action: "quiz" },
  { key: "example", label: "Give Example", action: "explain" },
  { key: "flashcards", label: "Make Flashcards", action: "flashcards" },
  { key: "gap", label: "Find My Gap", action: "gap-check" },
  { key: "teach", label: "Teach Back", action: "teach-back" },
  { key: "notes", label: "Turn Into Notes", action: "notes" },
  { key: "artifact", label: "Make Portfolio Artifact", action: "artifact" },
];

export default function StudyBuddyPage() {
  return (
    <Suspense
      fallback={
        <p className="text-sm text-zinc-500" role="status">
          Loading Study Buddy…
        </p>
      }
    >
      <StudyBuddyInner />
    </Suspense>
  );
}

function StudyBuddyInner() {
  const search = useSearchParams();
  const [topicId, setTopicId] = useState("");
  const [action, setAction] = useState<string>("");
  const [message, setMessage] = useState("");
  const [output, setOutput] = useState<string | null>(null);
  const [teachBack, setTeachBack] = useState<TeachBackResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const t = search.get("topic");
    const a = search.get("action");
    if (t) setTopicId(t);
    if (a) setAction(a);
  }, [search]);

  const send = useCallback(async () => {
    const msg = message.trim();
    if (!msg) {
      setError("Write a message first.");
      return;
    }
    setError(null);
    setLoading(true);
    setOutput(null);
    setTeachBack(null);
    try {
      if (topicId) setLastStudiedTopic(topicId);
      const mapped =
        action === "quiz"
          ? "quiz"
          : action === "flashcards"
            ? "flashcards"
            : action === "gap-check"
              ? "gap-check"
              : action === "teach-back"
                ? "teach-back"
                : action === "notes"
                  ? "notes"
                  : action === "artifact"
                    ? "artifact"
                    : action || undefined;

      if (mapped === "teach-back") {
        const res = await runTeachBack({
          message: msg,
          topic: topicId || undefined,
        });
        setTeachBack(res);
        setOutput(null);
      } else {
        const res = await askStudyBuddy({
          message: msg,
          topic: topicId || undefined,
          action: mapped,
        });
        setOutput(res.output);
      }
      if (topicId && mapped) {
        markActionComplete(topicId, mapped as StudyAction);
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }, [message, topicId, action]);

  return (
    <>
      <PageHeader
        title="Study Buddy"
        description="Topic-aware chat powered by Gemini on the server. Key never touches the browser."
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
              <option value="">General (no topic)</option>
              {courseTopics.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-xs font-medium text-zinc-500">
            Action hint
            <select
              className="mt-1 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              value={action}
              onChange={(e) => setAction(e.target.value)}
            >
              <option value="">General study help</option>
              {ACTIONS.filter((x) => x.action).map((x) => (
                <option key={x.key} value={x.action}>
                  {x.label}
                </option>
              ))}
            </select>
          </label>

          <div className="flex flex-wrap gap-2">
            {ACTIONS.map((a) => (
              <button
                key={a.key}
                type="button"
                className="rounded-xl border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"
                onClick={() => {
                  if (a.action) setAction(a.action);
                  if (a.key === "example") {
                    setMessage((m) =>
                      m.trim()
                        ? m
                        : "Give me a concrete real-world example for this topic.",
                    );
                  }
                }}
              >
                {a.label}
              </button>
            ))}
          </div>

          <label className="block text-xs font-medium text-zinc-500">
            Message
            <textarea
              className="mt-1 min-h-32 w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="What are you trying to understand?"
            />
          </label>

          <button
            type="button"
            className="rounded-xl bg-cyan-600 px-4 py-2 text-sm font-medium text-white hover:bg-cyan-500"
            onClick={send}
            disabled={loading}
          >
            Send to Gemini
          </button>
        </div>

        <div>
          {teachBack && !loading && !error ? (
            <TeachBackPanel data={teachBack} />
          ) : (
            <ResponsePanel
              loading={loading}
              error={error}
              markdown={output}
              emptyMessage="Response shows here after you send."
            />
          )}
        </div>
      </div>
    </>
  );
}
