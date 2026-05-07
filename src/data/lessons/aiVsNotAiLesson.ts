import type { InteractiveLessonDocument } from "@/lib/interactive-lesson/types";

/**
 * Themed lesson: one focal interaction per step (CAI1001C-style framing).
 * Lab demo — not third-party curriculum IP.
 */
export const aiVsNotAiLesson: InteractiveLessonDocument = {
  id: "cai-ai-vs-not-ai-v1",
  title: "What counts as AI (and what does not)?",
  subtitle:
    "Twelve short beats — tap, sort, match, and reflect — to separate automation from machine learning.",
  steps: [
    {
      id: "s1-vocab",
      type: "tap-reveal",
      headline: "Warm-up",
      teaching:
        "People say “AI” to mean anything from spell-check to sci-fi robots. In this course, we split **automation** from **systems that learn from data**.",
      prompt: "Tap when you are ready: what is the narrow, practical definition we will use for “machine learning”?",
      reveal:
        "Machine learning: a system whose behavior improves with experience **(data)** rather than only hand-written rules. Not every program that feels “smart” qualifies.",
      coachClose: "If it never updates from new examples, be skeptical calling it ML.",
    },
    {
      id: "s2-classify",
      type: "multiple-choice",
      headline: "Spot the pattern",
      teaching: "Choose the option that most clearly involves learning from examples, not just fixed logic.",
      question: "Which is the strongest example of **machine learning** as defined above?",
      options: [
        { id: "a", label: "A hand-tuned if/else spam filter written last year — unchanged since" },
        { id: "b", label: "A spam filter that retrains on reported mail and measurably improves" },
        { id: "c", label: "A flowchart that prints the same answer every time" },
      ],
      correctOptionIds: ["b"],
      requireCorrect: true,
      coachClose: "Adaptation from data is the signal — not clever UI or buzzwords.",
    },
    {
      id: "s3-rules",
      type: "multiple-choice",
      headline: "Rules vs learning",
      teaching: "Expert systems encode human knowledge explicitly. Classifiers often infer patterns.",
      question: "Which statement fits a **pure rule-based** system (no learning loop)?",
      options: [
        { id: "a", label: "Weights update when new labeled photos arrive" },
        { id: "b", label: "“If income < threshold, flag review” — fixed policy in code" },
        { id: "c", label: "Accuracy improves on a holdout set after more training rounds" },
      ],
      correctOptionIds: ["b"],
      requireCorrect: true,
    },
    {
      id: "s4-order",
      type: "drag-sort",
      headline: "Lifecycle",
      teaching: "Applied ML projects follow a repeatable chain. Mis-ordering often hides risks (e.g. deploying before evaluation).",
      instructions: "Order from **first** to **last** in a typical supervised project.",
      items: [
        { id: "deploy", label: "Deploy or integrate for use" },
        { id: "collect", label: "Collect and scope examples" },
        { id: "label", label: "Label or define targets" },
        { id: "train", label: "Train a model" },
        { id: "eval", label: "Evaluate on held-out data" },
      ],
      correctOrder: ["collect", "label", "train", "eval", "deploy"],
      requireCorrect: true,
      coachClose: "Evaluation before deployment is non-negotiable for trustworthy claims.",
    },
    {
      id: "s5-match",
      type: "match-pairs",
      headline: "Vocabulary",
      teaching: "Match each term to the idea it names — precision helps when you read APIs and papers.",
      instructions: "Drag each concept onto the description that fits best.",
      left: [
        { id: "sup", label: "Supervised learning" },
        { id: "inf", label: "Inference" },
        { id: "over", label: "Overfitting" },
      ],
      right: [
        { id: "r1", label: "Training with input–output pairs (labels)" },
        { id: "r2", label: "Running a trained model on new inputs" },
        { id: "r3", label: "Memorizing noise; weak on unseen data" },
      ],
      pairs: [
        { leftId: "sup", rightId: "r1" },
        { leftId: "inf", rightId: "r2" },
        { leftId: "over", rightId: "r3" },
      ],
      requireCorrect: true,
    },
    {
      id: "s6-slider",
      type: "slider-sim",
      headline: "Calibrate intuition",
      teaching: "Not every adaptive system is deep learning — but many learn from interaction feedback.",
      question:
        "A product recommendation widget that shifts after clicks — how strongly is this “machine learning” on a **0–10** scale?",
      min: 0,
      max: 10,
      step: 1,
      defaultValue: 5,
      targetValue: 8,
      tolerance: 1,
      unit: "/10",
      hint: "Think: does behavior change from **data about users**, not only fixed merchandising rules?",
      requireCorrect: true,
      coachClose: "High scores are reasonable when behavior genuinely tracks new feedback.",
    },
    {
      id: "s7-predict",
      type: "predict-reveal",
      headline: "Prediction check",
      teaching: "Thermostats predate modern ML. Ask what changes if the device learns room dynamics from sensors.",
      question: "Before revealing: is a basic mechanical thermostat “AI” in the ML sense?",
      placeholder: "One or two sentences…",
      revealTitle: "Answer",
      reveal:
        "Classic thermostats use physics and fixed set-points — **not** ML. A smart thermostat that **learns schedules from occupancy** starts to look like learning from data.",
    },
    {
      id: "s8-diagram",
      type: "animated-diagram",
      headline: "Mental model",
      teaching: "Keep this loop in mind when you read APIs: data informs parameters; parameters drive predictions.",
      title: "Supervised learning snapshot",
      nodes: [
        { id: "n1", label: "Examples + labels" },
        { id: "n2", label: "Train / fit" },
        { id: "n3", label: "Predict on new inputs" },
      ],
      caption: "Inference is cheap compared to training — but both matter for ethics and cost.",
    },
    {
      id: "s9-fork",
      type: "mini-simulation",
      headline: "Choose a lens",
      teaching: "Same business problem — different tooling. Pick the stance a team might defend.",
      title: "Spam defense strategy",
      description: "Your team fights phishing mail. Which option leans most on **learned** patterns?",
      choices: [
        { id: "rules", label: "Static keyword blocklist only" },
        { id: "ml", label: "Classifier updated weekly on reported phishing" },
        { id: "human", label: "Manual triage only" },
      ],
      recommendedChoiceId: "ml",
      requireCorrect: true,
    },
    {
      id: "s10-myth",
      type: "tap-reveal",
      headline: "Myth bust",
      teaching: "“AI” in marketing often means statistics + software — not general intelligence.",
      prompt: "Tap to reveal a concise distinction between **narrow AI** and **general intelligence**.",
      reveal:
        "Narrow AI: excels at one task (translation, chess) with limited scope. General AI (still largely research): broad, human-like transfer across tasks — not assumed in CAI1001C projects.",
      coachClose: "Scope claims: what task, what data, what failure mode?",
    },
    {
      id: "s11-check",
      type: "multiple-choice",
      headline: "Check yourself",
      teaching: "Course projects stay in the **narrow** regime — clear metrics and guardrails.",
      question: "Which is the most responsible framing for a course prototype?",
      options: [
        { id: "a", label: "“Solves intelligence broadly with no oversight.”" },
        { id: "b", label: "“Automates one workflow; we document limits and test cases.”" },
        { id: "c", label: "“Replaces instructors entirely without evaluation.”" },
      ],
      correctOptionIds: ["b"],
      requireCorrect: true,
    },
    {
      id: "s12-reflect",
      type: "reflection-check",
      headline: "Takeaway",
      teaching: "Reflective prompts cement transfer — tie jargon to a decision you will actually make.",
      prompt: "Name **one** system you use this week. Is it ML by our definition? Why or why not? (≥25 characters.)",
      minChars: 25,
      coachNote:
        "Concrete examples beat definitions — reuse this habit in project docs and stakeholder updates.",
    },
  ],
};
