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
        className="flex min-h-[7.5rem] flex-col justify-center rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 shadow-[0_0_0_1px_rgba(24,24,27,0.35)]"
        role="status"
        aria-live="polite"
      >
        <div className="flex items-center gap-3">
          <span
            className="inline-flex h-9 w-9 animate-pulse rounded-xl border border-cyan-500/25 bg-cyan-500/10"
            aria-hidden
          />
          <div className="min-w-0 flex-1 space-y-2">
            <div className="h-2.5 max-w-[12rem] animate-pulse rounded-full bg-zinc-700/80" />
            <div className="h-2 max-w-[80%] animate-pulse rounded-full bg-zinc-800/90" />
          </div>
        </div>
        <p className="mt-4 text-sm text-zinc-400">Thinking with Gemini…</p>
      </div>
    );
  }
  if (error) {
    return (
      <div
        className="rounded-2xl border border-rose-500/35 bg-rose-950/25 p-6 text-sm leading-relaxed text-rose-100"
        role="alert"
      >
        {error}
      </div>
    );
  }
  if (children) {
    return (
      <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 shadow-[0_0_0_1px_rgba(24,24,27,0.35)]">
        {children}
      </div>
    );
  }
  if (markdown?.trim()) {
    return (
      <div className="rounded-2xl border border-zinc-800/90 bg-zinc-900/40 p-6 shadow-[0_0_0_1px_rgba(24,24,27,0.35)]">
        <MarkdownContent content={markdown} />
      </div>
    );
  }
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700/90 bg-zinc-900/25 p-6 text-sm leading-relaxed text-zinc-500">
      {emptyMessage}
    </div>
  );
}
