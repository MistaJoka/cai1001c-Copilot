import Link from "next/link";
import type { StudyAction } from "@/types";

const LABELS: Record<StudyAction, string> = {
  explain: "Explain",
  quiz: "Quiz",
  flashcards: "Flashcards",
  "gap-check": "Gap Check",
  "teach-back": "Teach Back",
  notes: "Notes",
  artifact: "Artifact",
  "final-exam": "Final Exam",
};

type Props = {
  action: StudyAction;
  href: string;
  variant?: "primary" | "ghost";
  fullWidth?: boolean;
};

export function StudyActionButton({
  action,
  href,
  variant = "ghost",
  fullWidth = false,
}: Props) {
  const base =
    variant === "primary"
      ? "border-cyan-500/50 bg-cyan-500/10 text-cyan-200 hover:bg-cyan-500/20"
      : "border-zinc-700 text-zinc-300 hover:border-zinc-500 hover:bg-zinc-800/60";
  const width = fullWidth ? "w-full justify-center" : "";
  return (
    <Link
      href={href}
      className={`inline-flex rounded-xl border px-3 py-1.5 text-xs font-medium transition-colors ${width} ${base}`}
    >
      {LABELS[action]}
    </Link>
  );
}
