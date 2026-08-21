"use client";

import Link from "next/link";

export default function FinanceFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <style jsx>{`
        .footer {
          width: 100%;
          margin-top: 50px;
          padding-top: 24px;
          padding-bottom: 20px;
          border-top: 1px solid rgba(255,255,255,.07);
        }

        .layout {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 18px;
          flex-wrap: wrap;
        }

        .brand {
          color: #fff;
          font-size: 16px;
          font-weight: 900;
        }

        .subtitle {
          margin-top: 6px;
          color: #777;
          font-size: 12px;
        }

        .actions {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 14px;
          border-radius: 12px;
          background: rgba(255,255,255,.04);
          border: 1px solid rgba(255,255,255,.08);
          color: #fff;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          transition: .18s ease;
          white-space: nowrap;
        }

        .button:hover {
          background: rgba(255,255,255,.08);
        }

        @media(max-width:560px){
          .layout {
            align-items: stretch;
            flex-direction: column;
          }

          .actions {
            width: 100%;
          }

          .button {
            flex: 1;
            min-width: 0;
          }
        }
      `}</style>

      <div className="layout">
        <div>
          <div className="brand">
            🐺 Wolf Ordering SaaS
          </div>

          <div className="subtitle">
            Finance Center · {year}
          </div>
        </div>

        <div className="actions">
          <Link href="../analytics" className="button">
            📈 Analytics
          </Link>

          <Link href="../settings" className="button">
            ⚙ Configuración
          </Link>

          <Link href="../orders" className="button">
            📦 Pedidos
          </Link>
        </div>
      </div>
    </footer>
  );
}