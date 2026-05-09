/**
 * Composed CAI1001C demo graph for layout shells (command center, quest path,
 * notebook samples, library globals). Catalog facts still live in courseTopics;
 * structural IDs stay stable here.
 */

import type {
  NotebookSample,
  ProjectSummary,
  QuestNode,
} from "@/lib/course-content";

/** Command center navigator row — unchanged shape from legacy data module. */
export type CommandCenterModuleDef = {
  id: string;
  label: string;
  topicId: string | null;
  secondaryTopicId?: string;
};

export const COMMAND_CENTER_LAYOUT_MODULES: readonly CommandCenterModuleDef[] =
  [
    { id: "what-is-ai", label: "What is AI?", topicId: "ai-terminology" },
    { id: "ai-history", label: "AI history", topicId: "ai-history" },
    {
      id: "ml-basics",
      label: "Machine learning basics",
      topicId: "modeling",
    },
    {
      id: "supervised-vs-unsupervised",
      label: "Supervised vs unsupervised learning",
      topicId: "supervised-learning",
      secondaryTopicId: "unsupervised-learning",
    },
    {
      id: "neural-networks",
      label: "Neural networks",
      topicId: "neural-networks",
    },
    {
      id: "nlp",
      label: "Natural language processing",
      topicId: "deep-learning-nlp",
    },
    {
      id: "computer-vision",
      label: "Computer vision",
      topicId: "computer-vision",
    },
    {
      id: "ethics-bias",
      label: "Ethics and bias",
      topicId: "ai-ethics",
    },
    {
      id: "ai-society",
      label: "AI in society",
      topicId: "enterprise-ai-readiness",
    },
    { id: "final-review", label: "Final review", topicId: null },
  ] as const;

export const QUEST_PATH_LAYOUT_NODES: readonly QuestNode[] = [
  {
    id: "m1",
    title: "AI Foundations",
    kind: "module",
    topicIds: ["digital-literacy", "ai-terminology"],
    estimatedMinutes: 45,
    ctaHref: "/topics/ai-terminology",
    ctaLabel: "Open foundations",
  },
  {
    id: "m2",
    title: "AI History and Vocabulary",
    kind: "module",
    topicIds: ["ai-history", "ai-terminology"],
    estimatedMinutes: 40,
    ctaHref: "/topics/ai-history",
    ctaLabel: "Study timeline",
  },
  {
    id: "cp-literacy",
    title: "Checkpoint — AI literacy quiz",
    kind: "boss",
    topicIds: ["ai-history"],
    estimatedMinutes: 15,
    ctaHref: "/quiz?topic=ai-history&count=5",
    ctaLabel: "Checkpoint quiz",
  },
  {
    id: "m3",
    title: "Machine Learning Basics",
    kind: "module",
    topicIds: ["supervised-learning", "unsupervised-learning", "modeling"],
    estimatedMinutes: 55,
    ctaHref: "/topics/supervised-learning",
    ctaLabel: "Enter ML basics",
  },
  {
    id: "m4",
    title: "Data and Training",
    kind: "module",
    topicIds: ["data-preparation", "model-training", "evaluation"],
    estimatedMinutes: 60,
    ctaHref: "/topics/data-preparation",
    ctaLabel: "Open data track",
  },
  {
    id: "gate-retrieval",
    title: "Review gate — retrieval sprint",
    kind: "review_gate",
    topicIds: ["model-training"],
    estimatedMinutes: 20,
    ctaHref: "/study-run?topic=model-training",
    ctaLabel: "Study run",
  },
  {
    id: "m5",
    title: "Neural Networks",
    kind: "module",
    topicIds: ["neural-networks", "linear-classifiers"],
    estimatedMinutes: 50,
    ctaHref: "/topics/neural-networks",
    ctaLabel: "Architectures",
  },
  {
    id: "m6",
    title: "NLP and Computer Vision",
    kind: "module",
    topicIds: ["deep-learning-nlp", "computer-vision"],
    estimatedMinutes: 55,
    ctaHref: "/topics/deep-learning-nlp",
    ctaLabel: "Cross modalities",
  },
  {
    id: "cp-applied",
    title: "Checkpoint — applied ML quiz",
    kind: "boss",
    topicIds: ["neural-networks"],
    estimatedMinutes: 18,
    ctaHref: "/quiz?topic=neural-networks&count=8",
    ctaLabel: "Boss quiz",
  },
  {
    id: "m7",
    title: "Ethics, Bias, and Safety",
    kind: "module",
    topicIds: ["ai-ethics", "algorithmic-privacy-fairness"],
    estimatedMinutes: 45,
    ctaHref: "/topics/ai-ethics",
    ctaLabel: "Responsible AI",
  },
  {
    id: "m8",
    title: "AI Tools and Applications",
    kind: "module",
    topicIds: ["no-code-ai-tools", "enterprise-ai-readiness"],
    estimatedMinutes: 40,
    ctaHref: "/topics/no-code-ai-tools",
    ctaLabel: "Tools track",
  },
  {
    id: "m9",
    title: "Review Lab",
    kind: "module",
    topicIds: ["evaluation", "deployment"],
    estimatedMinutes: 35,
    ctaHref: "/interactive-demo",
    ctaLabel: "Interactive lab",
  },
  {
    id: "gate-gap",
    title: "Review gate — gap repair",
    kind: "review_gate",
    topicIds: ["deployment"],
    estimatedMinutes: 25,
    ctaHref: "/gap-check?topic=deployment",
    ctaLabel: "Gap check",
  },
  {
    id: "m10",
    title: "Final Exam Prep",
    kind: "module",
    topicIds: ["enterprise-ai-readiness"],
    estimatedMinutes: 50,
    ctaHref: "/final-exam",
    ctaLabel: "Exam prep",
  },
] as const;

