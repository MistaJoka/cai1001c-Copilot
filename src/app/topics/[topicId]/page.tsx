import { notFound } from "next/navigation";
import Link from "next/link";
import { getTopicById } from "@/data/courseTopics";
import { StudyActionButton } from "@/components/study-action-button";
import { TopicConfidenceClient } from "@/components/topic-confidence-client";

type Props = { params: Promise<{ topicId: string }> };

const ACTION_HINT: Record<string, string> = {
  explain:
    'Socratic explanations; ask "why" until it clicks.',
  quiz: "Forced recall under gentle time pressure.",
  flashcards:
    "Definitions and contrasts; good for vocabulary-heavy topics.",
  "gap-check": "Say it yourself; get a repair list for weak links.",
  "teach-back":
    "Rubber-duck the concept; model checks structure.",
  artifact: "Portfolio-ready deliverable tied to this unit.",
};

export default async function TopicDetailPage({ params }: Props) {
  const { topicId } = await params;
  const topic = getTopicById(topicId);
  if (!topic) notFound();

  return (
    <>
      <nav
        className="mb-6 text-sm text-zinc-500"
        aria-label="Breadcrumb"
      >
        <Link href="/topics" className="text-cyan-400/90 hover:text-cyan-300">
          Topic map
        </Link>
        <span className="mx-2 text-zinc-600" aria-hidden>
          /
        </span>
        <span className="text-zinc-400">{topic.category}</span>
      </nav>

      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/90">
            {topic.category}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-50">
            {topic.title}
          </h1>
        </div>
        <TopicConfidenceClient topicId={topic.id} />
      </div>

      <p className="prose-reading max-w-3xl text-zinc-200">{topic.description}</p>

      <section className="mt-10" aria-labelledby="outcomes-heading">
        <h2
          id="outcomes-heading"
          className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-500"
        >
          What you should be able to do
        </h2>
        <p className="prose-reading mt-2 max-w-3xl text-zinc-400">
          These come straight from the topic&rsquo;s exam-shaped prompts — use them
          to self-check before quizzes or the final.
        </p>
        <ol className="mt-5 max-w-3xl space-y-3">
          {topic.examFocus.map((item, idx) => (
            <li
              key={item}
              className="flex gap-4 rounded-xl border border-zinc-800/90 bg-zinc-900/30 px-4 py-3 text-sm leading-relaxed text-zinc-200"
            >
              <span className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-xs font-semibold text-cyan-200">
                {idx + 1}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ol>
      </section>

      <section
        className="mt-10 rounded-2xl border border-zinc-800/90 bg-zinc-900/25 p-6 backdrop-blur-sm md:p-8"
        aria-labelledby="toolkit-heading"
      >
        <h2
          id="toolkit-heading"
          className="text-base font-semibold text-zinc-100"
        >
          Concept toolkit
        </h2>
        <p className="prose-reading mt-2 text-zinc-400">
          Vocabulary, anchors, and artifact line — skim headings first, then drill
          what you need.
        </p>
        <div className="mt-8 grid gap-10 lg:grid-cols-3">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Key terms
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-200">
              {topic.keyTerms.map((k) => (
                <li key={k} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-cyan-500/60" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Concrete examples
            </h3>
            <ul className="mt-3 space-y-2 text-sm leading-relaxed text-zinc-200">
              {topic.examples.map((k) => (
                <li key={k} className="flex gap-2">
                  <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-indigo-400/50" />
                  {k}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
              Portfolio line
            </h3>
            <p className="prose-reading mt-3 text-sm text-zinc-300">
              {topic.portfolioArtifact}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="actions-heading">
        <h2 id="actions-heading" className="text-base font-semibold text-zinc-100">
          Study toolkit
        </h2>
        <p className="prose-reading mt-2 max-w-3xl text-zinc-400">
          Each flow keeps this topic ID in the URL when supported, so Gemini prompts stay
          on-rails. Pick based on where you are in the loop: explain → retrieve → prove.
        </p>
        <ul className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {(
            [
              ["explain", `/study-buddy?topic=${topic.id}&action=explain`],
              ["quiz", `/quiz?topic=${topic.id}`],
              ["flashcards", `/flashcards?topic=${topic.id}`],
              ["gap-check", `/gap-check?topic=${topic.id}`],
              ["teach-back", `/study-buddy?topic=${topic.id}&action=teach-back`],
              ["artifact", `/artifacts?topic=${topic.id}`],
            ] as const
          ).map(([action, href]) => {
            const hint = ACTION_HINT[action];
            return (
              <li
                key={action}
                className="flex flex-col rounded-xl border border-zinc-800/90 bg-zinc-950/30 p-4"
              >
                <StudyActionButton
                  action={action}
                  href={href}
                  variant={action === "explain" ? "primary" : "ghost"}
                  fullWidth
                />
                {hint ? (
                  <p className="mt-2 text-xs leading-relaxed text-zinc-500">
                    {hint}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-xs text-zinc-600">
          Tip: pair{" "}
          <span className="text-zinc-400">Gap check</span> after{" "}
          <span className="text-zinc-400">Study Buddy</span> to verify you can
          generate the explanation yourself.
        </p>
        <p className="mt-8 text-xs text-zinc-500">
          Want a scripted loop? Try the guided{" "}
          <Link
            href={`/study-run?topic=${topic.id}`}
            className="font-medium text-cyan-400 hover:text-cyan-300"
          >
            Study Run
          </Link>{" "}
          → gap → quiz → deck.
        </p>
        <Link
          href="/topics"
          className="mt-4 inline-flex text-sm font-medium text-cyan-400/90 hover:text-cyan-300"
        >
          ← All topics
        </Link>
      </section>
    </>
  );
}
