"use client";

import { useParams } from "next/navigation";
import RestaurantView from "./components/RestaurantView";

export default function RestaurantPage() {
  const params = useParams();

  const restaurantId = params.restaurantId as string;

  return (
    <RestaurantView
      restaurantId={restaurantId}
    />
  );
}