export const NOTEBOOK_SAMPLES = [
  {
    id: "sample-what-is-ai",
    title: "What is AI?",
    body: `## Working definition
**Artificial intelligence (AI)** is software or hardware behavior that looks *intelligent*: it perceives information, represents goals, and produces actions or predictions under uncertainty.

## Rule-based vs learned
- **Classical / rule-based:** humans encode logic ("if temperature > X, alert").
- **Machine learning:** the system improves from data and feedback instead of only hand-written rules.

## Why definitions matter in CAI1001C
Exam prompts often ask you to separate **automation**, **narrow AI**, and **general intelligence** claims — especially in marketing language.`,
    keyTakeaways: `- AI is a *capability stack*: data → representation → objective → actions.
- Most deployed AI today is **narrow** (one task/domain).
- "Smart" demos still fail on edge cases — reliability is part of the definition of “works.”`,
    confusingPoints: `- Confusing **AI** with **AGI** from headlines.
- Thinking one big model "knows" facts like a human encyclopedia (it's pattern completion over training signal).`,
    questionsLater: `- Where would you refuse to use ML even if accuracy is high?
- What would you measure to prove an AI feature is "working" in production?`,
  },
  {
    id: "sample-machine-learning-basics",
    title: "Machine learning basics",
    body: `## Supervised learning
Learn a mapping **input → label** using example pairs (spam/not spam, defect/no defect).

## Unsupervised learning
Find structure without labels (clusters, embeddings, anomalies).

## Train / validation / test
- **Train:** update parameters.
- **Validation:** tune choices without peeking at the final exam set.
- **Test:** estimate generalization once.

## Overfitting
Model memorizes training quirks; validation metric worsens even when training looks amazing.`,
    keyTakeaways: `- **Features + objective + data** determine what the model can learn.
- Generalization beats leaderboard scores on a single split.
- Errors are often **data errors**, not only model capacity problems.`,
    confusingPoints: `- Why accuracy is misleading with **imbalanced classes**.
- Difference between **loss** (training signal) and **business metric** (what users feel).`,
    questionsLater: `- Pick one CAI1001C scenario: what label would you collect first?
- What leakage would make validation look too optimistic?`,
  },
  {
    id: "sample-bias-and-ethics",
    title: "Bias and ethics",
    body: `## Bias isn't only "bad people"
**Sampling bias, measurement bias, label bias, deployment bias** can turn neutral math into unfair outcomes.

## Privacy & consent
Personal data used for training or inference needs governance: purpose limitation, retention, access controls.

## Safety basics
- Fail gracefully when uncertain.
- Avoid amplifying harm at scale (credit, hiring, policing analogies).`,
    keyTakeaways: `- Ethics is **lifecycle**: collect → label → train → deploy → monitor.
- Fairness metrics conflict — no single number captures all stakeholder impacts.
- Transparency helps audits; it doesn't automatically fix harm.`,
    confusingPoints: `- Confusing **privacy** (limits on data use) with **security** (protecting systems).
- Thinking debiasing is only a post-processing step (often it's data + objectives).`,
    questionsLater: `- Name two stakeholders who disagree on "fair" for the same model.
- What would you log in production to detect drift toward harm?`,
  },
  {
    id: "sample-final-exam-review",
    title: "Final exam review",
    body: `## Sprint checklist
1. **Definitions:** AI vs ML vs automation; supervised vs unsupervised.
2. **Workflow:** data → train → evaluate → deploy → monitor.
3. **Risk:** bias/privacy/safety touchpoints + mitigations.
4. **Study tactics:** gap checks on weak objectives; teach-back paragraphs.

## Today’s focus areas (edit me)
- Terms you blank on in quizzes
- Diagram flows you can't redraw from memory`,
    keyTakeaways: `- Exams reward crisp contrasts (tradeoffs, limits, responsibilities).
- Weak objectives beat rereading slides.
- Teach-back reveals gaps faster than highlighting.`,
    confusingPoints: `- Mixing up **precision/recall** intuition under pressure.
- Forgetting where classical rules still beat ML.`,
    questionsLater: `- Which two topics get flashcards tonight?
- Which artifact-style answer would you submit if asked for “deployment readiness”?`,
  },
] as const satisfies readonly NotebookSample[];

