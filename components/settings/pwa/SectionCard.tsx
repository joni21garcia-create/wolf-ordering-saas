"use client";

import { ReactNode, useState } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  accent?: "orange" | "green" | "neutral";
}

export default function SectionCard({
  title,
  subtitle,
  children,
  defaultOpen = false,
  accent = "neutral",
}: Props) {
  const [open, setOpen] = useState(defaultOpen);

  const accentClass =
    accent === "orange"
      ? "orange"
      : accent === "green"
        ? "green"
        : "";

  return (
    <section className="section-card">
      <style jsx>{`
        .section-card {
          width: 100%;
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.018);
          box-sizing: border-box;
        }

        .trigger {
          width: 100%;
          min-height: 58px;
          padding: 0 14px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          border: 0;
          background: transparent;
          color: #fff;
          cursor: pointer;
          text-align: left;
          -webkit-tap-highlight-color: transparent;
        }

        .trigger:active {
          background: rgba(255, 255, 255, 0.025);
        }

        .heading {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .dot {
          width: 7px;
          height: 7px;
          flex: 0 0 7px;
          border-radius: 50%;
          background: #52525b;
        }

        .dot.orange {
          background: #f97316;
        }

        .dot.green {
          background: #22c55e;
        }

        .title {
          min-width: 0;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          line-height: 1.2;
          overflow-wrap: anywhere;
        }

        .subtitle {
          margin-top: 3px;
          color: #71717a;
          font-size: 10px;
          line-height: 1.35;
        }

        .right {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .state {
          color: #52525b;
          font-size: 9px;
          font-weight: 800;
        }

        .chevron {
          color: #71717a;
          font-size: 14px;
          transition: transform 180ms ease;
        }

        .chevron.open {
          transform: rotate(180deg);
        }

        .content {
          padding: 0 14px 14px;
          border-top: 1px solid rgba(255, 255, 255, 0.05);
        }

        @media (max-width: 560px) {
          .section-card {
            border-radius: 14px;
          }

          .trigger {
            min-height: 54px;
            padding: 0 12px;
          }

          .title {
            font-size: 12px;
          }

          .subtitle {
            font-size: 9px;
          }

          .state {
            display: none;
          }

          .content {
            padding: 0 10px 10px;
          }
        }
      `}</style>

      <button
        type="button"
        className="trigger"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
      >
        <span className="heading">
          <span className={`dot ${accentClass}`} aria-hidden="true" />

          <span>
            <span className="title">{title}</span>

            {subtitle && (
              <span className="subtitle">{subtitle}</span>
            )}
          </span>
        </span>

        <span className="right">
          <span className="state">
            {open ? "Ocultar" : "Ver"}
          </span>

          <span
            className={`chevron ${open ? "open" : ""}`}
            aria-hidden="true"
          >
            ⌄
          </span>
        </span>
      </button>

      {open && <div className="content">{children}</div>}
    </section>
  );
}