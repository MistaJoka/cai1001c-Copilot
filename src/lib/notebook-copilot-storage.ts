import { getTopicById } from "@/data/courseTopics";
import {
  NOTEBOOK_SAMPLES,
  type NotebookSampleId,
} from "@/lib/layout-demo-data";

export type NotebookDraft = {
  topicId: string;
  title: string;
  body: string;
  keyTakeaways: string;
  confusingPoints: string;
  questionsLater: string;
  updatedAt: string;
};

const STORAGE_KEY = "gapcloser-notebook-copilot-v1";

export type SampleNotebookTopicId = NotebookSampleId;

export const SAMPLE_NOTEBOOK_TOPIC_IDS = NOTEBOOK_SAMPLES.map(
  (s) => s.id,
) as readonly NotebookSampleId[];

function emptyDraft(topicId: string): NotebookDraft {
  return {
    topicId,
    title: "",
    body: "",
    keyTakeaways: "",
    confusingPoints: "",
    questionsLater: "",
    updatedAt: new Date().toISOString(),
  };
}

function seedSample(topicId: SampleNotebookTopicId): NotebookDraft {
  const s = NOTEBOOK_SAMPLES.find((x) => x.id === topicId);
  if (!s) return emptyDraft(topicId);
  return {
    topicId,
    title: s.title,
    body: s.body,
    keyTakeaways: s.keyTakeaways,
    confusingPoints: s.confusingPoints,
    questionsLater: s.questionsLater,
    updatedAt: new Date().toISOString(),
  };
}

export function topicOptionLabel(topicId: string): string {
  const meta = getTopicById(topicId);
  if (meta) return `${meta.title} (${meta.category})`;
  const sample = NOTEBOOK_SAMPLES.find((x) => x.id === topicId);
  if (sample) return `Sample · ${sample.title}`;
  return topicId;
}

export function createInitialDraft(topicId: string): NotebookDraft {
  const sampleHit = NOTEBOOK_SAMPLES.find((x) => x.id === topicId);
  if (sampleHit) {
    return seedSample(sampleHit.id);
  }
  const course = getTopicById(topicId);
  if (course) {
    return {
      topicId,
      title: course.title,
      body: `${course.description}\n\n### Key terms\n${course.keyTerms.map((t) => `- ${t}`).join("\n")}`,
      keyTakeaways: course.examFocus.map((x) => `- ${x}`).join("\n"),
      confusingPoints: "",
      questionsLater: "",
      updatedAt: new Date().toISOString(),
    };
  }
  return emptyDraft(topicId);
}

function readStore(): Record<string, NotebookDraft> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw) as Record<string, NotebookDraft>;
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
}

function writeStore(store: Record<string, NotebookDraft>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

export function loadNotebookDraft(topicId: string): NotebookDraft | null {
  const store = readStore();
  const hit = store[topicId];
  if (!hit || typeof hit !== "object") return null;
  return { ...hit, topicId };
}

export function saveNotebookDraft(draft: NotebookDraft) {
  const store = readStore();
  const next: NotebookDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  };
  store[next.topicId] = next;
  writeStore(store);
}

export function compileNotebookForPrompt(d: NotebookDraft): string {
  return [
    `# ${d.title}`,
    "",
    "## Note body",
    d.body,
    "",
    "## Key takeaways",
    d.keyTakeaways,
    "",
    "## Confusing points",
    d.confusingPoints,
    "",
    "## Questions for later",
    d.questionsLater,
  ].join("\n");
}

export function gapCheckResponseToMarkdown(data: {
  topic: string;
  strengths: string[];
  gaps: string[];
  misconceptions: string[];
  repairLesson: string;
  nextStudyActions: string[];
  followUpQuestions: string[];
  confidenceScore: number;
}): string {
  const bullets = (xs: string[]) =>
    xs.length ? xs.map((x) => `- ${x}`).join("\n") : "_None listed._";
  return [
    `## Gap check · ${data.topic}`,
    "",
    `**Confidence score:** ${data.confidenceScore}/100`,
    "",
    "### Strengths",
    bullets(data.strengths),
    "",
    "### Gaps",
    bullets(data.gaps),
    "",
    "### Misconceptions",
    bullets(data.misconceptions),
    "",
    "### Repair lesson",
    data.repairLesson,
    "",
    "### Next study actions",
    bullets(data.nextStudyActions),
    "",
    "### Follow-up questions",
    bullets(data.followUpQuestions),
  ].join("\n");
}

export function quizResponseToMarkdown(q: {
  topic: string;
  questions: Array<{
    id: string;
    question: string;
    choices?: string[];
    correctAnswer: string;
    explanation: string;
    commonTrap: string;
  }>;
}): string {
  let md = `## Quiz draft · ${q.topic}\n\n`;
  for (const item of q.questions) {
    md += `### ${item.id}. ${item.question}\n\n`;
    if (item.choices?.length) {
      md += item.choices.map((c) => `- ${c}`).join("\n");
      md += "\n\n";
    }
    md += `**Answer:** ${item.correctAnswer}\n\n`;
    md += `**Why:** ${item.explanation}\n\n`;
    md += `**Trap:** ${item.commonTrap}\n\n---\n\n`;
  }
  return md.trim();
}
