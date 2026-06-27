import { createClient } from "@supabase/supabase-js";

import DateFilter from "./components/DateFilter";
import SalesChart from "./components/SalesChart";
import PermissionGuard from "@/components/auth/PermissionGuard";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export default async function AnalyticsPage({
  searchParams,
}: {
  searchParams: Promise<{
    from?: string;
    to?: string;
  }>;
}) {

  const params =
    await searchParams;

  const from =
    params?.from;

  const to =
    params?.to;


    console.log("FROM:", from);
console.log("TO:", to);


 let query =
  supabase
    .from("orders")
    .select("*")
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
  } = await query;



  console.log("TOTAL ORDERS:", orders?.length);

  console.log(
  "DATES:",
  orders?.map(
    (o) => o.created_at
  )
);

  const salesTotal =
    orders?.reduce(
      (acc, order) =>
        acc +
        Number(
          order.total || 0
        ),
      0
    ) || 0;

  const wolfTotal =
    orders?.reduce(
      (acc, order) =>
        acc +
        Number(
          order.wolf_amount || 0
        ),
      0
    ) || 0;

  const restaurantTotal =
    orders?.reduce(
      (acc, order) =>
        acc +
        Number(
          order.restaurant_amount ||
            0
        ),
      0
    ) || 0;

  const totalOrders =
    orders?.length || 0;

  const chartData = [
    {
      day: "1",
      sales: 120,
    },
    {
      day: "5",
      sales: 280,
    },
    {
      day: "10",
      sales: 420,
    },
    {
      day: "15",
      sales: 510,
    },
    {
      day: "20",
      sales: 760,
    },
    {
      day: "25",
      sales: 940,
    },
    {
      day: "30",
      sales: 1116,
    },
  ];

  const cashOrders =
    orders?.filter(
      (o) =>
        o.payment_method ===
        "cash"
    ).length || 0;

  const qrOrders =
    orders?.filter(
      (o) =>
        o.payment_method ===
        "qr"
    ).length || 0;

  const pickupOrders =
    orders?.filter(
      (o) =>
        o.order_type ===
        "pickup"
    ).length || 0;

  const deliveryOrders =
    orders?.filter(
      (o) =>
        o.order_type ===
        "delivery"
    ).length || 0;

  const avgTicket =
    totalOrders > 0
      ? salesTotal /
        totalOrders
      : 0;

return (
  <PermissionGuard permission="analytics">
    <div
      style={{
        minHeight: "100vh",
        padding: "40px",
        color: "#fff",
        background:
          "radial-gradient(circle at top right,#331300 0%,#050505 45%)",
      }}
    >
      <main
        style={{
          maxWidth: "1800px",
          margin: "0 auto",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize:
                  "48px",
                fontWeight:
                  "900",
              }}
            >
              🐺 Wolf Analytics
            </h1>

            <p
              style={{
                color:
                  "#9ca3af",
                marginTop:
                  "10px",
              }}
            >
              Revenue Intelligence
              Dashboard
            </p>
          </div>

          <div
            style={{
              background:
                "rgba(249,115,22,.15)",
              color:
                "#f97316",
              padding:
                "10px 20px",
              borderRadius:
                "999px",
              border:
                "1px solid rgba(249,115,22,.25)",
              fontWeight:
                "700",
            }}
          >
            🔴 Live Data
          </div>
        </div>

        <DateFilter />

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(260px,1fr))",
            gap: "20px",
            marginTop:
              "30px",
          }}
        >
          <Card
            title="💰 Ventas"
            value={`$${salesTotal.toFixed(
              2
            )}`}
          />

          <Card
            title="📦 Pedidos"
            value={totalOrders}
          />

          <Card
            title="🐺 Wolf"
            value={`$${wolfTotal.toFixed(
              2
            )}`}
          />

          <Card
            title="🏪 Restaurante"
            value={`$${restaurantTotal.toFixed(
              2
            )}`}
          />
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "2fr 1fr",
            gap: "20px",
            marginTop:
              "30px",
          }}
        >
          <div
            style={{
              background:
                "rgba(17,17,17,.95)",
              borderRadius:
                "24px",
              padding:
                "24px",
              border:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom:
                  "20px",
              }}
            >
              <h2
                style={{
                  margin: 0,
                }}
              >
                📈 Revenue Trend
              </h2>

              <span
                style={{
                  color:
                    "#22c55e",
                  fontWeight:
                    "700",
                }}
              >
                +12.4%
              </span>
            </div>

            <SalesChart
              data={chartData}
            />
          </div>

          <div
            style={{
              background:
                "rgba(17,17,17,.95)",
              borderRadius:
                "24px",
              padding:
                "24px",
              border:
                "1px solid rgba(255,255,255,.08)",
            }}
          >
            <h2>
              📊 Operación
            </h2>

            <div
              style={{
                display: "grid",
                gap: "14px",
                marginTop:
                  "20px",
              }}
            >
              <MetricRow
                label="💵 Efectivo"
                value={cashOrders}
              />

              <MetricRow
                label="📱 QR"
                value={qrOrders}
              />

              <MetricRow
                label="🥡 Pickup"
                value={pickupOrders}
              />

              <MetricRow
                label="🚚 Delivery"
                value={deliveryOrders}
              />
            </div>
          </div>
        </div>

        <div
          style={{
            marginTop:
              "30px",
            background:
              "rgba(17,17,17,.95)",
            borderRadius:
              "24px",
            padding:
              "30px",
            border:
              "1px solid rgba(255,255,255,.08)",
          }}
        >
          <h2>
            🎯 Resumen Ejecutivo
          </h2>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit,minmax(250px,1fr))",
              gap: "20px",
              marginTop:
                "20px",
            }}
          >
            <MetricRow
              label="📈 Ticket Promedio"
              value={`$${avgTicket.toFixed(
                2
              )}`}
            />

            <MetricRow
              label="📦 Total Pedidos"
              value={totalOrders}
            />

            <MetricRow
              label="🐺 Comisión Wolf"
              value={`$${wolfTotal.toFixed(
                2
              )}`}
            />

            <MetricRow
              label="🏪 Ganancia Restaurante"
              value={`$${restaurantTotal.toFixed(
                2
              )}`}
            />
          </div>
        </div>
      </main>
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
        background:
          "linear-gradient(180deg,#141414,#0a0a0a)",
        padding: "28px",
        borderRadius:
          "28px",
        border:
          "1px solid rgba(255,255,255,.08)",
        boxShadow:
          "0 20px 50px rgba(0,0,0,.45)",
      }}
    >
      <p
        style={{
          color: "#9ca3af",
          marginBottom:
            "12px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,
          fontSize:
            "42px",
          fontWeight:
            "900",
        }}
      >
        {value}
      </h2>
    </div>
  );
}

function MetricRow({
  label,
  value,
}: any) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        alignItems:
          "center",
        padding:
          "14px 18px",
        background:
          "rgba(255,255,255,.04)",
        borderRadius:
          "14px",
      }}
    >
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}