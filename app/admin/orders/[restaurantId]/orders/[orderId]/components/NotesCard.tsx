interface Props {
  order: any;
}

export default function NotesCard({ order }: Props) {
  const notes =
    order.notes &&
    order.notes !== "EMPTY";

  const instructions =
    order.delivery_instructions &&
    order.delivery_instructions !== "EMPTY";

  const sector =
    order.delivery_sector &&
    order.delivery_sector !== "EMPTY";

  if (!notes && !instructions && !sector) {
    return null;
  }

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
          marginBottom: 24,
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
          Observaciones
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Notas del Pedido
        </h2>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 18,
        }}
      >
        {notes && (
          <Box
            title="Notas del Cliente"
            value={order.notes}
          />
        )}

        {instructions && (
          <Box
            title="Instrucciones de Entrega"
            value={order.delivery_instructions}
          />
        )}

        {sector && (
          <Box
            title="Sector"
            value={order.delivery_sector}
          />
        )}
      </div>
    </section>
  );
}

function Box({
  title,
  value,
}: {
  title: string;
  value: string;
}) {
  return (
    <div
      style={{
        background:
          "rgba(255,255,255,.03)",
        border:
          "1px solid rgba(255,255,255,.05)",
        borderRadius: 18,
        padding: 20,
      }}
    >
      <div
        style={{
          color: "#f97316",
          fontSize: 13,
          marginBottom: 10,
          fontWeight: 700,
          letterSpacing: 1,
          textTransform: "uppercase",
        }}
      >
        {title}
      </div>

      <div
        style={{
          color: "#ddd",
          lineHeight: 1.7,
          whiteSpace: "pre-wrap",
          wordBreak: "break-word",
        }}
      >
        {value}
      </div>
    </div>
  );
}