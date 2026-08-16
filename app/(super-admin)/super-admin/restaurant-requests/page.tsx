import { Metadata } from "next";

import RestaurantRequestsPage from "@/components/super-admin/restaurant-requests/RestaurantRequestsPage";

export const metadata: Metadata = {
  title: "Solicitudes de restaurantes | Super Admin",
  description:
    "Gestiona las solicitudes de creación de restaurantes.",
};

export default function RestaurantRequestsRoute() {
  return <RestaurantRequestsPage />;
}