type Props = {
  title: string;
  description?: string;
};

export function EmptyState({ title, description }: Props) {
  return (
    <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/20 p-8 text-center">
      <p className="text-sm font-medium text-zinc-300">{title}</p>
      {description ? (
        <p className="mt-2 text-xs text-zinc-500">{description}</p>
      ) : null}
    </div>
  );
}
