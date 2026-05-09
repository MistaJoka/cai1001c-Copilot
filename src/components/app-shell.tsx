import type { ReactNode } from "react";
import { AdaptiveNavRail } from "@/components/navigation/adaptive-nav-rail";
import { BottomNav } from "@/components/navigation/bottom-nav";
import { TopCommandBar } from "@/components/navigation/top-command-bar";

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-screen min-h-dvh flex-col overflow-x-hidden md:flex-row">
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

      <AdaptiveNavRail />

      <div className="flex min-h-screen min-h-dvh min-w-0 flex-1 flex-col md:pl-[4.75rem] xl:pl-56">
        <TopCommandBar />
        <main className="mx-auto w-full min-w-0 max-w-7xl flex-1 px-4 py-6 pb-[calc(5.25rem+env(safe-area-inset-bottom))] sm:px-6 sm:py-8 md:pb-10 lg:px-8 lg:py-10">
          {children}
        </main>
      </div>

      <BottomNav />
    </div>
  );
}
