import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import UnlockWhatsApp from "@/components/restaurant/UnlockWhatsApp";

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
          background: "#0a0a0a",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "700", letterSpacing: "-0.5px" }}>
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

    const isManualDelivery =
  deliverySettings?.delivery_mode ===
  "manual";

  const hasFreeDelivery =
  deliverySettings?.free_delivery_enabled &&
  Number(orderData.subtotal) >=
    Number(
      deliverySettings?.free_delivery_minimum
    );

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

  const itemsMessage =
  items
    ?.map(
      (item: any) =>
        `• ${item.quantity} x ${item.products?.name}`
    )
    .join("\n") || "";

    const whatsappMessage =
  encodeURIComponent(`

🛍️ NUEVO PEDIDO

Código:
${orderData.tracking_code}

Cliente:
${orderData.customer_name}

Teléfono:
${orderData.customer_phone}

🚚 ENTREGA

Dirección:
${orderData.delivery_address}

Sector:
${orderData.delivery_sector}

Referencia:
${orderData.notes || "Sin referencia"}

Indicaciones:
${orderData.delivery_instructions || "Sin indicaciones"}

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
$${Number(orderData.total).toFixed(2)}

Productos:
${itemsMessage}

${
  orderData.payment_method === "qr"
    ? "Ya realicé el pago mediante QR and adjuntaré el comprobante."
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

${isManualDelivery
  ? `📍 Comparto mi ubicación en el siguiente mensaje para que puedan calcular el costo del envío y confirmar mi pedido.`
  : `¿Podrían confirmar mi pedido?`}
`);

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
          background: "#0a0a0a",
          fontFamily: "system-ui, -apple-system, sans-serif"
        }}
      >
        <h1 style={{ fontSize: "24px", fontWeight: "700" }}>
          Pedido no encontrado
        </h1>
      </main>
    );
  }

 const customerSubtotal =
  Number(orderData.subtotal) +
  Number(orderData.commission_amount ?? 0);

  return (
    <main
      style={{
        maxWidth: "760px",
        margin: "0 auto",
        padding: "clamp(20px, 5vw, 50px) 16px",
        background: "#0a0a0a",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box"
      }}
    >

    <UnlockWhatsApp
      restaurantId={restaurant.id}
    />

      <div
        style={{
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            fontSize: "clamp(50px, 10vw, 70px)",
            marginBottom: "10px",
          }}
        >
          🎉
        </div>

        <h1
          style={{
            color: "#fff",
            fontSize: "clamp(32px, 7vw, 48px)",
            fontWeight: "800",
            marginBottom: "12px",
            letterSpacing: "-1px",
            lineHeight: "1.15"
          }}
        >
          ¡Pedido recibido!
        </h1>

        <p
          style={{
            color: "#a1a1aa",
            fontSize: "clamp(15px, 4vw, 17px)",
            maxWidth: "540px",
            margin: "0 auto",
            lineHeight: "1.5"
          }}
        >
          Tu pedido fue registrado correctamente. Ya puedes seguir su estado en tiempo real.
        </p>

        <p
          style={{
            color: "#f97316",
            marginTop: "16px",
            fontWeight: "600",
            fontSize: "14px",
            display: "inline-flex",
            alignItems: "center",
            gap: "6px",
            background: "rgba(249,115,22,0.08)",
            padding: "8px 16px",
            borderRadius: "999px",
            border: "1px solid rgba(249,115,22,0.15)"
          }}
        >
          ⏳ Tu pedido está pendiente de aceptación por el restaurante.
        </p>

        {restaurant && (
          <div
            style={{
              marginTop: "24px",
              textAlign: "center",
              display: "flex",
              flexDirection: "column",
              alignItems: "center"
            }}
          >
            {restaurant.logo_url && (
              <img
                src={restaurant.logo_url}
                alt={restaurant.name}
                style={{
                  width: "75px",
                  height: "75px",
                  borderRadius: "50%",
                  objectFit: "cover",
                  border: "2px solid #f97316",
                  marginBottom: "10px",
                  boxShadow: "0 8px 24px rgba(249,115,22,0.2)"
                }}
              />
            )}

            <h2
              style={{
                color: "#fff",
                fontSize: "18px",
                fontWeight: "600",
                margin: 0
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
            "linear-gradient(145deg, rgba(22,22,22,.94), rgba(10,10,10,.90))",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "clamp(20px, 5vw, 35px)",
          color: "#fff",
          backdropFilter: "blur(24px)",
          boxShadow:
            "0 28px 80px rgba(0,0,0,.58), inset 0 1px 0 rgba(255,255,255,.04)",
          position: "relative" as const,
          overflow: "hidden",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position: "absolute",
            top: -90,
            left: "50%",
            transform: "translateX(-50%)",
            width: 260,
            height: 180,
            borderRadius: "50%",
            background: "rgba(249,115,22,.10)",
            filter: "blur(55px)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 1,
            textAlign: "center",
            marginBottom: "30px",
          }}
        >
          <p
            style={{
              color: "#71717a",
              marginBottom: "6px",
              fontSize: "13px",
              textTransform: "uppercase",
              letterSpacing: "1px",
              fontWeight: "500"
            }}
          >
            Código de seguimiento
          </p>

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "14px 20px",
              borderRadius: "18px",
              background:
                "linear-gradient(135deg, rgba(249,115,22,.10), rgba(249,115,22,.025))",
              border: "1px solid rgba(249,115,22,.18)",
              boxShadow:
                "inset 0 1px 0 rgba(255,255,255,.05), 0 12px 34px rgba(249,115,22,.06)",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(30px, 8vw, 44px)",
                letterSpacing: "4px",
                color: "#f97316",
                fontWeight: "900",
                margin: 0,
                textShadow:
                  "0 0 30px rgba(249,115,22,.22)",
              }}
            >
              {orderData.tracking_code}
            </h2>
          </div>

          {/* TIEMPO ESTIMADO */}
          <div
            style={{
              maxWidth: "100%",
              margin: "0 auto 30px auto",
              background:
                "linear-gradient(135deg, rgba(249,115,22,.10), rgba(18,18,18,.94) 42%)",
              border: "1px solid rgba(249,115,22,.16)",
              borderRadius: "22px",
              padding: "26px 18px",
              textAlign: "center",
              boxShadow:
                "0 18px 48px rgba(249,115,22,.07), inset 0 1px 0 rgba(255,255,255,.04)",
            }}
          >
            <div
              style={{
                color: "#71717a",
                fontSize: "12px",
                letterSpacing: "1.5px",
                textTransform: "uppercase",
                marginBottom: "8px",
                fontWeight: "500"
              }}
            >
              ⏱ Tiempo estimado
            </div>

            <div
              style={{
                color: "#f97316",
                fontSize: "clamp(44px, 10vw, 56px)",
                fontWeight: "800",
                lineHeight: 1,
                marginBottom: "8px",
              }}
            >
              {estimatedTime}
            </div>

            <div
              style={{
                color: "#71717a",
                fontSize: "13px",
                lineHeight: "1.4"
              }}
            >
              Tiempo aproximado de preparación y entrega.
            </div>
          </div>
        </div>

        {/* CONTENEDOR DE ESTADO CON COLORES WOW DEPENDIENDO DEL VALOR */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "30px",
          }}
        >
          <div
            style={{
              background: orderData.status === "pending" || orderData.status === "Recibido" ? "rgba(249,115,22,0.12)" : "rgba(34,197,94,0.12)",
              color: orderData.status === "pending" || orderData.status === "Recibido" ? "#f97316" : "#22c55e",
              border: orderData.status === "pending" || orderData.status === "Recibido" ? "1px solid rgba(249,115,22,0.25)" : "1px solid rgba(34,197,94,0.25)",
              padding: "8px 20px",
              borderRadius: "999px",
              fontWeight: "700",
              fontSize: "14px",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.2)"
            }}
          >
            ⏳ {orderData.status}
          </div>
        </div>

        {/* DETALLES EN CUADRÍCULA GRID RESPONSIVE */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
            gap: "12px",
          }}
        >
          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>💰 Total</h3>
            <p style={cardValueStyle}>
              ${Number(orderData.total).toFixed(2)}
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>📦 Tipo</h3>
            <p style={cardValueStyle}>{orderData.order_type}</p>
          </div>

          {/* COLOR DINÁMICO PARA PAGO PENDIENTE O APROBADO */}
          <div style={{
            ...cardStyle,
            borderColor: orderData.payment_status === "paid" || orderData.payment_status === "pagado" ? "rgba(34,197,94,0.2)" : "rgba(255,255,255,0.06)",
            background: orderData.payment_status === "paid" || orderData.payment_status === "pagado" ? "rgba(34,197,94,0.02)" : "rgba(255,255,255,0.02)"
          }}>
            <h3 style={cardTitleStyle}>💳 Pago</h3>
            <p style={{
              ...cardValueStyle,
              color: orderData.payment_status === "paid" || orderData.payment_status === "pagado" ? "#22c55e" : "#fff"
            }}>
              {orderData.payment_status}
            </p>
          </div>

          <div style={cardStyle}>
            <h3 style={cardTitleStyle}>🔁 Estado</h3>
            <p style={cardValueStyle}>{orderData.status}</p>
          </div>
        </div>

        {items && items.length > 0 && (
          <div style={{ marginTop: "35px" }}>
            <h2
              style={{
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                marginBottom: "16px",
                letterSpacing: "-0.3px"
              }}
            >
               🛍️ Productos del pedido
            </h2>

            {items.map((item: any) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "14px 16px",
                  marginBottom: "10px",
                  borderRadius: "14px",
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                }}
              >
                <div style={{ marginRight: "10px" }}>
                  <div
                    style={{
                      color: "#fff",
                      fontWeight: "600",
                      fontSize: "14px",
                    }}
                  >
                    {item.products?.name}
                  </div>

                  <div
                    style={{
                      color: "#71717a",
                      fontSize: "12.5px",
                      marginTop: "2px"
                    }}
                  >
                    Cantidad: {item.quantity}
                  </div>
                </div>


              </div>
            ))}
          </div>
        )}

