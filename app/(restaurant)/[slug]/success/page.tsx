import Link from "next/link";
import { supabase } from "@/lib/supabase/client";

interface Props {
  searchParams: Promise<{
    order?: string;
  }>;
}

export default async function SuccessPage({
  searchParams,
}: Props) {
  const { order } =
    await searchParams;

  if (!order) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h1>
          Pedido no encontrado
        </h1>
      </main>
    );
  }

  const { data: orderData } =
    await supabase
      .from("orders")
      .select("*")
      .eq("id", order)
      .single();
      
       
      const { data: restaurant } =
  await supabase
    .from("restaurants")
    .select("*")
    .eq(
      "id",
      orderData.restaurant_id
    )
    .single();

    const { data: deliverySettings } =
  await supabase
    .from(
      "restaurant_delivery_settings"
    )
    .select("*")
    .eq(
      "restaurant_id",
      restaurant.id
    )
    .single();

const whatsappMessage =
  encodeURIComponent(`

🛍️ NUEVO PEDIDO

Código:
${orderData.tracking_code}

Cliente:
${orderData.customer_name}

Teléfono:
${orderData.customer_phone}

Tipo:
${orderData.order_type}

Método de pago:
${orderData.payment_method}

${
  orderData.selected_qr_name
    ? `QR utilizado:
${orderData.selected_qr_name}`
    : ""
}

Total:
$${orderData.total}

${
  orderData.payment_method === "qr"
    ? "Ya realicé el pago mediante QR y adjuntaré el comprobante."
    : ""
}

${
  orderData.payment_method ===
  "transfer"
    ? "Ya realicé la transferencia bancaria y adjuntaré el comprobante."
    : ""
}

${
  orderData.payment_method ===
    "cash" &&
  orderData.cash_amount
    ? `Pagaré con:
$${orderData.cash_amount}`
    : ""
}

${
  orderData.payment_method ===
    "delivery" &&
  orderData.cash_amount
    ? `Pagaré con:
$${orderData.cash_amount}`
    : ""
}

¿Podrían confirmar mi pedido?
`);

const { data: items } =
  await supabase
    .from("order_items")
    .select(`
      *,
      products (
        name,
        image_url
      )
    `)
    .eq(
      "order_id",
      orderData.id
    );

const preparationTime =
  Number(
    deliverySettings?.preparation_time
  ) || 0;

const deliveryTime =
  Number(
    deliverySettings?.delivery_time
  ) || 0;

const estimatedTime =
  orderData.order_type ===
  "pickup"
    ? `${preparationTime} min`
    : `${preparationTime} - ${
        preparationTime +
        deliveryTime
      } min`;

  if (!orderData) {
    return (
      <main
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: "#fff",
        }}
      >
        <h1>
          Pedido no encontrado
        </h1>
      </main>
    );
  }

  return (
    <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "80px 20px",
      }}
    >
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <div
          style={{
            fontSize: "80px",
            marginBottom: "20px",
          }}
        >
          🎉
        </div>

        <h1
          style={{
            color: "#fff",
            fontSize: "52px",
            fontWeight: "800",
            marginBottom: "15px",
          }}
        >
          ¡Pedido recibido!
        </h1>

        <p
          style={{
            color: "#aaa",
            fontSize: "18px",
            maxWidth: "600px",
            margin: "0 auto",
          }}
        >
          Tu pedido fue registrado correctamente.
          Ya puedes seguir su estado en tiempo real.
        </p>

<p
  style={{
    color: "#f97316",
    marginTop: "15px",
    fontWeight: "600",
  }}
>
  ⏳ Tu pedido está pendiente de aceptación por el restaurante.
</p>


{restaurant && (
  <div
    style={{
      marginTop: "30px",
      textAlign: "center",
    }}
  >
    {restaurant.logo_url && (
      <img
        src={restaurant.logo_url}
        alt={restaurant.name}
        style={{
          width: "90px",
          height: "90px",
          borderRadius: "50%",
          objectFit: "cover",
          border:
            "3px solid #f97316",
          marginBottom: "15px",
        }}
      />
    )}

    <h2
      style={{
        color: "#fff",
      }}
    >
      {restaurant.name}
    </h2>
  </div>
)}

      </div>

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "30px",
          padding: "40px",
          color: "#fff",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 20px 80px rgba(0,0,0,.35)",
        }}
      >
        <div
          style={{
            textAlign: "center",
            marginBottom: "35px",
          }}
        >
          <p
            style={{
              color: "#888",
              marginBottom: "10px",
            }}
          >
            Código de seguimiento
          </p>

          <h2
            style={{
              fontSize: "42px",
              letterSpacing: "3px",
              color: "#f97316",
              margin: 0,
            }}
          >
            {
              orderData.tracking_code
            }
          </h2>

{/* PASOS DEL PEDIDO */}

<div
  style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    gap: "20px",
    marginTop: "40px",
    marginBottom: "40px",
  }}
>
  {[
    "Recibido",
    "Preparando",
    "En camino",
    "Entregado",
  ].map((step, index) => (
    <div
      key={step}
      style={{
        flex: 1,
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          background:
            index === 0
              ? "#f97316"
              : "#222",
          margin:
            "0 auto 12px",
          display: "flex",
          alignItems:
            "center",
          justifyContent:
            "center",
          color: "#fff",
          fontWeight: "700",
          fontSize: "18px",
        }}
      >
        {index + 1}
      </div>

      <div
        style={{
          color: "#aaa",
          fontSize: "13px",
        }}
      >
        {step}
      </div>
    </div>
  ))}
