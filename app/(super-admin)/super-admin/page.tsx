"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

import SuperAdminDashboardClient from "./components/SuperAdminDashboardClient";
import { useSession } from "@/providers/SessionProvider";

export default function SuperAdminPage() {
  const router = useRouter();
  const { user, loading } = useSession();

  useEffect(() => {
    if (loading) return;

    if (!user) {
      router.replace("/login");
      return;
    }

    if (user.role.code !== "super-user") {
      router.replace(`/super-admin/restaurants/${user.restaurant_id}/restaurante/dashboard`);
    }
  }, [loading, user, router]);

  if (loading || !user || user.role.code !== "super-user") {
    return null;
  }

  return <SuperAdminDashboardClient />;
}
