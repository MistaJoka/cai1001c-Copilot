import type { Metadata } from "next";
import { Suspense } from "react";
import { AiTutorWorkspace } from "@/components/ai-tutor/ai-tutor-workspace";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "AI Tutor · GapCloser AI",
  description:
    "Course-aware Gemini tutor — chat-first workspace with modes and topic context.",
};

export default function AiTutorPage() {
  return (
    <>
      <PageHeader
        eyebrow="Layout #3 · Chat-first tutor"
        title="AI tutor workspace"
        description="Same Study Buddy and teach-back APIs as before — reorganized for conversation-first studying with course buckets and quick structured actions."
        summaryPoints={[
          "Topic ids align with your CAI1001C catalog when you pick a context bucket.",
          "Modes map to existing server routes — no duplicate Gemini handlers.",
          "Desktop adds Study Actions; mobile stays full-width chat with chips.",
        ]}
      />
      <Suspense
        fallback={
          <p className="text-sm text-zinc-500" role="status">
            Loading tutor…
          </p>
        }
      >
        <AiTutorWorkspace />
      </Suspense>
    </>
  );
}
