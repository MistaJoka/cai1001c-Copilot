import Link from "next/link";
import type { CourseTopic } from "@/data/courseTopics";
import { ConfidenceBadge } from "@/components/confidence-badge";
import { StudyActionButton } from "@/components/study-action-button";
import type { ConfidenceLevel } from "@/types";

type Props = {
  topic: CourseTopic;
  confidence?: ConfidenceLevel | null;
};

export function TopicCard({ topic, confidence }: Props) {
  const terms = topic.keyTerms.slice(0, 4).join(" · ");
  const outcomePreview = topic.examFocus[0] ?? "";

  return (
    <article className="flex flex-col rounded-2xl border border-zinc-800/90 bg-zinc-900/35 p-5 shadow-sm backdrop-blur-sm transition-colors hover:border-cyan-500/20">
      <div className="mb-2 flex flex-wrap items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wide text-cyan-400/90">
          {topic.category}
        </span>
        <ConfidenceBadge level={confidence ?? null} />
      </div>
      <h2 className="text-lg font-semibold text-zinc-50">{topic.title}</h2>
      <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-zinc-300">
        {topic.description}
      </p>
      {outcomePreview ? (
        <p className="mt-3 border-l-2 border-cyan-500/35 pl-3 text-xs leading-relaxed text-zinc-400">
          <span className="font-medium text-zinc-500">Exam-shaped: </span>
          {outcomePreview}
        </p>
      ) : null}
      <p className="mt-3 text-xs text-zinc-500">{terms}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        <StudyActionButton
          action="explain"
          href={`/study-buddy?topic=${topic.id}&action=explain`}
          variant="primary"
        />
        <StudyActionButton
          action="quiz"
          href={`/quiz?topic=${topic.id}`}
        />
        <StudyActionButton
          action="flashcards"
          href={`/flashcards?topic=${topic.id}`}
        />
        <StudyActionButton
          action="artifact"
          href={`/artifacts?topic=${topic.id}`}
        />
      </div>
      <Link
        href={`/topics/${topic.id}`}
        className="mt-4 text-xs font-medium text-cyan-400 hover:text-cyan-300"
      >
        Open topic →
      </Link>
    </article>
  );
}
