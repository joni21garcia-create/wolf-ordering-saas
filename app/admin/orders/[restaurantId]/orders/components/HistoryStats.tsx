"use client";

interface Props {
  orders: any[];
}

export default function HistoryStats({
  orders,
}: Props) {
  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (sum, order) =>
      sum + Number(order.total ?? 0),
    0
  );

  const cancelled = orders.filter(
    (o) => o.status === "cancelled"
  ).length;

  const average =
    totalOrders === 0
      ? 0
      : totalSales / totalOrders;

  return (
    <section className="stats-grid">
      <Card
        title="Pedidos"
        value={totalOrders}
        color="#f97316"
        subtitle="Resultados encontrados"
      />

      <Card
        title="Ventas"
        value={`$${totalSales.toFixed(2)}`}
        color="#22c55e"
        subtitle="Total vendido"
      />

      <Card
        title="Ticket promedio"
        value={`$${average.toFixed(2)}`}
        color="#3b82f6"
        subtitle="Promedio por pedido"
      />

      <Card
        title="Cancelados"
        value={cancelled}
        color="#ef4444"
        subtitle="Pedidos cancelados"
      />

      <style jsx>{`
        .stats-grid {
          width: 100%;
          display: grid;
          grid-template-columns: repeat(
            4,
            minmax(0, 1fr)
          );
          gap: 16px;
          margin-bottom: 24px;
        }

        @media (max-width: 1100px) {
          .stats-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
          }
        }

        @media (max-width: 600px) {
          .stats-grid {
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
            gap: 10px;
            margin-bottom: 18px;
          }
        }

        @media (max-width: 360px) {
          .stats-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function Card({
  title,
  value,
  color,
  subtitle,
}: {
  title: string;
  value: string | number;
  color: string;
  subtitle: string;
}) {
  return (
    <div
      className="card"
      style={
        {
          "--accent": color,
        } as React.CSSProperties
      }
    >
      <div className="accent" />

      <div className="title">
        {title}
      </div>

      <div className="value">
        {value}
      </div>

      <div className="subtitle">
        {subtitle}
      </div>

      <style jsx>{`
        .card {
          position: relative;
          min-width: 0;
          overflow: hidden;
          box-sizing: border-box;
          padding: 20px;
          border: 1px solid
            rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.015)
            );
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .card:hover {
          transform: translateY(-2px);
          border-color: color-mix(
            in srgb,
            var(--accent) 25%,
            transparent
          );
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.055),
              rgba(255, 255, 255, 0.02)
            );
        }

        .accent {
          position: absolute;
          top: 0;
          left: 20px;
          width: 34px;
          height: 2px;
          border-radius: 0 0 4px 4px;
          background: var(--accent);
          opacity: 0.9;
        }

        .title {
          overflow: hidden;
          color: #888;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.9px;
          line-height: 1.2;
          text-overflow: ellipsis;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .value {
          margin-top: 10px;
          overflow: hidden;
          color: var(--accent);
          font-size: clamp(26px, 3vw, 40px);
          font-weight: 900;
          letter-spacing: -1px;
          line-height: 1.05;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .subtitle {
          margin-top: 7px;
          overflow: hidden;
          color: #666;
          font-size: 10px;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 600px) {
          .card {
            padding: 15px;
            border-radius: 15px;
          }

          .accent {
            left: 15px;
            width: 28px;
          }

          .title {
            font-size: 9px;
            letter-spacing: 0.7px;
          }

          .value {
            margin-top: 8px;
            font-size: 25px;
            letter-spacing: -0.7px;
          }

          .subtitle {
            margin-top: 5px;
            font-size: 9px;
          }
        }

        @media (max-width: 360px) {
          .card {
            padding: 16px;
          }

          .value {
            font-size: 28px;
          }
        }
      `}</style>
    </div>
  );
}