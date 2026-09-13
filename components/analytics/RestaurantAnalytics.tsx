"use client";

import { useEffect } from "react";
import { trackOnce } from "@/lib/analytics";

interface Props {
  restaurantId: string;
  restaurantSlug: string;
  restaurantName: string;
}

export default function RestaurantAnalytics({
  restaurantId,
  restaurantSlug,
  restaurantName,
}: Props) {
  useEffect(() => {
    trackOnce(
      `wolf:restaurant_view:${restaurantSlug}`,
      "restaurant_view",
      {
        restaurant_id: restaurantId,
        restaurant_slug: restaurantSlug,
        restaurant_name: restaurantName,
      },
    );
  }, [restaurantId, restaurantSlug, restaurantName]);

  return null;
}
