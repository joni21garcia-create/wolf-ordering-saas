"use client";

import { ReactNode } from "react";

import MarketingCard from "./MarketingCard";

import type {
  MarketingConfig,
  RestaurantData,
} from "@/types/marketing";

interface Props {
  restaurant: RestaurantData;
  publicUrl: string;
  config: MarketingConfig;
  setConfig: React.Dispatch<
    React.SetStateAction<MarketingConfig>
  >;
}

export default function MarketingSettings({
  restaurant,
  publicUrl,
  config,
  setConfig,
}: Props) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 24,
      }}
    >
      <MarketingCard
        title="Configuración"
        description="Personaliza el código QR que compartirás con tus clientes."
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 22,
          }}
        >
          <div>
            <label style={labelStyle}>
              Restaurante
            </label>

            <input
              readOnly
              value={restaurant.name}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              URL pública
            </label>

            <input
              readOnly
              value={publicUrl}
              style={inputStyle}
            />
          </div>

          <div>
            <label style={labelStyle}>
              Color del QR
            </label>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
              }}
            >
              <input
                type="color"
                value={config.qrColor}
                onChange={(e) =>
                  setConfig((prev) => ({
                    ...prev,
                    qrColor: e.target.value,
                  }))
                }
                style={{
                  width: 60,
                  height: 44,
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                }}
              />

              <span
                style={{
                  color: "#d1d5db",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                {config.qrColor}
              </span>
            </div>
          </div>

          <div>
            <label style={labelStyle}>
              Resolución del QR
            </label>

            <select
              value={config.qrSize}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  qrSize: Number(e.target.value),
                }))
              }
              style={inputStyle}
            >
              <option value={512}>
                512 px
              </option>

              <option value={1024}>
                1024 px
              </option>

              <option value={2048}>
                2048 px
              </option>
            </select>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={labelStyle}>
              Mostrar logo
            </span>

            <input
              type="checkbox"
              checked={config.showLogo}
              onChange={(e) =>
                setConfig((prev) => ({
                  ...prev,
                  showLogo: e.target.checked,
                }))
              }
            />
          </div>
        </div>
      </MarketingCard>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: 8,
  color: "#d1d5db",
  fontWeight: 600,
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "14px",
  borderRadius: "12px",
  border: "1px solid rgba(255,255,255,.08)",
  background: "#1f2937",
  color: "#ffffff",
  fontSize: "14px",
  boxSizing: "border-box",
};


