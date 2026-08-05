"use client";


import "./orders-animations.css";

import {
  Bell,
  RefreshCw,
  Store,
} from "lucide-react";

import type { Restaurant } from "./types";

interface Props {
  restaurant: Restaurant;

  refreshing?: boolean;

  connectionStatus?:
  | "online"
  | "syncing"
  | "reconnecting"
  | "offline";

  notificationCount?: number;

  ringBell?: boolean;

  onRefresh?: () => void;

  onOpenNotifications?: () => void;
}

export default function OperationsHeader({
  restaurant,
  refreshing = false,
  connectionStatus = "online",
  notificationCount = 0,
  ringBell = false,
  onRefresh,
  onOpenNotifications,
}: Props) {


const isOnline = connectionStatus === "online";

const isSyncing = connectionStatus === "syncing";

const isReconnecting =
  connectionStatus === "reconnecting";

const isOffline =
  connectionStatus === "offline";

  const liveConfig = {
  online: {
    label: "Wolf Live",
    color: "#22C55E",
    background: "rgba(34,197,94,.12)",
    className: "",
  },

  syncing: {
    label: "Sincronizando",
    color: "#3B82F6",
    background: "rgba(59,130,246,.12)",
    className: "syncing",
  },

  reconnecting: {
    label: "Reconectando",
    color: "#F59E0B",
    background: "rgba(245,158,11,.12)",
    className: "",
  },

  offline: {
    label: "Sin conexión",
    color: "#EF4444",
    background: "rgba(239,68,68,.12)",
    className: "offline",
  },
} as const;

const live = liveConfig[connectionStatus];

  return (
  <section
    style={{
      marginBottom: 20,

      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",

      flexWrap: "wrap",

      gap: 20,
    }}
  >
    {/* Restaurante */}

    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 58,
          height: 58,

          borderRadius: 16,

          overflow: "hidden",

          background: "#171717",

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
          <Store
            size={24}
            color="#888"
          />
        )}
      </div>

      <div>
        <h1
          style={{
            margin: 0,

            fontSize: 28,

            fontWeight: 800,

            color: "#fff",

            lineHeight: 1.1,
          }}
        >
          {restaurant.name}
        </h1>

        <div
          style={{
            marginTop: 5,

            fontSize: 13,

            color: "#8A8A8A",

            fontWeight: 500,
          }}
        >
          /{restaurant.slug}
        </div>
      </div>
    </div>
{/* Acciones */}

<div
  style={{
    display: "flex",
    alignItems: "center",
    gap: 14,
  }}
>
  {/* Wolf Live */}

 <div
  className={`wolf-live ${live.className}`}
  style={{
    display: "flex",
    alignItems: "center",
    gap: 8,

    padding: "8px 14px",

    borderRadius: 999,

    background: live.background,

    color: live.color,

    fontSize: 13,
    fontWeight: 700,
  }}
>
  <span
    className={
      connectionStatus !== "offline"
        ? "wolf-dot-connected"
        : ""
    }
    style={{
      width: 8,
      height: 8,

      borderRadius: "50%",

      background: live.color,

      display: "inline-block",
    }}
  />

  {live.label}
</div>

  {/* Campana */}

 <button
  type="button"
  onClick={onOpenNotifications}
  className={`wolf-bell-button ${
    notificationCount > 0 ? "has-alert" : ""
  } ${ringBell ? "ringing" : ""}`}
  style={{
    position: "relative",

    width: 42,
    height: 42,

    border: "none",
    borderRadius: "50%",

    cursor: "pointer",

    background: "#1A1A1A",

    color: "#F59E0B",

    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  }}
>
  <Bell
    size={20}
    className="wolf-bell-icon"
  />

  {notificationCount > 0 && (
    <span
      style={{
        position: "absolute",

        top: -3,
        right: -3,

        minWidth: 18,
        height: 18,

        padding: "0 5px",

        borderRadius: 999,

        background: "#EF4444",

        color: "#fff",

        fontSize: 10,
        fontWeight: 700,

        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        border: "2px solid #090909",
      }}
    >
      {notificationCount > 99
        ? "99+"
        : notificationCount}
    </span>
  )}
</button>

  {/* Refrescar */}

  <button
    type="button"
    onClick={onRefresh}
    className="wolf-refresh-button"
    style={{
      width: 42,
      height: 42,

      borderRadius: "50%",

      border: "none",

      cursor: "pointer",

      background:
        "linear-gradient(135deg,#F97316,#EA580C)",

      color: "#fff",

      display: "flex",
      alignItems: "center",
      justifyContent: "center",

      boxShadow:
        "0 8px 18px rgba(249,115,22,.28)",
    }}
  >
    <RefreshCw
      size={19}
      className={
        refreshing
          ? "wolf-refresh-icon is-spinning"
          : ""
      }
    />
  </button>
</div>
</section>
);
}