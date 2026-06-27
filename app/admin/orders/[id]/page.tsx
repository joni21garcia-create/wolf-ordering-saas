import Link from "next/link";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function OrderPage({
  params,
}: Props) {
  const { id } = await params;

  const { data: order } =
    await supabase
      .from("orders")
      .select(`
        *,
        order_items (
          *,
          products (
            id,
            name
          )
        )
      `)
      .eq("id", id)
      .single();

  if (!order) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#050505",
          color: "#fff",
        }}
      >
        Pedido no encontrado
      </main>
    );
  }

  const statusColor =
    order.status === "completed"
      ? "#22c55e"
      : order.status === "cancelled"
      ? "#ef4444"
      : "#f97316";

  const paymentColor =
    order.payment_status === "paid"
      ? "#22c55e"
      : "#facc15";

  const kitchenMinutes =
    order.preparing_at &&
    order.completed_at
      ? Math.round(
          (new Date(
            order.completed_at
          ).getTime() -
            new Date(
              order.preparing_at
            ).getTime()) /
            60000
        )
      : null;

  const totalMinutes =
    order.completed_at
      ? Math.round(
          (new Date(
            order.completed_at
          ).getTime() -
            new Date(
              order.created_at
            ).getTime()) /
            60000
        )
      : null;

  return (
    <main
      style={{
        minHeight: "100vh",
        background:
          "linear-gradient(180deg,#050505,#0b0b0b)",
        padding: "40px",
      }}
    >
      <div
        style={{
          maxWidth: "1500px",
          margin: "0 auto",
        }}
      >
        {/* HEADER PREMIUM */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "20px",
            marginBottom: "35px",
          }}
        >
          <div>
            <div
              style={{
                color: "#777",
                marginBottom: "10px",
                textTransform:
                  "uppercase",
                letterSpacing:
                  "2px",
              }}
            >
              Pedido
            </div>

            <h1
              style={{
                color: "#fff",
                fontSize: "58px",
                margin: 0,
                fontWeight: 800,
              }}
            >
              {order.tracking_code}
            </h1>
          </div>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                padding:
                  "14px 24px",
                borderRadius:
                  "999px",
                background:
                  `${statusColor}20`,
                color:
                  statusColor,
                fontWeight:
                  "700",
              }}
            >
              {order.status}
            </div>

            <div
              style={{
                padding:
                  "14px 24px",
                borderRadius:
                  "999px",
                background:
                  `${paymentColor}20`,
                color:
                  paymentColor,
                fontWeight:
                  "700",
              }}
            >
              {order.payment_status ===
              "paid"
                ? "💳 Pagado"
                : "⏳ Pendiente"}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "25px",
          }}
        >
          {/* IZQUIERDA */}

          <div
            style={{
              display: "flex",
              flexDirection:
                "column",
              gap: "25px",
            }}
          >
            {/* CLIENTE */}

            <div style={card}>
              <h2>👤 Cliente</h2>

              <p>
                {order.customer_name}
              </p>

              <p>
                {order.customer_phone}
              </p>

              {order.customer_email && (
                <p>
                  {
                    order.customer_email
                  }
                </p>
              )}

              <hr
                style={{
                  margin:
                    "20px 0",
                }}
              />

              <p>
                📦 Tipo:
                {" "}
                {order.order_type}
              </p>

              <p>
                💳 Método:
                {" "}
                {
                  order.payment_method
                }
              </p>

              {order.selected_qr_name && (
                <p>
                  🏦 QR:
                  {" "}
                  {
                    order.selected_qr_name
                  }
                </p>
              )}
            </div>

            {/* PRODUCTOS */}

            <div style={card}>
              <h2>
                🍔 Productos
              </h2>

              {order.order_items?.map(
                (
                  item: any
                ) => (
                  <div
                    key={item.id}
                    style={{
                      display:
                        "flex",
                      justifyContent:
                        "space-between",
                      padding:
                        "18px 0",
                      borderBottom:
                        "1px solid rgba(255,255,255,.08)",
                    }}
                  >
                    <div>
                      <strong
                        style={{
                          fontSize:
                            "18px",
                        }}
                      >
                        {
                          item
                            .products
                            ?.name
                        }
                      </strong>

                      <div
                        style={{
                          marginTop:
                            "6px",
                          color:
                            "#aaa",
                        }}
                      >
                        Cantidad:
                        {" "}
                        {
                          item.quantity
                        }
                      </div>
                    </div>

                    <strong
                      style={{
                        fontSize:
                          "20px",
                      }}
                    >
                      $
                      {Number(
                        item.subtotal
                      ).toFixed(
                        2
                      )}
                    </strong>
                  </div>
                )
              )}
            </div>

         {/* ENTREGA / RETIRO */}

