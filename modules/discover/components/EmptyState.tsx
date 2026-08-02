interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <section className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black px-8 py-16 text-center shadow-2xl">
      {/* Glow */}
      <div className="absolute -top-20 -right-20 h-56 w-56 rounded-full bg-orange-500/15 blur-3xl" />
      <div className="absolute -bottom-20 -left-20 h-48 w-48 rounded-full bg-orange-400/10 blur-3xl" />

      <div className="relative flex flex-col items-center">
        <div className="flex h-24 w-24 items-center justify-center rounded-full border border-orange-500/20 bg-orange-500/10 text-5xl shadow-lg">
          🍽️
        </div>

        <h2 className="mt-8 text-3xl font-bold tracking-tight text-white">
          {title}
        </h2>

        <p className="mt-4 max-w-lg text-base leading-7 text-zinc-400">
          {description}
        </p>

        <div className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-orange-500/40 to-transparent" />
      </div>
    </section>
  );
}
