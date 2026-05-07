"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { courseTopics } from "@/data/courseTopics";
import { TopicCard } from "@/components/topic-card";
import { PageHeader } from "@/components/page-header";
import { GAPCLOSER_PROGRESS_EVENT, getProgress } from "@/lib/local-progress";

export default function TopicsPage() {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const [progressTick, setProgressTick] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const bump = () => setProgressTick((n) => n + 1);
    window.addEventListener(GAPCLOSER_PROGRESS_EVENT, bump);
    window.addEventListener("storage", bump);
    return () => {
      window.removeEventListener(GAPCLOSER_PROGRESS_EVENT, bump);
      window.removeEventListener("storage", bump);
    };
  }, []);

  const progress = useMemo(() => {
    void pathname;
    void progressTick;
    return mounted ? getProgress() : {};
  }, [mounted, pathname, progressTick]);

  return (
    <>
      <PageHeader
        eyebrow="Course coverage"
        title="Topic map"
        description="Each tile is a syllabus-sized concept with key terms, examples, and exam-shaped prompts baked in. Start from “Open topic” for the full study brief; use actions on the card when you already know which flow you need."
        summaryPoints={[
          "Confidence badges feed the dashboard “needs attention” list.",
          "Topic detail pages list outcomes before tools so you know what “done” looks like.",
          "Study Buddy / Quiz / Flashcards accept ?topic= when launched from here.",
        ]}
      />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {courseTopics.map((t) => (
          <TopicCard
            key={t.id}
            topic={t}
            confidence={progress[t.id]?.confidence ?? null}
          />
        ))}
      </div>
    </>
  );
}
