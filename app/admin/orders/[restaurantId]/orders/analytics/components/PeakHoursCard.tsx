"use client";

interface Props {
  hours: {
    hour: string;
    total: number;
  }[];
}

export default function PeakHoursCard({
  hours,
}: Props) {
  const max = Math.max(
    ...hours.map((h) => h.total),
    1
  );

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#141414,#0a0a0a)",

        border:
          "1px solid rgba(255,255,255,.07)",

        borderRadius: 24,

        padding: 26,
      }}
    >
      <div
        style={{
          color: "#888",
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Comportamiento
      </div>

      <h2
        style={{
          margin: "8px 0 26px",
          color: "#fff",
          fontSize: 26,
          fontWeight: 800,
        }}
      >
        Horas Pico
      </h2>

      <div
        style={{
          display: "grid",
          gap: 16,
        }}
      >
        {hours.map((item) => {

          const percent =
            (item.total / max) * 100;

          return (
            <div key={item.hour}>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",

                  marginBottom: 8,
                }}
              >
                <span
                  style={{
                    color: "#fff",
                    fontWeight: 600,
                  }}
                >
                  🕒 {item.hour}
                </span>

                <span
                  style={{
                    color: "#aaa",
                    fontWeight: 700,
                  }}
                >
                  {item.total} pedidos
                </span>
              </div>

              <div
                style={{
                  height: 10,

                  background:
                    "rgba(255,255,255,.06)",

                  borderRadius: 999,

                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,

                    height: "100%",

                    background:
                      "#f97316",

                    borderRadius: 999,

                    transition: ".3s",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}