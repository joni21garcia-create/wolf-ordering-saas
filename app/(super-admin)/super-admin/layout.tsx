"use client";

import type { ReactNode } from "react";
import { useSession } from "@/providers/SessionProvider";
import RestaurantShell from "@/components/navigation/RestaurantShell";

export default function RestaurantContextLayout({
  children,
}: {
  children: ReactNode;
}) {
  const { user, loading } = useSession();

  if (loading) return null;

  // The platform administrator keeps the Super Admin UI untouched.
  if (user?.role?.code === "super-user") {
    return <>{children}</>;
  }

  // Restaurant users get only the restaurant shell, even when a legacy
  // restaurant-context URL lives under /super-admin/restaurants/[id].
  return <RestaurantShell>{children}</RestaurantShell>;
}