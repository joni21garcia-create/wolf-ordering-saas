"use client";

import { useRouter } from "next/navigation";

export default function SettingsHeader() {
  const router = useRouter();

  return (
    <nav className="actions" aria-label="Acciones de configuración">
      <button
        type="button"
        className="action secondary"
        onClick={() => router.push("/super-admin/restaurants")}
      >
        <span aria-hidden="true">🏪</span>
        Lista
      </button>

      <button
        type="button"
        className="action primary"
        onClick={() => router.push("/super-admin")}
      >
        <span aria-hidden="true">⌂</span>
        Dashboard
      </button>

      <style jsx>{`
        .actions {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: 7px;
          margin: 0 0 16px;
        }

        .action {
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 11px;
          border-radius: 9px;
          font: inherit;
          font-size: 9px;
          font-weight: 750;
          cursor: pointer;
          transition:
            background 0.16s ease,
            border-color 0.16s ease,
            transform 0.16s ease;
        }

        .action:hover {
          transform: translateY(-1px);
        }

        .secondary {
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.03);
          color: #aaa;
        }

        .secondary:hover {
          border-color: rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.055);
          color: #eee;
        }

        .primary {
          border: 1px solid rgba(255, 106, 0, 0.2);
          background: rgba(255, 106, 0, 0.09);
          color: #ff914b;
        }

        .primary:hover {
          border-color: rgba(255, 106, 0, 0.32);
          background: rgba(255, 106, 0, 0.14);
        }

        @media (max-width: 430px) {
          .actions {
            justify-content: stretch;
            margin-bottom: 12px;
          }

          .action {
            flex: 1;
            min-height: 36px;
          }
        }
      `}</style>
    </nav>
  );
}