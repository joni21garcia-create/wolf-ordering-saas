"use client";

import {
  Bell,
  Wifi,
  WifiOff,
  Store,
} from "lucide-react";

import {
  cardStyle,
  colors,
} from "./styles";

import type {
  Restaurant,
} from "./types";

interface Props {
  restaurant: Restaurant;
  connected: boolean;
}

export default function OperationsHeader({
  restaurant,
  connected,
}: Props) {
  return (
    <section
      style={{
        ...cardStyle,
        padding: 24,
        marginBottom: 24,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        {/* Restaurante */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
          }}
        >
          <div
            style={{
              width: 68,
              height: 68,
              borderRadius: 20,
              overflow: "hidden",
              background: "#181818",
              border:
                "1px solid rgba(255,255,255,.08)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
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
                size={30}
                color="#777"
              />
            )}
          </div>

          <div>
            <div
              style={{
                fontSize: 13,
                color:
                  colors.textSecondary,
                marginBottom: 6,
              }}
            >
              Centro de Operaciones
            </div>

            <h1
              style={{
                margin: 0,
                fontSize: 30,
                fontWeight: 800,
              }}
            >
              {restaurant.name}
            </h1>

            <div
              style={{
                marginTop: 6,
                color:
                  colors.textSecondary,
                fontSize: 14,
              }}
            >
              /{restaurant.slug}
            </div>
          </div>
        </div>

        {/* Estado */}

        <div
          style={{
            display: "flex",
            gap: 12,
            alignItems: "center",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding:
                "10px 16px",
              borderRadius: 999,
              background:
                connected
                  ? "rgba(34,197,94,.12)"
                  : "rgba(239,68,68,.12)",
              color:
                connected
                  ? colors.green
                  : colors.red,
              fontWeight: 700,
            }}
          >
            {connected ? (
              <Wifi size={18} />
            ) : (
              <WifiOff size={18} />
            )}

            {connected
              ? "Tiempo real"
              : "Sin conexión"}
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding:
                "10px 16px",
              borderRadius: 999,
              background:
                "rgba(249,115,22,.12)",
              color:
                colors.orange,
              fontWeight: 700,
            }}
          >
            <Bell size={18} />

            Centro de pedidos
          </div>
        </div>
      </div>
    </section>
  );
}