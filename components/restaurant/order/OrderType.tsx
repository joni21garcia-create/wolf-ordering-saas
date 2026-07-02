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
        gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", // Aún más compacto
        gap: "12px",
      }}
    >
      {deliveryEnabled && (
        <motion.div
          whileHover={{ y: -2, scale: 1.005 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("delivery")}
          style={{
            cursor: "pointer",
            padding: "16px", // Reducido para compactar
            borderRadius: "16px", // Radio menor para un look más moderno/compacto
            backdropFilter: "blur(20px)",
            background: selected === "delivery" ? `${primaryColor}20` : "rgba(255,255,255,.03)",
            border: selected === "delivery" ? `1.5px solid ${primaryColor}` : "1px solid rgba(255,255,255,.06)",
            transition: ".3s",
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🚚</div>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
            Delivery
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: "12px", marginBottom: "8px" }}>
            Recibe en casa.
          </p>

          {deliverySettings && (
            <div style={{ padding: "8px", borderRadius: "10px", background: "rgba(255,255,255,.02)", fontSize: "11px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", color: "#aaa" }}>
                <span>Fee: ${deliverySettings.delivery_fee}</span>
                <span>{estimatedTime.total} min</span>
              </div>
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
            padding: "16px",
            borderRadius: "16px",
            backdropFilter: "blur(20px)",
            background: selected === "pickup" ? `${primaryColor}20` : "rgba(255,255,255,.03)",
            border: selected === "pickup" ? `1.5px solid ${primaryColor}` : "1px solid rgba(255,255,255,.06)",
            transition: ".3s",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center"
          }}
        >
          <div style={{ fontSize: "24px", marginBottom: "8px" }}>🛍️</div>
          <h2 style={{ color: "#fff", fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
            Pickup
          </h2>
          <p style={{ color: "rgba(255,255,255,.6)", fontSize: "12px" }}>
            Retira en local.
          </p>
        </motion.div>
      )}
    </div>
  );
}