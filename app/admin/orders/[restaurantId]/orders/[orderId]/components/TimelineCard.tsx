interface Props {
  order: any;
}

export default function TimelineCard({ order }: Props) {
  const steps = [
    {
      title: "Pedido recibido",
      date: order.created_at,
    },
    {
      title: "Pedido aceptado",
      date: order.accepted_at,
    },
    {
      title: "En preparación",
      date: order.preparing_at,
    },
    {
      title: "Pedido listo",
      date: order.ready_at,
    },
    {
      title: "Pedido entregado",
      date: order.completed_at,
    },
  ];

  return (
    <section className="timeline-native">
      <style>{`
        .timeline-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .timeline-header {
          padding: 2px 0 22px;
        }

        .timeline-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .timeline-subtitle {
          margin-top: 6px;

          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ==========================================
           TIMELINE
        ========================================== */

        .timeline {
          position: relative;

          padding-left: 1px;

          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .timeline-item {
          position: relative;

          display: grid;

          grid-template-columns:
            28px minmax(0, 1fr);

          gap: 14px;

          min-height: 72px;

          padding:
            16px
            0;
        }

        .timeline-rail {
          position: absolute;

          left: 13px;
          top: 43px;
          bottom: -16px;

          width: 1px;

          background:
            rgba(255,255,255,.07);
        }

        .timeline-item.completed
        .timeline-rail {
          background:
            rgba(249,115,22,.28);
        }

        .timeline-item:last-child
        .timeline-rail {
          display: none;
        }

        /* ==========================================
           DOT
        ========================================== */

        .timeline-dot-wrapper {
          position: relative;

          display: flex;
          justify-content: center;

          z-index: 2;
        }

        .timeline-dot {
          width: 9px;
          height: 9px;

          margin-top: 5px;

          border-radius: 50%;

          background: #292929;

          box-shadow:
            0 0 0 4px #101010;
        }

        .timeline-dot.completed {
          background: #f97316;

          box-shadow:
            0 0 0 4px #101010,
            0 0 0 5px
              rgba(249,115,22,.10);
        }

        .timeline-dot.current {
          width: 10px;
          height: 10px;

          background: #f97316;

          box-shadow:
            0 0 0 4px #101010,
            0 0 0 6px
              rgba(249,115,22,.12);
        }

        /* ==========================================
           CONTENT
        ========================================== */

        .timeline-content {
          min-width: 0;
        }

        .timeline-title-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 14px;
        }

        .timeline-step-title {
          color: #555;

          font-size: 14px;
          font-weight: 600;
          line-height: 1.4;
        }

        .timeline-step-title.completed {
          color: #eee;
        }

        .timeline-step-title.current {
          color: #fff;
          font-weight: 700;
        }

        .timeline-date {
          flex-shrink: 0;

          color: #555;

          font-size: 10px;
          font-weight: 550;

          text-align: right;
          white-space: nowrap;
        }

        .timeline-status {
          margin-top: 4px;

          color: #4d4d4d;

          font-size: 11px;
        }

        .timeline-status.completed {
          color: #666;
        }

        .timeline-status.current {
          color: #f97316;
          font-weight: 600;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .timeline-item {
            grid-template-columns:
              24px minmax(0, 1fr);

            gap: 13px;
          }

          .timeline-rail {
            left: 11px;
          }

          .timeline-title-row {
            align-items: flex-start;
          }

          .timeline-date {
            font-size: 9px;
          }

          .timeline-step-title {
            font-size: 13px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="timeline-header">
        <h2 className="timeline-title">
          Seguimiento
        </h2>

        <div className="timeline-subtitle">
          Historial del pedido
        </div>
      </div>

      {/* TIMELINE */}

      <div className="timeline">
        {steps.map((step, index) => {
          const completed =
            Boolean(step.date);

          const current =
            completed &&
            index ===
              steps.findIndex(
                (item) => !item.date
              ) - 1;

          return (
            <TimelineItem
              key={step.title}
              title={step.title}
              date={step.date}
              completed={completed}
              current={current}
              last={
                index ===
                steps.length - 1
              }
            />
          );
        })}
      </div>
    </section>
  );
}

/* ==========================================
   ITEM
========================================== */

function TimelineItem({
  title,
  date,
  completed,
  current,
  last,
}: {
  title: string;
  date: string | null;
  completed: boolean;
  current: boolean;
  last: boolean;
}) {
  return (
    <div
      className={`timeline-item ${
        completed ? "completed" : ""
      }`}
    >
      {!last && (
        <div className="timeline-rail" />
      )}

      <div className="timeline-dot-wrapper">
        <div
          className={`timeline-dot ${
            completed
              ? "completed"
              : ""
          } ${
            current ? "current" : ""
          }`}
        />
      </div>

      <div className="timeline-content">
        <div className="timeline-title-row">
          <div
            className={`timeline-step-title ${
              completed
                ? "completed"
                : ""
            } ${
              current
                ? "current"
                : ""
            }`}
          >
            {title}
          </div>

          {date && (
            <div className="timeline-date">
              {formatDate(date)}
            </div>
          )}
        </div>

        <div
          className={`timeline-status ${
            completed
              ? "completed"
              : ""
          } ${
            current
              ? "current"
              : ""
          }`}
        >
          {completed
            ? current
              ? "Actual"
              : "Completado"
            : "Pendiente"}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   DATE
========================================= */

function formatDate(
  value: string
) {
  try {
    return new Date(
      value
    ).toLocaleString(
      undefined,
      {
        day: "2-digit",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
      }
    );
  } catch {
    return "—";
  }
}