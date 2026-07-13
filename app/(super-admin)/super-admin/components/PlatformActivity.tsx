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
    icon: <Building2 size={24} />,
  },

  {
    title: "Nuevo usuario del sistema",
    description:
      "Se registró un nuevo usuario administrativo dentro de la plataforma.",
    time: "Hoy",
    color: "#3b82f6",
    icon: <Users size={24} />,
  },

  {
    title: "Documento legal actualizado",
    description:
      "Se publicó una nueva versión de un documento del Centro Legal.",
    time: "Hoy",
    color: "#22c55e",
    icon: <Scale size={24} />,
  },

  {
    title: "Nueva versión desplegada",
    description:
      "Wolf Ordering SaaS fue actualizado correctamente sin afectar la operación.",
    time: "Producción",
    color: "#8b5cf6",
    icon: <Rocket size={24} />,
  },

  {
    title: "Auditoría completada",
    description:
      "La validación de seguridad y permisos finalizó correctamente.",
    time: "Completado",
    color: "#ef4444",
    icon: <ShieldCheck size={24} />,
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
  stats,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 70,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 24,
          marginBottom: 30,
        }}
      >
        <div>
          <div
            style={{
              color: "#8b5cf6",
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            Activity Timeline
          </div>

          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(32px,4vw,42px)",
              fontWeight: 900,
            }}
          >
            Actividad de la Plataforma
          </h2>

          <p
            style={{
              marginTop: 16,
              color: "#9b9b9b",
              lineHeight: 1.9,
              maxWidth: 760,
            }}
          >
            Historial ejecutivo de los principales eventos de
            Wolf Ordering SaaS. Próximamente esta información
            será obtenida automáticamente desde la base de datos.
          </p>
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderRadius: 999,
            background: "rgba(139,92,246,.12)",
            border: "1px solid rgba(139,92,246,.22)",
            color: "#c4b5fd",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {activities.length} eventos registrados
        </div>
      </div>

      {/* TIMELINE */}

      <div
        style={{
          display: "grid",
          gap: 20,
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