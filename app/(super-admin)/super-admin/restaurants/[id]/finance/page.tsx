import { createClient } from "@supabase/supabase-js";

import PermissionGuard from "@/components/auth/PermissionGuard";

import { buildFinancialMetrics } from "@/lib/analytics/buildFinancialMetrics";

import FinanceHeader from "./components/FinanceHeader";
import FinanceOverview from "./components/FinanceOverview";
import FinanceRevenueSection from "./components/FinanceRevenueSection";
import FinanceRestaurantSection from "./components/FinanceRestaurantSection";
import FinanceAnalyticsSummary from "./components/FinanceAnalyticsSummary";
import FinanceStatusCard from "./components/FinanceStatusCard";
import FinanceHealthCard from "./components/FinanceHealthCard";
import FinanceLiquidationCurrent from "./components/FinanceLiquidationCurrent";
import FinanceLiquidationActions from "./components/FinanceLiquidationActions";
import FinanceInvoiceCard from "./components/FinanceInvoiceCard";
import FinanceHistoryTable from "./components/FinanceHistoryTable";
import FinanceFooter from "./components/FinanceFooter";

import LiquidationActions from "@/components/finance/LiquidationActions";
import GenerateLiquidationButton from "@/components/finance/GenerateLiquidationButton";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Props {
  params: Promise<{
    id: string;
  }>;
}

export default async function FinancePage({
  params,
}: Props) {
  const { id } = await params;



  const { data: restaurant } =
    await supabase
      .from("restaurants")
      .select("*")
      .eq("id", id)
      .maybeSingle();

const { data: orders } =
  await supabase
    .from("orders")
    .select("*")
    .eq("restaurant_id", id)
    .eq("status", "completed");


const {
  data: liquidation,
} = await supabase
  .from("liquidations")
  .select("*")
  .eq("restaurant_id", id)
  .order("year", {
    ascending: false,
  })
  .order("month", {
    ascending: false,
  })
  .limit(1)
  .maybeSingle();



const {
  data: invoice,
} = await supabase
  .from("wolf_invoices")
  .select("*")
  .eq(
    "liquidation_id",
    liquidation?.id
  )
  .order(
    "created_at",
    {
      ascending: false,
    }
  )
  .limit(1)
  .maybeSingle();



const {
  data: liquidations,
} = await supabase
  .from("liquidations")
  .select("*")
  .eq("restaurant_id", id)
  .order("year", {
    ascending: false,
  })
  .order("month", {
    ascending: false,
  });

  const financial =
  buildFinancialMetrics(
    orders ?? [],
    liquidation
  );

const salesToday =
  financial.sales.today;

const salesWeek =
  financial.sales.week;

const salesMonth =
  financial.sales.month;

const wolfToday =
  financial.wolf.today;

const wolfWeek =
  financial.wolf.week;

const wolfMonth =
  financial.wolf.month;

const restaurantToday =
  financial.restaurant.today;

const restaurantWeek =
  financial.restaurant.week;

const restaurantMonth =
  financial.restaurant.month;

const totalOrders =
  financial.totalOrders;

const averageTicket =
  financial.averageTicket;

  const healthItems = [
  {
    title: "Liquidación",
    status: liquidation
      ? "ok"
      : "warning",
  },

  {
    title: "Invoice",
    status: invoice
      ? "ok"
      : "warning",
  },

  {
    title: "Analytics",
    status: orders?.length
      ? "ok"
      : "warning",
  },

  {
    title: "Pedidos",
    status: totalOrders > 0
      ? "ok"
      : "warning",
  },

  {
    title: "Comisiones",
    status:
      wolfMonth > 0
        ? "ok"
        : "warning",
  },
] as const;

const currentPeriod =
  liquidation
    ? `${liquidation.month}/${liquidation.year}`
    : "Sin liquidación";

const currentStatus =
  liquidation?.status ??
  "pending";

const nextCutoff =
  "Fin de mes";

const nextPayment =
  currentStatus === "paid"
    ? "Pagado"
    : "Pendiente";

return (
  <PermissionGuard permission="finance">
    <main
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top right,#351400 0%,#050505 45%)",
        color: "#fff",
      }}
    >
      <div
        style={{
          maxWidth: 1700,
          margin: "0 auto",
          padding: "40px 28px 70px",
        }}
      >
        <FinanceHeader
          restaurant={restaurant}
        />

        <FinanceOverview
          salesToday={salesToday}
          salesWeek={salesWeek}
          salesMonth={salesMonth}
          totalOrders={totalOrders}
          averageTicket={averageTicket}
        />

        <FinanceRevenueSection
          today={wolfToday}
          week={wolfWeek}
          month={wolfMonth}
        />

        <FinanceRestaurantSection
          today={restaurantToday}
          week={restaurantWeek}
          month={restaurantMonth}
        />

        <FinanceAnalyticsSummary
          sales={salesMonth}
          wolf={wolfMonth}
          restaurant={restaurantMonth}
          orders={totalOrders}
          averageTicket={averageTicket}
        />

        <FinanceStatusCard
          currentStatus={currentStatus}
          currentPeriod={currentPeriod}
          nextCutoff={nextCutoff}
          nextPayment={nextPayment}
        />

        <FinanceHealthCard
          items={healthItems}
        />
<FinanceLiquidationCurrent
  liquidation={liquidation}
  sales={salesMonth}
  wolf={wolfMonth}
  restaurant={restaurantMonth}
  orders={totalOrders}
/>

<FinanceInvoiceCard
  invoice={invoice}
  liquidation={liquidation}
/>

<FinanceLiquidationActions>

  <GenerateLiquidationButton
    restaurantId={id}
  />

  {liquidation && (
<LiquidationActions
  liquidationId={liquidation.id}
  status={liquidation.status}
/>
  )}

</FinanceLiquidationActions>

<FinanceHistoryTable
  liquidations={
    liquidations ?? []
  }
  currentId={
    liquidation?.id
  }
/>

<FinanceFooter />
        </div>
    </main>
  </PermissionGuard>
);
}