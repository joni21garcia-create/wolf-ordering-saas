"use client";

import {
  Clock3,
  ShoppingBag,
  Truck,
} from "lucide-react";

import type {
  Order,
} from "@/app/admin/orders/[restaurantId]/orders/components/types";

import {
  WolfAvatar,
  WolfBadge,
} from "@/lib/wolf-ui";

import {
  WolfFlex,
  WolfStack,
} from "@/lib/wolf-ui/layout";

export interface WolfOrderHeaderProps {

  order: Order;

  elapsed?: string | null;

}

export default function WolfOrderHeader({

  order,

  elapsed,

}: WolfOrderHeaderProps) {

  const isDelivery =
    order.order_type === "delivery";

  return (

    <WolfFlex
      justify="between"
      align="start"
      gap="lg"
    >

      {/* Cliente */}

      <WolfFlex
        align="center"
        gap="md"
      >

        <WolfAvatar
          size={54}
          name={order.customer_name}
        />

        <WolfStack
          spacing="xs"
        >

          <div
            style={{
              fontSize: 19,
              fontWeight: 800,
              color: "#FFF",
              lineHeight: 1.1,
            }}
          >
            {order.customer_name}
          </div>

          <WolfFlex
            align="center"
            gap="sm"
            wrap
          >

            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: "#F97316",
                letterSpacing: ".08em",
                textTransform:
                  "uppercase",
              }}
            >
              {order.tracking_code ??
                "SIN CÓDIGO"}
            </span>

            <WolfBadge
              variant="default"
            >

              {isDelivery ? (
                <>
                  <Truck
                    size={12}
                  />
                  Delivery
                </>
              ) : (
                <>
                  <ShoppingBag
                    size={12}
                  />
                  Pickup
                </>
              )}

            </WolfBadge>

          </WolfFlex>

        </WolfStack>

      </WolfFlex>

      {/* Tiempo */}

      <WolfFlex
        direction="column"
        align="end"
        gap="xs"
      >

        {elapsed && (

          <WolfBadge
            variant="orange"
          >

            <Clock3
              size={12}
            />

            {elapsed}

          </WolfBadge>

        )}

      </WolfFlex>

    </WolfFlex>

  );

}