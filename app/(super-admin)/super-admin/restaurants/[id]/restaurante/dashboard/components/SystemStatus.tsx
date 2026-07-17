"use client";

import StatusItem from "./StatusItem";

type Props = {
  permissionsLoaded?: boolean;
};

export default function SystemStatus({
  permissionsLoaded = true,
}: Props) {
  return (
    <section
      style={{
        marginTop: 40,
        marginBottom: 24,
        paddingTop: 24,
        borderTop: "1px solid rgba(255, 255, 255, 0.05)", // Una sutil línea divisoria
      }}
    >
      {/* Cabecera ultra-discreta */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 16,
        }}
      >
        <div>
          <h4
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 13,
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.8px",
            }}
          >
            Estado de los Servicios
          </h4>
          <p
            style={{
              margin: "2px 0 0 0",
              color: "#606060",
              fontSize: 11,
            }}
          >
            Monitoreo en tiempo real de la plataforma
          </p>
        </div>

        {/* Badge de estado general reducido a su mínima y más elegante expresión */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            fontSize: 11,
            color: "#22c55e",
            fontWeight: 600,
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          <span
            style={{
              width: 6,
              height: 6,
              borderRadius: "50%",
              background: "#22c55e",
              boxShadow: "0 0 8px #22c55e",
            }}
          />
          Sistemas estables
        </div>
      </div>

      {/* Grid de estados en formato ultra-compacto */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
          gap: 10, // Separación apretada y limpia
        }}
      >
        <StatusItem
          title="Sistema"
          subtitle="Wolf Ordering"
          status="online"
        />

        <StatusItem
          title="Permisos"
          subtitle={
            permissionsLoaded
              ? "Sincronizados"
              : "Cargando"
          }
          status={
            permissionsLoaded
              ? "online"
              : "warning"
          }
        />

        <StatusItem
          title="Sesión"
          subtitle="Usuario activo"
          status="online"
        />

        <StatusItem
          title="Restaurante"
          subtitle="Operativo"
          status="online"
        />
      </div>
    </section>
  );
}