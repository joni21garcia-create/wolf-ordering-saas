import LegalRow from "./LegalRow";

type LegalAgreement = {
  id: string;
  owner_name: string | null;
  owner_email: string | null;
  owner_phone?: string | null;
  status: string | null;
  accepted_at?: string | null;
  pdf_url?: string | null;
  token: string | null;
  restaurants?: {
    name: string | null;
  } | null;
  legal_documents?: {
    title: string | null;
    version: string | null;
  } | null;
};

type Props = {
  agreements: LegalAgreement[];
};

function formatDate(value?: string | null) {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "—";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

function getStatus(status: string | null) {
  if (status === "accepted") {
    return {
      label: "Firmado",
      className: "status accepted",
    };
  }

  return {
    label: "Pendiente",
    className: "status pending",
  };
}

export default function LegalTable({ agreements }: Props) {
  if (!agreements.length) {
    return (
      <section className="empty-state">
        <div className="empty-icon">∅</div>
        <strong>No hay acuerdos para mostrar</strong>
        <span>Prueba cambiando la búsqueda o el filtro.</span>

        <style jsx>{`
          .empty-state {
            min-height: 150px;
            display: grid;
            place-items: center;
            align-content: center;
            gap: 4px;
            padding: 22px;
            border: 1px solid rgba(255, 255, 255, 0.055);
            border-radius: 12px;
            background: #101010;
            text-align: center;
          }

          .empty-icon {
            margin-bottom: 3px;
            color: rgba(255, 255, 255, 0.18);
            font-size: 22px;
            line-height: 1;
          }

          strong {
            color: rgba(255, 255, 255, 0.72);
            font-size: 9px;
          }

          span {
            color: rgba(255, 255, 255, 0.25);
            font-size: 7px;
          }
        `}</style>
      </section>
    );
  }

  return (
    <section className="legal-list" aria-label="Acuerdos legales">
      <div className="desktop-table">
        <table>
          <thead>
            <tr>
              <th>Restaurante</th>
              <th>Propietario</th>
              <th>Email</th>
              <th>Estado</th>
              <th>Versión</th>
              <th>Aceptado</th>
              <th>PDF</th>
              <th>Ver</th>
              <th>WhatsApp</th>
            </tr>
          </thead>

          <tbody>
            {agreements.map((item) => (
              <LegalRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="mobile-list">
        {agreements.map((item) => {
          const status = getStatus(item.status);

          return (
            <details key={item.id} className="mobile-card">
              <summary>
                <div className="summary-main">
                  <div className="restaurant-mark">
                    {item.restaurants?.name?.trim()?.charAt(0) || "R"}
                  </div>

                  <div className="summary-copy">
                    <strong>
                      {item.restaurants?.name || "Restaurante"}
                    </strong>

                    <span>
                      {item.owner_name || "Propietario sin nombre"}
                    </span>
                  </div>
                </div>

                <div className="summary-right">
                  <span className={status.className}>
                    <i />
                    {status.label}
                  </span>
                  <span className="chevron">+</span>
                </div>
              </summary>

              <div className="mobile-details">
                <div className="detail-row">
                  <span>Propietario</span>
                  <strong>{item.owner_name || "—"}</strong>
                </div>

                <div className="detail-row">
                  <span>Email</span>
                  <strong className="breakable">
                    {item.owner_email || "—"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Documento</span>
                  <strong>
                    {item.legal_documents?.title || "Acuerdo comercial"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Versión</span>
                  <strong>
                    {item.legal_documents?.version || "—"}
                  </strong>
                </div>

                <div className="detail-row">
                  <span>Aceptado</span>
                  <strong>{formatDate(item.accepted_at)}</strong>
                </div>

                <div className="mobile-actions">
                  {item.pdf_url ? (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="action-button"
                    >
                      PDF
                    </a>
                  ) : (
                    <span className="action-button disabled">
                      Sin PDF
                    </span>
                  )}

                  {item.token ? (
                    <a
                      href={`/legal/accept/${item.token}`}
                      target="_blank"
                      rel="noreferrer"
                      className="action-button primary"
                    >
                      Ver acuerdo
                    </a>
                  ) : (
                    <span className="action-button disabled">
                      Sin enlace
                    </span>
                  )}

                  {item.owner_phone ? (
                    <a
                      href={`https://wa.me/${String(item.owner_phone).replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noreferrer"
                      className="action-button"
                    >
                      WhatsApp
                    </a>
                  ) : null}
                </div>
              </div>
            </details>
          );
        })}
      </div>

      <style jsx>{`
        .legal-list {
          width: 100%;
        }

        .desktop-table {
          width: 100%;
          overflow: auto;
          border: 1px solid rgba(255, 255, 255, 0.055);
          border-radius: 12px;
          background: #101010;
        }

        table {
          width: 100%;
          min-width: 920px;
          border-collapse: separate;
          border-spacing: 0;
        }

        th {
          height: 36px;
          box-sizing: border-box;
          padding: 0 10px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.055);
          background: #131313;
          color: rgba(255, 255, 255, 0.32);
          text-align: left;
          white-space: nowrap;
          font-size: 6.5px;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.45px;
        }

        .mobile-list {
          display: none;
        }

        @media (max-width: 760px) {
          .desktop-table {
            display: none;
          }

          .mobile-list {
            display: flex;
            flex-direction: column;
            gap: 5px;
          }

          .mobile-card {
            overflow: hidden;
            border: 1px solid rgba(255, 255, 255, 0.055);
            border-radius: 10px;
            background: #101010;
          }

          .mobile-card[open] {
            border-color: rgba(249, 115, 22, 0.18);
          }

          .mobile-card summary {
            min-height: 54px;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 8px;
            padding: 8px;
            list-style: none;
            cursor: pointer;
          }

          .mobile-card summary::-webkit-details-marker {
            display: none;
          }

          .summary-main {
            min-width: 0;
            flex: 1;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .restaurant-mark {
            width: 31px;
            height: 31px;
            display: grid;
            place-items: center;
            flex: 0 0 31px;
            border-radius: 9px;
            background: rgba(249, 115, 22, 0.08);
            color: #f97316;
            font-size: 9px;
            font-weight: 900;
            text-transform: uppercase;
          }

          .summary-copy {
            min-width: 0;
          }

          .summary-copy strong,
          .summary-copy span {
            display: block;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .summary-copy strong {
            color: rgba(255, 255, 255, 0.82);
            font-size: 8px;
            font-weight: 850;
          }

          .summary-copy span {
            margin-top: 3px;
            color: rgba(255, 255, 255, 0.28);
            font-size: 6.5px;
          }

          .summary-right {
            display: flex;
            align-items: center;
            gap: 6px;
            flex: 0 0 auto;
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
            white-space: nowrap;
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

          .chevron {
            width: 22px;
            height: 22px;
            display: grid;
            place-items: center;
            border-radius: 7px;
            background: rgba(255, 255, 255, 0.035);
            color: rgba(255, 255, 255, 0.35);
            font-size: 11px;
            line-height: 1;
          }

          .mobile-card[open] .chevron {
            transform: rotate(45deg);
            color: #f97316;
          }

          .mobile-details {
            padding: 0 8px 8px;
            border-top: 1px solid rgba(255, 255, 255, 0.045);
          }

          .detail-row {
            display: flex;
            align-items: baseline;
            justify-content: space-between;
            gap: 12px;
            padding: 7px 2px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.035);
          }

          .detail-row span {
            flex: 0 0 auto;
            color: rgba(255, 255, 255, 0.25);
            font-size: 6px;
          }

          .detail-row strong {
            min-width: 0;
            color: rgba(255, 255, 255, 0.65);
            text-align: right;
            font-size: 6.5px;
            font-weight: 750;
          }

          .breakable {
            overflow-wrap: anywhere;
          }

          .mobile-actions {
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            gap: 5px;
            padding-top: 8px;
          }

          .action-button {
            min-height: 31px;
            box-sizing: border-box;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            padding: 0 6px;
            border: 1px solid rgba(255, 255, 255, 0.065);
            border-radius: 7px;
            background: #151515;
            color: rgba(255, 255, 255, 0.55);
            text-decoration: none;
            font-size: 6px;
            font-weight: 800;
            white-space: nowrap;
          }

          .action-button.primary {
            border-color: rgba(249, 115, 22, 0.18);
            background: rgba(249, 115, 22, 0.08);
            color: #f97316;
          }

          .action-button.disabled {
            opacity: 0.35;
          }
        }

        @media (max-width: 360px) {
          .mobile-actions {
            grid-template-columns: 1fr 1fr;
          }

          .mobile-actions .action-button:last-child {
            grid-column: 1 / -1;
          }

          .status {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}