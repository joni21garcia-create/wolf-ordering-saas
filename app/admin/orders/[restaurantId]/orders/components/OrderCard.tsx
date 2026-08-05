"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import "./order-card.css";

import {
  MapPin,
  Phone,
  Mail,
  CreditCard,
  Truck,
  ShoppingBag,
  Clock,
  ChefHat,
  CheckCircle2,
  Bike,
  CheckCheck,
} from "lucide-react";

import {
  colors,
} from "./styles";

import "./order-card.css";

import type {
  Order,
} from "./types";

import {
  getDeliveryDisplay,
} from "@/lib/delivery/getDeliveryDisplay";

import WolfButton from "@/components/ui/WolfButton";

interface Props {
  order: Order;

 deliverySettings: {
  delivery_mode: "fixed" | "manual";
  delivery_fee: number;
  free_delivery_enabled: boolean;
  free_delivery_minimum: number;
};

  onRefresh: () => Promise<void>;

  onViewDetail: (
  orderId: string
) => void;

  onUpdateStatus: (
    orderId: string,
    status: string
  ) => Promise<void>;

  onUpdatePayment: (
    orderId: string,
    payment: string
  ) => Promise<void>;
}

function money(value: number | string) {
  return `$ ${Number(value).toFixed(2)}`;
}

// Tiempo transcurrido desde la creación del pedido.
// Función pura: recibe "now" desde afuera en vez de leer Date.now()
// internamente. Así el resultado es determinista y no depende de
// cuándo se ejecuta el render (evita el hydration mismatch).
// Devuelve null si no hay una fecha válida (no se inventa información).
function getElapsedLabel(
  createdAt: string | undefined,
  now: number
): string | null {
  if (!createdAt) return null;

  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) return null;

  const diffMs = now - created;
  const minutes = Math.max(0, Math.floor(diffMs / 60000));

  if (minutes < 1) return "Recién";
  if (minutes < 60) return `Hace ${minutes} min`;

  const hours = Math.floor(minutes / 60);
  return `Hace ${hours} h`;
}

// Tema visual por estado: pending (naranja) / preparing (azul) /
// ready (verde) / completed (gris apagado).
// NOTA: esta función no cambió. Sigue leyendo el status técnico del backend.
function getStatusTheme(
  status: string
): "pending" | "preparing" | "ready" | "completed" {
  switch (status) {
    case "preparing":
      return "preparing";
    case "ready":
    case "out_for_delivery":
      return "ready";
    case "completed":
      return "completed";
    case "accepted":
    default:
      return "pending";
  }
}

// Texto humano para el badge de estado.
// Solo cambia lo que VE el usuario. El status técnico (order.status)
// nunca se modifica ni se envía distinto al backend.
function getStatusLabel(status: string): string {
  switch (status) {
    case "accepted":
      return "Esperando cocina";
    case "preparing":
      return "Preparando";
    case "ready":
      return "Listo para entregar";
    case "out_for_delivery":
      return "En camino";
    case "completed":
      return "Completado";
    default:
      return "Pendiente";
  }
}

// Icono funcional (lucide-react) que acompaña al texto humano del estado.
function getStatusIcon(status: string) {
  switch (status) {
    case "accepted":
      return Clock;
    case "preparing":
      return ChefHat;
    case "ready":
      return CheckCircle2;
    case "out_for_delivery":
      return Bike;
    case "completed":
      return CheckCheck;
    default:
      return Clock;
  }
}

// Acción principal según el estado actual.
// La lógica (next status) es exactamente la misma que antes.
// Solo se humanizan label + icon para mostrarlos en el botón.
function getPrimaryAction(
  status: string,
  isDelivery: boolean
): { label: string; next: string; icon: typeof Clock } | null {
  switch (status) {
    case "accepted":
      return { label: "Empezar preparación", next: "preparing", icon: ChefHat };
    case "preparing":
      return { label: "Marcar listo", next: "ready", icon: CheckCircle2 };
    case "ready":
      return isDelivery
        ? { label: "Entregar pedido", next: "out_for_delivery", icon: Bike }
        : { label: "Completar pedido", next: "completed", icon: CheckCheck };
    case "out_for_delivery":
      return { label: "Completar pedido", next: "completed", icon: CheckCheck };
    case "completed":
      return null;
    default:
      // Estado inicial o desconocido
      return { label: "Aceptar pedido", next: "accepted", icon: Clock };
  }
}

