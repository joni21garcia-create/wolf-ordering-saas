"use client";

import "./orders-animations.css";

import {
  Bell,
  Store,
  RefreshCw,
  Volume2,
  VolumeX,
} from "lucide-react";

import {
  cardStyle,
  colors,
} from "./styles";


import type { Restaurant } from "./types";

interface Props {
  restaurant: Restaurant;
  connected: boolean;

  soundEnabled?: boolean;
  refreshing?: boolean;
  notificationCount?: number;

  onToggleSound?: () => void;
  onRefresh?: () => void;
  onOpenNotifications?: () => void;
}

export default function OperationsHeader({
  restaurant,
  connected,
  soundEnabled,
  refreshing,
  notificationCount,
  onToggleSound,
  onRefresh,
  onOpenNotifications,
}: Props) {

const notifications = notificationCount ?? 0;

  return (
    <section
      style={{
        ...cardStyle,
        padding: "14px 20px",
        marginBottom: 16,
      }}
    >


      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          flexWrap: "wrap",
        }}
      >
        {/* Restaurante */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              width: 42,
              height: 42,
              borderRadius: 12,
              overflow: "hidden",
              background: "#181818",
              border: "1px solid rgba(255,255,255,.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
            }}
          >
            {restaurant.logo_url ? (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            ) : (
              <Store size={20} color="#777" />
            )}
          </div>

          <div>
            <div
              style={{
                fontSize: 11,
                color: colors.textSecondary,
                marginBottom: 2,
              }}
            >
              Centro de Operaciones
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 22,
                fontWeight: 800,
                lineHeight: 1.1,
              }}
            >
              {restaurant.name}
            </h1>

            <div
              style={{
                marginTop: 2,
                color: colors.textSecondary,
                fontSize: 12,
              }}
            >
              /{restaurant.slug}
            </div>
          </div>
        </div>

        {/* Controles globales */}

        <div
          style={{
            display: "flex",
            gap: 8,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          {/* Realtime — minimalista: punto + texto, sin icono */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "8px 14px",
              borderRadius: 999,
              background: connected
                ? "rgba(34,197,94,.10)"
                : "rgba(239,68,68,.10)",
              color: connected ? colors.green : colors.red,
              fontWeight: 600,
              fontSize: 13,
            }}
          >
            <span
              className={connected ? "wolf-dot-connected" : ""}
              style={{
                width: 7,
                height: 7,
                borderRadius: "50%",
                background: connected ? colors.green : colors.red,
                display: "inline-block",
              }}
            />
            {connected ? "Tiempo real" : "Sin conexión"}
          </div>

          {/* Sonido — comunica estado activo/inactivo */}
          <button
            type="button"
            onClick={onToggleSound ?? (() => {})}
            aria-pressed={soundEnabled}
            className={`wolf-sound-button${
              soundEnabled ? " is-on" : ""
            }`}
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: soundEnabled
                ? colors.orange
                : "#2a2a2a",
              color: soundEnabled
                ? "#fff"
                : "#888",
            }}
          >
            {soundEnabled ? (
              <Volume2 size={17} />
            ) : (
              <VolumeX size={17} />
            )}
          </button>

          {/* Campana — centro de notificaciones */}
          <button
            type="button"
            onClick={onOpenNotifications ?? (() => {})}
            className={`wolf-bell-button${
              notifications > 0
                ? " has-alert"
                : ""
            }`}
            style={{
              position: "relative",
              width: 40,
              height: 40,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(249,115,22,.12)",
              color: colors.orange,
            }}
          >
            <Bell
              size={19}
              className="wolf-bell-icon"
            />

            {notifications > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: -2,
                  right: -2,
                  minWidth: 16,
                  height: 16,
                  padding: "0 4px",
                  borderRadius: 999,
                  background: colors.red,
                  color: "#fff",
                  fontSize: 10,
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "2px solid #111",
                }}
              >
                {notifications}
              </span>
            )}
          </button>

          {/* Actualizar — acción principal, colores Wolf */}
          <button
            type="button"
            onClick={onRefresh ?? (() => {})}
            className="wolf-refresh-button"
            style={{
              width: 38,
              height: 38,
              borderRadius: "50%",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: colors.orange,
              color: "#fff",
              boxShadow:
                "0 2px 10px rgba(249,115,22,.35)",
            }}
          >
            <RefreshCw
              size={17}
              className={`wolf-refresh-icon${
                refreshing
                  ? " is-spinning"
                  : ""
              }`}
            />
          </button>
        </div>
      </div>
    </section>
  );
}