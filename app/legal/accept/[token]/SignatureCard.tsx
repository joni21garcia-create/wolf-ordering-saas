type Props = {
  acceptance: {
    status: string;
    signature_name?: string | null;
    accepted_at?: string | null;
  };
};

export default function SignatureCard({
  acceptance,
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
          marginBottom: 22,
          fontSize: 28,
          fontWeight: 800,
        }}
      >
        Firma electrónica
      </h2>

      <div
        style={{
          height: 170,
          border: "2px dashed #444",
          borderRadius: 14,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#777",
          fontSize: 15,
        }}
      >
        Área de firma
      </div>

      <div
        style={{
          marginTop: 24,
          display: "grid",
          gap: 14,
        }}
      >
        <Info
          label="Firmante"
          value={acceptance.signature_name ?? "-"}
        />

        <Info
          label="Estado"
          value={acceptance.status}
        />

        <Info
          label="Fecha"
          value={
            acceptance.accepted_at
              ? new Date(
                  acceptance.accepted_at
                ).toLocaleString()
              : "-"
          }
        />
      </div>
    </section>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        style={{
          color: "#888",
          fontSize: 12,
          marginBottom: 5,
        }}
      >
        {label}
      </div>

      <div
        style={{
          fontWeight: 600,
        }}
      >
        {value}
      </div>
    </div>
  );
}