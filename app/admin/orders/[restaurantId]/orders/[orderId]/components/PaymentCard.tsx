interface Props {
  order: any;
}

export default function PaymentCard({ order }: Props) {
  const method = order.payment_method ?? "";

  const paid = order.payment_status === "paid";

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
      <div
        style={{
          marginBottom: 26,
        }}
      >
        <div
          style={{
            color: "#f97316",
            fontWeight: 700,
            fontSize: 12,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Pago
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Información del Pago
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: 18,
        }}
      >
        <Info
          title="Método"
          value={paymentMethod(method)}
        />

        <Info
          title="Estado"
          value={paid ? "Pagado" : "Pendiente"}
          color={paid ? "#22c55e" : "#f59e0b"}
        />

        <Info
          title="Confirmado"
          value={
            order.payment_confirmed
              ? "Sí"
              : "No"
          }
        />

        <Info
          title="Total"
          value={`$${Number(order.total ?? 0).toFixed(2)}`}
        />
      </div>

      {method === "cash" && (
        <CashSection order={order} />
      )}

      {(method === "transfer" ||
        method === "bank_transfer") && (
        <TransferSection order={order} />
      )}

      {method === "qr" && (
        <QRSection order={order} />
      )}

      {method === "card" && (
        <CardSection order={order} />
      )}
    </section>
  );
}

function CashSection({
  order,
}: {
  order: any;
}) {
  return (
    <ExtraGrid>
      <Info
        title="Recibido"
        value={`$${Number(
          order.cash_amount ?? 0
        ).toFixed(2)}`}
      />

      <Info
        title="Cambio"
        value={`$${Number(
          order.change_amount ?? 0
        ).toFixed(2)}`}
      />
    </ExtraGrid>
  );
}

function TransferSection({
  order,
}: {
  order: any;
}) {
  return (
    <ExtraGrid>
      <Info
        title="Banco"
        value={order.bank_name ?? "-"}
      />

      <Info
        title="Referencia"
        value={
          order.transaction_reference ??
          "-"
        }
      />
    </ExtraGrid>
  );
}

function QRSection({
  order,
}: {
  order: any;
}) {
  return (
    <ExtraGrid>
      <Info
        title="QR utilizado"
        value={
          order.selected_qr_name ?? "-"
        }
      />

      <Info
        title="QR ID"
        value={
          order.selected_qr_id ?? "-"
        }
      />
    </ExtraGrid>
  );
}

function CardSection({
  order,
}: {
  order: any;
}) {
  return (
    <ExtraGrid>
      <Info
        title="Referencia"
        value={
          order.transaction_reference ??
          "-"
        }
      />

      <Info
        title="Autorización"
        value={
          order.authorization_code ??
          "-"
        }
      />
    </ExtraGrid>
  );
}

function ExtraGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        marginTop: 24,
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit,minmax(220px,1fr))",
        gap: 18,
      }}
    >
      {children}
    </div>
  );
}

function Info({
  title,
  value,
  color,
}: {
  title: string;
  value: any;
  color?: string;
}) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.025)",
        borderRadius: 18,
        padding: 18,
        border:
          "1px solid rgba(255,255,255,.05)",
      }}
    >
      <div
        style={{
          color: "#777",
          fontSize: 12,
          marginBottom: 8,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: color ?? "#fff",
          fontWeight: 700,
          fontSize: 17,
          wordBreak: "break-word",
        }}
      >
        {value || "-"}
      </div>
    </div>
  );
}

function paymentMethod(method: string) {
  switch (method) {
    case "cash":
      return "💵 Efectivo";

    case "qr":
      return "📱 QR";

    case "transfer":
      return "🏦 Transferencia";

    case "bank_transfer":
      return "🏦 Transferencia";

    case "card":
      return "💳 Tarjeta";

    default:
      return method || "-";
  }
}