import type { InteractiveLessonDocument } from "@/lib/interactive-lesson/types";

/** Demo lesson: CAI-flavored placeholders, no third-party curriculum text */
export const sampleInteractiveLesson: InteractiveLessonDocument = {
  id: "demo-interactive-intro",
  title: "Interactive step demo",
  subtitle: "All step types in one linear path (sample data)",
  steps: [
    {
      id: "s-tap",
      type: "tap-reveal",
      headline: "Tap to reveal",
      prompt: "What is spaced repetition?",
      reveal:
        "A study schedule that reviews material at increasing intervals so memory stays durable without cramming.",
    },
    {
      id: "s-mc",
      type: "multiple-choice",
      headline: "Check understanding",
      question: "Which best describes active recall?",
      options: [
        { id: "a", label: "Re-reading highlights passively" },
        { id: "b", label: "Retrieving answers from memory with prompts" },
        { id: "c", label: "Copying notes verbatim" },
      ],
      correctOptionIds: ["b"],
      requireCorrect: true,
    },
    {
      id: "s-sort",
      type: "drag-sort",
      headline: "Order the flow",
      instructions: "Study cycle — strongest order first.",
      items: [
        { id: "preview", label: "Preview goals" },
        { id: "practice", label: "Practice retrieval" },
        { id: "review", label: "Review mistakes" },
      ],
      correctOrder: ["preview", "practice", "review"],
      requireCorrect: true,
    },
    {
      id: "s-match",
      type: "match-pairs",
      headline: "Match concepts",
      left: [
        { id: "l1", label: "Chunking" },
        { id: "l2", label: "Interleaving" },
      ],
      right: [
        { id: "r1", label: "Group items into meaningful units" },
        { id: "r2", label: "Mix practice types across a session" },
      ],
      pairs: [
        { leftId: "l1", rightId: "r1" },
        { leftId: "l2", rightId: "r2" },
      ],
      requireCorrect: true,
    },
    {
      id: "s-slide",
      type: "slider-sim",
      headline: "Set the value",
      question: "Set review interval to roughly one week (target: 7 days).",
      min: 0,
      max: 14,
      step: 1,
      defaultValue: 3,
      targetValue: 7,
      tolerance: 0,
      unit: "days",
      requireCorrect: true,
    },
    {
      id: "s-predict",
      type: "predict-reveal",
      headline: "Predict, then reveal",
      question: "Before peeking: when should you retry a missed card?",
      placeholder: "Type a one-line prediction…",
      revealTitle: "A simple rule",
      reveal:
        "Retry soon after feedback, then space out successes — errors deserve quicker follow-ups.",
    },
    {
      id: "s-diagram",
      type: "animated-diagram",
      headline: "Visual map",
      title: "Signals in a tight loop",
      nodes: [
        { id: "n1", label: "Attempt" },
        { id: "n2", label: "Feedback" },
        { id: "n3", label: "Adjust" },
      ],
      caption: "Short loops beat long lectures for skill transfer.",
    },
    {
      id: "s-mini",
      type: "mini-simulation",
      headline: "Try a fork",
      title: "Quiz strategy",
      description: "Tap a tactic — see a compact outcome cue.",
      choices: [
        { id: "c1", label: "Blind guesses" },
        { id: "c2", label: "Explain why wrong answers fail" },
        { id: "c3", label: "Memorize answer letters only" },
      ],
      recommendedChoiceId: "c2",
    },
    {
      id: "s-reflect",
      type: "reflection-check",
      headline: "Reflection",
      prompt: "What one habit will you apply this week? (≥10 chars)",
      minChars: 10,
      coachNote: "Tiny habits beat giant promises.",
    },
  ],
};
