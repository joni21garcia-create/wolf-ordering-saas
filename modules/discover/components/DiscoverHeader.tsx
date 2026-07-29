import Link from "next/link";

export default function DiscoverHeader() {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Descubre restaurantes
        </h1>

        <p className="mt-2 text-muted-foreground">
          Encuentra tu restaurante favorito y comienza a ordenar.
        </p>
      </div>

      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:underline"
      >
        ¿Eres restaurante?
        <span aria-hidden="true">→</span>
      </Link>
    </header>
  );
}