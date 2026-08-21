"use client";

interface Liquidation {
  id: string;
  month: number;
  year: number;
  sales_total: number;
  wolf_total: number;
  restaurant_total: number;
  total_orders: number;
  status: string;
}

interface Props {
  liquidations: Liquidation[];
  currentId?: string;
}

export default function FinanceHistoryTable({
  liquidations,
  currentId,
}: Props) {
  const history = liquidations.filter(
    (item) => item.id !== currentId
  );

  return (
    <section className="history-section">
      <style jsx>{`
        .history-section {
          width: 100%;
          min-width: 0;
          margin: 0 0 24px;
        }

        .panel {
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.07);
          background: linear-gradient(180deg,#151515,#0d0d0d);
        }

        .panel > summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          min-height: 64px;
          padding: 0 16px;
        }

        .panel > summary::-webkit-details-marker {
          display: none;
        }

        .heading {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.06);
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

        .count {
          color: #aaa;
          font-size: 11px;
          font-weight: 800;
        }

        .content {
          padding: 0 10px 12px;
          border-top: 1px solid rgba(255,255,255,.05);
        }

        .table-wrap {
          overflow-x: auto;
          border-radius: 14px;
        }

        table {
          width: 100%;
          min-width: 760px;
          border-collapse: collapse;
        }

        th {
          padding: 14px;
          text-align: left;
          color: #777;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        td {
          padding: 14px;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          border-top: 1px solid rgba(255,255,255,.05);
        }

        .orange {
          color: #f97316;
        }

        .green {
          color: #22c55e;
        }

        .status {
          display: inline-flex;
          padding: 6px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 800;
        }

        .paid {
          background: rgba(34,197,94,.12);
          color: #22c55e;
        }

        .pending {
          background: rgba(245,158,11,.12);
          color: #f59e0b;
        }

        @media (max-width:560px) {
          .panel {
            border-radius: 15px;
          }

          .panel > summary {
            min-height: 58px;
            padding: 0 12px;
          }

          .title {
            font-size: 11px;
          }

          .subtitle {
            font-size: 9px;
          }

          .content {
            padding: 0 8px 8px;
          }

          td {
            padding: 12px;
          }
        }
      `}</style>

      <details className="panel" open>
        <summary>
          <span className="heading">
            <span className="icon">📜</span>

            <span>
              <div className="title">
                Historial de Liquidaciones
              </div>
              <div className="subtitle">
                Liquidaciones anteriores del restaurante
              </div>
            </span>
          </span>

          <span className="count">
            {history.length} registros
          </span>
        </summary>

        <div className="content">
          <div className="table-wrap">
            <table>
              <thead>
                <tr>
                  <th>Periodo</th>
                  <th>Ventas</th>
                  <th>Wolf</th>
                  <th>Restaurante</th>
                  <th>Pedidos</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                {history.map((item) => (
                  <tr key={item.id}>
                    <td>
                      {item.month}/{item.year}
                    </td>

                    <td>
                      ${Number(item.sales_total).toFixed(2)}
                    </td>

                    <td className="orange">
                      ${Number(item.wolf_total).toFixed(2)}
                    </td>

                    <td className="green">
                      ${Number(item.restaurant_total).toFixed(2)}
                    </td>

                    <td>
                      {item.total_orders}
                    </td>

                    <td>
                      <Status status={item.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </details>
    </section>
  );
}

function Status({ status }: { status: string }) {
  const paid = status === "paid";

  return (
    <span className={`status ${paid ? "paid" : "pending"}`}>
      {paid ? "Pagado" : "Pendiente"}
    </span>
  );
}