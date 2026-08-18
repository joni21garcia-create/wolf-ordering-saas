import type { Metadata } from "next";

import RestaurantRequestsPage from "@/components/super-admin/restaurant-requests/RestaurantRequestsPage";

export const metadata: Metadata = {
  title: "Solicitudes | Restaurante",
  description:
    "Gestiona las solicitudes del restaurante.",
};

export default function RestaurantRequestsSettingsPage() {
  return <RestaurantRequestsPage />;
}