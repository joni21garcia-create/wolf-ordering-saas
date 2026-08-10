interface Props {
  order: any;
}

export default function NotesCard({ order }: Props) {
  const notes =
    order.notes &&
    order.notes !== "EMPTY";

  const instructions =
    order.delivery_instructions &&
    order.delivery_instructions !== "EMPTY";

  const sector =
    order.delivery_sector &&
    order.delivery_sector !== "EMPTY";

  if (!notes && !instructions && !sector) {
    return null;
  }

  return (
    <section className="notes-native">
      <style>{`
        .notes-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .notes-header {
          padding: 2px 0 20px;
        }

        .notes-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .notes-subtitle {
          margin-top: 6px;

          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ==========================================
           CONTENT
        ========================================== */

        .notes-list {
          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .note-section {
          padding: 18px 0;

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .note-label {
          margin-bottom: 8px;

          color: #666;
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .note-value {
          color: #d0d0d0;
          font-size: 14px;
          font-weight: 500;
          line-height: 1.65;

          white-space: pre-wrap;
          overflow-wrap: anywhere;
        }

        /* ==========================================
           SECTOR
        ========================================== */

        .sector-value {
          color: #aaa;
          font-size: 14px;
          font-weight: 600;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .notes-title {
            font-size: 20px;
          }

          .note-value,
          .sector-value {
            font-size: 13px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="notes-header">
        <h2 className="notes-title">
          Notas
        </h2>

        <div className="notes-subtitle">
          Observaciones e indicaciones del pedido
        </div>
      </div>

      {/* CONTENT */}

      <div className="notes-list">

        {notes && (
          <div className="note-section">
            <div className="note-label">
              Notas del cliente
            </div>

            <div className="note-value">
              {order.notes}
            </div>
          </div>
        )}

        {instructions && (
          <div className="note-section">
            <div className="note-label">
              Instrucciones de entrega
            </div>

            <div className="note-value">
              {order.delivery_instructions}
            </div>
          </div>
        )}

        {sector && (
          <div className="note-section">
            <div className="note-label">
              Sector
            </div>

            <div className="sector-value">
              {order.delivery_sector}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}