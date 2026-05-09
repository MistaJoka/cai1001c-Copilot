import Link from "next/link";
import { PageHeader } from "@/components/page-header";

const REVIEW_DESTINATIONS: {
  href: string;
  title: string;
  description: string;
}[] = [
  {
    href: "/study-run",
    title: "Study Run",
    description: "Guided sequence: gap check → quiz → flashcards for one topic.",
  },
  {
    href: "/gap-check",
    title: "Gap Check",
    description: "Explain in your own words; get strengths, gaps, and repair cues.",
  },
  {
    href: "/quiz",
    title: "Quiz",
    description: "MCQ and short answer shaped like exam prompts.",
  },
  {
    href: "/flashcards",
    title: "Flashcards",
    description: "Definitions and contrasts you can regenerate as you improve.",
  },
  {
    href: "/final-exam",
    title: "Final Exam Prep",
    description: "Weak-area aware review sequence before the real assessment.",
  },
];

export default function ReviewHubPage() {
  return (
    <>
      <PageHeader
        eyebrow="Retrieve · verify · consolidate"
        title="Review hub"
        description="Pick a modality that matches how much time you have. Everything here uses your topic context when you arrive from Topic Map or topic pages."
        summaryPoints={[
          "Mix formats — retrieval beats re-reading the same paragraph.",
          "Start from a weak topic for the biggest ROI.",
          "Scores and decks stay local to this browser (see Progress).",
        ]}
      />

      <div className="grid gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
        {REVIEW_DESTINATIONS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="group flex min-h-[10rem] flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-6 shadow-[0_0_0_1px_rgba(24,24,27,0.35)] transition-colors hover:border-cyan-500/25 hover:bg-zinc-900/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
          >
            <p className="font-semibold text-cyan-200 group-hover:text-cyan-100">
              {item.title}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              {item.description}
            </p>
            <span className="mt-auto pt-4 inline-flex text-sm font-medium text-cyan-400 group-hover:text-cyan-300">
              Open →
            </span>
          </Link>
        ))}
      </div>
    </>
  );
}
