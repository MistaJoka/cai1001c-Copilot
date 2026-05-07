"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useHydrated } from "@/lib/use-hydrated";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/topics", label: "Topic Map" },
  { href: "/insights", label: "Insights" },
  { href: "/study-run", label: "Study Run" },
  { href: "/interactive-demo", label: "Interactive Lab" },
  { href: "/study-buddy", label: "Study Buddy" },
  { href: "/gap-check", label: "Gap Check" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/quiz", label: "Quiz" },
  { href: "/notes", label: "Notes" },
  { href: "/final-exam", label: "Final Exam" },
  { href: "/artifacts", label: "Artifacts" },
] as const;

export function SidebarNav() {
  const pathname = usePathname();
  const navReady = useHydrated();

  return (
    <nav className="flex flex-col gap-1" aria-label="Main">
      {NAV.map((item) => {
        const active =
          navReady &&
          (item.href === "/"
            ? pathname === "/"
            : pathname === item.href || pathname.startsWith(`${item.href}/`));
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-xl px-3 py-2 text-sm font-medium transition-colors ${
              active
                ? "bg-cyan-500/15 text-cyan-300"
                : "text-zinc-400 hover:bg-zinc-800/80 hover:text-zinc-100"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const navReady = useHydrated();

  return (
    <div className="border-b border-zinc-800/90 bg-zinc-950/90 px-4 py-3 backdrop-blur-md md:hidden">
      <div className="flex items-center justify-between gap-3">
        <Link
          href="/"
          className="text-sm font-semibold tracking-tight text-cyan-400"
          onClick={() => setOpen(false)}
        >
          GapCloser AI
        </Link>
        <button
          type="button"
          className="rounded-lg border border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-200"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav className="mt-3 flex flex-col gap-1 border-t border-zinc-800 pt-3">
          {NAV.map((item) => {
            const active =
              navReady &&
              (item.href === "/"
                ? pathname === "/"
                : pathname === item.href || pathname.startsWith(`${item.href}/`));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-2 py-2 text-sm ${
                  active ? "text-cyan-300" : "text-zinc-300"
                }`}
                onClick={() => setOpen(false)}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      ) : null}
    </div>
  );
}
