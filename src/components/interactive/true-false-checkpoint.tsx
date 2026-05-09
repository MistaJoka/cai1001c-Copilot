"use client";

type Props = {
  value: boolean | null;
  onChange: (v: boolean) => void;
  disabled?: boolean;
  showResults?: boolean;
  correct?: boolean;
};

export function TrueFalseCheckpoint({
  value,
  onChange,
  disabled,
  showResults,
  correct,
}: Props) {
  const btn = (v: boolean, label: string) => {
    const selected = value === v;
    const isCorrect = showResults && correct === v;
    const isWrongPick = showResults && selected && correct !== v;
    return (
      <button
        type="button"
        disabled={disabled}
        onClick={() => onChange(v)}
        aria-pressed={selected}
        className={`flex-1 rounded-xl border px-4 py-3 text-sm font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
          isCorrect
            ? "border-emerald-500/55 bg-emerald-500/15 text-emerald-100"
            : isWrongPick
              ? "border-rose-500/55 bg-rose-500/15 text-rose-100"
              : selected
                ? "border-cyan-500/45 bg-cyan-500/10 text-cyan-100"
                : "border-zinc-800/90 bg-zinc-950/50 text-zinc-300 hover:border-zinc-600"
        }`}
      >
        <span className="flex flex-col items-center gap-1">
          <span>{label}</span>
          {showResults && isCorrect ? (
            <span className="text-[11px] font-normal text-emerald-200/90">
              Correct
            </span>
          ) : null}
          {showResults && isWrongPick ? (
            <span className="text-[11px] font-normal text-rose-200/90">
              Not this one
            </span>
          ) : null}
        </span>
      </button>
    );
  };

  return (
    <div
      className="flex gap-3"
      role="group"
      aria-label="True or false response"
    >
      {btn(true, "True")}
      {btn(false, "False")}
    </div>
  );
}
