import type { Metadata } from "next";
import Link from "next/link";
import { layoutRegistry } from "@/components/layouts/layout-registry";
import { LayoutCatalogCard } from "@/components/layouts/layout-catalog-card";
import { Panel } from "@/components/layouts/panel";
import { RevealSection } from "@/components/layouts/reveal-section";
import { PageHeader } from "@/components/page-header";

const LAYOUT_COUNT = layoutRegistry.length;

export const metadata: Metadata = {
  title: "Layouts · GapCloser AI",
  description:
    "Portfolio catalog of CAI1001C learning UI patterns — browse and open each layout.",
};

export default function LayoutsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Card grid library · meta"
        title="Learning layout catalog"
        description="Every shell pattern we ship toward, mapped to the closest live route. This page itself is layout #8 — a responsive card grid for browsing heterogeneous learning surfaces."
        summaryPoints={[
          `${LAYOUT_COUNT} layouts — names, status, and reference routes in one scan-friendly grid.`,
          "Hover a card for emphasis; use Open layout to jump into the implementation.",
          "Composition stays additive: catalog links deep into existing flows, no duplicates.",
        ]}
      />

      <RevealSection delay={0}>
      <Panel
        density="comfortable"
        className="mb-10 border-emerald-500/15 bg-gradient-to-br from-emerald-500/[0.05] via-zinc-900/35 to-transparent"
      >
        <h2 className="text-lg font-semibold tracking-tight text-zinc-50">
          Recommended flow
        </h2>
        <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-400">
          A sane default path through the layouts we ship — each step links to a live route.
          Skip ahead anytime from the nav rail, mobile bar, or More sheet.
        </p>
        <ol className="mt-6 space-y-4 text-sm text-zinc-300">
          <li className="flex flex-wrap gap-x-3 gap-y-1 border-l-2 border-emerald-500/40 pl-4">
            <span className="font-mono text-xs text-emerald-400/90">1</span>
            <span>
              <Link href="/" className="rounded-sm font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70">
                Start at Dashboard
              </Link>{" "}
              — snapshot readiness, weak spots, and quick actions.
            </span>
          </li>
          <li className="flex flex-wrap gap-x-3 gap-y-1 border-l-2 border-emerald-500/40 pl-4">
            <span className="font-mono text-xs text-emerald-400/90">2</span>
            <span>
              <Link
                href="/learn/command-center"
                className="rounded-sm font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
              >
                Open Command Center
              </Link>{" "}
              — module navigator + lesson canvas + AI side panel.
            </span>
          </li>
          <li className="flex flex-wrap gap-x-3 gap-y-1 border-l-2 border-emerald-500/40 pl-4">
            <span className="font-mono text-xs text-emerald-400/90">3</span>
            <span>
              <Link
                href="/learn/interactive"
                className="rounded-sm font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
              >
                Do Interactive Lesson
              </Link>{" "}
              — step-through checks without leaving the layout.
            </span>
          </li>
          <li className="flex flex-wrap gap-x-3 gap-y-1 border-l-2 border-emerald-500/40 pl-4">
            <span className="font-mono text-xs text-emerald-400/90">4</span>
            <span>
              <Link href="/ai-tutor" className="rounded-sm font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70">
                Ask AI Tutor
              </Link>{" "}
              — dialogic help when explanations need tailoring.
            </span>
          </li>
          <li className="flex flex-wrap gap-x-3 gap-y-1 border-l-2 border-emerald-500/40 pl-4">
            <span className="font-mono text-xs text-emerald-400/90">5</span>
            <span>
              <Link
                href="/notes/copilot"
                className="rounded-sm font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
              >
                Save Notes
              </Link>{" "}
              — notebook + copilot with local drafts per topic.
            </span>
          </li>
          <li className="flex flex-wrap gap-x-3 gap-y-1 border-l-2 border-emerald-500/40 pl-4">
            <span className="font-mono text-xs text-emerald-400/90">6</span>
            <span>
              <Link href="/flashcards" className="rounded-sm font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70">
                Review Flashcards
              </Link>{" "}
              — consolidate vocabulary and prompts.
            </span>
          </li>
          <li className="flex flex-wrap gap-x-3 gap-y-1 border-l-2 border-emerald-500/40 pl-4">
            <span className="font-mono text-xs text-emerald-400/90">7</span>
            <span>
              <Link
                href="/progress/path"
                className="rounded-sm font-medium text-cyan-400 hover:text-cyan-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
              >
                Check Quest Map Progress
              </Link>{" "}
              — spatial progress against the CAI1001C path.
            </span>
          </li>
        </ol>
      </Panel>
      </RevealSection>

      <RevealSection delay={0.05}>
      <Panel
        density="compact"
        className="mb-10 border-cyan-500/10 bg-gradient-to-br from-cyan-500/[0.06] via-zinc-900/30 to-transparent"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200/80">
              Pattern #8 — live here
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-400">
              Uniform cards, stable rhythm, and clear affordances reduce decision cost when
              learners do not yet know which tool they need — exactly how this catalog is
              structured.
            </p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-4 rounded-xl border border-zinc-800/80 bg-zinc-950/50 px-5 py-4">
            <div className="text-center">
              <p className="font-mono text-3xl font-semibold tabular-nums text-cyan-300">
                {LAYOUT_COUNT}
              </p>
              <p className="text-[11px] font-medium uppercase tracking-wide text-zinc-500">
                Layouts
              </p>
            </div>
            <div className="hidden h-10 w-px bg-zinc-800 sm:block" aria-hidden />
            <p className="max-w-[14rem] text-xs leading-relaxed text-zinc-500">
              Status reflects shell readiness in-app, not Gemini output quality.
            </p>
          </div>
        </div>
      </Panel>
      </RevealSection>

      <RevealSection delay={0.09}>
      <section aria-labelledby="catalog-heading" className="min-w-0">
        <h2 id="catalog-heading" className="sr-only">
          All layouts
        </h2>
        <div className="grid auto-rows-fr gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {layoutRegistry.map((entry) => (
            <LayoutCatalogCard key={entry.id} entry={entry} />
          ))}
        </div>
      </section>
      </RevealSection>
    </>
  );
}
