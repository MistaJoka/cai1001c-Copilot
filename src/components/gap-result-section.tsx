export const GAP_STUDENT_PROMPT = `Explain what you know about this topic.
Give:
1. Definition
2. Example
3. Why it matters
4. Common mistake`;

type Tone = "rose" | "amber";

const BORDER_BY_TONE: Record<Tone | "default", string> = {
  rose: "border-rose-500/25",
  amber: "border-amber-500/25",
  default: "border-zinc-800",
};

type Props = {
  title: string;
  items: string[];
  tone?: Tone;
};

export function GapResultSection({ title, items, tone }: Props) {
  const border = BORDER_BY_TONE[tone ?? "default"];
  return (
    <div className={`rounded-xl border ${border} bg-zinc-950/50 p-3`}>
      <p className="text-xs font-semibold uppercase tracking-wide text-zinc-500">
        {title}
      </p>
      <ul className="mt-2 list-disc space-y-1 pl-4 text-sm text-zinc-300">
        {items.map((x, i) => (
          <li key={`${title}-${i}`}>{x}</li>
        ))}
      </ul>
    </div>
  );
}
