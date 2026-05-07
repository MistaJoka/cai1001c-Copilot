"use client";

import { useState } from "react";
import type { QuizResponse } from "@/lib/schemas/quiz";

type Q = QuizResponse["questions"][number];

type Props = {
  question: Q;
  index: number;
};

export function QuizCard({ question, index }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <article className="rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm">
      <div className="mb-2 text-xs font-medium text-zinc-500">
        Q{index + 1} · {question.type.replace("_", " ")}
      </div>
      <p className="text-sm font-medium text-zinc-100">{question.question}</p>
      {question.choices && question.choices.length > 0 ? (
        <ul className="mt-3 space-y-1 text-sm text-zinc-400">
          {question.choices.map((c, i) => (
            <li key={i} className="rounded-lg border border-zinc-800 px-3 py-2">
              {c}
            </li>
          ))}
        </ul>
      ) : null}
      <button
        type="button"
        className="mt-4 rounded-xl border border-cyan-500/40 bg-cyan-500/10 px-4 py-2 text-xs font-medium text-cyan-200"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? "Hide answer" : "Reveal answer"}
      </button>
      {open ? (
        <div className="mt-4 space-y-2 border-t border-zinc-800 pt-4 text-sm">
          <p>
            <span className="text-zinc-500">Answer: </span>
            <span className="text-emerald-200">{question.correctAnswer}</span>
          </p>
          <p className="text-zinc-300">{question.explanation}</p>
          <p className="text-xs text-amber-200/90">
            Trap: {question.commonTrap}
          </p>
        </div>
      ) : null}
    </article>
  );
}
