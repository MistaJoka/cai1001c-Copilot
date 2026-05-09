import type { LayoutStatus } from "@/components/layouts/layout-types";

const STYLES: Record<
  LayoutStatus,
  { label: string; className: string }
> = {
  available: {
    label: "Live",
    className:
      "border-emerald-500/35 bg-emerald-500/10 text-emerald-200/95",
  },
  partial: {
    label: "Partial",
    className: "border-amber-500/35 bg-amber-500/10 text-amber-100/95",
  },
  planned: {
    label: "Planned",
    className: "border-zinc-600/80 bg-zinc-800/60 text-zinc-300",
  },
};

type Props = {
  status: LayoutStatus;
  /** Override visible label while keeping palette */
  label?: string;
  className?: string;
};

export function StatusPill({ status, label, className = "" }: Props) {
  const cfg = STYLES[status];
  const text = label ?? cfg.label;

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium uppercase tracking-wide ${cfg.className} ${className}`}
    >
      {text}
    </span>
  );
}
