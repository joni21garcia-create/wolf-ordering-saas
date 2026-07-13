"use client";

export default function HistoryEmpty() {
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 24,
        padding: 60,
        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 70,
          marginBottom: 20,
        }}
      >
        📂
      </div>

      <h2
        style={{
          color: "#fff",
          margin: 0,
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        No se encontraron pedidos
      </h2>

      <p
        style={{
          marginTop: 14,
          color: "#8b8b8b",
          fontSize: 16,
          lineHeight: 1.7,
          maxWidth: 520,
          marginInline: "auto",
        }}
      >
        Intenta cambiar los filtros, ampliar el rango de fechas o limpiar la
        búsqueda para visualizar pedidos del historial.
      </p>
    </section>
  );
}