"use client";

import Link from "next/link";

export default function RestaurantsHeader() {
  return (
    <section
      style={{
        marginBottom: 42,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 32,
        flexWrap: "wrap",
      }}
    >
      {/* ======================================== */}
      {/* Información */}
      {/* ======================================== */}
      <div
        style={{
          flex: 1,
          minWidth: 300,
        }}
      >
        {/* Breadcrumb */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 14px",
            borderRadius: 999,
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.06)",
            marginBottom: 18,
          }}
        >
          <span
            style={{
              fontSize: 12,
              color: "#ff8a1f",
              fontWeight: 700,
            }}
          >
            WOLF
          </span>
          <span style={{ color: "#666" }}>/</span>
          <span
            style={{
              color: "#bdbdbd",
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Super Admin
          </span>
          <span style={{ color: "#666" }}>/</span>
          <span
            style={{
              color: "#ffffff",
              fontSize: 13,
              fontWeight: 700,
            }}
          >
            Restaurantes
          </span>
        </div>

        {/* Título */}
        <h1
          style={{
            margin: 0,
            fontSize: "clamp(36px,5vw,52px)",
            fontWeight: 900,
            color: "#ffffff",
            lineHeight: 1.05,
            letterSpacing: "-1px",
          }}
        >
          Gestión de
          <br />
          Restaurantes
        </h1>

        {/* Descripción */}
        <p
          style={{
            marginTop: 18,
            marginBottom: 0,
            maxWidth: 700,
            color: "#9a9a9a",
            fontSize: 16,
            lineHeight: 1.8,
          }}
        >
          Administra todos los restaurantes registrados en la plataforma, controla
          su estado, configura sus opciones y accede rápidamente a sus módulos
          financieros y de configuración desde un único lugar.
        </p>
      </div>

      {/* ======================================== */}
      {/* Acción */}
      {/* ======================================== */}
      <Link
        href="/super-admin/restaurants/new"
        style={{
          textDecoration: "none",
        }}
      >
        <button
          style={{
            height: 60,
            padding: "0 28px",
            border: "none",
            borderRadius: 18,
            cursor: "pointer",
            background: "linear-gradient(135deg,#ff8a1f,#ff6200)",
            color: "#fff",
            fontWeight: 700,
            fontSize: 15,
            display: "flex",
            alignItems: "center",
            gap: 14,
            boxShadow: "0 18px 45px rgba(255,120,0,.35)",
            transition: ".25s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0px)";
          }}
        >
          <span
            style={{
              fontSize: 26,
              lineHeight: 1,
            }}
          >
            +
          </span>
          Nuevo Restaurante
        </button>
      </Link>
    </section>
  );
}