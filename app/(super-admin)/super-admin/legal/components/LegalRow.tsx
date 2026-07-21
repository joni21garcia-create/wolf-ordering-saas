import Link from "next/link";

type Props = {
  item: any;
};

export default function LegalRow({
  item,
}: Props) {

const baseUrl =
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

const agreementUrl =
  `${baseUrl}/legal/accept/${item.token}`;

const phone =
  (item.owner_phone ?? "")
    .replace(/\D/g, "");

const message = `Hola ${item.owner_name} 👋

Bienvenido a Wolf Ordering.

Para activar tu restaurante debes aceptar el Acuerdo Comercial.

${agreementUrl}

Gracias.`;

const whatsappUrl =
  `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;


  return (
    <tr
      style={{
        borderBottom: "1px solid #2a2a2a",
      }}
    >
      <td
        style={{
          padding: 16,
          borderBottom: "1px solid #262626",
        }}
      >
        {item.restaurants?.name}
      </td>

      <td
        style={{
          padding: 16,
          borderBottom: "1px solid #262626",
        }}
      >
        {item.owner_name}
      </td>

      <td
        style={{
          padding: 16,
          borderBottom: "1px solid #262626",
        }}
      >
        {item.owner_email}
      </td>

      <td
        style={{
          padding: 16,
          borderBottom: "1px solid #262626",
        }}
      >
        <span
          style={{
            display: "inline-block",
            padding: "6px 12px",
            borderRadius: 999,
            fontWeight: 600,
            fontSize: 13,
            background:
              item.status === "accepted"
                ? "#16351f"
                : "#3b2b09",
            color:
              item.status === "accepted"
                ? "#4ade80"
                : "#fbbf24",
            border:
              item.status === "accepted"
                ? "1px solid #22c55e"
                : "1px solid #f59e0b",
          }}
        >
          {item.status === "accepted"
            ? "Firmado"
            : "Pendiente"}
        </span>
      </td>

      <td
        style={{
          padding: 16,
          borderBottom: "1px solid #262626",
        }}
      >
        {item.legal_documents?.version}
      </td>

      <td
        style={{
          padding: 16,
          borderBottom: "1px solid #262626",
        }}
      >
        {item.accepted_at
          ? new Date(item.accepted_at).toLocaleString()
          : "-"}
      </td>

      <td
        style={{
          padding: 16,
          borderBottom: "1px solid #262626",
        }}
      >
        {item.pdf_url ? (
          <a
            href={item.pdf_url}
            target="_blank"
            style={{
              display: "inline-block",
              padding: "8px 14px",
              borderRadius: 10,
              background: "#dc2626",
              color: "#fff",
              textDecoration: "none",
              fontWeight: 600,
            }}
          >
            📄 PDF
          </a>
        ) : (
          <span
            style={{
              color: "#777",
            }}
          >
            —
          </span>
        )}
      </td>

      <td
        style={{
          padding: 16,
          borderBottom: "1px solid #262626",
        }}
      >
        <Link
          href={`/legal/view/${item.token}`}
          target="_blank"
          style={{
            display: "inline-block",
            padding: "8px 14px",
            borderRadius: 10,
            background: "#2563eb",
            color: "#fff",
            textDecoration: "none",
            fontWeight: 600,
          }}
        >
          👁 Ver
        </Link>
      </td>
<td
  style={{
    padding: 16,
    borderBottom: "1px solid #262626",
  }}
>
  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "8px 14px",
      minWidth: 130,
      borderRadius: 10,
      background: "#16a34a",
      color: "#fff",
      textDecoration: "none",
      fontWeight: 600,
      whiteSpace: "nowrap",
    }}
  >
    📲 WhatsApp
  </a>
</td>
    </tr>
  );
}


