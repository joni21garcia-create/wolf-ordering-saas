"use client";

import {
  Package2,
} from "lucide-react";

import type {
  Order,
} from "@/app/admin/orders/[restaurantId]/orders/components/types";

import {
  WolfBadge,
} from "@/lib/wolf-ui";

import {
  WolfFlex,
  WolfStack,
} from "@/lib/wolf-ui/layout";

export interface WolfOrderProductsProps {

  order: Order;

}

export default function WolfOrderProducts({

  order,

}: WolfOrderProductsProps) {

  const items =
    order.order_items ?? [];

  if (items.length === 0) {
    return null;
  }

  return (

    <WolfStack
      gap="sm"
    >

      {items.map((item) => (

        <div

          key={item.id}

          style={{

            display: "flex",

            justifyContent:
              "space-between",

            alignItems: "center",

            gap: 18,

            padding: "16px",

            borderRadius: 18,

            background:
              "rgba(255,255,255,.025)",

            border:
              "1px solid rgba(255,255,255,.05)",

            transition:
              "all .25s ease",

          }}

        >

          <WolfFlex
            align="center"
            gap="md"
          >

            <div

              style={{

                width: 42,

                height: 42,

                borderRadius: 14,

                display: "flex",

                alignItems: "center",

                justifyContent:
                  "center",

                background:
                  "rgba(249,115,22,.10)",

                flexShrink: 0,

              }}

            >

              <Package2

                size={18}

                color="#F97316"

              />

            </div>

            <WolfStack
              gap="xs"
            >

              <div

                style={{

                  color: "#FFF",

                  fontWeight: 700,

                  fontSize: 14,

                  lineHeight: 1.2,

                }}

              >

                {item.products?.name ??
                  "Producto"}

              </div>

              <div

                style={{

                  color: "#71717A",

                  fontSize: 12,

                  fontWeight: 500,

                }}

              >

                $

                {Number(
                  item.unit_price
                ).toLocaleString()}

                {" "}c/u

              </div>

            </WolfStack>

          </WolfFlex>

          <WolfStack
            align="end"
            gap="xs"
          >

            <WolfBadge
              variant="orange"
            >

              ×{item.quantity}

            </WolfBadge>

            <div

              style={{

                color: "#FFF",

                fontWeight: 800,

                fontSize: 15,

              }}

            >

              $

              {Number(
                item.subtotal
              ).toLocaleString()}

            </div>

          </WolfStack>

        </div>

      ))}

    </WolfStack>

  );

}