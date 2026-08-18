"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

interface Props {
  restaurantId: string;
  orders: any[];
}

export default function HistoryTable({
  restaurantId,
  orders,
}: Props) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <section className="history-table-wrapper">
      {/* =====================================================
          DESKTOP
      ===================================================== */}
      <div className="desktop-table">
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                {[
                  "Tracking",
                  "Cliente",
                  "Fecha",
                  "Estado",
                  "Pago",
                  "Tipo",
                  "Total",
                  "",
                ].map((title) => (
                  <th key={title}>
                    {title}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order.id}>
                  <Cell>
                    <strong className="tracking">
                      {order.tracking_code}
                    </strong>
                  </Cell>

                  <Cell>
                    <div className="customer">
                      <strong>
                        {order.customer_name}
                      </strong>

                      <span>
                        {order.customer_phone}
                      </span>
                    </div>
                  </Cell>

                  <Cell>
                    <span className="date">
                      {new Date(
                        order.created_at
                      ).toLocaleString()}
                    </span>
                  </Cell>

                  <Cell>
                    <StatusBadge
                      status={order.status}
                    />
                  </Cell>

                  <Cell>
                    <span className="payment">
                      {order.payment_status}
                    </span>
                  </Cell>

                  <Cell>
                    <span className="order-type">
                      {order.order_type}
                    </span>
                  </Cell>

                  <Cell>
                    <strong className="total">
                      $
                      {Number(
                        order.total
                      ).toFixed(2)}
                    </strong>
                  </Cell>

                  <Cell>
                    <DetailButton
                      restaurantId={restaurantId}
                      orderId={order.id}
                    />
                  </Cell>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* =====================================================
          MOBILE
      ===================================================== */}
      <div className="mobile-list">
        {orders.map((order) => (
          <article
            key={order.id}
            className="order-card"
          >
            <div className="card-header">
              <div>
                <span className="card-label">
                  TRACKING
                </span>

                <strong className="card-tracking">
                  {order.tracking_code}
                </strong>
              </div>

              <StatusBadge
                status={order.status}
              />
            </div>

            <div className="card-divider" />

            <div className="customer-block">
              <span className="card-label">
                CLIENTE
              </span>

              <strong>
                {order.customer_name}
              </strong>

              {order.customer_phone && (
                <span>
                  {order.customer_phone}
                </span>
              )}
            </div>

            <div className="info-grid">
              <InfoItem
                label="Fecha"
                value={new Date(
                  order.created_at
                ).toLocaleString()}
              />

              <InfoItem
                label="Pago"
                value={
                  order.payment_status
                }
              />

              <InfoItem
                label="Tipo"
                value={order.order_type}
              />

              <div className="info-item">
                <span className="card-label">
                  TOTAL
                </span>

                <strong className="mobile-total">
                  $
                  {Number(
                    order.total
                  ).toFixed(2)}
                </strong>
              </div>
            </div>

            <DetailButton
              restaurantId={restaurantId}
              orderId={order.id}
              mobile
            />
          </article>
        ))}
      </div>

      <style jsx>{`
        .history-table-wrapper {
          width: 100%;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 24px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.04),
              rgba(255, 255, 255, 0.015)
            );
        }

        /* =========================
           DESKTOP
        ========================= */

        .desktop-table {
          display: block;
        }

        .table-scroll {
          width: 100%;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        table {
          width: 100%;
          min-width: 1100px;
          border-collapse: collapse;
        }

        thead tr {
          background: rgba(255, 255, 255, 0.04);
        }

        th {
          padding: 18px;
          color: #888;
          text-align: left;
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 1px;
          text-transform: uppercase;
          white-space: nowrap;
        }

        tbody tr {
          border-top: 1px solid
            rgba(255, 255, 255, 0.05);
          transition:
            background 0.15s ease;
        }

        tbody tr:hover {
          background: rgba(255, 255, 255, 0.018);
        }

        .tracking {
          color: #fff;
          font-size: 13px;
        }

        .customer {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .customer strong {
          color: #fff;
          font-size: 14px;
          font-weight: 700;
        }

        .customer span {
          color: #777;
          font-size: 13px;
        }

        .date {
          color: #bbb;
          font-size: 13px;
          white-space: nowrap;
        }

        .payment {
          color: #fff;
          font-size: 13px;
        }

        .order-type {
          color: #ddd;
          font-size: 13px;
        }

        .total {
          color: #22c55e;
          font-size: 14px;
          white-space: nowrap;
        }

        /* =========================
           MOBILE
        ========================= */

        .mobile-list {
          display: none;
        }

        .order-card {
          padding: 16px;
          background:
            linear-gradient(
              180deg,
              rgba(255, 255, 255, 0.035),
              rgba(255, 255, 255, 0.012)
            );
        }

        .order-card + .order-card {
          border-top: 1px solid
            rgba(255, 255, 255, 0.07);
        }

        .card-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .card-header > :global(*) {
          flex-shrink: 0;
        }

        .card-label {
          display: block;
          margin-bottom: 4px;
          color: #555;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.9px;
          text-transform: uppercase;
        }

        .card-tracking {
          display: block;
          color: #fff;
          font-size: 15px;
          font-weight: 800;
        }

        .card-divider {
          height: 1px;
          margin: 14px 0;
          background: rgba(255, 255, 255, 0.06);
        }

        .customer-block {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
        }

        .customer-block strong {
          color: #f2f2f2;
          font-size: 14px;
          font-weight: 700;
        }

        .customer-block > span:not(.card-label) {
          color: #777;
          font-size: 11px;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
          margin-top: 16px;
          padding: 13px;
          border: 1px solid
            rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          background: rgba(0, 0, 0, 0.18);
        }

        .info-item {
          min-width: 0;
        }

        .info-item > span:not(.card-label) {
          display: block;
          overflow: hidden;
          color: #bbb;
          font-size: 11px;
          line-height: 1.35;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mobile-total {
          display: block;
          color: #22c55e;
          font-size: 15px;
          font-weight: 800;
        }

        @media (max-width: 700px) {
          .history-table-wrapper {
            border-radius: 18px;
          }

          .desktop-table {
            display: none;
          }

          .mobile-list {
            display: block;
          }
        }

        @media (max-width: 400px) {
          .order-card {
            padding: 14px;
          }

          .card-header {
            gap: 8px;
          }

          .card-tracking {
            font-size: 14px;
          }

          .info-grid {
            gap: 10px;
            padding: 11px;
          }
        }
      `}</style>
    </section>
  );
}

/* =========================================================
   DESKTOP CELL
========================================================= */

function Cell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td
      style={{
        padding: 18,
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}

/* =========================================================
   INFO ITEM
========================================================= */

function InfoItem({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="info-item">
      <span className="card-label">
        {label}
      </span>

      <span>
        {value || "—"}
      </span>
    </div>
  );
}

/* =========================================================
   DETAIL BUTTON
========================================================= */

function DetailButton({
  restaurantId,
  orderId,
  mobile = false,
}: {
  restaurantId: string;
  orderId: string;
  mobile?: boolean;
}) {
  return (
    <Link
      href={`/admin/orders/${restaurantId}/orders/${orderId}`}
      className={
        mobile
          ? "detail-button mobile-button"
          : "detail-button"
      }
    >
      Ver detalle
    </Link>
  );
}