// Variante visual de WolfButton según el tema de estado.
// Mantiene la misma identidad de color (naranja/azul/verde) que ya
// usa el borde, el LED y el badge de la tarjeta.
function getStatusVariant(
  theme: "pending" | "preparing" | "ready" | "completed"
): "primary" | "info" | "success" | "secondary" {
  switch (theme) {
    case "pending":
      return "primary";
    case "preparing":
      return "info";
    case "ready":
      return "success";
    default:
      return "secondary";
  }
}

export default function OrderCard({
  order,
  deliverySettings,
  onRefresh,
  onViewDetail,
  onUpdateStatus,
  onUpdatePayment,
}: Props) {

  const delivery = getDeliveryDisplay({
    settings: deliverySettings,
    orderTotal: Number(order.subtotal ?? 0),
  });

  // "now" solo existe en el cliente, después del mount. Mientras es
  // null (servidor + primer render del cliente antes de hidratar),
  // "elapsed" es null en ambos lados — no hay nada que diverja.
  // El intervalo refresca el texto cada 60s: como el formato solo
  // cambia por minuto ("Hace 3 min" → "Hace 4 min"), no hace falta
  // un tick más frecuente que ese.
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 60_000);
    return () => clearInterval(id);
  }, []);

  const elapsed = now
    ? getElapsedLabel((order as { created_at?: string }).created_at, now)
    : null;

  // tracking_code es el identificador visible para el restaurante.
  // Nunca se usa el UUID: si el campo no viene poblado, se muestra un
  // placeholder neutro en vez de order.id.
  const trackingLabel =
    (order as { tracking_code?: string }).tracking_code || "SIN CÓDIGO";

  const isDelivery = order.order_type === "delivery";
  const statusTheme = getStatusTheme(order.status);
  const primaryAction = getPrimaryAction(order.status, isDelivery);



  return (
    <motion.article
      className="wolf-order-card"
      data-status-theme={statusTheme}
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      {/* HEADER — tracking + nombre a la izquierda, badges + tiempo a la derecha */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 10,
        }}
      >
        <div style={{ minWidth: 0 }}>
          <div
            style={{
              fontSize: 12,
              fontWeight: 700,
              color: "#f97316",
              letterSpacing: 0.4,
              textTransform: "uppercase",
            }}
          >
            {trackingLabel}
          </div>

          <div
            style={{
              marginTop: 4,
              fontSize: 16,
              fontWeight: 700,
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {order.customer_name}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-end",
            gap: 5,
            flexShrink: 0,
          }}
        >
<div style={{ display: "flex", gap: 6 }}>
  <span className="wolf-badge wolf-badge-neutral">
    {isDelivery ? (
      <Truck size={12} />
    ) : (
      <ShoppingBag size={12} />
    )}

    {isDelivery ? "Delivery" : "Pickup"}
  </span>
</div>
          {elapsed && (
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: colors.textSecondary,
              }}
            >
              {elapsed}
            </span>
          )}
        </div>
      </div>

{/* CONTACTO */}
{(order.customer_phone ||
  order.customer_email ||
  order.delivery_address ||
  order.payment_method) && (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: 5,
    }}
  >
    {order.customer_phone && (
      <div className="wolf-client-line">
        <Phone size={13} />
        {order.customer_phone}
      </div>
    )}

    {order.customer_email && (
      <div className="wolf-client-line">
        <Mail size={13} />
        {order.customer_email}
      </div>
    )}

    {isDelivery && order.delivery_address && (
      <div
        className="wolf-client-line"
        style={{ alignItems: "flex-start" }}
      >
        <MapPin
          size={13}
          style={{
            marginTop: 1,
            flexShrink: 0,
          }}
        />
        <span>{order.delivery_address}</span>
      </div>
    )}

    {order.payment_method && (
      <div className="wolf-client-line">
        <CreditCard size={13} />
        {order.payment_method}
      </div>
    )}
  </div>
)}

