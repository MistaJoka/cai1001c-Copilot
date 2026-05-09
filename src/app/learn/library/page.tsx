import type { Metadata } from "next";
import { LearningLibrary } from "@/components/library/learning-library";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Learning Library · GapCloser AI",
  description:
    "Browse lessons, concepts, quizzes, decks, projects, and exam prep in one filterable grid.",
};

export default function LearnLibraryPage() {
  return (
    <>
      <PageHeader
        eyebrow="Layout #8 · Card grid library"
        title="Learning library"
        description="A marketplace-style catalog for everything you can run in GapCloser—topics from CAI1001C drive most rows, with curated projects, review sets, prompt packs, and exam prep mixed in. Search and filters stay on-device for speed."
        summaryPoints={[
          "Live cards join courseTopics with quizzes, decks, concept drills, and AI-friendly links.",
          "Slice by type, module, difficulty, status, or weak-area signals from local progress.",
          "Primary and secondary actions jump straight into flows—no mystery navigation.",
        ]}
      />
      <LearningLibrary />
    </>
  );
}
