"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/auth/LogoutButton";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/providers/SessionProvider";
import { dashboardModules } from "../config/modules";

interface DashboardStats {
  restaurants: number;
  users: number;
  legal: number;
  liquidations: number;
}

/**
 * Super Admin Dashboard
 *
 * UI ONLY:
 * - autenticación sin cambios
 * - consultas Supabase sin cambios
 * - permisos sin cambios
 * - rutas de módulos sin cambios
 *
 * Toda la UI vive en este componente para que styled-jsx
 * aplique correctamente también en móvil.
 */
export default function SuperAdminDashboardClient() {
  const { user } = useSession();
  const permissions = user?.permissions ?? [];

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    restaurants: 0,
    users: 0,
    legal: 0,
    liquidations: 0,
  });

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const [restaurants, users, legal, liquidations] =
        await Promise.all([
          supabase
            .from("restaurants")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("restaurant_users")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("restaurant_legal_acceptance")
            .select("id", { count: "exact", head: true }),
          supabase
            .from("liquidations")
            .select("id", { count: "exact", head: true }),
        ]);

      setStats({
        restaurants: restaurants.count ?? 0,
        users: users.count ?? 0,
        legal: legal.count ?? 0,
        liquidations: liquidations.count ?? 0,
      });
    } catch (error) {
      console.error("Dashboard Error", error);
    } finally {
      setLoading(false);
    }
  }

  const allowedModules = useMemo(
    () =>
      dashboardModules.filter((module) =>
        permissions.includes(module.code)
      ),
    [permissions]
  );

  const operationModules = useMemo(
    () =>
      allowedModules.filter(
        (module) => module.category === "operation"
      ),
    [allowedModules]
  );

  const settingsModules = useMemo(
    () =>
      allowedModules.filter(
        (module) => module.category === "settings"
      ),
    [allowedModules]
  );

  const displayName = user?.full_name ?? "Super Administrador";
  const roleName = user?.role?.name ?? "Super Admin";

  return (
    <main className="page">
      <div className="shell">
        {/* HEADER */}
        <header className="topbar">
          <div className="brand">
            <div className="brand-mark">W</div>

            <div className="brand-copy">
              <strong>Wolf Ordering</strong>
              <span>{roleName}</span>
            </div>
          </div>

          <div className="topbar-actions">
            <span className="online">
              <i />
              Online
            </span>

            <LogoutButton />
          </div>
        </header>

        {/* WELCOME */}
        <section className="welcome">
          <div className="welcome-copy">
            <span className="eyebrow">
              CENTRO DE ADMINISTRACIÓN
            </span>

            <h1>
              Hola, <em>{displayName}</em>
            </h1>

            <p>
              Administra restaurantes y módulos desde un solo lugar.
            </p>
          </div>

          <div className="quick-stats">
            <div className="quick-stat">
              <strong>
                {loading ? "—" : stats.restaurants}
              </strong>
              <span>Restaurantes</span>
            </div>

            <div className="quick-stat">
              <strong>
                {loading ? "—" : stats.users}
              </strong>
              <span>Usuarios</span>
            </div>

            <div className="quick-stat">
              <strong>{allowedModules.length}</strong>
              <span>Módulos</span>
            </div>
          </div>
        </section>

        {/* MODULES */}
        <section className="modules-section">
          <div className="section-header">
            <div>
              <span className="eyebrow">ACCESOS</span>
              <h2>Módulos</h2>
              <p>
                Solo aparecen los módulos habilitados para tu cuenta.
              </p>
            </div>

            <span className="module-count">
              {allowedModules.length}
            </span>
          </div>

          {allowedModules.length > 0 ? (
            <div className="module-groups">
              {operationModules.length > 0 && (
                <div className="module-group">
                  <h3>Operación</h3>

                  <div className="module-grid">
                    {operationModules.map((module) => (
                      <Link
                        key={module.code}
                        href={module.href}
                        className="module-link"
                      >
                        <span className="module-icon">
                          {module.icon}
                        </span>

                        <span className="module-copy">
                          <strong>{module.title}</strong>
                          <small>{module.description}</small>
                        </span>

                        <span className="module-arrow">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {settingsModules.length > 0 && (
                <div className="module-group">
                  <h3>Configuración</h3>

                  <div className="module-grid">
                    {settingsModules.map((module) => (
                      <Link
                        key={module.code}
                        href={module.href}
                        className="module-link"
                      >
                        <span className="module-icon">
                          {module.icon}
                        </span>

                        <span className="module-copy">
                          <strong>{module.title}</strong>
                          <small>{module.description}</small>
                        </span>

                        <span className="module-arrow">
                          →
                        </span>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="empty">
              <strong>No tienes módulos asignados</strong>
              <span>
                Los accesos disponibles para tu cuenta aparecerán aquí.
              </span>
            </div>
          )}
        </section>

        {/* SYSTEM STATUS */}
        <section className="system-row">
          <div>
            <span className="eyebrow">ESTADO DEL SISTEMA</span>
            <h2>Plataforma operativa</h2>
            <p>Los servicios principales están disponibles.</p>
          </div>

          <span className="system-status">
            <i />
            Operativo
          </span>
        </section>

        <footer className="footer">
          <span>Wolf Ordering</span>
          <span>Super Admin</span>
        </footer>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: #080808;
          color: #fff;
        }

        .shell {
          width: min(calc(100% - 32px), 920px);
          margin: 0 auto;
          padding: 18px 0 36px;
        }

        .topbar {
          min-height: 48px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .brand-mark {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(249, 115, 22, 0.22);
          border-radius: 10px;
          background: rgba(249, 115, 22, 0.08);
          color: #fb923c;
          font-size: 14px;
          font-weight: 900;
        }

        .brand-copy strong {
          display: block;
          color: #f5f5f5;
          font-size: 13px;
          font-weight: 800;
        }

        .brand-copy span {
          display: block;
          margin-top: 2px;
          color: #555;
          font-size: 10px;
        }

        .topbar-actions {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .online,
        .system-status {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border: 1px solid rgba(34, 197, 94, 0.13);
          border-radius: 999px;
          background: rgba(34, 197, 94, 0.05);
          color: #4ade80;
          font-size: 9px;
          font-weight: 750;
        }

        .online i,
        .system-status i {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: #22c55e;
        }

        .welcome {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          padding: 28px 0 24px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .welcome-copy {
          min-width: 0;
        }

        .eyebrow {
          display: block;
          margin-bottom: 6px;
          color: #f97316;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 1.05px;
        }

        h1 {
          margin: 0;
          color: #fff;
          font-size: clamp(30px, 5vw, 42px);
          line-height: 1.05;
          letter-spacing: -1.3px;
          font-weight: 850;
        }

        h1 em {
          color: #a1a1aa;
          font-style: normal;
        }

        .welcome-copy p {
          max-width: 560px;
          margin: 8px 0 0;
          color: #666;
          font-size: 11px;
          line-height: 1.45;
        }

        .quick-stats {
          display: flex;
          flex-shrink: 0;
          align-items: center;
        }

        .quick-stat {
          min-width: 72px;
          padding: 0 10px;
          text-align: center;
        }

        .quick-stat + .quick-stat {
          border-left: 1px solid rgba(255, 255, 255, 0.08);
        }

        .quick-stat strong {
          display: block;
          color: #fff;
          font-size: 20px;
          line-height: 1;
          font-weight: 850;
        }

        .quick-stat span {
          display: block;
          margin-top: 4px;
          color: #555;
          font-size: 9px;
        }

        .modules-section {
          padding: 26px 0 24px;
        }

        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 12px;
        }

        .section-header .eyebrow {
          margin-bottom: 5px;
        }

        .section-header h2 {
          margin: 0;
          color: #fff;
          font-size: 18px;
          line-height: 1.2;
          font-weight: 800;
          letter-spacing: -0.4px;
        }

        .section-header p {
          margin: 4px 0 0;
          color: #5d5d5d;
          font-size: 10px;
        }

        .module-count {
          min-width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 9px;
          background: #0e0e0e;
          color: #aaa;
          font-size: 11px;
          font-weight: 800;
        }

        .module-groups {
          display: grid;
          gap: 17px;
        }

        .module-group h3 {
          margin: 0 0 7px;
          color: #454545;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.9px;
          text-transform: uppercase;
        }

        .module-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .module-link {
          min-width: 0;
          min-height: 64px;
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 10px 11px;
          color: inherit;
          text-decoration: none;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: #0e0e0e;
          transition:
            background 0.16s ease,
            border-color 0.16s ease,
            transform 0.16s ease;
        }

        .module-link:hover {
          background: #111;
          border-color: rgba(249, 115, 22, 0.2);
          transform: translateY(-1px);
        }

        .module-icon {
          width: 34px;
          height: 34px;
          flex: 0 0 34px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(249, 115, 22, 0.13);
          border-radius: 9px;
          background: rgba(249, 115, 22, 0.06);
          color: #f97316;
        }

        .module-icon :global(svg) {
          width: 17px;
          height: 17px;
        }

        .module-copy {
          min-width: 0;
          flex: 1;
        }

        .module-copy strong {
          display: block;
          overflow: hidden;
          color: #e8e8e8;
          font-size: 11px;
          font-weight: 750;
          line-height: 1.25;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .module-copy small {
          display: block;
          margin-top: 3px;
          overflow: hidden;
          color: #555;
          font-size: 9px;
          line-height: 1.3;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .module-arrow {
          flex: 0 0 auto;
          color: #414141;
          font-size: 15px;
        }

        .empty {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 17px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 11px;
          background: #0e0e0e;
        }

        .empty strong {
          font-size: 12px;
        }

        .empty span {
          color: #555;
          font-size: 10px;
        }

        .system-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 14px 15px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: #0e0e0e;
        }

        .system-row h2 {
          margin: 0;
          color: #ddd;
          font-size: 13px;
          font-weight: 750;
        }

        .system-row p {
          margin: 3px 0 0;
          color: #555;
          font-size: 9px;
        }

        .footer {
          display: flex;
          justify-content: space-between;
          margin-top: 22px;
          color: #333;
          font-size: 9px;
        }

        @media (max-width: 760px) {
          .shell {
            width: min(calc(100% - 24px), 560px);
            padding-top: 10px;
          }

          .welcome {
            display: block;
            padding-top: 23px;
          }

          .quick-stats {
            width: 100%;
            justify-content: space-between;
            margin-top: 20px;
          }

          .quick-stat {
            flex: 1;
          }

          .module-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 480px) {
          .shell {
            width: calc(100% - 20px);
          }

          .online {
            display: none;
          }

          h1 {
            font-size: 30px;
          }

          .module-grid {
            grid-template-columns: 1fr;
          }

          .module-link {
            min-height: 58px;
          }

          .module-copy small {
            white-space: normal;
          }

          .system-row {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
  }