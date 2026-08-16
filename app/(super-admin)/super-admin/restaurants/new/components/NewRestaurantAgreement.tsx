"use client";

interface Props {
  version: string;
  acceptedTerms: boolean;
  acceptedPrivacy: boolean;
  acceptedCommission: boolean;
  onAcceptedTerms: (value: boolean) => void;
  onAcceptedPrivacy: (value: boolean) => void;
  onAcceptedCommission: (value: boolean) => void;
}

export default function NewRestaurantAgreement({
  version,
  acceptedTerms,
  acceptedPrivacy,
  acceptedCommission,
  onAcceptedTerms,
  onAcceptedPrivacy,
  onAcceptedCommission,
}: Props) {
  return (
    <section className="agreement">
      <header className="agreement-header">
        <span className="version">Agreement v{version}</span>

        <h2>Acuerdo Comercial</h2>

        <p>
          Antes de crear el restaurante debes aceptar el acuerdo comercial de
          Wolf Ordering SaaS.
        </p>
      </header>

      <div className="terms-card">
        <AgreementBlock
          number="01"
          title="Servicios incluidos"
          text="Wolf Ordering proporcionará la plataforma SaaS, panel administrativo, analytics, pedidos, PWA, actualizaciones y soporte según el plan contratado."
        />

        <AgreementBlock
          number="02"
          title="Comisiones"
          text="Las comisiones serán calculadas automáticamente según la configuración financiera del restaurante y las reglas comerciales vigentes."
        />

        <AgreementBlock
          number="03"
          title="Protección de datos"
          text="Toda la información del restaurante y de sus clientes será tratada conforme a la política de privacidad de la plataforma."
        />

        <AgreementBlock
          number="04"
          title="Responsabilidades"
          text="El restaurante es responsable del contenido publicado, precios, horarios, disponibilidad y cumplimiento de la normativa aplicable."
        />
      </div>

      <div className="checks-card">
        <div className="checks-heading">
          <span>Confirmación</span>
          <small>Debes aceptar las 3 condiciones para continuar.</small>
        </div>

        <AgreementCheck
          checked={acceptedTerms}
          onChange={onAcceptedTerms}
          text="He leído y acepto el Agreement Comercial."
        />

        <AgreementCheck
          checked={acceptedPrivacy}
          onChange={onAcceptedPrivacy}
          text="Acepto la Política de Privacidad."
        />

        <AgreementCheck
          checked={acceptedCommission}
          onChange={onAcceptedCommission}
          text="Acepto las reglas de liquidación y comisiones."
        />
      </div>

      <style jsx>{`
        .agreement {
          width: 100%;
          display: grid;
          gap: 16px;
          min-width: 0;
        }

        .agreement-header {
          min-width: 0;
        }

        .version {
          display: inline-flex;
          align-items: center;
          min-height: 24px;
          box-sizing: border-box;
          padding: 0 9px;
          border: 1px solid rgba(249, 115, 22, 0.15);
          border-radius: 999px;
          background: rgba(249, 115, 22, 0.06);
          color: #f97316;
          font-size: 8px;
          line-height: 1;
          font-weight: 850;
          letter-spacing: 0.1px;
        }

        .agreement-header h2 {
          margin: 10px 0 0;
          color: #fff;
          font-size: clamp(25px, 4vw, 34px);
          line-height: 1.04;
          font-weight: 900;
          letter-spacing: -0.045em;
        }

        .agreement-header p {
          max-width: 720px;
          margin: 8px 0 0;
          color: #8b8b8b;
          font-size: 10px;
          line-height: 1.55;
        }

        .terms-card {
          display: grid;
          gap: 0;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 16px;
          background: #111;
        }

        .checks-card {
          display: grid;
          gap: 0;
          padding: 13px;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 14px;
          background: #151515;
        }

        .checks-heading {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 12px;
          padding: 1px 2px 10px;
        }

        .checks-heading span {
          color: #fff;
          font-size: 9px;
          font-weight: 850;
        }

        .checks-heading small {
          color: #686868;
          font-size: 7px;
          line-height: 1.35;
          text-align: right;
        }

        @media (max-width: 820px) {
          .agreement {
            gap: 10px;
          }

          .agreement-header h2 {
            font-size: 27px;
          }

          .agreement-header p {
            max-width: none;
            font-size: 8px;
          }

          .terms-card {
            border-radius: 13px;
          }

          .checks-card {
            padding: 10px;
            border-radius: 12px;
          }

          .checks-heading {
            display: block;
            padding-bottom: 8px;
          }

          .checks-heading span,
          .checks-heading small {
            display: block;
            text-align: left;
          }

          .checks-heading small {
            margin-top: 3px;
            font-size: 6.5px;
          }
        }

        @media (max-width: 420px) {
          .agreement-header h2 {
            font-size: 24px;
          }

          .version {
            min-height: 21px;
            padding-inline: 8px;
            font-size: 7px;
          }

          .agreement-header p {
            font-size: 7.5px;
            line-height: 1.45;
          }

          .checks-card {
            padding: 8px;
          }
        }
      `}</style>
    </section>
  );
}

