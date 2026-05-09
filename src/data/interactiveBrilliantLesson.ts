/**
 * Static lesson content for /learn/interactive — CAI1001C themes, no API.
 */

export type McInteraction = {
  type: "multiple-choice";
  options: { id: string; label: string }[];
  correctId: string;
};

export type TfInteraction = {
  type: "true-false";
  correct: boolean;
};

export type SortInteraction = {
  type: "sort";
  items: { id: string; label: string }[];
  /** Ordered item ids, top to bottom = correct sequence */
  correctOrder: string[];
};

export type MatchInteraction = {
  type: "match";
  left: { id: string; label: string }[];
  right: { id: string; label: string }[];
  /** Each left id maps to the correct right id */
  correct: Record<string, string>;
};

export type BrilliantLessonStep = {
  id: string;
  unitLabel: string;
  conceptTitle: string;
  conceptBody: string;
  questionPrompt: string;
  interaction: McInteraction | TfInteraction | SortInteraction | MatchInteraction;
  hint: string;
  explainCorrect: string;
  explainIncorrect: string;
};

export const BRILLIANT_STYLE_LESSON: BrilliantLessonStep[] = [
  {
    id: "auto-1",
    unitLabel: "AI vs automation",
    conceptTitle: "Automation follows rules; AI learns patterns",
    conceptBody:
      "Classic automation repeats fixed instructions (if-this-then-that). Many AI systems instead infer behavior from examples and generalize to new inputs — though they still run on computers like any other software.",
    questionPrompt: "Which statement best fits CAI1001C’s distinction?",
    interaction: {
      type: "multiple-choice",
      options: [
        {
          id: "a",
          label: "AI always means robots with human-like bodies.",
        },
        {
          id: "b",
          label:
            "Automation executes explicit rules; machine learning can adapt from data within its training distribution.",
        },
        {
          id: "c",
          label: "If it uses a computer, it counts as AI.",
        },
      ],
      correctId: "b",
    },
    hint: "Think about fixed scripts versus updating weights from examples.",
    explainCorrect:
      "Right — rule-based automation vs pattern learning from data is the core contrast.",
    explainIncorrect:
      "AI isn’t defined by hardware form factor or “anything digital.” Focus on rules vs learned patterns.",
  },
  {
    id: "auto-2",
    unitLabel: "AI vs automation",
    conceptTitle: "Not every smart workflow is “AI”",
    conceptBody:
      "Spreadsheet formulas and cron jobs can feel clever but they are deterministic. ML enters when behavior is shaped substantially by training data rather than only hand-authored logic.",
    questionPrompt: "True or false: A hard-coded spam filter that only blocks exact phrases is best described as classic automation, not ML.",
    interaction: { type: "true-false", correct: true },
    hint: "ML spam filters typically learn from labeled email examples.",
    explainCorrect:
      "Yes — phrase lists without learning from examples are rule automation.",
    explainIncorrect:
      "Phrase-only blocking is rule-based; ML would update from examples and generalize.",
  },
  {
    id: "supervised-1",
    unitLabel: "Supervised learning",
    conceptTitle: "Labels supervise the target",
    conceptBody:
      "In supervised learning, each training example pairs inputs with an explicit output (label). The model’s job is to approximate that mapping on unseen data.",
    questionPrompt: "Order the supervised learning pipeline stages (first → last).",
    interaction: {
      type: "sort",
      items: [
        { id: "eval", label: "Evaluate on held-out data" },
        { id: "collect", label: "Collect labeled examples" },
        { id: "train", label: "Train model to minimize error on labels" },
        { id: "deploy", label: "Deploy if metrics meet requirements" },
      ],
      correctOrder: ["collect", "train", "eval", "deploy"],
    },
    hint: "You cannot train meaningfully before you have labeled data.",
    explainCorrect:
      "Collect labeled data → train → evaluate → deploy is the textbook cadence.",
    explainIncorrect:
      "Training before labels or deploying before evaluation breaks the loop.",
  },
  {
    id: "supervised-2",
    unitLabel: "Supervised learning",
    conceptTitle: "Classification vs regression",
    conceptBody:
      "Classification predicts discrete categories (spam/not spam). Regression predicts continuous quantities (price, temperature). Both can be supervised if labels exist.",
    questionPrompt: "Pick the best fit.",
    interaction: {
      type: "multiple-choice",
      options: [
        { id: "a", label: "Predicting tomorrow’s rainfall in millimeters" },
        { id: "b", label: "Predicting whether an image is cat vs dog" },
        { id: "c", label: "Both are unsupervised by definition" },
      ],
      correctId: "b",
    },
    hint: "Discrete categories vs continuous numbers.",
    explainCorrect:
      "Cat vs dog is discrete labels — classic classification.",
    explainIncorrect:
      "Rainfall amount is regression; both can be supervised if labeled.",
  },
  {
    id: "data-1",
    unitLabel: "Training data",
    conceptTitle: "Garbage in, garbage out",
    conceptBody:
      "Training data defines what the model can learn. Biased sampling, mislabeled rows, or leaky features silently become failure modes at deployment.",
    questionPrompt: "Match each concept on the left with the best description.",
    interaction: {
      type: "match",
      left: [
        { id: "l1", label: "Representative sample" },
        { id: "l2", label: "Label noise" },
        { id: "l3", label: "Train/test leakage" },
      ],
      right: [
        { id: "r1", label: "Training rows accidentally echo answers from validation" },
        { id: "r2", label: "Examples reflect the real populations you will serve" },
        { id: "r3", label: "Wrong or inconsistent tags on training examples" },
      ],
      correct: {
        l1: "r2",
        l2: "r3",
        l3: "r1",
      },
    },
    hint: "Leakage is about information crossing splits in unfair ways.",
    explainCorrect:
      "Representative → real populations; noise → wrong labels; leakage → unfair signal across splits.",
    explainIncorrect:
      "Re-read each definition — leakage is especially sneaky on exams.",
  },
  {
    id: "data-2",
    unitLabel: "Training data",
    conceptTitle: "Splits matter",
    conceptBody:
      "We hold out data to estimate generalization. If the holdout set isn’t independent, metrics lie.",
    questionPrompt: "True or false: Shuffling time-series patient visits into train/test without regard to time always preserves a realistic deployment estimate.",
    interaction: { type: "true-false", correct: false },
    hint: "Future leakage: tomorrow’s visit predicting yesterday’s outcome.",
    explainCorrect:
      "Right — temporal structure can leak unless you split by time carefully.",
    explainIncorrect:
      "Random splits on longitudinal data can leak the future into training.",
  },
  {
    id: "bias-1",
    unitLabel: "Bias in AI systems",
    conceptTitle: "Bias isn’t only “bad intent”",
    conceptBody:
      "Statistical bias can come from skewed data, proxy variables, feedback loops, or deployment contexts unlike training. Responsible AI tracks impact, not only accuracy.",
    questionPrompt: "Order these mitigation steps from earliest to latest in a typical workflow.",
    interaction: {
      type: "sort",
      items: [
        { id: "monitor", label: "Monitor disparate impact after launch" },
        { id: "audit", label: "Audit data sources for representation gaps" },
        { id: "spec", label: "Specify fairness constraints & harms to avoid" },
        { id: "mitigate", label: "Mitigate (reweight, augment, constrain)" },
      ],
      correctOrder: ["spec", "audit", "mitigate", "monitor"],
    },
    hint: "Know harms before you collect; monitor after you ship.",
    explainCorrect:
      "Specify → audit data → mitigate → monitor in production.",
    explainIncorrect:
      "Monitoring before you know harms or skipping audit usually fails.",
  },
  {
    id: "bias-2",
    unitLabel: "Bias in AI systems",
    conceptTitle: "Match harm patterns",
    conceptBody:
      "Different failures need different fixes: representation bias vs measurement bias vs deployment shift.",
    questionPrompt: "Match the scenario to the vocabulary.",
    interaction: {
      type: "match",
      left: [
        { id: "l1", label: "Underrepresentation" },
        { id: "l2", label: "Proxy discrimination" },
        { id: "l3", label: "Distribution shift" },
      ],
      right: [
        {
          id: "r1",
          label: "ZIP code stands in for protected attributes indirectly",
        },
        {
          id: "r2",
          label: "Training users differ from real-world users",
        },
        {
          id: "r3",
          label: "Certain groups rarely appear in training rows",
        },
      ],
      correct: {
        l1: "r3",
        l2: "r1",
        l3: "r2",
      },
    },
    hint: "Proxy means a correlate substitutes for something sensitive.",
    explainCorrect:
      "Underrepresentation → few rows; proxy → indirect correlate; shift → new population.",
    explainIncorrect:
      "Trace each scenario to who is missing vs what variable proxies for what.",
  },
];
