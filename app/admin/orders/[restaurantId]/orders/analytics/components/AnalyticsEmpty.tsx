"use client";

interface Props {
  title?: string;
  description?: string;
}

export default function AnalyticsEmpty({
  title = "No existen datos para mostrar",
  description = "No se encontraron pedidos con los filtros seleccionados. Modifica el rango de fechas o elimina los filtros para visualizar información.",
}: Props) {
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#141414,#0a0a0a)",

        border:
          "1px solid rgba(255,255,255,.07)",

        borderRadius: 28,

        padding: "80px 40px",

        textAlign: "center",
      }}
    >
      <div
        style={{
          fontSize: 70,
          marginBottom: 24,
        }}
      >
        📊
      </div>

      <h2
        style={{
          margin: 0,
          color: "#fff",
          fontSize: 34,
          fontWeight: 800,
        }}
      >
        {title}
      </h2>

      <p
        style={{
          margin: "18px auto 0",
          maxWidth: 640,
          color: "#888",
          lineHeight: 1.8,
          fontSize: 16,
        }}
      >
        {description}
      </p>
    </section>
  );
}