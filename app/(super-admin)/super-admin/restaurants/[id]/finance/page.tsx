import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import LiquidationActions from "@/components/finance/LiquidationActions";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

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
      .single();

  const { data: orders } =
    await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", id);


const {
  data: liquidation,
} = await supabase
  .from("liquidations")
  .select("*")
  .eq("restaurant_id", id)
  .order("created_at", {
    ascending: false,
  })
  .limit(1)
  .single();

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
    orders?.filter(
      (o) =>
        new Date(
          o.created_at
        ) >= startOfMonth
    ) || [];

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
    ordersMonth.reduce(
      (acc, o) =>
        acc +
        Number(
          o.total || 0
        ),
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
    ordersMonth.reduce(
      (acc, o) =>
        acc +
        Number(
          o.wolf_amount ||
            0
        ),
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
    ordersMonth.reduce(
      (acc, o) =>
        acc +
        Number(
          o.restaurant_amount ||
            0
        ),
      0
    );

  const averageTicket =
    ordersMonth.length
      ? salesMonth /
        ordersMonth.length
      : 0;



return (
  <PermissionGuard permission="finance">
    <div
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "35px",
        }}
      >
        <div>
          <p
            style={{
              color: "#777",
            }}
          >

                        <BackToSettings
                          restaurantId={id}
                        />
            Wolf Finance Center
          </p>

          <h1
            style={{
              fontSize: "52px",
              margin: 0,
            }}
          >
            💰 {restaurant?.name}
          </h1>
        </div>

        {restaurant && (
  <Link
    href={`/super-admin/restaurants/${restaurant.id}/settings`}
  >
    <button
      style={{
        background:"#f97316",
        border:"none",
        color:"#fff",
        padding:"16px 28px",
        borderRadius:"16px",
        cursor:"pointer",
        fontWeight:"700",
      }}
    >
      Configuración
    </button>
  </Link>
)}
      </div>

      <h2>📊 Dashboard</h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom:
            "40px",
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
          value={
            ordersMonth.length
          }
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

      {/* WOLF */}

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        
        🐺 Wolf Revenue
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "40px",
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

      {/* RESTAURANTE */}

      <h2
        style={{
          marginBottom: "20px",
        }}
      >
        🏪 Ganancia Restaurante
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(250px,1fr))",
          gap: "20px",
          marginBottom: "50px",
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

      {/* LIQUIDACIONES */}

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius:
            "24px",
          padding: "30px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          📄 Liquidaciones Wolf
        </h2>

        <div
          style={{
            display: "grid",
            gap: "20px",
          }}
        >
          <div
            style={{
              background:
                "rgba(255,255,255,.03)",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius:
                "18px",
              padding: "20px",
            }}
          >
     <h3>
  {liquidation
    ? `${liquidation.month}/${liquidation.year}`
    : "Sin liquidación"}
</h3>

            <p>
              Ventas:
              {" "}
              <strong>
                {
  liquidation
    ? Number(
        liquidation.sales_total
      ).toFixed(2)
    : "0.00"
}
              </strong>
            </p>

            <p>
              Comisión Wolf:
              {" "}
              <strong>
{
  liquidation
    ? Number(
        liquidation.wolf_total
      ).toFixed(2)
    : "0.00"
}
              </strong>
            </p>

            <p>
              Restaurante:
              {" "}
              <strong>
               {
  liquidation
    ? Number(
        liquidation.restaurant_total
      ).toFixed(2)
    : "0.00"
}
              </strong>
            </p>

            <p>
              Pedidos:
              {" "}
              <strong>
{
  liquidation
    ? liquidation.total_orders
    : 0
}
              </strong>
            </p>

<p>
  Invoice:
  {" "}
  <strong>
    {invoice
      ? invoice.invoice_number
      : "No generado"}
  </strong>
</p>

<p>
  PDF:
  {" "}
  <strong>
    {invoice
      ? "Disponible"
      : "No disponible"}
  </strong>
</p>

