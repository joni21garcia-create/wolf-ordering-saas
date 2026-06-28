"use client";

import { RestaurantPWASettings } from "@/types/pwa";

interface Props {
  settings: RestaurantPWASettings;
}

export default function PhonePreview({
  settings,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
      }}
    >
      <div
        style={{
          width: 290,
          height: 590,
          borderRadius: 40,
          border: "10px solid #111827",
          background:
            settings.background_color,
          overflow: "hidden",
          boxShadow:
            "0 20px 60px rgba(0,0,0,.25)",
          position: "relative",
        }}
      >
        {/* Dynamic Island */}
        <div
          style={{
            width: 120,
            height: 26,
            background: "#000",
            borderRadius: 20,
            position: "absolute",
            top: 12,
            left: "50%",
            transform:
              "translateX(-50%)",
            zIndex: 20,
          }}
        />

        {/* Pantalla */}
        <div
          style={{
            width: "100%",
            height: "100%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            padding: 30,
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: 120,
              height: 120,
              borderRadius: 28,
              overflow: "hidden",
              background: "#fff",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 28,
            }}
          >
            {settings.app_logo ? (
              <img
             src={`${settings.app_logo}?t=${Date.now()}`}
                alt={settings.app_name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <span
                style={{
                  fontSize: 48,
                }}
              >
                🍽️
              </span>
            )}
          </div>

          <h2
            style={{
              margin: 0,
              color:
                settings.theme_color,
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            {settings.app_name}
          </h2>

          <p
            style={{
              color: "#999",
              marginTop: 10,
              marginBottom: 30,
              fontSize: 15,
            }}
          >
            {settings.description}
          </p>

          <button
            style={{
              width: "100%",
              border: "none",
              borderRadius: 14,
              padding: "16px",
              fontWeight: 700,
              fontSize: 16,
              color: "#fff",
              background:
                settings.theme_color,
            }}
          >
            Abrir aplicación
          </button>

          <div
            style={{
              marginTop: 40,
              color: "#888",
              fontSize: 13,
            }}
          >
            Vista previa PWA
          </div>
        </div>
      </div>
    </div>
  );
}