export type NotebookSampleId = (typeof NOTEBOOK_SAMPLES)[number]["id"];

export type DemoLibraryKind =
  | "project"
  | "review"
  | "ai_prompt_pack"
  | "final_exam_prep";

export type DemoLibraryGlobalRow = ProjectSummary & {
  catalogKind: DemoLibraryKind;
};

/** Non-catalog library tiles — kinds map to learning-library card renderers. */
export const LAYOUT_GLOBAL_LIBRARY_ROWS: readonly DemoLibraryGlobalRow[] = [
  {
    catalogKind: "project",
    id: "proj-portfolio-lab",
    title: "Portfolio artifact studio",
    description:
      "Ship a concise artifact per module—rubrics, checklists, and one-page briefs recruiters can skim.",
    module: "Projects",
    estimatedMinutes: 120,
    difficulty: "stretch",
    primaryHref: "/artifacts",
    primaryLabel: "Browse artifacts",
    secondaryHref: "/notes",
    secondaryLabel: "Capture notes",
  },
  {
    catalogKind: "project",
    id: "proj-study-run-chain",
    title: "Study run chain",
    description:
      "Chain gap → quiz → flashcards for one sitting; ideal before exams.",
    module: "Projects",
    estimatedMinutes: 55,
    difficulty: "core",
    primaryHref: "/study-run",
    primaryLabel: "Start study run",
    secondaryHref: "/gap-check",
    secondaryLabel: "Gap check",
  },
  {
    catalogKind: "project",
    id: "proj-interactive-lab",
    title: "Interactive lab sprint",
    description:
      "Walk the interactive lesson player end-to-end with retrieval checks baked in.",
    module: "Interactive",
    estimatedMinutes: 40,
    difficulty: "intro",
    primaryHref: "/interactive-demo",
    primaryLabel: "Open interactive lab",
    secondaryHref: "/layouts",
    secondaryLabel: "Layouts catalog",
  },
  {
    catalogKind: "review",
    id: "review-hub-pass",
    title: "Review hub pass",
    description:
      "Central jump-off for quizzes, decks, and consolidation flows.",
    module: "Review",
    estimatedMinutes: 25,
    difficulty: "core",
    primaryHref: "/review",
    primaryLabel: "Open review hub",
    secondaryHref: "/flashcards",
    secondaryLabel: "Flashcards",
  },
  {
    catalogKind: "review",
    id: "review-spaced-evening",
    title: "Evening spaced review",
    description:
      "Lightweight reread plus five-card drill—keep forgetting curves flat.",
    module: "Review",
    estimatedMinutes: 20,
    difficulty: "intro",
    primaryHref: "/quiz?count=6",
    primaryLabel: "Quiz (mixed)",
    secondaryHref: "/flashcards",
    secondaryLabel: "Flashcards",
  },
  {
    catalogKind: "review",
    id: "review-gap-sweep",
    title: "Gap sweep",
    description:
      "Run short gap checks across weak objectives before the final.",
    module: "Review",
    estimatedMinutes: 35,
    difficulty: "core",
    primaryHref: "/gap-check",
    primaryLabel: "Gap check",
    secondaryHref: "/topics",
    secondaryLabel: "Topic map",
  },
  {
    catalogKind: "ai_prompt_pack",
    id: "prompt-tutor-starter",
    title: "Tutor questioning pack",
    description:
      "Prompt patterns that force elaboration, contrast, and self-explanation.",
    module: "AI prompts",
    estimatedMinutes: 15,
    difficulty: "intro",
    primaryHref: "/ai-tutor",
    primaryLabel: "Open AI tutor",
    secondaryHref: "/study-buddy",
    secondaryLabel: "Study Buddy",
  },
  {
    catalogKind: "ai_prompt_pack",
    id: "prompt-teach-back",
    title: "Teach-back rehearsal",
    description:
      "Structured prompts to narrate a topic like you are teaching a peer.",
    module: "AI prompts",
    estimatedMinutes: 20,
    difficulty: "core",
    primaryHref: "/ai-tutor",
    primaryLabel: "AI tutor · explain",
    secondaryHref: "/notes",
    secondaryLabel: "Notes surface",
  },
  {
    catalogKind: "ai_prompt_pack",
    id: "prompt-exam-drill",
    title: "Exam compression drill",
    description:
      "Ask for misconception scans plus weak-area follow-ups tied to objectives.",
    module: "AI prompts",
    estimatedMinutes: 18,
    difficulty: "stretch",
    primaryHref: "/ai-tutor",
    primaryLabel: "AI tutor workspace",
    secondaryHref: "/gap-check",
    secondaryLabel: "Gap check",
  },
  {
    catalogKind: "final_exam_prep",
    id: "final-exam-core",
    title: "Final exam · core sweep",
    description:
      "High-yield retrieval across CAI1001C objectives with AI-scored depth.",
    module: "Assessment",
    estimatedMinutes: 90,
    difficulty: "stretch",
    primaryHref: "/final-exam",
    primaryLabel: "Launch final exam",
    secondaryHref: "/quiz?count=10",
    secondaryLabel: "Practice quiz",
  },
  {
    catalogKind: "final_exam_prep",
    id: "final-exam-flash-blitz",
    title: "Final exam · vocabulary blitz",
    description:
      "Pair terminology reps with short quizzes before the timed exam.",
    module: "Assessment",
    estimatedMinutes: 45,
    difficulty: "core",
    primaryHref: "/flashcards",
    primaryLabel: "Flashcards",
    secondaryHref: "/final-exam",
    secondaryLabel: "Final exam",
  },
] as const;
