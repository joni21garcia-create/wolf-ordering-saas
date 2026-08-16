"use client";

interface Props {
  restaurantName: string;
  slug: string;
  owner: string;
  email: string;
  plan: string;
  agreementAccepted: boolean;
}

export default function NewRestaurantSummary({
  restaurantName,
  slug,
  owner,
  email,
  plan,
  agreementAccepted,
}: Props) {
  const rows = [
    { label: "Restaurante", value: restaurantName || "-" },
    { label: "Slug", value: slug || "-" },
    { label: "Propietario", value: owner || "-" },
    { label: "Correo", value: email || "-" },
    { label: "Plan", value: plan || "-" },
  ];

  return (
    <section className="summary">
      <header className="intro">
        <div className="eyebrow">PASO 7 · REVISIÓN</div>
        <h2>Resumen Final</h2>
        <p>Revisa la información antes de crear el restaurante.</p>
      </header>

      <div className="review-card">
        <div className="card-heading">
          <div className="heading-icon">07</div>
          <div>
            <strong>Datos del restaurante</strong>
            <span>Confirma que todo esté correcto antes de finalizar.</span>
          </div>
        </div>

        <div className="rows">
          {rows.map((row) => (
            <Row key={row.label} label={row.label} value={row.value} />
          ))}
        </div>

        <div className={`agreement ${agreementAccepted ? "accepted" : "pending"}`}>
          <div className="agreement-icon">
            {agreementAccepted ? "✓" : "!"}
          </div>

          <div>
            <strong>Agreement</strong>
            <span>
              {agreementAccepted
                ? "Aceptado y listo para finalizar."
                : "Pendiente de aceptación."}
            </span>
          </div>

          <b>{agreementAccepted ? "Aceptado" : "Pendiente"}</b>
        </div>
      </div>

      <div className={`ready ${agreementAccepted ? "is-ready" : ""}`}>
        <span className="ready-dot" />
        <span>
          {agreementAccepted
            ? "Todo listo. Puedes crear el restaurante."
            : "Completa la aceptación del Agreement antes de finalizar."}
        </span>
      </div>

      <style jsx>{`
        .summary {
          width: 100%;
          min-width: 0;
          display: grid;
          gap: 13px;
        }

        .intro {
          max-width: 700px;
        }

        .eyebrow {
          margin-bottom: 7px;
          color: #f97316;
          font-size: 7px;
          line-height: 1;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .intro h2 {
          margin: 0;
          color: #fff;
          font-size: clamp(25px, 4vw, 34px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.045em;
        }

        .intro p {
          margin: 9px 0 0;
          color: #8b8b8b;
          font-size: 10px;
          line-height: 1.55;
        }

        .review-card {
          min-width: 0;
          box-sizing: border-box;
          padding: 18px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 17px;
          background: linear-gradient(180deg, #151515, #101010);
        }

        .card-heading {
          display: flex;
          align-items: center;
          gap: 9px;
          padding-bottom: 13px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .heading-icon {
          width: 30px;
          height: 30px;
          flex: 0 0 30px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(249, 115, 22, 0.08);
          color: #f97316;
          font-size: 7px;
          font-weight: 900;
        }

        .card-heading strong,
        .card-heading span {
          display: block;
        }

        .card-heading strong {
          color: #fff;
          font-size: 9px;
          font-weight: 850;
        }

        .card-heading span {
          margin-top: 3px;
          color: #666;
          font-size: 6.5px;
        }

        .rows {
          display: grid;
          padding-top: 2px;
        }

        .agreement {
          min-width: 0;
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr) auto;
          align-items: center;
          gap: 9px;
          margin-top: 7px;
          padding: 10px;
          border: 1px solid rgba(255, 255, 255, 0.05);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.018);
        }

        .agreement-icon {
          width: 28px;
          height: 28px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(245, 158, 11, 0.08);
          color: #f59e0b;
          font-size: 9px;
          font-weight: 900;
        }

        .agreement.accepted .agreement-icon {
          background: rgba(34, 197, 94, 0.08);
          color: #22c55e;
        }

        .agreement strong,
        .agreement span {
          display: block;
        }

        .agreement strong {
          color: #fff;
          font-size: 8px;
          font-weight: 850;
        }

        .agreement span {
          margin-top: 3px;
          color: #666;
          font-size: 6.5px;
        }

        .agreement b {
          color: #f59e0b;
          font-size: 7px;
          font-weight: 850;
        }

        .agreement.accepted b {
          color: #22c55e;
        }

        .ready {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          padding: 0 3px;
          color: #777;
          font-size: 6.5px;
          line-height: 1.4;
        }

        .ready-dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: #f59e0b;
        }

        .ready.is-ready {
          color: #6fae82;
        }

        .ready.is-ready .ready-dot {
          background: #22c55e;
        }

        @media (max-width: 520px) {
          .summary {
            gap: 10px;
          }

          .eyebrow {
            font-size: 6px;
          }

          .intro h2 {
            font-size: 25px;
          }

          .intro p {
            margin-top: 7px;
            font-size: 8px;
          }

          .review-card {
            padding: 11px;
            border-radius: 12px;
          }

          .card-heading {
            padding-bottom: 10px;
          }

          .heading-icon {
            width: 27px;
            height: 27px;
            flex-basis: 27px;
          }

          .agreement {
            grid-template-columns: 26px minmax(0, 1fr);
            gap: 8px;
          }

          .agreement b {
            grid-column: 2;
            justify-self: start;
            margin-top: -2px;
          }

          .ready {
            font-size: 6.5px;
          }
        }

        @media (max-width: 390px) {
          .intro h2 {
            font-size: 23px;
          }

          .intro p {
            font-size: 7.5px;
          }

          .review-card {
            padding: 10px;
          }
        }
      `}</style>
    </section>
  );
}

function Row({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="row">
      <span>{label}</span>
      <strong title={value}>{value}</strong>

      <style jsx>{`
        .row {
          min-width: 0;
          display: grid;
          grid-template-columns: minmax(72px, 0.45fr) minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          min-height: 42px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.045);
        }

        .row span {
          color: #777;
          font-size: 7px;
          font-weight: 650;
        }

        .row strong {
          min-width: 0;
          overflow: hidden;
          color: #fff;
          font-size: 8px;
          line-height: 1.3;
          font-weight: 750;
          text-align: right;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 520px) {
          .row {
            grid-template-columns: minmax(65px, 0.55fr) minmax(0, 1fr);
            min-height: 39px;
            gap: 8px;
          }

          .row span {
            font-size: 6.5px;
          }

          .row strong {
            font-size: 7.5px;
          }
        }
      `}</style>
    </div>
  );
}