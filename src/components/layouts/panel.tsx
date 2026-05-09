import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  title?: string;
  /** Extra classes for the outer card */
  className?: string;
  /** Padding density */
  density?: "comfortable" | "compact";
  footer?: ReactNode;
};

export function Panel({
  children,
  title,
  className = "",
  density = "comfortable",
  footer,
}: Props) {
  const pad = density === "compact" ? "p-4 sm:p-5" : "p-5 sm:p-6";

  return (
    <section
      className={`rounded-2xl border border-zinc-800/90 bg-zinc-900/35 shadow-[0_0_0_1px_rgba(24,24,27,0.35)] backdrop-blur-sm transition-colors duration-200 ${className}`}
    >
      {title ? (
        <header className={`border-b border-zinc-800/70 ${pad} pb-4`}>
          <h2 className="text-sm font-semibold tracking-tight text-zinc-100">
            {title}
          </h2>
        </header>
      ) : null}
      <div className={title ? `${pad} pt-5` : pad}>{children}</div>
      {footer ? (
        <footer className="border-t border-zinc-800/70 px-5 py-4 sm:px-6">
          {footer}
        </footer>
      ) : null}
    </section>
  );
}
