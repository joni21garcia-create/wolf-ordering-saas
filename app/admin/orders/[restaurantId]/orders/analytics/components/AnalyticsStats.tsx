 "use client";

interface Props {
  salesTotal: number;
  wolfTotal: number;
  restaurantTotal: number;
  totalOrders: number;
  avgTicket: number;
  deliveryOrders: number;
  pickupOrders: number;
  cancelledOrders: number;
}

export default function AnalyticsStats({
  salesTotal,
  wolfTotal,
  restaurantTotal,
  totalOrders,
  avgTicket,
  deliveryOrders,
  pickupOrders,
  cancelledOrders,
}: Props) {
  return (
    <section className="stats">
      <style jsx>{`
        .stats {
          width: 100%;
          min-width: 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 24px;
        }

        @media (max-width: 1100px) {
          .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .stats {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
            margin-bottom: 18px;
          }
        }
      `}</style>

      <Card title="Ventas" value={money(salesTotal)} color="#22c55e" />
      <Card title="Pedidos" value={totalOrders} color="#f97316" />
      <Card title="Wolf" value={money(wolfTotal)} color="#ef4444" />
      <Card
        title="Restaurante"
        value={money(restaurantTotal)}
        color="#3b82f6"
      />
      <Card
        title="Ticket Promedio"
        value={money(avgTicket)}
        color="#a855f7"
      />
      <Card title="Delivery" value={deliveryOrders} color="#06b6d4" />
      <Card title="Pickup" value={pickupOrders} color="#14b8a6" />
      <Card title="Cancelados" value={cancelledOrders} color="#dc2626" />
    </section>
  );
}

function Card({
  title,
  value,
  color,
}: {
  title: string;
  value: string | number;
  color: string;
}) {
  return (
    <article
      className="card"
      style={{ "--accent": color } as React.CSSProperties}
    >
      <style jsx>{`
        .card {
          min-width: 0;
          box-sizing: border-box;
          background:
            linear-gradient(180deg, #151515 0%, #0b0b0b 100%);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 20px;
          padding: 18px 18px 17px;
          display: flex;
          flex-direction: column;
          gap: 9px;
          position: relative;
          overflow: hidden;
        }

        .card::before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 2px;
          background: var(--accent);
          opacity: 0.8;
        }

        .label {
          color: #888;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.8px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .value {
          color: var(--accent);
          font-size: clamp(22px, 2.5vw, 32px);
          font-weight: 900;
          line-height: 1;
          letter-spacing: -0.6px;
          overflow-wrap: anywhere;
        }

        @media (max-width: 560px) {
          .card {
            border-radius: 16px;
            padding: 15px 13px 14px;
            gap: 8px;
          }

          .label {
            font-size: 9px;
            letter-spacing: 0.55px;
          }

          .value {
            font-size: clamp(18px, 6vw, 25px);
            letter-spacing: -0.4px;
          }
        }

        @media (max-width: 360px) {
          .card {
            padding-left: 11px;
            padding-right: 11px;
          }

          .value {
            font-size: 18px;
          }
        }
      `}</style>

      <div className="label">{title}</div>
      <div className="value">{value}</div>
    </article>
  );
}

function money(value: number) {
  return `$${Number(value).toFixed(2)}`;
}