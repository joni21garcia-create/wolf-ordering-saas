"use client";

import {
  Database,
  Cloud,
  Globe,
  Mail,
  Bell,
  Smartphone,
  BarChart3,
  ShieldCheck,
} from "lucide-react";

const services = [
  {
    title: "API",
    status: "online",
    color: "#22c55e",
    icon: <Globe />,
  },
  {
    title: "Base de Datos",
    status: "online",
    color: "#3b82f6",
    icon: <Database />,
  },
  {
    title: "Storage",
    status: "online",
    color: "#8b5cf6",
    icon: <Cloud />,
  },
  {
    title: "Correo",
    status: "online",
    color: "#f97316",
    icon: <Mail />,
  },
  {
    title: "Push",
    status: "online",
    color: "#06b6d4",
    icon: <Bell />,
  },
  {
    title: "PWA",
    status: "online",
    color: "#ec4899",
    icon: <Smartphone />,
  },
  {
    title: "Analytics",
    status: "warning",
    color: "#f59e0b",
    icon: <BarChart3 />,
  },
  {
    title: "Seguridad",
    status: "online",
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
 * Se conserva:
 * - la lista actual de servicios
 * - sus estados
 * - sus iconos
 * - sus colores
 *
 * No modifica autenticación, consultas ni lógica de negocio.
 *
 * La portada solamente muestra el resumen.
 * El detalle de servicios queda dentro de un <details>
 * para no saturar el dashboard.
 */
export default function PlatformStatus({}: Props) {
  const total = services.length;
  const online = services.filter(
    (service) => service.status === "online"
  ).length;
  const warning = services.filter(
    (service) => service.status === "warning"
  ).length;

  const progress = Math.round((online / total) * 100);
  const isOperational = warning === 0;

  return (
    <section className="platform-status">
      <div className="status-summary">
        <div className="status-copy">
          <span className="eyebrow">ESTADO DEL SISTEMA</span>

          <h2>Plataforma</h2>

          <p>
            Estado general de los servicios principales de Wolf Ordering.
          </p>
        </div>

        <div className="status-main">
          <span
            className={`status-pill ${
              isOperational ? "operational" : "monitoring"
            }`}
          >
            <span className="status-dot" />
            {isOperational ? "Operativo" : "Monitoreando"}
          </span>

          <strong>{progress}%</strong>

          <span className="availability">
            {online} de {total} servicios operativos
          </span>
        </div>
      </div>

      <details className="service-details">
        <summary>
          <span>Ver servicios</span>
          <span className="summary-meta">
            {total} servicios · {warning} en monitoreo
          </span>
          <span className="chevron">›</span>
        </summary>

        <div className="services-list">
          {services.map((service) => (
            <div
              key={service.title}
              className="service-row"
            >
              <span
                className="service-icon"
                style={{
                  color: service.color,
                  backgroundColor: `${service.color}10`,
                  borderColor: `${service.color}20`,
                }}
              >
                {service.icon}
              </span>

              <span className="service-name">
                {service.title}
              </span>

              <span
                className={`service-state ${
                  service.status === "online"
                    ? "online"
                    : "warning"
                }`}
              >
                <span />
                {service.status === "online"
                  ? "Operativo"
                  : "Monitoreando"}
              </span>
            </div>
          ))}
        </div>
      </details>

      <style jsx>{`
        .platform-status {
          margin-bottom: 34px;
        }

        .status-summary {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 24px;
          padding: 17px 18px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 14px;
          background: #0e0e0e;
        }

        .status-copy {
          min-width: 0;
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
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.3px;
        }

        .status-copy p {
          margin: 4px 0 0;
          color: #626262;
          font-size: 11px;
          line-height: 1.4;
        }

        .status-main {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-shrink: 0;
        }

        .status-main strong {
          color: #fff;
          font-size: 20px;
          font-weight: 850;
        }

        .availability {
          color: #555;
          font-size: 10px;
          white-space: nowrap;
        }

        .status-pill {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 750;
        }

        .status-pill.operational {
          color: #4ade80;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.12);
        }

        .status-pill.monitoring {
          color: #fbbf24;
          background: rgba(245, 158, 11, 0.06);
          border: 1px solid rgba(245, 158, 11, 0.14);
        }

        .status-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .service-details {
          margin-top: 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 13px;
          background: #0c0c0c;
        }

        .service-details summary {
          min-height: 46px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 0 14px;
          cursor: pointer;
          list-style: none;
          color: #b4b4b4;
          font-size: 11px;
          font-weight: 700;
        }

        .service-details summary::-webkit-details-marker {
          display: none;
        }

        .summary-meta {
          margin-left: auto;
          color: #4f4f4f;
          font-size: 10px;
          font-weight: 500;
        }

        .chevron {
          color: #555;
          font-size: 17px;
          transition: transform 0.18s ease;
        }

        .service-details[open] .chevron {
          transform: rotate(90deg);
        }

        .services-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 7px;
          padding: 0 9px 9px;
        }

        .service-row {
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 8px 10px;
          border: 1px solid rgba(255, 255, 255, 0.04);
          border-radius: 10px;
          background: #101010;
        }

        .service-icon {
          width: 30px;
          height: 30px;
          flex: 0 0 30px;
          display: grid;
          place-items: center;
          border: 1px solid;
          border-radius: 8px;
        }

        .service-icon :global(svg) {
          width: 15px;
          height: 15px;
        }

        .service-name {
          min-width: 0;
          flex: 1;
          overflow: hidden;
          color: #c4c4c4;
          font-size: 10px;
          font-weight: 650;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .service-state {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          flex-shrink: 0;
          font-size: 9px;
          font-weight: 700;
        }

        .service-state span {
          width: 5px;
          height: 5px;
          border-radius: 50%;
          background: currentColor;
        }

        .service-state.online {
          color: #4ade80;
        }

        .service-state.warning {
          color: #fbbf24;
        }

        @media (max-width: 700px) {
          .status-summary {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .status-main {
            width: 100%;
            flex-wrap: wrap;
          }

          .availability {
            margin-left: auto;
          }

          .services-list {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 430px) {
          .status-summary {
            padding: 15px;
          }

          .status-main {
            gap: 7px;
          }

          .availability {
            width: 100%;
            margin-left: 0;
          }

          .summary-meta {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}