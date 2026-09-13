"use client";

import { useEffect } from "react";
import { trackOnce, trackEvent } from "@/lib/analytics";

interface Props {
  restaurantId: string;
  restaurantSlug: string;
  restaurantName: string;
  reservationId?: string | null;
  guests?: number | null;
  reservationDate?: string | null;
}

export default function ReservationAnalytics({
  restaurantId,
  restaurantSlug,
  restaurantName,
  reservationId,
  guests,
  reservationDate,
}: Props) {
  useEffect(() => {
    trackOnce(
      `wolf:reservation_started:${restaurantSlug}`,
      "reservation_started",
      {
        restaurant_id: restaurantId,
        restaurant_slug: restaurantSlug,
        restaurant_name: restaurantName,
      },
    );
  }, [restaurantId, restaurantSlug, restaurantName]);

  useEffect(() => {
    if (!reservationId) return;

    trackEvent("reservation_completed", {
      restaurant_id: restaurantId,
      restaurant_slug: restaurantSlug,
      restaurant_name: restaurantName,
      reservation_id: reservationId,
      guests: guests ?? undefined,
      reservation_date: reservationDate ?? undefined,
    });
  }, [
    restaurantId,
    restaurantSlug,
    restaurantName,
    reservationId,
    guests,
    reservationDate,
  ]);

  return null;
}
