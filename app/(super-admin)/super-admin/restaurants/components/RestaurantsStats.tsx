"use client";

type Props = {
  total: number;
  active: number;
  inactive: number;
  newThisMonth: number;
};

export default function RestaurantsStats({
  total,
  active,
  inactive,
  newThisMonth,
}: Props) {
  return (
    <section className="stats" aria-label="Resumen de restaurantes">
      <div className="total">
        <span className="label">RESTAURANTES</span>
        <div className="total-row">
          <strong>{total}</strong>
          <span>registrados</span>
        </div>
      </div>

      <div className="metrics">
        <Metric
          value={active}
          label="Activos"
          tone="green"
        />

        <Metric
          value={inactive}
          label="Inactivos"
          tone="red"
        />

        <Metric
          value={newThisMonth}
          label="Nuevos"
          tone="orange"
        />
      </div>

      <style jsx>{`
        .stats {
          display: grid;
          grid-template-columns: minmax(150px, 0.9fr) 2fr;
          align-items: stretch;
          margin-bottom: 18px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 15px;
          background: rgba(17, 17, 17, 0.78);
        }

        .total {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 14px 18px;
          border-right: 1px solid rgba(255, 255, 255, 0.06);
        }

        .label {
          color: #666;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.13em;
        }

        .total-row {
          display: flex;
          align-items: baseline;
          gap: 7px;
          margin-top: 3px;
        }

        .total strong {
          color: #f4f4f4;
          font-size: 25px;
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        .total-row span {
          color: #555;
          font-size: 9px;
        }

        .metrics {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
        }

        @media (min-width: 721px) {
          .metrics > :not(:last-child) {
            border-right: 1px solid rgba(255, 255, 255, 0.055);
          }
        }

        @media (max-width: 720px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .total {
            min-height: 58px;
            padding: 12px 14px;
            border-right: 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          }

          .total strong {
            font-size: 24px;
          }

          .metrics {
            min-height: 55px;
          }

          .metrics > :not(:last-child) {
            border-right: 1px solid rgba(255, 255, 255, 0.055);
          }
        }

        @media (max-width: 380px) {
          .stats {
            border-radius: 13px;
          }

          .total {
            padding: 11px 13px;
          }

          .metrics {
            min-height: 52px;
          }
        }
      `}</style>
    </section>
  );
}

function Metric({
  value,
  label,
  tone,
}: {
  value: number;
  label: string;
  tone: "green" | "red" | "orange";
}) {
  return (
    <div className="metric">
      <span className={`dot ${tone}`} />
      <div>
        <strong>{value}</strong>
        <span>{label}</span>
      </div>

      <style jsx>{`
        .metric {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 10px 13px;
        }

        .dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
        }

        .green {
          background: #22c55e;
          box-shadow: 0 0 7px rgba(34, 197, 94, 0.35);
        }

        .red {
          background: #ef4444;
          box-shadow: 0 0 7px rgba(239, 68, 68, 0.3);
        }

        .orange {
          background: #ff8a1f;
          box-shadow: 0 0 7px rgba(255, 138, 31, 0.3);
        }

        .metric div {
          min-width: 0;
          display: flex;
          align-items: baseline;
          gap: 5px;
        }

        .metric strong {
          color: #dedede;
          font-size: 16px;
          font-weight: 750;
          line-height: 1;
        }

        .metric div > span {
          overflow: hidden;
          color: #606060;
          font-size: 9px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 380px) {
          .metric {
            padding: 9px 8px;
            gap: 6px;
          }

          .metric div {
            display: flex;
            flex-direction: column;
            gap: 2px;
          }

          .metric strong {
            font-size: 15px;
          }
        }
      `}</style>
    </div>
  );
}