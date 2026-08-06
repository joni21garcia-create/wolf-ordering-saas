"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/client";

import SalesHero from "./components/SalesHero";
import SalesAccordion from "./components/SalesAccordion";
import TopProducts from "./components/TopProducts";
import PaymentMethods from "./components/PaymentMethods";
import SalesInsights from "./components/SalesInsights";
import SalesHeader from "./components/SalesHeader";
import SalesSkeleton from "./components/SalesSkeleton";
import SalesTransition from "./components/SalesTransition";


interface Props {
  restaurant: any;
}

export type SalesPeriod =
  | "today"
  | "week"
  | "month";

interface ProductResume {
  id: string;
  name: string;
  image_url: string | null;
  quantity: number;
  revenue: number;
}

interface PaymentResume {
  method: string;
  total: number;
  orders: number;
}

export default function SalesClient({
  restaurant,
}: Props) {

  /*
  ==========================================================
  STATES
  ==========================================================
  */

  const [period, setPeriod] =
    useState<SalesPeriod>("today");

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [orders, setOrders] =
    useState<any[]>([]);

  /*
  ==========================================================
  LOAD SALES
  ==========================================================
  */

  useEffect(() => {

    let active = true;

    async function loadSales() {

      setLoading(true);

      setError(null);

      const { data, error } =
        await supabase

          .from("orders")

          .select(`
            *,
            order_items(
              quantity,
              subtotal,
              unit_price,
              products(
                id,
                restaurant_id,
                name,
                image_url
              )
            )
          `)

          .eq(
            "restaurant_id",
            restaurant.id
          )

          .eq(
            "status",
            "completed"
          )

          .order(
            "created_at",
            {
              ascending: true,
            }
          );

      if (!active) return;

      if (error) {

        console.error(error);

        setError(
          "No se pudieron cargar las ventas."
        );

        setLoading(false);

        return;

      }

      setOrders(data ?? []);

      setLoading(false);

    }

    loadSales();

    return () => {

      active = false;

    };

  }, [restaurant.id]);

  /*
  ==========================================================
  FILTER PERIOD
  ==========================================================
  */

  const filteredOrders =
    useMemo(() => {

      const now = new Date();

      return orders.filter(order => {

        const created =
          new Date(order.created_at);

        switch (period) {

          case "today":

            return (
              created.toDateString() ===
              now.toDateString()
            );

          case "week": {

            const first =
              new Date(now);

            first.setDate(
              now.getDate() - 6
            );

            return created >= first;

          }

          case "month":

            return (

              created.getMonth() ===
                now.getMonth()

              &&

              created.getFullYear() ===
                now.getFullYear()

            );

          default:

            return true;

        }

      });

    }, [
      orders,
      period,
    ]);

  /*
  ==========================================================
  KPIs
  ==========================================================
  */
 /*
==========================================================
GENERAL
==========================================================
*/

const totalSales = useMemo(() => {

  return filteredOrders.reduce(
    (sum, order) =>
      sum + Number(order.total ?? 0),
    0
  );

}, [filteredOrders]);

const totalOrders =
  filteredOrders.length;

const averageTicket =
  useMemo(() => {

    if (!totalOrders) return 0;

    return totalSales / totalOrders;

  }, [
    totalSales,
    totalOrders,
  ]);

const wolfCommission =
  useMemo(() => {

    return filteredOrders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.commission_amount ?? 0
        ),
      0
    );

  }, [filteredOrders]);

const restaurantRevenue =
  useMemo(() => {

    return filteredOrders.reduce(
      (sum, order) =>
        sum +
        Number(
          order.restaurant_amount ?? 0
        ),
      0
    );

  }, [filteredOrders]);

/*
==========================================================
TOP PRODUCTS
==========================================================
*/

