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

  const featured =
    modules.filter(
      (m) => m.featured
    ).length;

  const coverage =
    totalModules === 0
      ? 0
      : Math.round(
          (featured / totalModules) * 100
        );

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

        gridTemplateColumns:
          "repeat(auto-fit,minmax(260px,1fr))",

        gap: 22,

        marginBottom: 36,
      }}
    >
      <Card
        title="Módulos"
        value={String(totalModules)}
        subtitle="Configuraciones disponibles"
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
        value={String(
          tabs.length - 1
        )}
        subtitle="Organización del sistema"
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

        background:
          "linear-gradient(180deg,#181818,#0b0b0b)",

        border:
          "1px solid rgba(255,255,255,.07)",

        borderRadius: 28,

        padding: 24,

        display: "flex",

        flexDirection: "column",

        gap: 18,

        minHeight: 220,

        boxShadow:
          "0 18px 45px rgba(0,0,0,.18)",

        transition: ".25s",
      }}
    >
      {/* Glow */}

      <div
        style={{
          position: "absolute",

          top: -40,

          right: -40,

          width: 120,

          height: 120,

          borderRadius: "50%",

          background: `${color}18`,

          filter: "blur(30px)",
        }}
      />

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
            width: 62,

            height: 62,

            borderRadius: 18,

            background: `${color}18`,

            display: "flex",

            justifyContent: "center",

            alignItems: "center",

            fontSize: 30,
          }}
        >
          {icon}
        </div>

        <div
          style={{
            width: 12,

            height: 12,

            borderRadius: 999,

            background: color,

            boxShadow: `0 0 12px ${color}`,
          }}
        />
      </div>

      <div
        style={{
          position: "relative",

          zIndex: 2,
        }}
      >
        <div
          style={{
            color: "#8b8b95",

            fontSize: 13,

            fontWeight: 800,

            textTransform: "uppercase",

            letterSpacing: 1.5,
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 10,

            color: "#fff",

            fontSize: 46,

            fontWeight: 900,

            lineHeight: 1,
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: 12,

            color: "#8b8b95",

            fontSize: 14,

            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </div>
      </div>

      <div
        style={{
          marginTop: "auto",
        }}
      >
        <div
          style={{
            height: 8,

            borderRadius: 999,

            overflow: "hidden",

            background:
              "rgba(255,255,255,.07)",
          }}
        >
          <div
            style={{
              width: `${progress}%`,

              height: "100%",

              borderRadius: 999,

              background: color,

              transition: ".35s",
            }}
          />
        </div>

        <div
          style={{
            marginTop: 10,

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            fontSize: 12,

            color: "#7d7d86",
          }}
        >
          <span>Estado</span>

          <span
            style={{
              color,

              fontWeight: 700,
            }}
          >
            {progress}%
          </span>
        </div>
      </div>
    </article>
  );
}