interface Props {
  order: any;
}

export default function MapCard({ order }: Props) {
  const hasAddress =
    order.delivery_address &&
    order.delivery_address !== "EMPTY";

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
          Ubicación
        </div>

        <h2
          style={{
            color: "#fff",
            margin: "6px 0 0",
            fontSize: 26,
            fontWeight: 700,
          }}
        >
          Dirección del Pedido
        </h2>
      </div>

      <div
        style={{
          minHeight: 280,
          borderRadius: 20,
          overflow: "hidden",
          border: "1px solid rgba(255,255,255,.05)",
          background:
            "linear-gradient(135deg,#111,#191919)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {hasAddress ? (
          <div
            style={{
              padding: 30,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontSize: 60,
              }}
            >
              📍
            </div>

            <div
              style={{
                color: "#fff",
                marginTop: 18,
                fontWeight: 700,
                fontSize: 18,
              }}
            >
              {order.delivery_address}
            </div>

            {order.delivery_sector && (
              <div
                style={{
                  marginTop: 10,
                  color: "#888",
                }}
              >
                {order.delivery_sector}
              </div>
            )}
          </div>
        ) : (
          <div
            style={{
              color: "#666",
              textAlign: "center",
            }}
          >
            No existe ubicación registrada.
          </div>
        )}
      </div>

      {hasAddress && (
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            order.delivery_address
          )}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: "block",
            marginTop: 20,
            textDecoration: "none",
          }}
        >
          <button
            style={{
              width: "100%",
              padding: 16,
              borderRadius: 16,
              border: "none",
              background: "#f97316",
              color: "#fff",
              fontWeight: 700,
              cursor: "pointer",
            }}
          >
            Abrir en Google Maps
          </button>
        </a>
      )}
    </section>
  );
}