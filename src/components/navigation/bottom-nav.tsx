"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import {
  ALL_APP_LINKS,
  isNavActive,
  MOBILE_BOTTOM_NAV_ITEMS,
} from "@/components/navigation/nav-config";
import { MoreIcon, PrimaryNavIcon } from "@/components/navigation/nav-icons";
import { useHydrated } from "@/lib/use-hydrated";

export function BottomNav() {
  const pathname = usePathname();
  const navReady = useHydrated();
  const [moreOpen, setMoreOpen] = useState(false);

  const close = useCallback(() => setMoreOpen(false), []);

  useEffect(() => {
    if (!moreOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [moreOpen, close]);

  useEffect(() => {
    close();
  }, [pathname, close]);

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 border-t border-zinc-800/90 bg-zinc-950/95 pb-[env(safe-area-inset-bottom)] pt-1 backdrop-blur-md md:hidden"
        aria-label="Primary mobile navigation"
      >
        <div className="mx-auto flex max-w-lg items-stretch justify-around px-1">
          {MOBILE_BOTTOM_NAV_ITEMS.map((item) => {
            const active = navReady && isNavActive(pathname, item.href);
            const label = item.shortLabel;
            return (
              <Link
                key={item.id}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
                  active
                    ? "text-cyan-300"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-xl ${
                    active ? "bg-cyan-500/15" : "bg-transparent"
                  }`}
                >
                  <PrimaryNavIcon id={item.id} className="h-5 w-5" />
                </span>
                <span className="truncate">{label}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setMoreOpen(true)}
            className={`flex min-h-12 min-w-0 flex-1 flex-col items-center justify-center gap-0.5 rounded-xl px-1 py-2 text-[10px] font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-400/70 ${
              moreOpen ? "text-cyan-300" : "text-zinc-500 hover:text-zinc-300"
            }`}
            aria-expanded={moreOpen}
            aria-haspopup="dialog"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-xl">
              <MoreIcon className="h-5 w-5" />
            </span>
            <span>More</span>
          </button>
        </div>
      </nav>

      {moreOpen ? (
        <div
          className="fixed inset-0 z-50 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="All destinations"
        >
          <button
            type="button"
            className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
            aria-label="Close menu"
            onClick={close}
          />
          <div className="absolute inset-x-0 bottom-0 max-h-[min(78vh,520px)] rounded-t-2xl border border-zinc-800/90 bg-zinc-950 shadow-2xl">
            <div className="flex items-center justify-between border-b border-zinc-800/80 px-5 py-4">
              <p className="text-sm font-semibold text-zinc-100">All destinations</p>
              <button
                type="button"
                onClick={close}
                className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200"
              >
                Close
              </button>
            </div>
            <nav
              className="overflow-y-auto px-3 py-4 pb-[calc(1rem+env(safe-area-inset-bottom))]"
              aria-label="Full app navigation"
            >
              <ul className="grid gap-1 sm:grid-cols-2">
                {ALL_APP_LINKS.map((link) => {
                  const active =
                    navReady && isNavActive(pathname, link.href);
                  return (
                    <li key={`${link.href}-${link.label}`}>
                      <Link
                        href={link.href}
                        onClick={close}
                        aria-current={active ? "page" : undefined}
                        className={`block rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                          active
                            ? "bg-cyan-500/15 text-cyan-300"
                            : "text-zinc-300 hover:bg-zinc-800/80"
                        }`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </div>
        </div>
      ) : null}
    </>
  );
}
