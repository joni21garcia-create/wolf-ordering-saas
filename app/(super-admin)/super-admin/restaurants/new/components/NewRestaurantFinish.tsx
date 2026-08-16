"use client";

import Link from "next/link";

interface Props {
  restaurantId: string;
  restaurantName: string;
  slug: string;
}

const nextSteps = [
  "Configurar horarios de atención",
  "Personalizar la Landing Page",
  "Importar el menú",
  "Configurar Delivery",
  "Activar la PWA",
  "Invitar al administrador",
];

export default function NewRestaurantFinish({
  restaurantId,
  restaurantName,
  slug,
}: Props) {
  return (
    <section className="finish">
      <section className="hero">
        <div className="hero-glow" />

        <div className="hero-content">
          <div className="success-icon">✓</div>

          <div className="brand">WOLF ORDERING SAAS</div>

          <h1>
            Restaurante creado
            <br />
            correctamente
          </h1>

          <p>
            El restaurante ya forma parte del ecosistema Wolf Ordering.
            Ahora puedes continuar con la configuración completa del negocio.
          </p>
        </div>
      </section>

      <section className="info-grid">
        <InfoCard title="Restaurante" value={restaurantName} icon="🍽️" />
        <InfoCard title="Slug" value={slug} icon="🌐" />
        <InfoCard title="Estado" value="Activo" icon="🟢" />
        <InfoCard title="Plan" value="FREE" icon="📦" />
      </section>

      <section className="panel">
        <header className="panel-header">
          <div>
            <div className="eyebrow">SIGUIENTE ACCIÓN</div>
            <h2>Acciones rápidas</h2>
          </div>
        </header>

        <div className="actions">
          <Link
            href={`/super-admin/restaurants/${restaurantId}/settings`}
            className="action-link"
          >
            <ActionButton
              title="Configuración"
              subtitle="Centro de configuración"
              color="#f97316"
              icon="⚙️"
            />
          </Link>

          <Link href={`/${slug}`} className="action-link">
            <ActionButton
              title="Ver Landing"
              subtitle="Abrir sitio público"
              color="#22c55e"
              icon="🌍"
            />
          </Link>

          <Link href="/super-admin/restaurants" className="action-link">
            <ActionButton
              title="Restaurantes"
              subtitle="Administrar todos los restaurantes"
              color="#8b5cf6"
              icon="🏢"
            />
          </Link>
        </div>
      </section>

      <section className="panel next-panel">
        <header className="panel-header">
          <div>
            <div className="eyebrow">ONBOARDING</div>
            <h2>Próximos pasos</h2>
          </div>
        </header>

        <div className="steps">
          {nextSteps.map((step, index) => (
            <StepItem
              key={step}
              index={index + 1}
              text={step}
            />
          ))}
        </div>
      </section>

      <style jsx>{`
        .finish {
          width: 100%;
          min-width: 0;
          display: grid;
          gap: 18px;
        }

        .hero {
          position: relative;
          min-width: 0;
          overflow: hidden;
          box-sizing: border-box;
          padding: 42px 28px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 24px;
          background: linear-gradient(180deg, #191919, #101010);
        }

        .hero-glow {
          position: absolute;
          top: -100px;
          right: -100px;
          width: 230px;
          height: 230px;
          border-radius: 50%;
          background: rgba(34, 197, 94, 0.14);
          filter: blur(65px);
        }

        .hero-content {
          position: relative;
          z-index: 1;
          text-align: center;
        }

        .success-icon {
          width: 78px;
          height: 78px;
          display: grid;
          place-items: center;
          margin: 0 auto;
          border-radius: 50%;
          background: linear-gradient(135deg, #22c55e, #16a34a);
          color: #fff;
          font-size: 38px;
          font-weight: 900;
          box-shadow: 0 18px 45px rgba(34, 197, 94, 0.22);
        }

        .brand {
          margin-top: 18px;
          color: #22c55e;
          font-size: 7px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1.6px;
        }

        .hero h1 {
          margin: 11px 0 0;
          color: #fff;
          font-size: clamp(32px, 5vw, 48px);
          line-height: 0.98;
          font-weight: 950;
          letter-spacing: -0.055em;
        }

        .hero p {
          max-width: 650px;
          margin: 12px auto 0;
          color: #8b8b8b;
          font-size: 9px;
          line-height: 1.65;
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .panel {
          min-width: 0;
          box-sizing: border-box;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 18px;
          background: linear-gradient(180deg, #171717, #101010);
        }

        .panel-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-bottom: 15px;
        }

        .eyebrow {
          margin-bottom: 5px;
          color: #f97316;
          font-size: 6px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .panel h2 {
          margin: 0;
          color: #fff;
          font-size: 20px;
          line-height: 1.1;
          font-weight: 900;
          letter-spacing: -0.035em;
        }

        .actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 8px;
        }

        .action-link {
          min-width: 0;
          color: inherit;
          text-decoration: none;
        }

        .steps {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 6px;
        }

        @media (max-width: 820px) {
          .finish {
            gap: 12px;
          }

          .hero {
            padding: 28px 17px;
            border-radius: 18px;
          }

          .success-icon {
            width: 64px;
            height: 64px;
            font-size: 31px;
          }

          .hero h1 {
            font-size: clamp(29px, 8vw, 40px);
          }

          .hero p {
            max-width: 560px;
            font-size: 8px;
          }

          .info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .panel {
            padding: 14px;
            border-radius: 14px;
          }

          .actions {
            grid-template-columns: repeat(3, minmax(0, 1fr));
          }
        }

        @media (max-width: 520px) {
          .hero {
            padding: 23px 12px;
            border-radius: 14px;
          }

          .hero-glow {
            width: 150px;
            height: 150px;
            top: -60px;
            right: -60px;
            filter: blur(45px);
          }

          .success-icon {
            width: 54px;
            height: 54px;
            font-size: 26px;
          }

          .brand {
            margin-top: 13px;
            font-size: 5.5px;
          }

          .hero h1 {
            margin-top: 8px;
            font-size: 27px;
          }

          .hero p {
            margin-top: 8px;
            font-size: 7.5px;
            line-height: 1.55;
          }

          .info-grid {
            gap: 5px;
          }

          .panel {
            padding: 11px;
            border-radius: 11px;
          }

          .panel-header {
            margin-bottom: 10px;
          }

          .panel h2 {
            font-size: 16px;
          }

          .actions {
            grid-template-columns: 1fr;
            gap: 5px;
          }

          .steps {
            grid-template-columns: 1fr;
            gap: 5px;
          }
        }

        @media (max-width: 390px) {
          .hero h1 {
            font-size: 24px;
          }

          .hero p {
            font-size: 7px;
          }

          .panel h2 {
            font-size: 15px;
          }
        }
      `}</style>
    </section>
  );
}

function InfoCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: string;
  icon: string;
}) {
  return (
    <article className="info-card">
      <div className="info-icon">{icon}</div>
      <span>{title}</span>
      <strong title={value}>{value}</strong>

      <style jsx>{`
        .info-card {
          min-width: 0;
          position: relative;
          overflow: hidden;
          box-sizing: border-box;
          padding: 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 13px;
          background: linear-gradient(180deg, #171717, #111111);
        }

        .info-icon {
          width: 24px;
          height: 24px;
          display: grid;
          place-items: center;
          margin-bottom: 8px;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.04);
          font-size: 11px;
        }

        .info-card span {
          display: block;
          color: #707070;
          font-size: 6px;
          font-weight: 750;
          text-transform: uppercase;
          letter-spacing: 0.8px;
        }

        .info-card strong {
          display: block;
          min-width: 0;
          margin-top: 4px;
          overflow: hidden;
          color: #fff;
          font-size: 10px;
          line-height: 1.3;
          font-weight: 850;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 520px) {
          .info-card {
            padding: 9px;
            border-radius: 9px;
          }

          .info-icon {
            width: 20px;
            height: 20px;
            margin-bottom: 6px;
            font-size: 9px;
          }

          .info-card span {
            font-size: 5px;
          }

          .info-card strong {
            font-size: 8px;
          }
        }
      `}</style>
    </article>
  );
}

function ActionButton({
  title,
  subtitle,
  icon,
}: {
  title: string;
  subtitle: string;
  color: string;
  icon: string;
}) {
  return (
    <div className="action">
      <div className="action-icon">{icon}</div>
      <div className="action-title">{title}</div>
      <div className="action-subtitle">{subtitle}</div>

      <style jsx>{`
        .action {
          min-width: 0;
          box-sizing: border-box;
          height: 100%;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 12px;
          background: #141414;
          transition:
            transform 0.15s ease,
            border-color 0.15s ease,
            background 0.15s ease;
        }

        .action:hover {
          transform: translateY(-1px);
          border-color: rgba(249, 115, 22, 0.16);
          background: #181818;
        }

        .action-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          margin-bottom: 9px;
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.045);
          font-size: 13px;
        }

        .action-title {
          overflow: hidden;
          color: #fff;
          font-size: 9px;
          line-height: 1.2;
          font-weight: 850;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .action-subtitle {
          margin-top: 4px;
          color: #777;
          font-size: 6.5px;
          line-height: 1.45;
        }

        @media (max-width: 520px) {
          .action {
            display: grid;
            grid-template-columns: 29px minmax(0, 1fr);
            grid-template-rows: auto auto;
            column-gap: 8px;
            padding: 9px;
            border-radius: 9px;
          }

          .action-icon {
            grid-row: 1 / 3;
            width: 29px;
            height: 29px;
            margin: 0;
          }

          .action-title {
            align-self: end;
            font-size: 7px;
          }

          .action-subtitle {
            align-self: start;
            margin-top: 2px;
            font-size: 6px;
          }
        }
      `}</style>
    </div>
  );
}

function StepItem({
  index,
  text,
}: {
  index: number;
  text: string;
}) {
  return (
    <div className="step">
      <div className="step-number">{index}</div>
      <span>{text}</span>

      <style jsx>{`
        .step {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 9px;
          padding: 9px;
          border: 1px solid rgba(255, 255, 255, 0.045);
          border-radius: 9px;
          background: rgba(255, 255, 255, 0.018);
        }

        .step-number {
          width: 25px;
          height: 25px;
          flex: 0 0 25px;
          display: grid;
          place-items: center;
          border-radius: 50%;
          background: linear-gradient(135deg, #f97316, #ea580c);
          color: #fff;
          font-size: 7px;
          font-weight: 850;
        }

        .step span {
          min-width: 0;
          color: #d1d5db;
          font-size: 7px;
          line-height: 1.4;
        }

        @media (max-width: 520px) {
          .step {
            padding: 8px;
          }

          .step-number {
            width: 23px;
            height: 23px;
            flex-basis: 23px;
          }

          .step span {
            font-size: 6.5px;
          }
        }
      `}</style>
    </div>
  );
}