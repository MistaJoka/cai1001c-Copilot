import type { Metadata } from "next";
import { NotebookCopilotLayout } from "@/components/notes/notebook-copilot-layout";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Notebook + Copilot · GapCloser AI",
  description:
    "Personal study notebook with a Gemini copilot for explanations, gaps, flashcards, and quizzes.",
};

export default function NotesCopilotPage() {
  return (
    <>
      <PageHeader
        eyebrow="Layout #10 · Notebook + copilot"
        title="Notebook & AI copilot"
        description="Capture Markdown-friendly notes with structured takeaways, then run copilot actions against the same draft. Desktop keeps your editor and assistant visible together; mobile swaps between Notes, Copilot, and a Flashcards preview."
        summaryPoints={[
          "Drafts persist in localStorage per topic id (samples + full CAI1001C catalog).",
          "Copilot calls existing Gemini routes: Study Buddy, gap check, flashcards, and quiz.",
          "The classic Notes Builder stays at /notes for paste-to-structure workflows.",
        ]}
      />
      <NotebookCopilotLayout />
    </>
  );
}
