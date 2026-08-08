"use client";

import {
  TrendingUp,
  Wallet,
} from "lucide-react";

import type {
  Order,
} from "@/app/admin/orders/[restaurantId]/orders/components/types";

import {
  WolfDivider,
} from "@/lib/wolf-ui";

import {
  WolfFlex,
  WolfStack,
} from "@/lib/wolf-ui/layout";

export interface WolfMoneySummaryProps {

  order: Order;

  showDistribution?: boolean;

}

interface MoneyRowProps {

  label: string;

  value: number;

  strong?: boolean;

  color?: string;

}

function MoneyRow({

  label,

  value,

  strong = false,

  color,

}: MoneyRowProps) {

  return (

    <WolfFlex
      justify="between"
      align="center"
    >

      <span
        style={{
          color:
            strong
              ? "#FFF"
              : "#A1A1AA",

          fontSize:
            strong
              ? 15
              : 13,

          fontWeight:
            strong
              ? 700
              : 500,
        }}
      >

        {label}

      </span>

      <span
        style={{
          color:

            color ??

            (strong
              ? "#F97316"
              : "#E4E4E7"),

          fontWeight:
            strong
              ? 800
              : 700,

          fontSize:
            strong
              ? 18
              : 14,
        }}
      >

        $

        {Number(
          value
        ).toLocaleString()}

      </span>

    </WolfFlex>

  );

}

export default function WolfMoneySummary({

  order,

  showDistribution = false,

}: WolfMoneySummaryProps) {

  const subtotal =
    Number(
      order.subtotal ?? 0
    );

  const deliveryFee =
    Number(
      order.delivery_fee ?? 0
    );

  const total =
    Number(
      order.total ?? 0
    );

  const wolfAmount =
    Number(
      order.wolf_amount ?? 0
    );

  const restaurantAmount =
    Number(
      order.restaurant_amount ?? 0
    );

  return (

    <WolfStack
      gap="md"
    >

      <MoneyRow
        label="Subtotal"
        value={subtotal}
      />

      {deliveryFee > 0 && (

        <MoneyRow
          label="Delivery"
          value={deliveryFee}
        />

      )}

      <WolfDivider />

      <MoneyRow
        label="Total"
        value={total}
        strong
      />

      {showDistribution && (

        <>

          <WolfDivider />

          <WolfStack
            gap="sm"
          >

            <WolfFlex
              align="center"
              gap="sm"
            >

              <TrendingUp
                size={15}
                color="#22C55E"
              />

              <div
                style={{
                  flex: 1,
                }}
              >

                <MoneyRow
                  label="Restaurante"
                  value={
                    restaurantAmount
                  }
                  color="#22C55E"
                />

              </div>

            </WolfFlex>

            <WolfFlex
              align="center"
              gap="sm"
            >

              <Wallet
                size={15}
                color="#3B82F6"
              />

              <div
                style={{
                  flex: 1,
                }}
              >

                <MoneyRow
                  label="Wolf"
                  value={
                    wolfAmount
                  }
                  color="#3B82F6"
                />

              </div>

            </WolfFlex>

          </WolfStack>

        </>

      )}

    </WolfStack>

  );

}