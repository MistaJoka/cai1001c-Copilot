type Size = "sm" | "md" | "lg";

const SIZE_MAP: Record<Size, { box: string; ring: string; text: string }> = {
  sm: { box: "h-12 w-12", ring: "inset-0", text: "text-[10px]" },
  md: { box: "h-16 w-16", ring: "inset-0", text: "text-xs" },
  lg: { box: "h-20 w-20", ring: "inset-0", text: "text-sm" },
};

type Props = {
  value: number;
  max?: number;
  label?: string;
  size?: Size;
};

export function ProgressRing({
  value,
  max = 100,
  label,
  size = "md",
}: Props) {
  const pct = Math.min(100, Math.max(0, (value / max) * 100));
  const deg = (pct / 100) * 360;
  const s = SIZE_MAP[size];

  return (
    <div
      className={`relative shrink-0 ${s.box}`}
      role="img"
      aria-label={label ?? `Progress ${Math.round(pct)} percent`}
    >
      <div
        className={`absolute ${s.ring} rounded-full`}
        style={{
          background: `conic-gradient(rgb(34 211 238 / 0.92) ${deg}deg, rgb(39 39 42 / 0.95) 0deg)`,
        }}
      />
      <div
        className={`absolute inset-[5px] flex items-center justify-center rounded-full bg-zinc-950 font-semibold tabular-nums text-cyan-300 ${s.text}`}
      >
        {Math.round(pct)}%
      </div>
    </div>
  );
}
