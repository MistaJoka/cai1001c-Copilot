"use client";

type Side = { id: string; label: string };

type Props = {
  left: Side[];
  right: Side[];
  /** leftId → selected rightId (empty string if none) */
  value: Record<string, string>;
  onChange: (next: Record<string, string>) => void;
  disabled?: boolean;
  showResults?: boolean;
  correct?: Record<string, string>;
};

export function MatchActivity({
  left,
  right,
  value,
  onChange,
  disabled,
  showResults,
  correct,
}: Props) {
  const setPair = (leftId: string, rightId: string) => {
    onChange({ ...value, [leftId]: rightId });
  };

  return (
    <div className="space-y-4" role="group" aria-label="Match concepts to definitions">
      {left.map((l, i) => {
        const sel = value[l.id] ?? "";
        const ok = showResults && correct && sel === correct[l.id];
        const bad = showResults && correct && sel && sel !== correct[l.id];
        return (
          <div
            key={l.id}
            className={`rounded-xl border p-4 ${
              ok
                ? "border-emerald-500/45 bg-emerald-500/10"
                : bad
                  ? "border-rose-500/45 bg-rose-500/10"
                  : "border-zinc-800/90 bg-zinc-950/40"
            }`}
          >
            <label className="block text-sm font-medium text-zinc-200">
              <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded bg-zinc-900 text-xs font-semibold text-zinc-500">
                {i + 1}
              </span>
              {l.label}
              <select
                disabled={disabled}
                value={sel}
                onChange={(e) => setPair(l.id, e.target.value)}
                className="mt-3 block w-full rounded-xl border border-zinc-700 bg-zinc-950 px-3 py-2 text-sm text-zinc-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70"
                aria-label={`Match for: ${l.label}`}
              >
                <option value="">Select a definition…</option>
                {right.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>
          </div>
        );
      })}
    </div>
  );
}
