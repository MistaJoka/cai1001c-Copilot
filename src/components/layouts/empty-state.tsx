import type { ReactNode } from "react";

type Props = {
  title: string;
  description?: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
};

export function EmptyState({
  title,
  description,
  icon,
  action,
  className = "",
}: Props) {
  return (
    <div
      className={`flex flex-col items-center justify-center rounded-2xl border border-dashed border-zinc-700/90 bg-zinc-950/40 px-6 py-16 text-center sm:px-10 ${className}`}
    >
      {icon ? (
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900/50 text-cyan-400/90">
          {icon}
        </div>
      ) : null}
      <p className="text-base font-medium text-zinc-200">{title}</p>
      {description ? (
        <p className="prose-reading mt-2 max-w-md text-sm text-zinc-500">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
