interface Props {
  order: any;
}

export default function PaymentCard({ order }: Props) {
  const method = order.payment_method ?? "";
  const paid = order.payment_status === "paid";

  const total = Number(order.total ?? 0);

  const status = paid
    ? "Pagado"
    : "Pendiente";

  return (
    <section className="payment-native">
      <style>{`
        .payment-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .payment-header {
          padding: 2px 0 20px;
        }

        .payment-kicker {
          margin-bottom: 7px;

          color: #666;
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .payment-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 23px;
          font-weight: 750;
          letter-spacing: -.6px;
        }

        /* ==========================================
           TOTAL
        ========================================== */

        .payment-total {
          padding: 2px 0 21px;

          border-bottom:
            1px solid rgba(255,255,255,.07);
        }

        .payment-total-label {
          color: #666;
          font-size: 11px;
          font-weight: 600;
        }

        .payment-total-value {
          margin-top: 3px;

          color: #fff;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1.2px;
          line-height: 1.1;
        }

        /* ==========================================
           STATUS
        ========================================== */

        .payment-status {
          display: flex;
          align-items: center;
          gap: 9px;

          padding: 17px 0;

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .status-dot {
          width: 7px;
          height: 7px;

          flex: 0 0 7px;

          border-radius: 50%;

          background: #f59e0b;
        }

        .status-dot.paid {
          background: #22c55e;
        }

        .status-text {
          color: #ddd;
          font-size: 14px;
          font-weight: 650;
        }

        .status-separator {
          color: #444;
        }

        .status-method {
          color: #777;
          font-size: 13px;
        }

        /* ==========================================
           DETAILS
        ========================================== */

        .payment-details {
          margin-top: 3px;
        }

        .payment-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          min-height: 48px;

          border-bottom:
            1px solid rgba(255,255,255,.045);
        }

        .payment-label {
          color: #666;
          font-size: 12px;
          font-weight: 550;
        }

        .payment-value {
          max-width: 62%;

          color: #bbb;
          font-size: 13px;
          font-weight: 600;
          text-align: right;

          overflow-wrap: anywhere;
        }

        .payment-value.confirmed {
          color: #aaa;
        }

        /* ==========================================
           EMPTY / FALLBACK
        ========================================== */

        .payment-empty {
          padding: 24px 0;

          color: #666;
          font-size: 13px;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .payment-title {
            font-size: 21px;
          }

          .payment-total-value {
            font-size: 30px;
          }

          .payment-row {
            min-height: 46px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="payment-header">
        <div className="payment-kicker">
          Pedido
        </div>

        <h2 className="payment-title">
          Pago
        </h2>
      </div>

      {/* TOTAL */}

      <div className="payment-total">
        <div className="payment-total-label">
          Total
        </div>

        <div className="payment-total-value">
          ${total.toFixed(2)}
        </div>
      </div>

      {/* STATUS */}

      <div className="payment-status">
        <span
          className={`status-dot ${
            paid ? "paid" : ""
          }`}
        />

        <span className="status-text">
          {status}
        </span>

        <span className="status-separator">
          ·
        </span>

        <span className="status-method">
          {paymentMethod(method)}
        </span>
      </div>

      {/* DETAILS */}

      <div className="payment-details">

        <PaymentRow
          label="Confirmado"
          value={
            order.payment_confirmed
              ? "Sí"
              : "No"
          }
        />

        {/* CASH */}

        {method === "cash" && (
          <>
            <PaymentRow
              label="Recibido"
              value={`$${Number(
                order.cash_amount ?? 0
              ).toFixed(2)}`}
            />

            <PaymentRow
              label="Cambio"
              value={`$${Number(
                order.change_amount ?? 0
              ).toFixed(2)}`}
            />
          </>
        )}

        {/* TRANSFER */}

        {(method === "transfer" ||
          method === "bank_transfer") && (
          <>
            <PaymentRow
              label="Banco"
              value={
                order.bank_name ?? "—"
              }
            />

            <PaymentRow
              label="Referencia"
              value={
                order.transaction_reference ??
                "—"
              }
            />
          </>
        )}

        {/* QR */}

        {method === "qr" && (
          <>
            <PaymentRow
              label="QR"
              value={
                order.selected_qr_name ??
                "—"
              }
            />

            <PaymentRow
              label="QR ID"
              value={
                order.selected_qr_id ?? "—"
              }
            />
          </>
        )}

        {/* CARD */}

        {method === "card" && (
          <>
            <PaymentRow
              label="Referencia"
              value={
                order.transaction_reference ??
                "—"
              }
            />

            <PaymentRow
              label="Autorización"
              value={
                order.authorization_code ??
                "—"
              }
            />
          </>
        )}

      </div>
    </section>
  );
}

/* ==========================================
   ROW
========================================== */

function PaymentRow({
  label,
  value,
}: {
  label: string;
  value: any;
}) {
  return (
    <div className="payment-row">
      <span className="payment-label">
        {label}
      </span>

      <span className="payment-value">
        {value || "—"}
      </span>
    </div>
  );
}

/* ==========================================
   PAYMENT METHOD
========================================== */

function paymentMethod(method: string) {
  switch (method) {
    case "cash":
      return "Efectivo";

    case "qr":
      return "QR";

    case "transfer":
      return "Transferencia";

    case "bank_transfer":
      return "Transferencia";

    case "card":
      return "Tarjeta";

    default:
      return method || "Sin método";
  }
}