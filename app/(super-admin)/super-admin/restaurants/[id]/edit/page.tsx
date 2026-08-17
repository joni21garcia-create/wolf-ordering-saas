"use client";

import { useParams } from "next/navigation";
import RestaurantForm from "@/components/super-admin/restaurants/RestaurantForm";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function EditRestaurantPage() {
  const params = useParams();
  const restaurantId = (params?.id as string) || "";

  if (!restaurantId) {
    return (
      <div className="loading-state">
        Cargando información del restaurante...
        <style jsx>{`
          .loading-state {
            min-height: 100dvh;
            display: grid;
            place-items: center;
            padding: 24px;
            box-sizing: border-box;
            background: #050505;
            color: #fff;
            text-align: center;
          }
        `}</style>
      </div>
    );
  }

  return (
    <PermissionGuard permission="restaurants">
      <main className="page">
        <header className="page-header">
          <div className="eyebrow">
            <span aria-hidden="true">✏️</span>
            <span>Editar Restaurante</span>
          </div>
          <h1>Configuración del restaurante</h1>
          <p>
            Gestiona identidad, propietario, ubicación, branding y delivery sin
            convertir el móvil en un formulario interminable.
          </p>
        </header>

        <RestaurantForm mode="edit" restaurantId={restaurantId} />

        <style jsx>{`
          .page {
            min-height: 100dvh;
            box-sizing: border-box;
            padding: clamp(18px, 4vw, 38px) clamp(10px, 2vw, 24px) 40px;
            background:
              radial-gradient(circle at 50% 0%, rgba(249, 115, 22, 0.08), transparent 30%),
              linear-gradient(180deg, #050505 0%, #080808 55%, #0c1018 100%);
          }

          .page-header {
            width: min(100%, 900px);
            margin: 0 auto 18px;
            text-align: center;
          }

          .eyebrow {
            width: fit-content;
            margin: 0 auto 11px;
            padding: 7px 11px;
            display: inline-flex;
            align-items: center;
            gap: 7px;
            border: 1px solid rgba(249, 115, 22, 0.2);
            border-radius: 999px;
            background: rgba(249, 115, 22, 0.07);
            color: #fb923c;
            font-size: 10px;
            font-weight: 900;
          }

          .page-header h1 {
            margin: 0;
            color: #fff;
            font-size: clamp(1.65rem, 5vw, 2.9rem);
            line-height: 1.02;
            letter-spacing: -0.045em;
          }

          .page-header p {
            max-width: 650px;
            margin: 10px auto 0;
            color: #71717a;
            font-size: clamp(0.78rem, 1.8vw, 0.95rem);
            line-height: 1.5;
          }

          @media (max-width: 760px) {
            .page {
              padding-top: 12px;
            }

            .page-header {
              margin-bottom: 8px;
              padding-inline: 4px;
            }

            .page-header h1 {
              font-size: clamp(1.45rem, 7vw, 2rem);
            }

            .page-header p {
              max-width: 360px;
              font-size: 0.78rem;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}