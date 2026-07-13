"use client";

import DashboardStatCard from "./DashboardStatCard";

type Props = {
  permissions: number;
};

export default function DashboardStats({
  permissions,
}: Props) {
  const stats = [
    {
      title: "Sistema",
      value: "Online",
      color: "#22c55e",
      icon: "🟢",
      subtitle: "Todos los servicios operativos",
    },
    {
      title: "Permisos",
      value: permissions.toString(),
      color: "#f97316",
      icon: "🔐",
      subtitle: "Módulos habilitados",
    },
    {
      title: "Sesión",
      value: "Activa",
      color: "#3b82f6",
      icon: "👤",
      subtitle: "Usuario autenticado",
    },
    {
      title: "Estado",
      value: "Listo",
      color: "#8b5cf6",
      icon: "⚡",
      subtitle: "Todo preparado",
    },
  ];

  return (
    <section
      style={{
        display: "grid",

        gridTemplateColumns:
          "repeat(auto-fit,minmax(250px,1fr))",

        gap: 22,

        marginBottom: 42,
      }}
    >
      {stats.map((item) => (
        <DashboardStatCard
          key={item.title}
          title={item.title}
          value={item.value}
          subtitle={item.subtitle}
          color={item.color}
          icon={item.icon}
        />
      ))}
    </section>
  );
}