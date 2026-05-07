"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  type DragEndEvent,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { DragSortStep } from "@/lib/interactive-lesson/types";
import { MasteryFeedback } from "@/components/interactive-lesson/mastery-feedback";

type Props = {
  step: DragSortStep;
  onGateChange?: (allowed: boolean) => void;
  onResult?: (correct: boolean) => void;
};

function shuffle<T>(items: T[]): T[] {
  const a = [...items];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function SortableRow({
  id,
  label,
  disabled,
}: {
  id: string;
  label: string;
  disabled: boolean;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    touchAction: "none" as const,
    opacity: isDragging ? 0.92 : 1,
    zIndex: isDragging ? 2 : undefined,
    boxShadow: isDragging ? "0 8px 24px rgba(0,0,0,0.35)" : undefined,
  };

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      layout={false}
      className={`flex items-center gap-3 rounded-xl border bg-zinc-950 px-3 py-3 text-sm transition-colors md:touch-auto ${
        disabled
          ? "cursor-default border-zinc-800 text-zinc-500"
          : "cursor-grab active:cursor-grabbing border-zinc-700 text-zinc-200 hover:border-cyan-500/40"
      } ${isDragging ? "border-cyan-500/50" : ""}`}
      {...attributes}
      {...listeners}
    >
      <span className="select-none text-zinc-500" aria-hidden>
        ⋮⋮
      </span>
      <span>{label}</span>
    </motion.div>
  );
}

/**
 * TODO: Gemini — optional reorder hints (“try moving … above …”) keyed by learner mistakes,
 * respecting server-only API and topic context passed from the caller.
 */
export function DragSort({ step, onGateChange, onResult }: Props) {
  const itemMap = useMemo(
    () => new Map(step.items.map((i) => [i.id, i.label])),
    [step.items],
  );

  /** Deterministic SSR/CSR first paint — shuffle runs after mount in `useEffect` (avoids hydration mismatch). */
  const [orderedIds, setOrderedIds] = useState<string[]>(() =>
    step.items.map((i) => i.id),
  );
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    setOrderedIds(shuffle(step.items.map((i) => i.id)));
    setChecked(false);
    onGateChange?.(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when step identity changes only
  }, [step.id]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  const correct =
    orderedIds.length === step.correctOrder.length &&
    orderedIds.every((id, i) => id === step.correctOrder[i]);

  const feedback =
    checked && step.requireCorrect
      ? correct
        ? ("correct" as const)
        : ("incorrect" as const)
      : checked && !step.requireCorrect
        ? ("correct" as const)
        : null;

  const onDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;
    if (!over || active.id === over.id) return;
    setOrderedIds((prev) => {
      const ai = prev.indexOf(String(active.id));
      const oi = prev.indexOf(String(over.id));
      if (ai < 0 || oi < 0) return prev;
      return arrayMove(prev, ai, oi);
    });
    setChecked(false);
    if (step.requireCorrect) onGateChange?.(false);
  };

  const verify = () => {
    setChecked(true);
    const isOk =
      orderedIds.length === step.correctOrder.length &&
      orderedIds.every((id, i) => id === step.correctOrder[i]);
    onResult?.(isOk);
    if (!step.requireCorrect) {
      onGateChange?.(true);
      return;
    }
    if (isOk) onGateChange?.(true);
    else onGateChange?.(false);
  };

  const lockedAfterSuccess = !!(checked && correct && step.requireCorrect);

  return (
    <div className="rounded-2xl border border-zinc-800 bg-zinc-900/50 p-4 sm:p-5">
      {step.instructions ? (
        <p className="text-sm text-zinc-300">{step.instructions}</p>
      ) : null}
      {/* TODO(Gemini): dynamic instructions from lesson context */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={onDragEnd}
      >
        <SortableContext
          disabled={lockedAfterSuccess}
          items={orderedIds}
          strategy={verticalListSortingStrategy}
        >
          <ul className="mt-4 flex flex-col gap-2" role="list">
            {orderedIds.map((id) => (
              <li key={id} role="listitem">
                <SortableRow
                  id={id}
                  label={itemMap.get(id) ?? id}
                  disabled={lockedAfterSuccess}
                />
              </li>
            ))}
          </ul>
        </SortableContext>
      </DndContext>

      {!lockedAfterSuccess ? (
        <motion.button
          type="button"
          onClick={verify}
          className="mt-4 w-full rounded-xl bg-cyan-600 py-3 text-sm font-medium text-white hover:bg-cyan-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-300"
          whileTap={{ scale: 0.99 }}
        >
          Check order
        </motion.button>
      ) : null}
      <MasteryFeedback state={step.requireCorrect ? feedback : checked ? feedback : null} />
    </div>
  );
}