const topProducts =
  useMemo(() => {

    const map =
      new Map<
        string,
        ProductResume
      >();

    filteredOrders.forEach(order => {

      order.order_items?.forEach(
        (item: any) => {

          const product =
            item.products;

          if (!product) return;

          if (
            product.restaurant_id !==
            restaurant.id
          ) {
            return;
          }

          const current =
            map.get(product.id);

          if (current) {

            current.quantity +=
              Number(item.quantity);

            current.revenue +=
              Number(item.subtotal);

          } else {

            map.set(product.id, {

              id: product.id,

              name: product.name,

              image_url:
                product.image_url,

              quantity:
                Number(item.quantity),

              revenue:
                Number(item.subtotal),

            });

          }

        }
      );

    });

    return [...map.values()]

      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      )

      .slice(0, 5);

  }, [
    filteredOrders,
    restaurant.id,
  ]);

/*
==========================================================
PAYMENTS
==========================================================
*/

const paymentMethods =
  useMemo(() => {

    const map =
      new Map<
        string,
        PaymentResume
      >();

    filteredOrders.forEach(order => {

      const method =
        order.payment_method ??
        "Otro";

      const current =
        map.get(method);

      if (current) {

        current.orders++;

        current.total +=
          Number(order.total);

      } else {

        map.set(method, {

          method,

          total:
            Number(order.total),

          orders: 1,

        });

      }

    });

    return [...map.values()]

      .sort(
        (a, b) =>
          b.total - a.total
      );

  }, [filteredOrders]);

/*
==========================================================
CHART
==========================================================
*/

const chartData =
  useMemo(() => {

    const map =
      new Map<
        string,
        number
      >();

    filteredOrders.forEach(order => {

      const date =
        new Date(
          order.created_at
        );

      let label = "";

      switch (period) {

        case "today":

          label =
            date
              .getHours()
              .toString()
              .padStart(2, "0") +
            ":00";

          break;

        default:

          label =
            date.toLocaleDateString(
              "es-EC",
              {
                day: "2-digit",
                month: "short",
              }
            );

      }

      map.set(

        label,

        (map.get(label) ?? 0) +

          Number(order.total)

      );

    });

    return [...map.entries()]

      .map(
        ([label, value]) => ({
          label,
          value,
        })
      );

  }, [
    filteredOrders,
    period,
  ]);

/*
==========================================================
INSIGHTS
==========================================================
*/

const bestProduct =
  topProducts[0] ?? null;

const bestPayment =
  paymentMethods[0] ?? null;

/*
==========================================================
LOADING
==========================================================
*/

if (loading) {

  return <SalesSkeleton />;

}

if (error) {

  return (
    <div
      style={{
        padding: 60,
        color: "#ef4444",
      }}
    >
      {error}
    </div>
  );

}

/*
==========================================================
RENDER
==========================================================
*/

return (

  <SalesTransition
    transitionKey={period}
  >

    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 30,
        paddingBottom: 80,
      }}
    >

      <SalesHeader
        restaurant={restaurant}
        period={period}
        loading={loading}
        onPeriodChange={setPeriod}
      />

      <SalesHero
        totalSales={totalSales}
        totalOrders={totalOrders}
        averageTicket={averageTicket}
        wolfCommission={wolfCommission}
        chartData={chartData}
      />

      <SalesAccordion
        title="🍔 Productos más vendidos"
        subtitle={
          bestProduct
            ? `${bestProduct.name} lidera las ventas`
            : "Sin productos vendidos"
        }
        defaultOpen
      >

        <TopProducts
          products={topProducts}
        />

      </SalesAccordion>

      <SalesAccordion
        title="💳 Métodos de pago"
        subtitle={
          bestPayment
            ? `${bestPayment.method.toUpperCase()} es el más utilizado`
            : "Sin información"
        }
      >

        <PaymentMethods
          methods={paymentMethods}
        />

      </SalesAccordion>

      <SalesAccordion
        title="📈 Insights"
        subtitle="Resumen ejecutivo"
      >

        <SalesInsights
          totalSales={totalSales}
          totalOrders={totalOrders}
          averageTicket={averageTicket}
          restaurantRevenue={restaurantRevenue}
          wolfCommission={wolfCommission}
          bestProduct={bestProduct}
          bestPayment={bestPayment}
        />

      </SalesAccordion>

    </div>

  </SalesTransition>

);

}