</div>

{/* TIEMPO ESTIMADO */}

<div
  style={{
    maxWidth: "600px",
    margin: "0 auto 40px auto",
    background:
      "linear-gradient(180deg,#171717,#111)",
    border:
      "1px solid rgba(249,115,22,.15)",
    borderRadius: "30px",
    padding: "35px",
    textAlign: "center",
    boxShadow:
      "0 20px 60px rgba(249,115,22,.08)",
  }}
>
  <div
    style={{
      color: "#888",
      fontSize: "13px",
      letterSpacing: "2px",
      textTransform: "uppercase",
      marginBottom: "12px",
    }}
  >
    ⏱ Tiempo estimado
  </div>

  <div
    style={{
      color: "#f97316",
      fontSize: "62px",
      fontWeight: "800",
      lineHeight: 1,
      marginBottom: "12px",
    }}
  >
    {estimatedTime}
  </div>

  <div
    style={{
      color:
        "rgba(255,255,255,.55)",
      fontSize: "14px",
    }}
  >
    Tiempo aproximado de preparación
    y entrega del pedido.
  </div>
</div>

        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "35px",
          }}
        >
          <div
            style={{
              background:
                "#f9731620",
              color: "#f97316",
              padding:
                "12px 22px",
              borderRadius:
                "999px",
              fontWeight: "700",
            }}
          >
            ⏳ {orderData.status}
          </div>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
          }}
        >
          <div
            style={cardStyle}
          >
            <h3>
              💰 Total
            </h3>

            <p>
              $
              {Number(
                orderData.total
              ).toFixed(2)}
            </p>
          </div>

          <div
            style={cardStyle}
          >
            <h3>
              📦 Tipo
            </h3>

            <p>
              {
                orderData.order_type
              }
            </p>
          </div>

          <div
            style={cardStyle}
          >
            <h3>
              💳 Pago
            </h3>

            <p>
              {
                orderData.payment_status
              }
            </p>
          </div>

          <div
            style={cardStyle}
          >
            <h3>
              🔁 Estado
            </h3>

            <p>
              {
                orderData.status
              }
            </p>
          </div>
        </div>

{items &&
  items.length > 0 && (
    <div
      style={{
        marginTop: "40px",
      }}
    >
      <h2
        style={{
          color: "#fff",
          marginBottom: "20px",
        }}
      >
         🛍️Productos del pedido
      </h2>

      {items.map(
        (item: any) => (
          <div
            key={item.id}
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems:
                "center",
              padding: "16px",
              marginBottom:
                "12px",
              borderRadius:
                "16px",
              background:
                "rgba(255,255,255,.03)",
              border:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div>
              <div
                style={{
                  color: "#fff",
                  fontWeight:
                    "600",
                }}
              >
                {
                  item.products
                    ?.name
                }
              </div>

              <div
                style={{
                  color: "#888",
                  fontSize:
                    "14px",
                }}
              >
                Cantidad:
                {item.quantity}
              </div>
            </div>

            <div
              style={{
                color:
                  "#f97316",
                fontWeight:
                  "700",
              }}
            >
              $
              {Number(
                item.subtotal
              ).toFixed(2)}
            </div>
          </div>
        )
      )}
    </div>
)}

        <div
          style={{
            marginTop: "40px",
            display: "flex",
            flexDirection:
              "column",
            gap: "15px",
            alignItems:
              "center",
          }}
        >
          <Link
            href={`/tracking/${orderData.tracking_code}`}
            style={{
              width: "100%",
              maxWidth: "400px",
              textDecoration:
                "none",
            }}
          >
            <button
              style={{
                width: "100%",
                padding:
                  "18px 30px",
                border: "none",
                borderRadius:
                  "16px",
                cursor:
                  "pointer",
                background:
                  "#f97316",
                color: "#fff",
                fontSize:
                  "17px",
                fontWeight:
                  "700",
              }}
            >
              🔍 Ver seguimiento en tiempo real
            </button>
          </Link>

<a
  href={`https://wa.me/${restaurant?.whatsapp}?text=${whatsappMessage}`}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    width: "100%",
    maxWidth: "400px",
    textDecoration: "none",
  }}
>
  <button
    style={{
      width: "100%",
      padding: "18px 30px",
      border: "none",
      borderRadius: "16px",
      cursor: "pointer",
      background: "#25D366",
      color: "#fff",
      fontSize: "17px",
      fontWeight: "700",
    }}
  >
    📲 Enviar pedido por WhatsApp
  </button>
</a>

          <p
            style={{
              color: "#777",
              textAlign:
                "center",
              fontSize:
                "14px",
            }}
          >
            Guarda este código para consultar
            tu pedido en cualquier momento.
          </p>

          <div
            style={{
              color: "#f97316",
              fontWeight: "700",
              fontSize: "22px",
              letterSpacing: "2px",
            }}
          >
            {
              orderData.tracking_code
            }
          </div>
        </div>
      </div>
    </main>
  );
}

const cardStyle = {
  background:
    "rgba(255,255,255,.03)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "20px",
  padding: "20px",
  textAlign: "center" as const,
};