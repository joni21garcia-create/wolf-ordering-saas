"use client";

import { useState } from "react";
import EmptyRestaurants from "./EmptyRestaurants";
import RestaurantCard from "./RestaurantCard";

type Props = {
  restaurants: any[];
  onToggleStatus?: (restaurant: any) => void;
  onDelete?: (restaurant: any) => void;
};

export default function RestaurantGrid({
  restaurants,
  onToggleStatus,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);

  if (!restaurants.length) {
    return <EmptyRestaurants />;
  }

  return (
    <section className={`restaurants-section ${open ? "is-open" : ""}`}>
      <button
        type="button"
        className="restaurants-trigger"
        onClick={() => setOpen((current) => !current)}
        aria-expanded={open}
        aria-controls="restaurants-list"
      >
        <div className="trigger-copy">
          <span className="eyebrow">GESTIÓN</span>

          <div className="title-row">
            <h2>Restaurantes</h2>

            <span className="count">
              {restaurants.length}
            </span>
          </div>

          <p>
            {open
              ? "Selecciona un restaurante para ver sus opciones."
              : "Toca para mostrar el listado."}
          </p>
        </div>

        <span className="chevron" aria-hidden="true">
          {open ? "⌃" : "⌄"}
        </span>
      </button>

      <div
        id="restaurants-list"
        className={`restaurants-content ${
          open ? "content-open" : ""
        }`}
        aria-hidden={!open}
      >
        <div className="restaurants-content-inner">
          <div className="restaurants-grid">
            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onToggleStatus={() =>
                  onToggleStatus?.(restaurant)
                }
                onDelete={() => onDelete?.(restaurant)}
              />
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
        .restaurants-section {
          width: 100%;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 18px;
          background: rgba(14, 14, 14, 0.72);
          box-shadow:
            0 12px 40px rgba(0, 0, 0, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.025);
        }

        .restaurants-trigger {
          width: 100%;
          min-height: 78px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 16px 18px;
          border: 0;
          background: transparent;
          color: #fff;
          text-align: left;
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .trigger-copy {
          min-width: 0;
        }

        .eyebrow {
          display: block;
          margin-bottom: 4px;
          color: #ff6a00;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.14em;
        }

        .title-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        h2 {
          margin: 0;
          color: #f5f5f5;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        .count {
          min-width: 25px;
          height: 25px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 7px;
          border: 1px solid rgba(255, 106, 0, 0.16);
          border-radius: 999px;
          background: rgba(255, 106, 0, 0.07);
          color: #ff8a3d;
          font-size: 11px;
          font-weight: 750;
        }

        p {
          margin: 4px 0 0;
          color: #666;
          font-size: 10px;
          line-height: 1.35;
        }

        .chevron {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.035);
          color: #a0a0a0;
          font-size: 18px;
          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            color 0.22s ease;
        }

        .is-open .chevron {
          color: #ff7a1a;
          border-color: rgba(255, 106, 0, 0.22);
        }

        .restaurants-content {
          display: grid;
          grid-template-rows: 0fr;
          opacity: 0;
          transition:
            grid-template-rows 280ms cubic-bezier(.22, 1, .36, 1),
            opacity 180ms ease;
        }

        .content-open {
          grid-template-rows: 1fr;
          opacity: 1;
        }

        .restaurants-content-inner {
          min-height: 0;
          overflow: hidden;
        }

        .restaurants-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 14px;
          padding: 0 14px 14px;
        }

        @media (max-width: 1180px) {
          .restaurants-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 720px) {
          .restaurants-trigger {
            min-height: 72px;
            padding: 14px;
          }

          .restaurants-grid {
            grid-template-columns: minmax(0, 1fr);
            gap: 10px;
            padding: 0 10px 10px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .restaurants-content,
          .chevron {
            transition: none;
          }
        }
      `}</style>
    </section>
  );
}