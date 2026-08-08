"use client";

import type { ReactNode } from "react";

import {
  CreditCard,
  Mail,
  MapPin,
  Phone,
} from "lucide-react";

import type {
  Order,
} from "@/app/admin/orders/[restaurantId]/orders/components/types";

import {
  WolfStack,
} from "@/lib/wolf-ui/layout";

export interface WolfCustomerInfoProps {

  order: Order;

}

interface RowProps {

  icon: ReactNode;

  children: ReactNode;

}

function Row({

  icon,

  children,

}: RowProps) {

  return (

    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,

        padding: "2px 0",

        color: "#D4D4D8",

        fontSize: 13,

        lineHeight: 1.45,
      }}
    >

      <div
        style={{
          width: 18,

          display: "flex",

          justifyContent: "center",

          color: "#71717A",

          flexShrink: 0,

          marginTop: 2,
        }}
      >
        {icon}
      </div>

      <div
        style={{
          flex: 1,

          wordBreak: "break-word",
        }}
      >
        {children}
      </div>

    </div>

  );

}

export default function WolfCustomerInfo({

  order,

}: WolfCustomerInfoProps) {

  const isDelivery =
    order.order_type === "delivery";

  const hasInfo =

    order.customer_phone ||

    order.customer_email ||

    order.payment_method ||

    (isDelivery &&
      order.delivery_address);

  if (!hasInfo)
    return null;

  return (

    <WolfStack
      gap="sm"
    >

      {order.customer_phone && (

        <Row
          icon={
            <Phone size={14} />
          }
        >

          {order.customer_phone}

        </Row>

      )}

      {order.customer_email && (

        <Row
          icon={
            <Mail size={14} />
          }
        >

          {order.customer_email}

        </Row>

      )}

      {isDelivery &&
        order.delivery_address && (

          <Row
            icon={
              <MapPin size={14} />
            }
          >

            {order.delivery_address}

          </Row>

      )}

      {order.payment_method && (

        <Row
          icon={
            <CreditCard
              size={14}
            />
          }
        >

          {order.payment_method}

        </Row>

      )}

    </WolfStack>

  );

}