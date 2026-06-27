"use client";

import { motion } from "framer-motion";
import {
  getEstimatedTime,
} from "@/lib/order-time";

interface Props {
  selected:
    | "delivery"
    | "pickup"
    | null;

  onSelect: (
    type:
      | "delivery"
      | "pickup"
  ) => void;

  deliveryEnabled?: boolean;

  pickupEnabled?: boolean;

  deliverySettings?: any;

  primaryColor?: string;
}

export default function OrderType({
  selected,
  onSelect,
  deliveryEnabled = true,
  pickupEnabled = true,
  deliverySettings,
  primaryColor = "#f97316",
}: Props) {

const estimatedTime =
  getEstimatedTime(
    deliverySettings
  );

  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(320px,1fr))",
        gap: "30px",
      }}
    >
      {deliveryEnabled && (
        <motion.div
          whileHover={{
            y: -10,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() =>
            onSelect("delivery")
          }
          style={{
            cursor: "pointer",
            padding: "40px",
            borderRadius: "30px",
            backdropFilter:
              "blur(20px)",
            background:
              selected ===
              "delivery"
                ? `${primaryColor}20`
                : "rgba(255,255,255,.04)",
            border:
              selected ===
              "delivery"
                ? `2px solid ${primaryColor}`
                : "1px solid rgba(255,255,255,.08)",
            transition: ".3s",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              marginBottom: "20px",
            }}
          >
            🚚
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            Delivery
          </h2>

          <p
            style={{
              color:
                "rgba(255,255,255,.7)",
              lineHeight: 1.7,
            }}
          >
            Recibe tu pedido en la
            puerta de tu casa.
          </p>

          {deliverySettings && (
            <div
              style={{
                marginTop: "20px",
                padding: "18px",
                borderRadius: "18px",
                background:
                  "rgba(255,255,255,.04)",
                border:
                  "1px solid rgba(255,255,255,.08)",
              }}
            >
              <div
                style={{
                  color: "#fff",
                  marginBottom: "10px",
                  fontWeight: "600",
                }}
              >
                📍 Radio:{" "}
                {
                  deliverySettings.delivery_radius_km
                }
                km
              </div>

              <div
                style={{
                  color: "#fff",
                  marginBottom: "10px",
                }}
              >
                🚚 Delivery: $
                {
                  deliverySettings.delivery_fee
                }
              </div>

              {deliverySettings.free_delivery_enabled && (
                <div
                  style={{
                    color:
                      "#22c55e",
                    marginBottom:
                      "10px",
                    fontWeight:
                      "600",
                  }}
                >
                  🎁 Gratis desde $
                  {
                    deliverySettings.free_delivery_minimum
                  }
                </div>
              )}

              <div
  style={{
    color:
      "rgba(255,255,255,.7)",
  }}
>
  ⏱ Tiempo estimado:
  {" "}
  {
    estimatedTime.preparation
  }
  -
  {
    estimatedTime.total
  }
  min
</div>
            </div>
          )}
        </motion.div>
      )}

      {pickupEnabled && (
        <motion.div
          whileHover={{
            y: -10,
            scale: 1.02,
          }}
          whileTap={{
            scale: 0.98,
          }}
          onClick={() =>
            onSelect("pickup")
          }
          style={{
            cursor: "pointer",
            padding: "40px",
            borderRadius: "30px",
            backdropFilter:
              "blur(20px)",
            background:
              selected ===
              "pickup"
                ? `${primaryColor}20`
                : "rgba(255,255,255,.04)",
            border:
              selected ===
              "pickup"
                ? `2px solid ${primaryColor}`
                : "1px solid rgba(255,255,255,.08)",
            transition: ".3s",
          }}
        >
          <div
            style={{
              fontSize: "64px",
              marginBottom: "20px",
            }}
          >
            🛍️
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "32px",
              fontWeight: "700",
              marginBottom: "10px",
            }}
          >
            Pickup
          </h2>

          <p
            style={{
              color:
                "rgba(255,255,255,.7)",
              lineHeight: 1.7,
            }}
          >
            Retira tu pedido
            directamente en el local.
          </p>
        </motion.div>
      )}
    </div>
  );
}