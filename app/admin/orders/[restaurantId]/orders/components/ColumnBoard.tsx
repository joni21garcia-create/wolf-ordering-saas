"use client";

import { motion, AnimatePresence } from "framer-motion";

import {
  WolfBadge,
  WolfCard,
} from "@/lib/wolf-ui";

import {
  WolfFlex,
  WolfStack,
} from "@/lib/wolf-ui/layout";

import OrderCard from "./OrderCard";

import type {
  Order,
} from "./types";

import {
  Clock3,
  ChefHat,
  PackageCheck,
  CircleCheckBig,
} from "lucide-react";

const columnIcons = {

  Pendientes: Clock3,

  Aceptados: ChefHat,

  Preparando: ChefHat,

  Listos: PackageCheck,

  Completados:
    CircleCheckBig,

} as const;

interface Props {

  title: string;

  color: string;

  orders: Order[];

  deliverySettings: {

    delivery_mode:
      | "fixed"
      | "manual";

    delivery_fee: number;

    free_delivery_enabled: boolean;

    free_delivery_minimum: number;

  };

  onUpdateStatus: (

    orderId: string,

    status: string

  ) => Promise<void>;

  onUpdatePayment: (

    orderId: string,

    payment: string

  ) => Promise<void>;

  onRefresh: () => Promise<void>;

  onViewDetail: (

    orderId: string

  ) => void;

}

export default function ColumnBoard({

  title,

  color,

  orders,

  deliverySettings,

  onUpdateStatus,

  onUpdatePayment,

  onRefresh,

  onViewDetail,

}: Props) {

  const Icon =
    columnIcons[
      title as keyof typeof columnIcons
    ] ?? Clock3;

  const subtitle =

    title === "Pendientes"

      ? "Esperando aceptación"

      : title === "Aceptados"

      ? "Esperando cocina"

      : title === "Preparando"

      ? "En preparación"

      : title === "Listos"

      ? "Listos para entregar"

      : "Pedidos finalizados";

  return (

<WolfCard
  variant="glass"
  padding="none"
  style={{
    /*
     * La columna ya no intenta ocupar un ancho
     * arbitrario ni limitar al board.
     *
     * El ancho lo controla el viewport del board.
     */
    flex:
      "0 0 clamp(292px, 82vw, 380px)",

    width:
      "clamp(292px, 82vw, 380px)",

    minWidth:
      "292px",

    maxWidth:
      "380px",

    display:
      "flex",

    flexDirection:
      "column",

    // The board owns scrolling. Columns must grow naturally so a
    // finger gesture over a card is handled by one native scroll surface.
    overflow:
      "visible",

    boxSizing:
      "border-box",

    border:
      "1px solid rgba(255,255,255,.05)",

    backdropFilter:
      "blur(18px)",
  }}
>

      <div

        style={{

          padding:
            "22px 22px 18px",

          borderBottom:
            "1px solid rgba(255,255,255,.05)",

        }}

      >

        <WolfFlex

          justify="between"

          align="center"

        >

          <WolfFlex

            align="center"

            gap="md"

          >

            <div

              style={{

                width: 46,

                height: 46,

                borderRadius: 16,

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                background:
                  `${color}18`,

              }}

            >

              <Icon

                size={22}

                color={color}

              />

            </div>

            <WolfStack
              spacing="xs"
            >

              <div

                style={{

                  fontSize: 22,

                  fontWeight: 800,

                  color: "#fff",

                  letterSpacing:
                    "-.03em",

                }}

              >

                {title}

              </div>

              <div

                style={{

                  fontSize: 13,

                  color:
                    "#8B8B93",

                }}

              >

                {subtitle}

              </div>

            </WolfStack>

          </WolfFlex>

          <WolfBadge
            variant="default"
          >
            {orders.length}
          </WolfBadge>

        </WolfFlex>

      </div>

      <div
        style={{
          padding: 20,
          display: "flex",
          flexDirection: "column",
          gap: 18,
          boxSizing: "border-box",
        }}
      >
              {orders.length === 0 && (

          <WolfCard
            variant="ghost"
            padding="lg"
            style={{
              flex: 1,

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              textAlign: "center",

              color: "#71717A",

              minHeight: 180,
            }}
          >

            <WolfStack
              align="center"
              spacing="sm"
            >

              <div
                style={{
                  width: 56,

                  height: 56,

                  borderRadius: 18,

                  display: "flex",

                  alignItems: "center",

                  justifyContent: "center",

                  background:
                    "rgba(255,255,255,.04)",
                }}
              >

                <Icon
                  size={24}
                  color={color}
                />

              </div>

              <div
                style={{
                  fontWeight: 700,

                  color: "#E4E4E7",

                  fontSize: 15,
                }}
              >

                Sin pedidos

              </div>

              <div
                style={{
                  fontSize: 13,

                  color: "#71717A",

                  maxWidth: 180,

                  lineHeight: 1.5,
                }}
              >

                Los nuevos pedidos aparecerán
                automáticamente aquí.

              </div>

            </WolfStack>

          </WolfCard>

        )}

        <AnimatePresence
          mode="popLayout"
        >

          {orders.map((order) => (

            <motion.div

              key={order.id}

              layout

              initial={{
                opacity: 0,
                y: 14,
                scale: .98,
              }}

              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
              }}

              exit={{
                opacity: 0,
                y: -8,
                scale: .96,
              }}

              transition={{
                duration: .22,
                ease: "easeOut",
              }}

            >

              <OrderCard

                order={order}

                deliverySettings={
                  deliverySettings
                }

                onRefresh={
                  onRefresh
                }

                onViewDetail={
                  onViewDetail
                }

                onUpdateStatus={
                  onUpdateStatus
                }

                onUpdatePayment={
                  onUpdatePayment
                }

              />

            </motion.div>

          ))}

        </AnimatePresence>

      </div>

    </WolfCard>

  );

}