<div
  style={{
    marginTop: 24,
    paddingTop: 18,
    borderTop: "1px solid rgba(255,255,255,.08)",
    display: "grid",
    gap: 10,
  }}
>
<SummaryRow
  label="Productos"
  value={customerSubtotal}
/>

  {Number(orderData.delivery_fee) > 0 && (
    <SummaryRow
      label="Delivery"
      value={Number(orderData.delivery_fee)}
    />
  )}

  <div
    style={{
      borderTop:
        "1px solid rgba(255,255,255,.08)",
      marginTop: 6,
      paddingTop: 12,
    }}
  >
    <SummaryRow
      label="TOTAL"
      value={Number(orderData.total)}
      strong
    />
  </div>
</div>



        {/* ACCIONES GLOBALES */}
        <div
          style={{
            marginTop: "35px",
            display: "flex",
            flexDirection: "column",
            gap: "14px",
            alignItems: "center",
          }}
        >
          <Link
            href={`/tracking/${orderData.tracking_code}`}
            style={{
              width: "100%",
              textDecoration: "none",
            }}
          >
            <button
              style={{
                width: "100%",
                padding: "16px 24px",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                background: "#f97316",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                transition: "0.2s ease",
                boxShadow: "0 4px 20px rgba(249,115,22,0.25)"
              }}
            >
              🔍 Ver seguimiento en tiempo real
            </button>
          </Link>

