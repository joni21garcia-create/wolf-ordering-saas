"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  restaurantId: string;
  active: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export default function RestaurantActions({
  restaurantId,
  active,
  onToggleStatus,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () =>
      document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div className="actions">
      <Link
        href={`/super-admin/restaurants/${restaurantId}/finance`}
        className="action action-primary"
      >
        Dashboard
      </Link>

      <Link
        href={`/super-admin/restaurants/${restaurantId}/settings`}
        className="action action-secondary"
      >
        Configuración
      </Link>

      <div ref={containerRef} className="menu-wrap">
        <button
          type="button"
          className={`menu-button ${open ? "is-open" : ""}`}
          onClick={() => setOpen((value) => !value)}
          aria-label="Más opciones"
          aria-expanded={open}
        >
          <span />
          <span />
          <span />
        </button>

        {open && (
          <div className="dropdown">
            <Link
              href={`/super-admin/restaurants/${restaurantId}/edit`}
              className="menu-link"
              onClick={() => setOpen(false)}
            >
              <span className="menu-icon">✎</span>
              <span>Editar</span>
            </Link>

            <button
              type="button"
              className="menu-item"
              onClick={() => {
                setOpen(false);
                onToggleStatus?.();
              }}
            >
              <span className="menu-icon">
                {active ? "Ⅱ" : "▶"}
              </span>
              <span>{active ? "Desactivar" : "Activar"}</span>
            </button>

            <div className="divider" />

            <button
              type="button"
              className="menu-item danger"
              onClick={() => {
                setOpen(false);
                onDelete?.();
              }}
            >
              <span className="menu-icon">×</span>
              <span>Eliminar</span>
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .actions {
          width: 100%;
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 42px;
          align-items: center;
          gap: 7px;
          margin-top: 4px;
        }

        .action {
          height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          text-decoration: none;
          font-size: 10px;
          font-weight: 750;
          transition:
            background 0.16s ease,
            border-color 0.16s ease,
            transform 0.16s ease;
        }

        .action:hover {
          transform: translateY(-1px);
        }

        .action-primary {
          border: 1px solid rgba(255, 106, 0, 0.2);
          background: rgba(255, 106, 0, 0.1);
          color: #ff914b;
        }

        .action-primary:hover {
          border-color: rgba(255, 106, 0, 0.34);
          background: rgba(255, 106, 0, 0.15);
        }

        .action-secondary {
          border: 1px solid rgba(255, 255, 255, 0.07);
          background: rgba(255, 255, 255, 0.035);
          color: #c5c5c5;
        }

        .action-secondary:hover {
          border-color: rgba(255, 255, 255, 0.13);
          background: rgba(255, 255, 255, 0.055);
        }

        .menu-wrap {
          position: relative;
          display: flex;
          justify-content: flex-end;
        }

        .menu-button {
          width: 42px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.035);
          cursor: pointer;
          transition:
            background 0.16s ease,
            border-color 0.16s ease;
        }

        .menu-button span {
          width: 3px;
          height: 3px;
          border-radius: 50%;
          background: #8d8d8d;
        }

        .menu-button:hover,
        .menu-button.is-open {
          border-color: rgba(255, 106, 0, 0.22);
          background: rgba(255, 106, 0, 0.08);
        }

        .menu-button.is-open span {
          background: #ff8a3d;
        }

        .dropdown {
          position: absolute;
          z-index: 100;
          right: 0;
          bottom: calc(100% + 8px);
          width: 190px;
          overflow: hidden;
          padding: 5px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 13px;
          background: #181818;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.4);
          animation: menuOpen 0.14s ease-out;
        }

        .menu-link,
        .menu-item {
          width: 100%;
          min-height: 37px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 0 9px;
          border: 0;
          border-radius: 8px;
          background: transparent;
          color: #cfcfcf;
          font: inherit;
          font-size: 10px;
          font-weight: 600;
          text-align: left;
          text-decoration: none;
          cursor: pointer;
        }

        .menu-link:hover,
        .menu-item:hover {
          background: rgba(255, 255, 255, 0.045);
          color: #fff;
        }

        .menu-icon {
          width: 20px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: #8a8a8a;
          font-size: 12px;
        }

        .danger {
          color: #f07878;
        }

        .danger .menu-icon {
          color: #ef6666;
        }

        .divider {
          height: 1px;
          margin: 4px 5px;
          background: rgba(255, 255, 255, 0.06);
        }

        @keyframes menuOpen {
          from {
            opacity: 0;
            transform: translateY(4px) scale(0.98);
          }

          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        @media (max-width: 430px) {
          .actions {
            grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) 40px;
            gap: 6px;
          }

          .action,
          .menu-button {
            height: 38px;
          }

          .action {
            font-size: 9px;
          }

          .menu-button {
            width: 40px;
          }

          .dropdown {
            width: 180px;
          }
        }
      `}</style>
    </div>
  );
}