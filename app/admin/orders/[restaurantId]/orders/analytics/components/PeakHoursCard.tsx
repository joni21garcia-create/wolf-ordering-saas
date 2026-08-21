 "use client";

interface Props {
  hours: {
    hour: string;
    total: number;
  }[];
}

export default function PeakHoursCard({ hours }: Props) {
  const max = Math.max(...hours.map((h) => h.total), 1);

  return (
    <section className="peak-card">
      <style jsx>{`
        .peak-card {
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

        .hours {
          display: grid;
          gap: 12px;
          max-height: 390px;
          overflow-y: auto;
          padding-right: 3px;
          scrollbar-width: thin;
          scrollbar-color: #333 transparent;
        }

        .hour {
          min-width: 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .time {
          min-width: 0;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
        }

        .total {
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
          background: #f97316;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .empty {
          color: #777;
          font-size: 13px;
          padding: 10px 0;
        }

        @media (max-width: 560px) {
          .peak-card {
            border-radius: 18px;
            padding: 16px;
          }

          .title {
            font-size: 21px;
            margin-bottom: 15px;
          }

          .hours {
            gap: 10px;
            max-height: 320px;
          }

          .time {
            font-size: 12px;
          }

          .total {
            font-size: 10px;
          }

          .track {
            height: 6px;
          }
        }
      `}</style>

      <div className="eyebrow">Comportamiento</div>
      <h2 className="title">Horas Pico</h2>

      {hours.length === 0 ? (
        <div className="empty">No hay datos de horas disponibles.</div>
      ) : (
        <div className="hours">
          {hours.map((item) => {
            const percent = (item.total / max) * 100;

            return (
              <div className="hour" key={item.hour}>
                <div className="header">
                  <span className="time">🕒 {item.hour}</span>

                  <span className="total">
                    {item.total} pedidos
                  </span>
                </div>

                <div className="track">
                  <div
                    className="bar"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}