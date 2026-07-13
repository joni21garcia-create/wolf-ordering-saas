"use client";

interface Props {
  order: any;
}

export default function ActionsCard({ order }: Props) {
  function copy(text: string) {
    navigator.clipboard.writeText(text);
  }

  function whatsapp() {
    if (!order.customer_phone) return;

    const phone = order.customer_phone.replace(/\D/g, "");

    window.open(
      `https://wa.me/${phone}`,
      "_blank"
    );
  }

  function printOrder() {
    window.print();
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
          Acciones
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Acciones Rápidas
        </h2>
      </div>

      <div
        style={{
          display: "grid",
          gap: 14,
        }}
      >
        <ActionButton
          text="🖨 Imprimir pedido"
          onClick={printOrder}
        />

        <ActionButton
          text="📋 Copiar Tracking"
          onClick={() =>
            copy(order.tracking_code)
          }
        />

        <ActionButton
          text="📞 Copiar Teléfono"
          onClick={() =>
            copy(order.customer_phone)
          }
        />

        <ActionButton
          text="💬 Abrir WhatsApp"
          onClick={whatsapp}
        />

        {order.payment_proof_url && (
          <a
            href={order.payment_proof_url}
            target="_blank"
            style={{
              textDecoration: "none",
            }}
          >
            <ActionButton
              text="📄 Ver comprobante"
            />
          </a>
        )}

        {order.payment_proof_url && (
          <a
            href={order.payment_proof_url}
            download
            style={{
              textDecoration: "none",
            }}
          >
            <ActionButton
              text="⬇ Descargar comprobante"
            />
          </a>
        )}
      </div>
    </section>
  );
}

function ActionButton({
  text,
  onClick,
}: {
  text: string;
  onClick?: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%",
        padding: "16px",
        background:
          "rgba(255,255,255,.04)",
        border:
          "1px solid rgba(255,255,255,.07)",
        borderRadius: 16,
        color: "#fff",
        fontWeight: 700,
        cursor: "pointer",
        fontSize: 15,
        transition: ".25s",
      }}
    >
      {text}
    </button>
  );
}