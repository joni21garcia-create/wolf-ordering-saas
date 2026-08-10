interface Props {
  order: any;
}

export default function CustomerCard({
  order,
}: Props) {
  const customerName =
    order.customer_name ||
    "Cliente no registrado";

  const phone =
    order.customer_phone ||
    "No registrado";

  const email =
    order.customer_email ||
    "No registrado";

  const tracking =
    order.tracking_code || "—";

  const hasPhone =
    Boolean(order.customer_phone);

  function openWhatsApp() {
    if (!order.customer_phone) return;

    const phoneNumber =
      order.customer_phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/${phoneNumber}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <section className="customer-native">
      <style>{`
        .customer-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .customer-header {
          padding: 2px 0 22px;
        }

        .customer-kicker {
          margin-bottom: 7px;

          color: #555;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .customer-name {
          margin: 0;

          color: #f5f5f5;

          font-size: 27px;
          font-weight: 780;

          letter-spacing: -0.8px;
          line-height: 1.15;

          overflow-wrap: anywhere;
        }

        /* ==========================================
           CONTACT
        ========================================== */

        .customer-contact {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 18px;

          padding:
            18px
            0;

          border-top:
            1px solid rgba(255,255,255,.07);

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .contact-info {
          min-width: 0;
        }

        .contact-label {
          margin-bottom: 6px;

          color: #555;

          font-size: 10px;
          font-weight: 650;

          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .contact-value {
          overflow: hidden;

          color: #eee;

          font-size: 16px;
          font-weight: 650;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ==========================================
           ACTIONS
        ========================================== */

        .contact-actions {
          display: flex;
          align-items: center;

          gap: 7px;

          flex-shrink: 0;
        }

        .contact-action {
          width: 38px;
          height: 38px;

          display: flex;
          align-items: center;
          justify-content: center;

          border:
            1px solid rgba(255,255,255,.08);

          border-radius: 50%;

          background:
            rgba(255,255,255,.035);

          color: #aaa;

          font-size: 13px;
          font-weight: 600;

          text-decoration: none;

          cursor: pointer;

          transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .contact-action:hover {
          background:
            rgba(255,255,255,.07);

          border-color:
            rgba(255,255,255,.13);

          color: #fff;
        }

        .contact-action:active {
          transform: scale(.94);
        }

        .contact-action.whatsapp {
          color: #aaa;
        }

        /* ==========================================
           DETAILS
        ========================================== */

        .customer-details {
          display: grid;

          grid-template-columns:
            minmax(0, 1fr)
            minmax(0, 1fr);

          gap: 0 28px;

          margin-top: 2px;
        }

        .detail {
          min-width: 0;

          padding: 16px 0;

          border-bottom:
            1px solid rgba(255,255,255,.045);
        }

        .detail-label {
          margin-bottom: 6px;

          color: #555;

          font-size: 9px;
          font-weight: 700;

          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .detail-value {
          overflow: hidden;

          color: #aaa;

          font-size: 13px;
          font-weight: 550;

          line-height: 1.45;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* ==========================================
           TRACKING
        ========================================== */

        .customer-tracking {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          padding:
            17px
            0
            3px;

          border-top:
            1px solid rgba(255,255,255,.06);
        }

        .tracking-label {
          color: #555;

          font-size: 9px;
          font-weight: 700;

          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .tracking-value {
          color: #888;

          font-family:
            ui-monospace,
            SFMono-Regular,
            Menlo,
            Monaco,
            Consolas,
            monospace;

          font-size: 11px;
          font-weight: 550;

          letter-spacing: .2px;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .customer-name {
            font-size: 24px;
          }

          .contact-value {
            font-size: 15px;
          }

          .customer-details {
            gap: 0 18px;
          }

          .contact-action {
            width: 36px;
            height: 36px;
          }
        }

        @media (max-width: 350px) {
          .customer-details {
            grid-template-columns: 1fr;
          }

          .customer-contact {
            gap: 10px;
          }

          .contact-value {
            font-size: 14px;
          }
        }
      `}</style>

      {/* CUSTOMER */}

      <div className="customer-header">
        <div className="customer-kicker">
          Cliente
        </div>

        <h2 className="customer-name">
          {customerName}
        </h2>
      </div>

      {/* PRIMARY CONTACT */}

      <div className="customer-contact">
        <div className="contact-info">
          <div className="contact-label">
            Teléfono
          </div>

          <div className="contact-value">
            {phone}
          </div>
        </div>

        {hasPhone && (
          <div className="contact-actions">
            <a
              className="contact-action"
              href={`tel:${order.customer_phone}`}
              aria-label="Llamar al cliente"
              title="Llamar"
            >
              ☎
            </a>

            <button
              type="button"
              className="contact-action whatsapp"
              onClick={openWhatsApp}
              aria-label="Contactar por WhatsApp"
              title="WhatsApp"
            >
              ◌
            </button>
          </div>
        )}
      </div>

      {/* SECONDARY INFORMATION */}

      <div className="customer-details">
        <div className="detail">
          <div className="detail-label">
            Correo
          </div>

          <div
            className="detail-value"
            title={email}
          >
            {email}
          </div>
        </div>

        <div className="detail">
          <div className="detail-label">
            Tipo
          </div>

          <div className="detail-value">
            {formatOrderType(
              order.order_type
            )}
          </div>
        </div>
      </div>

      {/* TRACKING */}

      <div className="customer-tracking">
        <span className="tracking-label">
          Tracking
        </span>

        <span className="tracking-value">
          {tracking}
        </span>
      </div>
    </section>
  );
}

function formatOrderType(
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