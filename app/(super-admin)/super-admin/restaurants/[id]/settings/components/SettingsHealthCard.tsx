"use client";

interface Item {
  title: string;
  status: "ok" | "warning" | "error";
}

interface Props {
  items: Item[];
}

export default function SettingsHealthCard({ items }: Props) {
  const total = items.length;
  const ok = items.filter((x) => x.status === "ok").length;
  const warning = items.filter((x) => x.status === "warning").length;
  const error = items.filter((x) => x.status === "error").length;

  const progress = total === 0 ? 0 : Math.round((ok / total) * 100);

  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        marginBottom: 24,
        borderRadius: 20,
        background: "linear-gradient(180deg,#181818,#0d0d0d)",
        border: "1px solid rgba(255,255,255,.07)",
        padding: "20px 24px",
        boxShadow: "0 10px 30px rgba(0,0,0,.15)",
        boxSizing: "border-box",
      }}
    >
      {/* Glow decorativo sutil */}
      <div
        style={{
          position: "absolute",
          top: -60,
          right: -60,
          width: 160,
          height: 160,
          borderRadius: "50%",
          background: "rgba(34,197,94,.06)",
          filter: "blur(40px)",
          pointerEvents: "none",
        }}
      />

      {/* Cabecera compacta con barra de estado integrada */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 18,
        }}
      >
        <div style={{ flex: 1, minWidth: 240 }}>
          <div
            style={{
              color: "#22c55e",
              fontWeight: 800,
              letterSpacing: 1.2,
              fontSize: 11,
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            Health Center
          </div>
          <h2
            style={{
              color: "#fff",
              margin: 0,
              fontSize: 20,
              fontWeight: 900,
              letterSpacing: "-0.3px",
            }}
          >
            Estado del Restaurante
          </h2>
        </div>

        {/* Panel lateral de progreso compacto */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 16,
            background: "rgba(255,255,255,.025)",
            border: "1px solid rgba(255,255,255,.05)",
            borderRadius: 14,
            padding: "10px 16px",
          }}
        >
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "#fff", fontWeight: 800, fontSize: 12 }}>
              Estado General <span style={{ color: "#22c55e" }}>{progress}%</span>
            </div>
            <div style={{ color: "#8f8f8f", fontSize: 11, fontWeight: 600 }}>
              {ok}/{total} listos • {warning + error} pendientes
            </div>
          </div>
          <div
            style={{
              width: 90,
              height: 6,
              borderRadius: 99,
              background: "rgba(255,255,255,.08)",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                borderRadius: 99,
                background: "#22c55e",
                transition: "width 0.4s ease",
              }}
            />
          </div>
        </div>
      </div>

      {/* Resumen de contadores en minitarjetas horizontales */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
          gap: 12,
          marginBottom: 18,
        }}
      >
        <SummaryCard title="Configurados" value={ok} color="#22c55e" icon="✅" />
        <SummaryCard title="Pendientes" value={warning} color="#f59e0b" icon="🟡" />
        <SummaryCard title="Errores" value={error} color="#ef4444" icon="⚠️" />
        <SummaryCard title="Total" value={total} color="#3b82f6" icon="📦" />
      </div>

      {/* Grid de ítems individuales ultra compactos */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 10,
        }}
      >
        {items.map((item) => (
          <HealthItem key={item.title} {...item} />
        ))}
      </div>
    </section>
  );
}

function SummaryCard({
  title,
  value,
  color,
  icon,
}: {
  title: string;
  value: number;
  color: string;
  icon: string;
}) {
  return (
    <div
      style={{
        borderRadius: 14,
        padding: "10px 14px",
        background: "rgba(255,255,255,.02)",
        border: "1px solid rgba(255,255,255,.04)",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        boxSizing: "border-box",
      }}
    >
      <div>
        <div
          style={{
            color: "#8b8b8b",
            fontSize: 10,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.5,
          }}
        >
          {title}
        </div>
        <div style={{ color, fontWeight: 900, fontSize: 20, lineHeight: 1.1 }}>
          {value}
        </div>
      </div>
      <div style={{ fontSize: 18 }}>{icon}</div>
    </div>
  );
}

function HealthItem({ title, status }: Item) {
  const config = {
    ok: {
      color: "#22c55e",
      icon: "🟢",
      label: "Configurado",
    },
    warning: {
      color: "#f59e0b",
      icon: "🟡",
      label: "Pendiente",
    },
    error: {
      color: "#ef4444",
      icon: "🔴",
      label: "Error",
    },
  }[status];

  return (
    <div
      style={{
        borderRadius: 14,
        padding: "12px 14px",
        background: "rgba(255,255,255,.02)",
        border: "1px solid rgba(255,255,255,.04)",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        gap: 8,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ color: "#fff", fontWeight: 700, fontSize: 13 }}>
          {title}
        </span>
        <span style={{ fontSize: 12 }}>{config.icon}</span>
      </div>

      <div
        style={{
          height: 3,
          borderRadius: 99,
          background: "rgba(255,255,255,.06)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: status === "ok" ? "100%" : status === "warning" ? "60%" : "25%",
            height: "100%",
            background: config.color,
            borderRadius: 99,
          }}
        />
      </div>
    </div>
  );
}