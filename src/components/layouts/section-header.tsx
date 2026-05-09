import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  actions?: ReactNode;
  className?: string;
};

export function SectionHeader({
  title,
  description,
  eyebrow,
  actions,
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div className="min-w-0 flex-1">
        {eyebrow ? (
          <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/85">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={`font-semibold tracking-tight text-zinc-50 ${eyebrow ? "mt-2" : ""} text-lg sm:text-xl`}
        >
          {title}
        </h2>
        {description ? (
          <p className="prose-reading mt-3 max-w-3xl text-sm leading-relaxed text-zinc-400">
            {description}
          </p>
        ) : null}
      </div>
      {actions ? (
        <div className="flex shrink-0 flex-wrap items-center gap-2">{actions}</div>
      ) : null}
    </div>
  );
}
