interface Props {
  order: any;
}

export default function RestaurantCard({
  order,
}: Props) {
  const createdAt = formatDate(
    order.created_at
  );

  const updatedAt = formatDate(
    order.updated_at
  );

  return (
    <section className="restaurant-native">
      <style>{`
        .restaurant-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .restaurant-header {
          padding: 2px 0 20px;
        }

        .restaurant-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .restaurant-subtitle {
          margin-top: 6px;

          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ==========================================
           INFORMATION
        ========================================== */

        .restaurant-list {
          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .restaurant-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          min-height: 54px;

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .restaurant-label {
          flex-shrink: 0;

          color: #666;
          font-size: 11px;
          font-weight: 550;
        }

        .restaurant-value {
          min-width: 0;
          max-width: 65%;

          overflow: hidden;

          color: #bbb;
          font-size: 13px;
          font-weight: 600;

          text-align: right;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .restaurant-value.status {
          color: #ddd;
        }

        .restaurant-value.tracking {
          color: #999;
          letter-spacing: .25px;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .restaurant-title {
            font-size: 20px;
          }

          .restaurant-row {
            min-height: 50px;
          }

          .restaurant-label {
            font-size: 10px;
          }

          .restaurant-value {
            font-size: 12px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="restaurant-header">
        <h2 className="restaurant-title">
          Restaurante
        </h2>

        <div className="restaurant-subtitle">
          Información del pedido y del sistema
        </div>
      </div>

      {/* INFORMATION */}

      <div className="restaurant-list">

        <InfoRow
          label="Restaurante ID"
          value={
            order.restaurant_id
          }
        />

        <InfoRow
          label="Tipo de pedido"
          value={
            order.order_type
          }
        />

        <InfoRow
          label="Estado"
          value={
            formatStatus(order.status)
          }
          valueClass="status"
        />

        <InfoRow
          label="Tracking"
          value={
            order.tracking_code
          }
          valueClass="tracking"
        />

        <InfoRow
          label="Creado"
          value={createdAt}
        />

        <InfoRow
          label="Actualizado"
          value={updatedAt}
        />

      </div>
    </section>
  );
}

/* ==========================================
   ROW
========================================== */

function InfoRow({
  label,
  value,
  valueClass = "",
}: {
  label: string;
  value: any;
  valueClass?: string;
}) {
  return (
    <div className="restaurant-row">
      <span className="restaurant-label">
        {label}
      </span>

      <span
        className={`restaurant-value ${valueClass}`}
        title={value || "—"}
      >
        {value || "—"}
      </span>
    </div>
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
    completed: "Completado",
    cancelled: "Cancelado",
  };

  return (
    labels[status] ??
    status ??
    "—"
  );
}

/* ==========================================
   DATE
========================================== */

function formatDate(
  value: string | null
) {
  if (!value) {
    return "—";
  }

  try {
    return new Date(
      value
    ).toLocaleString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return "—";
  }
}