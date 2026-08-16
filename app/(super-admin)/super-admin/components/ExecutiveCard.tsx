"use client";

import Link from "next/link";
import { ReactNode } from "react";

type Props = {
  title: string;
  description: string;
  icon: ReactNode;
  href: string;
  color: string;
  badge?: string;
};

/**
 * UI ONLY
 *
 * Mantiene:
 * - href
 * - título
 * - descripción
 * - icono
 * - badge
 * - color recibido por el módulo
 *
 * No modifica permisos, autenticación ni navegación.
 */
export default function ExecutiveCard({
  title,
  description,
  icon,
  href,
  color,
  badge,
}: Props) {
  return (
    <Link href={href} className="module-card">
      <span
        className="module-icon"
        style={{
          color,
          backgroundColor: `${color}10`,
          borderColor: `${color}20`,
        }}
      >
        {icon}
      </span>

      <span className="module-content">
        <span className="module-title">{title}</span>

        <span className="module-description">
          {description}
        </span>

        {badge && (
          <span className="module-badge">
            {badge}
          </span>
        )}
      </span>

      <span className="module-arrow" aria-hidden="true">
        →
      </span>

      <style jsx>{`
        .module-card {
          position: relative;
          min-width: 0;
          min-height: 64px;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 13px;
          overflow: hidden;
          color: inherit;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: #0e0e0e;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease;
        }

        .module-card:hover {
          background: #111;
          border-color: ${color}30;
          transform: translateY(-1px);
        }

        .module-card::after {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 28%;
          height: 1px;
          background: ${color};
          opacity: 0;
          transition: opacity 0.18s ease;
        }

        .module-card:hover::after {
          opacity: 0.7;
        }

        .module-icon {
          width: 38px;
          height: 38px;
          flex: 0 0 38px;
          display: grid;
          place-items: center;
          overflow: hidden;
          border: 1px solid;
          border-radius: 10px;
        }

        .module-icon :global(svg) {
          width: 18px;
          height: 18px;
        }

        .module-content {
          min-width: 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .module-title {
          display: block;
          color: #f3f3f3;
          font-size: 13px;
          font-weight: 750;
          line-height: 1.25;
        }

        .module-description {
          display: -webkit-box;
          margin-top: 3px;
          overflow: hidden;
          color: #626262;
          font-size: 10px;
          line-height: 1.35;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 1;
        }

        .module-badge {
          margin-top: 5px;
          padding: 3px 7px;
          border-radius: 999px;
          color: #666;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.05);
          font-size: 8px;
          font-weight: 700;
          letter-spacing: 0.6px;
          line-height: 1;
          text-transform: uppercase;
        }

        .module-arrow {
          flex: 0 0 auto;
          color: #444;
          font-size: 16px;
          transition:
            color 0.18s ease,
            transform 0.18s ease;
        }

        .module-card:hover .module-arrow {
          color: ${color};
          transform: translateX(2px);
        }

        @media (max-width: 600px) {
          .module-card {
            min-height: 58px;
            padding: 10px 12px;
          }

          .module-icon {
            width: 35px;
            height: 35px;
            flex-basis: 35px;
          }

          .module-description {
            -webkit-line-clamp: 2;
          }

          .module-badge {
            margin-top: 4px;
          }
        }
      `}</style>
    </Link>
  );
}