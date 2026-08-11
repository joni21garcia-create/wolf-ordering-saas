import Link from "next/link";

interface Props {
  restaurantId: string;
  order: any;
}

export default function OrderHeader({
  restaurantId,
  order,
}: Props) {
  const created = order.created_at
    ? new Date(order.created_at)
    : null;

  const date = created
    ? created.toLocaleDateString(
        "es-CO",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
          timeZone: "America/Bogota",
        }
      )
    : "—";

  const hour = created
    ? created.toLocaleTimeString(
        "es-CO",
        {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Bogota",
        }
      )
    : "—";

  const status = formatStatus(
    order.status
  );

  const payment = formatPayment(
    order.payment_status
  );

  const type = formatType(
    order.order_type
  );

  return (
    <header className="order-header-native">
      <style>{`
        .order-header-native {
          width: 100%;
          margin-bottom: 24px;
          color: #fff;
        }

        /* ==========================================
           TOP NAVIGATION
        ========================================== */

        .order-header-nav {
          display: flex;
          align-items: center;
          justify-content: space-between;

          min-height: 40px;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;

          color: #777;

          font-size: 12px;
          font-weight: 600;

          text-decoration: none;

          transition:
            color .18s ease;
        }

        .back-link:hover {
          color: #fff;
        }

        .back-icon {
          color: #999;
          font-size: 17px;
          line-height: 1;
        }

        .header-date {
          color: #555;

          font-size: 10px;
          font-weight: 550;

          letter-spacing: .25px;
        }

        /* ==========================================
           MAIN
        ========================================== */

        .order-header-main {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;

          gap: 24px;

          padding:
            22px
            0
            19px;
        }

        .order-header-kicker {
          margin-bottom: 7px;

          color: #555;

          font-size: 10px;
          font-weight: 650;

          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .order-tracking {
          margin: 0;

          color: #f5f5f5;

          font-size:
            clamp(30px, 8vw, 43px);

          font-weight: 800;

          letter-spacing: -1.5px;

          line-height: 1;
        }

        .order-time {
          margin-top: 9px;

          color: #666;

          font-size: 12px;
          font-weight: 550;
        }

        /* ==========================================
           STATUS
        ========================================== */

        .order-status {
          display: flex;
          align-items: center;

          gap: 9px;

          padding-bottom: 4px;
        }

        .status-dot {
          width: 7px;
          height: 7px;

          flex: 0 0 7px;

          border-radius: 50%;

          background: #f97316;

          animation:
            orderStatusPulse 1.6s ease-in-out infinite;
        }

        .status-dot.completed {
          background: #16a34a;
          animation: none;
        }

        .status-dot.cancelled {
          background: #ef4444;
          animation: none;
        }

        @keyframes orderStatusPulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 0 0 rgba(249,115,22,.18);
          }

          50% {
            transform: scale(1.18);
            box-shadow: 0 0 0 5px rgba(249,115,22,.10);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .status-dot {
            animation: none;
          }
        }

        .status-text {
          color: #aaa;

          font-size: 11px;
          font-weight: 650;

          white-space: nowrap;
        }

        /* ==========================================
           META
        ========================================== */

        .order-header-meta {
          display: flex;
          align-items: center;

          gap: 10px;

          padding-top: 14px;

          border-top:
            1px solid rgba(255,255,255,.06);
        }

        .meta-item {
          color: #666;

          font-size: 11px;
          font-weight: 550;
        }

        .meta-item strong {
          color: #aaa;

          font-weight: 650;
        }

        .meta-separator {
          color: #333;

          font-size: 10px;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 560px) {
          .order-header-native {
            margin-bottom: 18px;
          }

          .order-header-main {
            align-items: flex-start;

            padding:
              20px
              0
              16px;
          }

          .order-tracking {
            font-size: 34px;
          }

          .order-status {
            padding-top: 4px;
          }

          .header-date {
            display: none;
          }

          .order-header-meta {
            gap: 8px;
          }

          .meta-item {
            font-size: 10px;
          }
        }

        @media (max-width: 380px) {
          .order-tracking {
            font-size: 30px;
          }

          .order-header-meta {
            gap: 6px;
          }

          .meta-item {
            font-size: 9px;
          }
        }
      `}</style>

      {/* TOP NAVIGATION */}

      <div className="order-header-nav">
        <Link
          href={`/admin/orders/${restaurantId}/orders`}
          className="back-link"
        >
          <span className="back-icon">
            ‹
          </span>

          <span>
            Pedidos
          </span>
        </Link>

        <span className="header-date">
          {date}
        </span>
      </div>

      {/* MAIN */}

      <div className="order-header-main">
        <div>
          <div className="order-header-kicker">
            Pedido
          </div>

          <h1 className="order-tracking">
            #{order.tracking_code}
          </h1>

          <div className="order-time">
            {date} · {hour}
          </div>
        </div>

        <div className="order-status">
          <span
            className={`status-dot ${
              order.status === "completed"
                ? "completed"
                : order.status === "cancelled"
                ? "cancelled"
                : ""
            }`}
          />

          <span className="status-text">
            {status}
          </span>
        </div>
      </div>

      {/* META */}

      <div className="order-header-meta">
        <span className="meta-item">
          <strong>
            {type}
          </strong>
        </span>

        <span className="meta-separator">
          ·
        </span>

        <span className="meta-item">
          Pago{" "}
          <strong>
            {payment}
          </strong>
        </span>
      </div>
    </header>
  );
}

/* ==========================================
   STATUS
========================================== */

function formatStatus(
  status: string
) {
  const labels: Record<
    string,
    string
  > = {
    pending: "Pendiente",
    accepted: "Aceptado",
    preparing: "En preparación",
    ready: "Listo",
    out_for_delivery: "En camino",
    completed: "Entregado",
    cancelled: "Cancelado",
  };

  return (
    labels[status] ??
    status ??
    "—"
  );
}

/* ==========================================
   PAYMENT
========================================== */

function formatPayment(
  status: string
) {
  const labels: Record<
    string,
    string
  > = {
    paid: "Pagado",
    pending: "Pendiente",
    failed: "Fallido",
    refunded: "Reembolsado",
  };

  return (
    labels[status] ??
    status ??
    "—"
  );
}

/* ==========================================
   TYPE
========================================== */

function formatType(
  type: string
) {
  const labels: Record<
    string,
    string
  > = {
    delivery: "Delivery",
    pickup: "Pick-up",
    dine_in: "Restaurante",
  };

  return (
    labels[type] ??
    type ??
    "—"
  );
}