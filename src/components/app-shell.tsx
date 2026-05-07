import type { ReactNode } from "react";
import { SidebarNav, MobileNav } from "@/components/sidebar-nav";
import Link from "next/link";

type Props = {
  children: ReactNode;
  pageTitle?: string;
};

export function AppShell({ children, pageTitle }: Props) {
  return (
    <div className="relative flex min-h-screen flex-col overflow-x-hidden md:flex-row">
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-zinc-950"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(34,211,238,0.12),transparent_55%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none fixed inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_100%_50%,rgba(99,102,241,0.05),transparent_50%)]"
        aria-hidden
      />
      <aside className="hidden w-56 shrink-0 flex-col border-r border-zinc-800/80 bg-zinc-950/85 px-4 py-6 backdrop-blur-sm md:flex">
        <Link
          href="/"
          className="mb-6 block text-lg font-bold tracking-tight text-cyan-300"
        >
          GapCloser AI
        </Link>
        <p className="mb-4 text-xs leading-relaxed text-zinc-500">
          CAI1001C study surface — learn, check understanding, prep exams.
        </p>
        <SidebarNav />
      </aside>
      <div className="flex min-h-screen min-w-0 flex-1 flex-col">
        <MobileNav />
        <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-6 sm:px-8 sm:py-10">
          {pageTitle ? (
            <header className="mb-8 border-b border-zinc-800/80 pb-4">
              <h1 className="text-2xl font-semibold tracking-tight text-zinc-50 sm:text-3xl">
                {pageTitle}
              </h1>
            </header>
          ) : null}
          {children}
        </main>
      </div>
    </div>
  );
}
