"use client";

interface Liquidation {
  id?: string;
  month?: number;
  year?: number;
  sales_total?: number;
  wolf_total?: number;
  restaurant_total?: number;
  total_orders?: number;
  status?: string;
}

interface Props {
  liquidation: Liquidation | null;
  sales: number;
  wolf: number;
  restaurant: number;
  orders: number;
}

export default function FinanceLiquidationCurrent({
  liquidation,
  sales,
  wolf,
  restaurant,
  orders,
}: Props) {
  const status = liquidation?.status ?? "pending";
  const paid = status === "paid";

  return (
    <section className="liquidation-section">
      <style jsx>{`
        .liquidation-section {
          width: 100%;
          min-width: 0;
          margin: 0 0 24px;
        }

        .panel {
          width: 100%;
          min-width: 0;
          overflow: hidden;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          background: linear-gradient(180deg,#151515,#0d0d0d);
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
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.06);
          font-size: 15px;
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

        .right {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .badge {
          padding: 6px 9px;
          border-radius: 999px;
          background: ${paid
            ? "rgba(34,197,94,.10)"
            : "rgba(245,158,11,.10)"};
          border: 1px solid ${paid
            ? "rgba(34,197,94,.18)"
            : "rgba(245,158,11,.18)"};
          color: ${paid ? "#22c55e" : "#f59e0b"};
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .chevron {
          color: #666;
          font-size: 14px;
          transition: transform .18s ease;
        }

        .panel[open] .chevron {
          transform: rotate(180deg);
        }

        .content {
          display: grid;
          grid-template-columns: repeat(6, minmax(0, 1fr));
          gap: 8px;
          padding: 0 10px 10px;
          border-top: 1px solid rgba(255,255,255,.05);
        }

        .metric {
          min-width: 0;
          box-sizing: border-box;
          padding: 14px;
          border-radius: 13px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.055);
        }

        .label {
          color: #777;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .value {
          margin-top: 7px;
          color: #fff;
          font-size: 16px;
          font-weight: 900;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .orange {
          color: #f97316;
        }

        .green {
          color: #22c55e;
        }

        .pending {
          color: #f59e0b;
        }

        @media (max-width: 1050px) {
          .content {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 650px) {
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
            font-size: 13px;
          }

          .title {
            font-size: 11px;
          }

          .subtitle {
            font-size: 9px;
          }

          .badge {
            padding: 5px 7px;
            font-size: 8px;
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
            font-size: 14px;
          }
        }
      `}</style>

      <details className="panel" open>
        <summary>
          <span className="heading">
            <span className="icon" aria-hidden="true">
              💳
            </span>

            <span>
              <span className="title">Liquidación Actual</span>
              <span className="subtitle">
                Información oficial de la liquidación vigente
              </span>
            </span>
          </span>

          <span className="right">
            <span className="badge">
              {paid ? "Pagada" : "Pendiente"}
            </span>

            <span className="chevron" aria-hidden="true">
              ⌄
            </span>
          </span>
        </summary>

        <div className="content">
          <Metric
            title="Periodo"
            value={
              liquidation
                ? `${liquidation.month}/${liquidation.year}`
                : "Sin liquidación"
            }
          />

          <Metric title="Ventas" value={`$${sales.toFixed(2)}`} />

          <Metric
            title="Wolf"
            value={`$${wolf.toFixed(2)}`}
            tone="orange"
          />

          <Metric
            title="Restaurante"
            value={`$${restaurant.toFixed(2)}`}
            tone="green"
          />

          <Metric title="Pedidos" value={orders} />

          <Metric
            title="Estado"
            value={paid ? "Pagado" : "Pendiente"}
            tone={paid ? "green" : "pending"}
          />
        </div>
      </details>
    </section>
  );
}

function Metric({
  title,
  value,
  tone,
}: {
  title: string;
  value: string | number;
  tone?: "orange" | "green" | "pending";
}) {
  return (
    <div className="metric">
      <div className="label">{title}</div>
      <div className={`value ${tone ?? ""}`}>{value}</div>
    </div>
  );
}