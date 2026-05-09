import type { Metadata } from "next";
import { InteractiveLessonPlayer } from "@/components/interactive/interactive-lesson-player";
import { BRILLIANT_STYLE_LESSON } from "@/data/interactiveBrilliantLesson";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Interactive Lesson · Learn · GapCloser AI",
  description:
    "Step-by-step CAI1001C lesson with checkpoints — AI vs automation, supervised learning, data, and bias.",
};

export default function LearnInteractivePage() {
  return (
    <>
      <PageHeader
        eyebrow="Layout #2 · Brilliant-style lesson"
        title="Interactive lesson"
        description="Original chrome inspired by step-by-step learning apps: concept card, checkpoint, hints, and feedback — all local state, no server grading."
        summaryPoints={[
          "Eight steps across four unit themes from your syllabus vocabulary.",
          "Four interaction patterns you can reuse in other lessons.",
          "Keyboard-friendly controls; feedback uses text and icons, not color alone.",
        ]}
      />
      <InteractiveLessonPlayer steps={BRILLIANT_STYLE_LESSON} />
    </>
  );
}
