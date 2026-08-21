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
  const { restaurantId } = await params;
  const filters = await searchParams;

  const from = filters.from;
  const to = filters.to;

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: restaurantUser, error: restaurantError } = await supabase
    .from("restaurant_users")
    .select(`
      restaurant_id,
      auth_user_id
    `)
    .eq("auth_user_id", user.id)
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (restaurantError || !restaurantUser) {
    redirect("/403");
  }

  const hasPermission = await checkPermission(
    restaurantUser.auth_user_id,
    "analytics"
  );

  if (!hasPermission) {
    redirect("/403");
  }

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
    .eq("restaurant_id", restaurantUser.restaurant_id)
    .eq("status", "completed");

  if (from) {
    query = query.gte("created_at", `${from}T00:00:00`);
  }

  if (to) {
    query = query.lte("created_at", `${to}T23:59:59`);
  }

  const { data: orders, error } = await query;

  if (error) {
    console.error(error);
    redirect("/error");
  }

  const safeOrders = orders ?? [];

  const salesTotal = safeOrders.reduce(
    (acc, order) => acc + Number(order.total ?? 0),
    0
  );

  const wolfTotal = safeOrders.reduce(
    (acc, order) => acc + Number(order.wolf_amount ?? 0),
    0
  );

  const restaurantTotal = safeOrders.reduce(
    (acc, order) => acc + Number(order.restaurant_amount ?? 0),
    0
  );

  const totalOrders = safeOrders.length;

  const avgTicket =
    totalOrders === 0 ? 0 : salesTotal / totalOrders;

  const cashOrders = safeOrders.filter(
    (o) => o.payment_method === "cash"
  ).length;

  const qrOrders = safeOrders.filter(
    (o) => o.payment_method === "qr"
  ).length;

  const transferOrders = safeOrders.filter(
    (o) => o.payment_method === "transfer"
  ).length;

  const cardOrders = safeOrders.filter(
    (o) => o.payment_method === "card"
  ).length;

  const deliveryOrders = safeOrders.filter(
    (o) => o.order_type === "delivery"
  ).length;

  const pickupOrders = safeOrders.filter(
    (o) => o.order_type === "pickup"
  ).length;

  const dineInOrders = safeOrders.filter(
    (o) => o.order_type === "dinein"
  ).length;

  const pendingOrders = safeOrders.filter(
    (o) => o.status === "pending"
  ).length;

  const acceptedOrders = safeOrders.filter(
    (o) => o.status === "accepted"
  ).length;

  const preparingOrders = safeOrders.filter(
    (o) => o.status === "preparing"
  ).length;

  const readyOrders = safeOrders.filter(
    (o) => o.status === "ready"
  ).length;

  const outForDeliveryOrders = safeOrders.filter(
    (o) => o.status === "out_for_delivery"
  ).length;

  const completedOrders = safeOrders.filter(
    (o) => o.status === "completed"
  ).length;

  const cancelledOrders = safeOrders.filter(
    (o) => o.status === "cancelled"
  ).length;

  const chartMap = new Map<
    string,
    {
      day: string;
      sales: number;
      orders: number;
    }
  >();

  for (const order of safeOrders) {
    const day = new Date(order.created_at).toLocaleDateString();

    if (!chartMap.has(day)) {
      chartMap.set(day, {
        day,
        sales: 0,
        orders: 0,
      });
    }

    const current = chartMap.get(day)!;

    current.sales += Number(order.total ?? 0);
    current.orders++;
  }

  const chartData = Array.from(chartMap.values());

  const hoursMap = new Map<string, number>();

  for (const order of safeOrders) {
    const hour = new Date(order.created_at).getHours();

    const key = `${hour.toString().padStart(2, "0")}:00`;

    hoursMap.set(
      key,
      (hoursMap.get(key) ?? 0) + 1
    );
  }

  const peakHours = Array.from(hoursMap.entries())
    .map(([hour, total]) => ({
      hour,
      total,
    }))
    .sort((a, b) => a.hour.localeCompare(b.hour));

  const productsMap = new Map<
    string,
    {
      name: string;
      quantity: number;
      sales: number;
    }
  >();

  for (const order of safeOrders) {
    for (const item of order.order_items ?? []) {
      const name = item.products?.name ?? "Producto";

      if (!productsMap.has(name)) {
        productsMap.set(name, {
          name,
          quantity: 0,
          sales: 0,
        });
      }

      const current = productsMap.get(name)!;

      current.quantity += Number(item.quantity ?? 0);
      current.sales += Number(item.subtotal ?? 0);
    }
  }

  const topProducts = Array.from(productsMap.values())
    .sort((a, b) => b.quantity - a.quantity)
    .slice(0, 10);

  return (
    <main className="analytics-page">
      <style>{`
        .analytics-page {
          min-height: 100vh;
          padding: 24px clamp(14px, 3vw, 32px) 40px;
          background:
            radial-gradient(
              circle at top right,
              #331300 0%,
              #050505 45%
            );
          color: #fff;
          box-sizing: border-box;
        }

        .analytics-shell {
          width: 100%;
          max-width: 1800px;
          margin: 0 auto;
        }

        .analytics-tabs {
          position: relative;
          width: 100%;
          margin: 0 0 20px;
        }

        .tab-input {
          position: absolute;
          width: 1px;
          height: 1px;
          opacity: 0;
          pointer-events: none;
        }

        .tabs-labels {
          display: flex;
          align-items: center;
          gap: 6px;
          width: 100%;
          box-sizing: border-box;
          padding: 5px;
          overflow-x: auto;
          scrollbar-width: none;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 17px;
          background: rgba(10,10,10,.82);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }

        .tabs-labels::-webkit-scrollbar {
          display: none;
        }

        .tab-label {
          flex: 0 0 auto;
          min-height: 40px;
          padding: 0 16px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          color: #858585;
          font-size: 12px;
          font-weight: 750;
          white-space: nowrap;
          cursor: pointer;
          transition:
            color .18s ease,
            background .18s ease,
            box-shadow .18s ease;
        }

        .tab-label:hover {
          color: #fff;
          background: rgba(255,255,255,.04);
        }

        #tab-overview:checked ~ .tabs-labels label[for="tab-overview"],
        #tab-sales:checked ~ .tabs-labels label[for="tab-sales"],
        #tab-operation:checked ~ .tabs-labels label[for="tab-operation"] {
          color: #fff;
          background:
            linear-gradient(
              180deg,
              rgba(249,115,22,.20),
              rgba(249,115,22,.08)
            );
          box-shadow:
            inset 0 0 0 1px rgba(249,115,22,.18);
        }

        .tab-content {
          display: none;
          animation: analyticsFade .2s ease;
        }

        .overview-content {
          display: none;
        }

        .sales-content,
        .operation-content {
          display: none;
        }

        .analytics-shell:has(#tab-overview:checked) .overview-content {
          display: block;
        }

        .analytics-shell:has(#tab-sales:checked) .sales-content {
          display: block;
        }

        .analytics-shell:has(#tab-operation:checked) .operation-content {
          display: block;
        }

        .stack {
          display: grid;
          gap: 18px;
        }

        .two-column {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 18px;
          align-items: start;
        }

        .three-column {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
          align-items: start;
        }

        @keyframes analyticsFade {
          from {
            opacity: 0;
            transform: translateY(3px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 1000px) {
          .two-column,
          .three-column {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .analytics-page {
            padding: 10px 10px 24px;
          }

          .analytics-tabs {
            position: sticky;
            top: 8px;
            z-index: 30;
            margin-left: -2px;
            width: calc(100% + 4px);
          }

          .tabs-labels {
            border-radius: 15px;
          }

          .tab-label {
            min-height: 38px;
            padding: 0 13px;
            font-size: 11px;
          }

          .stack {
            gap: 14px;
          }

          .two-column,
          .three-column {
            gap: 14px;
          }
        }
      `}</style>

      <div className="analytics-shell">
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
          <div className="analytics-tabs">
            <input
              id="tab-overview"
              className="tab-input"
              type="radio"
              name="analytics-tabs"
              defaultChecked
            />

            <input
              id="tab-sales"
              className="tab-input"
              type="radio"
              name="analytics-tabs"
            />

            <input
              id="tab-operation"
              className="tab-input"
              type="radio"
              name="analytics-tabs"
            />

            <div className="tabs-labels">
              <label
                htmlFor="tab-overview"
                className="tab-label"
              >
                Resumen
              </label>

              <label
                htmlFor="tab-sales"
                className="tab-label"
              >
                Ventas
              </label>

              <label
                htmlFor="tab-operation"
                className="tab-label"
              >
                Operación
              </label>
            </div>

            <div className="tab-content overview-content">
              <div className="stack">
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

                <RevenueChart data={chartData} />
              </div>
            </div>

            <div className="tab-content sales-content">
              <div className="stack">
                <ExecutiveSummary
                  salesTotal={salesTotal}
                  wolfTotal={wolfTotal}
                  restaurantTotal={restaurantTotal}
                  avgTicket={avgTicket}
                  totalOrders={totalOrders}
                  deliveryOrders={deliveryOrders}
                  pickupOrders={pickupOrders}
                />

                <div className="two-column">
                  <PaymentMethodsCard
                    cashOrders={cashOrders}
                    qrOrders={qrOrders}
                    transferOrders={transferOrders}
                    cardOrders={cardOrders}
                  />

                  <TopProductsCard products={topProducts} />
                </div>
              </div>
            </div>

            <div className="tab-content operation-content">
              <div className="three-column">
                <OrderTypesCard
                  deliveryOrders={deliveryOrders}
                  pickupOrders={pickupOrders}
                  dineInOrders={dineInOrders}
                />

                <StatusDistributionCard
                  pending={pendingOrders}
                  accepted={acceptedOrders}
                  preparing={preparingOrders}
                  ready={readyOrders}
                  delivery={outForDeliveryOrders}
                  completed={completedOrders}
                  cancelled={cancelledOrders}
                />

                <PeakHoursCard hours={peakHours} />
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}