import type { ReactNode } from "react";
import type { PrimaryNavId } from "@/components/navigation/nav-config";

type IconProps = { className?: string };

function IconFrame({
  className = "",
  children,
}: IconProps & { children: ReactNode }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      {children}
    </svg>
  );
}

export function PrimaryNavIcon({
  id,
  className = "h-5 w-5",
}: {
  id: PrimaryNavId;
  className?: string;
}) {
  switch (id) {
    case "home":
      return (
        <IconFrame className={className}>
          <path d="M4 10.5 12 4l8 6.5V20a1 1 0 0 1-1 1h-5v-6H10v6H5a1 1 0 0 1-1-1v-9.5z" />
        </IconFrame>
      );
    case "learn":
      return (
        <IconFrame className={className}>
          <path d="M4 19.5 4 5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v14.5" />
          <path d="M4 10h16" />
          <path d="M8 7v13M16 7v13" />
        </IconFrame>
      );
    case "library":
      return (
        <IconFrame className={className}>
          <path d="M5 4h5v16H5zM11 6h5v14h-5zM17 4h3v16h-3z" />
        </IconFrame>
      );
    case "ai-tutor":
      return (
        <IconFrame className={className}>
          <path d="M12 3a7 7 0 0 0-7 7v4l-2 2h18l-2-2v-4a7 7 0 0 0-7-7z" />
          <path d="M9 18h6" />
        </IconFrame>
      );
    case "review":
      return (
        <IconFrame className={className}>
          <path d="M4 6h16M4 12h10M4 18h14" />
          <path d="M18 10v4l2 2" />
        </IconFrame>
      );
    case "notes":
      return (
        <IconFrame className={className}>
          <path d="M8 4h9l3 3v13a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
          <path d="M14 4v4h4" />
        </IconFrame>
      );
    case "progress":
      return (
        <IconFrame className={className}>
          <path d="M4 19V5" />
          <path d="M4 19h16" />
          <path d="M8 17V9M12 17v-5M16 17V7" />
        </IconFrame>
      );
    case "layouts":
      return (
        <IconFrame className={className}>
          <rect x="3" y="3" width="7" height="9" rx="1.5" />
          <rect x="14" y="3" width="7" height="5" rx="1.5" />
          <rect x="14" y="11" width="7" height="10" rx="1.5" />
          <rect x="3" y="15" width="7" height="6" rx="1.5" />
        </IconFrame>
      );
  }
}

export function MoreIcon({ className = "h-6 w-6" }: IconProps) {
  return (
    <IconFrame className={className}>
      <circle cx="6" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="12" cy="12" r="1.5" fill="currentColor" stroke="none" />
      <circle cx="18" cy="12" r="1.5" fill="currentColor" stroke="none" />
    </IconFrame>
  );
}