function AgreementBlock({
  number,
  title,
  text,
}: {
  number: string;
  title: string;
  text: string;
}) {
  return (
    <details className="block" open>
      <summary>
        <span className="number">{number}</span>

        <span className="block-title">{title}</span>

        <span className="chevron" aria-hidden="true">
          +
        </span>
      </summary>

      <div className="block-body">
        <p>{text}</p>
      </div>

      <style jsx>{`
        .block {
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
        }

        .block:last-child {
          border-bottom: 0;
        }

        .block summary {
          min-height: 48px;
          box-sizing: border-box;
          display: grid;
          grid-template-columns: 27px minmax(0, 1fr) 22px;
          align-items: center;
          gap: 8px;
          padding: 7px 10px;
          cursor: pointer;
          list-style: none;
          user-select: none;
        }

        .block summary::-webkit-details-marker {
          display: none;
        }

        .number {
          width: 27px;
          height: 27px;
          display: grid;
          place-items: center;
          border-radius: 8px;
          background: rgba(249, 115, 22, 0.07);
          color: #f97316;
          font-size: 6.5px;
          font-weight: 900;
        }

        .block-title {
          min-width: 0;
          overflow: hidden;
          color: rgba(255, 255, 255, 0.82);
          font-size: 8px;
          font-weight: 850;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .chevron {
          width: 22px;
          height: 22px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: rgba(255, 255, 255, 0.04);
          color: rgba(255, 255, 255, 0.38);
          font-size: 12px;
          transition: transform 0.18s ease, color 0.18s ease;
        }

        .block[open] .chevron {
          transform: rotate(45deg);
          color: #f97316;
        }

        .block-body {
          padding: 0 10px 12px 45px;
        }

        .block-body p {
          max-width: 760px;
          margin: 0;
          color: #8a8a8a;
          font-size: 8px;
          line-height: 1.65;
        }

        @media (max-width: 820px) {
          .block summary {
            min-height: 45px;
            grid-template-columns: 25px minmax(0, 1fr) 21px;
            padding-inline: 8px;
          }

          .number {
            width: 25px;
            height: 25px;
            border-radius: 7px;
            font-size: 6px;
          }

          .block-title {
            font-size: 7px;
          }

          .block-body {
            padding: 0 8px 10px 41px;
          }

          .block-body p {
            font-size: 7px;
            line-height: 1.55;
          }
        }

        @media (max-width: 420px) {
          .block summary {
            min-height: 42px;
            grid-template-columns: 23px minmax(0, 1fr) 20px;
            gap: 7px;
          }

          .number {
            width: 23px;
            height: 23px;
          }

          .block-title {
            font-size: 6.5px;
          }

          .block-body {
            padding-left: 38px;
          }

          .block-body p {
            font-size: 6.5px;
          }
        }
      `}</style>
    </details>
  );
}

function AgreementCheck({
  checked,
  onChange,
  text,
}: {
  checked: boolean;
  onChange: (value: boolean) => void;
  text: string;
}) {
  return (
    <label className={`check ${checked ? "checked" : ""}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />

      <span className="box" aria-hidden="true">
        {checked ? "✓" : ""}
      </span>

      <span className="check-text">{text}</span>

      <style jsx>{`
        .check {
          min-width: 0;
          display: grid;
          grid-template-columns: 18px minmax(0, 1fr);
          align-items: start;
          gap: 8px;
          padding: 9px 3px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.045);
          color: rgba(255, 255, 255, 0.7);
          cursor: pointer;
          -webkit-tap-highlight-color: transparent;
        }

        .check:last-child {
          border-bottom: 0;
        }

        .check input {
          position: absolute;
          opacity: 0;
          pointer-events: none;
        }

        .box {
          width: 18px;
          height: 18px;
          box-sizing: border-box;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.16);
          border-radius: 5px;
          background: #101010;
          color: #fff;
          font-size: 10px;
          line-height: 1;
          transition:
            background 0.15s ease,
            border-color 0.15s ease,
            box-shadow 0.15s ease;
        }

        .checked .box {
          border-color: #f97316;
          background: #f97316;
          box-shadow: 0 0 12px rgba(249, 115, 22, 0.14);
        }

        .check-text {
          min-width: 0;
          padding-top: 2px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 8px;
          line-height: 1.4;
          font-weight: 650;
        }

        .checked .check-text {
          color: #fff;
        }

        @media (max-width: 820px) {
          .check {
            grid-template-columns: 17px minmax(0, 1fr);
            gap: 8px;
            padding: 8px 2px;
          }

          .box {
            width: 17px;
            height: 17px;
            border-radius: 5px;
          }

          .check-text {
            font-size: 7px;
          }
        }

        @media (max-width: 420px) {
          .check {
            grid-template-columns: 16px minmax(0, 1fr);
            gap: 7px;
            padding-block: 7px;
          }

          .box {
            width: 16px;
            height: 16px;
            font-size: 9px;
          }

          .check-text {
            padding-top: 1px;
            font-size: 6.5px;
          }
        }
      `}</style>
    </label>
  );
}