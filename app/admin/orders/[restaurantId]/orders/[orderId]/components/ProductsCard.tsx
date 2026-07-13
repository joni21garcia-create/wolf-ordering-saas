interface Props {
  order: any;
}

export default function ProductsCard({ order }: Props) {
  const products = order.order_items ?? [];

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.015))",
        border: "1px solid rgba(255,255,255,.07)",
        borderRadius: 24,
        padding: 28,
        backdropFilter: "blur(14px)",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div>
          <div
            style={{
              color: "#f97316",
              fontWeight: 700,
              fontSize: 12,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Pedido
          </div>

          <h2
            style={{
              color: "#fff",
              margin: "6px 0 0",
              fontSize: 26,
              fontWeight: 700,
            }}
          >
            Productos
          </h2>
        </div>

        <div
          style={{
            padding: "10px 18px",
            borderRadius: 999,
            background: "rgba(249,115,22,.12)",
            color: "#f97316",
            fontWeight: 700,
          }}
        >
          {products.length} Producto{products.length !== 1 ? "s" : ""}
        </div>
      </div>

      <div
        style={{
          overflowX: "auto",
          borderRadius: 18,
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: 760,
            borderCollapse: "collapse",
          }}
        >
          <thead>
            <tr
              style={{
                background: "rgba(255,255,255,.03)",
              }}
            >
              <Th>Producto</Th>

              <Th align="center">Cantidad</Th>

              <Th align="center">Precio Unitario</Th>

              <Th align="right">Subtotal</Th>
            </tr>
          </thead>

          <tbody>
            {products.map((item: any) => (
              <tr
                key={item.id}
                style={{
                  borderBottom:
                    "1px solid rgba(255,255,255,.05)",
                }}
              >
                <Td>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: 4,
                    }}
                  >
                    <strong
                      style={{
                        color: "#fff",
                        fontSize: 16,
                      }}
                    >
                      {item.products?.name ??
                        "Producto"}
                    </strong>

                    <span
                      style={{
                        color: "#777",
                        fontSize: 13,
                      }}
                    >
                      ID {item.product_id}
                    </span>
                  </div>
                </Td>

                <Td align="center">
                  {item.quantity}
                </Td>

                <Td align="center">
                  $
                  {Number(
                    item.unit_price ?? 0
                  ).toFixed(2)}
                </Td>

                <Td align="right">
                  <strong
                    style={{
                      color: "#22c55e",
                    }}
                  >
                    $
                    {Number(
                      item.subtotal ?? 0
                    ).toFixed(2)}
                  </strong>
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {products.length === 0 && (
        <div
          style={{
            padding: 40,
            textAlign: "center",
            color: "#777",
          }}
        >
          No existen productos.
        </div>
      )}
    </section>
  );
}

function Th({
  children,
  align = "left",
}: any) {
  return (
    <th
      style={{
        padding: 16,
        color: "#777",
        textAlign: align,
        fontSize: 13,
        fontWeight: 600,
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  align = "left",
}: any) {
  return (
    <td
      style={{
        padding: 18,
        color: "#ddd",
        textAlign: align,
        verticalAlign: "middle",
      }}
    >
      {children}
    </td>
  );
}