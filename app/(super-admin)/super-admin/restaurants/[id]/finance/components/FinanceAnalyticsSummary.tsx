"use client";

interface Props {
  sales: number;
  wolf: number;
  restaurant: number;
  orders: number;
  averageTicket: number;
}

export default function FinanceAnalyticsSummary({
  sales,
  wolf,
  restaurant,
  orders,
  averageTicket,
}: Props) {
  const wolfPercent = sales > 0 ? (wolf / sales) * 100 : 0;
  const restaurantPercent =
    sales > 0 ? (restaurant / sales) * 100 : 0;

  return (
    <section className="summary-section">
      <style jsx>{`
        .summary-section {
          width: 100%;
          min-width: 0;
          margin: 0 0 24px;
        }

        .panel {
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: linear-gradient(180deg, #151515, #0d0d0d);
        }

        .panel > summary {
          list-style: none;
          cursor: pointer;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 64px;
          padding: 0 16px;
        }

        .panel > summary::-webkit-details-marker {
          display: none;
        }

        .heading {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .title {
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }

        .subtitle {
          margin-top: 2px;
          color: #777;
          font-size: 10px;
        }

        .badge {
          flex: 0 0 auto;
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(59, 130, 246, 0.1);
          border: 1px solid rgba(59, 130, 246, 0.18);
          color: #60a5fa;
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .chevron {
          margin-left: 2px;
          color: #666;
          font-size: 14px;
          transition: transform 0.18s ease;
        }

        .panel[open] .chevron {
          transform: rotate(180deg);
        }

        .content {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
          padding: 0 10px 10px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        .metric {
          min-width: 0;
          padding: 15px;
          box-sizing: border-box;
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.025);
          border: 1px solid rgba(255, 255, 255, 0.055);
        }

        .label {
          color: var(--accent);
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }

        .value {
          margin-top: 8px;
          color: #fff;
          font-size: 21px;
          font-weight: 900;
          line-height: 1.05;
          overflow-wrap: anywhere;
        }

        .sub {
          margin-top: 7px;
          color: #777;
          font-size: 10px;
          line-height: 1.4;
        }

        @media (max-width: 850px) {
          .content {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 430px) {
          .panel {
            border-radius: 15px;
          }

          .panel > summary {
            min-height: 58px;
            padding: 0 12px;
          }

          .icon {
            width: 29px;
            height: 29px;
            flex-basis: 29px;
            border-radius: 9px;
          }

          .title {
            font-size: 11px;
          }

          .subtitle {
            font-size: 9px;
          }

          .badge {
            display: none;
          }

          .content {
            gap: 7px;
            padding: 0 8px 8px;
          }

          .metric {
            padding: 12px;
            border-radius: 11px;
          }

          .label {
            font-size: 8px;
          }

          .value {
            font-size: 17px;
          }

          .sub {
            font-size: 9px;
          }
        }
      `}</style>

      <details className="panel" open>
        <summary>
          <span className="heading">
            <span className="icon" aria-hidden="true">
              📈
            </span>

            <span>
              <div className="title">Executive Summary</div>
              <div className="subtitle">
                Resumen financiero generado desde Analytics
              </div>
            </span>
          </span>

          <span>
            <span className="badge">Analytics Engine</span>
            <span className="chevron" aria-hidden="true">
              ⌄
            </span>
          </span>
        </summary>

        <div className="content">
          <Metric
            title="Ventas Totales"
            value={`$${sales.toFixed(2)}`}
            subtitle="Facturación del período"
            accent="#3b82f6"
          />

          <Metric
            title="Comisión Wolf"
            value={`${wolfPercent.toFixed(1)} %`}
            subtitle={`$${wolf.toFixed(2)}`}
            accent="#f97316"
          />

          <Metric
            title="Restaurante"
            value={`${restaurantPercent.toFixed(1)} %`}
            subtitle={`$${restaurant.toFixed(2)}`}
            accent="#22c55e"
          />

          <Metric
            title="Ticket Promedio"
            value={`$${averageTicket.toFixed(2)}`}
            subtitle={`${orders} pedidos`}
            accent="#8b5cf6"
          />
        </div>
      </details>
    </section>
  );
}

function Metric({
  title,
  value,
  subtitle,
  accent,
}: {
  title: string;
  value: string;
  subtitle: string;
  accent: string;
}) {
  return (
    <div
      className="metric"
      style={{ "--accent": accent } as React.CSSProperties}
    >
      <div className="label">{title}</div>
      <div className="value">{value}</div>
      <div className="sub">{subtitle}</div>
    </div>
  );
}