 "use client";

interface Props {
  cashOrders: number;
  qrOrders: number;
  transferOrders?: number;
  cardOrders?: number;
}

export default function PaymentMethodsCard({
  cashOrders,
  qrOrders,
  transferOrders = 0,
  cardOrders = 0,
}: Props) {
  const total =
    cashOrders + qrOrders + transferOrders + cardOrders;

  return (
    <section className="payment-card">
      <style jsx>{`
        .payment-card {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          background: linear-gradient(180deg, #141414, #0a0a0a);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          padding: 22px;
        }

        .eyebrow {
          color: #888;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .title {
          margin: 7px 0 20px;
          color: #fff;
          font-size: 25px;
          font-weight: 800;
          line-height: 1.1;
        }

        .methods {
          display: grid;
          gap: 14px;
        }

        .method {
          min-width: 0;
        }

        .method-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 7px;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
        }

        .label {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .value {
          flex-shrink: 0;
          color: #aaa;
          font-size: 12px;
          font-weight: 700;
        }

        .track {
          height: 8px;
          border-radius: 999px;
          background: rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }

        .bar {
          height: 100%;
          border-radius: 999px;
          transition: width 0.35s ease;
        }

        @media (max-width: 560px) {
          .payment-card {
            border-radius: 18px;
            padding: 16px;
          }

          .title {
            font-size: 21px;
            margin-bottom: 15px;
          }

          .methods {
            gap: 12px;
          }

          .method-header {
            font-size: 13px;
          }

          .value {
            font-size: 11px;
          }

          .track {
            height: 7px;
          }
        }
      `}</style>

      <div className="eyebrow">Pagos</div>
      <h2 className="title">Métodos de Pago</h2>

      <div className="methods">
        <Method
          label="💵 Efectivo"
          value={cashOrders}
          total={total}
          color="#22c55e"
        />

        <Method
          label="📱 QR"
          value={qrOrders}
          total={total}
          color="#3b82f6"
        />

        <Method
          label="💳 Tarjeta"
          value={cardOrders}
          total={total}
          color="#a855f7"
        />

        <Method
          label="🏦 Transferencia"
          value={transferOrders}
          total={total}
          color="#f97316"
        />
      </div>
    </section>
  );
}

function Method({
  label,
  value,
  total,
  color,
}: {
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent =
    total === 0 ? 0 : (value / total) * 100;

  return (
    <div className="method">
      <div className="method-header">
        <span className="label">{label}</span>
        <span className="value">
          {value} ({percent.toFixed(0)}%)
        </span>
      </div>

      <div className="track">
        <div
          className="bar"
          style={{
            width: `${percent}%`,
            background: color,
          }}
        />
      </div>
    </div>
  );
}