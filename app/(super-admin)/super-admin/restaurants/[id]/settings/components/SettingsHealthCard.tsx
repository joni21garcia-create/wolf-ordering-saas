"use client";

interface Item {
  title: string;
  status: "ok" | "warning" | "error";
}

interface Props {
  items: Item[];
}

export default function SettingsHealthCard({
  items,
}: Props) {
  const total = items.length;

  const ok = items.filter(
    (x) => x.status === "ok"
  ).length;

  const warning = items.filter(
    (x) => x.status === "warning"
  ).length;

  const error = items.filter(
    (x) => x.status === "error"
  ).length;

  const progress =
    total === 0
      ? 0
      : Math.round((ok / total) * 100);

  return (
    <section
      style={{
        position: "relative",

        overflow: "hidden",

        marginBottom: 36,

        borderRadius: 30,

        background:
          "linear-gradient(180deg,#181818,#0d0d0d)",

        border:
          "1px solid rgba(255,255,255,.07)",

        padding: 30,

        boxShadow:
          "0 20px 60px rgba(0,0,0,.22)",
      }}
    >
      {/* Glow */}

      <div
        style={{
          position: "absolute",

          top: -100,

          right: -100,

          width: 220,

          height: 220,

          borderRadius: "50%",

          background:
            "rgba(34,197,94,.12)",

          filter: "blur(45px)",
        }}
      />

      {/* Header */}

      <div
        style={{
          position: "relative",

          zIndex: 2,

          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 24,

          marginBottom: 26,
        }}
      >
        <div>
          <div
            style={{
              color: "#22c55e",

              fontWeight: 800,

              letterSpacing: 2,

              fontSize: 13,

              textTransform: "uppercase",
            }}
          >
            HEALTH CENTER
          </div>

          <h2
            style={{
              color: "#fff",

              margin: "10px 0",

              fontSize: "clamp(30px,4vw,38px)",

              fontWeight: 900,
            }}
          >
            Estado del Restaurante
          </h2>

          <p
            style={{
              color: "#8f8f8f",

              maxWidth: 700,

              lineHeight: 1.8,

              margin: 0,
            }}
          >
            Revisa rápidamente qué módulos ya
            están configurados y cuáles aún
            requieren atención.
          </p>
        </div>

        <div
          style={{
            minWidth: 210,
          }}
        >
          <div
            style={{
              display: "flex",

              justifyContent:
                "space-between",

              marginBottom: 10,

              color: "#fff",

              fontWeight: 700,
            }}
          >
            <span>Estado General</span>

            <span>{progress}%</span>
          </div>

          <div
            style={{
              height: 10,

              borderRadius: 999,

              background:
                "rgba(255,255,255,.08)",

              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,

                height: "100%",

                borderRadius: 999,

                background:
                  "linear-gradient(90deg,#22c55e,#16a34a)",
              }}
            />
          </div>

          <div
            style={{
              marginTop: 12,

              display: "flex",

              justifyContent:
                "space-between",

              color: "#9a9a9a",

              fontSize: 13,
            }}
          >
            <span>
              {ok}/{total} módulos listos
            </span>

            <span>
              {warning + error} pendientes
            </span>
          </div>
        </div>
      </div>

      {/* Resumen */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(180px,1fr))",

          gap: 18,

          marginBottom: 28,
        }}
      >
        <SummaryCard
          title="Configurados"
          value={ok}
          color="#22c55e"
          icon="✅"
        />

        <SummaryCard
          title="Pendientes"
          value={warning}
          color="#f59e0b"
          icon="🟡"
        />

        <SummaryCard
          title="Errores"
          value={error}
          color="#ef4444"
          icon="⚠️"
        />

        <SummaryCard
          title="Total"
          value={total}
          color="#3b82f6"
          icon="📦"
        />
      </div>

      {/* Grid */}

      <div
        style={{
          display: "grid",

          gridTemplateColumns:
            "repeat(auto-fit,minmax(230px,1fr))",

          gap: 18,
        }}
      >
        {items.map((item) => (
          <HealthItem
            key={item.title}
            {...item}
          />
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
        borderRadius: 22,

        padding: 20,

        background:
          "rgba(255,255,255,.03)",

        border:
          "1px solid rgba(255,255,255,.06)",
      }}
    >
      <div
        style={{
          fontSize: 28,

          marginBottom: 12,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          color: "#8b8b8b",

          fontSize: 13,

          fontWeight: 700,

          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color,

          fontWeight: 900,

          fontSize: 34,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function HealthItem({
  title,
  status,
}: Item) {
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
      label: "Requiere revisión",
    },
  }[status];

  return (
    <div
      style={{
        borderRadius: 22,

        padding: 22,

        background:
          "rgba(255,255,255,.03)",

        border:
          "1px solid rgba(255,255,255,.06)",

        transition: ".25s",
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent:
            "space-between",

          alignItems: "center",

          marginBottom: 18,
        }}
      >
        <span
          style={{
            fontSize: 28,
          }}
        >
          {config.icon}
        </span>

        <span
          style={{
            color: config.color,

            fontSize: 12,

            fontWeight: 800,

            letterSpacing: 1,
          }}
        >
          {config.label.toUpperCase()}
        </span>
      </div>

      <div
        style={{
          color: "#fff",

          fontWeight: 800,

          fontSize: 18,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 14,

          height: 6,

          borderRadius: 999,

          background:
            "rgba(255,255,255,.06)",

          overflow: "hidden",
        }}
      >
        <div
          style={{
            width:
              status === "ok"
                ? "100%"
                : status ===
                  "warning"
                ? "55%"
                : "20%",

            height: "100%",

            background:
              config.color,

            borderRadius: 999,
          }}
        />
      </div>
    </div>
  );
}