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
  // Mantenemos la lógica de obtención de tiempo tal cual
  const estimatedTime = getEstimatedTime(deliverySettings);

  return (
    <div
      style={{
        display: "grid",
        // Blindaje: minmax de 280px garantiza que no se desborde en móviles
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
      }}
    >
      {deliveryEnabled && (
        <motion.div
          whileHover={{ y: -5, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("delivery")}
          style={{
            cursor: "pointer",
            padding: "30px",
            borderRadius: "24px",
            backdropFilter: "blur(20px)",
            background: selected === "delivery" ? `${primaryColor}20` : "rgba(255,255,255,.04)",
            border: selected === "delivery" ? `2px solid ${primaryColor}` : "1px solid rgba(255,255,255,.08)",
            transition: ".3s",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>🚚</div>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
            Delivery
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.6, marginBottom: "20px" }}>
            Recibe tu pedido en la puerta de tu casa.
          </p>

          {deliverySettings && (
            <div style={{ padding: "16px", borderRadius: "16px", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)" }}>
              <div style={{ color: "#fff", fontSize: "14px", marginBottom: "6px" }}>📍 Radio: {deliverySettings?.delivery_radius_km} km</div>
              <div style={{ color: "#fff", fontSize: "14px", marginBottom: "6px" }}>🚚 Delivery: ${deliverySettings?.delivery_fee}</div>
              {deliverySettings?.free_delivery_enabled && (
                <div style={{ color: "#22c55e", fontSize: "14px", marginBottom: "6px", fontWeight: "600" }}>
                  🎁 Gratis desde ${deliverySettings?.free_delivery_minimum}
                </div>
              )}
              <div style={{ color: "rgba(255,255,255,.7)", fontSize: "14px" }}>
                ⏱ Tiempo: {estimatedTime?.preparation} - {estimatedTime?.total} min
              </div>
            </div>
          )}
        </motion.div>
      )}

      {pickupEnabled && (
        <motion.div
          whileHover={{ y: -5, scale: 1.01 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelect("pickup")}
          style={{
            cursor: "pointer",
            padding: "30px",
            borderRadius: "24px",
            backdropFilter: "blur(20px)",
            background: selected === "pickup" ? `${primaryColor}20` : "rgba(255,255,255,.04)",
            border: selected === "pickup" ? `2px solid ${primaryColor}` : "1px solid rgba(255,255,255,.08)",
            transition: ".3s",
          }}
        >
          <div style={{ fontSize: "48px", marginBottom: "15px" }}>🛍️</div>
          <h2 style={{ color: "#fff", fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>
            Pickup
          </h2>
          <p style={{ color: "rgba(255,255,255,.7)", lineHeight: 1.6 }}>
            Retira tu pedido directamente en el local.
          </p>
        </motion.div>
      )}
    </div>
  );
}