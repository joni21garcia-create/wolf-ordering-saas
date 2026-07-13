"use client";

import {
  Building2,
  Users,
  Scale,
  Landmark,
} from "lucide-react";

import ExecutiveStatCard from "./ExecutiveStatCard";

interface Props {
  restaurants: number;
  users: number;
  legal: number;
  liquidations: number;
  permissions: number;
  loading: boolean;
}

export default function ExecutiveStats({
  restaurants,
  users,
  legal,
  liquidations,
  permissions,
  loading,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 60,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 18,
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
            Executive Overview
          </h2>

          <p
            style={{
              marginTop: 12,
              color: "#9d9d9d",
              lineHeight: 1.8,
              maxWidth: 720,
            }}
          >
            Estado general de toda la plataforma Wolf Ordering
            SaaS. Los indicadores se actualizan automáticamente
            desde la base de datos.
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
          {loading ? "Sincronizando..." : "Datos en tiempo real"}
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(270px,1fr))",
          gap: 22,
        }}
      >
        <ExecutiveStatCard
          title="Restaurantes"
          value={
           loading
            ? "..."
          : String(restaurants)
}
          subtitle="Restaurantes registrados"
          color="#f97316"
          icon={<Building2 size={30} />}
        />

        <ExecutiveStatCard
          title="Usuarios"
          value={
           loading
            ? "..."
           : String(users)
           }
          subtitle="Usuarios del sistema"
          color="#3b82f6"
          icon={<Users size={30} />}
        />

        <ExecutiveStatCard
          title="Centro Legal"
          value={legal.toString()}
          subtitle="Acuerdos registrados"
          color="#22c55e"
          icon={<Scale size={30} />}
        />

        <ExecutiveStatCard
          title="Liquidaciones"
          value={
            loading
            ? "..."
           : String(liquidations)
           }

          subtitle="Liquidaciones registradas"
          color="#8b5cf6"
          icon={<Landmark size={30} />}
        />
      </div>

      <div
        style={{
          marginTop: 22,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          padding: "18px 24px",
          borderRadius: 20,
          background: "rgba(255,255,255,.03)",
          border: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <div>
          <div
            style={{
              color: "#888",
              fontSize: 13,
              textTransform: "uppercase",
              letterSpacing: 1.5,
              fontWeight: 700,
            }}
          >
            Permisos cargados
          </div>

          <div
            style={{
              color: "#fff",
              fontSize: 26,
              fontWeight: 800,
              marginTop: 6,
            }}
          >
            {permissions}
          </div>
        </div>

        <div
          style={{
            color: "#22c55e",
            fontWeight: 700,
            fontSize: 15,
          }}
        >
          ✔ Plataforma sincronizada correctamente
        </div>
      </div>
    </section>
  );
}