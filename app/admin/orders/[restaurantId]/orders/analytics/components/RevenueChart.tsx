"use client";

import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";

interface Props {
  data: {
    day: string;
    sales: number;
    orders: number;
  }[];
}

export default function RevenueChart({
  data,
}: Props) {
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#141414,#0a0a0a)",

        border:
          "1px solid rgba(255,255,255,.07)",

        borderRadius: 24,

        padding: 28,
      }}
    >
      <div
        style={{
          display: "flex",

          justifyContent: "space-between",

          alignItems: "center",

          flexWrap: "wrap",

          gap: 12,

          marginBottom: 22,
        }}
      >
        <div>
          <div
            style={{
              color: "#888",

              fontSize: 13,

              textTransform: "uppercase",

              fontWeight: 700,

              letterSpacing: 1,
            }}
          >
            Tendencia
          </div>

          <h2
            style={{
              margin: "6px 0 0",

              color: "#fff",

              fontSize: 28,

              fontWeight: 800,
            }}
          >
            Ventas por Día
          </h2>
        </div>

        <div
          style={{
            color: "#777",

            fontSize: 14,
          }}
        >
          Datos generados desde pedidos completados
        </div>
      </div>

      <ResponsiveContainer
        width="100%"
        height={420}
      >
        <LineChart data={data}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="#222"
          />

          <XAxis
            dataKey="day"
            stroke="#777"
          />

          <YAxis stroke="#777" />

          <Tooltip
            contentStyle={{
              background: "#111",

              border:
                "1px solid rgba(255,255,255,.08)",

              borderRadius: 12,
            }}
          />

          <Legend />

          <Line
            type="monotone"
            dataKey="sales"
            name="Ventas"
            stroke="#22c55e"
            strokeWidth={3}
            dot={false}
          />

          <Line
            type="monotone"
            dataKey="orders"
            name="Pedidos"
            stroke="#f97316"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </section>
  );
}