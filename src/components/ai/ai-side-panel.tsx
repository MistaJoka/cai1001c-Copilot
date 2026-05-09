"use client";

import Link from "next/link";

type QuickAction = {
  label: string;
  href: string;
  description: string;
};

function buildQuickActions(topicId: string | null): QuickAction[] {
  const withParams = (path: string, params?: Record<string, string>) => {
    const s = new URLSearchParams();
    if (topicId) s.set("topic", topicId);
    if (params) {
      for (const [k, v] of Object.entries(params)) {
        if (v) s.set(k, v);
      }
    }
    const qs = s.toString();
    return qs ? `${path}?${qs}` : path;
  };

  return [
    {
      label: "Explain easier",
      description: "Plain-language pass on this concept.",
      href: withParams("/ai-tutor", { action: "explain" }),
    },
    {
      label: "Give example",
      description: "Concrete scenario you can rehearse.",
      href: withParams("/ai-tutor", {
        action: "explain",
        hint: "example",
      }),
    },
    {
      label: "Quiz me",
      description: "Five questions on the active topic.",
      href: topicId
        ? `/quiz?topic=${encodeURIComponent(topicId)}&count=5`
        : "/quiz",
    },
    {
      label: "Summarize",
      description: "Bullet recap starter in Study Buddy.",
      href: withParams("/study-buddy", {
        action: "explain",
        hint: "summarize",
      }),
    },
    {
      label: "Find my gap",
      description: "Explain cold — get repair cues.",
      href: withParams("/gap-check"),
    },
    {
      label: "Turn into flashcards",
      description: "Generate a deck for this topic.",
      href: withParams("/flashcards"),
    },
  ];
}

type Props = {
  topicId: string | null;
  moduleLabel: string;
  className?: string;
};

export function AiSidePanel({ topicId, moduleLabel, className = "" }: Props) {
  const actions = buildQuickActions(topicId);

  return (
    <aside
      className={`flex flex-col rounded-2xl border border-zinc-800/90 bg-zinc-950/60 ${className}`}
      aria-label="AI tutor and quick actions"
    >
      <div className="border-b border-zinc-800/80 px-5 py-5">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-cyan-400/85">
          AI tutor / help
        </p>
        <p className="mt-2 text-sm font-medium text-zinc-100">
          Quick actions for{" "}
          <span className="text-cyan-200/95">{moduleLabel}</span>
        </p>
        <p className="mt-2 text-xs leading-relaxed text-zinc-500">
          Opens existing app routes. AI Tutor runs Gemini on the server when
          configured.
        </p>
      </div>

      <ul className="flex flex-col gap-2 p-3">
        {actions.map((a) => (
          <li key={a.label}>
            <Link
              href={a.href}
              className="block rounded-xl border border-zinc-800/80 bg-zinc-900/40 px-4 py-3 transition-colors hover:border-cyan-500/30 hover:bg-zinc-900/65"
            >
              <span className="font-medium text-cyan-100">{a.label}</span>
              <span className="mt-1 block text-xs text-zinc-500">{a.description}</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="mt-auto border-t border-zinc-800/80 p-4">
        <Link
          href={
            topicId
              ? `/ai-tutor?topic=${encodeURIComponent(topicId)}`
              : "/ai-tutor"
          }
          className="flex w-full items-center justify-center rounded-xl bg-cyan-600/90 py-2.5 text-sm font-semibold text-white hover:bg-cyan-500"
        >
          Open AI Tutor
        </Link>
      </div>
    </aside>
  );
}
