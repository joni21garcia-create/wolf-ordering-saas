"use client";

import Link from "next/link";

export default function EmptyRestaurants() {
  return (
    <section
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: 520,
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 620,
          textAlign: "center",
          background: "linear-gradient(180deg,#181818,#131313)",
          border: "1px solid rgba(255,255,255,.06)",
          borderRadius: 30,
          padding: "60px 40px",
          boxShadow: "0 25px 60px rgba(0,0,0,.20)",
        }}
      >
        {/* Icono */}
        <div
          style={{
            width: 110,
            height: 110,
            margin: "0 auto 28px",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: 46,
            background: "linear-gradient(135deg,#ff8a1f20,#ff620020)",
            border: "1px solid rgba(255,138,31,.20)",
          }}
        >
          🏪
        </div>

        {/* Título */}
        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontSize: "clamp(28px,4vw,36px)",
            fontWeight: 800,
          }}
        >
          No existen restaurantes
        </h2>

        {/* Texto */}
        <p
          style={{
            marginTop: 18,
            marginBottom: 36,
            color: "#9d9d9d",
            fontSize: 16,
            lineHeight: 1.8,
            maxWidth: 470,
            marginInline: "auto",
          }}
        >
          Aún no has registrado ningún restaurante dentro de la plataforma.
          <br />
          Comienza creando el primero para empezar a administrar pedidos,
          configuración, finanzas y estadísticas.
        </p>

        {/* Botón */}
        <Link
          href="/super-admin/restaurants/new"
          style={{
            textDecoration: "none",
          }}
        >
          <button
            style={{
              height: 58,
              padding: "0 32px",
              border: "none",
              borderRadius: 18,
              cursor: "pointer",
              background: "linear-gradient(135deg,#ff8a1f,#ff6200)",
              color: "#fff",
              fontWeight: 700,
              fontSize: 15,
              boxShadow: "0 20px 45px rgba(255,120,0,.30)",
              transition: ".25s",
            }}
          >
            + Crear Restaurante
          </button>
        </Link>
      </div>
    </section>
  );
}


