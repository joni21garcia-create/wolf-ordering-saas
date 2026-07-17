"use client";

import { useRouter } from "next/navigation";
import { darkButton, orangeButton } from "./styles";

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
      : Math.round((configuredModules / totalModules) * 100);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        marginBottom: 28,
        borderRadius: 24,
        padding: "28px 32px",
        background: "linear-gradient(180deg,#171717 0%,#0b0b0b 100%)",
        border: "1px solid rgba(255,255,255,.06)",
        boxShadow: "0 15px 35px rgba(0,0,0,.15)",
        boxSizing: "border-box",
      }}
    >
      {/* Glow decorativo sutil */}
      <div
        style={{
          position: "absolute",
          top: -80,
          right: -80,
          width: 200,
          height: 200,
          borderRadius: "50%",
          background: "rgba(249,115,22,.07)",
          filter: "blur(50px)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 24,
          flexWrap: "wrap",
        }}
      >
        {/* Información principal izquierda */}
        <div style={{ flex: 1, minWidth: 280 }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "4px 12px",
              borderRadius: 99,
              background: "rgba(249,115,22,.1)",
              border: "1px solid rgba(249,115,22,.2)",
              color: "#f97316",
              fontWeight: 800,
              letterSpacing: 1,
              fontSize: 12,
              marginBottom: 10,
            }}
          >
            ⚙ WOLF RESTAURANT OS
          </div>

          <h1
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(26px, 4vw, 36px)",
              fontWeight: 900,
              lineHeight: 1.1,
              letterSpacing: "-0.5px",
            }}
          >
            Centro de Configuración
          </h1>

          <p
            style={{
              marginTop: 8,
              color: "#8b8b95",
              maxWidth: 600,
              fontSize: 14,
              lineHeight: 1.5,
            }}
          >
            Administra branding, menú, pedidos, marketing y parámetros avanzados del restaurante.
          </p>

          {restaurantName && (
            <div
              style={{
                marginTop: 14,
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                padding: "6px 14px",
                borderRadius: 99,
                background: "rgba(34,197,94,.08)",
                border: "1px solid rgba(34,197,94,.18)",
                color: "#4ade80",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              🏪 {restaurantName}
            </div>
          )}
        </div>

        {/* Panel lateral derecho compacto y fluido */}
        <div
          style={{
            width: 340,
            maxWidth: "100%",
            padding: 20,
            borderRadius: 20,
            background: "rgba(255,255,255,.02)",
            border: "1px solid rgba(255,255,255,.05)",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              color: "#fff",
              fontWeight: 700,
              marginBottom: 8,
              fontSize: 13,
            }}
          >
            <span style={{ color: "#8b8b95" }}>Estado de Configuración</span>
            <span style={{ color: "#22c55e", fontWeight: 800 }}>
              {configuredModules}/{totalModules} ({progress}%)
            </span>
          </div>

          {/* Barra de progreso unificada */}
          <div
            style={{
              height: 6,
              borderRadius: 99,
              background: "rgba(255,255,255,.06)",
              overflow: "hidden",
              marginBottom: 16,
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 99,
                background: "linear-gradient(90deg,#22c55e,#16a34a)",
                transition: "width 0.4s ease",
              }}
            />
          </div>

          {/* Botones de acción directos */}
          <div
            style={{
              display: "flex",
              gap: 8,
              flexWrap: "wrap",
            }}
          >
            <button
              style={{ ...darkButton, padding: "10px 14px", fontSize: 13, flex: 1 }}
              onClick={() => router.back()}
            >
              ← Volver
            </button>
            <button
              style={{ ...darkButton, padding: "10px 14px", fontSize: 13, flex: 1 }}
              onClick={() => router.push("/super-admin/restaurants")}
            >
              🏪 Lista
            </button>
            <button
              style={{ ...orangeButton, padding: "10px 14px", fontSize: 13, flex: 1.2 }}
              onClick={() => router.push("/super-admin")}
            >
              🏛 Dashboard
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}