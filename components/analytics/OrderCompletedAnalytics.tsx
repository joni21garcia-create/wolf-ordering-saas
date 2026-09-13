"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/analytics";

interface Props {
  restaurantId: string;
  restaurantSlug: string;
  restaurantName: string;
  orderId: string;
  orderType?: string | null;
  paymentMethod?: string | null;
  value?: number | null;
  currency?: string;
}

export default function OrderCompletedAnalytics({
  restaurantId,
  restaurantSlug,
  restaurantName,
  orderId,
  orderType,
  paymentMethod,
  value,
  currency = "USD",
}: Props) {
  useEffect(() => {
    trackOnce(
      `wolf:order_completed:${orderId}`,
      "order_completed",
      {
        restaurant_id: restaurantId,
        restaurant_slug: restaurantSlug,
        restaurant_name: restaurantName,
        order_id: orderId,
        order_type: orderType,
        payment_method: paymentMethod,
        value: value ?? undefined,
        currency,
      },
    );
  }, [
    restaurantId,
    restaurantSlug,
    restaurantName,
    orderId,
    orderType,
    paymentMethod,
    value,
    currency,
  ]);

  return null;
}
