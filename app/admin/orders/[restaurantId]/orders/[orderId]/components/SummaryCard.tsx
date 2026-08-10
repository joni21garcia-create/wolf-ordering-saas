import { getDeliveryDisplay } from "@/lib/delivery/getDeliveryDisplay";

interface Props {
  order: any;

  deliverySettings: {
    delivery_mode: "fixed" | "manual";
    delivery_fee: number;
    free_delivery_enabled: boolean;
    free_delivery_minimum: number;
  };
}

export default function SummaryCard({
  order,
  deliverySettings,
}: Props) {
  const subtotal = Number(
    order.subtotal ?? 0
  );

  const delivery = getDeliveryDisplay({
    settings: deliverySettings,
    orderTotal: subtotal,
  });

  const commission = Number(
    order.commission_amount ?? 0
  );

  const restaurant = Number(
    order.restaurant_amount ?? 0
  );

  const wolf = Number(
    order.wolf_amount ?? 0
  );

  const total = Number(
    order.total ?? 0
  );

  return (
    <section className="summary-native">
      <style>{`
        .summary-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .summary-header {
          padding: 2px 0 20px;
        }

        .summary-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .summary-subtitle {
          margin-top: 6px;

          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ==========================================
           CUSTOMER TOTAL
        ========================================== */

        .summary-total {
          padding: 20px 0;

          border-top:
            1px solid rgba(255,255,255,.07);

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .summary-total-label {
          color: #666;
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 1.2px;
          text-transform: uppercase;
        }

        .summary-total-value {
          margin-top: 5px;

          color: #fff;
          font-size: 32px;
          font-weight: 800;
          letter-spacing: -1.2px;
          line-height: 1.1;
        }

        /* ==========================================
           ROWS
        ========================================== */

        .summary-list {
          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .summary-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          min-height: 49px;

          border-bottom:
            1px solid rgba(255,255,255,.045);
        }

        .summary-row:last-child {
          border-bottom: none;
        }

        .summary-label {
          color: #666;
          font-size: 12px;
          font-weight: 550;
        }

        .summary-value {
          color: #aaa;
          font-size: 13px;
          font-weight: 650;
          text-align: right;
        }

        /* ==========================================
           DELIVERY
        ========================================== */

        .summary-delivery {
          padding: 15px 0;

          border-bottom:
            1px solid rgba(255,255,255,.045);
        }

        .summary-delivery-top {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;
        }

        .summary-delivery-label {
          color: #666;
          font-size: 12px;
          font-weight: 550;
        }

        .summary-delivery-value {
          color: #aaa;
          font-size: 13px;
          font-weight: 650;
          text-align: right;
        }

        .summary-delivery-note {
          margin-top: 5px;

          color: #555;
          font-size: 10px;
          text-align: right;
        }

        /* ==========================================
           BREAKDOWN
        ========================================== */

        .summary-breakdown {
          margin-top: 18px;
          padding-top: 18px;

          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .summary-breakdown-title {
          margin-bottom: 5px;

          color: #555;
          font-size: 10px;
          font-weight: 650;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        .summary-breakdown-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          min-height: 42px;

          gap: 20px;

          border-bottom:
            1px solid rgba(255,255,255,.035);
        }

        .summary-breakdown-label {
          color: #666;
          font-size: 11px;
        }

        .summary-breakdown-value {
          color: #888;
          font-size: 12px;
          font-weight: 600;
          text-align: right;
        }

        /* ==========================================
           FINAL
        ========================================== */

        .summary-final {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 20px;

          padding-top: 19px;
        }

        .summary-final-label {
          color: #fff;
          font-size: 14px;
          font-weight: 650;
        }

        .summary-final-value {
          color: #fff;
          font-size: 23px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .summary-title {
            font-size: 20px;
          }

          .summary-total-value {
            font-size: 30px;
          }

          .summary-final-value {
            font-size: 21px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="summary-header">
        <h2 className="summary-title">
          Resumen
        </h2>

        <div className="summary-subtitle">
          Desglose financiero del pedido
        </div>
      </div>

      {/* TOTAL PRINCIPAL */}

      <div className="summary-total">
        <div className="summary-total-label">
          Total del pedido
        </div>

        <div className="summary-total-value">
          {money(total)}
        </div>
      </div>

      {/* ORDER BREAKDOWN */}

      <div className="summary-list">

        <SummaryRow
          label="Productos"
          value={money(subtotal)}
        />

        {order.order_type ===
        "delivery" ? (
          <div className="summary-delivery">
            <div className="summary-delivery-top">
              <span className="summary-delivery-label">
                Delivery
              </span>

              <span className="summary-delivery-value">
                {delivery.label}
              </span>
            </div>

            {delivery.isFree && (
              <div className="summary-delivery-note">
                Envío gratis
              </div>
            )}

            {delivery.isManual && (
              <div className="summary-delivery-note">
                Costo acordado con el restaurante
              </div>
            )}
          </div>
        ) : (
          <SummaryRow
            label="Delivery"
            value="No aplica"
          />
        )}

      </div>

      {/* INTERNAL BREAKDOWN */}

      <div className="summary-breakdown">

        <div className="summary-breakdown-title">
          Distribución
        </div>

        <BreakdownRow
          label="Comisión"
          value={money(commission)}
        />

        <BreakdownRow
          label="Restaurante recibe"
          value={money(restaurant)}
        />

        <BreakdownRow
          label="Wolf recibe"
          value={money(wolf)}
        />

      </div>

      {/* FINAL */}

      <div className="summary-final">
        <span className="summary-final-label">
          Total
        </span>

        <strong className="summary-final-value">
          {money(total)}
        </strong>
      </div>
    </section>
  );
}

/* ==========================================
   SUMMARY ROW
========================================== */

function SummaryRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="summary-row">
      <span className="summary-label">
        {label}
      </span>

      <strong className="summary-value">
        {value}
      </strong>
    </div>
  );
}

/* ==========================================
   BREAKDOWN ROW
========================================== */

function BreakdownRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="summary-breakdown-row">
      <span className="summary-breakdown-label">
        {label}
      </span>

      <strong className="summary-breakdown-value">
        {value}
      </strong>
    </div>
  );
}

/* ==========================================
   MONEY
========================================== */

function money(value: number) {
  return `$${value.toFixed(2)}`;
}