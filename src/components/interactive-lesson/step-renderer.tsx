"use client";

import type { LessonStep } from "@/lib/interactive-lesson/types";
import { AnimatedDiagram } from "@/components/interactive-lesson/animated-diagram";
import { DragSort } from "@/components/interactive-lesson/drag-sort";
import { MatchPairs } from "@/components/interactive-lesson/match-pairs";
import { MiniSimulation } from "@/components/interactive-lesson/mini-simulation";
import { MultipleChoiceCard } from "@/components/interactive-lesson/multiple-choice-card";
import { PredictReveal } from "@/components/interactive-lesson/predict-reveal";
import { ReflectionCheck } from "@/components/interactive-lesson/reflection-check";
import { SliderSimulation } from "@/components/interactive-lesson/slider-simulation";
import { TapRevealCard } from "@/components/interactive-lesson/tap-reveal-card";

type Props = {
  step: LessonStep;
  /** When true the learner may advance to the next step. */
  onGateChange: (allowed: boolean) => void;
  /** Structured outcome for quizzes / analytics (optional correctness). */
  onOutcome?: (stepId: string, correct?: boolean) => void;
};

export function StepRenderer({ step, onGateChange, onOutcome }: Props) {
  switch (step.type) {
    case "tap-reveal":
      return <TapRevealCard step={step} onGateChange={onGateChange} />;
    case "multiple-choice":
      return (
        <MultipleChoiceCard
          step={step}
          onGateChange={onGateChange}
          onResult={(ok) => onOutcome?.(step.id, ok)}
        />
      );
    case "drag-sort":
      return (
        <DragSort
          step={step}
          onGateChange={onGateChange}
          onResult={(ok) => onOutcome?.(step.id, ok)}
        />
      );
    case "match-pairs":
      return (
        <MatchPairs
          step={step}
          onGateChange={onGateChange}
          onResult={(ok) => onOutcome?.(step.id, ok)}
        />
      );
    case "slider-sim":
      return (
        <SliderSimulation
          step={step}
          onGateChange={onGateChange}
          onResult={(ok) => onOutcome?.(step.id, ok)}
        />
      );
    case "predict-reveal":
      return <PredictReveal step={step} onGateChange={onGateChange} />;
    case "animated-diagram":
      return <AnimatedDiagram step={step} onGateChange={onGateChange} />;
    case "mini-simulation":
      return (
        <MiniSimulation
          step={step}
          onGateChange={onGateChange}
          onResult={(ok) => onOutcome?.(step.id, ok)}
        />
      );
    case "reflection-check":
      return <ReflectionCheck step={step} onGateChange={onGateChange} />;
    default:
      return (
        <p className="text-sm text-rose-300" role="alert">
          Unsupported step type.
        </p>
      );
  }
}
