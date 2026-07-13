import { createSupabaseServerClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

import { checkPermission } from "@/lib/auth/checkPermission";

import AnalyticsHeader from "./components/AnalyticsHeader";
import AnalyticsFilters from "./components/AnalyticsFilters";
import AnalyticsStats from "./components/AnalyticsStats";
import RevenueChart from "./components/RevenueChart";
import PaymentMethodsCard from "./components/PaymentMethodsCard";
import OrderTypesCard from "./components/OrderTypesCard";
import StatusDistributionCard from "./components/StatusDistributionCard";
import PeakHoursCard from "./components/PeakHoursCard";
import TopProductsCard from "./components/TopProductsCard";
import ExecutiveSummary from "./components/ExecutiveSummary";
import AnalyticsEmpty from "./components/AnalyticsEmpty";

export default async function AnalyticsPage({
  params,
  searchParams,
}: {
  params: Promise<{
    restaurantId: string;
  }>;

  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
}) {

  const { restaurantId } =
    await params;

  const filters =
    await searchParams;

  const from = filters.from;

  const to = filters.to;

  const supabase =
    await createSupabaseServerClient();

  /*
  =====================================================
  SESIÓN
  =====================================================
  */

  const {
    data: { user },
  } =
    await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  /*
  =====================================================
  RESTAURANTE
  =====================================================
  */

  const {
    data: restaurantUser,
    error: restaurantError,
  } = await supabase
    .from("restaurant_users")
    .select(`
      restaurant_id,
      auth_user_id
    `)
    .eq("auth_user_id", user.id)
    .eq(
      "restaurant_id",
      restaurantId
    )
    .maybeSingle();

  if (
    restaurantError ||
    !restaurantUser
  ) {
    redirect("/403");
  }

  /*
  =====================================================
  PERMISOS
  =====================================================
  */

  const hasPermission =
    await checkPermission(
      restaurantUser.auth_user_id,
      "analytics"
    );

  if (!hasPermission) {
    redirect("/403");
  }

  /*
  =====================================================
  CONSULTA
  =====================================================
  */

  let query = supabase
    .from("orders")
    .select(`
      *,
      order_items(
        quantity,
        subtotal,
        products(
          name
        )
      )
    `)
    .eq(
      "restaurant_id",
      restaurantUser.restaurant_id
    )
    .eq(
      "status",
      "completed"
    );

  if (from) {
    query = query.gte(
      "created_at",
      `${from}T00:00:00`
    );
  }

  if (to) {
    query = query.lte(
      "created_at",
      `${to}T23:59:59`
    );
  }

  const {
    data: orders,
    error,
  } = await query;

  if (error) {

    console.error(error);

    redirect("/error");

  }

  const safeOrders =
    orders ?? [];
    /*
=====================================================
KPIs PRINCIPALES
=====================================================
*/

const salesTotal = safeOrders.reduce(
  (acc, order) =>
    acc + Number(order.total ?? 0),
  0
);

const wolfTotal = safeOrders.reduce(
  (acc, order) =>
    acc +
    Number(order.wolf_amount ?? 0),
  0
);

const restaurantTotal =
  safeOrders.reduce(
    (acc, order) =>
      acc +
      Number(
        order.restaurant_amount ?? 0
      ),
    0
  );

const totalOrders =
  safeOrders.length;

const avgTicket =
  totalOrders === 0
    ? 0
    : salesTotal / totalOrders;

/*
=====================================================
MÉTODOS DE PAGO
=====================================================
*/

const cashOrders =
  safeOrders.filter(
    (o) =>
      o.payment_method === "cash"
  ).length;

const qrOrders =
  safeOrders.filter(
    (o) =>
      o.payment_method === "qr"
  ).length;

const transferOrders =
  safeOrders.filter(
    (o) =>
      o.payment_method ===
      "transfer"
  ).length;

const cardOrders =
  safeOrders.filter(
    (o) =>
      o.payment_method ===
      "card"
  ).length;

/*
=====================================================
TIPOS DE PEDIDO
=====================================================
*/

const deliveryOrders =
  safeOrders.filter(
    (o) =>
      o.order_type === "delivery"
  ).length;

const pickupOrders =
  safeOrders.filter(
    (o) =>
      o.order_type === "pickup"
  ).length;

const dineInOrders =
  safeOrders.filter(
    (o) =>
      o.order_type === "dinein"
  ).length;

/*
=====================================================
ESTADOS
=====================================================
*/

const pendingOrders =
  safeOrders.filter(
    (o) =>
      o.status === "pending"
  ).length;

const acceptedOrders =
  safeOrders.filter(
    (o) =>
      o.status === "accepted"
  ).length;

const preparingOrders =
  safeOrders.filter(
    (o) =>
      o.status === "preparing"
  ).length;

const readyOrders =
  safeOrders.filter(
    (o) =>
      o.status === "ready"
  ).length;

const outForDeliveryOrders =
  safeOrders.filter(
    (o) =>
      o.status ===
      "out_for_delivery"
  ).length;

const completedOrders =
  safeOrders.filter(
    (o) =>
      o.status === "completed"
  ).length;

const cancelledOrders =
  safeOrders.filter(
    (o) =>
      o.status === "cancelled"
  ).length;

/*
=====================================================
REVENUE CHART
=====================================================
*/

const chartMap = new Map<
  string,
  {
    day: string;
    sales: number;
    orders: number;
  }
>();

for (const order of safeOrders) {

  const day =
    new Date(
      order.created_at
    ).toLocaleDateString();

  if (!chartMap.has(day)) {

    chartMap.set(day, {
      day,
      sales: 0,
      orders: 0,
    });

  }

  const current =
    chartMap.get(day)!;

  current.sales += Number(
    order.total ?? 0
  );

  current.orders++;
}

const chartData =
  Array.from(chartMap.values());

/*
=====================================================
HORAS PICO
=====================================================
*/

const hoursMap =
  new Map<string, number>();

for (const order of safeOrders) {

  const hour =
    new Date(
      order.created_at
    ).getHours();

  const key =
    `${hour
      .toString()
      .padStart(2, "0")}:00`;

  hoursMap.set(
    key,
    (hoursMap.get(key) ?? 0) + 1
  );

}

const peakHours =
  Array.from(
    hoursMap.entries()
  )
    .map(([hour, total]) => ({
      hour,
      total,
    }))
    .sort((a, b) =>
      a.hour.localeCompare(b.hour)
    );

/*
=====================================================
TOP PRODUCTOS
=====================================================
*/

const productsMap =
  new Map<
    string,
    {
      name: string;
      quantity: number;
      sales: number;
    }
  >();

for (const order of safeOrders) {

  for (const item of order.order_items ??
    []) {

    const name =
      item.products?.name ??
      "Producto";

    if (
      !productsMap.has(name)
    ) {

      productsMap.set(name, {
        name,
        quantity: 0,
        sales: 0,
      });

    }

    const current =
      productsMap.get(name)!;

    current.quantity += Number(
      item.quantity ?? 0
    );

    current.sales += Number(
      item.subtotal ?? 0
    );

  }

}

const topProducts =
  Array.from(
    productsMap.values()
  )
    .sort(
      (a, b) =>
        b.quantity - a.quantity
    )
    .slice(0, 10);
    /*
=====================================================
RENDER
=====================================================
*/

return (
  <main
    style={{
      minHeight: "100vh",
      background:
        "radial-gradient(circle at top right,#331300 0%,#050505 45%)",
      padding: "32px 20px",
    }}
  >
    <div
      style={{
        maxWidth: 1800,
        margin: "0 auto",
      }}
    >
      <AnalyticsHeader
        restaurantId={restaurantId}
        totalOrders={totalOrders}
        updatedAt={safeOrders[0]?.created_at}
      />

      <AnalyticsFilters
        from={from}
        to={to}
      />

      {safeOrders.length === 0 ? (
        <AnalyticsEmpty />
      ) : (
        <>
          <AnalyticsStats
            salesTotal={salesTotal}
            wolfTotal={wolfTotal}
            restaurantTotal={restaurantTotal}
            totalOrders={totalOrders}
            avgTicket={avgTicket}
            deliveryOrders={deliveryOrders}
            pickupOrders={pickupOrders}
            cancelledOrders={cancelledOrders}
          />

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "minmax(0,2fr) minmax(340px,1fr)",
              gap: 24,
              alignItems: "start",
              marginBottom: 24,
            }}
          >
            <RevenueChart
              data={chartData}
            />

            <div
              style={{
                display: "grid",
                gap: 24,
              }}
            >
              <PaymentMethodsCard
                cashOrders={cashOrders}
                qrOrders={qrOrders}
                transferOrders={transferOrders}
                cardOrders={cardOrders}
              />

              <OrderTypesCard
                deliveryOrders={
                  deliveryOrders
                }
                pickupOrders={
                  pickupOrders
                }
                dineInOrders={
                  dineInOrders
                }
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(360px,1fr))",
              gap: 24,
              marginBottom: 24,
            }}
          >
            <StatusDistributionCard
              pending={pendingOrders}
              accepted={
                acceptedOrders
              }
              preparing={
                preparingOrders
              }
              ready={readyOrders}
              delivery={
                outForDeliveryOrders
              }
              completed={
                completedOrders
              }
              cancelled={
                cancelledOrders
              }
            />

            <PeakHoursCard
              hours={peakHours}
            />

            <TopProductsCard
              products={topProducts}
            />
          </div>

          <ExecutiveSummary
            salesTotal={salesTotal}
            wolfTotal={wolfTotal}
            restaurantTotal={
              restaurantTotal
            }
            avgTicket={avgTicket}
            totalOrders={
              totalOrders
            }
            deliveryOrders={
              deliveryOrders
            }
            pickupOrders={
              pickupOrders
            }
          />
        </>
      )}
    </div>
  </main>
);
}