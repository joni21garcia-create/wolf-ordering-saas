"use client";

import { ArrowLeft, Volume2 } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, type CSSProperties } from "react";

const SOUND_STORAGE_KEY = "wolf_order_sound_enabled";

export default function SoundSettings() {
  const params = useParams();
  const router = useRouter();

  const restaurantId =
    typeof params.restaurantId === "string"
      ? params.restaurantId
      : "";

  const [enabled, setEnabled] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY);

    if (stored !== null) {
      setEnabled(stored === "true");
    }

    setMounted(true);
  }, []);

  function toggleSound() {
    const next = !enabled;

    setEnabled(next);
    localStorage.setItem(
      SOUND_STORAGE_KEY,
      String(next)
    );

    // Permite que otras partes de la app reaccionen
    // inmediatamente al cambio sin recargar la página.
    window.dispatchEvent(
      new CustomEvent("wolf-sound-setting-changed", {
        detail: { enabled: next },
      })
    );
  }

  if (!mounted) {
    return (
      <main style={pageStyle}>
        <div style={loadingStyle}>
          Cargando...
        </div>
      </main>
    );
  }

  return (
    <main style={pageStyle}>
      <div style={contentStyle}>
        <header style={headerStyle}>
          <button
            type="button"
            onClick={() =>
              router.push(
                `/admin/restaurant/${restaurantId}`
              )
            }
            style={backButtonStyle}
            aria-label="Volver"
          >
            <ArrowLeft size={18} />
          </button>

          <div>
            <div style={eyebrowStyle}>
              CONFIGURACIÓN
            </div>

            <h1 style={titleStyle}>
              Sonido
            </h1>
          </div>
        </header>

        <section style={cardStyle}>
          <div style={rowStyle}>
            <div style={leftStyle}>
              <div style={iconStyle}>
                <Volume2 size={18} />
              </div>

              <div>
                <div style={labelStyle}>
                  Sonido de pedidos
                </div>

                <div style={descriptionStyle}>
                  Reproducir sonido cuando llega un
                  nuevo pedido
                </div>
              </div>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={enabled}
              onClick={toggleSound}
              style={{
                ...switchStyle,
                background: enabled
                  ? "#f97316"
                  : "#374151",
              }}
            >
              <span
                style={{
                  ...knobStyle,
                  transform: enabled
                    ? "translateX(20px)"
                    : "translateX(0)",
                }}
              />
            </button>
          </div>
        </section>
      </div>
    </main>
  );
}

const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: "#0b0b0b",
  color: "#fff",
};

const contentStyle: CSSProperties = {
  width: "100%",
  maxWidth: 680,
  margin: "0 auto",
  padding: "24px 16px 40px",
  boxSizing: "border-box",
};

const headerStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "40px 1fr",
  alignItems: "center",
  gap: 10,
  marginBottom: 22,
};

const backButtonStyle: CSSProperties = {
  width: 40,
  height: 40,
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: 12,
  background: "#151515",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};

const eyebrowStyle: CSSProperties = {
  color: "#f97316",
  fontSize: 10,
  fontWeight: 800,
  letterSpacing: ".13em",
};

const titleStyle: CSSProperties = {
  margin: "3px 0 0",
  fontSize: 26,
  lineHeight: 1.1,
  fontWeight: 800,
  letterSpacing: "-.03em",
};

const cardStyle: CSSProperties = {
  background: "#111827",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: 16,
  padding: "0 16px",
};

const rowStyle: CSSProperties = {
  minHeight: 72,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
};

const leftStyle: CSSProperties = {
  minWidth: 0,
  display: "flex",
  alignItems: "center",
  gap: 10,
};

const iconStyle: CSSProperties = {
  width: 34,
  height: 34,
  borderRadius: 10,
  background: "rgba(249,115,22,.09)",
  color: "#f97316",
  display: "grid",
  placeItems: "center",
  flexShrink: 0,
};

const labelStyle: CSSProperties = {
  color: "#f3f4f6",
  fontSize: 13,
  fontWeight: 700,
};

const descriptionStyle: CSSProperties = {
  marginTop: 3,
  color: "rgba(255,255,255,.42)",
  fontSize: 11,
  lineHeight: 1.35,
};

const switchStyle: CSSProperties = {
  width: 42,
  height: 23,
  padding: 2,
  border: 0,
  borderRadius: 999,
  cursor: "pointer",
  flexShrink: 0,
  transition: "background .18s ease",
};

const knobStyle: CSSProperties = {
  display: "block",
  width: 19,
  height: 19,
  borderRadius: "50%",
  background: "#fff",
  boxShadow: "0 1px 4px rgba(0,0,0,.3)",
  transition: "transform .18s ease",
};

const loadingStyle: CSSProperties = {
  minHeight: "60vh",
  display: "grid",
  placeItems: "center",
  color: "rgba(255,255,255,.5)",
  fontSize: 13,
};
