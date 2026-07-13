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
        marginBottom: 50,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 24,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: "clamp(28px,4vw,36px)",
              fontWeight: 800,
            }}
          >
            Estado del sistema
          </h2>

          <p
            style={{
              marginTop: 10,
              color: "#909090",
              lineHeight: 1.8,
              maxWidth: 700,
            }}
          >
            Estado operativo de los servicios principales del restaurante.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(34,197,94,.12)",
            border: "1px solid rgba(34,197,94,.20)",
            color: "#22c55e",
            fontWeight: 700,
            fontSize: 14,
          }}
        >
          Todo operativo
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: 18,
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
          subtitle="Usuario autenticado"
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