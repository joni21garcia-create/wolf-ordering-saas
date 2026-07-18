"use client";

import OrderTypeCard from "./OrderTypeCard";
import { styles } from "./order-type.styles";
import { getEstimatedTime } from "@/lib/order-time";

interface Props {
  selected: "delivery" | "pickup" | null;

  onSelect: (
    type: "delivery" | "pickup"
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
  // -----------------------
  // Business Logic
  // -----------------------

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
    subtotal >=
      freeDeliveryMinimum;

  // -----------------------
  // Chips
  // -----------------------

  const deliveryChips =
    isManualDelivery
      ? [
          "📱 WhatsApp",

          `⏱ ${estimatedTime.preparation}-${estimatedTime.total} min`,

          hasFreeDelivery
            ? `🎁 Gratis $${freeDeliveryMinimum}`
            : null,
        ].filter(Boolean) as string[]
      : [
          `⏱ ${estimatedTime.preparation}-${estimatedTime.total} min`,

          `📍 ${deliverySettings?.delivery_radius_km} km`,

          hasFreeDelivery
            ? `🎁 Gratis $${freeDeliveryMinimum}`
            : `🚚 $${deliverySettings?.delivery_fee}`,
        ];

  const pickupChips = [
    "⏱ 20 min",
    "🏪 En local",
  ];

  // -----------------------
  // Footer
  // -----------------------

  const deliveryFooter =
    selected === "delivery"
      ? "✔ Seleccionado"
      : "Tocar para elegir";

  const pickupFooter =
    selected === "pickup"
      ? "✔ Seleccionado"
      : "Tocar para elegir";

  // -----------------------
  // Render
  // -----------------------

  return (
    <div style={styles.container}>
      <div>
        <h2 style={styles.title}>
          🚚 Cómo deseas recibir tu pedido
        </h2>

        <p style={styles.subtitle}>
          Selecciona una opción
        </p>
      </div>

      <div style={styles.grid}>
        {deliveryEnabled && (
          <OrderTypeCard
            title="Delivery"
            icon="🚚"
            selected={
              selected ===
              "delivery"
            }
            primaryColor={
              primaryColor
            }
            chips={deliveryChips}
            footer={
              deliveryFooter
            }
            onClick={() =>
              onSelect(
                "delivery"
              )
            }
          />
        )}

        {pickupEnabled && (
          <OrderTypeCard
            title="Pickup"
            icon="🛍️"
            selected={
              selected ===
              "pickup"
            }
            primaryColor={
              primaryColor
            }
            chips={pickupChips}
            footer={
              pickupFooter
            }
            onClick={() =>
              onSelect(
                "pickup"
              )
            }
          />
        )}
      </div>
    </div>
  );
}