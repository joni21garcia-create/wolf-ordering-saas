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

export default async function FinancePage({ params }: Props) {
  const { id } = await params;

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("restaurant_id", id)
    .eq("status", "completed");

  const { data: liquidation } = await supabase
    .from("liquidations")
    .select("*")
    .eq("restaurant_id", id)
    .order("year", { ascending: false })
    .order("month", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: invoice } = await supabase
    .from("wolf_invoices")
    .select("*")
    .eq("liquidation_id", liquidation?.id)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: liquidations } = await supabase
    .from("liquidations")
    .select("*")
    .eq("restaurant_id", id)
    .order("year", { ascending: false })
    .order("month", { ascending: false });

  const financial = buildFinancialMetrics(
    orders ?? [],
    liquidation
  );

  const salesToday = financial.sales.today;
  const salesWeek = financial.sales.week;
  const salesMonth = financial.sales.month;

  const wolfToday = financial.wolf.today;
  const wolfWeek = financial.wolf.week;
  const wolfMonth = financial.wolf.month;

  const restaurantToday = financial.restaurant.today;
  const restaurantWeek = financial.restaurant.week;
  const restaurantMonth = financial.restaurant.month;

  const totalOrders = financial.totalOrders;
  const averageTicket = financial.averageTicket;

  const healthItems = [
    {
      title: "Liquidación",
      status: liquidation ? "ok" : "warning",
    },
    {
      title: "Invoice",
      status: invoice ? "ok" : "warning",
    },
    {
      title: "Analytics",
      status: orders?.length ? "ok" : "warning",
    },
    {
      title: "Pedidos",
      status: totalOrders > 0 ? "ok" : "warning",
    },
    {
      title: "Comisiones",
      status: wolfMonth > 0 ? "ok" : "warning",
    },
  ] as const;

  const currentPeriod = liquidation
    ? `${liquidation.month}/${liquidation.year}`
    : "Sin liquidación";

  const currentStatus = liquidation?.status ?? "pending";

  const nextCutoff = "Fin de mes";

  const nextPayment =
    currentStatus === "paid"
      ? "Pagado"
      : "Pendiente";

  return (
    <PermissionGuard permission="finance">
      <main className="finance-page">
        <style>{`
          .finance-page {
            min-height: 100vh;
            background:
              radial-gradient(
                circle at top right,
                #351400 0%,
                #050505 45%
              );
            color: #fff;
          }

          .finance-shell {
            width: 100%;
            max-width: 1700px;
            margin: 0 auto;
            padding: 28px clamp(12px, 3vw, 28px) 60px;
            box-sizing: border-box;
          }

          .finance-nav {
            position: sticky;
            top: 10px;
            z-index: 40;
            display: flex;
            align-items: center;
            gap: 6px;
            width: 100%;
            margin: 0 0 24px;
            padding: 5px;
            overflow-x: auto;
            scrollbar-width: none;
            box-sizing: border-box;
            border: 1px solid rgba(255,255,255,.07);
            border-radius: 16px;
            background: rgba(8,8,8,.84);
            backdrop-filter: blur(18px);
            -webkit-backdrop-filter: blur(18px);
          }

          .finance-nav::-webkit-scrollbar {
            display: none;
          }

          .finance-chip {
            flex: 0 0 auto;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            min-height: 38px;
            padding: 0 14px;
            border-radius: 11px;
            border: 1px solid transparent;
            color: #858585;
            text-decoration: none;
            font-size: 11px;
            font-weight: 800;
            white-space: nowrap;
            transition:
              color .18s ease,
              background .18s ease,
              border-color .18s ease;
          }

          .finance-chip:hover {
            color: #fff;
            background: rgba(255,255,255,.045);
          }

          .finance-chip.primary {
            color: #fff;
            background: rgba(249,115,22,.12);
            border-color: rgba(249,115,22,.18);
          }

          .finance-group {
            margin: 0 0 12px;
            scroll-margin-top: 78px;
            border: 1px solid rgba(255,255,255,.065);
            border-radius: 18px;
            background: rgba(255,255,255,.018);
            overflow: hidden;
          }

          .finance-group > summary {
            list-style: none;
            cursor: pointer;
            user-select: none;
            display: flex;
            align-items: center;
            justify-content: space-between;
            gap: 14px;
            min-height: 56px;
            padding: 0 16px;
            box-sizing: border-box;
          }

          .finance-group > summary::-webkit-details-marker {
            display: none;
          }

          .summary-main {
            min-width: 0;
            display: flex;
            align-items: center;
            gap: 10px;
          }

          .summary-icon {
            width: 30px;
            height: 30px;
            flex: 0 0 30px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            border-radius: 9px;
            background: rgba(255,255,255,.04);
            border: 1px solid rgba(255,255,255,.06);
          }

          .summary-title {
            min-width: 0;
            color: #fff;
            font-size: 12px;
            font-weight: 800;
          }

          .summary-subtitle {
            margin-top: 2px;
            color: #777;
            font-size: 10px;
          }

          .summary-chevron {
            color: #666;
            font-size: 14px;
            transition: transform .18s ease;
          }

          .finance-group[open] .summary-chevron {
            transform: rotate(180deg);
          }

          .group-content {
            padding: 0 14px 16px;
            border-top: 1px solid rgba(255,255,255,.05);
          }

          .finance-group > .group-content > section:first-child {
            margin-top: 14px !important;
          }

          .finance-group > .group-content > section:last-child {
            margin-bottom: 4px !important;
          }

          .finance-group > .group-content > section {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }

          @media (max-width: 560px) {
            .finance-shell {
              padding: 12px 10px 36px;
            }

            .finance-nav {
              top: 7px;
              margin-bottom: 16px;
              border-radius: 14px;
            }

            .finance-chip {
              min-height: 36px;
              padding: 0 12px;
              font-size: 10px;
            }

            .finance-group {
              border-radius: 15px;
              margin-bottom: 9px;
            }

            .finance-group > summary {
              min-height: 52px;
              padding: 0 12px;
            }

            .summary-icon {
              width: 28px;
              height: 28px;
              flex-basis: 28px;
            }

            .summary-title {
              font-size: 11px;
            }

            .summary-subtitle {
              font-size: 9px;
            }

            .group-content {
              padding: 0 9px 10px;
            }
          }
        `}</style>

        <div className="finance-shell">
          <FinanceHeader restaurant={restaurant} />

          <nav
            className="finance-nav"
            aria-label="Secciones financieras"
          >
            <a
              href="#finance-overview"
              className="finance-chip primary"
            >
              📊 Resumen
            </a>

            <a
              href="#finance-wolf"
              className="finance-chip"
            >
              🐺 Wolf
            </a>

            <a
              href="#finance-restaurant"
              className="finance-chip"
            >
              🏪 Restaurante
            </a>

            <a
              href="#finance-liquidation"
              className="finance-chip"
            >
              💳 Liquidación
            </a>

            <a
              href="#finance-actions"
              className="finance-chip"
            >
              ⚙ Acciones
            </a>

            <a
              href="#finance-history"
              className="finance-chip"
            >
              📜 Historial
            </a>
          </nav>

          <details
            id="finance-overview"
            className="finance-group"
            open
          >
            <summary>
              <span className="summary-main">
                <span className="summary-icon">📊</span>
                <span>
                  <span className="summary-title">
                    Resumen financiero
                  </span>
                  <span className="summary-subtitle">
                    Ventas, pedidos y rendimiento general
                  </span>
                </span>
              </span>

              <span className="summary-chevron">⌄</span>
            </summary>

            <div className="group-content">
              <FinanceOverview
                salesToday={salesToday}
                salesWeek={salesWeek}
                salesMonth={salesMonth}
                totalOrders={totalOrders}
                averageTicket={averageTicket}
              />

              <FinanceAnalyticsSummary
                sales={salesMonth}
                wolf={wolfMonth}
                restaurant={restaurantMonth}
                orders={totalOrders}
                averageTicket={averageTicket}
              />

              <FinanceHealthCard items={healthItems} />
            </div>
          </details>

          <details
            id="finance-wolf"
            className="finance-group"
          >
            <summary>
              <span className="summary-main">
                <span className="summary-icon">🐺</span>
                <span>
                  <span className="summary-title">
                    Wolf Revenue
                  </span>
                  <span className="summary-subtitle">
                    Ingresos y comisiones de Wolf
                  </span>
                </span>
              </span>

              <span className="summary-chevron">⌄</span>
            </summary>

            <div className="group-content">
              <FinanceRevenueSection
                today={wolfToday}
                week={wolfWeek}
                month={wolfMonth}
              />
            </div>
          </details>

          <details
            id="finance-restaurant"
            className="finance-group"
          >
            <summary>
              <span className="summary-main">
                <span className="summary-icon">🏪</span>
                <span>
                  <span className="summary-title">
                    Ganancia del restaurante
                  </span>
                  <span className="summary-subtitle">
                    Ingresos del restaurante por período
                  </span>
                </span>
              </span>

              <span className="summary-chevron">⌄</span>
            </summary>

            <div className="group-content">
              <FinanceRestaurantSection
                today={restaurantToday}
                week={restaurantWeek}
                month={restaurantMonth}
              />
            </div>
          </details>

          <details
            id="finance-liquidation"
            className="finance-group"
          >
            <summary>
              <span className="summary-main">
                <span className="summary-icon">💳</span>
                <span>
                  <span className="summary-title">
                    Liquidación e invoice
                  </span>
                  <span className="summary-subtitle">
                    Estado, período y documento oficial
                  </span>
                </span>
              </span>

              <span className="summary-chevron">⌄</span>
            </summary>

            <div className="group-content">
              <FinanceStatusCard
                currentStatus={currentStatus}
                currentPeriod={currentPeriod}
                nextCutoff={nextCutoff}
                nextPayment={nextPayment}
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
            </div>
          </details>

          <details
            id="finance-actions"
            className="finance-group"
          >
            <summary>
              <span className="summary-main">
                <span className="summary-icon">⚙</span>
                <span>
                  <span className="summary-title">
                    Acciones financieras
                  </span>
                  <span className="summary-subtitle">
                    Generar y administrar la liquidación
                  </span>
                </span>
              </span>

              <span className="summary-chevron">⌄</span>
            </summary>

            <div className="group-content">
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
            </div>
          </details>

          <details
            id="finance-history"
            className="finance-group"
          >
            <summary>
              <span className="summary-main">
                <span className="summary-icon">📜</span>
                <span>
                  <span className="summary-title">
                    Historial
                  </span>
                  <span className="summary-subtitle">
                    Liquidaciones anteriores del restaurante
                  </span>
                </span>
              </span>

              <span className="summary-chevron">⌄</span>
            </summary>

            <div className="group-content">
              <FinanceHistoryTable
                liquidations={liquidations ?? []}
                currentId={liquidation?.id}
              />
            </div>
          </details>

          <FinanceFooter />
        </div>
      </main>
    </PermissionGuard>
  );
}