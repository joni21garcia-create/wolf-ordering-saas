interface EmptyStateProps {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  return (
    <section className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white px-6 py-16 text-center">
      <div className="mb-4 text-5xl">🍽️</div>

      <h2 className="text-xl font-semibold text-gray-900">
        {title}
      </h2>

      <p className="mt-2 max-w-md text-sm text-gray-500">
        {description}
      </p>
    </section>
  );
}