{/* PRODUCTOS */}
<div
  style={{
    display: "flex",
    flexDirection: "column",
    gap: 5,
  }}
>
  {(order.order_items ?? []).map((item) => (
    <div key={item.id} className="wolf-product-line">
      <span className="wolf-product-qty">
        {item.quantity}×
      </span>
      <span className="wolf-product-name">
        {item.products?.name}
      </span>
    </div>
  ))}
</div>

{/* DELIVERY */}
{isDelivery && (
  <div
    style={{
      display: "flex",
      justifyContent: "flex-end",
    }}
  >
    {delivery.isFree && (
      <span
        className="wolf-badge"
        style={{
          background: "rgba(34,197,94,.15)",
          color: "#22c55e",
        }}
      >
        🟢 Delivery gratis
      </span>
    )}

    {delivery.isManual && !delivery.isFree && (
      <span
        className="wolf-badge"
        style={{
          background: "rgba(249,115,22,.15)",
          color: "#f97316",
        }}
      >
        🟠 Manual
      </span>
    )}

    {!delivery.isManual && !delivery.isFree && (
      <span className="wolf-badge wolf-badge-neutral">
        {delivery.label}
      </span>
    )}
  </div>
)}

      {/* RESUMEN ECONÓMICO — usa exactamente los valores del pedido */}
      <div className="wolf-summary">
        <div className="wolf-summary-row">
          <span className="wolf-summary-label">
            Cliente
          </span>

          <span className="wolf-summary-value">
            {money(order.total)}
          </span>
        </div>

        <div className="wolf-summary-row">
          <span className="wolf-summary-label">
            Wolf
          </span>

          <span className="wolf-summary-value">
            {money(
              Number(
                (order as { wolf_amount?: number | string })
                  .wolf_amount ?? 0
              )
            )}
          </span>
        </div>

        <div className="wolf-summary-row">
          <span className="wolf-summary-label">
            Restaurante
          </span>

          <span className="wolf-summary-value">
            {money(
              Number(
                (order as {
                  restaurant_amount?: number | string;
                }).restaurant_amount ?? 0
              )
            )}
          </span>
        </div>
      </div>

      {/* TOTAL — cifra grande, igual al valor pagado por el cliente */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span
          style={{
            fontSize: 12,
            color: colors.textSecondary,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: 0.4,
          }}
        >
          Total
        </span>

        <span
          style={{
            fontSize: 22,
            fontWeight: 800,
          }}
        >
          {money(order.total)}
        </span>
      </div>

      {/* ACCIÓN — una sola, con el color del estado (WolfButton) */}
      {primaryAction ? (
        <WolfButton
          type="button"
          fullWidth
          variant={getStatusVariant(statusTheme)}
          onClick={() => onUpdateStatus(order.id, primaryAction.next)}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          <primaryAction.icon size={16} />
          {primaryAction.label}
        </WolfButton>
      ) : (
        <div className="wolf-completed-note">
          <CheckCheck size={14} />
          Pedido completado
        </div>
      )}

      {/* SECUNDARIAS — discretas */}
      <div className="wolf-secondary-row">
        <button
          type="button"
          className={`wolf-secondary-action${order.payment_status === "paid" ? " is-positive" : ""}`}
          onClick={() => onUpdatePayment(order.id, "paid")}
        >
          <CreditCard size={13} />
          {order.payment_status === "paid" ? "Pagado" : "Marcar pagado"}
        </button>

        <button
          type="button"
          className="wolf-secondary-action"
          onClick={() => onViewDetail(order.id)}
        >
          Ver detalle →
        </button>
      </div>
    </motion.article>
  );
}