"use client";

import ExecutiveCard from "./ExecutiveCard";

type Module = {
  code: string;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: React.ReactNode;
};

interface Props {
  operationModules: Module[];
  settingsModules: Module[];
}

export default function ExecutiveCenter({
  operationModules = [],
  settingsModules = [],
}: Props) {
  const totalModulesCount = operationModules.length + settingsModules.length;

  return (
    <section style={{ marginBottom: 48 }}>
      {/* HERO BANNER REDISEÑADO (SIN GIGANTISMO) */}
      <div
        style={{
          marginBottom: 24,
          padding: "24px 32px",
          borderRadius: 20,
          background: "linear-gradient(180deg, #141414, #0d0d0d)",
          border: "1px solid rgba(255, 255, 255, 0.05)",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
        }}
      >
        <div style={{ flex: 1, minWidth: 280 }}>
          <span
            style={{
              color: "#f97316",
              fontWeight: 700,
              letterSpacing: "1.5px",
              textTransform: "uppercase",
              fontSize: 11,
            }}
          >
            Executive Command Center
          </span>

          <h2
            style={{
              margin: "6px 0 0",
              color: "#fff",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: "-0.5px",
            }}
          >
            Módulos Globales
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#666666",
              fontSize: 13,
              lineHeight: 1.5,
              margin: "8px 0 0 0",
              maxWidth: 680,
            }}
          >
            Control centralizado para Wolf Ordering SaaS. Estos accesos administran parámetros 
            globales del sistema, mientras que cada restaurante cuenta con su panel operativo independiente.
          </p>
        </div>

        {/* CONTADOR DE MÓDULOS MINIATURIZADO */}
        <div
          style={{
            padding: "16px 24px",
            borderRadius: 14,
            background: "rgba(255, 255, 255, 0.01)",
            border: "1px solid rgba(255, 255, 255, 0.03)",
            textAlign: "right",
            minWidth: 180,
          }}
        >
          <div
            style={{
              color: "#666666",
              fontSize: 11,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "1px",
            }}
          >
            Módulos Activos
          </div>

          <div
            style={{
              color: "#fff",
              fontWeight: 800,
              fontSize: 32,
              lineHeight: 1,
              margin: "4px 0",
            }}
          >
            {totalModulesCount}
          </div>

          <div
            style={{
              color: "#22c55e",
              fontWeight: 600,
              fontSize: 11,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              gap: 4,
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", backgroundColor: "#22c55e" }} />
            Sincronizado
          </div>
        </div>
      </div>

      {/* SECCIÓN: OPERATIVOS */}
      {operationModules.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <h4 style={{ color: "#404040", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
            Operaciones Globales
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {operationModules.map((module) => (
              <ExecutiveCard
                key={module.code}
                title={module.title}
                description={module.description}
                href={module.href}
                color={module.color}
                icon={module.icon}
                badge="Operación"
              />
            ))}
          </div>
        </div>
      )}

      {/* SECCIÓN: CONFIGURACIÓN (Por si añades de esta categoría en config/modules.tsx) */}
      {settingsModules.length > 0 && (
        <div>
          <h4 style={{ color: "#404040", fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 16 }}>
            Configuración de Plataforma
          </h4>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
              gap: 16,
            }}
          >
            {settingsModules.map((module) => (
              <ExecutiveCard
                key={module.code}
                title={module.title}
                description={module.description}
                href={module.href}
                color={module.color}
                icon={module.icon}
                badge="Configuración"
              />
            ))}
          </div>
        </div>
      )}

      {/* PANTALLA VACÍA */}
      {totalModulesCount === 0 && (
        <div
          style={{
            padding: 40,
            borderRadius: 14,
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.01)",
            border: "1px solid rgba(255, 255, 255, 0.03)",
          }}
        >
          <h3
            style={{
              color: "#fff",
              fontSize: 16,
              fontWeight: 600,
              marginBottom: 8,
            }}
          >
            No tienes módulos asignados
          </h3>

          <p
            style={{
              color: "#666666",
              margin: 0,
              fontSize: 13,
              lineHeight: 1.5,
            }}
          >
            Los módulos autorizados para tu rol de Super Administrador aparecerán aquí automáticamente.
          </p>
        </div>
      )}
    </section>
  );
}


