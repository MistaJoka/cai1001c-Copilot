"use client";

type Option = { id: string; label: string };

type Props = {
  name: string;
  options: Option[];
  value: string | null;
  onChange: (id: string) => void;
  disabled?: boolean;
  /** After submit: highlight correct/incorrect without exposing answer before submit */
  showResults?: boolean;
  correctId?: string;
};

export function MultipleChoiceCheckpoint({
  name,
  options,
  value,
  onChange,
  disabled,
  showResults,
  correctId,
}: Props) {
  const groupId = `${name}-mc`;

  return (
    <fieldset className="space-y-3" disabled={disabled}>
      <legend className="sr-only">Choose one answer</legend>
      {options.map((opt, i) => {
        const selected = value === opt.id;
        const isCorrect = showResults && correctId === opt.id;
        const isWrongPick = showResults && selected && correctId !== opt.id;
        return (
          <label
            key={opt.id}
            className={`flex cursor-pointer gap-3 rounded-xl border px-4 py-3 transition-colors has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-cyan-400/60 has-[:focus-visible]:ring-offset-2 has-[:focus-visible]:ring-offset-zinc-950 ${
              isCorrect
                ? "border-emerald-500/50 bg-emerald-500/10"
                : isWrongPick
                  ? "border-rose-500/50 bg-rose-500/10"
                  : selected
                    ? "border-cyan-500/40 bg-cyan-500/5"
                    : "border-zinc-800/90 bg-zinc-950/40 hover:border-zinc-700"
            } ${disabled ? "cursor-not-allowed opacity-70" : ""}`}
          >
            <input
              type="radio"
              name={groupId}
              value={opt.id}
              checked={selected}
              onChange={() => onChange(opt.id)}
              className="mt-1 h-4 w-4 shrink-0 border-zinc-600 text-cyan-500 focus:ring-cyan-500/40"
              aria-describedby={`${groupId}-opt-${i}-desc`}
            />
            <span className="min-w-0 flex-1">
              <span className="flex items-start gap-2">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border border-zinc-600 text-[10px] font-semibold uppercase text-zinc-400">
                  {String.fromCharCode(65 + i)}
                </span>
                <span className="text-sm leading-relaxed text-zinc-200">
                  {opt.label}
                </span>
              </span>
              {showResults ? (
                <span id={`${groupId}-opt-${i}-desc`} className="sr-only">
                  {isCorrect
                    ? "Correct answer."
                    : isWrongPick
                      ? "Your selection — incorrect."
                      : ""}
                </span>
              ) : (
                <span id={`${groupId}-opt-${i}-desc`} className="sr-only">
                  Option {String.fromCharCode(65 + i)}
                </span>
              )}
            </span>
          </label>
        );
      })}
    </fieldset>
  );
}
