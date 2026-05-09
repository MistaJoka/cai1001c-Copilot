import type { Metadata } from "next";
import {
  CommandCenterLayout,
  type ResolvedCommandCenterModule,
} from "@/components/learn/command-center-layout";
import { COMMAND_CENTER_LAYOUT_MODULES as COMMAND_CENTER_MODULES } from "@/lib/layout-demo-data";
import { getTopicById } from "@/data/courseTopics";
import { PageHeader } from "@/components/page-header";

export const metadata: Metadata = {
  title: "Command Center · Learn · GapCloser AI",
  description:
    "Three-pane CAI1001C workspace: modules, lesson canvas, and AI quick actions.",
};

export default function LearnCommandCenterPage() {
  const modules: ResolvedCommandCenterModule[] = COMMAND_CENTER_MODULES.map(
    (def) => ({
      id: def.id,
      label: def.label,
      topicId: def.topicId,
      topic: def.topicId ? getTopicById(def.topicId) ?? null : null,
      secondaryTopic: def.secondaryTopicId
        ? getTopicById(def.secondaryTopicId) ?? null
        : null,
    }),
  );

  return (
    <>
      <PageHeader
        eyebrow="Layout #1 · Command center + lesson canvas"
        title="Learning workspace"
        description="Desktop: course context, lesson surface, and tutor shortcuts side by side. Mobile: switch between Lesson, Modules, and AI Help."
        summaryPoints={[
          "Module copy is pulled from your CAI1001C topic catalog when an id matches.",
          "Quick actions deep-link into Study Buddy, Quiz, Gap Check, and Flashcards.",
          "Interactive checkpoint is a deliberate placeholder for future step widgets.",
        ]}
      />
      <CommandCenterLayout modules={modules} />
    </>
  );
}
