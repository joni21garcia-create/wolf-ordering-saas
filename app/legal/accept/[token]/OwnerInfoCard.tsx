type Props = {
  acceptance: {
    owner_name: string | null;
    owner_email: string | null;
    owner_phone: string | null;
    status: string;
    token: string;
  };
};

export default function OwnerInfoCard({
  acceptance,
}: Props) {
  const statusColor =
    acceptance.status === "accepted"
      ? "#22c55e"
      : "#f59e0b";

  return (
    <section
      style={{
        background: "#171717",
        borderRadius: 20,
        padding: 28,
        border: "1px solid #2a2a2a",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <h2
          style={{
            margin: 0,
            fontSize: 28,
            fontWeight: 800,
          }}
        >
          Propietario
        </h2>

        <span
          style={{
            background: statusColor,
            color: "#fff",
            padding: "6px 14px",
            borderRadius: 999,
            fontSize: 12,
            fontWeight: 700,
          }}
        >
          {acceptance.status.toUpperCase()}
        </span>
      </div>

      <Row
        title="Nombre"
        value={acceptance.owner_name}
      />

      <Row
        title="Correo"
        value={acceptance.owner_email}
      />

      <Row
        title="WhatsApp"
        value={acceptance.owner_phone}
      />

      <Row
        title="Token"
        value={acceptance.token}
      />
    </section>
  );
}

function Row({
  title,
  value,
}: {
  title: string;
  value: string | null;
}) {
  return (
    <div
      style={{
        borderTop: "1px solid #2a2a2a",
        padding: "16px 0",
      }}
    >
      <div
        style={{
          color: "#888",
          fontSize: 12,
          marginBottom: 6,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontWeight: 600,
          wordBreak: "break-word",
        }}
      >
        {value ?? "-"}
      </div>
    </div>
  );
}