"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";
import { getDeliveryDisplay } from "@/lib/delivery/getDeliveryDisplay";

interface CartItem {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  display_price?: number;
  quantity: number;
  image_url?: string | null;
}

interface Props {
  items: CartItem[];
  orderType:
    | "delivery"
    | "pickup"
    | null;
  deliverySettings?: any;
  increaseQuantity?: (
    id: string
  ) => void;
  decreaseQuantity?: (
    id: string
  ) => void;
  removeItem?: (
    id: string
  ) => void;
}

export default function Cart({
  items,
  orderType,
  deliverySettings,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
}: Props) {

  const router = useRouter();
  const params = useParams();

const subtotal = items.reduce(
  (sum, item) =>
    sum +
    (item.display_price ?? item.price) *
      item.quantity,
  0
);

const delivery = getDeliveryDisplay({
  settings: {
    delivery_mode:
      deliverySettings?.delivery_mode ?? "fixed",

    delivery_fee:
      Number(
        deliverySettings?.delivery_fee
      ) || 0,

    free_delivery_enabled:
      Boolean(
        deliverySettings?.free_delivery_enabled
      ),

    free_delivery_minimum:
      Number(
        deliverySettings?.free_delivery_minimum
      ) || 0,
  },

  orderTotal: subtotal,
});

const total = Number(
  (
    subtotal +
    delivery.amount
  ).toFixed(2)
);

  const handleContinueOrder =
    () => {
      const customer =
        localStorage.getItem(
          "wolf_customer"
        );

      if (!customer) {
        alert(
          "Completa tus datos primero"
        );
        return;
      }

      const customerData =
        JSON.parse(customer);

      const name =
        customerData.name?.trim() || "";

      const phone =
        customerData.phone?.trim() || "";

      const address =
        customerData.address?.trim() || "";

      const zone =
        customerData.zone?.trim() || "";

      console.log(
        "CUSTOMER DATA:",
        customerData
      );
      if (name.length < 3) {
        alert(
          "Ingresa un nombre válido"
        );
        return;
      }

      if (!/[a-zA-ZáéíóúÁÉÍÓÚñÑ ]/.test(name)) {
        alert(
          "Ingresa un nombre real"
        );
        return;
      }

      if (!phone) {
        alert(
          "Debes ingresar tu teléfono"
        );
        return;
      }

      const onlyNumbers =
        phone.replace(/\D/g, "");

      if (onlyNumbers.length < 10) {
        alert(
          "Ingresa un teléfono válido"
        );
        return;
      }

      const savedOrderType =
        localStorage.getItem(
          "wolf_order_type"
        );

      if (!savedOrderType) {
        alert(
          "Debes seleccionar Delivery o Pickup"
        );
        return;
      }

      if (
        savedOrderType ===
        "delivery"
      ) {
        if (
          !customerData.address?.trim()
        ) {
          alert(
            "Debes ingresar la dirección"
          );
          return;
        }

        if (
          !customerData.zone?.trim()
        ) {
          alert(
            "Debes ingresar el sector"
          );
          return;
        }
      }

      if (
        items.length === 0
      ) {
        alert(
          "Debes agregar al menos un producto"
        );
        return;
      }

      localStorage.setItem(
        "wolf_cart",
        JSON.stringify(items)
      );

      if (items.length > 0) {
        localStorage.setItem(
          "restaurant_id",
          items[0].restaurant_id
        );
      }

      const slug =
        Array.isArray(params.slug)
          ? params.slug[0]
          : params.slug;

      if (!slug) {
        alert("No se encontró el restaurante");
        return;
      }

      localStorage.setItem(
        "restaurant_slug",
        slug
      );

      router.push(
        `/${slug}/checkout`
      );
    };

  return (
    <div
      className="glass-card wolf-shadow"
      style={{
        padding: "24px",
        borderRadius: "24px",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      {/* CLASES RESPONSIVAS INYECTADAS PARA HACER CONTROLES ELÁSTICOS EN MOBILE */}
      <style>{`
        .wolf-cart-item-row {
          display: flex;
          flex-direction: column;
          gap: 12px;
          justify-content: space-between;
        }
        @media (min-width: 380px) {
          .wolf-cart-item-row {
            flex-direction: row;
            align-items: center;
          }
        }
      `}</style>

      <h3
        style={{
          color: "#fff",
          fontSize: "22px",
          fontWeight: 800,
          marginBottom: "20px",
          marginTop: 0,
          letterSpacing: "-0.5px"
        }}
      >
        🛒 Mi Pedido {items.length > 0 && `(${items.reduce((sum, i) => sum + i.quantity, 0)})`}
      </h3>

      {items.length === 0 && (
        <div
          style={{
            textAlign: "center",
            padding: "40px 0",
            color: "rgba(255,255,255,.4)",
            fontSize: "14px"
          }}
        >
          Tu carrito está vacío
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
        {items.map((item) => (
          <div
            key={item.id}
            style={{
              borderBottom: "1px solid rgba(255,255,255,.06)",
              paddingBottom: "16px",
              marginBottom: "16px",
              width: "100%",
              boxSizing: "border-box"
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "start",
                marginBottom: "12px",
                gap: "10px"
              }}
            >
              <strong
                style={{
                  color: "#fff",
                  fontSize: "15px",
                  fontWeight: "600",
                  lineHeight: "1.4"
                }}
              >
                {item.name}
              </strong>

              <button
                onClick={() => removeItem?.(item.id)}
                style={{
                  background: "transparent",
                  border: "none",
                  cursor: "pointer",
                  color: "#ef4444",
                  fontSize: "16px",
                  padding: "4px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxSizing: "border-box"
                }}
              >
                🗑
              </button>
            </div>

            <div className="wolf-cart-item-row">
              <div
                style={{
                  display: "flex",
                  gap: "12px",
                  alignItems: "center",
                }}
              >
                <button
                  onClick={() => decreaseQuantity?.(item.id)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "none",
                    background: "rgba(255,255,255,0.06)",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box"
                  }}
                >
                  -
                </button>

                <span
                  style={{
                    color: "#fff",
                    minWidth: "24px",
                    textAlign: "center",
                    fontSize: "14px",
                    fontWeight: "600"
                  }}
                >
                  {item.quantity}
                </span>

                <button
                  onClick={() => increaseQuantity?.(item.id)}
                  style={{
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    border: "none",
                    background: "#f97316",
                    color: "#fff",
                    cursor: "pointer",
                    fontSize: "16px",
                    fontWeight: "bold",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    boxSizing: "border-box"
                  }}
                >
                  +
                </button>
              </div>

              <strong
                style={{
                  color: "#f97316",
                  fontSize: "15px",
                  fontWeight: "700"
                }}
              >
                $
                {((item.display_price || item.price) * item.quantity).toFixed(2)}
              </strong>
            </div>
          </div>
        ))}
      </div>

  <div style={{ marginTop: "20px", width: "100%", boxSizing: "border-box" }}>

  {orderType === "delivery" &&
    deliverySettings?.free_delivery_enabled &&
    !delivery.isFree && (
      <div
        style={{
          background: "rgba(34,197,94,.08)",
          border: "1px solid rgba(34,197,94,.15)",
          color: "#4ade80",
          padding: "12px",
          borderRadius: "12px",
          marginBottom: "16px",
          fontSize: "13px",
          fontWeight: "600",
          textAlign: "center",
        }}
      >
        🚚 Delivery gratis desde $
        {Number(
          deliverySettings.free_delivery_minimum
        ).toFixed(2)}
      </div>
    )}

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      color: "rgba(255,255,255,.6)",
      marginBottom: "10px",
      fontSize: "14px",
    }}
  >
    <span>Subtotal</span>

    <span>${subtotal.toFixed(2)}</span>
  </div>

  {orderType === "delivery" && (

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: "16px",
        gap: 14,
      }}
    >
      <span
        style={{
          color: "rgba(255,255,255,.6)",
        }}
      >
        Delivery
      </span>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-end",
          gap: 6,
          maxWidth: 220,
        }}
      >

        {delivery.isManual && !delivery.isFree && (
          <>
            <span
              style={{
                background: "rgba(249,115,22,.15)",
                color: "#f97316",
                padding: "5px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              📍 Manual
            </span>

            <span
              style={{
                color: "#a1a1aa",
                fontSize: 12,
                textAlign: "right",
                lineHeight: 1.5,
              }}
            >
              Costo acordado con el restaurante
            </span>
          </>
        )}

        {delivery.isFree && (
          <>
            <span
              style={{
                background: "rgba(34,197,94,.15)",
                color: "#22c55e",
                padding: "5px 12px",
                borderRadius: 999,
                fontSize: 12,
                fontWeight: 700,
              }}
            >
              🎉 Delivery GRATIS
            </span>

            <span
              style={{
                color: "#a1a1aa",
                fontSize: 12,
                textAlign: "right",
                lineHeight: 1.5,
              }}
            >
              Tu pedido supera el monto mínimo para envío gratuito.
            </span>
          </>
        )}

        {!delivery.isManual &&
          !delivery.isFree && (
            <strong
              style={{
                color: "#fff",
              }}
            >
              {delivery.label}
            </strong>
          )}

      </div>

    </div>

  )}

  <hr
    style={{
      border: "none",
      borderTop: "1px solid rgba(255,255,255,.06)",
      margin: "16px 0",
    }}
  />

  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      color: "#fff",
      fontWeight: "800",
      fontSize: "18px",
      marginBottom: "24px",
    }}
  >
    <span>Total</span>

    <span>${total.toFixed(2)}</span>
  </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          className="wolf-button"
          onClick={handleContinueOrder}
          style={{
            width: "100%",
            border: "none",
            borderRadius: "14px",
            padding: "16px",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "15px",
            color: "#fff",
            boxSizing: "border-box"
          }}
        >
          Continuar pago
        </motion.button>
      </div>
    </div>
  );
}


