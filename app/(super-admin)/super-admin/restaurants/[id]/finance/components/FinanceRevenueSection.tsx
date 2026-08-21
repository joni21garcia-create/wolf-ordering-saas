"use client";

interface Props {
  today: number;
  week: number;
  month: number;
}

export default function FinanceRevenueSection({
  today,
  week,
  month,
}: Props) {
  return (
    <section className="revenue-section">
      <style jsx>{`
        .revenue-section {
          width: 100%;
          min-width: 0;
          margin-bottom: 34px;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 18px;
          margin-bottom: 18px;
        }

        .title {
          margin: 0;
          color: #fff;
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 800;
          line-height: 1.1;
        }

        .description {
          margin: 7px 0 0;
          color: #8b8b8b;
          font-size: 13px;
        }

        .badge {
          flex: 0 0 auto;
          padding: 8px 13px;
          border-radius: 999px;
          background: rgba(249, 115, 22, 0.10);
          color: #f97316;
          border: 1px solid rgba(249, 115, 22, 0.20);
          font-size: 11px;
          font-weight: 800;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 12px;
        }

        .card {
          min-width: 0;
          padding: 20px;
          border-radius: 18px;
          background: linear-gradient(180deg, #171717, #101010);
          border: 1px solid rgba(255,255,255,.07);
        }

        .featured {
          background: linear-gradient(135deg,#f97316,#c2410c);
          border: none;
        }

        .icon {
          font-size: 22px;
          margin-bottom: 12px;
        }

        .label {
          color: #888;
          font-size: 11px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: .6px;
        }

        .featured .label {
          color: rgba(255,255,255,.9);
        }

        .value {
          margin-top: 9px;
          color: #fff;
          font-size: clamp(25px, 4vw, 38px);
          font-weight: 900;
          line-height: 1.05;
          overflow-wrap: anywhere;
        }

        .subtitle {
          margin-top: 12px;
          color: #8b8b8b;
          font-size: 13px;
        }

        .featured .subtitle {
          color: rgba(255,255,255,.85);
        }

        @media (max-width: 700px) {
          .header {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
          }

          .grid {
            grid-template-columns: 1fr;
            gap: 10px;
          }

          .card {
            padding: 16px;
            border-radius: 15px;
          }

          .value {
            font-size: 28px;
          }
        }
      `}</style>

      <div className="header">
        <div>
          <h2 className="title">🐺 Wolf Revenue</h2>
          <p className="description">
            Ingresos correspondientes a Wolf Ordering SaaS.
          </p>
        </div>

        <div className="badge">Revenue</div>
      </div>

      <div className="grid">
        <RevenueCard
          title="Wolf Hoy"
          value={today}
          subtitle="Comisión generada hoy"
        />

        <RevenueCard
          title="Wolf Semana"
          value={week}
          subtitle="Comisión semanal"
        />

        <RevenueCard
          title="Wolf Mes"
          value={month}
          subtitle="Comisión mensual"
          featured
        />
      </div>
    </section>
  );
}

function RevenueCard({
  title,
  value,
  subtitle,
  featured,
}: {
  title: string;
  value: number;
  subtitle: string;
  featured?: boolean;
}) {
  return (
    <div className={`card ${featured ? "featured" : ""}`}>
      <div className="icon">🐺</div>
      <div className="label">{title}</div>
      <div className="value">${value.toFixed(2)}</div>
      <div className="subtitle">{subtitle}</div>
    </div>
  );
}