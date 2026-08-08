"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  motion,
} from "framer-motion";

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

import {
  WolfOrderProducts,
} from "@/lib/wolf-ui/orders";


interface Props {
  order: Order;

  deliverySettings: {
    delivery_mode:
      | "fixed"
      | "manual";

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


/* =========================================================
   DINERO
   ========================================================= */

function money(
  value:
    | number
    | string
    | null
    | undefined
) {
  return `$${Number(
    value ?? 0
  ).toFixed(2)}`;
}


/* =========================================================
   TIEMPO
   ========================================================= */

function getElapsedLabel(
  createdAt:
    | string
    | undefined,

  now: number
): string | null {

  if (!createdAt) {
    return null;
  }


  const created =
    new Date(
      createdAt
    ).getTime();


  if (
    Number.isNaN(
      created
    )
  ) {
    return null;
  }


  const diffMs =
    now - created;


  const minutes =
    Math.max(
      0,
      Math.floor(
        diffMs /
          60000
      )
    );


  if (
    minutes < 1
  ) {
    return "Recién";
  }


  if (
    minutes < 60
  ) {
    return `Hace ${minutes} min`;
  }


  const hours =
    Math.floor(
      minutes / 60
    );


  return `Hace ${hours} h`;
}


/* =========================================================
   TEMA VISUAL
   ========================================================= */

function getStatusTheme(
  status: string
):
  | "pending"
  | "preparing"
  | "ready"
  | "completed" {

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


/* =========================================================
   ESTADO — TEXTO
   ========================================================= */

function getStatusLabel(
  status: string
): string {

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


/* =========================================================
   ESTADO — ICONO
   ========================================================= */

function getStatusIcon(
  status: string
) {

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


/* =========================================================
   ACCIÓN PRINCIPAL
   ========================================================= */

function getPrimaryAction(
  status: string,
  isDelivery: boolean
):
  | {
      label: string;
      next: string;
      icon: typeof Clock;
    }
  | null {

  switch (status) {

    case "accepted":
      return {
        label:
          "Empezar preparación",

        next:
          "preparing",

        icon:
          ChefHat,
      };


    case "preparing":
      return {
        label:
          "Marcar listo",

        next:
          "ready",

        icon:
          CheckCircle2,
      };


    case "ready":

      return isDelivery
        ? {
            label:
              "Entregar pedido",

            next:
              "out_for_delivery",

            icon:
              Bike,
          }
        : {
            label:
              "Completar pedido",

            next:
              "completed",

            icon:
              CheckCheck,
          };


    case "out_for_delivery":
      return {
        label:
          "Completar pedido",

        next:
          "completed",

        icon:
          CheckCheck,
      };


    case "completed":
      return null;


    default:
      return {
        label:
          "Aceptar pedido",

        next:
          "accepted",

        icon:
          Clock,
      };
  }
}


/* =========================================================
   COLOR REAL DEL BOTÓN
   =========================================================
   
   IMPORTANTE:
   WolfButton NO tiene variante "info".
   Por eso usamos siempre una variante válida y
   sobrescribimos visualmente el color cuando
   estamos en preparación o en camino.
   ========================================================= */

function getActionButtonStyle(
  theme:
    | "pending"
    | "preparing"
    | "ready"
    | "completed",

  status: string
) {

  if (
    theme ===
    "preparing"
  ) {

    return {
      background:
        "linear-gradient(135deg, #2563eb, #3b82f6)",

      color:
        "#ffffff",

      border:
        "none",

      boxShadow:
        "0 8px 24px rgba(59,130,246,.24)",
    };
  }


  if (
    status ===
    "out_for_delivery"
  ) {

    return {
      background:
        "linear-gradient(135deg, #0891b2, #06b6d4)",

      color:
        "#ffffff",

      border:
        "none",

      boxShadow:
        "0 8px 24px rgba(6,182,212,.22)",
    };
  }


  if (
    theme ===
    "ready"
  ) {

    return {
      background:
        "linear-gradient(135deg, #16a34a, #22c55e)",

      color:
        "#ffffff",

      border:
        "none",

      boxShadow:
        "0 8px 24px rgba(34,197,94,.22)",
    };
  }


  if (
    theme ===
    "completed"
  ) {

    return {
      background:
        "rgba(255,255,255,.06)",

      color:
        "#d4d4d8",

      border:
        "1px solid rgba(255,255,255,.08)",

      boxShadow:
        "none",
    };
  }


  return {
    background:
      "linear-gradient(135deg, #f97316, #fb923c)",

    color:
      "#ffffff",

    border:
      "none",

    boxShadow:
      "0 8px 24px rgba(249,115,22,.22)",
  };
}


/* =========================================================
   PRODUCTOS — PRECIO QUE PAGA EL CLIENTE
   =========================================================
   
   Supabase entrega:
   
   item.subtotal
   order.commission_amount
   order.total
   
   El restaurante NO debe recibir este precio.
   
   Para la tarjeta:
   
   subtotal producto
   + comisión Wolf proporcional
   = precio mostrado al cliente
   
   La distribución restaurante/Wolf continúa
   mostrándose separadamente abajo.
   ========================================================= */

function getCustomerOrderItems(
  order: Order
) {

  const items =
    order.order_items ??
    [];


  const subtotal =
    Number(
      order.subtotal ??
      0
    );


const orderFinancials =
  order as Order & {
    commission_amount?:
      number | string;

    wolf_amount?:
      number | string;
  };

const commission =
  Number(
    orderFinancials.commission_amount ??
    orderFinancials.wolf_amount ??
    0
  );


  if (
    items.length === 0
  ) {
    return items;
  }


  if (
    subtotal <= 0 ||
    commission <= 0
  ) {
    return items;
  }


  /*
   * Trabajamos en centavos para evitar
   * errores de floating point.
   */

  const commissionCents =
    Math.round(
      commission * 100
    );


  let allocatedCents = 0;


  return items.map(
    (
      item,
      index
    ) => {

      const itemSubtotal =
        Number(
          item.subtotal ??
          0
        );


      /*
       * Último producto:
       * recibe el residuo para que la suma
       * cierre exactamente.
       */

      const isLast =
        index ===
        items.length - 1;


      const itemCommissionCents =
        isLast
          ? commissionCents -
            allocatedCents
          : Math.round(
              commissionCents *
                (
                  itemSubtotal /
                  subtotal
                )
            );


      allocatedCents +=
        itemCommissionCents;


      const customerSubtotalCents =
        Math.round(
          itemSubtotal * 100
        ) +
        itemCommissionCents;


      const customerSubtotal =
        customerSubtotalCents /
        100;


      const quantity =
        Number(
          item.quantity ??
          1
        );


      const customerUnitPrice =
        quantity > 0
          ? customerSubtotal /
            quantity
          : customerSubtotal;


      return {
        ...item,

        /*
         * WolfOrderProducts ya utiliza
         * estos dos campos para presentar
         * precio unitario y subtotal.
         */

        unit_price:
          customerUnitPrice,

        subtotal:
          customerSubtotal,
      };
    }
  );
}


/* =========================================================
   COMPONENTE
   ========================================================= */

export default function OrderCard({
  order,
  deliverySettings,
  onRefresh,
  onViewDetail,
  onUpdateStatus,
  onUpdatePayment,
}: Props) {

  /*
   * El padre controla el refresh.
   * Conservamos el contrato sin introducir
   * una segunda fuente de actualización.
   */

  void onRefresh;


  /* =======================================================
     DELIVERY
     ======================================================= */

  const delivery =
    getDeliveryDisplay({
      settings:
        deliverySettings,

      orderTotal:
        Number(
          order.subtotal ??
          0
        ),
    });


  /* =======================================================
     TIEMPO
     ======================================================= */

  const [
    now,
    setNow,
  ] =
    useState<
      number | null
    >(null);


  useEffect(() => {

    setNow(
      Date.now()
    );


    const id =
      setInterval(
        () =>
          setNow(
            Date.now()
          ),
        60_000
      );


    return () =>
      clearInterval(
        id
      );

  }, []);


  const elapsed =
    now
      ? getElapsedLabel(
          (
            order as {
              created_at?:
                string;
            }
          )
            .created_at,
          now
        )
      : null;


  /* =======================================================
     DATA
     ======================================================= */

  const trackingLabel =
    (
      order as {
        tracking_code?:
          string;
      }
    )
      .tracking_code ||
    "SIN CÓDIGO";


  const isDelivery =
    order.order_type ===
    "delivery";


  const statusTheme =
    getStatusTheme(
      order.status
    );


  const primaryAction =
    getPrimaryAction(
      order.status,
      isDelivery
    );


  const StatusIcon =
    getStatusIcon(
      order.status
    );


  /*
   * IMPORTANTE:
   * estos valores vienen de Supabase.
   */

const orderFinancials =
  order as Order & {
    commission_amount?:
      number | string;

    wolf_amount?:
      number | string;

    restaurant_amount?:
      number | string;
  };


const clientTotal =
  Number(
    orderFinancials.total ??
    0
  );


const commissionAmount =
  Number(
    orderFinancials.commission_amount ??
    orderFinancials.wolf_amount ??
    0
  );


const restaurantAmount =
  Number(
    orderFinancials.restaurant_amount ??
    0
  );




  /*
   * Creamos únicamente una representación
   * para PRESENTACIÓN.
   *
   * No modificamos el objeto original
   * ni enviamos estos valores a Supabase.
   */

  const customerOrder =
    {
      ...order,

      order_items:
        getCustomerOrderItems(
          order
        ),
    } as Order;


  /* =======================================================
     ACCIÓN
     ======================================================= */

  async function handleStatusUpdate() {

    if (
      !primaryAction
    ) {
      return;
    }


    await onUpdateStatus(
      order.id,
      primaryAction.next
    );
  }


  /* =======================================================
     RENDER
     ======================================================= */

  return (
    <motion.article

      className="
        wolf-order-card
      "

      data-status-theme={
        statusTheme
      }

      layout

      layoutId={
        `wolf-order-${order.id}`
      }

      initial={{
        opacity: 0,
        y: 6,
      }}

      animate={{
        opacity: 1,
        y: 0,
      }}

      transition={{
        layout: {
          duration:
            0.34,

          ease: [
            0.22,
            1,
            0.36,
            1,
          ],
        },

        opacity: {
          duration:
            0.18,
        },

        y: {
          duration:
            0.22,
        },
      }}

      style={{

        /*
         * AJUSTE 3:
         *
         * ColumnBoard tiene padding:18px.
         * Esto permite que la tarjeta ocupe ese espacio
         * y llegue visualmente hasta los bordes internos
         * de la columna.
         */

        width:
          "calc(100% + 36px)",

        marginLeft:
          -18,

        boxSizing:
          "border-box",

        alignSelf:
          "stretch",

        position:
          "relative",

        overflow:
          "hidden",

        borderRadius:
          18,

        padding:
          14,

        background:
          "linear-gradient(180deg, rgba(255,255,255,.045), rgba(255,255,255,.025))",

        border:
          "1px solid rgba(255,255,255,.07)",

        borderLeft:
          `3px solid ${
            statusTheme ===
            "preparing"
              ? "#3b82f6"
              : statusTheme ===
                "ready"
                ? "#22c55e"
                : statusTheme ===
                  "completed"
                  ? "#71717a"
                  : "#f97316"
          }`,

        boxShadow:
          "0 12px 30px rgba(0,0,0,.16)",
      }}
    >

      {/* =================================================
          HEADER
          ================================================= */}

      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "flex-start",

          gap:
            10,
        }}
      >

        <div
          style={{
            minWidth:
              0,
          }}
        >

          <div
            style={{
              fontSize:
                12,

              fontWeight:
                800,

              color:
                "#f97316",

              letterSpacing:
                0.4,

              textTransform:
                "uppercase",
            }}
          >
            {trackingLabel}
          </div>


          <div
            style={{
              marginTop:
                4,

              fontSize:
                16,

              fontWeight:
                800,

              overflow:
                "hidden",

              textOverflow:
                "ellipsis",

              whiteSpace:
                "nowrap",
            }}
          >
            {
              order.customer_name
            }
          </div>

        </div>


        <div
          style={{
            display:
              "flex",

            flexDirection:
              "column",

            alignItems:
              "flex-end",

            gap:
              5,

            flexShrink:
              0,
          }}
        >

          <div
            style={{
              display:
                "flex",

              gap:
                6,
            }}
          >

            <span
              className="
                wolf-badge
                wolf-badge-neutral
              "
            >

              {isDelivery ? (
                <Truck
                  size={12}
                />
              ) : (
                <ShoppingBag
                  size={12}
                />
              )}

              {
                isDelivery
                  ? "Delivery"
                  : "Pickup"
              }

            </span>

          </div>


          <div
            style={{
              display:
                "flex",

              alignItems:
                "center",

              gap:
                5,

              color:
                colors.textSecondary,

              fontSize:
                11,

              fontWeight:
                700,
            }}
          >

            <StatusIcon
              size={11}
            />

            {
              getStatusLabel(
                order.status
              )
            }

          </div>


          {elapsed && (
            <span
              style={{
                fontSize:
                  11,

                fontWeight:
                  700,

                color:
                  colors.textSecondary,
              }}
            >
              {elapsed}
            </span>
          )}

        </div>

      </div>


      {/* =================================================
          CONTACTO
          ================================================= */}

      {(order.customer_phone ||
        order.customer_email ||
        order.delivery_address ||
        order.payment_method) && (

        <div
          style={{
            display:
              "flex",

            flexDirection:
              "column",

            gap:
              5,
          }}
        >

          {order.customer_phone && (
            <div
              className="
                wolf-client-line
              "
            >
              <Phone
                size={13}
              />

              {
                order.customer_phone
              }
            </div>
          )}


          {order.customer_email && (
            <div
              className="
                wolf-client-line
              "
            >
              <Mail
                size={13}
              />

              {
                order.customer_email
              }
            </div>
          )}


          {isDelivery &&
            order.delivery_address && (

            <div
              className="
                wolf-client-line
              "
              style={{
                alignItems:
                  "flex-start",
              }}
            >

              <MapPin
                size={13}
                style={{
                  marginTop:
                    1,

                  flexShrink:
                    0,
                }}
              />

              <span>
                {
                  order.delivery_address
                }
              </span>

            </div>
          )}


          {order.payment_method && (
            <div
              className="
                wolf-client-line
              "
            >

              <CreditCard
                size={13}
              />

              {
                order.payment_method
              }

            </div>
          )}

        </div>
      )}


      {/* =================================================
          PRODUCTOS
          ================================================= */}

      <div
        style={{
          display:
            "flex",

          flexDirection:
            "column",

          gap:
            5,
        }}
      >

        <div
          style={{
            display:
              "flex",

            justifyContent:
              "space-between",

            alignItems:
              "center",

            marginBottom:
              2,
          }}
        >

          <span
            style={{
              fontSize:
                11,

              fontWeight:
                800,

              color:
                colors.textSecondary,

              textTransform:
                "uppercase",

              letterSpacing:
                ".08em",
            }}
          >
            Pedido
          </span>


          <span
            style={{
              fontSize:
                10,

              fontWeight:
                700,

              color:
                colors.textSecondary,
            }}
          >
            {
              (
                order.order_items ??
                []
              ).length
            }{" "}
            producto
            {
              (
                order.order_items ??
                []
              ).length ===
              1
                ? ""
                : "s"
            }
          </span>

        </div>


        <WolfOrderProducts
          order={
            customerOrder
          }
        />

      </div>


      {/* =================================================
          DELIVERY
          ================================================= */}

      {isDelivery && (
        <div
          style={{
            display:
              "flex",

            justifyContent:
              "flex-end",
          }}
        >

          {delivery.isFree && (
            <span
              className="
                wolf-badge
              "
              style={{
                background:
                  "rgba(34,197,94,.15)",

                color:
                  "#22c55e",
              }}
            >
              🟢 Delivery gratis
            </span>
          )}


          {delivery.isManual &&
            !delivery.isFree && (
            <span
              className="
                wolf-badge
              "
              style={{
                background:
                  "rgba(249,115,22,.15)",

                color:
                  "#f97316",
              }}
            >
              🟠 Manual
            </span>
          )}


          {!delivery.isManual &&
            !delivery.isFree && (
            <span
              className="
                wolf-badge
                wolf-badge-neutral
            "
            >
              {
                delivery.label
              }
            </span>
          )}

        </div>
      )}


      {/* =================================================
          DETALLE DEL PAGO
          ================================================= */}

      <div
        className="
          wolf-summary
        "
      >

        <div
          style={{
            marginBottom:
              8,

            fontSize:
              10,

            fontWeight:
              800,

            color:
              colors.textSecondary,

            textTransform:
              "uppercase",

            letterSpacing:
              ".1em",
          }}
        >
          Detalle del pago
        </div>


        <div
          className="
            wolf-summary-row
          "
        >

          <span
            className="
              wolf-summary-label
            "
          >
            Cliente
          </span>

          <span
            className="
              wolf-summary-value
            "
          >
            {money(
              clientTotal
            )}
          </span>

        </div>


        <div
          className="
            wolf-summary-row
          "
        >

          <span
            className="
              wolf-summary-label
            "
          >
            Comisión Wolf
          </span>

          <span
            className="
              wolf-summary-value
            "
            style={{
              color:
                "#60a5fa",
            }}
          >
            {money(
              commissionAmount
            )}
          </span>

        </div>


        <div
          className="
            wolf-summary-row
          "
        >

          <span
            className="
              wolf-summary-label
            "
          >
            Restaurante
          </span>

          <span
            className="
              wolf-summary-value
            "
            style={{
              color:
                "#4ade80",
            }}
          >
            {money(
              restaurantAmount
            )}
          </span>

        </div>

      </div>


      {/* =================================================
          TOTAL
          ================================================= */}

      <div
        style={{
          display:
            "flex",

          justifyContent:
            "space-between",

          alignItems:
            "center",

          paddingTop:
            2,
        }}
      >

        <span
          style={{
            fontSize:
              12,

            color:
              colors.textSecondary,

            fontWeight:
              800,

            textTransform:
              "uppercase",

            letterSpacing:
              ".08em",
          }}
        >
          Total
        </span>


        <span
          style={{
            fontSize:
              21,

            fontWeight:
              900,

            color:
              "#f97316",

            letterSpacing:
              "-.02em",
          }}
        >
          {money(
            clientTotal
          )}
        </span>

      </div>


      {/* =================================================
          ACCIÓN PRINCIPAL
          ================================================= */}

      {primaryAction ? (

        <WolfButton
          type="button"
          fullWidth
          variant="primary"

          onClick={
            handleStatusUpdate
          }

          style={{
            ...getActionButtonStyle(
              statusTheme,
              order.status
            ),

            display:
              "flex",

            alignItems:
              "center",

            justifyContent:
              "center",

            gap:
              8,

            minHeight:
              46,

            transition:
              "background .25s ease, box-shadow .25s ease, transform .18s ease",
          }}
        >

          <primaryAction.icon
            size={16}
          />

          {
            primaryAction.label
          }

        </WolfButton>

      ) : (

        <div
          className="
            wolf-completed-note
          "
        >

          <CheckCheck
            size={14}
          />

          {
            order.status ===
            "completed"
              ? "Pedido completado"
              : "Pedido cancelado"
          }

        </div>

      )}


      {/* =================================================
          ACCIONES SECUNDARIAS
          ================================================= */}

      <div
        className="
          wolf-secondary-row
        "
      >

        <button
          type="button"

          className={
            `wolf-secondary-action${
              order.payment_status ===
              "paid"
                ? " is-positive"
                : ""
            }`
          }

          onClick={() =>
            onUpdatePayment(
              order.id,
              "paid"
            )
          }
        >

          <CreditCard
            size={13}
          />

          {
            order.payment_status ===
            "paid"
              ? "Pagado"
              : "Marcar pagado"
          }

        </button>


        <button
          type="button"

          className="
            wolf-secondary-action
          "

          onClick={() =>
            onViewDetail(
              order.id
            )
          }
        >
          Ver detalle →
        </button>

      </div>

    </motion.article>
  );
}