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

import PlatformStatusItem from "./PlatformStatusItem";

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

export default function PlatformStatus({
  stats,
}: Props) {
  const total = services.length;

  const online = services.filter(
    (s) => s.status === "online"
  ).length;

  const warning = services.filter(
    (s) => s.status === "warning"
  ).length;

  const progress = Math.round(
    (online / total) * 100
  );

  return (
    <section style={{ marginBottom: 36 }}>
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
          marginBottom: 20,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 280,
          }}
        >
          <div
            style={{
              color: "#22c55e",
              fontWeight: 700,
              letterSpacing: "1px",
              textTransform: "uppercase",
              fontSize: 11,
              marginBottom: 6,
            }}
          >
            Health Monitor
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
            Estado de la Plataforma
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
            Supervisa todos los servicios críticos de Wolf Ordering SaaS. Este panel 
            es utilizado para monitorear Supabase, API, autenticación, almacenamiento, PWA y servicios globales.
          </p>
        </div>

        {/* TARJETA LATERAL DE DISPONIBILIDAD */}
        <div
          style={{
            width: 300,
            maxWidth: "100%",
            borderRadius: 16,
            padding: 18,
            background: "linear-gradient(180deg, #141414, #0d0d0d)",
            border: "1px solid rgba(255, 255, 255, 0.04)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 700,
                fontSize: 13,
              }}
            >
              Disponibilidad
            </span>

            <span
              style={{
                color: "#22c55e",
                fontWeight: 800,
                fontSize: 16,
              }}
            >
              {progress}%
            </span>
          </div>

          {/* Barra de Progreso */}
          <div
            style={{
              height: 6,
              borderRadius: 999,
              background: "rgba(255, 255, 255, 0.04)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 999,
                background: "linear-gradient(90deg, #22c55e, #16a34a)",
              }}
            />
          </div>

          {/* Filas de Resumen */}
          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 16,
            }}
          >
            <StatusRow
              label="Servicios"
              value={String(total)}
            />

            <StatusRow
              label="Operativos"
              value={String(online)}
            />

            <StatusRow
              label="Monitoreando"
              value={String(warning)}
            />

            <StatusRow
              label="Disponibilidad"
              value="24 / 7"
            />
          </div>
        </div>
      </div>

      {/* GRID DE SERVICIOS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        {services.map((service) => (
          <PlatformStatusItem
            key={service.title}
            title={service.title}
            value={
              service.status === "online"
                ? "Operativo"
                : "Monitoreando"
            }
            color={service.color}
            icon={service.icon}
          />
        ))}
      </div>
    </section>
  );
}

function StatusRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: "#666666",
          fontSize: 12,
          fontWeight: 500,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#fff",
          fontWeight: 700,
          fontSize: 12,
        }}
      >
        {value}
      </span>
    </div>
  );
}