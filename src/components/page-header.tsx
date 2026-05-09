type Props = {
  title: string;
  description?: string;
  eyebrow?: string;
  summaryPoints?: string[];
};

export function PageHeader({
  title,
  description,
  eyebrow,
  summaryPoints,
}: Props) {
  return (
    <header className="mb-10 border-b border-zinc-800/80 pb-8 sm:mb-12 sm:pb-10">
      {eyebrow ? (
        <p className="text-xs font-medium uppercase tracking-[0.18em] text-cyan-400/90">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="mt-2 max-w-4xl text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
        {title}
      </h1>
      {description ? (
        <p className="prose-reading mt-4 max-w-3xl text-zinc-300">
          {description}
        </p>
      ) : null}
      {summaryPoints?.length ? (
        <ul
          className="mt-6 grid gap-3 sm:grid-cols-2"
          aria-label="Page summary"
        >
          {summaryPoints.map((line) => (
            <li
              key={line}
              className="flex gap-3 rounded-xl border border-zinc-800/80 bg-zinc-900/30 px-4 py-3.5 text-sm leading-snug text-zinc-200"
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
