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
  return (
    <section
      style={{
        display: "grid",
        gap: 24,
      }}
    >
      <h2
        style={{
          color: "#fff",
          fontSize: 34,
          fontWeight: 900,
          margin: 0,
        }}
      >
        Resumen Final
      </h2>

      <p
        style={{
          color: "#8b8b8b",
          lineHeight: 1.8,
        }}
      >
        Revisa la información antes de crear el
        restaurante.
      </p>

      <div
        style={{
          display: "grid",
          gap: 16,
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 20,
          padding: 24,
          background: "#111",
        }}
      >
        <Row
          label="Restaurante"
          value={restaurantName || "-"}
        />

        <Row
          label="Slug"
          value={slug || "-"}
        />

        <Row
          label="Propietario"
          value={owner || "-"}
        />

        <Row
          label="Correo"
          value={email || "-"}
        />

        <Row
          label="Plan"
          value={plan || "-"}
        />

        <Row
          label="Agreement"
          value={
            agreementAccepted
              ? "Aceptado"
              : "Pendiente"
          }
        />
      </div>
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
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        borderBottom:
          "1px solid rgba(255,255,255,.05)",
        paddingBottom: 12,
      }}
    >
      <span
        style={{
          color: "#9ca3af",
        }}
      >
        {label}
      </span>

      <strong
        style={{
          color: "#fff",
        }}
      >
        {value}
      </strong>
    </div>
  );
}