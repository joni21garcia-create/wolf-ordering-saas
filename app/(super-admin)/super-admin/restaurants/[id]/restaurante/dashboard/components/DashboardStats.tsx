"use client";

import DashboardStatCard from "./DashboardStatCard";

type Props = {
  permissions: number; // Recibe el valor ya sincronizado (14) desde el cliente principal
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
      // Cambiado de "Permisos" a "Módulos" para que coincida perfectamente con el valor real (14)
      title: "Módulos", 
      value: permissions.toString(),
      color: "#f97316",
      icon: "🔐",
      subtitle: "Módulos habilitados en tu cuenta",
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
      subtitle: "Todo preparado para operar",
    },
  ];

  return (
    <section
      style={{
        display: "grid",
        // Optimizado: minmax de 220px permite un grid responsivo más limpio en móviles y tablets
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: 16, // Reducido de 22 para compactar el diseño general
        marginBottom: 24, // Reducido de 42 para evitar espacio muerto vertical
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