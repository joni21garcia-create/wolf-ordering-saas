"use client";

import { motion } from "framer-motion";
import { getEstimatedTime } from "@/lib/order-time";

interface Props {
  selected: "delivery" | "pickup" | null;
  onSelect: (type: "delivery" | "pickup") => void;
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
  const estimatedTime = getEstimatedTime(deliverySettings);

  return (
    <div
      style={{
        display: "grid",
        // Ajuste: tarjetas un poco más pequeñas (minmax 220px en lugar de 280px)
        gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
        gap: "16px",
      }}
    >
      {deliveryEnabled && (
        <motion.div
          whileHover={{ y: -2, scale: 1.005 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("delivery")}
          style={{
            cursor: "pointer",
            padding: "20px", // Padding ajustado
            borderRadius: "24px",
            backdropFilter: "blur(20px)",
            background: selected === "delivery" ? `${primaryColor}20` : "rgba(255,255,255,.04)",
            border: selected === "delivery" ? `2px solid ${primaryColor}` : "1px solid rgba(255,255,255,.08)",
            transition: ".3s",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🚚</div>
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", marginBottom: "5px" }}>
            Delivery
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: "13px", lineHeight: 1.4 }}>
            Recibe en casa.
          </p>

          {deliverySettings && (
            <div style={{ marginTop: "12px", padding: "10px", borderRadius: "14px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.05)", fontSize: "12px" }}>
              <div style={{ color: "#fff", marginBottom: "4px" }}>📍 {deliverySettings.delivery_radius_km} km</div>
              <div style={{ color: "#fff" }}>🚚 ${deliverySettings.delivery_fee}</div>
              <div style={{ color: "rgba(255,255,255,.6)" }}>⏱ {estimatedTime.preparation} - {estimatedTime.total} min</div>
            </div>
          )}
        </motion.div>
      )}

      {pickupEnabled && (
        <motion.div
          whileHover={{ y: -2, scale: 1.005 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("pickup")}
          style={{
            cursor: "pointer",
            padding: "20px",
            borderRadius: "24px",
            backdropFilter: "blur(20px)",
            background: selected === "pickup" ? `${primaryColor}20` : "rgba(255,255,255,.04)",
            border: selected === "pickup" ? `2px solid ${primaryColor}` : "1px solid rgba(255,255,255,.08)",
            transition: ".3s",
          }}
        >
          <div style={{ fontSize: "32px", marginBottom: "10px" }}>🛍️</div>
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "700", marginBottom: "5px" }}>
            Pickup
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", fontSize: "13px", lineHeight: 1.4 }}>
            Retira en local.
          </p>
        </motion.div>
      )}
    </div>
  );
}