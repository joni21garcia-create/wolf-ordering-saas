interface Props {
  order: any;
}

export default function DeliveryCard({ order }: Props) {
  if (order.order_type !== "delivery") {
    return null;
  }

  const address =
    order.delivery_address ||
    "Dirección no disponible";

  const sector =
    order.delivery_sector || null;

  const estimatedMinutes =
    order.estimated_minutes;

  const status =
    order.status || null;

  const instructions =
    order.delivery_instructions?.trim() || null;

  return (
    <section className="delivery-native">
      <style>{`
        .delivery-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .delivery-header {
          padding: 2px 0 20px;
        }

        .delivery-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .delivery-subtitle {
          margin-top: 6px;

          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ==========================================
           ADDRESS
        ========================================== */

        .delivery-address {
          padding: 18px 0 20px;

          border-top:
            1px solid rgba(255,255,255,.07);

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .delivery-label {
          margin-bottom: 8px;

          color: #555;
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .delivery-address-value {
          color: #f2f2f2;
          font-size: 17px;
          font-weight: 650;
          line-height: 1.45;
          overflow-wrap: anywhere;
        }

        /* ==========================================
           QUICK INFO
        ========================================== */

        .delivery-meta {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);

          gap: 0 24px;
        }

        .delivery-meta-item {
          min-width: 0;

          padding: 16px 0;

          border-bottom:
            1px solid rgba(255,255,255,.05);
        }

        .delivery-meta-label {
          margin-bottom: 6px;

          color: #555;
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .delivery-meta-value {
          overflow: hidden;

          color: #bdbdbd;
          font-size: 13px;
          font-weight: 550;
          line-height: 1.4;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ==========================================
           INSTRUCTIONS
        ========================================== */

        .delivery-instructions {
          margin-top: 18px;

          padding-top: 18px;

          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .delivery-instructions-label {
          margin-bottom: 8px;

          color: #555;
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .delivery-instructions-value {
          color: #aaa;
          font-size: 13px;
          font-weight: 500;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .delivery-title {
            font-size: 20px;
          }

          .delivery-address-value {
            font-size: 16px;
          }

          .delivery-meta {
            gap: 0 18px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="delivery-header">
        <h2 className="delivery-title">
          Entrega
        </h2>

        <div className="delivery-subtitle">
          Información de destino y entrega
        </div>
      </div>

      {/* ADDRESS */}

      <div className="delivery-address">
        <div className="delivery-label">
          Dirección
        </div>

        <div className="delivery-address-value">
          {address}
        </div>
      </div>

      {/* META */}

      <div className="delivery-meta">

        {sector && (
          <div className="delivery-meta-item">
            <div className="delivery-meta-label">
              Sector
            </div>

            <div
              className="delivery-meta-value"
              title={sector}
            >
              {sector}
            </div>
          </div>
        )}

        {estimatedMinutes ? (
          <div className="delivery-meta-item">
            <div className="delivery-meta-label">
              Tiempo estimado
            </div>

            <div className="delivery-meta-value">
              {estimatedMinutes} min
            </div>
          </div>
        ) : null}

        {status && (
          <div className="delivery-meta-item">
            <div className="delivery-meta-label">
              Estado
            </div>

            <div className="delivery-meta-value">
              {formatStatus(status)}
            </div>
          </div>
        )}

      </div>

      {/* INSTRUCTIONS */}

      {instructions && (
        <div className="delivery-instructions">
          <div className="delivery-instructions-label">
            Instrucciones
          </div>

          <div className="delivery-instructions-value">
            {instructions}
          </div>
        </div>
      )}
    </section>
  );
}

function formatStatus(status: string) {
  const labels: Record<string, string> = {
    pending: "Pendiente",
    accepted: "Aceptado",
    preparing: "En preparación",
    ready: "Listo",
    completed: "Entregado",
    cancelled: "Cancelado",
  };

  return labels[status] ?? status;
}