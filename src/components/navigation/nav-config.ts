/**
 * Single source of truth for app navigation.
 * Primary rail surfaces core journeys; full list appears under “More” (mobile sheet + rail footer).
 */

export type NavLink = {
  href: string;
  label: string;
};

/**
 * Complete destination list for the mobile “More” sheet and secondary rail.
 * Order: flows → maps → AI → notes → review tools → assessment → meta.
 */
export const ALL_APP_LINKS: readonly NavLink[] = [
  { href: "/", label: "Dashboard" },
  { href: "/learn/command-center", label: "Command center" },
  { href: "/learn/interactive", label: "Interactive lesson" },
  { href: "/learn/master-detail", label: "Lesson browser" },
  { href: "/learn/library", label: "Learning library" },
  { href: "/topics", label: "Topic map" },
  { href: "/progress/path", label: "Quest map" },
  { href: "/insights", label: "Insights" },
  { href: "/ai-tutor", label: "AI Tutor" },
  { href: "/study-buddy", label: "Study Buddy" },
  { href: "/notes/copilot", label: "Notebook + copilot" },
  { href: "/notes", label: "Notes builder" },
  { href: "/review", label: "Review hub" },
  { href: "/flashcards", label: "Flashcards" },
  { href: "/quiz", label: "Quiz" },
  { href: "/study-run", label: "Study run" },
  { href: "/gap-check", label: "Gap check" },
  { href: "/interactive-demo", label: "Interactive lab (demo)" },
  { href: "/final-exam", label: "Final exam" },
  { href: "/artifacts", label: "Artifacts" },
  { href: "/layouts", label: "Layouts catalog" },
] as const;

export type PrimaryNavId =
  | "home"
  | "learn"
  | "library"
  | "ai-tutor"
  | "notes"
  | "progress"
  | "layouts"
  | "review";

export type PrimaryNavItem = {
  id: PrimaryNavId;
  href: string;
  label: string;
  shortLabel: string;
};

/** Desktop / tablet adaptive rail — full primary set (scrolls on narrow xl if needed). */
export const PRIMARY_NAV_ITEMS: readonly PrimaryNavItem[] = [
  { id: "home", href: "/", label: "Home", shortLabel: "Home" },
  {
    id: "learn",
    href: "/learn/command-center",
    label: "Learn",
    shortLabel: "Learn",
  },
  {
    id: "library",
    href: "/learn/library",
    label: "Library",
    shortLabel: "Library",
  },
  {
    id: "ai-tutor",
    href: "/ai-tutor",
    label: "AI Tutor",
    shortLabel: "Tutor",
  },
  { id: "notes", href: "/notes", label: "Notes", shortLabel: "Notes" },
  {
    id: "progress",
    href: "/progress/path",
    label: "Progress",
    shortLabel: "Path",
  },
  {
    id: "layouts",
    href: "/layouts",
    label: "Layouts",
    shortLabel: "UI",
  },
  { id: "review", href: "/review", label: "Review", shortLabel: "Review" },
] as const;

/** Mobile bottom bar: four high-frequency destinations + “More” — avoids overcrowding. */
const MOBILE_BOTTOM_IDS: readonly PrimaryNavId[] = [
  "home",
  "learn",
  "notes",
  "review",
];

export const MOBILE_BOTTOM_NAV_ITEMS: readonly PrimaryNavItem[] =
  MOBILE_BOTTOM_IDS.map((id) => {
    const item = PRIMARY_NAV_ITEMS.find((p) => p.id === id);
    if (!item) throw new Error(`Missing primary nav item: ${id}`);
    return item;
  });

const PRIMARY_HREFS = new Set(PRIMARY_NAV_ITEMS.map((p) => p.href));

/** Secondary destinations in the expanded rail (everything not already a primary). */
export function getSecondaryNavLinks(): readonly NavLink[] {
  return ALL_APP_LINKS.filter((link) => !PRIMARY_HREFS.has(link.href));
}

export function isNavActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";

  /** Command center + lesson layouts — not the card library (separate primary). */
  if (href === "/learn/command-center") {
    return (
      pathname === "/learn/command-center" ||
      pathname === "/learn/interactive" ||
      pathname.startsWith("/learn/interactive/") ||
      pathname === "/learn/master-detail" ||
      pathname.startsWith("/learn/master-detail/")
    );
  }

  if (href === "/learn/library") {
    return pathname === "/learn/library" || pathname.startsWith("/learn/library/");
  }

  if (href === "/progress/path") {
    return pathname === "/progress/path" || pathname.startsWith("/progress/");
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}
