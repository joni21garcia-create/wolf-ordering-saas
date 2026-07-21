"use client";

interface Props {
  version: string;

  acceptedTerms: boolean;

  acceptedPrivacy: boolean;

  acceptedCommission: boolean;

  onAcceptedTerms: (
    value: boolean
  ) => void;

  onAcceptedPrivacy: (
    value: boolean
  ) => void;

  onAcceptedCommission: (
    value: boolean
  ) => void;
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
    <section
      style={{
        display: "grid",
        gap: 28,
      }}
    >
      <div>
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 10,
            padding: "8px 16px",
            borderRadius: 999,
            background:
              "rgba(249,115,22,.12)",
            color: "#f97316",
            fontWeight: 700,
          }}
        >
          Agreement v{version}
        </div>

        <h2
          style={{
            marginTop: 22,
            marginBottom: 10,
            color: "#fff",
            fontSize: 34,
            fontWeight: 900,
          }}
        >
          Acuerdo Comercial
        </h2>

        <p
          style={{
            color: "#9ca3af",
            lineHeight: 1.8,
            maxWidth: 820,
          }}
        >
          Antes de crear el restaurante debes
          aceptar el acuerdo comercial de Wolf
          Ordering SaaS.
        </p>
      </div>

      <div
        style={{
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: 24,
          background: "#111",
          padding: 30,
          display: "grid",
          gap: 24,
        }}
      >
        <AgreementBlock
          title="Servicios incluidos"
          text="Wolf Ordering proporcionará la plataforma SaaS, panel administrativo, analytics, pedidos, PWA, actualizaciones y soporte según el plan contratado."
        />

        <AgreementBlock
          title="Comisiones"
          text="Las comisiones serán calculadas automáticamente según la configuración financiera del restaurante y las reglas comerciales vigentes."
        />

        <AgreementBlock
          title="Protección de datos"
          text="Toda la información del restaurante y de sus clientes será tratada conforme a la política de privacidad de la plataforma."
        />

        <AgreementBlock
          title="Responsabilidades"
          text="El restaurante es responsable del contenido publicado, precios, horarios, disponibilidad y cumplimiento de la normativa aplicable."
        />
      </div>

      <div
        style={{
          display: "grid",
          gap: 18,
          padding: 26,
          borderRadius: 20,
          background: "#151515",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
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
    </section>
  );
}

function AgreementBlock({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  return (
    <div>
      <h3
        style={{
          color: "#fff",
          marginBottom: 8,
        }}
      >
        {title}
      </h3>

      <p
        style={{
          color: "#9ca3af",
          lineHeight: 1.8,
          margin: 0,
        }}
      >
        {text}
      </p>
    </div>
  );
}

function AgreementCheck({
  checked,
  onChange,
  text,
}: {
  checked: boolean;
  onChange: (
    value: boolean
  ) => void;
  text: string;
}) {
  return (
    <label
      style={{
        display: "flex",
        gap: 14,
        alignItems: "flex-start",
        color: "#fff",
        cursor: "pointer",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) =>
          onChange(
            e.target.checked
          )
        }
      />

      <span>{text}</span>
    </label>
  );
}


