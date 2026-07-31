import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import TrackingRealtime from "@/components/tracking/TrackingRealtime";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

interface Props {
  params: Promise<{
    code: string;
  }>;
}

export default async function TrackingPage({
  params,
}: Props) {
  const { code } = await params;

  // Buscar pedido por código
  const { data: order } = await supabase
    .from("orders")
    .select("*")
    .eq("tracking_code", code)
    .maybeSingle();

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
        <h1>Pedido no encontrado</h1>
      </main>
    );
  }

  // Obtener restaurante
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("slug")
    .eq("id", order.restaurant_id)
    .maybeSingle();

  // Configuración de tiempos
  const { data: deliverySettings } = await supabase
    .from("restaurant_delivery_settings")
    .select("*")
    .eq("restaurant_id", order.restaurant_id)
    .maybeSingle();

  /**
   * Flujo oficial del pedido
   */
  const steps = [
    "pending",
    "accepted",
    "preparing",
    "ready",
    "on_the_way",
    "completed",
  ];

  const currentStep = steps.indexOf(order.status);

  /**
   * Texto mostrado al cliente
   */
  const statusLabel =
    order.status === "pending"
      ? "⏳ Pendiente"
      : order.status === "accepted"
      ? "✅ Aceptado"
      : order.status === "preparing"
      ? "👨‍🍳 Preparando"
      : order.status === "ready"
      ? "📦 Listo para entregar"
      : order.status === "on_the_way"
      ? "🛵 En camino"
      : order.status === "completed"
      ? "🎉 Entregado"
      : order.status === "cancelled"
      ? "❌ Cancelado"
      : "📋 Estado desconocido";

  /**
   * Colores del badge
   */
  const badgeBackground =
    order.status === "completed"
      ? "#16a34a22"
      : order.status === "cancelled"
      ? "#ef444422"
      : "#f9731622";

  const badgeColor =
    order.status === "completed"
      ? "#16a34a"
      : order.status === "cancelled"
      ? "#ef4444"
      : "#f97316";

  const timelineLabels = [
    "Recibido",
    "Aceptado",
    "Preparando",
    "Listo",
    "En camino",
    "Entregado",
  ];

  return (
        <main
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "60px 20px",
      }}
    >
      <TrackingRealtime orderId={order.id} />

      {/* Título */}
      <h1
        style={{
          color: "#fff",
          textAlign: "center",
          marginBottom: "30px",
        }}
      >
        Seguimiento del Pedido
      </h1>

      {/* Código de seguimiento */}
      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          padding: "30px",
          textAlign: "center",
          marginBottom: "25px",
          border: "1px solid rgba(255,255,255,.08)",
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

        <h1
          style={{
            color: "#fff",
            margin: 0,
            fontSize: "42px",
            letterSpacing: "3px",
          }}
        >
          {order.tracking_code}
        </h1>
      </div>

      {/* Estado actual */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "30px",
        }}
      >
        <div
          style={{
            padding: "12px 22px",
            borderRadius: "999px",
            background: badgeBackground,
            color: badgeColor,
            fontWeight: "700",
            fontSize: "16px",
          }}
        >
          {statusLabel}
        </div>
      </div>

      {/* Mensaje mientras espera aceptación */}
      {order.status === "pending" && (
        <div
          style={{
            textAlign: "center",
            marginBottom: "30px",
            color: "#f97316",
            fontWeight: "600",
          }}
        >
          ⏳ El restaurante aún no ha aceptado tu pedido.
        </div>
      )}

      {/* Timeline */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "50px",
          gap: "10px",
        }}
      >
        {timelineLabels.map((label, index) => (
          <div
            key={label}
            style={{
              flex: 1,
              textAlign: "center",
            }}
          >
            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                margin: "0 auto 10px",
                background:
                  index <= currentStep
                    ? "#f97316"
                    : "#333",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontWeight: "bold",
                transition: ".25s",
              }}
            >
              {index + 1}
            </div>

            <span
              style={{
                color: "#ddd",
                fontSize: "14px",
                fontWeight:
                  index <= currentStep ? 700 : 400,
              }}
            >
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Tiempo estimado */}
      <div
        style={{
          background: "#111",
          borderRadius: "24px",
          padding: "25px",
          marginBottom: "25px",
          border: "1px solid rgba(255,255,255,.08)",
          textAlign: "center",
        }}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: "10px",
          }}
        >
          ⏱ Tiempo estimado
        </h3>

        <div
          style={{
            color: "#f97316",
            fontSize: "32px",
            fontWeight: "800",
          }}
        >
          {order.order_type === "pickup"
            ? `${deliverySettings?.preparation_time} min`
            : `${deliverySettings?.preparation_time} - ${
                Number(
                  deliverySettings?.preparation_time
                ) +
                Number(
                  deliverySettings?.delivery_time
                )
              } min`}
        </div>

        <p
          style={{
            color: "rgba(255,255,255,.65)",
            marginTop: "10px",
          }}
        >
          Tiempo aproximado de preparación y entrega.
        </p>
      </div>
            {/* Información del pedido */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
        }}
      >
        <div style={cardStyle}>
          <h3>👤 Cliente</h3>
          <p>{order.customer_name}</p>
        </div>

        <div style={cardStyle}>
          <h3>💰 Total</h3>
          <p>${Number(order.total).toFixed(2)}</p>
        </div>

        <div style={cardStyle}>
          <h3>📦 Tipo</h3>
          <p>
            {order.order_type === "pickup"
              ? "Recoger en tienda"
              : "Entrega a domicilio"}
          </p>
        </div>

        <div style={cardStyle}>
          <h3>💳 Pago</h3>
          <p>{order.payment_status}</p>
        </div>
      </div>

      {/* Botón volver */}
      <div
        style={{
          textAlign: "center",
          marginTop: "40px",
        }}
      >
        <Link href={`/${restaurant?.slug}`}>
          <button
            style={{
              padding: "15px 30px",
              borderRadius: "14px",
              border: "none",
              cursor: "pointer",
              background: "#f97316",
              color: "#fff",
              fontWeight: "700",
              fontSize: "15px",
              transition: ".2s",
            }}
          >
            ◀️ Volver al inicio
          </button>
        </Link>
      </div>
    </main>
  );
}

const cardStyle = {
  background: "#111",
  color: "#fff",
  padding: "24px",
  borderRadius: "20px",
  border: "1px solid rgba(255,255,255,.08)",
} as const;