interface Props {
  order: any;
}

export default function OrderPrintView({
  order,
}: Props) {
  const products = order.order_items ?? [];

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

      @media print {

        .wolf-order-container {
          display: none !important;
        }

        .order-print {
          display: block !important;

          width: 100%;

          padding: 0;

          color: #000;

          background: #fff;

          font-family:
            Arial,
            Helvetica,
            sans-serif;
        }

        .order-print-inner {
          width: 100%;
          max-width: 420px;

          margin: 0 auto;
          padding: 18px;
        }

        .print-brand {
          margin-bottom: 18px;

          font-size: 20px;
          font-weight: 800;

          text-align: center;
        }

        .print-title {
          margin: 0;

          font-size: 18px;
          font-weight: 800;

          text-align: center;
        }

        .print-tracking {
          margin-top: 5px;

          font-size: 13px;
          font-weight: 700;

          text-align: center;
        }

        .print-meta {
          margin-top: 5px;

          color: #555;

          font-size: 10px;

          text-align: center;
        }

        .print-divider {
          margin: 15px 0;

          border: 0;
          border-top: 1px dashed #999;
        }

        .print-section-title {
          margin-bottom: 7px;

          font-size: 10px;
          font-weight: 800;

          text-transform: uppercase;
        }

        .print-customer {
          margin-bottom: 14px;

          font-size: 11px;
          line-height: 1.5;
        }

        .print-row {
          display: flex;
          justify-content: space-between;

          gap: 15px;

          padding: 5px 0;

          font-size: 11px;
        }

        .print-row strong {
          font-weight: 700;
        }

        .print-product {
          display: flex;
          justify-content: space-between;

          gap: 12px;

          padding: 7px 0;

          border-bottom:
            1px solid #eee;

          font-size: 11px;
        }

        .print-product-info {
          min-width: 0;
        }

        .print-product-name {
          font-weight: 700;
        }

        .print-product-meta {
          margin-top: 2px;

          color: #555;

          font-size: 9px;
        }

        .print-product-price {
          flex-shrink: 0;

          font-weight: 700;
        }

        .print-total {
          display: flex;
          justify-content: space-between;

          margin-top: 9px;
          padding-top: 10px;

          border-top:
            1px solid #000;

          font-size: 14px;
          font-weight: 800;
        }

        .print-note {
          margin-top: 12px;

          font-size: 10px;
          line-height: 1.45;
        }

        .print-footer {
          margin-top: 22px;

          color: #666;

          font-size: 9px;

          text-align: center;
        }
      }
    `}</style>

      <div className="order-print-inner">

        <div className="print-brand">
          WOLF
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

        {order.delivery_instructions && (
          <div className="print-note">
            <strong>
              Instrucciones
            </strong>
            <br />
            {order.delivery_instructions}
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

        <div className="print-row">
          <span>
            Productos
          </span>

          <strong>
            ${subtotal.toFixed(2)}
          </strong>
        </div>

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
            ${total.toFixed(2)}
          </span>
        </div>

        <hr className="print-divider" />

        <div className="print-section-title">
          Pago
        </div>

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

          <strong>
            {order.payment_status ===
            "paid"
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
          Pedido generado desde Wolf
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