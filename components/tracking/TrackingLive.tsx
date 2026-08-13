"use client";

import {
  useCallback,
  useState,
} from "react";

import TrackingRealtime, {
  type TrackingOrderUpdate,
} from "@/components/tracking/TrackingRealtime";

import TrackingInfo from "@/components/tracking/TrackingInfo";
import TrackingStatus from "@/components/tracking/TrackingStatus";

interface Props {
  initialOrder: Record<string, any>;
  restaurantSlug?: string;
  deliverySettings: Record<string, any> | null;
}

export default function TrackingLive({
  initialOrder,
  restaurantSlug,
  deliverySettings,
}: Props) {
  const [order, setOrder] =
    useState(initialOrder);

  const [connected, setConnected] =
    useState(false);

  const handleOrderUpdate = useCallback(
    (nextOrder: TrackingOrderUpdate) => {
      setOrder((current) => ({
        ...current,
        ...nextOrder,
      }));
    },
    []
  );

  return (
    <>
      <TrackingRealtime
        orderId={String(order.id)}
        onOrderUpdate={handleOrderUpdate}
        onConnectionChange={setConnected}
      />

      <div
        aria-live="polite"
        style={{
          display: "flex",
          justifyContent: "center",
          minHeight: 22,
          marginBottom: 8,
        }}
      >
        {connected && (
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              color:
                "rgba(255,255,255,.38)",
              fontSize: 10,
              fontWeight: 650,
              letterSpacing: ".01em",
            }}
          >
            <span
              aria-hidden="true"
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#22c55e",
                boxShadow:
                  "0 0 0 4px rgba(34,197,94,.08)",
              }}
            />
            Actualizado en tiempo real
          </span>
        )}
      </div>

      <TrackingInfo
        order={order}
        restaurantSlug={restaurantSlug}
        deliverySettings={deliverySettings}
      />

      <TrackingStatus
        order={order}
      />
    </>
  );
}