<div style={card}>
  <h2>
    {order.order_type === "delivery"
      ? "📍 Información de Entrega"
      : "🛍️ Información de Retiro"}
  </h2>

  {order.order_type ===
  "delivery" ? (
    <>
      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: "13px",
            marginBottom: "5px",
          }}
        >
          Dirección
        </div>

        <strong>
          {order.delivery_address ||
            "No registrada"}
        </strong>
      </div>

      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: "13px",
            marginBottom: "5px",
          }}
        >
          Sector
        </div>

        <strong>
          {order.delivery_sector ||
            "No registrado"}
        </strong>
      </div>

      <div
        style={{
          marginBottom: "18px",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: "13px",
            marginBottom: "5px",
          }}
        >
          Instrucciones
        </div>

        <strong>
          {order.delivery_instructions ||
            "Sin instrucciones"}
        </strong>
      </div>

      <div>
        <div
          style={{
            color: "#888",
            fontSize: "13px",
            marginBottom: "5px",
          }}
        >
          Notas
        </div>

        <strong>
          {order.notes ||
            "Sin notas"}
        </strong>
      </div>
    </>
  ) : (
    <>
      <div>
        <div
          style={{
            color: "#888",
            fontSize: "13px",
            marginBottom: "5px",
          }}
        >
          Notas para retiro
        </div>

        <strong>
          {order.notes ||
            "Sin notas"}
        </strong>
      </div>
    </>
  )}
</div>



          </div>

          {/* DERECHA */}

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "25px",
            }}
          >
            {/* RESUMEN FINANCIERO */}

            <div style={card}>
              <h2>
                💰 Resumen Financiero
              </h2>

              <Row
                label="Subtotal"
                value={order.subtotal}
              />

              <Row
                label="Delivery"
                value={order.delivery_fee}
              />

              <Row
                label="Total Cliente"
                value={order.total}
              />

              <hr
                style={{
                  margin: "20px 0",
                  borderColor:
                    "rgba(255,255,255,.08)",
                }}
              />

              <Row
                label="🐺 Comisión Wolf"
                value={order.wolf_amount}
              />

              <Row
                label="🏪 Gana Restaurante"
                value={
                  order.restaurant_amount
                }
              />
            </div>

          {/* INFORMACIÓN DE PAGO */}

