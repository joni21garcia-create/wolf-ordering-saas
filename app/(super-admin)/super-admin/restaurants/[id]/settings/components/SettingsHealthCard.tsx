"use client";

import { useState } from "react";

interface Item {
  title: string;
  status: "ok" | "warning" | "error";
}

interface Props {
  items: Item[];
}

export default function SettingsHealthCard({ items }: Props) {
  const [open, setOpen] = useState(false);

  const total = items.length;
  const ok = items.filter((item) => item.status === "ok").length;
  const pending = items.filter((item) => item.status === "warning").length;
  const errors = items.filter((item) => item.status === "error").length;

  const completed = ok;
  const progress = total === 0 ? 0 : Math.round((completed / total) * 100);

  const hasIssues = pending + errors > 0;

  return (
    <section className="health" aria-label="Estado de configuración">
      <button
        type="button"
        className={`trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="settings-health-details"
      >
        <span className="summary">
          <span className={`dot ${hasIssues ? "warning" : "ok"}`} />

          <span className="copy">
            <span className="label">Estado de configuración</span>
            <strong>
              {completed} de {total} configurados
              {hasIssues && (
                <small>
                  · {pending + errors} pendiente
                  {pending + errors === 1 ? "" : "s"}
                </small>
              )}
            </strong>
          </span>
        </span>

        <span className="right">
          <strong className="percentage">{progress}%</strong>
          <span className="chevron" aria-hidden="true">
            ›
          </span>
        </span>
      </button>

      {open && (
        <div id="settings-health-details" className="details">
          <div className="progress">
            <span style={{ width: `${progress}%` }} />
          </div>

          <div className="items">
            {items.map((item) => (
              <HealthItem key={item.title} {...item} />
            ))}
          </div>
        </div>
      )}

      <style jsx>{`
        .health {
          margin: 0 0 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.022);
          overflow: hidden;
        }

        .trigger {
          width: 100%;
          min-height: 58px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 9px 11px;
          border: 0;
          background: transparent;
          color: inherit;
          text-align: left;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .trigger:hover,
        .trigger.open {
          background: rgba(255, 255, 255, 0.018);
        }

        .summary {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .dot {
          width: 6px;
          height: 6px;
          flex: 0 0 6px;
          border-radius: 50%;
        }

        .dot.ok {
          background: #22c55e;
          box-shadow: 0 0 7px rgba(34, 197, 94, 0.4);
        }

        .dot.warning {
          background: #f59e0b;
          box-shadow: 0 0 7px rgba(245, 158, 11, 0.35);
        }

        .copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .label {
          color: #777;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.65px;
        }

        .copy strong {
          color: #ddd;
          font-size: 11px;
          font-weight: 800;
          white-space: nowrap;
        }

        .copy small {
          color: #777;
          font-size: 9px;
          font-weight: 500;
        }

        .right {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .percentage {
          color: #22c55e;
          font-size: 12px;
          font-weight: 850;
        }

        .chevron {
          color: #777;
          font-size: 20px;
          font-weight: 300;
          line-height: 1;
          transform: ${open ? "rotate(90deg)" : "rotate(0deg)"};
          transition: transform 0.18s ease;
        }

        .details {
          padding: 0 11px 10px;
        }

        .progress {
          height: 3px;
          margin-bottom: 8px;
          overflow: hidden;
          border-radius: 99px;
          background: rgba(255, 255, 255, 0.07);
        }

        .progress span {
          display: block;
          height: 100%;
          border-radius: inherit;
          background: #22c55e;
        }

        .items {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 4px;
        }

        @media (max-width: 430px) {
          .trigger {
            min-height: 54px;
            padding: 8px 10px;
          }

          .copy strong {
            font-size: 10px;
          }

          .percentage {
            font-size: 11px;
          }

          .items {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
}

function HealthItem({ title, status }: Item) {
  const config = {
    ok: {
      color: "#22c55e",
      icon: "✓",
      label: "Listo",
    },
    warning: {
      color: "#f59e0b",
      icon: "!",
      label: "Pendiente",
    },
    error: {
      color: "#ef4444",
      icon: "×",
      label: "Error",
    },
  }[status];

  return (
    <div className="item">
      <span
        className="icon"
        style={{
          color: config.color,
          background: `${config.color}10`,
        }}
        aria-hidden="true"
      >
        {config.icon}
      </span>

      <span className="item-copy">
        <strong>{title}</strong>
        <small style={{ color: config.color }}>{config.label}</small>
      </span>

      <style jsx>{`
        .item {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 7px;
          min-height: 35px;
          padding: 5px 7px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.018);
        }

        .icon {
          width: 20px;
          height: 20px;
          flex: 0 0 20px;
          display: grid;
          place-items: center;
          border-radius: 6px;
          font-size: 10px;
          font-weight: 900;
        }

        .item-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 1px;
        }

        .item-copy strong {
          overflow: hidden;
          color: #c8c8c8;
          font-size: 8px;
          font-weight: 700;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .item-copy small {
          font-size: 7px;
          font-weight: 650;
        }
      `}</style>
    </div>
  );
}