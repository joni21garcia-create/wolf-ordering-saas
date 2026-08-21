"use client";

interface Invoice {
  invoice_number?: string;
  invoice_pdf_url?: string;
  status?: string;
  created_at?: string;
}

interface Liquidation {
  month?: number;
  year?: number;
}

interface Props {
  invoice: Invoice | null;
  liquidation: Liquidation | null;
}

export default function FinanceInvoiceCard({
  invoice,
  liquidation,
}: Props) {
  const available = !!invoice;

  return (
    <section className="invoice-section">
      <style jsx>{`
        .invoice-section {
          width: 100%;
          min-width: 0;
          margin: 0 0 24px;
        }

        .panel {
          width: 100%;
          overflow: hidden;
          box-sizing: border-box;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          background: linear-gradient(180deg,#151515,#0d0d0d);
        }

        .panel > summary {
          list-style: none;
          cursor: pointer;
          user-select: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 64px;
          padding: 0 16px;
        }

        .panel > summary::-webkit-details-marker {
          display: none;
        }

        .heading {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon {
          width: 32px;
          height: 32px;
          flex: 0 0 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.06);
        }

        .title {
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }

        .subtitle {
          margin-top: 2px;
          color: #777;
          font-size: 10px;
        }

        .right {
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .badge {
          padding: 6px 9px;
          border-radius: 999px;
          background: ${available
            ? "rgba(34,197,94,.10)"
            : "rgba(245,158,11,.10)"};
          border: 1px solid ${available
            ? "rgba(34,197,94,.18)"
            : "rgba(245,158,11,.18)"};
          color: ${available ? "#22c55e" : "#f59e0b"};
          font-size: 9px;
          font-weight: 800;
          white-space: nowrap;
        }

        .chevron {
          color: #666;
          font-size: 14px;
          transition: transform .18s ease;
        }

        .panel[open] .chevron {
          transform: rotate(180deg);
        }

        .content {
          padding: 0 10px 10px;
          border-top: 1px solid rgba(255,255,255,.05);
        }

        .info-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
        }

        .info {
          min-width: 0;
          box-sizing: border-box;
          padding: 14px;
          border-radius: 13px;
          background: rgba(255,255,255,.025);
          border: 1px solid rgba(255,255,255,.055);
        }

        .label {
          color: #777;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .value {
          margin-top: 7px;
          color: #fff;
          font-size: 15px;
          font-weight: 900;
          line-height: 1.15;
          overflow-wrap: anywhere;
        }

        .green {
          color: #22c55e;
        }

        .pending {
          color: #f59e0b;
        }

        .actions {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 9px;
        }

        .button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 38px;
          padding: 0 13px;
          border-radius: 11px;
          color: #fff;
          text-decoration: none;
          font-size: 11px;
          font-weight: 800;
          border: 1px solid transparent;
          transition: opacity .18s ease, transform .18s ease;
        }

        .button:hover {
          opacity: .9;
          transform: translateY(-1px);
        }

        .blue {
          background: #2563eb;
        }

        .download {
          background: #16a34a;
        }

        @media (max-width: 800px) {
          .info-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 430px) {
          .panel {
            border-radius: 15px;
          }

          .panel > summary {
            min-height: 58px;
            padding: 0 12px;
          }

          .icon {
            width: 29px;
            height: 29px;
            flex-basis: 29px;
            border-radius: 9px;
          }

          .title {
            font-size: 11px;
          }

          .subtitle {
            font-size: 9px;
          }

          .badge {
            padding: 5px 7px;
            font-size: 8px;
          }

          .content {
            padding: 0 8px 8px;
          }

          .info-grid {
            gap: 7px;
          }

          .info {
            padding: 12px;
            border-radius: 11px;
          }

          .label {
            font-size: 8px;
          }

          .value {
            font-size: 13px;
          }

          .button {
            flex: 1 1 140px;
            min-height: 36px;
            font-size: 10px;
          }
        }
      `}</style>

      <details className="panel" open>
        <summary>
          <span className="heading">
            <span className="icon" aria-hidden="true">
              📄
            </span>

            <span>
              <span className="title">Invoice Wolf</span>
              <span className="subtitle">
                Documento oficial de la liquidación
              </span>
            </span>
          </span>

          <span className="right">
            <span className="badge">
              {available ? "Disponible" : "Pendiente"}
            </span>

            <span className="chevron" aria-hidden="true">
              ⌄
            </span>
          </span>
        </summary>

        <div className="content">
          <div className="info-grid">
            <Info
              title="Periodo"
              value={
                liquidation
                  ? `${liquidation.month}/${liquidation.year}`
                  : "-"
              }
            />

            <Info
              title="Invoice"
              value={invoice?.invoice_number ?? "No generado"}
            />

            <Info
              title="Estado"
              value={available ? "Generado" : "Pendiente"}
              tone={available ? "green" : "pending"}
            />

            <Info
              title="Fecha"
              value={
                invoice?.created_at
                  ? new Date(invoice.created_at).toLocaleDateString()
                  : "-"
              }
            />
          </div>

          {invoice?.invoice_pdf_url && (
            <div className="actions">
              <a
                href={invoice.invoice_pdf_url}
                target="_blank"
                rel="noreferrer"
                className="button blue"
              >
                📄 Ver PDF
              </a>

              <a
                href={invoice.invoice_pdf_url}
                download
                className="button download"
              >
                ⬇ Descargar PDF
              </a>
            </div>
          )}
        </div>
      </details>
    </section>
  );
}

function Info({
  title,
  value,
  tone,
}: {
  title: string;
  value: string;
  tone?: "green" | "pending";
}) {
  return (
    <div className="info">
      <div className="label">{title}</div>
      <div className={`value ${tone ?? ""}`}>{value}</div>
    </div>
  );
}