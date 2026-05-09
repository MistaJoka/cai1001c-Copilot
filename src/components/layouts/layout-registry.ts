import type { LayoutRegistryEntry } from "@/components/layouts/layout-types";

export const layoutRegistry: readonly LayoutRegistryEntry[] = [
  {
    id: "command-center",
    title: "Command center",
    description:
      "Dense ops view: priorities, weak spots, and one-click jumps into study modes.",
    bestUse: "Daily orientation — decide what to study next in under a minute.",
    route: "/learn/command-center",
    status: "partial",
    primaryComponents: ["KPI strip", "Weak-area queue", "Quick actions"],
    learningValue:
      "Surfaces retrieval priorities before learners drift into passive reading.",
  },
  {
    id: "interactive-lesson",
    title: "Interactive lesson",
    description:
      "Step-by-step lesson canvas with checks, motion where it helps, and tight feedback loops.",
    bestUse: "Teaching new concepts with embedded interactions (not just walls of text).",
    route: "/learn/interactive",
    status: "available",
    primaryComponents: ["Progress path", "Step renderer", "Hint panel"],
    learningValue:
      "Chunks cognitive load and forces retrieval between explanations.",
  },
  {
    id: "ai-tutor-workspace",
    title: "AI tutor workspace",
    description:
      "Chat-first surface tuned for explanations, analogies, and misconception repair.",
    bestUse: "Dialogic learning when flashcards feel too thin for the concept.",
    route: "/ai-tutor",
    status: "available",
    primaryComponents: ["Thread panel", "Composer", "Markdown response"],
    learningValue:
      "Keeps the learner generating questions — the tutor responds to their mental model.",
  },
  {
    id: "quest-map",
    title: "Quest map",
    description:
      "Spatial or nodal map of modules with progress cues and unlock metaphors.",
    bestUse: "Motivation + orientation across many topics (course-as-journey framing).",
    route: "/progress/path",
    status: "partial",
    primaryComponents: ["Module nodes", "Progress glyphs", "Legend"],
    learningValue:
      "Turns coverage into a navigable graph instead of a flat syllabus list.",
  },
  {
    id: "mobile-bottom-nav",
    title: "Mobile bottom navigation",
    description:
      "Thumb-first chrome with persistent primary destinations and safe-area respect.",
    bestUse: "Phones and tablets where top menus hide critical study flows.",
    route: "/",
    status: "planned",
    primaryComponents: ["Tab bar", "Active indicator", "Overflow"],
    learningValue:
      "Reduces friction for quick retrieval sessions on the go.",
  },
  {
    id: "adaptive-nav-rail",
    title: "Adaptive navigation rail",
    description:
      "Collapsible rail that scales icon density by breakpoint without losing wayfinding.",
    bestUse: "Wide screens where learners jump tools frequently mid-session.",
    route: "/",
    status: "partial",
    primaryComponents: ["Rail", "Section labels", "Collapse control"],
    learningValue:
      "Keeps navigation muscle memory stable across dense study workflows.",
  },
  {
    id: "master-detail",
    title: "Master–detail split",
    description:
      "Select an item on the left (or top on small screens); rich detail on the right.",
    bestUse: "Libraries, notes, or topic lists where comparison is common.",
    route: "/learn/master-detail",
    status: "partial",
    primaryComponents: ["Master list", "Detail pane", "Splitter"],
    learningValue:
      "Preserves context while inspecting content — fewer full-page hops.",
  },
  {
    id: "card-grid-library",
    title: "Card grid library",
    description:
      "Uniform cards for browse-and-filter mental models (topics, decks, artifacts).",
    bestUse: "Discovery when users do not yet know which flow they need.",
    route: "/learn/library",
    status: "available",
    primaryComponents: ["Card grid", "Confidence badges", "Filters"],
    learningValue:
      "Chunked scanning beats long tables for heterogeneous learning objects.",
  },
  {
    id: "dashboard-action-cards",
    title: "Dashboard + action cards",
    description:
      "Grouped CTAs with narrative hints — dashboard as curated launcher, not a report.",
    bestUse: "First-run guidance and returning learners who want structured paths.",
    route: "/",
    status: "available",
    primaryComponents: ["Hero path", "Grouped cards", "Resume strip"],
    learningValue:
      "Turns intent (“learn vs test vs consolidate”) into visible affordances.",
  },
  {
    id: "notebook-copilot",
    title: "Notebook + copilot",
    description:
      "Primary authoring surface paired with an AI column for restructuring drafts.",
    bestUse: "Turning messy inputs into study-ready hierarchies and bullets.",
    route: "/notes/copilot",
    status: "available",
    primaryComponents: ["Notebook editor", "Copilot panel", "Run action"],
    learningValue:
      "Separates raw capture from polished notes — ideal for exam encoding.",
  },
] as const;

export function getLayoutEntry(id: LayoutRegistryEntry["id"]) {
  return layoutRegistry.find((e) => e.id === id);
}
