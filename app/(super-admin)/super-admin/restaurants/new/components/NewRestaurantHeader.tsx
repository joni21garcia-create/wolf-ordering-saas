"use client";

import Link from "next/link";

interface Props {
  currentStep: number;
  totalSteps: number;
}

export default function NewRestaurantHeader({
  currentStep,
  totalSteps,
}: Props) {
  return (
    <header className="header">
      <div className="topbar">
        <Link href="/super-admin/restaurants" className="back-link">
          <span aria-hidden="true">←</span>
          <span>Volver a Restaurantes</span>
        </Link>

        <div className="badges">
          <span className="badge badge-orange">Nuevo Restaurante</span>
          <span className="badge badge-blue">
            Paso {currentStep} / {totalSteps}
          </span>
        </div>
      </div>

      <div className="hero">
        <div className="eyebrow">WOLF ORDERING · ONBOARDING</div>

        <h1>Crear Restaurante</h1>

        <p>
          Completa el proceso de incorporación y deja el restaurante listo
          para configurar todo el ecosistema de Wolf Ordering.
        </p>
      </div>

      <div className="features">
        <Feature
          icon="⚡"
          title="Onboarding guiado"
          description="Configuración paso a paso sin perder información."
        />

        <Feature
          icon="📄"
          title="Agreement digital"
          description="Contrato integrado y listo para firmar."
        />

        <Feature
          icon="📊"
          title="Preparado para Analytics"
          description="El restaurante nace conectado al ecosistema."
        />

        <Feature
          icon="🚀"
          title="Listo para producción"
          description="Configuración profesional desde el primer día."
        />
      </div>

      <style jsx>{`
        .header {
          width: 100%;
          box-sizing: border-box;
          margin-bottom: 30px;
        }

        .topbar {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 30px;
        }

        .back-link {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: #f97316;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          transition: opacity 0.18s ease;
        }

        .back-link:hover {
          opacity: 0.78;
        }

        .back-link span:first-child {
          font-size: 15px;
          line-height: 1;
        }

        .badges {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          gap: 6px;
          flex-wrap: wrap;
        }

        .badge {
          display: inline-flex;
          align-items: center;
          min-height: 25px;
          box-sizing: border-box;
          padding: 0 9px;
          border-radius: 999px;
          font-size: 8px;
          line-height: 1;
          font-weight: 800;
          white-space: nowrap;
        }

        .badge-orange {
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.18);
          background: rgba(249, 115, 22, 0.07);
        }

        .badge-blue {
          color: #60a5fa;
          border: 1px solid rgba(96, 165, 250, 0.16);
          background: rgba(59, 130, 246, 0.07);
        }

        .hero {
          max-width: 760px;
          margin: 0 auto 28px;
          text-align: center;
        }

        .eyebrow {
          margin-bottom: 8px;
          color: #f97316;
          font-size: 7px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        .hero h1 {
          margin: 0;
          color: #fff;
          font-size: clamp(32px, 5vw, 54px);
          line-height: 0.98;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .hero p {
          max-width: 650px;
          margin: 12px auto 0;
          color: #7f8792;
          font-size: 11px;
          line-height: 1.55;
        }

        .features {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 9px;
        }

        @media (max-width: 1050px) {
          .features {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 820px) {
          .header {
            margin-bottom: 18px;
          }

          .topbar {
            margin-bottom: 19px;
          }

          .badges {
            gap: 5px;
          }

          .badge {
            min-height: 22px;
            padding-inline: 8px;
            font-size: 7px;
          }

          .hero {
            margin-bottom: 16px;
          }

          .hero h1 {
            font-size: clamp(29px, 8vw, 40px);
          }

          .hero p {
            max-width: 560px;
            margin-top: 8px;
            font-size: 9px;
            line-height: 1.45;
          }

          .features {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 6px;
          }
        }

        @media (max-width: 520px) {
          .topbar {
            align-items: flex-start;
          }

          .back-link {
            font-size: 9px;
          }

          .badges {
            max-width: 150px;
          }

          .badge-orange {
            display: none;
          }

          .hero {
            margin-bottom: 10px;
          }

          .features {
            display: none;
          }

          .eyebrow {
            margin-bottom: 6px;
            font-size: 6px;
            letter-spacing: 1.2px;
          }

          .hero h1 {
            font-size: 27px;
            line-height: 1;
          }

          .hero p {
            max-width: 330px;
            margin-top: 7px;
            font-size: 8px;
            line-height: 1.4;
          }
        }

        @media (max-width: 390px) {
          .topbar {
            margin-bottom: 11px;
          }

          .header {
            margin-bottom: 12px;
          }

          .back-link span:last-child {
            max-width: 110px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .badge {
            min-height: 20px;
            padding-inline: 7px;
            font-size: 6.5px;
          }

          .badges {
            max-width: 92px;
          }

          .hero h1 {
            font-size: 24px;
          }

          .hero p {
            max-width: 315px;
            font-size: 7.5px;
          }
        }
      `}</style>
    </header>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <div className="feature">
      <div className="feature-icon" aria-hidden="true">
        {icon}
      </div>

      <div className="feature-title">{title}</div>

      <div className="feature-description">{description}</div>

      <style jsx>{`
        .feature {
          min-width: 0;
          box-sizing: border-box;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 14px;
          background: linear-gradient(180deg, #171717, #111111);
        }

        .feature-icon {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          margin-bottom: 8px;
          border-radius: 8px;
          background: rgba(249, 115, 22, 0.07);
          font-size: 12px;
        }

        .feature-title {
          overflow: hidden;
          color: #fff;
          font-size: 8px;
          line-height: 1.2;
          font-weight: 850;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .feature-description {
          margin-top: 4px;
          color: #707070;
          font-size: 6.5px;
          line-height: 1.4;
        }

        @media (max-width: 520px) {
          .feature {
            padding: 7px 5px;
            border-radius: 9px;
            text-align: center;
          }

          .feature-icon {
            width: 22px;
            height: 22px;
            margin: 0 auto 5px;
            border-radius: 6px;
            font-size: 10px;
          }

          .feature-title {
            font-size: 5.5px;
          }

          .feature-description {
            display: none;
          }
        }

        @media (max-width: 390px) {
          .feature {
            padding-inline: 3px;
          }

          .feature-icon {
            width: 20px;
            height: 20px;
            font-size: 9px;
          }

          .feature-title {
            font-size: 5px;
          }
        }
      `}</style>
    </div>
  );
}