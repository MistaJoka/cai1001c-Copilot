import type { TeachBackResponse } from "@/lib/schemas/teachBack";

type Props = { data: TeachBackResponse };

export function TeachBackPanel({ data }: Props) {
  return (
    <div className="space-y-4 rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 text-sm shadow-sm">
      <p className="text-lg font-semibold text-cyan-300">
        Teach-back score: {data.score}/10
      </p>
      <div className="rounded-xl border border-zinc-800 bg-zinc-950/40 p-3">
        <h3 className="text-xs font-semibold uppercase text-zinc-500">
          Strengths
        </h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-zinc-300">
          {data.strengths.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
      <div className="rounded-xl border border-rose-500/20 bg-rose-950/10 p-3">
        <h3 className="text-xs font-semibold uppercase text-zinc-500">Gaps</h3>
        <ul className="mt-2 list-disc space-y-1 pl-4 text-zinc-300">
          {data.gaps.map((s, i) => (
            <li key={i}>{s}</li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-semibold uppercase text-zinc-500">
          Improved answer sketch
        </h3>
        <p className="mt-1 text-zinc-300">{data.improvedAnswer}</p>
      </div>
      <div className="rounded-xl border border-cyan-500/20 bg-cyan-950/20 p-3">
        <h3 className="text-xs font-semibold uppercase text-cyan-500/80">
          Next attempt
        </h3>
        <p className="mt-1 text-cyan-100/90">{data.nextAttemptPrompt}</p>
      </div>
    </div>
  );
}
