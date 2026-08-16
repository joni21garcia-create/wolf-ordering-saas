"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuickAction } from "./types";

interface Props {
  actions: QuickAction[];
}

export default function SettingsQuickActions({ actions }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <section className="quick-actions" aria-label="Accesos rápidos">
      <button
        type="button"
        className={`trigger ${open ? "open" : ""}`}
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="quick-actions-list"
      >
        <span className="trigger-copy">
          <span className="eyebrow">Accesos rápidos</span>
          <strong>Acciones disponibles</strong>
        </span>

        <span className="trigger-meta">
          <span className="count">{actions.length}</span>
          <span className="chevron" aria-hidden="true">
            ›
          </span>
        </span>
      </button>

      {open && (
        <div id="quick-actions-list" className="list">
          {actions.map((action) => (
            <Link key={action.title} href={action.href} className="action">
              <span
                className="icon"
                style={{
                  color: action.color,
                  background: `${action.color}10`,
                  borderColor: `${action.color}20`,
                }}
                aria-hidden="true"
              >
                {action.icon}
              </span>

              <span className="copy">
                <strong>{action.title}</strong>
              </span>

              <span
                className="arrow"
                style={{ color: action.color }}
                aria-hidden="true"
              >
                →
              </span>
            </Link>
          ))}
        </div>
      )}

      <style jsx>{`
        .quick-actions {
          margin: 0 0 12px;
        }

        .trigger {
          width: 100%;
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 11px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: rgba(255, 255, 255, 0.025);
          color: inherit;
          text-align: left;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
          transition:
            background 0.16s ease,
            border-color 0.16s ease;
        }

        .trigger:hover,
        .trigger.open {
          background: rgba(255, 255, 255, 0.035);
          border-color: rgba(255, 145, 75, 0.12);
        }

        .trigger-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .eyebrow {
          color: #777;
          font-size: 8px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.65px;
        }

        .trigger-copy strong {
          color: #d4d4d4;
          font-size: 10px;
          font-weight: 750;
        }

        .trigger-meta {
          display: flex;
          align-items: center;
          gap: 7px;
          flex: 0 0 auto;
        }

        .count {
          min-width: 18px;
          height: 18px;
          display: grid;
          place-items: center;
          padding: 0 4px;
          box-sizing: border-box;
          border-radius: 6px;
          background: rgba(255, 106, 0, 0.08);
          color: #ff914b;
          font-size: 8px;
          font-weight: 800;
        }

        .chevron {
          color: #777;
          font-size: 20px;
          font-weight: 300;
          line-height: 1;
          transform: ${open ? "rotate(90deg)" : "rotate(0deg)"};
          transition: transform 0.18s ease;
        }

        .list {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 5px;
          margin-top: 5px;
        }

        .action {
          min-width: 0;
          min-height: 44px;
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 6px 8px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.018);
          color: inherit;
          text-decoration: none;
          -webkit-tap-highlight-color: transparent;
        }

        .icon {
          width: 27px;
          height: 27px;
          flex: 0 0 27px;
          display: grid;
          place-items: center;
          border: 1px solid;
          border-radius: 8px;
          font-size: 12px;
        }

        .copy {
          min-width: 0;
          flex: 1;
        }

        .copy strong {
          display: block;
          overflow: hidden;
          color: #ccc;
          font-size: 9px;
          font-weight: 700;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .arrow {
          flex: 0 0 auto;
          font-size: 13px;
        }

        @media (max-width: 430px) {
          .list {
            grid-template-columns: 1fr;
          }

          .trigger {
            min-height: 50px;
          }
        }
      `}</style>
    </section>
  );
}