{invoice?.invoice_pdf_url && (
  <div
    style={{
      display: "flex",
      gap: "10px",
      marginTop: "15px",
      flexWrap: "wrap",
    }}
  >
    <a
      href={
        invoice.invoice_pdf_url
      }
      target="_blank"
      rel="noreferrer"
      style={{
        background:
          "#2563eb",
        color: "#fff",
        textDecoration:
          "none",
        padding:
          "10px 16px",
        borderRadius:
          "10px",
        fontWeight:
          "700",
      }}
    >
      📄 Ver PDF
    </a>

    <a
      href={
        invoice.invoice_pdf_url
      }
      download
      style={{
        background:
          "#16a34a",
        color: "#fff",
        textDecoration:
          "none",
        padding:
          "10px 16px",
        borderRadius:
          "10px",
        fontWeight:
          "700",
      }}
    >
      ⬇ Descargar PDF
    </a>
  </div>
)}

            <div
              style={{
                display:
                  "flex",
                gap: "12px",
                marginTop:
                  "20px",
                flexWrap:
                  "wrap",
              }}
            >

<button
  style={{
    background:
      liquidation?.status ===
      "paid"
        ? "#22c55e"
        : "#f59e0b",
    color: "#fff",
    border: "none",
    padding: "12px 18px",
    borderRadius: "12px",
    fontWeight: "700",
  }}
>
  {liquidation?.status ===
  "paid"
    ? "✅ Pagado"
    : "🟡 Pendiente"}
</button>

{liquidation && (
  <LiquidationActions
    liquidationId={
      liquidation.id
    }
    status={
      liquidation.status
    }
  />
)}
            </div>
          </div>
        </div>

<h3
  style={{
    marginTop: "30px",
    color: "#fff",
  }}
>
  Historial de Liquidaciones
</h3>

<div
  style={{
    overflowX: "auto",
    marginTop: "15px",
  }}
>
  <table
    style={{
      width: "100%",
      borderCollapse:
        "collapse",
    }}
  >
    <thead>
      <tr
        style={{
          background:
            "rgba(249,115,22,.15)",
        }}
      >
        <th
          style={{
            padding: "14px",
            textAlign: "left",
          }}
        >
          Mes
        </th>

        <th
          style={{
            padding: "14px",
            textAlign: "left",
          }}
        >
          Ventas
        </th>

        <th
          style={{
            padding: "14px",
            textAlign: "left",
          }}
        >
          Wolf
        </th>

        <th
          style={{
            padding: "14px",
            textAlign: "left",
          }}
        >
          Restaurante
        </th>

        <th
          style={{
            padding: "14px",
            textAlign: "center",
          }}
        >
          Pedidos
        </th>

        <th
          style={{
            padding: "14px",
            textAlign: "center",
          }}
        >
          Estado
        </th>
      </tr>
    </thead>

    <tbody>
      {liquidations
        ?.filter(
          (item) =>
            item.id !==
            liquidation?.id
        )
        .map(
          (item) => (
            <tr
              key={item.id}
              style={{
                borderBottom:
                  "1px solid rgba(255,255,255,.08)",
              }}
            >
              <td
                style={{
                  padding:
                    "14px",
                }}
              >
                {item.month}/
                {item.year}
              </td>

              <td
                style={{
                  padding:
                    "14px",
                }}
              >
                $
                {Number(
                  item.sales_total
                ).toFixed(2)}
              </td>

              <td
                style={{
                  padding:
                    "14px",
                  color:
                    "#f97316",
                  fontWeight:
                    "700",
                }}
              >
                $
                {Number(
                  item.wolf_total
                ).toFixed(2)}
              </td>

              <td
                style={{
                  padding:
                    "14px",
                }}
              >
                $
                {Number(
                  item.restaurant_total
                ).toFixed(2)}
              </td>

              <td
                style={{
                  padding:
                    "14px",
                  textAlign:
                    "center",
                }}
              >
                {
                  item.total_orders
                }
              </td>

              <td
                style={{
                  padding:
                    "14px",
                  textAlign:
                    "center",
                }}
              >
                {item.status ===
                "paid"
                  ? "✅ Pagado"
                  : "🟡 Pendiente"}
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
        background:
          "rgba(17,17,17,.95)",
        border:
          "1px solid rgba(255,255,255,.08)",
        borderRadius:
          "22px",
        padding: "24px",
      }}
    >
      <p
        style={{
          color: "#888",
          marginBottom:
            "10px",
        }}
      >
        {title}
      </p>

      <h2
        style={{
          margin: 0,
          fontSize:
            "38px",
        }}
      >
        {value}
      </h2>
    </div>
  );
}