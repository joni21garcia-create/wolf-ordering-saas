"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/providers/SessionProvider";

import SuperHero from "./SuperHero";
import ExecutiveStats from "./ExecutiveStats";
import ExecutiveCenter from "./ExecutiveCenter";
import QuickOverview from "./QuickOverview";
import PlatformStatus from "./PlatformStatus";
import PlatformActivity from "./PlatformActivity";

import { dashboardModules } from "../config/modules";

interface DashboardStats {
  restaurants: number;
  users: number;
  legal: number;
  liquidations: number;
}

export default function SuperAdminDashboardClient() {
  const { user } = useSession();
  const permissions = user?.permissions ?? [];

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    restaurants: 0,
    users: 0,
    legal: 0,
    liquidations: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [
        restaurants,
        users,
        legal,
        liquidations,
      ] = await Promise.all([
        supabase
          .from("restaurants")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("restaurant_users")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("restaurant_legal_acceptance")
          .select("id", {
            count: "exact",
            head: true,
          }),

        supabase
          .from("liquidations")
          .select("id", {
            count: "exact",
            head: true,
          }),
      ]);

      setStats({
        restaurants: restaurants.count ?? 0,
        users: users.count ?? 0,
        legal: legal.count ?? 0,
        liquidations: liquidations.count ?? 0,
      });
    } catch (error) {
      console.error("Dashboard Error", error);
    } finally {
      setLoading(false);
    }
  }

  // Filtrado optimizado de módulos
  const allowedModules = useMemo(
    () =>
      dashboardModules.filter((module) =>
        permissions.includes(module.code)
      ),
    [permissions]
  );

  const operationModules = useMemo(
    () =>
      allowedModules.filter(
        (module) => module.category === "operation"
      ),
    [allowedModules]
  );

  const settingsModules = useMemo(
    () =>
      allowedModules.filter(
        (module) => module.category === "settings"
      ),
    [allowedModules]
  );

  return (
    <main
      style={{
        maxWidth: 1400,
        margin: "0 auto",
        minHeight: "100vh",
        padding: "24px 20px",
        color: "#fff",
        display: "flex",
        flexDirection: "column",
        gap: 32,
      }}
    >
      <SuperHero
        user={{
          full_name: user?.full_name,
          role: user?.role,
        }}
        stats={{
          restaurants: stats.restaurants,
          users: stats.users,
          legal: stats.legal,
        }}
      />

      <ExecutiveStats
        permissions={allowedModules.length}
        restaurants={stats.restaurants}
        users={stats.users}
        legal={stats.legal}
        liquidations={stats.liquidations}
        loading={loading}
      />

      <ExecutiveCenter
        operationModules={operationModules}
        settingsModules={settingsModules}
      />

      <QuickOverview
       stats={stats}
       totalModules={permissions.length}
       />

      <PlatformStatus stats={stats} />

      <PlatformActivity stats={stats} />
    </main>
  );
}