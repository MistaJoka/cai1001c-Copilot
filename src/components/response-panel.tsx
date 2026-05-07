"use client";

import { MarkdownContent } from "@/components/markdown-content";

type Props = {
  loading?: boolean;
  error?: string | null;
  emptyMessage?: string;
  markdown?: string | null;
  children?: React.ReactNode;
};

export function ResponsePanel({
  loading,
  error,
  emptyMessage = "Run an action to see output here.",
  markdown,
  children,
}: Props) {
  if (loading) {
    return (
      <div
        className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm text-zinc-400">Thinking with Gemini…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="rounded-2xl border border-rose-500/30 bg-rose-950/20 p-5 text-sm text-rose-200"
        role="alert"
      >
        {error}
      </div>
    );
  }
  if (children) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
        {children}
      </div>
    );
  }
  if (markdown?.trim()) {
    return (
      <div className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
        <MarkdownContent content={markdown} />
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/20 p-5 text-sm text-zinc-500">
      {emptyMessage}
    </div>
  );
}
