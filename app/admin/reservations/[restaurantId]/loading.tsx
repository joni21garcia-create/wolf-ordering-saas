export default function Loading() {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="text-center">

        <div className="h-12 w-12 rounded-full border-4 border-orange-500 border-t-transparent animate-spin mx-auto" />

        <p className="mt-6 text-zinc-400">
          Cargando módulo de reservas...
        </p>

      </div>
    </div>
  );
}