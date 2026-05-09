import type { Metadata } from "next";
import { QuestMap } from "@/components/progress/quest-map";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Learning Path · Progress · GapCloser AI",
  description:
    "Quest-style CAI1001C module path with local mastery signals and checkpoints.",
};

export default function ProgressPathPage() {
  return (
    <>
      <PageHeader
        eyebrow="Layout #4 · Quest map"
        title="Module path"
        description="Vertical command map through CAI1001C: ten curriculum modules plus checkpoint quizzes and review gates. Status blends your browser-local confidence and actions — unlocks propagate forward when you establish a footprint on the prior segment."
        summaryPoints={[
          "Mastery % is a heuristic from topic confidence + completed actions.",
          "Boss rows pressure-test with quizzes; gates route into study runs or gap repair.",
          "Nothing here is an official grade — verify outcomes with course materials.",
        ]}
      />
      <QuestMap />
    </>
  );
}
