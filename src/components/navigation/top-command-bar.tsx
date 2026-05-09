import Link from "next/link";

export function TopCommandBar() {
  return (
    <header className="sticky top-0 z-30 border-b border-zinc-800/80 bg-zinc-950/80 backdrop-blur-md">
      <div className="mx-auto flex w-full min-w-0 max-w-7xl items-center gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="shrink-0 text-sm font-semibold tracking-tight text-cyan-400 md:hidden"
        >
          GapCloser
        </Link>
        <div className="relative min-w-0 flex-1">
          <label className="block" htmlFor="global-search-placeholder">
            <span className="sr-only">Search lessons, notes, quizzes</span>
            <span className="pointer-events-none absolute left-3 top-1/2 z-[1] -translate-y-1/2 text-zinc-600">
              <SearchGlyph className="h-4 w-4" />
            </span>
            <input
              id="global-search-placeholder"
              type="search"
              readOnly
              autoComplete="off"
              placeholder="Search lessons, notes, quizzes…"
              aria-describedby="search-soon-hint"
              className="w-full min-w-0 cursor-not-allowed rounded-xl border border-zinc-800/90 bg-zinc-900/40 py-2.5 pl-10 pr-4 text-sm text-zinc-400 placeholder:text-zinc-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-zinc-500/60"
            />
          </label>
          <span id="search-soon-hint" className="sr-only">
            Search is not available yet; placeholder for upcoming global search.
          </span>
        </div>
      </div>
    </header>
  );
}

function SearchGlyph({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      className={className}
      aria-hidden
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
