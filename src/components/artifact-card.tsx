import Link from "next/link";

type Props = {
  title: string;
  description?: string;
  href: string;
};

export function ArtifactCard({ title, description, href }: Props) {
  return (
    <Link
      href={href}
      className="block rounded-2xl border border-zinc-800 bg-zinc-900/40 p-5 shadow-sm transition-colors hover:border-cyan-500/30"
    >
      <h3 className="font-medium text-zinc-100">{title}</h3>
      {description ? (
        <p className="mt-2 text-sm text-zinc-400">{description}</p>
      ) : null}
    </Link>
  );
}
