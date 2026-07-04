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
    <div style={{ width: "100%", marginBottom: "30px", boxSizing: "border-box" }}>
      {/* ESTILOS DE RESPONSIVIDAD PARA EVITAR EL COLAPSO EN PANTAILLAS PEQUEÑAS */}
      <style>{`
        .wolf-ordertype-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 20px;
          width: 100%;
        }
        .wolf-ordertype-card {
          cursor: pointer;
          padding: 24px;
          border-radius: 24px;
          backdrop-filter: blur(20px);
          transition: border-color 0.3s ease, background-color 0.3s ease;
          box-sizing: border-box;
          width: 100%;
        }
        @media (min-width: 640px) {
          .wolf-ordertype-grid {
            gap: 30px;
          }
          .wolf-ordertype-card {
            padding: 40px;
            border-radius: 30px;
          }
        }
      `}</style>

      <div className="wolf-ordertype-grid">
        {deliveryEnabled && (
          <motion.div
            whileHover={{
              y: -5,
              scale: 1.01,
            }}
            whileTap={{
              scale: 0.99,
            }}
            onClick={() => onSelect("delivery")}
            className="wolf-ordertype-card"
            style={{
              background:
                selected === "delivery"
                  ? `${primaryColor}15`
                  : "rgba(255,255,255,.03)",
              border:
                selected === "delivery"
                  ? `2px solid ${primaryColor}`
                  : "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div
              style={{
                fontSize: "clamp(48px, 8vw, 64px)",
                marginBottom: "16px",
                lineHeight: 1
              }}
            >
              🚚
            </div>

            <h2
              style={{
                color: "#fff",
                fontSize: "clamp(24px, 5vw, 32px)",
                fontWeight: "800",
                marginBottom: "8px",
                margin: 0,
                letterSpacing: "-0.5px"
              }}
            >
              Delivery
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,.65)",
                lineHeight: 1.6,
                fontSize: "14px",
                marginTop: "8px",
                marginBottom: 0
              }}
            >
              Recibe tu pedido en la puerta de tu casa.
            </p>

            {deliverySettings && (
              <div
                style={{
                  marginTop: "20px",
                  padding: "16px",
                  borderRadius: "16px",
                  background: "rgba(0,0,0,.2)",
                  border: "1px solid rgba(255,255,255,.04)",
                }}
              >
                {isManualDelivery ? (
                  <div
                    style={{
                      padding: "12px",
                      borderRadius: "12px",
                      background: "rgba(249,115,22,.06)",
                      border: "1px solid rgba(249,115,22,.15)",
                      marginBottom: "12px",
                    }}
                  >
                    <div
                      style={{
                        color: "#f97316",
                        fontWeight: "700",
                        marginBottom: "6px",
                        fontSize: "14px"
                      }}
                    >
                      🚚 Delivery Manual
                    </div>

                    <div
                      style={{
                        color: "#f5f5f5",
                        lineHeight: "1.6",
                        fontSize: "13px",
                      }}
                    >
                      {qualifiesForFreeDelivery ? (
                        <>
                          🎉 Tu pedido ya califica para <strong>ENVÍO GRATIS</strong>.
                          <br /><br />
                          Solo comparte tu ubicación por WhatsApp para coordinar la entrega.
                        </>
                      ) : (
                        <>
                          El costo del envío será calculado después de que compartas tu ubicación por WhatsApp.
                          {hasFreeDelivery && (
                            <>
                              <br /><br />
                              <span style={{ color: "#4ade80", fontWeight: "700" }}>
                                🎁 Envío GRATIS desde ${freeDeliveryMinimum}
                              </span>
                            </>
                          )}
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: "13px", lineHeight: "1.6", marginBottom: "12px" }}>
                    <div style={{ color: "#fff", marginBottom: "4px", fontWeight: "600" }}>
                      📍 Radio: {deliverySettings.delivery_radius_km} km
                    </div>

                    <div style={{ color: "#fff", marginBottom: "4px" }}>
                      🚚 Delivery: ${deliverySettings.delivery_fee}
                    </div>

                    {deliverySettings.free_delivery_enabled && (
                      <div style={{ color: "#4ade80", marginBottom: "4px", fontWeight: "600" }}>
                        🎁 Gratis desde ${deliverySettings.free_delivery_minimum}
                      </div>
                    )}
                  </div>
                )}

                <div
                  style={{
                    color: "rgba(255,255,255,.5)",
                    fontSize: "12px",
                    borderTop: "1px solid rgba(255,255,255,.06)",
                    paddingTop: "10px"
                  }}
                >
                  ⏱ Tiempo estimado: {estimatedTime.preparation} - {estimatedTime.total} min
                </div>
              </div>
            )}
          </motion.div>
        )}

        {pickupEnabled && (
          <motion.div
            whileHover={{
              y: -5,
              scale: 1.01,
            }}
            whileTap={{
              scale: 0.99,
            }}
            onClick={() => onSelect("pickup")}
            className="wolf-ordertype-card"
            style={{
              background:
                selected === "pickup"
                  ? `${primaryColor}15`
                  : "rgba(255,255,255,.03)",
              border:
                selected === "pickup"
                  ? `2px solid ${primaryColor}`
                  : "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div
              style={{
                fontSize: "clamp(48px, 8vw, 64px)",
                marginBottom: "16px",
                lineHeight: 1
              }}
            >
              🛍️
            </div>

            <h2
              style={{
                color: "#fff",
                fontSize: "clamp(24px, 5vw, 32px)",
                fontWeight: "800",
                marginBottom: "8px",
                margin: 0,
                letterSpacing: "-0.5px"
              }}
            >
              Pickup
            </h2>

            <p
              style={{
                color: "rgba(255,255,255,.65)",
                lineHeight: 1.6,
                fontSize: "14px",
                marginTop: "8px",
                marginBottom: 0
              }}
            >
              Retira tu pedido directamente en el local de forma rápida.
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}