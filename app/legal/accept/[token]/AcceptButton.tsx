"use client";

type Props = {
  disabled?: boolean;
  loading?: boolean;
  onAccept: () => void;
};

export default function AcceptButton({
  disabled,
  loading,
  onAccept,
}: Props) {
  return (
    <section
      style={{
        background: "#171717",
        borderRadius: 20,
        padding: 28,
        border: "1px solid #2a2a2a",
      }}
    >
      <h2
        style={{
          margin: 0,
          marginBottom: 18,
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        Confirmación
      </h2>

      <p
        style={{
          color: "#9d9d9d",
          lineHeight: 1.8,
          marginBottom: 28,
        }}
      >
        Al continuar confirma que ha leído el acuerdo,
        comprende sus obligaciones y acepta el contrato
        comercial de Wolf Ordering.
      </p>

      <button
        type="button"
        onClick={onAccept}
        disabled={disabled || loading}
        style={{
          width: "100%",
          padding: "18px",
          border: "none",
          borderRadius: 14,
          cursor:
            disabled || loading
              ? "not-allowed"
              : "pointer",
          background:
            disabled || loading
              ? "#333"
              : "#f97316",
          color: "#fff",
          fontWeight: 800,
          fontSize: 17,
        }}
      >
        {loading
          ? "Aceptando..."
          : "Aceptar Acuerdo"}
      </button>

      <div
        style={{
          marginTop: 18,
          color: "#777",
          textAlign: "center",
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        Esta acción generará evidencia legal
        permanente.
      </div>
    </section>
  );
}