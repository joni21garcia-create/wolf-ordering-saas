"use client";

import { useRouter } from "next/navigation";

import {
  darkButton,
  orangeButton,
} from "./styles";

interface Props {
  restaurantName?: string;

  totalModules?: number;

  configuredModules?: number;
}

export default function SettingsHeader({
  restaurantName,
  totalModules = 0,
  configuredModules = 0,
}: Props) {
  const router = useRouter();

  const progress =
    totalModules === 0
      ? 0
      : Math.round(
          (configuredModules /
            totalModules) *
            100
        );

  return (
<section
  style={{
    position: "relative",

    overflow: "hidden",

    marginBottom: 42,

    borderRadius: 34,

    padding: "42px",

    background:
      "linear-gradient(180deg,#181818 0%,#0b0b0b 100%)",

    border:
      "1px solid rgba(255,255,255,.07)",

    boxShadow:
      "0 24px 70px rgba(0,0,0,.26)",
  }}
>
  {/* Glow */}

  <div
    style={{
      position: "absolute",

      top: -120,

      right: -120,

      width: 280,

      height: 280,

      borderRadius: "50%",

      background:
        "rgba(249,115,22,.12)",

      filter: "blur(70px)",
    }}
  />

  <div
    style={{
      position: "relative",

      zIndex: 2,

      display: "flex",

      justifyContent: "space-between",

      alignItems: "flex-start",

      gap: 40,

      flexWrap: "wrap",
    }}
  >
    {/* Información */}

    <div
      style={{
        flex: 1,

        minWidth: 320,
      }}
    >
      <div
        style={{
          display: "inline-flex",

          alignItems: "center",

          gap: 10,

          padding: "8px 16px",

          borderRadius: 999,

          background:
            "rgba(249,115,22,.12)",

          border:
            "1px solid rgba(249,115,22,.22)",

          color: "#f97316",

          fontWeight: 800,

          letterSpacing: 1,

          fontSize: 13,

          marginBottom: 24,
        }}
      >
        ⚙ WOLF RESTAURANT OS
      </div>

      <h1
        style={{
          margin: 0,

          color: "#fff",

          fontSize:
            "clamp(48px,6vw,72px)",

          fontWeight: 900,

          lineHeight: 1,
        }}
      >
        Centro de
        <br />
        Configuración
      </h1>

      <p
        style={{
          marginTop: 24,

          color: "#9a9a9a",

          maxWidth: 760,

          fontSize: 17,

          lineHeight: 1.9,
        }}
      >
        Administra todos los módulos del
        restaurante desde un único lugar.
        Branding, menú, pedidos,
        marketing, usuarios, finanzas,
        analítica, PWA y configuración
        avanzada.
      </p>

      {restaurantName && (
        <div
          style={{
            marginTop: 26,

            display: "inline-flex",

            alignItems: "center",

            gap: 12,

            padding: "12px 22px",

            borderRadius: 999,

            background:
              "rgba(34,197,94,.12)",

            border:
              "1px solid rgba(34,197,94,.22)",

            color: "#4ade80",

            fontWeight: 700,

            fontSize: 15,
          }}
        >
          🏪 {restaurantName}
        </div>
      )}
    </div>

    {/* Panel lateral */}

    <div
      style={{
        width: 330,

        maxWidth: "100%",

        padding: 28,

        borderRadius: 28,

        background:
          "rgba(255,255,255,.03)",

        border:
          "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          color: "#fff",

          fontWeight: 800,

          marginBottom: 12,
        }}
      >
        <span>
          Estado General
        </span>

<div>
   <div>{progress}%</div>

   <small>Configurado</small>
</div>
      </div>

      <div
        style={{
          height: 10,

          borderRadius: 999,

          background:
            "rgba(255,255,255,.08)",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${progress}%`,

            height: "100%",

            borderRadius: 999,

            background:
              "linear-gradient(90deg,#22c55e,#16a34a)",
          }}
        />
      </div>

      <div
        style={{
          marginTop: 24,

          display: "grid",

          gap: 14,
        }}
      >
        <StatusRow
          label="Configurados"
          value={`${configuredModules}/${totalModules}`}
        />

        <StatusRow
          label="Estado"
          value="Online"
        />

        <StatusRow
          label="Plataforma"
          value="Wolf OS"
        />
      </div>

      <div
        style={{
          marginTop: 28,

          display: "flex",

          gap: 12,

          flexWrap: "wrap",
        }}
      >
        <button
          style={darkButton}
          onClick={() =>
            router.back()
          }
        >
          ← Volver
        </button>

        <button
          style={darkButton}
          onClick={() =>
            router.push(
              "/super-admin/restaurants"
            )
          }
        >
          🏪 Restaurantes
        </button>

        <button
          style={orangeButton}
          onClick={() =>
            router.push(
              "/super-admin"
            )
          }
        >
          🏛 Dashboard
        </button>
      </div>
    </div>
  </div>

      {/* RESUMEN */}

<div
  style={{
    marginTop: 34,

    display: "grid",

    gridTemplateColumns:
      "repeat(auto-fit,minmax(240px,1fr))",

    gap: 22,
  }}
>
  <InfoCard
    title="Módulos"
    value={String(totalModules)}
    subtitle="Disponibles en este restaurante"
    color="#3b82f6"
    icon="📦"
  />

  <InfoCard
    title="Configurados"
    value={`${configuredModules}`}
    subtitle={`${progress}% completado`}
    color="#22c55e"
    icon="✅"
  />

  <InfoCard
    title="Estado"
    value="Online"
    subtitle="Sistema operativo"
    color="#f97316"
    icon="🟢"
  />

  <InfoCard
    title="Plataforma"
    value="Wolf OS"
    subtitle="Restaurant Center"
    color="#8b5cf6"
    icon="⚙️"
  />
</div>
    </section>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "#8d8d95",
          fontSize: 14,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#fff",
          fontWeight: 700,
        }}
      >
        {value}
      </span>
    </div>
  );
}

function InfoCard({
  title,
  value,
  subtitle,
  color,
  icon,
}: {
  title: string;
  value: string;
  subtitle: string;
  color: string;
  icon: string;
}) {
  return (
    <div
      style={{
        background:
          "linear-gradient(180deg,#171717,#0c0c0c)",

        border:
          "1px solid rgba(255,255,255,.06)",

        borderRadius: 26,

        padding: 24,

        display: "flex",

        flexDirection: "column",

        gap: 18,

        transition: ".25s",

        minHeight: 185,
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",
        }}
      >
        <div
          style={{
            width: 60,

            height: 60,

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
          }}
        />
      </div>

      <div>
        <div
          style={{
            color,

            fontWeight: 800,

            letterSpacing: 1.5,

            fontSize: 13,

            textTransform: "uppercase",
          }}
        >
          {title}
        </div>

        <div
          style={{
            marginTop: 10,

            color: "#fff",

            fontSize: 42,

            fontWeight: 900,

            lineHeight: 1,
          }}
        >
          {value}
        </div>

        <div
          style={{
            marginTop: 14,

            color: "#8b8b95",

            fontSize: 14,

            lineHeight: 1.6,
          }}
        >
          {subtitle}
        </div>
      </div>
    </div>
  );
}