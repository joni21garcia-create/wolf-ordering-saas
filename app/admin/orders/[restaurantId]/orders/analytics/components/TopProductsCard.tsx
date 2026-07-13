"use client";

interface ProductItem {
  name: string;
  quantity: number;
  sales: number;
}

interface Props {
  products: ProductItem[];
}

export default function TopProductsCard({
  products,
}: Props) {
  const max = Math.max(
    ...products.map((p) => p.quantity),
    1
  );

  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#141414,#0a0a0a)",
        border:
          "1px solid rgba(255,255,255,.07)",
        borderRadius: 24,
        padding: 26,
      }}
    >
      <div
        style={{
          color: "#888",
          fontSize: 13,
          fontWeight: 700,
          textTransform: "uppercase",
          letterSpacing: 1,
        }}
      >
        Productos
      </div>

      <h2
        style={{
          margin: "8px 0 26px",
          color: "#fff",
          fontSize: 26,
          fontWeight: 800,
        }}
      >
        Top Productos
      </h2>

      {products.length === 0 && (
        <div
          style={{
            color: "#777",
            textAlign: "center",
            padding: "30px 0",
          }}
        >
          No existen productos vendidos.
        </div>
      )}

      <div
        style={{
          display: "grid",
          gap: 18,
        }}
      >
        {products.map((product, index) => {

          const percent =
            (product.quantity / max) * 100;

          return (
            <div key={product.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                  gap: 14,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 999,
                      background:
                        "rgba(249,115,22,.18)",
                      color: "#f97316",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      fontWeight: 800,
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </div>

                  <div
                    style={{
                      color: "#fff",
                      fontWeight: 600,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {product.name}
                  </div>
                </div>

                <div
                  style={{
                    textAlign: "right",
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      color: "#22c55e",
                      fontWeight: 700,
                    }}
                  >
                    ${product.sales.toFixed(2)}
                  </div>

                  <div
                    style={{
                      color: "#888",
                      fontSize: 12,
                    }}
                  >
                    {product.quantity} vendidos
                  </div>
                </div>
              </div>

              <div
                style={{
                  height: 10,
                  background:
                    "rgba(255,255,255,.06)",
                  borderRadius: 999,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${percent}%`,
                    height: "100%",
                    background: "#f97316",
                    borderRadius: 999,
                    transition: ".3s",
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}