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
    <section style={{ marginBottom: 36 }}>
      {/* CABECERA DE LA SECCIÓN */}
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
              marginTop: 6,
              color: "#666666",
              fontSize: 13,
              lineHeight: 1.5,
              maxWidth: 720,
              margin: "6px 0 0 0",
            }}
          >
            Estado general de la plataforma Wolf Ordering SaaS. Los indicadores 
            se actualizan de manera automática mediante consultas directas a la base de datos.
          </p>
        </div>

        {/* INDICADOR DE SINCRONIZACIÓN */}
        <div
          style={{
            padding: "6px 12px",
            borderRadius: 999,
            background: loading ? "rgba(249, 115, 22, 0.08)" : "rgba(34, 197, 94, 0.08)",
            border: loading ? "1px solid rgba(249, 115, 22, 0.15)" : "1px solid rgba(34, 197, 94, 0.15)",
            color: loading ? "#f97316" : "#22c55e",
            fontWeight: 700,
            fontSize: 11,
            letterSpacing: "0.5px",
            textTransform: "uppercase",
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span 
            style={{ 
              width: 6, 
              height: 6, 
              borderRadius: "50%", 
              backgroundColor: loading ? "#f97316" : "#22c55e",
              animation: loading ? "pulse 1.5s infinite" : "none"
            }} 
          />
          {loading ? "Sincronizando..." : "Tiempo real"}
        </div>
      </div>

      {/* CUADRÍCULA DE TARJETAS */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 16,
        }}
      >
        <ExecutiveStatCard
          title="Restaurantes"
          value={loading ? "..." : String(restaurants)}
          subtitle="Registros activos"
          color="#f97316"
          icon={<Building2 />}
        />

        <ExecutiveStatCard
          title="Usuarios"
          value={loading ? "..." : String(users)}
          subtitle="Acceso al sistema"
          color="#3b82f6"
          icon={<Users />}
        />

        <ExecutiveStatCard
          title="Centro Legal"
          value={loading ? "..." : String(legal)}
          subtitle="Acuerdos firmados"
          color="#22c55e"
          icon={<Scale />}
        />

        <ExecutiveStatCard
          title="Liquidaciones"
          value={loading ? "..." : String(liquidations)}
          subtitle="Procesadas globales"
          color="#8b5cf6"
          icon={<Landmark />}
        />
      </div>

      {/* BANNER DE PERMISOS */}
      <div
        style={{
          marginTop: 16,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 16,
          padding: "16px 20px",
          borderRadius: 14,
          background: "rgba(255, 255, 255, 0.01)",
          border: "1px solid rgba(255, 255, 255, 0.03)",
        }}
      >
        <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
          <span
            style={{
              color: "#444",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: 700,
            }}
          >
            Permisos asignados:
          </span>

          <span
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: 850,
            }}
          >
            {permissions}
          </span>
        </div>

        <div
          style={{
            color: "#666666",
            fontWeight: 600,
            fontSize: 12,
            display: "flex",
            alignItems: "center",
            gap: 6,
          }}
        >
          <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22c55e" }} />
          Sincronización de credenciales completa
        </div>
      </div>
    </section>
  );
}


