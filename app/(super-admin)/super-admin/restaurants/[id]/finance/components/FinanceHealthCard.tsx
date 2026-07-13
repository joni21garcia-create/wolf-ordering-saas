"use client";

interface HealthItem {
  title: string;
  status: "ok" | "warning";
}

interface Props {
  items: readonly HealthItem[];
}

export default function FinanceHealthCard({
  items,
}: Props) {
  const ok =
    items.filter(
      (item) => item.status === "ok"
    ).length;

  return (
    <section
      style={{
        marginTop: 40,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 20,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            🩺 Salud Financiera
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#888",
            }}
          >
            Estado general de la configuración financiera.
          </p>
        </div>

        <div
          style={{
            background:
              ok === items.length
                ? "rgba(34,197,94,.15)"
                : "rgba(245,158,11,.15)",

            border:
              ok === items.length
                ? "1px solid rgba(34,197,94,.30)"
                : "1px solid rgba(245,158,11,.30)",

            color:
              ok === items.length
                ? "#22c55e"
                : "#f59e0b",

            padding: "12px 18px",

            borderRadius: 999,

            fontWeight: 800,
          }}
        >
          {ok} / {items.length} Correctos
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 18,
        }}
      >
        {items.map((item) => (
          <div
            key={item.title}
            style={{
              background:
                "linear-gradient(180deg,#171717,#101010)",

              border:
                "1px solid rgba(255,255,255,.07)",

              borderRadius: 20,

              padding: 22,

              display: "flex",

              justifyContent: "space-between",

              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight: 700,
                }}
              >
                {item.title}
              </div>

              <div
                style={{
                  marginTop: 8,

                  color:
                    item.status === "ok"
                      ? "#22c55e"
                      : "#f59e0b",

                  fontWeight: 700,
                }}
              >
                {item.status === "ok"
                  ? "Configurado"
                  : "Pendiente"}
              </div>
            </div>

            <div
              style={{
                width: 18,
                height: 18,
                borderRadius: 999,
                background:
                  item.status === "ok"
                    ? "#22c55e"
                    : "#f59e0b",

                boxShadow:
                  item.status === "ok"
                    ? "0 0 20px rgba(34,197,94,.5)"
                    : "0 0 20px rgba(245,158,11,.5)",
              }}
            />
          </div>
        ))}
      </div>
    </section>
  );
}