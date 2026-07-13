"use client";

import {
  Building2,
  Users,
  Scale,
  Landmark,
  Smartphone,
  ShieldCheck,
  Activity,
  Database,
} from "lucide-react";

import OverviewCard from "./OverviewCard";

interface Props {
  stats: {
    restaurants: number;
    users: number;
    legal: number;
    liquidations: number;
  };
}

export default function QuickOverview({
  stats,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 60,
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 28,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(30px,4vw,40px)",
              fontWeight: 900,
            }}
          >
            Plataforma Wolf Ordering
          </h2>

          <p
            style={{
              marginTop: 12,
              color: "#9b9b9b",
              lineHeight: 1.8,
              maxWidth: 760,
            }}
          >
            Resumen ejecutivo de la infraestructura principal
            utilizada por toda la plataforma SaaS.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(34,197,94,.10)",
            border: "1px solid rgba(34,197,94,.25)",
            color: "#4ade80",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Infraestructura Activa
        </div>
      </div>

      {/* GRID */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: 20,
        }}
      >
        <OverviewCard
          title={`${stats.restaurants} Restaurantes`}
          subtitle="Multi Restaurante"
          icon={<Building2 size={26} />}
          color="#f97316"
        />

        <OverviewCard
          title={`${stats.users} Usuarios`}
          subtitle="Roles y permisos"
          icon={<Users size={26} />}
          color="#3b82f6"
        />

        <OverviewCard
          title={`${stats.legal} Acuerdos`}
          subtitle="Centro Legal"
          icon={<Scale size={26} />}
          color="#22c55e"
        />

        <OverviewCard
          title={`${stats.liquidations} Liquidaciones`}
          subtitle="Facturación"
          icon={<Landmark size={26} />}
          color="#8b5cf6"
        />

        <OverviewCard
          title="PWA"
          subtitle="Aplicaciones instalables"
          icon={<Smartphone size={26} />}
          color="#06b6d4"
        />

        <OverviewCard
          title="Seguridad"
          subtitle="Protección del sistema"
          icon={<ShieldCheck size={26} />}
          color="#ec4899"
        />

        <OverviewCard
          title="Tiempo Real"
          subtitle="Eventos y monitoreo"
          icon={<Activity size={26} />}
          color="#14b8a6"
        />

        <OverviewCard
          title="Supabase"
          subtitle="Base de datos Cloud"
          icon={<Database size={26} />}
          color="#f59e0b"
        />
      </div>
    </section>
  );
}