"use client";

interface Props {
  children: React.ReactNode;
}

export default function FinanceLiquidationActions({
  children,
}: Props) {
  return (
    <section
      style={{
        marginTop: 42,
        marginBottom: 42,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 18,
          marginBottom: 22,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            ⚙ Acciones Financieras
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#8b8b8b",
              maxWidth: 650,
            }}
          >
            Gestiona la liquidación actual, genera documentos oficiales
            y ejecuta acciones administrativas sobre el período
            seleccionado.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(249,115,22,.12)",
            border: "1px solid rgba(249,115,22,.25)",
            color: "#f97316",
            fontWeight: 800,
          }}
        >
          Finance Actions
        </div>
      </div>

      <div
        style={{
          background:
            "linear-gradient(180deg,#171717,#101010)",
          border:
            "1px solid rgba(255,255,255,.07)",
          borderRadius: 26,
          padding: 28,
        }}
      >
        <div
          style={{
            display: "flex",
            gap: 18,
            flexWrap: "wrap",
            alignItems: "center",
          }}
        >
          {children}
        </div>

        <div
          style={{
            marginTop: 28,
            paddingTop: 22,
            borderTop:
              "1px solid rgba(255,255,255,.06)",
            color: "#7a7a7a",
            fontSize: 14,
            lineHeight: 1.6,
          }}
        >
          Las acciones disponibles dependen del estado de la
          liquidación. Una vez que una liquidación ha sido pagada,
          algunas operaciones dejarán de estar disponibles para
          preservar la integridad financiera.
        </div>
      </div>
    </section>
  );
}