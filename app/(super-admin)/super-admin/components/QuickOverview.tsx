"use client";

import {
  Building2,
  Users,
  Scale,
  Landmark,
} from "lucide-react";

import OverviewCard from "./OverviewCard";

interface Props {
  stats: {
    restaurants: number;
    users: number;
    legal: number;
    liquidations: number;
  };
  totalModules: number; // <--- Añadido para recibir los permisos reales
}

export default function QuickOverview({
  stats,
  totalModules,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 36,
      }}
    >
      {/* HEADER */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 20,
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            Executive Overview
          </h2>

          <p
            style={{
              margin: "4px 0 0 0",
              color: "#666666",
              fontSize: 13,
              lineHeight: 1.5,
              maxWidth: 760,
            }}
          >
            Estado general de la plataforma Wolf Ordering SaaS. Los indicadores se actualizan de manera automática mediante consultas directas a la base de datos.
          </p>
        </div>

        <div
          style={{
            padding: "5px 12px",
            borderRadius: 999,
            background: "rgba(34, 197, 94, 0.08)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            color: "#4ade80",
            fontWeight: 700,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ade80", display: "inline-block" }} />
          TIEMPO REAL
        </div>
      </div>

      {/* GRID */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        <OverviewCard
          title={`${stats.restaurants} Restaurantes`}
          subtitle="Registros activos"
          icon={<Building2 />}
          color="#f97316"
        />

        <OverviewCard
          title={`${stats.users} Usuarios`}
          subtitle="Acceso al sistema"
          icon={<Users />}
          color="#3b82f6"
        />

        <OverviewCard
          title={String(stats.legal)} // <--- Dinámico desde Supabase
          subtitle="Acuerdos firmados"
          icon={<Scale />}
          color="#22c55e"
        />

        <OverviewCard
          title={`${stats.liquidations} Liquidaciones`}
          subtitle="Procesadas globales"
          icon={<Landmark />}
          color="#8b5cf6"
        />
      </div>

      {/* FOOTER STATS */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: 16,
          paddingTop: 12,
          fontSize: 12,
          color: "#71717a",
        }}
      >
        <div>
          PERMISOS ASIGNADOS: <strong style={{ color: "#fff" }}>{totalModules}</strong>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#22c55e" }}>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#22c55e" }} />
          Sincronización de credenciales completa
        </div>
      </div>
    </section>
  );
}