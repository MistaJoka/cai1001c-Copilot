"use client";

type Item = { id: string; label: string };

type Props = {
  items: Item[];
  /** Current order top → bottom (array of ids) */
  order: string[];
  onReorder: (next: string[]) => void;
  disabled?: boolean;
  showResults?: boolean;
  correctOrder?: string[];
};

export function SortActivity({
  items,
  order,
  onReorder,
  disabled,
  showResults,
  correctOrder,
}: Props) {
  const labelById = Object.fromEntries(items.map((i) => [i.id, i.label]));

  const move = (index: number, dir: -1 | 1) => {
    const j = index + dir;
    if (j < 0 || j >= order.length) return;
    const next = [...order];
    const tmp = next[index];
    next[index] = next[j];
    next[j] = tmp;
    onReorder(next);
  };

  const slotCorrect = (id: string, index: number) => {
    if (!showResults || !correctOrder) return false;
    return correctOrder[index] === id;
  };

  const slotWrong = (id: string, index: number) => {
    if (!showResults || !correctOrder) return false;
    return correctOrder[index] !== id;
  };

  return (
    <ol className="space-y-2" aria-label="Reorder steps">
      {order.map((id, index) => (
        <li
          key={id}
          className={`flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2 sm:flex-nowrap ${
            slotCorrect(id, index)
              ? "border-emerald-500/45 bg-emerald-500/10"
              : slotWrong(id, index)
                ? "border-rose-500/45 bg-rose-500/10"
                : "border-zinc-800/90 bg-zinc-950/45"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-zinc-900 text-xs font-semibold text-zinc-400">
            {index + 1}
          </span>
          <p className="min-w-0 flex-1 text-sm leading-snug text-zinc-200">
            {labelById[id]}
          </p>
          <div className="flex shrink-0 gap-1">
            <button
              type="button"
              disabled={disabled || index === 0}
              onClick={() => move(index, -1)}
              aria-label={`Move “${labelById[id]}” up one position`}
              className="rounded-lg border border-zinc-700 px-2 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
            >
              Up
            </button>
            <button
              type="button"
              disabled={disabled || index === order.length - 1}
              onClick={() => move(index, 1)}
              aria-label={`Move “${labelById[id]}” down one position`}
              className="rounded-lg border border-zinc-700 px-2 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800 disabled:opacity-40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
            >
              Down
            </button>
          </div>
        </li>
      ))}
    </ol>
  );
}
