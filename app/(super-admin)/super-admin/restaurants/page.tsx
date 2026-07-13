import PermissionGuard from "@/components/auth/PermissionGuard";

import RestaurantsPageClient from "./components/RestaurantsPageClient";

export default function RestaurantsPage() {
  return (
    <PermissionGuard permission="restaurants">
      <RestaurantsPageClient />
    </PermissionGuard>
  );
}