"use client";

import Link from "next/link";

interface Props {
  restaurantId: string;
  title: string;
  subtitle: string;
  color?: string;
  backUrl?: string;
}

export default function HistoryHeader({
  restaurantId,
  title,
  subtitle,
  color = "#f97316",
  backUrl,
}: Props) {
  return (
    <header className="history-header">
      <div className="header-main">
        <Link
          href={
            backUrl ??
            `/admin/orders/${restaurantId}/orders`
          }
          className="back-link"
          style={{
            "--accent": color,
          } as React.CSSProperties}
        >
          <span className="back-icon">←</span>
          <span>Volver al panel</span>
        </Link>

        <div className="eyebrow">
          Centro de pedidos
        </div>

        <h1>{title}</h1>

        <p>{subtitle}</p>
      </div>

      <div className="header-badges">
        <div className="badge badge-neutral">
          Historial Inteligente
        </div>

        <div
          className="badge badge-brand"
          style={
            {
              "--accent": color,
              "--accent-soft": `${color}20`,
              "--accent-border": `${color}40`,
            } as React.CSSProperties
          }
        >
          Wolf Ordering
        </div>
      </div>

      <style jsx>{`
        .history-header {
          width: 100%;
          box-sizing: border-box;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 24px;
          margin-bottom: 28px;
        }

        .header-main {
          min-width: 0;
          flex: 1;
        }

        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: var(--accent);
          text-decoration: none;
          font-size: 13px;
          font-weight: 750;
          line-height: 1;
          transition:
            opacity 0.18s ease,
            transform 0.18s ease;
        }

        .back-link:hover {
          opacity: 0.8;
          transform: translateX(-2px);
        }

        .back-icon {
          font-size: 17px;
          line-height: 1;
        }

        .eyebrow {
          margin-top: 20px;
          color: #666;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.8px;
          line-height: 1.2;
          text-transform: uppercase;
        }

        h1 {
          margin: 8px 0 7px;
          color: #fff;
          font-size: clamp(30px, 4vw, 44px);
          font-weight: 850;
          letter-spacing: -1.2px;
          line-height: 1.05;
        }

        p {
          max-width: 760px;
          margin: 0;
          color: #777;
          font-size: 13px;
          line-height: 1.55;
        }

        .header-badges {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
          justify-content: flex-end;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          min-height: 38px;
          box-sizing: border-box;
          padding: 9px 13px;
          border-radius: 12px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .badge-neutral {
          color: #777;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid
            rgba(255, 255, 255, 0.06);
        }

        .badge-brand {
          color: var(--accent);
          background: var(--accent-soft);
          border: 1px solid var(--accent-border);
        }

        @media (max-width: 900px) {
          .history-header {
            gap: 18px;
          }

          .header-badges {
            max-width: 240px;
          }

          .badge {
            padding: 8px 11px;
          }
        }

        @media (max-width: 700px) {
          .history-header {
            display: block;
            margin-bottom: 22px;
          }

          .header-badges {
            margin-top: 16px;
            justify-content: flex-start;
            max-width: none;
          }

          .eyebrow {
            margin-top: 17px;
          }

          h1 {
            font-size: 30px;
            letter-spacing: -0.8px;
          }

          p {
            max-width: none;
            font-size: 12px;
            line-height: 1.5;
          }
        }

        @media (max-width: 480px) {
          .history-header {
            margin-bottom: 18px;
          }

          .back-link {
            font-size: 12px;
          }

          .eyebrow {
            margin-top: 15px;
            font-size: 8px;
            letter-spacing: 1.4px;
          }

          h1 {
            margin-top: 7px;
            font-size: 27px;
          }

          p {
            font-size: 11px;
          }

          .header-badges {
            display: grid;
            grid-template-columns: repeat(
              2,
              minmax(0, 1fr)
            );
            width: 100%;
            gap: 7px;
          }

          .badge {
            width: 100%;
            justify-content: center;
            min-height: 35px;
            padding: 7px 8px;
            border-radius: 10px;
            font-size: 9px;
          }
        }

        @media (max-width: 350px) {
          .header-badges {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </header>
  );
}