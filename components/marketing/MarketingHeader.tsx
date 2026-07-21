"use client";

export default function MarketingHeader() {
  return (
    <header
      style={{
        marginBottom: "40px",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#ffffff",
            fontSize: "clamp(30px, 4vw, 42px)",
            fontWeight: 800,
            lineHeight: 1.1,
          }}
        >
          Marketing
        </h1>

        <p
          style={{
            margin: 0,
            color: "#9ca3af",
            fontSize: "16px",
            lineHeight: 1.7,
            maxWidth: "720px",
          }}
        >
          Promociona tu restaurante con códigos QR profesionales.
          Genera material listo para imprimir y compartir con tus clientes
          para que puedan ordenar desde su celular de forma rápida y sencilla.
        </p>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "12px",
            marginTop: "10px",
          }}
        >
          <span
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(249,115,22,.15)",
              color: "#f97316",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            QR Personalizado
          </span>

          <span
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.06)",
              color: "#d1d5db",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Descarga PNG
          </span>

          <span
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.06)",
              color: "#d1d5db",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Descarga SVG
          </span>

          <span
            style={{
              padding: "8px 14px",
              borderRadius: "999px",
              background: "rgba(255,255,255,.06)",
              color: "#d1d5db",
              fontSize: "13px",
              fontWeight: 600,
            }}
          >
            Material Promocional
          </span>
        </div>
      </div>
    </header>
  );
}


