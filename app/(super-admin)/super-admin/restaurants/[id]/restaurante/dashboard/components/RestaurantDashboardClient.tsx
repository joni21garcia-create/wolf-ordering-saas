"use client";

import { useSession } from "@/providers/SessionProvider";

import DashboardHero from "./DashboardHero";
import DashboardStats from "./DashboardStats";
import OperationalCenter from "./OperationalCenter";
import SystemStatus from "./SystemStatus";
import RecentActivity from "./RecentActivity";

import { dashboardModules } from "../config/modules";

export default function RestaurantDashboardClient() {
  const { user } = useSession();

  const restaurantId = user?.restaurant_id ?? "";

  const permissions = user?.permissions ?? [];

  /**
   * Módulos permitidos para el usuario
   * según los permisos entregados por
   * SessionProvider.
   */
  const allowedModules = dashboardModules
    .filter((module) => permissions.includes(module.code))
    .map((module) => ({
      ...module,
      href: module.href(restaurantId),
    }));

  /**
   * Centro Operativo
   */
  const operationModules = allowedModules.filter(
    (module) => module.category === "operation"
  );

  /**
   * Configuración
   */
  const settingsModules = allowedModules.filter(
    (module) => module.category === "settings"
  );

  const activities = [
    {
      id: "1",
      title: "Dashboard listo",
      description:
        "Los módulos fueron cargados según los permisos asignados al usuario.",
      time: "Ahora",
    },
  ];

  return (
    <main
      style={{
        maxWidth: 1700,
        margin: "0 auto",
        minHeight: "100vh",
        padding: "clamp(20px,4vw,42px)",
        color: "#fff",
      }}
    >
      <DashboardHero
        user={{
          full_name: user?.full_name,
          role: user?.role,
          permissions: permissions,
        }}
      />

      <DashboardStats
        permissions={permissions.length}
      />

      <OperationalCenter
        operationModules={operationModules}
        settingsModules={settingsModules}
      />

      <SystemStatus
        permissionsLoaded={permissions.length > 0}
      />

      <RecentActivity
        activities={activities}
      />
    </main>
  );
}