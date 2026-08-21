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
import { useEffect, useRef, useState } from "react";

interface Props {
  data: {
    day: string;
    sales: number;
    orders: number;
  }[];
}

export default function RevenueChart({ data }: Props) {
  const chartRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const element = chartRef.current;

    if (!element) return;

    const updateSize = () => {
      const { width, height } = element.getBoundingClientRect();
      setReady(width > 0 && height > 0);
    };

    updateSize();

    const observer = new ResizeObserver(updateSize);
    observer.observe(element);

    return () => observer.disconnect();
  }, []);

  return (
    <section className="revenue-chart">
      <style jsx>{`
        .revenue-chart {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          background: linear-gradient(180deg, #141414, #0a0a0a);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 24px;
          padding: 28px;
          overflow: hidden;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 16px;
          margin-bottom: 20px;
        }

        .eyebrow {
          color: #888;
          font-size: 12px;
          text-transform: uppercase;
          font-weight: 700;
          letter-spacing: 1px;
        }

        .title {
          margin: 6px 0 0;
          color: #fff;
          font-size: 28px;
          font-weight: 800;
          line-height: 1.1;
        }

        .description {
          color: #777;
          font-size: 13px;
          line-height: 1.45;
          text-align: right;
          max-width: 240px;
        }

        .chart {
          width: 100%;
          height: 420px;
          min-width: 0;
          min-height: 1px;
        }

        .chart-placeholder {
          width: 100%;
          height: 100%;
          min-height: 1px;
        }

        @media (max-width: 700px) {
          .revenue-chart {
            border-radius: 20px;
            padding: 18px 12px 14px;
          }

          .header {
            align-items: flex-start;
            flex-direction: column;
            gap: 8px;
            margin-bottom: 12px;
          }

          .title {
            font-size: 22px;
          }

          .description {
            max-width: none;
            text-align: left;
            font-size: 12px;
          }

          .chart {
            height: 280px;
          }
        }

        @media (max-width: 380px) {
          .revenue-chart {
            padding-left: 8px;
            padding-right: 8px;
          }

          .chart {
            height: 250px;
          }
        }
      `}</style>

      <div className="header">
        <div>
          <div className="eyebrow">Tendencia</div>
          <h2 className="title">Ventas por Día</h2>
        </div>

        <div className="description">
          Datos generados desde pedidos completados
        </div>
      </div>

      <div ref={chartRef} className="chart">
        {ready && (
          <ResponsiveContainer width="100%" height="100%" minWidth={1}>
            <LineChart
              data={data}
              margin={{
                top: 8,
                right: 8,
                left: -18,
                bottom: 4,
              }}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#222"
                vertical={false}
              />

              <XAxis
                dataKey="day"
                stroke="#777"
                tick={{
                  fill: "#777",
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={false}
                minTickGap={18}
              />

              <YAxis
                stroke="#777"
                tick={{
                  fill: "#777",
                  fontSize: 11,
                }}
                tickLine={false}
                axisLine={false}
                width={42}
              />

              <Tooltip
                contentStyle={{
                  background: "#111",
                  border: "1px solid rgba(255,255,255,.08)",
                  borderRadius: 12,
                  color: "#fff",
                }}
                labelStyle={{
                  color: "#aaa",
                }}
              />

              <Legend
                wrapperStyle={{
                  fontSize: 12,
                  paddingTop: 8,
                }}
              />

              <Line
                type="monotone"
                dataKey="sales"
                name="Ventas"
                stroke="#22c55e"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />

              <Line
                type="monotone"
                dataKey="orders"
                name="Pedidos"
                stroke="#f97316"
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 5 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}