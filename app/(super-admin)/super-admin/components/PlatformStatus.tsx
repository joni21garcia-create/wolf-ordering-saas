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
    icon: <Globe size={24} />,
  },
  {
    title: "Base de Datos",
    status: "online",
    color: "#3b82f6",
    icon: <Database size={24} />,
  },
  {
    title: "Storage",
    status: "online",
    color: "#8b5cf6",
    icon: <Cloud size={24} />,
  },
  {
    title: "Correo",
    status: "online",
    color: "#f97316",
    icon: <Mail size={24} />,
  },
  {
    title: "Push",
    status: "online",
    color: "#06b6d4",
    icon: <Bell size={24} />,
  },
  {
    title: "PWA",
    status: "online",
    color: "#ec4899",
    icon: <Smartphone size={24} />,
  },
  {
    title: "Analytics",
    status: "warning",
    color: "#f59e0b",
    icon: <BarChart3 size={24} />,
  },
  {
    title: "Seguridad",
    status: "online",
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
          alignItems: "flex-start",
          gap: 30,
          flexWrap: "wrap",
          marginBottom: 30,
        }}
      >
        <div
          style={{
            flex: 1,
            minWidth: 320,
          }}
        >
          <div
            style={{
              color: "#22c55e",
              fontWeight: 800,
              letterSpacing: 2,
              textTransform: "uppercase",
              fontSize: 13,
              marginBottom: 14,
            }}
          >
            Health Monitor
          </div>

          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(32px,4vw,42px)",
              fontWeight: 900,
            }}
          >
            Estado de la Plataforma
          </h2>

          <p
            style={{
              marginTop: 16,
              color: "#9b9b9b",
              lineHeight: 1.9,
              maxWidth: 760,
            }}
          >
            Supervisa todos los servicios críticos de Wolf
            Ordering SaaS. Este panel será utilizado para
            monitorear Supabase, API, autenticación,
            almacenamiento, PWA y servicios globales.
          </p>
        </div>

        <div
          style={{
            width: 340,
            maxWidth: "100%",
            borderRadius: 28,
            padding: 26,
            background:
              "linear-gradient(180deg,#171717,#101010)",
            border:
              "1px solid rgba(255,255,255,.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              marginBottom: 12,
            }}
          >
            <span
              style={{
                color: "#fff",
                fontWeight: 800,
              }}
            >
              Disponibilidad
            </span>

            <span
              style={{
                color: "#22c55e",
                fontWeight: 900,
                fontSize: 22,
              }}
            >
              {progress}%
            </span>
          </div>

          <div
            style={{
              height: 10,
              borderRadius: 999,
              background:
                "rgba(255,255,255,.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 999,
                background:
                  "linear-gradient(90deg,#22c55e,#16a34a)",
              }}
            />
          </div>

          <div
            style={{
              display: "grid",
              gap: 14,
              marginTop: 24,
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

      {/* GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(270px,1fr))",
          gap: 20,
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
          color: "#8f8f8f",
          fontSize: 14,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#fff",
          fontWeight: 800,
        }}
      >
        {value}
      </span>
    </div>
  );
}