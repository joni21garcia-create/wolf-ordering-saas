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

  subtotal: number;

  primaryColor?: string;
}

export default function OrderType({
  selected,
  onSelect,
  deliveryEnabled = true,
  pickupEnabled = true,
  deliverySettings,
  subtotal,
  primaryColor = "#f97316",
}: Props) {

const estimatedTime =
  getEstimatedTime(
    deliverySettings
  );

  const isManualDelivery =
  deliverySettings?.delivery_mode ===
  "manual";

  const hasFreeDelivery =
  deliverySettings?.free_delivery_enabled;

const freeDeliveryMinimum =
  Number(
    deliverySettings?.free_delivery_minimum
  ) || 0;

  const qualifiesForFreeDelivery =
  hasFreeDelivery &&
  subtotal >= freeDeliveryMinimum;

  return (
    <div
      style={{
        display: "grid",
        // Cambiado a min(100%, 320px) para que en pantallas pequeñas de 320px o menos no desborde
        gridTemplateColumns:
          "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
        gap: "20px", // Reducido ligeramente de 30px a 20px para mejorar compactación en móvil
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
            padding: "clamp(20px, 4vw, 40px)", // Padding fluido responsivo
            borderRadius: "24px", // Reducido de 30px a 24px para mejor estética móvil
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
            boxSizing: "border-box", // Asegura que el padding no rompa el ancho total
          }}
        >
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 64px)", // Tamaño de emoji fluido
              marginBottom: "15px",
            }}
          >
            🚚
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(24px, 4vw, 32px)", // Título fluido
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
              lineHeight: 1.6,
              fontSize: "clamp(14px, 2vw, 15px)",
            }}
          >
            Recibe tu pedido en la
            puerta de tu casa.
          </p>

          {deliverySettings && (
            <div
              style={{
                marginTop: "20px",
                padding: "clamp(14px, 3vw, 18px)", // Padding interno fluido
                borderRadius: "18px",
                background:
                  "rgba(255,255,255,.04)",
                border:
                  "1px solid rgba(255,255,255,.08)",
                boxSizing: "border-box",
              }}
            >
  {isManualDelivery ? (

  <div
    style={{
      padding: "12px",
      borderRadius: "14px",
      background: "rgba(249,115,22,.08)",
      border: "1px solid rgba(249,115,22,.2)",
      marginBottom: "14px",
      boxSizing: "border-box",
    }}
  >
    <div
      style={{
        color: "#f97316",
        fontWeight: "700",
        marginBottom: "10px",
        fontSize: "14px",
      }}
    >
      🚚 Delivery Manual
    </div>

 <div
  style={{
    color: "#fff",
    lineHeight: "1.7",
    fontSize: "14px",
  }}
>
  {qualifiesForFreeDelivery ? (
    <>
      🎉 Tu pedido ya califica para
      <br />
      <strong>
        ENVÍO GRATIS
      </strong>
      <br />
      <br />
      Solo comparte tu ubicación por
      WhatsApp para coordinar la entrega.
    </>
  ) : (
    <>
      El costo del envío será calculado
      después de que compartas tu ubicación
      por WhatsApp.
      {hasFreeDelivery && (
        <>
          <br />
          <br />
          <span
            style={{
              color: "#22c55e",
              fontWeight: "700",
            }}
          >
            🎁 Envío GRATIS desde $
            {freeDeliveryMinimum}
          </span>
        </>
      )}
    </>
  )}
</div>

  </div>

) : (

  <>
    <div
      style={{
        color: "#fff",
        marginBottom: "10px",
        fontWeight: "600",
        fontSize: "14px",
      }}
    >
      📍 Radio:{" "}
      {deliverySettings.delivery_radius_km}
      km
    </div>

    <div
      style={{
        color: "#fff",
        marginBottom: "10px",
        fontSize: "14px",
      }}
    >
      🚚 Delivery: $
      {deliverySettings.delivery_fee}
    </div>

    {deliverySettings.free_delivery_enabled && (
      <div
        style={{
          color: "#22c55e",
          marginBottom: "10px",
          fontWeight: "600",
          fontSize: "14px",
        }}
      >
        🎁 Gratis desde $
        {deliverySettings.free_delivery_minimum}
      </div>
    )}
  </>

)}

              <div
  style={{
    color:
      "rgba(255,255,255,.7)",
    fontSize: "14px",
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
            padding: "clamp(20px, 4vw, 40px)", // Padding fluido responsivo
            borderRadius: "24px",
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
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              fontSize: "clamp(48px, 8vw, 64px)", // Tamaño de emoji fluido
              marginBottom: "15px",
            }}
          >
            🛍️
          </div>

          <h2
            style={{
              color: "#fff",
              fontSize: "clamp(24px, 4vw, 32px)",
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
              lineHeight: 1.6,
              fontSize: "clamp(14px, 2vw, 15px)",
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