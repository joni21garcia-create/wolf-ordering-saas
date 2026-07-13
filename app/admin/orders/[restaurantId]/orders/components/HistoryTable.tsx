"use client";

import Link from "next/link";
import StatusBadge from "./StatusBadge";

interface Props {
  restaurantId: string;
  orders: any[];
}

export default function HistoryTable({
  restaurantId,
  orders,
}: Props) {
  if (orders.length === 0) {
    return null;
  }

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",

        border: "1px solid rgba(255,255,255,.07)",

        borderRadius: 24,

        overflow: "hidden",
      }}
    >
      <div
        style={{
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: 1100,
          }}
        >
          <thead>
            <tr
              style={{
                background:
                  "rgba(255,255,255,.04)",
              }}
            >
              {[
                "Tracking",
                "Cliente",
                "Fecha",
                "Estado",
                "Pago",
                "Tipo",
                "Total",
                "",
              ].map((title) => (
                <th
                  key={title}
                  style={{
                    padding: "18px",
                    color: "#888",
                    textAlign: "left",
                    fontSize: 13,
                    fontWeight: 700,
                    letterSpacing: 1,
                    textTransform: "uppercase",
                  }}
                >
                  {title}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                style={{
                  borderTop:
                    "1px solid rgba(255,255,255,.05)",
                }}
              >
                <Cell>
                  <strong
                    style={{
                      color: "#fff",
                    }}
                  >
                    {order.tracking_code}
                  </strong>
                </Cell>

                <Cell>
                  <div>
                    <div
                      style={{
                        color: "#fff",
                        fontWeight: 700,
                      }}
                    >
                      {order.customer_name}
                    </div>

                    <div
                      style={{
                        color: "#777",
                        marginTop: 4,
                        fontSize: 13,
                      }}
                    >
                      {order.customer_phone}
                    </div>
                  </div>
                </Cell>

                <Cell>
                  <span
                    style={{
                      color: "#bbb",
                    }}
                  >
                    {new Date(
                      order.created_at
                    ).toLocaleString()}
                  </span>
                </Cell>

<Cell>
  <StatusBadge status={order.status} />
</Cell>

<Cell>
  <span style={{ color: "#fff" }}>
    {order.payment_status}
  </span>
</Cell>

                <Cell>
                  <span
                    style={{
                      color: "#ddd",
                    }}
                  >
                    {order.order_type}
                  </span>
                </Cell>

                <Cell>
                  <strong
                    style={{
                      color: "#22c55e",
                    }}
                  >
                    $
                    {Number(
                      order.total
                    ).toFixed(2)}
                  </strong>
                </Cell>

                <Cell>
                  <Link
                    href={`/admin/orders/${restaurantId}/orders/${order.id}`}
                    style={{
                      textDecoration:
                        "none",
                    }}
                  >
                    <button
                      style={{
                        padding:
                          "10px 18px",

                        borderRadius: 12,

                        border: "none",

                        background:
                          "#f97316",

                        color: "#fff",

                        cursor: "pointer",

                        fontWeight: 700,
                      }}
                    >
                      Ver detalle
                    </button>
                  </Link>
                </Cell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function Cell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <td
      style={{
        padding: 18,
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}