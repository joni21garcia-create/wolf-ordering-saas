interface Props {
  order: any;
}

export default function ProductsCard({ order }: Props) {
  const products = order.order_items ?? [];

  const subtotal = Number(order.subtotal ?? 0);
  const commission = Number(
    order.commission_amount ?? 0
  );
  const total = Number(
    order.total ?? subtotal + commission
  );

  return (
    <section className="products-native">
      <style>{`
        .products-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .products-header {
          display: flex;
          align-items: baseline;
          justify-content: space-between;
          gap: 16px;
          padding: 2px 0 18px;
        }

        .products-title {
          margin: 0;
          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.55px;
        }

        .products-count {
          color: #666;
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* ==========================================
           PRODUCTS
        ========================================== */

        .products-list {
          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .product-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;

          min-height: 72px;
          padding: 15px 0;

          border-bottom:
            1px solid rgba(255,255,255,.055);
        }

        .product-info {
          min-width: 0;
          flex: 1;
        }

        .product-name {
          overflow: hidden;

          color: #f2f2f2;
          font-size: 14px;
          font-weight: 650;
          line-height: 1.4;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .product-meta {
          display: flex;
          align-items: center;
          gap: 7px;

          margin-top: 5px;

          color: #666;
          font-size: 11px;
        }

        .product-quantity {
          color: #a0a0a0;
          font-weight: 650;
        }

        .product-dot {
          color: #3d3d3d;
        }

        .product-unit {
          color: #666;
        }

        .product-price {
          flex-shrink: 0;

          color: #f2f2f2;
          font-size: 14px;
          font-weight: 700;
          white-space: nowrap;
        }

        /* ==========================================
           FINANCIAL SUMMARY
        ========================================== */

        .products-financial {
          margin-top: 22px;
          padding-top: 18px;

          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .financial-row {
          display: flex;
          align-items: center;
          justify-content: space-between;

          min-height: 34px;
          gap: 20px;
        }

        .financial-label {
          color: #666;
          font-size: 12px;
          font-weight: 550;
        }

        .financial-value {
          color: #aaa;
          font-size: 12px;
          font-weight: 650;
        }

        .financial-total {
          display: flex;
          align-items: center;
          justify-content: space-between;

          margin-top: 12px;
          padding-top: 15px;

          border-top:
            1px solid rgba(255,255,255,.07);
        }

        .financial-total-label {
          color: #fff;
          font-size: 14px;
          font-weight: 650;
        }

        .financial-total-value {
          color: #fff;
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -.5px;
        }

        /* ==========================================
           EMPTY
        ========================================== */

        .products-empty {
          padding: 34px 4px;

          color: #666;
          font-size: 13px;
          text-align: center;

          border-top:
            1px solid rgba(255,255,255,.06);
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .products-title {
            font-size: 20px;
          }

          .product-row {
            gap: 14px;
          }

          .product-name {
            font-size: 14px;
          }

          .product-price {
            font-size: 13px;
          }

          .financial-total-value {
            font-size: 20px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="products-header">
        <h2 className="products-title">
          Productos
        </h2>

        <span className="products-count">
          {products.length}{" "}
          {products.length === 1
            ? "producto"
            : "productos"}
        </span>
      </div>

      {/* PRODUCT LIST */}

      {products.length === 0 ? (
        <div className="products-empty">
          No hay productos en este pedido.
        </div>
      ) : (
        <>
          <div className="products-list">
            {products.map((item: any) => {
              const quantity = Number(
                item.quantity ?? 0
              );

              const unitPrice = Number(
                item.unit_price ?? 0
              );

              const itemSubtotal = Number(
                item.subtotal ??
                  quantity * unitPrice
              );

              return (
                <div
                  key={item.id}
                  className="product-row"
                >
                  <div className="product-info">
                    <div className="product-name">
                      {item.products?.name ??
                        "Producto"}
                    </div>

                    <div className="product-meta">
                      <span className="product-quantity">
                        {quantity} ×
                      </span>

                      <span className="product-dot">
                        ·
                      </span>

                      <span className="product-unit">
                        ${unitPrice.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="product-price">
                    ${itemSubtotal.toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          {/* FINANCIAL SUMMARY */}

          <div className="products-financial">

            <div className="financial-row">
              <span className="financial-label">
                Productos
              </span>

              <span className="financial-value">
                ${subtotal.toFixed(2)}
              </span>
            </div>

            {commission > 0 && (
              <div className="financial-row">
                <span className="financial-label">
                  Comisión
                </span>

                <span className="financial-value">
                  ${commission.toFixed(2)}
                </span>
              </div>
            )}

            <div className="financial-total">
              <span className="financial-total-label">
                Total
              </span>

              <strong className="financial-total-value">
                ${total.toFixed(2)}
              </strong>
            </div>

          </div>
        </>
      )}
    </section>
  );
}