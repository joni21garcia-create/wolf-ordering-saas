import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import LiquidationActions from "@/components/finance/LiquidationActions";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";
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

  console.log(
  "FINANCE ID:",
  id
);

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

  console.log(
  "LIQUIDATION:",
  liquidation
);

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

console.log(
  "INVOICE:",
  invoice
);

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

  const today = new Date();

  const startOfDay =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );

  const startOfWeek =
    new Date(today);

  startOfWeek.setDate(
    today.getDate() -
      today.getDay()
  );

  const startOfMonth =
    new Date(
      today.getFullYear(),
      today.getMonth(),
      1
    );

    const endOfMonth =
  new Date(
    today.getFullYear(),
    today.getMonth() + 1,
    1
  );

  const ordersToday =
    orders?.filter(
      (o) =>
        new Date(
          o.created_at
        ) >= startOfDay
    ) || [];

  const ordersWeek =
    orders?.filter(
      (o) =>
        new Date(
          o.created_at
        ) >= startOfWeek
    ) || [];

const ordersMonth =
  orders?.filter((o) => {
    const date =
      new Date(o.created_at);

    return (
      date >= startOfMonth &&
      date < endOfMonth
    );
  }) || [];
  
  const salesToday =
    ordersToday.reduce(
      (acc, o) =>
        acc +
        Number(
          o.total || 0
        ),
      0
    );

  const salesWeek =
    ordersWeek.reduce(
      (acc, o) =>
        acc +
        Number(
          o.total || 0
        ),
      0
    );

        const salesMonth =
         liquidation
         ? Number(liquidation.sales_total)
         : ordersMonth.reduce(
         (acc, o) =>
          acc + Number(o.total || 0),
        0
      );

  const wolfToday =
    ordersToday.reduce(
      (acc, o) =>
        acc +
        Number(
          o.wolf_amount ||
            0
        ),
      0
    );

  const wolfWeek =
    ordersWeek.reduce(
      (acc, o) =>
        acc +
        Number(
          o.wolf_amount ||
            0
        ),
      0
    );

const wolfMonth =
  liquidation
    ? Number(liquidation.wolf_total)
    : ordersMonth.reduce(
        (acc, o) =>
          acc + Number(o.wolf_amount || 0),
        0
      );

  const restaurantToday =
    ordersToday.reduce(
      (acc, o) =>
        acc +
        Number(
          o.restaurant_amount ||
            0
        ),
      0
    );

  const restaurantWeek =
    ordersWeek.reduce(
      (acc, o) =>
        acc +
        Number(
          o.restaurant_amount ||
            0
        ),
      0
    );

const restaurantMonth =
  liquidation
    ? Number(liquidation.restaurant_total)
    : ordersMonth.reduce(
        (acc, o) =>
          acc + Number(o.restaurant_amount || 0),
        0
      );

const totalOrders =
  liquidation
    ? Number(liquidation.total_orders)
    : ordersMonth.length;

const averageTicket =
  totalOrders > 0
    ? salesMonth / totalOrders
    : 0;



