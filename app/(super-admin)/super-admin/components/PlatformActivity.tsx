"use client";

import {
  Building2,
  Users,
  Scale,
  Rocket,
  ShieldCheck,
} from "lucide-react";

import PlatformActivityItem from "./PlatformActivityItem";

const activities = [
  {
    title: "Nuevo restaurante registrado",
    description:
      "Un restaurante fue creado y quedó listo para iniciar su proceso de configuración.",
    time: "Hace unos minutos",
    color: "#f97316",
    icon: <Building2 />,
  },
  {
    title: "Nuevo usuario del sistema",
    description:
      "Se registró un nuevo usuario administrativo dentro de la plataforma.",
    time: "Hoy",
    color: "#3b82f6",
    icon: <Users />,
  },
  {
    title: "Documento legal actualizado",
    description:
      "Se publicó una nueva versión de un documento del Centro Legal.",
    time: "Hoy",
    color: "#22c55e",
    icon: <Scale />,
  },
  {
    title: "Nueva versión desplegada",
    description:
      "Wolf Ordering SaaS fue actualizado correctamente sin afectar la operación.",
    time: "Producción",
    color: "#8b5cf6",
    icon: <Rocket />,
  },
  {
    title: "Auditoría completada",
    description:
      "La validación de seguridad y permisos finalizó correctamente.",
    time: "Completado",
    color: "#ef4444",
    icon: <ShieldCheck />,
  },
];

interface Props {
  stats: {
    restaurants: number;
    users: number;
    legal: number;
    liquidations: number;
  };
}

export default function PlatformActivity({
  stats, // Preservado para consistencia de Props con el componente padre
}: Props) {
  return (
    <section style={{ marginBottom: 36 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <div
            style={{
              color: "#8b5cf6",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontSize: 11,
              marginBottom: 6,
            }}
          >
            Activity Timeline
          </div>

          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            Actividad de la Plataforma
          </h2>

          <p
            style={{
              margin: "6px 0 0 0",
              color: "#666666",
              fontSize: 13,
              lineHeight: 1.5,
              maxWidth: 760,
            }}
          >
            Historial ejecutivo de los principales eventos de Wolf Ordering SaaS. 
            Próximamente esta información será obtenida automáticamente desde la base de datos.
          </p>
        </div>

        {/* BADGE COMPACTO */}
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: "rgba(139, 92, 246, 0.08)",
            border: "1px solid rgba(139, 92, 246, 0.15)",
            color: "#c4b5fd",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
          }}
        >
          {activities.length} eventos registrados
        </div>
      </div>

      {/* TIMELINE */}
      <div
        style={{
          display: "grid",
          gap: 12, // Gap más estrecho para máxima densidad visual
        }}
      >
        {activities.map((activity) => (
          <PlatformActivityItem
            key={activity.title}
            title={activity.title}
            description={activity.description}
            time={activity.time}
            color={activity.color}
            icon={activity.icon}
          />
        ))}
      </div>
    </section>
  );
}