interface Props {
  order: any;
}

export default function ProofCard({ order }: Props) {
  const proof =
    order.payment_proof_url ||
    order.proof_url ||
    null;

  if (!proof) return null;

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 24,
        padding: 28,
        backdropFilter: "blur(14px)",
      }}
    >
      <div style={{ marginBottom: 24 }}>
        <div
          style={{
            color: "#f97316",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Comprobante
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Comprobante de Pago
        </h2>
      </div>

      <a
        href={proof}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: "block",
          textDecoration: "none",
        }}
      >
        <img
          src={proof}
          alt="Comprobante"
          style={{
            width: "100%",
            maxHeight: 520,
            objectFit: "contain",
            borderRadius: 18,
            border: "1px solid rgba(255,255,255,.08)",
            cursor: "zoom-in",
            background: "#111",
          }}
        />
      </a>

      <div
        style={{
          display: "flex",
          gap: 15,
          marginTop: 22,
          flexWrap: "wrap",
        }}
      >
        <a
          href={proof}
          target="_blank"
          rel="noopener noreferrer"
          style={buttonStyle}
        >
          🔍 Ver tamaño completo
        </a>

        <a
          href={proof}
          download
          style={{
            ...buttonStyle,
            background: "#f97316",
            color: "#fff",
          }}
        >
          ⬇ Descargar
        </a>
      </div>
    </section>
  );
}

const buttonStyle: React.CSSProperties = {
  padding: "14px 22px",
  borderRadius: 14,
  background: "rgba(255,255,255,.05)",
  border: "1px solid rgba(255,255,255,.08)",
  color: "#fff",
  textDecoration: "none",
  fontWeight: 700,
  transition: ".2s",
};