<div style={card}>
  <h2>
    💳 Información de Pago
  </h2>


  <div
    style={{
      padding: "14px",
      borderRadius: "16px",
      background:
        order.payment_status ===
        "paid"
          ? "#22c55e20"
          : "#facc1520",
      color:
        order.payment_status ===
        "paid"
          ? "#22c55e"
          : "#facc15",
      fontWeight: 700,
      textAlign: "center",
      marginBottom: "20px",
    }}
  >
    {order.payment_status ===
    "paid"
      ? "✅ Pago Confirmado"
      : "⏳ Pago Pendiente"}
  </div>

  <div
    style={{
      background:
        "rgba(255,255,255,.03)",
      border:
        "1px solid rgba(255,255,255,.08)",
      borderRadius: "18px",
      padding: "18px",
      marginBottom: "20px",
    }}
  >
    <div
      style={{
        color: "#888",
        fontSize: "13px",
        marginBottom: "8px",
      }}
    >
      Método de Pago
    </div>

    <div
      style={{
        fontSize: "20px",
        fontWeight: "700",
        color: "#fff",
        textTransform:
          "uppercase",
      }}
    >
      {order.payment_method}
    </div>

    {order.selected_qr_name && (
      <>
        <hr
          style={{
            margin: "18px 0",
            borderColor:
              "rgba(255,255,255,.08)",
          }}
        />

        <div
          style={{
            color: "#888",
            fontSize: "13px",
            marginBottom: "8px",
          }}
        >
          QR Utilizado
        </div>

        <div
          style={{
            color: "#fff",
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          {order.selected_qr_name}
        </div>
      </>
    )}
  </div>

  {order.cash_amount && (
    <div
      style={{
        background:
          "linear-gradient(135deg,rgba(34,197,94,.12),rgba(249,115,22,.12))",
        border:
          "1px solid rgba(255,255,255,.08)",
        borderRadius: "18px",
        padding: "20px",
        marginBottom: "20px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          marginBottom: "14px",
        }}
      >
        <span>
          💵 Cliente paga con
        </span>

        <strong
          style={{
            color: "#22c55e",
            fontSize: "22px",
          }}
        >
          $
          {Number(
            order.cash_amount
          ).toFixed(2)}
        </strong>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
        }}
      >
        <span>
          🔄 Debe devolver
        </span>

        <strong
          style={{
            color: "#f97316",
            fontSize: "22px",
          }}
        >
          $
          {Number(
            order.change_amount || 0
          ).toFixed(2)}
        </strong>
      </div>
    </div>
  )}

  {order.payment_proof_url && (
    <div
      style={{
        background:
          "rgba(255,255,255,.03)",
        border:
          "1px solid rgba(255,255,255,.08)",
        borderRadius: "18px",
        overflow: "hidden",
      }}
    >
      <div
        style={{
          padding: "18px",
        }}
      >
        <div
          style={{
            color: "#888",
            fontSize: "13px",
            marginBottom: "8px",
          }}
        >
          Comprobante
        </div>

        <div
          style={{
            fontWeight: "700",
            fontSize: "18px",
          }}
        >
          🧾 Evidencia de Pago
        </div>
      </div>

      <img
        src={
          order.payment_proof_url
        }
        alt="Comprobante"
        style={{
          width: "100%",
          display: "block",
          borderTop:
            "1px solid rgba(255,255,255,.08)",
          borderBottom:
            "1px solid rgba(255,255,255,.08)",
        }}
      />

      <div
        style={{
          padding: "18px",
        }}
      >
        <a
          href={
            order.payment_proof_url
          }
          target="_blank"
          rel="noreferrer"
        >
          <button
            style={{
              width: "100%",
              padding: "16px",
              border: "none",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg,#f97316,#ea580c)",
              color: "#fff",
              fontWeight: "700",
              cursor: "pointer",
            }}
          >
            🔍 Ver Comprobante Completo
          </button>
        </a>
      </div>
    </div>
  )}
</div>
            {/* INFORMACIÓN */}

<div style={card}>
  <h2>
    📊 Información
  </h2>

  <p>
    Fecha:
  </p>

  <strong>
    {new Date(
      order.created_at
    ).toLocaleString()}
  </strong>

  <hr
    style={{
      margin: "20px 0",
    }}
  />

  <p>
    🔖 Tracking
  </p>

  <strong
    style={{
      color: "#f97316",
      fontSize: "20px",
    }}
  >
    {order.tracking_code}
  </strong>

  <hr
    style={{
      margin: "20px 0",
    }}
  />

  <p>
    📦 Tipo Pedido
  </p>

  <strong
    style={{
      color: "#22c55e",
      fontSize: "20px",
      textTransform:
        "capitalize",
    }}
  >
    {order.order_type}
  </strong>
</div>

            {/* VOLVER */}

            <Link
              href="/admin/orders"
            >
              <button
                style={{
                  width: "100%",
                  padding: "18px",
                  border: "none",
                  borderRadius:
                    "18px",
                  background:
                    "linear-gradient(135deg,#f97316,#ea580c)",
                  color:
                    "#fff",
                  fontWeight:
                    "800",
                  fontSize:
                    "16px",
                  cursor:
                    "pointer",
                  boxShadow:
                    "0 15px 40px rgba(249,115,22,.35)",
                }}
              >
                ← Volver al Panel
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}

function Row({
  label,
  value,
}: any) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        marginBottom: "14px",
      }}
    >
      <span
        style={{
          color: "#aaa",
        }}
      >
        {label}
      </span>

      <strong>
        $
        {Number(
          value || 0
        ).toFixed(2)}
      </strong>
    </div>
  );
}

const card = {
  background:
    "linear-gradient(180deg,rgba(255,255,255,.05),rgba(255,255,255,.03))",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "28px",
  padding: "28px",
  color: "#fff",
  backdropFilter:
    "blur(25px)",
  boxShadow:
    "0 10px 40px rgba(0,0,0,.25)",
};