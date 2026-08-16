"use client";

import LogoutButton from "@/components/auth/LogoutButton";

type Props = {
  user?: {
    full_name?: string;
    role?: {
      name?: string;
    };
  };

  stats: {
    restaurants: number;
    users: number;
    legal?: number;
  };
};

/**
 * UI ONLY
 *
 * Mantiene:
 * - user recibido desde la sesión
 * - role recibido desde la sesión
 * - LogoutButton existente
 *
 * No modifica autenticación, permisos, consultas ni datos.
 */
export default function SuperHero({
  user,
}: Props) {
  const displayName =
    user?.full_name ?? "Super Administrador";

  const roleName =
    user?.role?.name ?? "Super Admin";

  return (
    <section className="super-hero">
      <div className="hero-main">
        <div className="hero-copy">
          <span className="eyebrow">
            CENTRO DE ADMINISTRACIÓN
          </span>

          <h1>
            Hola, <span>{displayName}</span>
          </h1>

          <p>
            Gestiona restaurantes, solicitudes y módulos
            desde un solo lugar.
          </p>
        </div>

        <div className="hero-actions">
          <div className="role">
            <span className="role-dot" />
            {roleName}
          </div>

          <div className="online">
            <span className="online-dot" />
            Online
          </div>

          <LogoutButton />
        </div>
      </div>

      <div className="hero-footer">
        <span>Wolf Ordering</span>
        <span className="separator">·</span>
        <span>Panel Super Admin</span>
      </div>

      <style jsx>{`
        .super-hero {
          position: relative;
          overflow: hidden;
          margin-bottom: 0;
          padding: 24px 0 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .hero-main {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 28px;
        }

        .hero-copy {
          min-width: 0;
        }

        .eyebrow {
          display: block;
          margin-bottom: 7px;
          color: #f97316;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 1.1px;
          text-transform: uppercase;
        }

        h1 {
          margin: 0;
          color: #fff;
          font-size: clamp(28px, 4vw, 40px);
          line-height: 1.08;
          font-weight: 850;
          letter-spacing: -1.2px;
        }

        h1 span {
          color: #a1a1aa;
        }

        .hero-copy p {
          max-width: 560px;
          margin: 8px 0 0;
          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        .hero-actions {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 9px;
          flex-shrink: 0;
        }

        .role,
        .online {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .role {
          color: #a1a1aa;
          background: rgba(255, 255, 255, 0.035);
          border: 1px solid rgba(255, 255, 255, 0.06);
        }

        .online {
          color: #4ade80;
          background: rgba(34, 197, 94, 0.05);
          border: 1px solid rgba(34, 197, 94, 0.13);
        }

        .role-dot,
        .online-dot {
          width: 5px;
          height: 5px;
          border-radius: 50%;
        }

        .role-dot {
          background: #f97316;
        }

        .online-dot {
          background: #22c55e;
        }

        .hero-footer {
          display: flex;
          align-items: center;
          gap: 7px;
          margin-top: 16px;
          color: #3f3f46;
          font-size: 10px;
        }

        .separator {
          color: #27272a;
        }

        @media (max-width: 700px) {
          .super-hero {
            padding-top: 18px;
            padding-bottom: 15px;
          }

          .hero-main {
            align-items: flex-start;
            flex-direction: column;
            gap: 16px;
          }

          .hero-actions {
            width: 100%;
            justify-content: flex-start;
            flex-wrap: wrap;
          }

          h1 {
            font-size: 30px;
          }

          .hero-copy p {
            max-width: none;
          }
        }

        @media (max-width: 420px) {
          .hero-actions {
            gap: 7px;
          }

          .role {
            display: none;
          }

          .online {
            padding: 7px 9px;
          }
        }
      `}</style>
    </section>
  );
}