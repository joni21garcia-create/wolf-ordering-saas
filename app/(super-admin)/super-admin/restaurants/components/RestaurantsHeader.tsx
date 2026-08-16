 "use client";

import Link from "next/link";

export default function RestaurantsHeader() {
  return (
    <header className="restaurants-header">
      <div className="header-copy">
        <div className="eyebrow">
          <span className="dot" />
          <span>SUPER ADMIN</span>
          <span className="slash">/</span>
          <span>RESTAURANTES</span>
        </div>

        <h1>Restaurantes</h1>

        <p>Administra y configura los restaurantes de tu plataforma.</p>
      </div>

      <Link
        href="/super-admin/restaurants/new"
        className="new-restaurant"
        aria-label="Nuevo restaurante"
      >
        <span className="plus">+</span>
        <span className="button-label">Nuevo restaurante</span>
      </Link>

      <style jsx>{`
        .restaurants-header {
          width: 100%;
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 20px;
          margin-bottom: 22px;
        }

        .header-copy {
          min-width: 0;
          flex: 1;
        }

        .eyebrow {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 6px;
          margin-bottom: 8px;
          color: #6d6d6d;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 0.12em;
        }

        .dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: #ff6a00;
        }

        .slash {
          color: #383838;
        }

        h1 {
          margin: 0;
          color: #f5f5f5;
          font-size: clamp(28px, 4vw, 40px);
          font-weight: 800;
          line-height: 1;
          letter-spacing: -0.04em;
        }

        p {
          margin: 7px 0 0;
          color: #666;
          font-size: 10px;
          line-height: 1.4;
        }

        .new-restaurant {
          flex: 0 0 auto;
          width: 42px;
          height: 42px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border: 1px solid rgba(255, 106, 0, 0.24);
          border-radius: 12px;
          background: rgba(255, 106, 0, 0.08);
          color: #ff8a3d;
          text-decoration: none;
          transition:
            background 0.18s ease,
            border-color 0.18s ease,
            transform 0.18s ease;
        }

        .new-restaurant:hover {
          background: rgba(255, 106, 0, 0.13);
          border-color: rgba(255, 106, 0, 0.35);
          transform: translateY(-1px);
        }

        .plus {
          font-size: 22px;
          font-weight: 400;
          line-height: 1;
        }

        .button-label {
          display: none;
        }

        @media (min-width: 721px) {
          .new-restaurant {
            width: auto;
            height: 40px;
            padding: 0 13px;
            gap: 7px;
            border-radius: 10px;
            font-size: 10px;
            font-weight: 750;
          }

          .button-label {
            display: inline;
          }

          .plus {
            font-size: 18px;
          }
        }

        @media (max-width: 430px) {
          .restaurants-header {
            align-items: flex-start;
            gap: 10px;
            margin-bottom: 18px;
          }

          .eyebrow {
            margin-bottom: 7px;
            font-size: 7px;
          }

          h1 {
            font-size: 27px;
          }

          p {
            display: none;
          }
        }

        @media (max-width: 380px) {
          .new-restaurant {
            width: 38px;
            height: 38px;
            border-radius: 10px;
          }

          .plus {
            font-size: 20px;
          }
        }
      `}</style>
    </header>
  );
}