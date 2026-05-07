type Props = {
  title: string;
  description?: string;
  /** Short label above title (course, section, context). */
  eyebrow?: string;
  /** Scannable bullets — what this page helps you do or see. */
  summaryPoints?: string[];
};

export function PageHeader({
  title,
  description,
  eyebrow,
  summaryPoints,
}: Props) {
  return (
    <header className="mb-10 border-b border-zinc-800/80 pb-8">
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/90">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="prose-reading mt-4 text-zinc-300">
          {description}
        </p>
      ) : null}
      {summaryPoints?.length ? (
        <ul
          className="mt-5 grid gap-2 sm:grid-cols-2"
          aria-label="Page summary"
        >
          {summaryPoints.map((line) => (
            <li
              key={line}
              className="flex gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3 text-sm leading-snug text-zinc-200"
            >
              <span
                className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400/80"
                aria-hidden
              />
              <span>{line}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </header>
  );
}
