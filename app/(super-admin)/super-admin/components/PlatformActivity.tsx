"use client";

import {
  Building2,
  Users,
  Scale,
  Rocket,
  ShieldCheck,
} from "lucide-react";

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

/**
 * UI ONLY
 *
 * Conservamos exactamente las actividades existentes.
 * No se inventan eventos ni se cambia la fuente de datos.
 *
 * En el dashboard mostramos solamente un resumen compacto.
 * El historial completo queda disponible mediante "Ver historial".
 */
export default function PlatformActivity({}: Props) {
  const visibleActivities = activities.slice(0, 3);

  return (
    <section className="platform-activity">
      <div className="activity-header">
        <div>
          <span className="eyebrow">RESUMEN</span>

          <h2>Actividad reciente</h2>

          <p>
            Últimos eventos relevantes de la plataforma.
          </p>
        </div>

        <details className="history">
          <summary>
            Ver historial
            <span>›</span>
          </summary>

          <div className="history-panel">
            {activities.map((activity) => (
              <ActivityRow
                key={activity.title}
                {...activity}
              />
            ))}
          </div>
        </details>
      </div>

      <div className="activity-list">
        {visibleActivities.map((activity) => (
          <ActivityRow
            key={activity.title}
            {...activity}
          />
        ))}
      </div>

      <style jsx>{`
        .platform-activity {
          margin-bottom: 0;
        }

        .activity-header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 10px;
        }

        .eyebrow {
          display: block;
          margin-bottom: 5px;
          color: #f97316;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        h2 {
          margin: 0;
          color: #fff;
          font-size: 18px;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        p {
          margin: 4px 0 0;
          color: #626262;
          font-size: 11px;
          line-height: 1.4;
        }

        .history {
          position: relative;
          flex-shrink: 0;
        }

        .history summary {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          cursor: pointer;
          list-style: none;
          color: #777;
          font-size: 10px;
          font-weight: 700;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.025);
        }

        .history summary::-webkit-details-marker {
          display: none;
        }

        .history summary span {
          color: #555;
          font-size: 15px;
          line-height: 1;
        }

        .history-panel {
          position: absolute;
          z-index: 20;
          top: calc(100% + 7px);
          right: 0;
          width: min(440px, calc(100vw - 32px));
          display: grid;
          gap: 6px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 12px;
          background: #111;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.45);
        }

        .activity-list {
          display: grid;
          gap: 7px;
        }

        .activity-row {
          display: flex;
          align-items: center;
          gap: 10px;
          min-height: 50px;
          padding: 8px 11px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 11px;
          background: #0e0e0e;
        }

        .activity-icon {
          width: 31px;
          height: 31px;
          flex: 0 0 31px;
          display: grid;
          place-items: center;
          border: 1px solid;
          border-radius: 8px;
        }

        .activity-icon :global(svg) {
          width: 15px;
          height: 15px;
        }

        .activity-content {
          min-width: 0;
          flex: 1;
        }

        .activity-title {
          display: block;
          overflow: hidden;
          color: #d4d4d4;
          font-size: 11px;
          font-weight: 700;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .activity-description {
          display: block;
          margin-top: 2px;
          overflow: hidden;
          color: #555;
          font-size: 9px;
          line-height: 1.3;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .activity-time {
          flex-shrink: 0;
          color: #555;
          font-size: 9px;
          white-space: nowrap;
        }

        @media (max-width: 600px) {
          .activity-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 9px;
          }

          .history {
            align-self: flex-start;
          }

          .activity-description {
            white-space: normal;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 1;
          }
        }

        @media (max-width: 420px) {
          .activity-row {
            min-height: 47px;
            padding: 7px 9px;
          }

          .activity-time {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}

function ActivityRow({
  title,
  description,
  time,
  color,
  icon,
}: {
  title: string;
  description: string;
  time: string;
  color: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="activity-row">
      <span
        className="activity-icon"
        style={{
          color,
          backgroundColor: `${color}10`,
          borderColor: `${color}20`,
        }}
      >
        {icon}
      </span>

      <span className="activity-content">
        <span className="activity-title">{title}</span>
        <span className="activity-description">
          {description}
        </span>
      </span>

      <span className="activity-time">{time}</span>
    </div>
  );
}