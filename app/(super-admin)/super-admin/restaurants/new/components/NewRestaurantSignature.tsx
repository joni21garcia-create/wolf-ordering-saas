"use client";

interface Props {
  signerName: string;

  signerEmail: string;

  signed: boolean;

  onSignerChange: (
    value: string
  ) => void;

  onSignedChange: (
    value: boolean
  ) => void;
}

export default function NewRestaurantSignature({
  signerName,
  signerEmail,
  signed,
  onSignerChange,
  onSignedChange,
}: Props) {
  const today =
    new Date().toLocaleDateString();

  return (
    <section
      style={{
        display: "grid",
        gap: 30,
      }}
    >
      <div>
        <h2
          style={{
            color: "#fff",
            fontSize: 34,
            fontWeight: 900,
            marginBottom: 10,
          }}
        >
          Firma del Agreement
        </h2>

        <p
          style={{
            color: "#9ca3af",
            lineHeight: 1.8,
          }}
        >
          El representante legal confirma que la
          información suministrada es correcta y
          acepta el Agreement Comercial de Wolf
          Ordering.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gap: 22,
          padding: 30,
          borderRadius: 24,
          background: "#111",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <div>
          <label style={label}>
            Representante Legal
          </label>

          <input
            style={input}
            value={signerName}
            onChange={(e) =>
              onSignerChange(
                e.target.value
              )
            }
            placeholder="Nombre completo"
          />
        </div>

        <div>
          <label style={label}>
            Correo electrónico
          </label>

          <input
            style={input}
            value={signerEmail}
            readOnly
          />
        </div>

        <div>
          <label style={label}>
            Fecha
          </label>

          <input
            style={input}
            value={today}
            readOnly
          />
        </div>

        <div
          style={{
            border:
              "2px dashed rgba(249,115,22,.35)",
            borderRadius: 18,
            padding: 40,
            textAlign: "center",
            color: "#9ca3af",
          }}
        >
          Área reservada para la firma
          electrónica y firma manuscrita digital.
        </div>

        <label
          style={{
            display: "flex",
            gap: 12,
            alignItems: "flex-start",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <input
            type="checkbox"
            checked={signed}
            onChange={(e) =>
              onSignedChange(
                e.target.checked
              )
            }
          />

          <span>
            Confirmo que soy el representante
            autorizado y firmo este Agreement de
            manera electrónica.
          </span>
        </label>
      </div>
    </section>
  );
}

const label = {
  display: "block",
  color: "#fff",
  fontWeight: 700,
  marginBottom: 10,
};

const input = {
  width: "100%",
  padding: "15px 18px",
  borderRadius: 14,
  background: "#0f0f0f",
  border:
    "1px solid rgba(255,255,255,.08)",
  color: "#fff",
  outline: "none",
} as const;


