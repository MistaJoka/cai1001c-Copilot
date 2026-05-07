"use client";

import { useState } from "react";
import type { FlashcardsResponse } from "@/lib/schemas/flashcards";

type Card = FlashcardsResponse["cards"][number];

type Props = {
  card: Card;
};

const TYPE_LABEL: Record<Card["type"], string> = {
  definition: "Definition",
  example: "Example",
  compare: "Compare",
  scenario: "Scenario",
  common_mistake: "Common mistake",
  exam_trap: "Exam trap",
};

export function Flashcard({ card }: Props) {
  const [flipped, setFlipped] = useState(false);

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      className="w-full rounded-2xl border border-zinc-700 bg-zinc-900/60 p-4 text-left shadow-sm transition-colors hover:border-cyan-500/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cyan-500"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="rounded-full border border-zinc-600 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-zinc-400">
          {TYPE_LABEL[card.type]}
        </span>
        <span className="text-[10px] text-zinc-500">
          {flipped ? "Back" : "Front"} · tap flip
        </span>
      </div>
      <p className="text-sm font-medium text-zinc-100">
        {flipped ? card.back : card.front}
      </p>
    </button>
  );
}
