 "use client";

interface Props {
  deliveryOrders: number;
  pickupOrders: number;
  dineInOrders?: number;
}

export default function OrderTypesCard({
  deliveryOrders,
  pickupOrders,
  dineInOrders = 0,
}: Props) {
  const total = deliveryOrders + pickupOrders + dineInOrders;

  return (
    <section className="order-types">
      <style jsx>{`
        .order-types {
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
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .title {
          margin: 7px 0 20px;
          color: #fff;
          font-size: 25px;
          font-weight: 800;
          line-height: 1.1;
        }

        .rows {
          display: grid;
          gap: 14px;
        }

        .row {
          min-width: 0;
        }

        .row-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 7px;
        }

        .name {
          min-width: 0;
          color: #fff;
          font-size: 14px;
          font-weight: 600;
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
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
          overflow: hidden;
        }

        .bar {
          height: 100%;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        @media (max-width: 560px) {
          .order-types {
            border-radius: 18px;
            padding: 16px;
          }

          .title {
            font-size: 21px;
            margin-bottom: 15px;
          }

          .rows {
            gap: 12px;
          }

          .name {
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

      <div className="eyebrow">Operación</div>
      <h2 className="title">Tipos de Pedido</h2>

      <div className="rows">
        <TypeRow
          icon="🛵"
          label="Delivery"
          value={deliveryOrders}
          total={total}
          color="#22c55e"
        />

        <TypeRow
          icon="🥡"
          label="Pickup"
          value={pickupOrders}
          total={total}
          color="#3b82f6"
        />

        <TypeRow
          icon="🍽️"
          label="Mesa"
          value={dineInOrders}
          total={total}
          color="#f97316"
        />
      </div>
    </section>
  );
}

function TypeRow({
  icon,
  label,
  value,
  total,
  color,
}: {
  icon: string;
  label: string;
  value: number;
  total: number;
  color: string;
}) {
  const percent = total === 0 ? 0 : (value / total) * 100;

  return (
    <div className="row">
      <div className="row-header">
        <span className="name">
          {icon} {label}
        </span>

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