"use client";

interface Liquidation {
  id: string;

  month: number;

  year: number;

  sales_total: number;

  wolf_total: number;

  restaurant_total: number;

  total_orders: number;

  status: string;
}

interface Props {
  liquidations: Liquidation[];

  currentId?: string;
}

export default function FinanceHistoryTable({
  liquidations,
  currentId,
}: Props) {
  const history = liquidations.filter(
    (item) => item.id !== currentId
  );

  return (
    <section
      style={{
        marginTop: 42,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 20,
          marginBottom: 20,
        }}
      >
        <div>
          <h2
            style={{
              margin: 0,
              color: "#fff",
              fontSize: 28,
              fontWeight: 800,
            }}
          >
            📜 Historial de Liquidaciones
          </h2>

          <p
            style={{
              marginTop: 8,
              color: "#888",
            }}
          >
            Liquidaciones anteriores del restaurante.
          </p>
        </div>

        <div
          style={{
            color: "#888",
            fontWeight: 700,
          }}
        >
          {history.length} registros
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",

          borderRadius: 22,

          border:
            "1px solid rgba(255,255,255,.08)",

          background:
            "linear-gradient(180deg,#171717,#101010)",
        }}
      >
        <table
          style={{
            width: "100%",

            borderCollapse:
              "collapse",

            minWidth: 900,
          }}
        >
          <thead>
            <tr>
              <Header>
                Periodo
              </Header>

              <Header>
                Ventas
              </Header>

              <Header>
                Wolf
              </Header>

              <Header>
                Restaurante
              </Header>

              <Header>
                Pedidos
              </Header>

              <Header>
                Estado
              </Header>
            </tr>
          </thead>

          <tbody>
            {history.map((item) => (
              <tr
                key={item.id}
                style={{
                  borderTop:
                    "1px solid rgba(255,255,255,.05)",
                }}
              >
                <Cell>
                  {item.month}/
                  {item.year}
                </Cell>

                <Cell>
                  $
                  {Number(
                    item.sales_total
                  ).toFixed(2)}
                </Cell>

                <Cell
                  color="#f97316"
                >
                  $
                  {Number(
                    item.wolf_total
                  ).toFixed(2)}
                </Cell>

                <Cell
                  color="#22c55e"
                >
                  $
                  {Number(
                    item.restaurant_total
                  ).toFixed(2)}
                </Cell>

                <Cell>
                  {
                    item.total_orders
                  }
                </Cell>

                <Cell>
                  <Status
                    status={
                      item.status
                    }
                  />
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Header({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <th
      style={{
        padding: 18,

        textAlign: "left",

        color: "#888",

        fontSize: 12,

        textTransform:
          "uppercase",

        letterSpacing: .8,

        fontWeight: 700,
      }}
    >
      {children}
    </th>
  );
}

function Cell({
  children,
  color,
}: {
  children: React.ReactNode;

  color?: string;
}) {
  return (
    <td
      style={{
        padding: 18,

        color:
          color ?? "#fff",

        fontWeight: 600,
      }}
    >
      {children}
    </td>
  );
}

function Status({
  status,
}: {
  status: string;
}) {
  const paid =
    status === "paid";

  return (
    <span
      style={{
        display:
          "inline-flex",

        padding:
          "8px 14px",

        borderRadius: 999,

        background: paid
          ? "rgba(34,197,94,.12)"
          : "rgba(245,158,11,.12)",

        color: paid
          ? "#22c55e"
          : "#f59e0b",

        fontWeight: 700,

        fontSize: 13,
      }}
    >
      {paid
        ? "Pagado"
        : "Pendiente"}
    </span>
  );
}