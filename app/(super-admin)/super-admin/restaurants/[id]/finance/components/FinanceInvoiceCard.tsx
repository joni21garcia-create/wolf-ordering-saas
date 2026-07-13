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
    <section
      style={{
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
            📄 Invoice Wolf
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#8b8b8b",
            }}
          >
            Documento oficial generado para la liquidación.
          </p>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background: available
              ? "rgba(34,197,94,.12)"
              : "rgba(245,158,11,.12)",
            color: available
              ? "#22c55e"
              : "#f59e0b",
            border: available
              ? "1px solid rgba(34,197,94,.25)"
              : "1px solid rgba(245,158,11,.25)",
            fontWeight: 800,
          }}
        >
          {available
            ? "Disponible"
            : "Pendiente"}
        </div>
      </div>

      <div
        style={{
          background:
            "linear-gradient(180deg,#171717,#101010)",

          border:
            "1px solid rgba(255,255,255,.07)",

          borderRadius: 24,

          padding: 28,
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: 18,
          }}
        >
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
            value={
              invoice?.invoice_number ??
              "No generado"
            }
          />

          <Info
            title="Estado"
            value={
              available
                ? "Generado"
                : "Pendiente"
            }
            color={
              available
                ? "#22c55e"
                : "#f59e0b"
            }
          />

          <Info
            title="Fecha"
            value={
              invoice?.created_at
                ? new Date(
                    invoice.created_at
                  ).toLocaleDateString()
                : "-"
            }
          />
        </div>

        {invoice?.invoice_pdf_url && (
          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
              marginTop: 28,
            }}
          >
            <a
              href={invoice.invoice_pdf_url}
              target="_blank"
              rel="noreferrer"
              style={{
                textDecoration: "none",
              }}
            >
              <Button color="#2563eb">
                📄 Ver PDF
              </Button>
            </a>

            <a
              href={invoice.invoice_pdf_url}
              download
              style={{
                textDecoration: "none",
              }}
            >
              <Button color="#16a34a">
                ⬇ Descargar PDF
              </Button>
            </a>
          </div>
        )}
      </div>
    </section>
  );
}

function Info({
  title,
  value,
  color,
}: {
  title: string;
  value: string;
  color?: string;
}) {
  return (
    <div>
      <div
        style={{
          color: "#888",
          fontSize: 12,
          textTransform: "uppercase",
          fontWeight: 700,
          letterSpacing: .8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          marginTop: 10,
          fontSize: 26,
          fontWeight: 800,
          color: color ?? "#fff",
        }}
      >
        {value}
      </div>
    </div>
  );
}

function Button({
  children,
  color,
}: {
  children: React.ReactNode;
  color: string;
}) {
  return (
    <div
      style={{
        background: color,
        color: "#fff",
        padding: "14px 22px",
        borderRadius: 14,
        fontWeight: 700,
      }}
    >
      {children}
    </div>
  );
}