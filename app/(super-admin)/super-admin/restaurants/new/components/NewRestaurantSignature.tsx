"use client";

interface Props {
  signerName: string;
  signerEmail: string;
  signed: boolean;
  onSignerChange: (value: string) => void;
  onSignedChange: (value: boolean) => void;
}

export default function NewRestaurantSignature({
  signerName,
  signerEmail,
  signed,
  onSignerChange,
  onSignedChange,
}: Props) {
  const today = new Date().toLocaleDateString();

  return (
    <section className="signature">
      <header className="intro">
        <div className="eyebrow">PASO 6 · FIRMA</div>
        <h2>Firma del Agreement</h2>
        <p>
          El representante legal confirma que la información suministrada es
          correcta y acepta el Agreement Comercial de Wolf Ordering.
        </p>
      </header>

      <div className="signature-card">
        <div className="card-heading">
          <div className="heading-icon">06</div>
          <div>
            <strong>Datos del representante</strong>
            <span>Verifica la información antes de firmar.</span>
          </div>
        </div>

        <div className="fields">
          <Field label="Representante Legal">
            <input
              value={signerName}
              onChange={(e) => onSignerChange(e.target.value)}
              placeholder="Nombre completo"
              autoComplete="name"
            />
          </Field>

          <Field label="Correo electrónico">
            <input
              value={signerEmail}
              readOnly
              aria-readonly="true"
              inputMode="email"
            />
          </Field>

          <Field label="Fecha">
            <input value={today} readOnly aria-readonly="true" />
          </Field>
        </div>

        <div className="signature-area">
          <div className="signature-symbol">✎</div>
          <strong>Área de firma</strong>
          <span>
            Espacio reservado para la firma electrónica y firma manuscrita
            digital.
          </span>
          <small>La firma se completará como parte del proceso legal.</small>
        </div>

        <label className={`confirmation ${signed ? "checked" : ""}`}>
          <input
            type="checkbox"
            checked={signed}
            onChange={(e) => onSignedChange(e.target.checked)}
          />

          <span className="checkbox-ui" aria-hidden="true">
            {signed ? "✓" : ""}
          </span>

          <span className="confirmation-copy">
            <strong>Confirmo mi autorización</strong>
            <span>
              Confirmo que soy el representante autorizado y firmo este
              Agreement de manera electrónica.
            </span>
          </span>
        </label>
      </div>

      <div className={`status ${signed ? "ready" : ""}`}>
        <span className="status-dot" />
        <span>
          {signed
            ? "Firma confirmada. Puedes continuar."
            : "Pendiente de confirmación de firma."}
        </span>
      </div>

      <style jsx>{`
        .signature {
          width: 100%;
          min-width: 0;
          display: grid;
          gap: 14px;
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
          max-width: 650px;
          margin: 9px 0 0;
          color: #8b8b8b;
          font-size: 10px;
          line-height: 1.6;
        }

        .signature-card {
          min-width: 0;
          box-sizing: border-box;
          display: grid;
          gap: 17px;
          padding: 19px;
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

        .fields {
          display: grid;
          grid-template-columns: 1.15fr 1fr 0.55fr;
          gap: 9px;
        }

        .fields :global(input) {
          width: 100%;
          min-width: 0;
          height: 38px;
          box-sizing: border-box;
          padding: 0 10px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 9px;
          outline: none;
          background: #0d0d0d;
          color: #fff;
          font-size: 8px;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .fields :global(input:focus) {
          border-color: rgba(249, 115, 22, 0.42);
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.06);
        }

        .fields :global(input[readonly]) {
          color: #777;
          background: #121212;
        }

        .signature-area {
          min-height: 120px;
          box-sizing: border-box;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 18px;
          border: 1px dashed rgba(249, 115, 22, 0.28);
          border-radius: 13px;
          background:
            radial-gradient(
              circle at center,
              rgba(249, 115, 22, 0.045),
              transparent 62%
            ),
            #101010;
          text-align: center;
        }

        .signature-symbol {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          margin-bottom: 7px;
          border-radius: 8px;
          background: rgba(249, 115, 22, 0.08);
          color: #f97316;
          font-size: 13px;
        }

        .signature-area strong {
          color: #fff;
          font-size: 8px;
          font-weight: 850;
        }

        .signature-area span {
          max-width: 390px;
          margin-top: 4px;
          color: #777;
          font-size: 6.5px;
          line-height: 1.45;
        }

        .signature-area small {
          margin-top: 6px;
          color: #4f4f4f;
          font-size: 5.5px;
        }

        .confirmation {
          min-width: 0;
          display: flex;
          align-items: flex-start;
          gap: 9px;
          padding: 11px;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.018);
          cursor: pointer;
          transition:
            border-color 0.15s ease,
            background 0.15s ease;
        }

        .confirmation.checked {
          border-color: rgba(34, 197, 94, 0.2);
          background: rgba(34, 197, 94, 0.035);
        }

        .confirmation input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .checkbox-ui {
          width: 19px;
          height: 19px;
          flex: 0 0 19px;
          display: grid;
          place-items: center;
          box-sizing: border-box;
          border: 1px solid rgba(255, 255, 255, 0.18);
          border-radius: 5px;
          background: #0c0c0c;
          color: #fff;
          font-size: 10px;
          font-weight: 900;
        }

        .confirmation.checked .checkbox-ui {
          border-color: #22c55e;
          background: #22c55e;
        }

        .confirmation-copy {
          min-width: 0;
          display: grid;
          gap: 3px;
        }

        .confirmation-copy strong {
          color: #fff;
          font-size: 8px;
          font-weight: 850;
        }

        .confirmation-copy span {
          color: #777;
          font-size: 6.5px;
          line-height: 1.5;
        }

        .status {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
          padding: 0 3px;
          color: #666;
          font-size: 6.5px;
        }

        .status-dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: #f59e0b;
        }

        .status.ready {
          color: #6fae82;
        }

        .status.ready .status-dot {
          background: #22c55e;
        }

        @media (max-width: 700px) {
          .signature-card {
            padding: 14px;
            border-radius: 14px;
            gap: 13px;
          }

          .fields {
            grid-template-columns: 1fr 1fr;
          }

          .fields > :last-child {
            grid-column: 1 / -1;
          }

          .fields :global(input) {
            height: 42px;
            font-size: 9px;
          }

          .signature-area {
            min-height: 115px;
          }
        }

        @media (max-width: 520px) {
          .signature {
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
            line-height: 1.5;
          }

          .signature-card {
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

          .fields {
            grid-template-columns: 1fr;
          }

          .fields > :last-child {
            grid-column: auto;
          }

          .fields :global(input) {
            height: 43px;
            font-size: 9px;
          }

          .signature-area {
            min-height: 125px;
            padding: 14px;
          }

          .confirmation {
            padding: 10px;
          }

          .confirmation-copy strong {
            font-size: 8px;
          }

          .confirmation-copy span {
            font-size: 7px;
          }

          .status {
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

          .signature-card {
            padding: 10px;
          }

          .signature-area {
            min-height: 115px;
          }

          .confirmation-copy span {
            font-size: 6.5px;
          }
        }
      `}</style>
    </section>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="field">
      <span>{label}</span>
      {children}

      <style jsx>{`
        .field {
          min-width: 0;
          display: grid;
          gap: 6px;
        }

        .field > span {
          color: #8b8b8b;
          font-size: 6.5px;
          line-height: 1.2;
          font-weight: 750;
        }
      `}</style>
    </label>
  );
}