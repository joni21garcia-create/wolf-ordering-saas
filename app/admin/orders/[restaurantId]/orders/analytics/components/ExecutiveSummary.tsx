 "use client";

interface Props {
  salesTotal: number;
  wolfTotal: number;
  restaurantTotal: number;
  avgTicket: number;
  totalOrders: number;
  deliveryOrders: number;
  pickupOrders: number;
}

export default function ExecutiveSummary({
  salesTotal,
  wolfTotal,
  restaurantTotal,
  avgTicket,
  totalOrders,
  deliveryOrders,
  pickupOrders,
}: Props) {
  const deliveryPercent =
    totalOrders === 0 ? 0 : (deliveryOrders / totalOrders) * 100;

  const pickupPercent =
    totalOrders === 0 ? 0 : (pickupOrders / totalOrders) * 100;

  return (
    <section className="summary">
      <style jsx>{`
        .summary {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          background: linear-gradient(180deg, #141414, #0a0a0a);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          padding: 22px;
          margin-bottom: 24px;
        }

        .eyebrow {
          color: #888;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .title {
          margin: 7px 0 20px;
          color: #fff;
          font-size: 25px;
          font-weight: 800;
          line-height: 1.1;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 10px;
        }

        @media (max-width: 950px) {
          .metrics {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 560px) {
          .summary {
            border-radius: 18px;
            padding: 15px;
            margin-bottom: 18px;
          }

          .title {
            font-size: 21px;
            margin-bottom: 14px;
          }

          .metrics {
            gap: 8px;
          }
        }
      `}</style>

      <div className="eyebrow">Ejecutivo</div>
      <h2 className="title">Resumen Financiero</h2>

      <div className="metrics">
        <Metric label="Ventas" value={money(salesTotal)} />
        <Metric label="Wolf" value={money(wolfTotal)} />
        <Metric label="Restaurante" value={money(restaurantTotal)} />
        <Metric label="Ticket promedio" value={money(avgTicket)} />
        <Metric label="Pedidos" value={String(totalOrders)} />
        <Metric label="% Delivery" value={`${deliveryPercent.toFixed(1)}%`} />
        <Metric label="% Pickup" value={`${pickupPercent.toFixed(1)}%`} />
        <Metric
          label="Ganancia promedio"
          value={
            totalOrders === 0
              ? "$0.00"
              : money(restaurantTotal / totalOrders)
          }
        />
      </div>
    </section>
  );
}

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="metric">
      <style jsx>{`
        .metric {
          min-width: 0;
          box-sizing: border-box;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          padding: 15px;
          overflow: hidden;
        }

        .label {
          color: #888;
          font-size: 11px;
          margin-bottom: 8px;
          line-height: 1.25;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .value {
          color: #fff;
          font-size: clamp(18px, 2.2vw, 24px);
          font-weight: 800;
          line-height: 1.1;
          letter-spacing: -0.4px;
          overflow-wrap: anywhere;
        }

        @media (max-width: 560px) {
          .metric {
            padding: 12px;
            border-radius: 14px;
          }

          .label {
            font-size: 9px;
            margin-bottom: 6px;
          }

          .value {
            font-size: clamp(16px, 5vw, 21px);
          }
        }
      `}</style>

      <div className="label">{label}</div>
      <div className="value">{value}</div>
    </div>
  );
}

function money(value: number) {
  return `$${Number(value).toFixed(2)}`;
}