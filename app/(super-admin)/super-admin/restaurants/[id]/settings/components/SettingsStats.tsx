"use client";

import type {
  SettingsModule,
  CategoryTab,
  QuickAction,
} from "./types";

interface Props {
  modules: SettingsModule[];
  tabs: CategoryTab[];
  actions: QuickAction[];
}

export default function SettingsStats({
  modules,
  tabs,
  actions,
}: Props) {
  const totalModules = modules.length;

  const featured = modules.filter(
    (m) => m.featured
  ).length;

  const coverage =
    totalModules === 0
      ? 0
      : Math.round((featured / totalModules) * 100);

  const coverageColor =
    coverage >= 80
      ? "#22c55e"
      : coverage >= 50
      ? "#f59e0b"
      : "#ef4444";

  const coverageText =
    coverage >= 80
      ? "Excelente"
      : coverage >= 50
      ? "En progreso"
      : "Requiere atención";

  return (
    <section
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: 16,
        marginBottom: 28,
      }}
    >
      <Card
        title="Módulos"
        value={String(totalModules)}
        subtitle="Disponibles"
        color="#f97316"
        icon="📦"
        progress={100}
      />

      <Card
        title="Destacados"
        value={String(featured)}
        subtitle="Accesos principales"
        color="#3b82f6"
        icon="⭐"
        progress={coverage}
      />

      <Card
        title="Categorías"
        value={String(tabs.length - 1)}
        subtitle="Secciones del sistema"
        color="#22c55e"
        icon="🗂️"
        progress={100}
      />

      <Card
        title="Cobertura"
        value={`${coverage}%`}
        subtitle={coverageText}
        color={coverageColor}
        icon="⚡"
        progress={coverage}
      />
    </section>
  );
}

function Card({
  title,
  value,
  subtitle,
  color,
  icon,
  progress,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
  progress: number;
}) {
  return (
    <article
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg,#171717,#0b0b0b)",
        border: "1px solid rgba(255,255,255,.06)",
        borderRadius: 20,
        padding: "18px 20px",
        display: "flexflex",
        flexDirection: "column",
        gap: 12,
        boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        boxSizing: "border-box",
        transition: "transform 0.2s ease, border-color 0.2s ease",
      }}
    >
      {/* Glow decorativo sutil */}
      <div
        style={{
          position: "absolute",
          top: -30,
          right: -30,
          width: 100,
          height: 100,
          borderRadius: "50%",
          background: `${color}10`,
          filter: "blur(35px)",
          pointerEvents: "none",
        }}
      />

      {/* HEADER DE LA TARJETA */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
          }}
        >
          <div
            style={{
              width: 38,
              height: 38,
              borderRadius: 12,
              background: `${color}15`,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: 18,
            }}
          >
            {icon}
          </div>
          <div
            style={{
              color: "#8b8b95",
              fontSize: 11,
              fontWeight: 800,
              textTransform: "uppercase",
              letterSpacing: 1,
            }}
          >
            {title}
          </div>
        </div>

        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: 99,
            background: color,
            boxShadow: `0 0 8px ${color}`,
          }}
        />
      </div>

      {/* CONTENIDO PRINCIPAL */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          alignItems: "baseline",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            color: "#fff",
            fontSize: 32,
            fontWeight: 900,
            lineHeight: 1,
            letterSpacing: "-0.5px",
          }}
        >
          {value}
        </div>
        <div
          style={{
            color: "#8b8b95",
            fontSize: 12,
            textAlign: "right",
          }}
        >
          {subtitle}
        </div>
      </div>

      {/* BARRA DE PROGRESO COMPACTA */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          marginTop: 2,
        }}
      >
        <div
          style={{
            height: 4,
            borderRadius: 99,
            overflow: "hidden",
            background: "rgba(255,255,255,.05)",
          }}
        >
          <div
            style={{
              width: `${progress}%`,
              height: "100%",
              borderRadius: 99,
              background: color,
              transition: "width 0.35s ease",
            }}
          />
        </div>
      </div>
    </article>
  );
}