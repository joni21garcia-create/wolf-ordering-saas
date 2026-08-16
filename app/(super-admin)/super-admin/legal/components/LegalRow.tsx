import Link from "next/link";

type LegalAgreement = {
  id: string;
  token: string | null;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone?: string | null;
  status: string | null;
  accepted_at?: string | null;
  pdf_url?: string | null;
  restaurants?: {
    name: string | null;
  } | null;
  legal_documents?: {
    version: string | null;
  } | null;
};

type Props = {
  item: LegalAgreement;
};

function formatDate(date?: string | null) {
  if (!date) return "—";

  const d = new Date(date);

  if (Number.isNaN(d.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(d);
}

export default function LegalRow({ item }: Props) {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  const agreementUrl = item.token
    ? `${baseUrl}/legal/accept/${item.token}`
    : "";

  const phone = (item.owner_phone ?? "").replace(/\D/g, "");

  const message = `Hola ${item.owner_name ?? ""}

Bienvenido a Wolf Ordering.

Para activar tu restaurante debes aceptar el Acuerdo Comercial.

${agreementUrl}

Gracias.`;

  const whatsappUrl = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
    : null;

  const accepted = item.status === "accepted";

  return (
    <tr className="legal-row">
      <td className="restaurant-cell">
        <div className="restaurant-name">
          <span className="restaurant-dot" />
          {item.restaurants?.name || "—"}
        </div>
      </td>

      <td>{item.owner_name || "—"}</td>

      <td className="email-cell">
        {item.owner_email || "—"}
      </td>

      <td>
        <span className={`status ${accepted ? "accepted" : "pending"}`}>
          <i />
          {accepted ? "Firmado" : "Pendiente"}
        </span>
      </td>

      <td>{item.legal_documents?.version || "—"}</td>

      <td>{formatDate(item.accepted_at)}</td>

      <td>
        {item.pdf_url ? (
          <a
            href={item.pdf_url}
            target="_blank"
            rel="noopener noreferrer"
            className="action"
          >
            PDF
          </a>
        ) : (
          <span className="muted">—</span>
        )}
      </td>

      <td>
        {item.token ? (
          <Link
            href={`/legal/view/${item.token}`}
            target="_blank"
            className="action primary"
          >
            Ver
          </Link>
        ) : (
          <span className="muted">—</span>
        )}
      </td>

      <td>
        {whatsappUrl ? (
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="action whatsapp"
          >
            WhatsApp
          </a>
        ) : (
          <span className="muted">—</span>
        )}
      </td>

      <style jsx>{`
        .legal-row {
          height: 46px;
        }

        .legal-row > td {
          padding: 0 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.035);
          color: rgba(255, 255, 255, 0.58);
          font-size: 7px;
          font-weight: 550;
          white-space: nowrap;
          vertical-align: middle;
        }

        .legal-row:hover > td {
          background: rgba(255, 255, 255, 0.018);
        }

        .restaurant-cell {
          min-width: 130px;
        }

        .restaurant-name {
          display: flex;
          align-items: center;
          gap: 6px;
          max-width: 180px;
          overflow: hidden;
          color: rgba(255, 255, 255, 0.78);
          font-size: 7px;
          font-weight: 800;
          text-overflow: ellipsis;
        }

        .restaurant-dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: #f97316;
          box-shadow: 0 0 0 3px rgba(249, 115, 22, 0.06);
        }

        .email-cell {
          max-width: 190px;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .status {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          padding: 4px 6px;
          border-radius: 999px;
          font-size: 5.5px;
          font-weight: 850;
          text-transform: uppercase;
        }

        .status i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: currentColor;
        }

        .status.accepted {
          color: #22c55e;
          background: rgba(34, 197, 94, 0.07);
        }

        .status.pending {
          color: #f59e0b;
          background: rgba(245, 158, 11, 0.07);
        }

        .action {
          min-width: 35px;
          min-height: 26px;
          box-sizing: border-box;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 0 7px;
          border: 1px solid rgba(255, 255, 255, 0.065);
          border-radius: 6px;
          background: #151515;
          color: rgba(255, 255, 255, 0.52);
          text-decoration: none;
          font-size: 5.5px;
          font-weight: 800;
          transition: border-color 0.15s ease, color 0.15s ease,
            background 0.15s ease;
        }

        .action:hover {
          border-color: rgba(255, 255, 255, 0.13);
          color: #fff;
          background: #191919;
        }

        .action.primary {
          border-color: rgba(249, 115, 22, 0.16);
          background: rgba(249, 115, 22, 0.07);
          color: #f97316;
        }

        .action.whatsapp {
          color: #22c55e;
        }

        .muted {
          color: rgba(255, 255, 255, 0.14);
        }
      `}</style>
    </tr>
  );
}