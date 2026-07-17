"use client";

import Link from "next/link";
import type { DashboardModule } from "../config/modules";

type DashboardModuleUI = Omit<DashboardModule, "href"> & {
  href: string;
};

type Props = {
  operationModules: DashboardModuleUI[];
  settingsModules: DashboardModuleUI[];
  permissionsCount: number;
};

export default function OperationalCenter({
  operationModules,
  settingsModules,
  permissionsCount,
}: Props) {
  // --- AGRUPACIÓN DINÁMICA DE CONFIGURACIÓN ---
  const configGroups = [
    {
      title: "Seguridad y Acceso",
      color: "#3b82f6", // Azul de referencia
      description: "Roles, usuarios y niveles de acceso al sistema",
      modules: settingsModules.filter((m) =>
        ["users", "roles", "permissions"].includes(m.code)
      ),
    },
    {
      title: "Gestión del Menú",
      color: "#f97316", // Naranja de referencia
      description: "Cartas, productos, categorías y recursos visuales",
      modules: settingsModules.filter((m) =>
        ["products", "categories", "gallery"].includes(m.code)
      ),
    },
    {
      title: "Operación y Sucursal",
      color: "#22c55e", // Verde de referencia
      description: "Ubicación, métodos de pago, horarios y servicios",
      modules: settingsModules.filter((m) =>
        [
          "location",
          "schedule",
          "payments",
          "services",
          "serviciosrestaurant",
        ].includes(m.code)
      ),
    },
    {
      title: "Canal de Clientes e Identidad",
      color: "#a855f7", // Morado de referencia
      description: "Diseño, portadas, marketing, PWA y redes sociales",
      modules: settingsModules.filter((m) =>
        ["themes", "pwa", "marketing", "hero", "navbar", "socials"].includes(
          m.code
        )
      ),
    },
  ];

  return (
    <section style={{ marginTop: 32 }}>
      {/* Cabecera del Centro Operativo */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div>
          <span
            style={{
              color: "#f97316",
              fontSize: 11,
              textTransform: "uppercase",
              letterSpacing: "1.5px",
              fontWeight: 800,
            }}
          >
            Centro Operativo
          </span>
          <h2 style={{ fontSize: 22, fontWeight: 700, marginTop: 4, margin: 0 }}>
            Todo listo para comenzar
          </h2>
        </div>
        <span
          style={{
            background: "rgba(34, 197, 94, 0.1)",
            border: "1px solid rgba(34, 197, 94, 0.2)",
            color: "#22c55e",
            padding: "6px 12px",
            borderRadius: 99,
            fontSize: 12,
            fontWeight: 600,
          }}
        >
          🟢 {permissionsCount} Módulos Activos
        </span>
      </div>

      {/* --- SECCIÓN 1: PEDIDOS / OPERACIÓN (Quedó súper bien como estaba) --- */}
      {operationModules.length > 0 && (
        <div style={{ marginBottom: 40 }}>
          <h3
            style={{
              fontSize: 14,
              color: "#808080",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 16,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              paddingBottom: 8,
            }}
          >
            Operación Diaria
          </h3>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 16,
            }}
          >
            {operationModules.map((module) => (
              <ModuleCard
               key={module.code}
               module={module}
              />
            ))}
          </div>
        </div>
      )}

      {/* --- SECCIÓN 2: CONFIGURACIÓN AGRUPADA --- */}
      {settingsModules.length > 0 && (
        <div>
          <h3
            style={{
              fontSize: 14,
              color: "#808080",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              marginBottom: 24,
              borderBottom: "1px solid rgba(255,255,255,0.05)",
              paddingBottom: 8,
            }}
          >
            Configuración del Sistema
          </h3>

          {/* Renderizado de Subcategorías por Grupos de Color */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 32, // Espacio entre subcategorías
            }}
          >
            {configGroups.map(
              (group) =>
                group.modules.length > 0 && (
                  <div
                    key={group.title}
                    style={{
                      background: "rgba(255, 255, 255, 0.01)",
                      border: "1px solid rgba(255, 255, 255, 0.03)",
                      borderRadius: 16,
                      padding: "20px 24px",
                    }}
                  >
                    {/* Header de la Subcategoría */}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        marginBottom: 16,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "50%",
                          background: group.color,
                          boxShadow: `0 0 8px ${group.color}`,
                        }}
                      />
                      <div>
                        <h4
                          style={{
                            margin: 0,
                            fontSize: 15,
                            fontWeight: 700,
                            color: "#fff",
                          }}
                        >
                          {group.title}
                        </h4>
                        <p
                          style={{
                            margin: "2px 0 0 0",
                            fontSize: 12,
                            color: "#666",
                          }}
                        >
                          {group.description}
                        </p>
                      </div>
                    </div>

                    {/* Grid de Tarjetas dentro de esta Subcategoría */}
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns:
                          "repeat(auto-fit, minmax(280px, 1fr))",
                        gap: 14,
                      }}
                    >
                      {group.modules.map((module) => (
                                      <ModuleCard
                                       key={module.code}
                                       module={module}
                                       />
                      ))}
                    </div>
                  </div>
                )
            )}
          </div>
        </div>
      )}
    </section>
  );
}

// --- COMPONENTE INTERNO: Tarjeta de Módulo Reutilizable ---
function ModuleCard({
  module,
}: {
  module: DashboardModuleUI;
}) {
  return (
    <Link
      href={module.href}
      style={{
        textDecoration: "none",
        color: "inherit",
        display: "flex",
        alignItems: "center",
        gap: 16,
        padding: "16px 20px",
        borderRadius: 12,
        background: "linear-gradient(180deg, #141414, #0d0d0d)",
        border: "1px solid rgba(255, 255, 255, 0.05)",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-2px)";
        e.currentTarget.style.borderColor = `${module.color}35`;
        e.currentTarget.style.boxShadow = `0 8px 24px ${module.color}08`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0px)";
        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.05)";
        e.currentTarget.style.boxShadow = "none";
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 8,
          background: `${module.color}10`,
          border: `1px solid ${module.color}20`,
          color: module.color,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
      >
        {module.icon}
      </div>
      <div>
        <h5
          style={{
            margin: 0,
            fontSize: 14,
            fontWeight: 600,
            color: "#fff",
          }}
        >
          {module.title}
        </h5>
        <p
          style={{
            margin: "4px 0 0 0",
            fontSize: 12,
            color: "#808080",
            lineHeight: 1.3,
          }}
        >
          {module.description}
        </p>
      </div>
    </Link>
  );
}