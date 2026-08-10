interface Props {
  order: any;
}

export default function TechnicalCard({
  order,
}: Props) {
  const rows = [
    ["ID del Pedido", order.id],
    ["Tracking", order.tracking_code],
    ["Restaurant ID", order.restaurant_id],
    ["Cliente ID", order.customer_id],
    ["QR ID", order.selected_qr_id],
    ["QR", order.selected_qr_name],
    ["Estado", order.status],
    ["Estado Pago", order.payment_status],
    ["Método Pago", order.payment_method],
    ["Creado", format(order.created_at)],
    ["Aceptado", format(order.accepted_at)],
    ["Preparando", format(order.preparing_at)],
    ["Listo", format(order.ready_at)],
    ["Entregado", format(order.completed_at)],
    ["Actualizado", format(order.updated_at)],
  ];

  return (
    <section className="technical-native">
      <style>{`
        .technical-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .technical-header {
          padding: 2px 0 20px;
        }

        .technical-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .technical-subtitle {
          margin-top: 6px;

          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ==========================================
           DATA
        ========================================== */

        .technical-list {
          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .technical-row {
          display: grid;

          grid-template-columns:
            minmax(105px, .8fr)
            minmax(0, 1.4fr);

          gap: 18px;

          padding: 13px 0;

          border-bottom:
            1px solid rgba(255,255,255,.045);
        }

        .technical-label {
          color: #555;

          font-size: 10px;
          font-weight: 600;

          letter-spacing: .7px;
          text-transform: uppercase;

          line-height: 1.5;
        }

        .technical-value {
          min-width: 0;

          color: #999;

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          font-size: 11px;
          font-weight: 500;

          line-height: 1.5;

          text-align: right;

          overflow-wrap: anywhere;
        }

        .technical-value.empty {
          color: #333;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .technical-title {
            font-size: 20px;
          }

          .technical-row {
            grid-template-columns:
              minmax(92px, .75fr)
              minmax(0, 1.5fr);

            gap: 12px;

            padding: 12px 0;
          }

          .technical-label {
            font-size: 9px;
          }

          .technical-value {
            font-size: 10px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="technical-header">
        <h2 className="technical-title">
          Información técnica
        </h2>

        <div className="technical-subtitle">
          Datos internos para auditoría y diagnóstico
        </div>
      </div>

      {/* DATA */}

      <div className="technical-list">
        {rows.map(([label, value]) => (
          <div
            key={label}
            className="technical-row"
          >
            <span className="technical-label">
              {label}
            </span>

            <span
              className={`technical-value ${
                value
                  ? ""
                  : "empty"
              }`}
              title={
                value
                  ? String(value)
                  : "-"
              }
            >
              {value || "—"}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ==========================================
   DATE
========================================== */

function format(
  date: any
) {
  if (!date) {
    return "—";
  }

  try {
    return new Date(
      date
    ).toLocaleString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return "—";
  }
}