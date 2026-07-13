"use client";

import Link from "next/link";

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function NewRestaurantHeader({
  currentStep,
  totalSteps,
}: Props) {
  return (
    <header
      style={{
        marginBottom: 42,
      }}
    >
      {/* Navegación */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 28,
        }}
      >
        <Link
          href="/super-admin/restaurants"
          style={{
            color: "#f97316",
            textDecoration: "none",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          ← Volver a Restaurantes
        </Link>

        <div
          style={{
            display: "flex",
            gap: 12,
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              background:
                "rgba(249,115,22,.12)",
              border:
                "1px solid rgba(249,115,22,.20)",
              color: "#f97316",
              fontWeight: 700,
            }}
          >
            🚀 Nuevo Restaurante
          </div>

          <div
            style={{
              padding: "10px 18px",
              borderRadius: 999,
              background:
                "rgba(59,130,246,.12)",
              border:
                "1px solid rgba(59,130,246,.20)",
              color: "#60a5fa",
              fontWeight: 700,
            }}
          >
            Paso {currentStep} / {totalSteps}
          </div>
        </div>
      </div>

      {/* Hero */}

      <div
        style={{
          textAlign: "center",
          marginBottom: 46,
        }}
      >
        <h1
          style={{
            margin: 0,
            color: "#fff",
            fontSize: 62,
            fontWeight: 900,
            letterSpacing: -2,
          }}
        >
          Crear Restaurante
        </h1>

        <p
          style={{
            maxWidth: 820,
            margin: "22px auto 0",
            color: "#94a3b8",
            fontSize: 19,
            lineHeight: 1.8,
          }}
        >
          Completa el proceso de incorporación del restaurante
          utilizando el nuevo asistente de configuración de Wolf
          Ordering. Al finalizar tendrás el negocio listo para
          configurar Landing, Menú, Analytics, Finance, PWA y todos
          los módulos del ecosistema.
        </p>
      </div>

      {/* Beneficios */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 20,
        }}
      >
        <Feature
          icon="⚡"
          title="Onboarding Guiado"
          description="Configuración paso a paso sin perder información."
        />

        <Feature
          icon="📄"
          title="Agreement Digital"
          description="Contrato integrado y listo para firmar."
        />

        <Feature
          icon="📊"
          title="Preparado para Analytics"
          description="El restaurante nace conectado al ecosistema."
        />

        <Feature
          icon="🚀"
          title="Listo para Producción"
          description="Configuración profesional desde el primer día."
        />
      </div>
    </header>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#171717,#111111)",
        border:
          "1px solid rgba(255,255,255,.06)",
        borderRadius: 24,
        padding: 24,
      }}
    >
      <div
        style={{
          fontSize: 34,
          marginBottom: 18,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#fff",
          fontWeight: 800,
          fontSize: 19,
          marginBottom: 10,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#8b8b8b",
          lineHeight: 1.7,
          fontSize: 15,
        }}
      >
        {description}
      </div>
    </div>
  );
}