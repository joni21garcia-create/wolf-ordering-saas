"use client";

export default function Error({
  error,
}: {
  error: Error;
}) {
  return (
    <main
      style={{
        padding: 40,
      }}
    >
      <h1>Error</h1>

      <p>{error.message}</p>
    </main>
  );
}