{isManualDelivery && !hasFreeDelivery ? (

  <div
    style={{
      marginTop: "10px",
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(37,211,102,.05)",
      border: "1px solid rgba(37,211,102,.15)",
      width: "100%",
      boxSizing: "border-box",
    }}
  >
    <h3
      style={{
        color: "#25D366",
        fontSize: 16,
        fontWeight: 700,
        margin: 0,
      }}
    >
      📍 Último paso para confirmar tu pedido
    </h3>

    <p
      style={{
        color: "#a1a1aa",
        marginTop: 8,
        marginBottom: 14,
        lineHeight: 1.5,
        fontSize: 13.5,
      }}
    >
      Este restaurante calcula el costo del envío según tu ubicación.
    </p>

    <div
      style={{
        display: "grid",
        gap: 8,
        color: "#e4e4e7",
        fontSize: 13,
      }}
    >
      <span>✅ Presiona el botón de WhatsApp.</span>
      <span>✅ Comparte tu ubicación.</span>
      <span>✅ El restaurante calculará el envío.</span>
      <span>✅ Luego confirmará tu pedido.</span>
    </div>
  </div>

) : hasFreeDelivery ? (

  <div
    style={{
      marginTop: "10px",
      padding: "18px",
      borderRadius: "16px",
      background:
        "linear-gradient(135deg,#0f2e1b,#11351f)",
      border:
        "1px solid rgba(34,197,94,.25)",
      textAlign: "center",
    }}
  >
    <div
      style={{
        color: "#22c55e",
        fontWeight: 800,
        fontSize: 18,
      }}
    >
      🎉 Delivery GRATIS desbloqueado
    </div>

    <div
      style={{
        color: "#d1fae5",
        marginTop: 8,
        lineHeight: 1.5,
        fontSize: 14,
      }}
    >
      Tu pedido calificó para envío gratuito.
    </div>
  </div>

) : null}

          <a
            href={`https://wa.me/${
              restaurant?.whatsapp_url
                ?.replace(/\D/g, "")
                ?.replace(/^0/, "593")
            }?text=${whatsappMessage}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              width: "100%",
              textDecoration: "none",
            }}
          >
            <button
              style={{
                width: "100%",
                padding: "16px 24px",
                border: "none",
                borderRadius: "14px",
                cursor: "pointer",
                background: "#25D366",
                color: "#fff",
                fontSize: "16px",
                fontWeight: "700",
                boxShadow: "0 4px 20px rgba(37,211,102,0.2)"
              }}
            >
{isManualDelivery && !hasFreeDelivery
  ? "📍 Confirmar pedido por WhatsApp"
  : "📲 Enviar pedido por WhatsApp"}
            </button>
          </a>

          <p
            style={{
              color: "#52525b",
              textAlign: "center",
              fontSize: "13px",
              marginTop: "10px",
              flexGrow: 0,
              lineHeight: 1.4
            }}
          >
            Guarda este código para consultar tu pedido en cualquier momento.
          </p>

          <div
            style={{
              color: "#f97316",
              fontWeight: "800",
              fontSize: "20px",
              letterSpacing: "3px",
            }}
          >
            {orderData.tracking_code}
          </div>
        </div>
      </div>
    </main>
  );
}

function SummaryRow({
  label,
  value,
  strong = false,
}: {
  label: string;
  value: number;
  strong?: boolean;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <span
        style={{
          color: strong ? "#fff" : "#A1A1AA",
          fontWeight: strong ? 700 : 500,
          fontSize: strong ? 15 : 14,
        }}
      >
        {label}
      </span>

      <span
        style={{
          color: "#fff",
          fontWeight: strong ? 800 : 600,
          fontSize: strong ? 18 : 15,
        }}
      >
        ${value.toFixed(2)}
      </span>
    </div>
  );
}

const cardStyle = {
  background:
    "linear-gradient(145deg, rgba(255,255,255,.045), rgba(255,255,255,.015))",
  border: "1px solid rgba(255,255,255,.07)",
  borderRadius: "18px",
  padding: "16px 14px",
  textAlign: "center" as const,
  boxShadow:
    "inset 0 1px 0 rgba(255,255,255,.035), 0 10px 26px rgba(0,0,0,.16)",
};

const cardTitleStyle = {
  color: "#71717a",
  fontSize: "12px",
  fontWeight: "500",
  margin: "0 0 6px 0",
  textTransform: "uppercase" as const,
  letterSpacing: "0.5px"
};

const cardValueStyle = {
  color: "#fff",
  fontSize: "15px",
  fontWeight: "600",
  margin: 0
};