import type { ConfidenceLevel } from "@/types";

type Props = {
  level?: ConfidenceLevel | null;
  className?: string;
};

export function ConfidenceBadge({ level, className = "" }: Props) {
  const label = !level ? "Not started" : level === "low" ? "Low" : level === "medium" ? "Medium" : "High";
  const styles =
    !level
      ? "border-zinc-600 text-zinc-400"
      : level === "low"
        ? "border-rose-500/40 text-rose-300"
        : level === "medium"
          ? "border-amber-500/40 text-amber-200"
          : "border-emerald-500/40 text-emerald-300";

  return (
    <span
      className={`inline-flex rounded-full border px-2.5 py-1 text-xs font-medium ${styles} ${className}`}
    >
      {label}
    </span>
  );
}
