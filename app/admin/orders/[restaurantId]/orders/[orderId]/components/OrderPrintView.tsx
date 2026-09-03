interface Props {
  order: any;
}

export default function OrderPrintView({
  order,
}: Props) {
  const products = order.order_items ?? [];

  // Uses only restaurant data already present on the order.
  const restaurant =
    order.restaurant ??
    order.restaurant_info ??
    order.restaurant_data ??
    {};

  const restaurantName =
    restaurant.name ??
    order.restaurant_name ??
    restaurant.business_name ??
    "Wolf";

  const restaurantLogo =
    restaurant.logo_url ??
    restaurant.logo ??
    restaurant.image_url ??
    order.restaurant_logo_url ??
    order.restaurant_logo ??
    null;

  const restaurantAddress =
    restaurant.address ??
    restaurant.address_line ??
    order.restaurant_address ??
    null;

  const restaurantPhone =
    restaurant.phone ??
    restaurant.phone_number ??
    order.restaurant_phone ??
    null;

  const restaurantEmail =
    restaurant.email ??
    order.restaurant_email ??
    null;

  const restaurantCity =
    restaurant.city ??
    order.restaurant_city ??
    null;

  const deliveryFee = Number(
    order.delivery_fee ?? 0
  );

  const currency = (value: unknown) =>
    `$${Number(value ?? 0).toFixed(2)}`;

  const subtotal = Number(
    order.subtotal ?? 0
  );

  const commission = Number(
    order.commission_amount ?? 0
  );

  const total = Number(
    order.total ?? subtotal + commission
  );

  const created = order.created_at
    ? new Date(order.created_at)
    : null;

  const date = created
    ? created.toLocaleDateString(
        "es-CO",
        {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }
      )
    : "—";

  const time = created
    ? created.toLocaleTimeString(
        "es-CO",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      )
    : "—";

return (
  <section className="order-print">
    <style>{`
      .order-print {
        display: none;
      }

      /* Browser + PWA print mode. Keep this stylesheet global so it can
         control the body/root tree even though the component is nested. */
      body[data-print-order="true"] .wolf-order-page {
        background: #fff !important;
        color: #111 !important;
      }

      body[data-print-order="true"] .wolf-order-container {
        display: none !important;
      }

      body[data-print-order="true"] .order-print {
        display: block !important;
        position: fixed !important;
        inset: 0 !important;
        z-index: 2147483647 !important;
        width: 100% !important;
        min-height: 100vh !important;
        overflow: visible !important;
        background: #fff !important;
        color: #111 !important;
      }

      @media print {
        @page {
          size: auto;
          margin: 8mm;
        }

        html,
        body {
          background: #fff !important;
        }

        body * {
          visibility: hidden !important;
        }

        .wolf-order-page {
          display: block !important;
          min-height: 0 !important;
          background: #fff !important;
        }

        .wolf-order-container {
          display: none !important;
        }

        .order-print,
        .order-print * {
          visibility: visible !important;
        }

        .order-print {
          display: block !important;
          position: fixed !important;
          inset: 0 !important;
          z-index: 2147483647 !important;
          width: 100% !important;
          padding: 0;
          color: #111;
          background: #fff;
          font-family: Arial, Helvetica, sans-serif;
          -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }

        .order-print-inner {
          width: 100%;
          max-width: 430px;
          margin: 0 auto;
          padding: 18px 16px 22px;
          box-sizing: border-box;
        }

        .print-restaurant {
          padding: 14px 12px 12px;
          border: 1px solid #e6e6e6;
          border-radius: 14px;
          text-align: center;
        }

        .print-logo {
          display: block;
          width: 58px;
          height: 58px;
          margin: 0 auto 8px;
          object-fit: contain;
          border-radius: 12px;
        }

        .print-logo-fallback {
          width: 58px;
          height: 58px;
          margin: 0 auto 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          background: #111;
          color: #fff;
          font-size: 20px;
          font-weight: 900;
        }

        .print-restaurant-name {
          margin: 0;
          font-size: 16px;
          font-weight: 900;
        }

        .print-restaurant-meta {
          margin-top: 4px;
          color: #666;
          font-size: 9px;
          line-height: 1.45;
        }

        .print-order-header {
          margin-top: 14px;
          padding: 14px 12px;
          border-radius: 14px;
          background: #f5f5f5;
          text-align: center;
        }

        .print-kicker {
          margin-bottom: 3px;
          color: #777;
          font-size: 8px;
          font-weight: 800;
          letter-spacing: 1.4px;
          text-transform: uppercase;
        }

        .print-title {
          margin: 0;
          font-size: 20px;
          font-weight: 900;
        }

        .print-tracking {
          display: inline-block;
          margin-top: 7px;
          padding: 5px 9px;
          border: 1px solid #ddd;
          border-radius: 999px;
          background: #fff;
          font-size: 10px;
          font-weight: 800;
        }

        .print-meta {
          margin-top: 6px;
          color: #666;
          font-size: 9px;
        }

        .print-divider {
          margin: 14px 0;
          border: 0;
          border-top: 1px dashed #aaa;
        }

        .print-section-title {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 7px;
          color: #222;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: 1px;
          text-transform: uppercase;
        }

        .print-section-title::before {
          content: "";
          display: inline-block;
          width: 4px;
          height: 13px;
          border-radius: 4px;
          background: #111;
        }

        .print-customer,
        .print-payment-card {
          padding: 10px 11px;
          border: 1px solid #e8e8e8;
          border-radius: 10px;
        }

        .print-customer {
          margin-bottom: 10px;
          font-size: 10px;
          line-height: 1.55;
        }

        .print-row {
          display: flex;
          justify-content: space-between;
          gap: 15px;
          padding: 5px 0;
          font-size: 10px;
        }

        .print-row strong {
          font-weight: 800;
          text-align: right;
        }

        .print-address,
        .print-note {
          margin-top: 8px;
          padding: 9px 10px;
          border-radius: 9px;
          background: #f7f7f7;
          font-size: 9px;
          line-height: 1.5;
        }

        .print-address-label {
          margin-bottom: 2px;
          font-size: 8px;
          font-weight: 900;
          letter-spacing: .8px;
          text-transform: uppercase;
        }

        .print-product {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          padding: 8px 0;
          border-bottom: 1px solid #eee;
          font-size: 10px;
        }

        .print-product-info {
          min-width: 0;
        }

        .print-product-name {
          font-weight: 800;
        }

        .print-product-meta {
          margin-top: 2px;
          color: #666;
          font-size: 8px;
        }

        .print-product-price {
          flex-shrink: 0;
          font-weight: 800;
        }

        .print-summary {
          margin-top: 6px;
        }

        .print-total {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          margin-top: 7px;
          padding: 10px 0 2px;
          border-top: 1.5px solid #111;
          font-size: 15px;
          font-weight: 900;
        }

        .print-paid {
          font-weight: 900;
        }

        .print-paid.is-paid {
          color: #16803a;
        }

        .print-paid.is-pending {
          color: #a05a00;
        }

        .print-footer {
          margin-top: 18px;
          padding-top: 10px;
          border-top: 1px solid #eee;
          color: #777;
          font-size: 8px;
          line-height: 1.45;
          text-align: center;
        }

        .print-footer strong {
          color: #333;
        }
      }
    `}</style>

      <div className="order-print-inner">

        <div className="print-restaurant">
          {restaurantLogo ? (
            <img
              src={restaurantLogo}
              alt={restaurantName}
              className="print-logo"
            />
          ) : (
            <div className="print-logo-fallback" aria-hidden="true">
              {String(restaurantName).slice(0, 1).toUpperCase()}
            </div>
          )}

          <h2 className="print-restaurant-name">
            {restaurantName}
          </h2>

          {(restaurantAddress ||
            restaurantCity ||
            restaurantPhone ||
            restaurantEmail) && (
            <div className="print-restaurant-meta">
              {[restaurantAddress, restaurantCity]
                .filter(Boolean)
                .join(" · ")}
              {(restaurantPhone || restaurantEmail) && (
                <>
                  <br />
                  {[restaurantPhone, restaurantEmail]
                    .filter(Boolean)
                    .join(" · ")}
                </>
              )}
            </div>
          )}
        </div>

        <div className="print-order-header">
          <div className="print-kicker">
            Comprobante de pedido
          </div>

          <h1 className="print-title">
            Pedido
          </h1>

          <div className="print-tracking">
            #{order.tracking_code ?? "—"}
          </div>

          <div className="print-meta">
            {date} · {time}
          </div>
        </div>

        <hr className="print-divider" />

        <div className="print-section-title">
          Cliente
        </div>

        <div className="print-customer">
          <strong>
            {order.customer_name ??
              "No registrado"}
          </strong>

          <br />

          {order.customer_phone ??
            "Sin teléfono"}

          {order.customer_email && (
            <>
              <br />
              {order.customer_email}
            </>
          )}
        </div>

        <div className="print-row">
          <span>Tipo</span>

          <strong>
            {formatOrderType(
              order.order_type
            )}
          </strong>
        </div>

        {order.delivery_address && (
          <div className="print-note">
            <strong>
              Dirección
            </strong>
            <br />
            {order.delivery_address}
          </div>
        )}

        {(order.delivery_sector ||
          order.delivery_instructions) && (
          <div className="print-address">
            {order.delivery_sector && (
              <>
                <div className="print-address-label">
                  Sector
                </div>
                {order.delivery_sector}
              </>
            )}

            {order.delivery_instructions && (
              <>
                <div className="print-address-label" style={{ marginTop: order.delivery_sector ? 7 : 0 }}>
                  Instrucciones
                </div>
                {order.delivery_instructions}
              </>
            )}
          </div>
        )}

        <hr className="print-divider" />

        <div className="print-section-title">
          Productos
        </div>

        {products.map(
          (item: any) => {
            const quantity = Number(
              item.quantity ?? 0
            );

            const unitPrice = Number(
              item.unit_price ?? 0
            );

            const itemSubtotal =
              Number(
                item.subtotal ??
                  quantity *
                    unitPrice
              );

            return (
              <div
                key={item.id}
                className="print-product"
              >
                <div className="print-product-info">
                  <div className="print-product-name">
                    {item.products?.name ??
                      "Producto"}
                  </div>

                  <div className="print-product-meta">
                    {quantity} × $
                    {unitPrice.toFixed(
                      2
                    )}
                  </div>
                </div>

                <div className="print-product-price">
                  $
                  {itemSubtotal.toFixed(
                    2
                  )}
                </div>
              </div>
            );
          }
        )}

        <div className="print-summary">
          <div className="print-row">
            <span>
              Productos
            </span>

            <strong>
              {currency(subtotal)}
            </strong>
          </div>

          {deliveryFee > 0 && (
            <div className="print-row">
              <span>
                Domicilio
              </span>

              <strong>
                {currency(deliveryFee)}
              </strong>
            </div>
          )}

        {commission > 0 && (
          <div className="print-row">
            <span>
              Comisión
            </span>

            <strong>
              ${commission.toFixed(2)}
            </strong>
          </div>
        )}

          <div className="print-total">
            <span>Total</span>

            <span>
              {currency(total)}
            </span>
          </div>
        </div>

        <hr className="print-divider" />

        <div className="print-section-title">
          Pago
        </div>

        <div className="print-payment-card">
          <div className="print-row">
            <span>Método</span>

            <strong>
              {paymentMethod(
                order.payment_method
              )}
            </strong>
          </div>

          <div className="print-row">
            <span>Estado</span>

            <strong
              className={`print-paid ${
                order.payment_status === "paid"
                  ? "is-paid"
                  : "is-pending"
              }`}
            >
              {order.payment_status === "paid"
                ? "Pagado"
                : "Pendiente"}
            </strong>
          </div>

        {order.payment_method ===
          "cash" && (
          <>
            <div className="print-row">
              <span>Recibido</span>

              <strong>
                $
                {Number(
                  order.cash_amount ??
                    0
                ).toFixed(2)}
              </strong>
            </div>

            <div className="print-row">
              <span>Cambio</span>

              <strong>
                $
                {Number(
                  order.change_amount ??
                    0
                ).toFixed(2)}
              </strong>
            </div>
          </>
        )}

        </div>

        {order.notes && (
          <>
            <hr className="print-divider" />

            <div className="print-section-title">
              Notas
            </div>

            <div className="print-note">
              {order.notes}
            </div>
          </>
        )}

        <div className="print-footer">
          <strong>{restaurantName}</strong>
          <br />
          Pedido generado desde Wolf
          {order.tracking_code && (
            <>
              {" · "}
              {order.tracking_code}
            </>
          )}
        </div>
      </div>
    </section>
  );
}

function formatOrderType(
  type: string
) {
  const labels: Record<
    string,
    string
  > = {
    delivery: "Delivery",
    pickup: "Pick-up",
    dine_in: "Restaurante",
  };

  return (
    labels[type] ??
    type ??
    "—"
  );
}

function paymentMethod(
  method: string
) {
  switch (method) {
    case "cash":
      return "Efectivo";

    case "qr":
      return "QR";

    case "transfer":
    case "bank_transfer":
      return "Transferencia";

    case "card":
      return "Tarjeta";

    default:
      return method || "Sin método";
  }
}