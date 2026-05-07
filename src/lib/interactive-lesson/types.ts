/**
 * JSON-driven lesson step union. Serialized lessons can live in CMS/DB later.
 *
 * TODO(Gemini): `POST /api/gemini/interactive-lesson` — generate whole-lesson JSON + zod validation;
 * per-step hints use `POST /api/gemini/lesson-hint` (see client `LessonHintPanel`).
 */
export type StepBase = {
  id: string;
  /** Block “Next” until learner satisfies validation inside the step UI */
  requireCorrect?: boolean;
  /** Short step label (micro-headline) */
  headline?: string;
  /**
   * One teaching beat before the interaction — pacing: explain one idea, then ask one thing.
   */
  teaching?: string;
  /**
   * Optional reinforcement after the widget (still on the same screen).
   */
  coachClose?: string;
};

export type TapRevealStep = StepBase & {
  type: "tap-reveal";
  prompt: string;
  reveal: string;
};

export type MultipleChoiceStep = StepBase & {
  type: "multiple-choice";
  question: string;
  options: { id: string; label: string }[];
  /** Single-select when length === 1 */
  correctOptionIds: string[];
};

export type DragSortStep = StepBase & {
  type: "drag-sort";
  instructions?: string;
  items: { id: string; label: string }[];
  correctOrder: string[];
};

export type MatchPairsStep = StepBase & {
  type: "match-pairs";
  instructions?: string;
  left: { id: string; label: string }[];
  right: { id: string; label: string }[];
  pairs: { leftId: string; rightId: string }[];
};

export type SliderSimStep = StepBase & {
  type: "slider-sim";
  question: string;
  min: number;
  max: number;
  step?: number;
  defaultValue?: number;
  /** When learner value is within ±tolerance of target, mark correct */
  targetValue: number;
  tolerance?: number;
  unit?: string;
  hint?: string;
};

export type PredictRevealStep = StepBase & {
  type: "predict-reveal";
  question: string;
  placeholder?: string;
  revealTitle?: string;
  reveal: string;
};

export type AnimatedDiagramStep = StepBase & {
  type: "animated-diagram";
  title?: string;
  nodes: { id: string; label: string }[];
  caption?: string;
};

export type MiniSimulationStep = StepBase & {
  type: "mini-simulation";
  title: string;
  description?: string;
  /** Simple “sandbox”: discrete choices change a visual state */
  choices: { id: string; label: string }[];
  /** First matching choice id is highlighted as illustrative outcome */
  recommendedChoiceId?: string;
};

export type ReflectionCheckStep = StepBase & {
  type: "reflection-check";
  prompt: string;
  minChars?: number;
  coachNote?: string;
};

export type LessonStep =
  | TapRevealStep
  | MultipleChoiceStep
  | DragSortStep
  | MatchPairsStep
  | SliderSimStep
  | PredictRevealStep
  | AnimatedDiagramStep
  | MiniSimulationStep
  | ReflectionCheckStep;

export type InteractiveLessonDocument = {
  id: string;
  title: string;
  subtitle?: string;
  steps: LessonStep[];
};

export type StepResultPayload = {
  stepId: string;
  /** undefined = exploratory step with no correctness signal */
  correct?: boolean;
};
