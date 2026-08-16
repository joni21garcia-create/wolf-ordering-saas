 "use client";

import Link from "next/link";

export default function EmptyRestaurants() {
  return (
    <section className="empty-state" aria-label="Sin restaurantes">
      <div className="empty-icon" aria-hidden="true">
        🏪
      </div>

      <h2>No hay restaurantes</h2>

      <p>
        Crea tu primer restaurante para comenzar a
        administrarlo.
      </p>

      <Link
        href="/super-admin/restaurants/new"
        className="create-link"
      >
        <span>+</span>
        Crear restaurante
      </Link>

      <style jsx>{`
        .empty-state {
          min-height: 280px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          text-align: center;
          border: 1px dashed rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          background: rgba(15, 15, 15, 0.42);
        }

        .empty-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          margin-bottom: 14px;
          border: 1px solid rgba(255, 138, 31, 0.16);
          border-radius: 12px;
          background: rgba(255, 138, 31, 0.06);
          font-size: 19px;
        }

        h2 {
          margin: 0;
          color: #eeeeee;
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }

        p {
          max-width: 280px;
          margin: 7px 0 18px;
          color: #666;
          font-size: 10px;
          line-height: 1.5;
        }

        .create-link {
          height: 37px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 0 13px;
          border: 1px solid rgba(255, 106, 0, 0.2);
          border-radius: 10px;
          background: rgba(255, 106, 0, 0.08);
          color: #ff914b;
          text-decoration: none;
          font-size: 10px;
          font-weight: 750;
          transition:
            background 0.16s ease,
            border-color 0.16s ease,
            transform 0.16s ease;
        }

        .create-link:hover {
          background: rgba(255, 106, 0, 0.13);
          border-color: rgba(255, 106, 0, 0.32);
          transform: translateY(-1px);
        }

        .create-link span {
          font-size: 16px;
          font-weight: 400;
          line-height: 1;
        }

        @media (max-width: 430px) {
          .empty-state {
            min-height: 230px;
            padding: 30px 16px;
            border-radius: 14px;
          }

          .empty-icon {
            width: 40px;
            height: 40px;
            margin-bottom: 12px;
            font-size: 17px;
          }

          h2 {
            font-size: 16px;
          }

          p {
            margin-bottom: 15px;
          }
        }
      `}</style>
    </section>
  );
}