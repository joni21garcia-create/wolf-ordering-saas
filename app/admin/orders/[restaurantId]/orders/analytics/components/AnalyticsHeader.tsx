 "use client";

import Link from "next/link";

interface Props {
  restaurantId: string;
  totalOrders: number;
  updatedAt?: string;
}

export default function AnalyticsHeader({
  restaurantId,
  totalOrders,
  updatedAt,
}: Props) {
  return (
    <section className="analytics-header">
      <style jsx>{`
        .analytics-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 24px;
          margin-bottom: 26px;
        }

        .main {
          min-width: 0;
        }

        .back {
          display: inline-flex;
          align-items: center;
          color: #f97316;
          text-decoration: none;
          font-weight: 700;
          font-size: 14px;
          min-height: 32px;
        }

        .eyebrow {
          margin-top: 18px;
          color: #777;
          font-size: 11px;
          letter-spacing: 2.2px;
          font-weight: 700;
          text-transform: uppercase;
        }

        .title {
          margin: 7px 0 9px;
          color: #fff;
          font-weight: 900;
          font-size: clamp(34px, 5vw, 58px);
          line-height: 0.98;
          letter-spacing: -1.8px;
        }

        .description {
          margin: 0;
          color: #9ca3af;
          font-size: 15px;
          max-width: 720px;
          line-height: 1.55;
        }

        .info {
          display: grid;
          grid-template-columns: repeat(2, minmax(140px, 1fr));
          gap: 10px;
          width: min(100%, 390px);
          flex-shrink: 0;
        }

        .info-card {
          min-width: 0;
          padding: 15px 16px;
          border-radius: 18px;
          border: 1px solid color-mix(in srgb, var(--accent) 18%, transparent);
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.045),
              rgba(255, 255, 255, 0.018)
            );
          backdrop-filter: blur(12px);
        }

        .info-title {
          color: #777;
          font-size: 10px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .info-value {
          margin-top: 7px;
          color: var(--accent);
          font-size: 18px;
          font-weight: 800;
          line-height: 1.25;
          word-break: break-word;
        }

        @media (max-width: 760px) {
          .analytics-header {
            flex-direction: column;
            gap: 16px;
            margin-bottom: 20px;
          }

          .info {
            width: 100%;
            max-width: none;
          }

          .eyebrow {
            margin-top: 14px;
          }

          .title {
            font-size: clamp(34px, 12vw, 48px);
          }

          .description {
            font-size: 14px;
            line-height: 1.5;
          }
        }

        @media (max-width: 430px) {
          .info {
            gap: 8px;
          }

          .info-card {
            padding: 13px 12px;
            border-radius: 15px;
          }

          .info-value {
            font-size: 16px;
          }

          .description {
            font-size: 13px;
          }
        }
      `}</style>

      <div className="main">
        <Link
          href={`/admin/orders/${restaurantId}/orders`}
          className="back"
        >
          ← Volver al panel
        </Link>

        <div className="eyebrow">Revenue Intelligence</div>

        <h1 className="title">Analytics</h1>

        <p className="description">
          Analiza ventas, pedidos, comisiones, métodos de pago,
          comportamiento del restaurante y métricas financieras en tiempo real.
        </p>
      </div>

      <div className="info">
        <InfoCard
          title="Pedidos"
          value={totalOrders.toString()}
          color="#f97316"
        />

        <InfoCard
          title="Actualizado"
          value={
            updatedAt
              ? new Date(updatedAt).toLocaleString()
              : "Tiempo real"
          }
          color="#22c55e"
        />
      </div>
    </section>
  );
}

function InfoCard({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color: string;
}) {
  return (
    <div
      className="info-card"
      style={{ "--accent": color } as React.CSSProperties}
    >
      <div className="info-title">{title}</div>
      <div className="info-value">{value}</div>
    </div>
  );
}