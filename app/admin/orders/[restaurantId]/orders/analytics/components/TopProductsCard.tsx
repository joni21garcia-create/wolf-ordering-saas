 "use client";

interface ProductItem {
  name: string;
  quantity: number;
  sales: number;
}

interface Props {
  products: ProductItem[];
}

export default function TopProductsCard({ products }: Props) {
  const max = Math.max(...products.map((p) => p.quantity), 1);

  return (
    <section className="products-card">
      <style jsx>{`
        .products-card {
          width: 100%;
          min-width: 0;
          box-sizing: border-box;
          background: linear-gradient(180deg, #141414, #0a0a0a);
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 22px;
          padding: 22px;
        }

        .eyebrow {
          color: #888;
          font-size: 11px;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .title {
          margin: 7px 0 20px;
          color: #fff;
          font-size: 25px;
          font-weight: 800;
          line-height: 1.1;
        }

        .products {
          display: grid;
          gap: 12px;
          max-height: 520px;
          overflow-y: auto;
          padding-right: 3px;
          scrollbar-width: thin;
          scrollbar-color: #333 transparent;
        }

        .product {
          min-width: 0;
        }

        .header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 6px;
        }

        .identity {
          min-width: 0;
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .rank {
          width: 28px;
          height: 28px;
          flex: 0 0 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: rgba(249, 115, 22, 0.14);
          color: #f97316;
          font-size: 11px;
          font-weight: 800;
        }

        .name {
          min-width: 0;
          color: #fff;
          font-size: 13px;
          font-weight: 600;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .sales {
          flex-shrink: 0;
          text-align: right;
        }

        .amount {
          color: #22c55e;
          font-size: 12px;
          font-weight: 700;
        }

        .quantity {
          margin-top: 2px;
          color: #888;
          font-size: 10px;
        }

        .track {
          height: 7px;
          background: rgba(255, 255, 255, 0.06);
          border-radius: 999px;
          overflow: hidden;
        }

        .bar {
          height: 100%;
          background: #f97316;
          border-radius: 999px;
          transition: width 0.3s ease;
        }

        .empty {
          color: #777;
          text-align: center;
          padding: 24px 0;
          font-size: 13px;
        }

        @media (max-width: 560px) {
          .products-card {
            border-radius: 18px;
            padding: 16px;
          }

          .title {
            font-size: 21px;
            margin-bottom: 15px;
          }

          .products {
            gap: 10px;
            max-height: 420px;
          }

          .rank {
            width: 25px;
            height: 25px;
            flex-basis: 25px;
            font-size: 10px;
          }

          .name {
            font-size: 12px;
          }

          .amount {
            font-size: 11px;
          }

          .track {
            height: 6px;
          }
        }
      `}</style>

      <div className="eyebrow">Productos</div>
      <h2 className="title">Top Productos</h2>

      {products.length === 0 ? (
        <div className="empty">No existen productos vendidos.</div>
      ) : (
        <div className="products">
          {products.map((product, index) => {
            const percent = (product.quantity / max) * 100;

            return (
              <div className="product" key={product.name}>
                <div className="header">
                  <div className="identity">
                    <div className="rank">{index + 1}</div>
                    <div className="name">{product.name}</div>
                  </div>

                  <div className="sales">
                    <div className="amount">
                      ${product.sales.toFixed(2)}
                    </div>
                    <div className="quantity">
                      {product.quantity} vendidos
                    </div>
                  </div>
                </div>

                <div className="track">
                  <div
                    className="bar"
                    style={{ width: `${percent}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}