return (
  <PermissionGuard permission="finance">
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "clamp(16px, 4vw, 40px) 16px",
        color: "#fff",
        background: "#0a0a0a",
        minHeight: "100vh",
        fontFamily: "system-ui, -apple-system, sans-serif",
        boxSizing: "border-box",
      }}
    >
      {/* SECCIÓN ESTILOS LOCALES PARA TABLA FLUIDA */}
      <style>{`div::-webkit-scrollbar { display: none; }`}</style>

      {/* ENCABEZADO RESPONSIVO */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "36px",
        }}
      >
        <div>
          <div
            style={{
              color: "#71717a",
              fontSize: "13.5px",
              fontWeight: 500,
              display: "flex",
              alignItems: "center",
              gap: "4px"
            }}
          >
            <BackToSettings restaurantId={id} />
            <span style={{ marginLeft: "4px" }}>Wolf Finance Center</span>
          </div>

          <h1
            style={{
              fontSize: "clamp(24px, 5vw, 38px)",
              fontWeight: "800",
              margin: "8px 0 0 0",
              letterSpacing: "-0.5px"
            }}
          >
            💰 {restaurant?.name}
          </h1>
        </div>

        {restaurant && (
          <Link
            href={`/super-admin/restaurants/${restaurant.id}/settings`}
            style={{ textDecoration: "none", width: "auto" }}
          >
            <button
              style={{
                background: "#f97316",
                border: "none",
                color: "#fff",
                padding: "14px 24px",
                borderRadius: "12px",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "14px",
                boxShadow: "0 4px 14px rgba(249,115,22,0.25)"
              }}
            >
              Configuración
            </button>
          </Link>
        )}
      </div>

      <h2 style={{ fontSize: "18px", fontWeight: "700", marginBottom: "16px", color: "#fff" }}>📊 Dashboard</h2>

      {/* REPETICIÓN GRID ADAPTATIVO GENERADO */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "16px",
          marginBottom: "36px",
          width: "100%",
        }}
      >
        <Card
          title="Ventas Hoy"
          value={`$${salesToday.toFixed(
            2
          )}`}
        />

        <Card
          title="Ventas Semana"
          value={`$${salesWeek.toFixed(
            2
          )}`}
        />

        <Card
          title="Ventas Mes"
          value={`$${salesMonth.toFixed(
            2
          )}`}
        />

          <Card
          title="Pedidos Mes"
          value={totalOrders}
          />

        <Card
          title="Ticket Promedio"
          value={`$${averageTicket.toFixed(
            2
          )}`}
        />

        <Card
          title="Wolf Mes"
          value={`$${wolfMonth.toFixed(
            2
          )}`}
        />

        <Card
          title="Restaurante Mes"
          value={`$${restaurantMonth.toFixed(
            2
          )}`}
        />
      </div>

      {/* WOLF REVENUE */}
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "700",
          marginBottom: "16px",
          color: "#fff"
        }}
      >
        🐺 Wolf Revenue
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "16px",
          marginBottom: "36px",
          width: "100%"
        }}
      >
        <Card
          title="Wolf Hoy"
          value={`$${wolfToday.toFixed(
            2
          )}`}
        />

        <Card
          title="Wolf Semana"
          value={`$${wolfWeek.toFixed(
            2
          )}`}
        />

        <Card
          title="Wolf Mes"
          value={`$${wolfMonth.toFixed(
            2
          )}`}
        />
      </div>

      {/* GANANCIA RESTAURANTE */}
      <h2
        style={{
          fontSize: "18px",
          fontWeight: "700",
          marginBottom: "16px",
          color: "#fff"
        }}
      >
        🏪 Ganancia Restaurante
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))",
          gap: "16px",
          marginBottom: "44px",
          width: "100%"
        }}
      >
        <Card
          title="Hoy"
          value={`$${restaurantToday.toFixed(
            2
          )}`}
        />

        <Card
          title="Semana"
          value={`$${restaurantWeek.toFixed(
            2
          )}`}
        />

        <Card
          title="Mes"
          value={`$${restaurantMonth.toFixed(
            2
          )}`}
        />
      </div>

      {/* SECCIÓN LIQUIDACIONES DE CLIENTES */}
      <div
        style={{
          background: "#121212",
          border: "1px solid #222",
          borderRadius: "20px",
          padding: "24px",
          boxSizing: "border-box" as const,
          width: "100%"
        }}
      >
        
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: "16px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "700"
            }}
          >
            📄 Liquidaciones Wolf
          </h2>

          <GenerateLiquidationButton
            restaurantId={id}
          />
        </div>

        <div
          style={{
            display: "grid",
            gap: "16px",
          }}
        >
          <div
            style={{
              background: "#161616",
              border: "1px solid #262626",
              borderRadius: "14px",
              padding: "20px",
              boxSizing: "border-box" as const
            }}
          >
            <h3 style={{ margin: "0 0 16px 0", fontSize: "16px", fontWeight: "700", color: "#f97316" }}>
              {liquidation
                ? `${liquidation.month}/${liquidation.year}`
                : "Sin liquidación"}
            </h3>

            <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px" }}>
              <p style={{ margin: 0, color: "#a1a1aa", display: "flex", justifyContent: "space-between" }}>
                <span>Ventas:</span>
                <strong style={{ color: "#fff" }}>
                  {liquidation
                    ? Number(liquidation.sales_total).toFixed(2)
                    : "0.00"}
                </strong>
              </p>

              <p style={{ margin: 0, color: "#a1a1aa", display: "flex", justifyContent: "space-between" }}>
                <span>Comisión Wolf:</span>
                <strong style={{ color: "#fff" }}>
                  {liquidation
                    ? Number(liquidation.wolf_total).toFixed(2)
                    : "0.00"}
                </strong>
              </p>

              <p style={{ margin: 0, color: "#a1a1aa", display: "flex", justifyContent: "space-between" }}>
                <span>Restaurante:</span>
                <strong style={{ color: "#fff" }}>
                  {liquidation
                    ? Number(liquidation.restaurant_total).toFixed(2)
                    : "0.00"}
                </strong>
              </p>

              <p style={{ margin: 0, color: "#a1a1aa", display: "flex", justifyContent: "space-between" }}>
                <span>Pedidos:</span>
                <strong style={{ color: "#fff" }}>
                  {liquidation ? liquidation.total_orders : 0}
                </strong>
              </p>

              <p style={{ margin: 0, color: "#a1a1aa", display: "flex", justifyContent: "space-between" }}>
                <span>Invoice:</span>
                <strong style={{ color: "#fff" }}>
                  {invoice ? invoice.invoice_number : "No generado"}
                </strong>
              </p>

              <p style={{ margin: 0, color: "#a1a1aa", display: "flex", justifyContent: "space-between" }}>
                <span>PDF:</span>
                <strong style={{ color: "#fff" }}>
                  {invoice ? "Disponible" : "No disponible"}
                </strong>
              </p>
            </div>

            {invoice?.invoice_pdf_url && (
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  marginTop: "20px",
                  flexWrap: "wrap",
                }}
              >
                <a
                  href={invoice.invoice_pdf_url}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    background: "#2563eb",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "13px",
                    flex: "1 1 auto",
                    textAlign: "center"
                  }}
                >
                  📄 Ver PDF
                </a>

                <a
                  href={invoice.invoice_pdf_url}
                  download
                  style={{
                    background: "#16a34a",
                    color: "#fff",
                    textDecoration: "none",
                    padding: "10px 16px",
                    borderRadius: "10px",
                    fontWeight: "700",
                    fontSize: "13px",
                    flex: "1 1 auto",
                    textAlign: "center"
                  }}
                >
                  ⬇ Descargar PDF
                </a>
              </div>
            )}

            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "20px",
                flexWrap: "wrap",
                alignItems: "center"
              }}
            >
              <button
                style={{
                  background: liquidation?.status === "paid" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)",
                  color: liquidation?.status === "paid" ? "#22c55e" : "#f59e0b",
                  border: liquidation?.status === "paid" ? "1px solid rgba(34,197,94,0.2)" : "1px solid rgba(245,158,11,0.2)",
                  padding: "10px 16px",
                  borderRadius: "10px",
                  fontWeight: "700",
                  fontSize: "13px"
                }}
              >
                {liquidation?.status === "paid" ? "✅ Pagado" : "🟡 Pendiente"}
              </button>

              {liquidation && (
                <LiquidationActions
                  liquidationId={liquidation.id}
                  status={liquidation.status}
                />
              )}
            </div>
          </div>
        </div>

        {/* HISTORIAL DE LIQUIDACIONES TABLE RESPONSIVE */}
        <h3
          style={{
            marginTop: "32px",
            marginBottom: "14px",
            color: "#fff",
            fontSize: "15px",
            fontWeight: "700"
          }}
        >
          Historial de Liquidaciones
        </h3>

        <div
          style={{
            overflowX: "auto",
            width: "100%",
            background: "#161616",
            borderRadius: "14px",
            border: "1px solid #262626",
            scrollbarWidth: "none"
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              fontSize: "13.5px",
              minWidth: "600px" /* Forzar ancho mínimo de control en scroll lateral de móvil */
            }}
          >
            <thead>
              <tr style={{ background: "rgba(249,115,22,0.06)", borderBottom: "1px solid #262626" }}>
                <th style={{ padding: "14px", textAlign: "left", color: "#71717a", fontWeight: "600" }}>Mes</th>
                <th style={{ padding: "14px", textAlign: "left", color: "#71717a", fontWeight: "600" }}>Ventas</th>
                <th style={{ padding: "14px", textAlign: "left", color: "#71717a", fontWeight: "600" }}>Wolf</th>
                <th style={{ padding: "14px", textAlign: "left", color: "#71717a", fontWeight: "600" }}>Restaurante</th>
                <th style={{ padding: "14px", textAlign: "center", color: "#71717a", fontWeight: "600" }}>Pedidos</th>
                <th style={{ padding: "14px", textAlign: "center", color: "#71717a", fontWeight: "600" }}>Estado</th>
              </tr>
            </thead>

            <tbody>
              {liquidations
                ?.filter(
                  (item) =>
                    item.id !== liquidation?.id
                )
                .map(
                  (item) => (
                    <tr
                      key={item.id}
                      style={{
                        borderBottom: "1px solid #262626",
                      }}
                    >
                      <td style={{ padding: "14px", fontWeight: "500" }}>
                        {item.month}/{item.year}
                      </td>

                      <td style={{ padding: "14px", color: "#e4e4e7" }}>
                        ${Number(item.sales_total).toFixed(2)}
                      </td>

                      <td style={{ padding: "14px", color: "#f97316", fontWeight: "700" }}>
                        ${Number(item.wolf_total).toFixed(2)}
                      </td>

                      <td style={{ padding: "14px", color: "#e4e4e7" }}>
                        ${Number(item.restaurant_total).toFixed(2)}
                      </td>

                      <td style={{ padding: "14px", textAlign: "center", color: "#a1a1aa" }}>
                        {item.total_orders}
                      </td>

                      <td style={{ padding: "14px", textAlign: "center" }}>
                        <span style={{
                          padding: "4px 10px",
                          borderRadius: "6px",
                          fontSize: "11px",
                          fontWeight: "700",
                          background: item.status === "paid" ? "rgba(34,197,94,0.08)" : "rgba(245,158,11,0.08)",
                          color: item.status === "paid" ? "#22c55e" : "#f59e0b",
                        }}>
                          {item.status === "paid" ? "PAGADO" : "PENDIENTE"}
                        </span>
                      </td>
                    </tr>
                  )
                )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  </PermissionGuard>
)
}

function Card({
  title,
  value,
}: any) {
  return (
    <div
      style={{
        background: "#121212",
        border: "1px solid #222",
        borderRadius: "18px",
        padding: "20px",
        boxSizing: "border-box" as const,
        display: "flex",
        flexDirection: "column",
        gap: "6px"
      }}
    >
      <p
        style={{
          color: "#71717a",
          margin: 0,
          fontSize: "12.5px",
          fontWeight: "600",
          textTransform: "uppercase",
          letterSpacing: "0.3px"
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,
          fontSize: "28px",
          fontWeight: "800",
          color: "#fff",
          letterSpacing: "-0.5px"
        }}
      >
        {value}
      </h2>
    </div>
  );
}