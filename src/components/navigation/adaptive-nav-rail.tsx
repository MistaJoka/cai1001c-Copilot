"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  getSecondaryNavLinks,
  isNavActive,
  PRIMARY_NAV_ITEMS,
} from "@/components/navigation/nav-config";
import { PrimaryNavIcon } from "@/components/navigation/nav-icons";
import { useHydrated } from "@/lib/use-hydrated";

const SECONDARY = getSecondaryNavLinks();

export function AdaptiveNavRail() {
  const pathname = usePathname();
  const navReady = useHydrated();

  return (
    <aside
      className="fixed inset-y-0 left-0 z-40 hidden h-dvh w-[4.75rem] shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/90 backdrop-blur-md md:flex xl:w-56"
      aria-label="Primary navigation"
    >
      <div className="flex h-full min-h-0 flex-col">
        <div className="border-b border-zinc-800/70 px-2 py-4 xl:px-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-2 rounded-xl xl:justify-start xl:px-2"
            title="GapCloser AI — Home"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-cyan-500/15 text-sm font-bold text-cyan-300">
              GC
            </span>
            <span className="hidden min-w-0 truncate text-sm font-bold tracking-tight text-cyan-300 xl:inline">
              GapCloser AI
            </span>
          </Link>
          <p className="mt-3 hidden text-[11px] leading-snug text-zinc-500 xl:block">
            CAI1001C study surface — learn, check understanding, prep exams.
          </p>
        </div>

        <nav className="flex max-h-[min(520px,62vh)] shrink-0 flex-col gap-1 overflow-y-auto overscroll-contain p-2 xl:max-h-[min(640px,72vh)] xl:px-3 xl:py-3">
          {PRIMARY_NAV_ITEMS.map((item) => {
            const active =
              navReady && isNavActive(pathname, item.href);
            return (
              <Link
                key={item.id}
                href={item.href}
                title={item.label}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-11 items-center gap-3 rounded-xl px-2 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/60 xl:px-3 ${
                  active
                    ? "bg-cyan-500/15 text-cyan-300"
                    : "text-zinc-400 hover:bg-zinc-800/70 hover:text-zinc-100"
                }`}
              >
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-zinc-900/60 text-current xl:bg-transparent">
                  <PrimaryNavIcon id={item.id} className="h-5 w-5" />
                </span>
                <span className="hidden truncate xl:inline">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="hidden min-h-0 flex-1 flex-col border-t border-zinc-800/70 xl:flex">
          <div className="shrink-0 px-4 pb-2 pt-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
              More tools
            </p>
          </div>
          <nav
            className="flex min-h-0 flex-1 flex-col gap-0.5 overflow-y-auto px-2 pb-4 xl:px-3"
            aria-label="Secondary navigation"
          >
            {SECONDARY.map((link) => {
              const active =
                navReady && isNavActive(pathname, link.href);
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-lg px-3 py-2.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/50 ${
                    active
                      ? "bg-zinc-800/90 text-cyan-200"
                      : "text-zinc-500 hover:bg-zinc-800/50 hover:text-zinc-200"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
