 "use client";

interface Props {
  pending: number;
  accepted: number;
  preparing: number;
  ready: number;
  delivery: number;
  completed: number;
  cancelled: number;
}

export default function StatusDistributionCard({
  pending,
  accepted,
  preparing,
  ready,
  delivery,
  completed,
  cancelled,
}: Props) {
  const total =
    pending +
    accepted +
    preparing +
    ready +
    delivery +
    completed +
    cancelled;

  return (
    <section className="status-card">
      <style jsx>{`
        .status-card {
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
          gap: 12px;
        }

        .row {
          min-width: 0;
        }

        .row-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .label {
          min-width: 0;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .value {
          flex-shrink: 0;
          color: #aaa;
          font-size: 11px;
          font-weight: 700;
        }

        .track {
          height: 7px;
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
          .status-card {
            border-radius: 18px;
            padding: 16px;
          }

          .title {
            font-size: 21px;
            margin-bottom: 15px;
          }

          .rows {
            gap: 10px;
          }

          .label {
            font-size: 12px;
          }

          .value {
            font-size: 10px;
          }

          .track {
            height: 6px;
          }
        }
      `}</style>

      <div className="eyebrow">Operación</div>
      <h2 className="title">Estados de los Pedidos</h2>

      <div className="rows">
        <Row label="Pendientes" value={pending} total={total} color="#f59e0b" />
        <Row label="Aceptados" value={accepted} total={total} color="#2563eb" />
        <Row label="Preparando" value={preparing} total={total} color="#ea580c" />
        <Row label="Listos" value={ready} total={total} color="#16a34a" />
        <Row label="En camino" value={delivery} total={total} color="#0891b2" />
        <Row label="Completados" value={completed} total={total} color="#22c55e" />
        <Row label="Cancelados" value={cancelled} total={total} color="#dc2626" />
      </div>
    </section>
  );
}

function Row({
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
  const percent = total === 0 ? 0 : (value / total) * 100;

  return (
    <div className="row">
      <div className="row-header">
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