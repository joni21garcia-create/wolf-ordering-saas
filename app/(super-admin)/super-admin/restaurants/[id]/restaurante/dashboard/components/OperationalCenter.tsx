"use client";

import OperationCard from "./OperationCard";

type Module = {
  code: string;
  title: string;
  description: string;
  href: string;
  color: string;
  icon: React.ReactNode;
};

type Props = {
  operationModules: Module[];
  settingsModules: Module[];
};

export default function OperationalCenter({
  operationModules,
  settingsModules,
}: Props) {
  return (
    <section
      style={{
        marginBottom: 60,
      }}
    >
      {/* Header */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
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
              fontWeight: 800,
            }}
          >
            Centro Operativo
          </h2>

          <p
            style={{
              marginTop: 12,
              color: "#9a9a9a",
              lineHeight: 1.8,
              maxWidth: 760,
            }}
          >
            Los accesos mostrados en esta pantalla se generan
            automáticamente según los permisos asignados a tu
            usuario.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(255,255,255,.04)",
            border: "1px solid rgba(255,255,255,.08)",
            color: "#bdbdbd",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          {operationModules.length + settingsModules.length} módulos disponibles
        </div>
      </div>

      {/* Operación */}

      {operationModules.length > 0 && (
        <>
          <h3
            style={{
              marginBottom: 22,
              color: "#fff",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Operación
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(340px,1fr))",
              gap: 24,
              marginBottom: 45,
            }}
          >
            {operationModules.map((module) => (
              <OperationCard
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
        </>
      )}

      {/* Configuración */}

      {settingsModules.length > 0 && (
        <>
          <h3
            style={{
              marginBottom: 22,
              color: "#fff",
              fontSize: 24,
              fontWeight: 800,
            }}
          >
            Configuración
          </h3>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(340px,1fr))",
              gap: 24,
            }}
          >
            {settingsModules.map((module) => (
              <OperationCard
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
        </>
      )}

      {operationModules.length === 0 &&
        settingsModules.length === 0 && (
          <div
            style={{
              marginTop: 30,
              padding: 40,
              textAlign: "center",
              borderRadius: 28,
              background:
                "rgba(255,255,255,.03)",
              border:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            <h3
              style={{
                color: "#fff",
                marginBottom: 12,
              }}
            >
              No hay módulos disponibles
            </h3>

            <p
              style={{
                color: "#9a9a9a",
                margin: 0,
                lineHeight: 1.8,
              }}
            >
              Tu usuario aún no tiene módulos asignados.
              Solicita acceso a un administrador del
              restaurante.
            </p>
          </div>
        )}
    </section>
  );
}