"use client";

import ExecutiveCard from "./ExecutiveCard";

type Module = {
  code: string;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: React.ReactNode;
};

interface Props {
  operationModules: Module[];
  settingsModules: Module[];
}

export default function ExecutiveCenter({
  operationModules,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 70,
      }}
    >
      {/* HERO */}

      <div
        style={{
          marginBottom: 34,

          padding: "34px",

          borderRadius: 32,

          background:
            "linear-gradient(180deg,#171717,#0c0c0c)",

          border:
            "1px solid rgba(255,255,255,.07)",
        }}
      >
        <div
          style={{
            display: "flex",

            justifyContent: "space-between",

            alignItems: "center",

            flexWrap: "wrap",

            gap: 24,
          }}
        >
          <div>
            <div
              style={{
                color: "#f97316",

                fontWeight: 800,

                letterSpacing: 2,

                textTransform: "uppercase",

                fontSize: 13,
              }}
            >
              Executive Command Center
            </div>

            <h2
              style={{
                margin: "12px 0 0",

                color: "#fff",

                fontSize:
                  "clamp(34px,5vw,46px)",

                fontWeight: 900,
              }}
            >
              Módulos Globales
            </h2>

            <p
              style={{
                marginTop: 16,

                color: "#8d8d95",

                lineHeight: 1.8,

                maxWidth: 760,
              }}
            >
              Desde aquí administras toda la
              plataforma Wolf Ordering SaaS.
              Cada restaurante posee su propio
              Centro de Configuración, mientras
              este panel controla únicamente
              los módulos globales.
            </p>
          </div>

          <div
            style={{
              minWidth: 240,

              padding: 26,

              borderRadius: 24,

              background:
                "rgba(255,255,255,.03)",

              border:
                "1px solid rgba(255,255,255,.06)",
            }}
          >
            <div
              style={{
                color: "#8d8d95",

                fontSize: 13,

                fontWeight: 700,

                letterSpacing: 1.5,

                textTransform: "uppercase",
              }}
            >
              Módulos Globales
            </div>

            <div
              style={{
                marginTop: 12,

                color: "#fff",

                fontWeight: 900,

                fontSize: 46,
              }}
            >
              {operationModules.length}
            </div>

            <div
              style={{
                marginTop: 8,

                color: "#22c55e",

                fontWeight: 700,
              }}
            >
              Plataforma sincronizada
            </div>
          </div>
        </div>
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(360px,1fr))",

          gap: 28,
        }}
      >
        {operationModules.map((module) => (
          <ExecutiveCard
            key={module.code}
            title={module.title}
            description={module.description}
            href={module.href}
            color={module.color}
            icon={module.icon}
            badge="Global"
          />
        ))}
      </div>

      {operationModules.length === 0 && (
        <div
          style={{
            marginTop: 34,

            padding: 50,

            borderRadius: 28,

            textAlign: "center",

            background:
              "rgba(255,255,255,.03)",

            border:
              "1px solid rgba(255,255,255,.06)",
          }}
        >
          <h3
            style={{
              color: "#fff",

              marginBottom: 14,
            }}
          >
            No existen módulos asignados
          </h3>

          <p
            style={{
              color: "#8d8d95",

              margin: 0,

              lineHeight: 1.8,
            }}
          >
            Los módulos aparecerán automáticamente
            cuando existan permisos asociados al
            Super Administrador.
          </p>
        </div>
      )}
    </section>
  );
}