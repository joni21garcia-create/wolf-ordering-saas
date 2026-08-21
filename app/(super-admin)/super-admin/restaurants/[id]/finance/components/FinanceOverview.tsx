"use client";

interface Props {
  salesToday: number;
  salesWeek: number;
  salesMonth: number;
  totalOrders: number;
  averageTicket: number;
}

export default function FinanceOverview({
  salesToday,
  salesWeek,
  salesMonth,
  totalOrders,
  averageTicket,
}: Props) {
  return (
    <section className="finance-overview">
      <style jsx>{`
        .finance-overview {
          width: 100%;
          min-width: 0;
          margin-top: 30px;
          margin-bottom: 34px;
        }

        .header {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 18px;
          margin-bottom: 18px;
        }

        .title {
          margin: 0;
          color: #fff;
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 800;
          line-height: 1.1;
        }

        .description {
          margin: 7px 0 0;
          color: #888;
          font-size: 13px;
          line-height: 1.5;
        }

        .badge {
          flex: 0 0 auto;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(249, 115, 22, 0.08);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.18);
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }

        .card {
          min-width: 0;
          box-sizing: border-box;
          padding: 18px;
          border-radius: 18px;
          background: linear-gradient(180deg, #171717, #101010);
          border: 1px solid rgba(255, 255, 255, 0.07);
          box-shadow: 0 12px 30px rgba(0, 0, 0, 0.22);
        }

        .icon {
          margin-bottom: 12px;
          font-size: 21px;
          line-height: 1;
        }

        .label {
          color: #858585;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.7px;
          text-transform: uppercase;
        }

        .value {
          margin-top: 8px;
          color: #fff;
          font-size: clamp(22px, 2.5vw, 31px);
          font-weight: 900;
          line-height: 1.05;
          overflow-wrap: anywhere;
        }

        @media (max-width: 1050px) {
          .grid {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 680px) {
          .finance-overview {
            margin-top: 24px;
            margin-bottom: 28px;
          }

          .header {
            align-items: flex-start;
            flex-direction: column;
            gap: 10px;
            margin-bottom: 14px;
          }

          .badge {
            padding: 7px 10px;
          }

          .grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 9px;
          }

          .card {
            padding: 15px;
            border-radius: 15px;
          }

          .icon {
            margin-bottom: 10px;
            font-size: 19px;
          }

          .value {
            font-size: 23px;
          }
        }

        @media (max-width: 390px) {
          .grid {
            grid-template-columns: 1fr 1fr;
            gap: 8px;
          }

          .card {
            padding: 13px;
          }

          .label {
            font-size: 9px;
          }

          .value {
            font-size: 20px;
          }
        }
      `}</style>

      <div className="header">
        <div>
          <h2 className="title">📊 Dashboard Financiero</h2>
          <p className="description">
            Resumen general de ventas y rendimiento.
          </p>
        </div>

        <div className="badge">Live Analytics</div>
      </div>

      <div className="grid">
        <MetricCard
          title="Ventas Hoy"
          value={`$${salesToday.toFixed(2)}`}
          icon="💰"
        />

        <MetricCard
          title="Ventas Semana"
          value={`$${salesWeek.toFixed(2)}`}
          icon="📅"
        />

        <MetricCard
          title="Ventas Mes"
          value={`$${salesMonth.toFixed(2)}`}
          icon="📈"
        />

        <MetricCard
          title="Pedidos"
          value={totalOrders}
          icon="📦"
        />

        <MetricCard
          title="Ticket Promedio"
          value={`$${averageTicket.toFixed(2)}`}
          icon="🧾"
        />
      </div>
    </section>
  );
}

function MetricCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string | number;
  icon: string;
}) {
  return (
    <div className="card">
      <div className="icon" aria-hidden="true">
        {icon}
      </div>

      <div className="label">{title}</div>

      <div className="value">{value}</div>
    </div>
  );
}