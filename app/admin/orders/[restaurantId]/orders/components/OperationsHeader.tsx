"use client";

import "./orders-animations.css";

import {
  Bell,
  RefreshCw,
} from "lucide-react";

import {
  WolfAvatar,
  WolfBadge,
  WolfButton,
} from "@/lib/wolf-ui";

import {
  WolfFlex,
  WolfSpacer,
  WolfStack,
} from "@/lib/wolf-ui/layout";

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

  const liveConfig = {
    online: {
      label: "Wolf Live",
      color: "#22C55E",
      background: "rgba(34,197,94,.12)",
    },

    syncing: {
      label: "Sincronizando",
      color: "#3B82F6",
      background: "rgba(59,130,246,.12)",
    },

    reconnecting: {
      label: "Reconectando",
      color: "#F59E0B",
      background: "rgba(245,158,11,.12)",
    },

    offline: {
      label: "Sin conexión",
      color: "#EF4444",
      background: "rgba(239,68,68,.12)",
    },
  } as const;

  const live =
    liveConfig[connectionStatus];

  return (

    <section
      style={{
        marginBottom: 34,
      }}
    >

      <WolfFlex
        justify="between"
        align="center"
        wrap
        gap="xl"
      >

        {/* Restaurante */}

        <WolfFlex
          align="center"
          gap="lg"
        >

          <WolfAvatar
            size={72}
            src={
              restaurant.logo_url ??
              undefined
            }
            fallback={
              restaurant.name
            }
            shadow
          />

          <WolfStack spacing="xs">

            <h1
              style={{
                margin: 0,
                fontSize: 34,
                fontWeight: 900,
                lineHeight: 1,
                letterSpacing:
                  "-.04em",
                color: "#FFF",
              }}
            >
              {restaurant.name}
            </h1>

            <div
              style={{
                color: "#A1A1AA",
                fontSize: 15,
                fontWeight: 600,
              }}
            >
              Panel de operaciones
            </div>

            <div
              style={{
                color: "#71717A",
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              /{restaurant.slug}
            </div>

          </WolfStack>

        </WolfFlex>

        <WolfSpacer />

        <WolfFlex
          align="center"
          gap="md"
        >

                 <WolfBadge
            variant={
              connectionStatus === "online"
                ? "success"
                : connectionStatus === "syncing"
                ? "info"
                : connectionStatus ===
                  "reconnecting"
                ? "warning"
                : "danger"
            }
          >
            <span
              className={
                connectionStatus !==
                "offline"
                  ? "wolf-dot-connected"
                  : ""
              }
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: live.color,
                display: "inline-block",
                marginRight: 6,
              }}
            />

            {live.label}
          </WolfBadge>

          <div
            style={{
              position: "relative",
            }}
          >
            <WolfButton
              variant="secondary"
              size="md"
              onClick={
                onOpenNotifications
              }
              leftIcon={
                <Bell size={18} />
              }
            />

            {notificationCount >
              0 && (
              <div
                style={{
                  position:
                    "absolute",

                  top: -5,

                  right: -5,

                  minWidth: 20,

                  height: 20,

                  borderRadius: 999,

                  background:
                    "#EF4444",

                  color: "#fff",

                  display: "flex",

                  alignItems:
                    "center",

                  justifyContent:
                    "center",

                  fontSize: 10,

                  fontWeight: 800,

                  padding:
                    "0 6px",

                  pointerEvents:
                    "none",

                  boxShadow:
                    "0 8px 18px rgba(239,68,68,.28)",
                }}
              >
                {notificationCount >
                99
                  ? "99+"
                  : notificationCount}
              </div>
            )}
          </div>

          <WolfButton
            variant="primary"
            size="md"
            loading={refreshing}
            leftIcon={
              <RefreshCw
                size={18}
              />
            }
            onClick={onRefresh}
          >
            Actualizar
          </WolfButton>

        </WolfFlex>

      </WolfFlex>

    </section>

  );

}
