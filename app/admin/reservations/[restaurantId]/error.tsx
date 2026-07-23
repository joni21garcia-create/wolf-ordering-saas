"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="flex h-[70vh] items-center justify-center">
      <div className="text-center">
        <h2 className="text-2xl font-bold">
          Ocurrió un error
        </h2>

        <p className="mt-2 text-gray-500">
          {error.message}
        </p>

        <button
          onClick={reset}
          className="mt-6 rounded-lg bg-orange-600 px-4 py-2 text-white"
        >
          Reintentar
        </button>
      </div>
    </div>
  );
}