type Props = {
  value: number;
  max?: number;
  label?: string;
};

export function ProgressRing({ value, max = 100, label }: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const deg = (pct / 100) * 360;

  return (
    <div
      className="relative h-16 w-16 shrink-0"
      role="img"
      aria-label={label || `Progress ${Math.round(pct)} percent`}
    >
      <div
        className="absolute inset-0 rounded-full"
        style={{
          background: `conic-gradient(rgb(6 182 212) ${deg}deg, rgb(39 39 42) 0deg)`,
        }}
      />
      <div className="absolute inset-1 flex items-center justify-center rounded-full bg-zinc-950 text-xs font-semibold text-cyan-300">
        {Math.round(pct)}%
      </div>
    </div>
  );
}
