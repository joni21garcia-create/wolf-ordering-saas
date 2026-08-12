"use client";

import { MapPin, Plus } from "lucide-react";

interface AddressesEmptyStateProps {
  onAdd: () => void;
}

export default function AddressesEmptyState({
  onAdd,
}: AddressesEmptyStateProps) {
  return (
    <div className="addresses-empty-state">
      <div className="addresses-empty-state__icon" aria-hidden="true">
        <MapPin size={28} strokeWidth={1.7} />
      </div>

      <div className="addresses-empty-state__content">
        <h3 className="addresses-empty-state__title">
          Aún no tienes direcciones
        </h3>

        <p className="addresses-empty-state__description">
          Guarda Casa, Trabajo u otros lugares para pedir más rápido.
        </p>
      </div>

      <button
        type="button"
        className="addresses-empty-state__button"
        onClick={onAdd}
      >
        <Plus size={17} strokeWidth={2.2} />
        <span>Agregar dirección</span>
      </button>

      <style jsx>{`
        .addresses-empty-state {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          width: 100%;
          padding: 42px 24px 34px;
          text-align: center;
        }

        .addresses-empty-state__icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 64px;
          height: 64px;
          margin-bottom: 18px;
          border: 1px solid rgba(255, 255, 255, 0.09);
          border-radius: 20px;
          background:
            radial-gradient(
              circle at 50% 35%,
              rgba(255, 145, 0, 0.12),
              transparent 65%
            ),
            rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.72);
          box-shadow:
            inset 0 1px 0 rgba(255, 255, 255, 0.04),
            0 12px 30px rgba(0, 0, 0, 0.18);
        }

        .addresses-empty-state__content {
          max-width: 310px;
        }

        .addresses-empty-state__title {
          margin: 0;
          color: rgba(255, 255, 255, 0.94);
          font-size: 18px;
          font-weight: 700;
          line-height: 1.25;
          letter-spacing: -0.02em;
        }

        .addresses-empty-state__description {
          margin: 8px 0 0;
          color: rgba(255, 255, 255, 0.48);
          font-size: 13px;
          font-weight: 500;
          line-height: 1.5;
        }

        .addresses-empty-state__button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 44px;
          margin-top: 24px;
          padding: 0 18px;
          border: 1px solid rgba(255, 145, 0, 0.42);
          border-radius: 14px;
          background: rgba(255, 145, 0, 0.08);
          color: #ff9800;
          font: inherit;
          font-size: 13px;
          font-weight: 700;
          cursor: pointer;
          transition:
            transform 160ms ease,
            background 160ms ease,
            border-color 160ms ease,
            box-shadow 160ms ease;
        }

        .addresses-empty-state__button:hover {
          background: rgba(255, 145, 0, 0.13);
          border-color: rgba(255, 145, 0, 0.62);
          box-shadow: 0 8px 24px rgba(255, 145, 0, 0.1);
          transform: translateY(-1px);
        }

        .addresses-empty-state__button:active {
          transform: translateY(0) scale(0.98);
        }

        .addresses-empty-state__button:focus-visible {
          outline: 2px solid rgba(255, 145, 0, 0.8);
          outline-offset: 3px;
        }

        @media (prefers-reduced-motion: reduce) {
          .addresses-empty-state__button {
            transition: none;
          }
        }
      `}</style>
    </div>
  );
}