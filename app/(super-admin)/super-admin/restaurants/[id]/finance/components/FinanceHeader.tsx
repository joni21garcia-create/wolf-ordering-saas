"use client";

import Link from "next/link";
import BackToSettings from "@/components/admin/BackToSettings";

interface Props {
  restaurant: {
    id: string;
    name: string;
  } | null;
}

export default function FinanceHeader({
  restaurant,
}: Props) {
  const restaurantId = restaurant?.id ?? "";

  return (
    <section className="finance-header">
      <style jsx>{`
        .finance-header {
          width: 100%;
          min-width: 0;
          margin-bottom: 32px;
        }

        .layout {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 28px;
        }

        .content {
          min-width: 0;
          flex: 1;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 9px;
          margin-bottom: 14px;
          color: #777;
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.2px;
        }

        .title {
          margin: 0;
          color: #fff;
          font-size: clamp(30px, 5vw, 48px);
          font-weight: 900;
          line-height: 1.05;
          letter-spacing: -1.5px;
          overflow-wrap: anywhere;
        }

        .description {
          max-width: 650px;
          margin: 12px 0 0;
          color: #858585;
          font-size: 14px;
          line-height: 1.6;
        }

        .actions {
          display: flex;
          flex: 0 0 auto;
          gap: 10px;
          padding-top: 26px;
        }

        .action {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 42px;
          padding: 0 16px;
          border-radius: 13px;
          text-decoration: none;
          color: #fff;
          font-size: 13px;
          font-weight: 800;
          white-space: nowrap;
          transition:
            transform 0.18s ease,
            opacity 0.18s ease,
            border-color 0.18s ease;
        }

        .action:hover {
          transform: translateY(-1px);
          opacity: 0.92;
        }

        .secondary {
          background: rgba(255, 255, 255, 0.045);
          border: 1px solid rgba(255, 255, 255, 0.09);
        }

        .primary {
          background: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.35);
        }

        @media (max-width: 760px) {
          .layout {
            flex-direction: column;
            gap: 18px;
          }

          .actions {
            width: 100%;
            padding-top: 0;
          }

          .action {
            flex: 1 1 0;
            min-width: 0;
          }
        }

        @media (max-width: 430px) {
          .finance-header {
            margin-bottom: 24px;
          }

          .breadcrumb {
            margin-bottom: 11px;
            font-size: 11px;
          }

          .title {
            font-size: 30px;
            letter-spacing: -1px;
          }

          .description {
            margin-top: 10px;
            font-size: 13px;
            line-height: 1.5;
          }

          .actions {
            gap: 8px;
          }

          .action {
            min-height: 40px;
            padding: 0 10px;
            border-radius: 11px;
            font-size: 12px;
          }
        }
      `}</style>

      <div className="layout">
        <div className="content">
          <div className="breadcrumb">
            <BackToSettings restaurantId={restaurantId} />
            <span aria-hidden="true">/</span>
            <span>Finance Center</span>
          </div>

          <h1 className="title">
            💰 {restaurant?.name ?? "Restaurante"}
          </h1>

          <p className="description">
            Centro financiero del restaurante. Aquí puedes administrar
            liquidaciones, invoices, ingresos, métricas y toda la
            información financiera del negocio.
          </p>
        </div>

        <nav className="actions" aria-label="Navegación financiera">
          <Link
            href={`/super-admin/restaurants/${restaurantId}/analytics`}
            className="action secondary"
          >
            📈 Analytics
          </Link>

          <Link
            href={`/super-admin/restaurants/${restaurantId}/settings`}
            className="action primary"
          >
            ⚙ Configuración
          </Link>
        </nav>
      </div>
    </section>
  );
}