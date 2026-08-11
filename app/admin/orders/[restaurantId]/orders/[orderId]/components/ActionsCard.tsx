"use client";

interface Props {
  order: any;
}

export default function ActionsCard({
  order,
}: Props) {
  function copy(text?: string) {
    if (!text) return;

    navigator.clipboard.writeText(text);
  }

  function callCustomer() {
    if (!order.customer_phone) return;

    window.location.href =
      `tel:${order.customer_phone}`;
  }

  function whatsapp() {
    if (!order.customer_phone) return;

    const phone =
      order.customer_phone.replace(
        /\D/g,
        ""
      );

    window.open(
      `https://wa.me/${phone}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function printOrder() {
    /*
     * Impresión compatible con Android, PWA y navegador.
     * No dependemos de window.open(url) ni de ?print=order:
     * construimos un documento de impresión independiente.
     */
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      window.print();
      return;
    }

    const products = Array.isArray(order.order_items)
      ? order.order_items
      : [];

    const money = (value: unknown) =>
      `$${Number(value ?? 0).toFixed(2)}`;

    const escapeHtml = (value: unknown) =>
      String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

    const created = order.created_at
      ? new Date(order.created_at)
      : null;

    const date = created
      ? created.toLocaleDateString("es-CO", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
          timeZone: "America/Bogota",
        })
      : "—";

    const time = created
      ? created.toLocaleTimeString("es-CO", {
          hour: "2-digit",
          minute: "2-digit",
          timeZone: "America/Bogota",
        })
      : "—";

    const orderType =
      order.order_type === "delivery"
        ? "Delivery"
        : order.order_type === "pickup"
          ? "Pick-up"
          : order.order_type === "dine_in"
            ? "Restaurante"
            : order.order_type || "—";

    const paymentMethod =
      order.payment_method === "cash"
        ? "Efectivo"
        : order.payment_method === "qr"
          ? "QR"
          : order.payment_method === "transfer" ||
              order.payment_method === "bank_transfer"
            ? "Transferencia"
            : order.payment_method === "card"
              ? "Tarjeta"
              : order.payment_method || "Sin método";

    const subtotal = Number(order.subtotal ?? 0);
    const commission = Number(order.commission_amount ?? 0);
    const total = Number(
      order.total ?? subtotal + commission
    );

    const productsHtml = products
      .map((item: any) => {
        const quantity = Number(item.quantity ?? 0);
        const unitPrice = Number(item.unit_price ?? 0);
        const itemSubtotal = Number(
          item.subtotal ?? quantity * unitPrice
        );

        return `
          <div class="product">
            <div>
              <div class="product-name">
                ${escapeHtml(item.products?.name ?? "Producto")}
              </div>
              <div class="product-meta">
                ${quantity} × ${money(unitPrice)}
              </div>
            </div>
            <strong>${money(itemSubtotal)}</strong>
          </div>
        `;
      })
      .join("");

    printWindow.document.open();
    printWindow.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="utf-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />
          <title>Pedido #${escapeHtml(
            order.tracking_code ?? ""
          )}</title>

          <style>
            * { box-sizing: border-box; }

            html, body {
              margin: 0;
              padding: 0;
              background: #fff;
              color: #000;
              font-family: Arial, Helvetica, sans-serif;
            }

            body { padding: 18px; }

            .ticket {
              width: 100%;
              max-width: 420px;
              margin: 0 auto;
            }

            .brand {
              margin-bottom: 16px;
              text-align: center;
              font-size: 20px;
              font-weight: 800;
            }

            h1 {
              margin: 0;
              text-align: center;
              font-size: 18px;
            }

            .tracking {
              margin-top: 5px;
              text-align: center;
              font-size: 13px;
              font-weight: 700;
            }

            .meta {
              margin-top: 5px;
              text-align: center;
              color: #555;
              font-size: 10px;
            }

            .divider {
              margin: 15px 0;
              border: 0;
              border-top: 1px dashed #999;
            }

            .section-title {
              margin-bottom: 7px;
              font-size: 10px;
              font-weight: 800;
              text-transform: uppercase;
            }

            .customer, .note {
              margin-bottom: 12px;
              font-size: 11px;
              line-height: 1.5;
            }

            .row, .product, .total {
              display: flex;
              justify-content: space-between;
              gap: 15px;
            }

            .row {
              padding: 5px 0;
              font-size: 11px;
            }

            .product {
              padding: 7px 0;
              border-bottom: 1px solid #eee;
              font-size: 11px;
            }

            .product-name { font-weight: 700; }

            .product-meta {
              margin-top: 2px;
              color: #555;
              font-size: 9px;
            }

            .total {
              margin-top: 9px;
              padding-top: 10px;
              border-top: 1px solid #000;
              font-size: 14px;
              font-weight: 800;
            }

            .footer {
              margin-top: 22px;
              color: #666;
              text-align: center;
              font-size: 9px;
            }

            .print-actions {
              display: flex;
              justify-content: center;
              gap: 8px;
              margin: 18px auto 0;
              max-width: 420px;
            }

            .print-actions button {
              min-height: 42px;
              padding: 0 18px;
              border: 0;
              border-radius: 10px;
              background: #111;
              color: #fff;
              font-weight: 700;
              cursor: pointer;
            }

            @media print {
              body { padding: 0; }
              .print-actions { display: none !important; }
              .ticket { max-width: none; }
            }
          </style>
        </head>

        <body>
          <main class="ticket">
            <div class="brand">WOLF</div>
            <h1>Pedido</h1>

            <div class="tracking">
              #${escapeHtml(order.tracking_code ?? "—")}
            </div>

            <div class="meta">
              ${escapeHtml(date)} · ${escapeHtml(time)}
            </div>

            <hr class="divider" />

            <div class="section-title">Cliente</div>

            <div class="customer">
              <strong>
                ${escapeHtml(order.customer_name ?? "No registrado")}
              </strong>
              <br />
              ${escapeHtml(order.customer_phone ?? "Sin teléfono")}
              ${
                order.customer_email
                  ? `<br />${escapeHtml(order.customer_email)}`
                  : ""
              }
            </div>

            <div class="row">
              <span>Tipo</span>
              <strong>${escapeHtml(orderType)}</strong>
            </div>

            ${
              order.delivery_address
                ? `
                  <div class="note">
                    <strong>Dirección</strong><br />
                    ${escapeHtml(order.delivery_address)}
                  </div>
                `
                : ""
            }

            ${
              order.delivery_instructions
                ? `
                  <div class="note">
                    <strong>Instrucciones</strong><br />
                    ${escapeHtml(order.delivery_instructions)}
                  </div>
                `
                : ""
            }

            <hr class="divider" />

            <div class="section-title">Productos</div>

            ${productsHtml}

            <div class="row">
              <span>Productos</span>
              <strong>${money(subtotal)}</strong>
            </div>

            ${
              commission > 0
                ? `
                  <div class="row">
                    <span>Comisión</span>
                    <strong>${money(commission)}</strong>
                  </div>
                `
                : ""
            }

            <div class="total">
              <span>Total</span>
              <span>${money(total)}</span>
            </div>

            <hr class="divider" />

            <div class="section-title">Pago</div>

            <div class="row">
              <span>Método</span>
              <strong>${escapeHtml(paymentMethod)}</strong>
            </div>

            <div class="row">
              <span>Estado</span>
              <strong>
                ${
                  order.payment_status === "paid"
                    ? "Pagado"
                    : "Pendiente"
                }
              </strong>
            </div>

            ${
              order.payment_method === "cash"
                ? `
                  <div class="row">
                    <span>Recibido</span>
                    <strong>${money(order.cash_amount)}</strong>
                  </div>

                  <div class="row">
                    <span>Cambio</span>
                    <strong>${money(order.change_amount)}</strong>
                  </div>
                `
                : ""
            }

            ${
              order.notes
                ? `
                  <hr class="divider" />

                  <div class="section-title">Notas</div>

                  <div class="note">
                    ${escapeHtml(order.notes)}
                  </div>
                `
                : ""
            }

            <div class="footer">
              Pedido generado desde Wolf
            </div>
          </main>

          <div class="print-actions">
            <button type="button" onclick="window.print()">
              🖨 Imprimir
            </button>

            <button type="button" onclick="window.close()">
              Cerrar
            </button>
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    printWindow.onload = () => {
      window.setTimeout(() => {
        printWindow.focus();
        printWindow.print();
      }, 350);
    };
  }

  function openMap() {
    if (!order.delivery_address) return;

    const url =
      `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        order.delivery_address
      )}`;

    window.open(
      url,
      "_blank",
      "noopener,noreferrer"
    );
  }

  const hasPhone =
    Boolean(order.customer_phone);

  const hasMap =
    Boolean(order.delivery_address);

  const proofUrl =
    order.payment_proof_url ||
    order.proof_url;

  return (
    <section className="order-actions">
      <style>{`
        .order-actions {
          width: 100%;
          margin-top: 2px;

          color: #fff;
        }

        .actions-title {
          margin-bottom: 10px;

          color: #555;

          font-size: 10px;
          font-weight: 700;

          letter-spacing: 1.5px;
          text-transform: uppercase;
        }

        /*
        ============================================
        ACTION GRID
        ============================================
        */

        .actions-grid {
          display: grid;

          grid-template-columns:
            repeat(2, minmax(0, 1fr));

          gap: 8px;
        }

        .action-item {
          min-width: 0;

          min-height: 48px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 10px;

          padding:
            0
            13px;

          border:
            1px solid
            rgba(255,255,255,.065);

          border-radius: 13px;

          background:
            rgba(255,255,255,.022);

          color: #bcbcbc;

          font-size: 11px;
          font-weight: 600;

          cursor: pointer;

          transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease;
        }

        .action-item:hover:not(:disabled) {
          background:
            rgba(255,255,255,.05);

          border-color:
            rgba(255,255,255,.11);

          color: #fff;
        }

        .action-item:active:not(:disabled) {
          transform: scale(.98);
        }

        .action-item:disabled {
          cursor: default;
          opacity: .35;
        }

        .action-left {
          min-width: 0;

          display: flex;
          align-items: center;

          gap: 9px;
        }

        .action-icon {
          width: 25px;
          height: 25px;

          flex: 0 0 25px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;

          background:
            rgba(255,255,255,.045);

          color: #999;

          font-size: 12px;
        }

        .action-label {
          overflow: hidden;

          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .action-arrow {
          flex: 0 0 auto;

          color: #444;

          font-size: 14px;
        }

        /*
        ============================================
        SECONDARY ACTIONS
        ============================================
        */

        .action-link {
          width: 100%;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 16px;

          min-height: 48px;

          padding:
            0
            2px;

          border: 0;
          border-bottom:
            1px solid
            rgba(255,255,255,.045);

          background: transparent;

          color: #777;

          font-size: 11px;
          font-weight: 600;

          text-decoration: none;

          cursor: pointer;

          transition:
            color .18s ease;
        }

        .action-link:first-of-type {
          margin-top: 9px;
        }

        .action-link:hover {
          color: #fff;
        }

        .action-link-left {
          display: flex;
          align-items: center;

          gap: 9px;
        }

        .action-link-icon {
          color: #888;

          font-size: 13px;
        }

        .action-link-arrow {
          color: #444;

          font-size: 16px;
        }

        /*
        ============================================
        MAP
        ============================================
        */

        .map-action {
          color: #aaa;
        }

        .map-action .action-link-icon {
          color: #999;
        }

        /*
        ============================================
        PROOF
        ============================================
        */

        .proof-action {
          color: #888;
        }

        /*
        ============================================
        MOBILE
        ============================================
        */

        @media (max-width: 360px) {
          .action-item {
            padding: 0 10px;
            font-size: 10px;
          }

          .action-icon {
            width: 23px;
            height: 23px;
            flex-basis: 23px;
          }

          .action-left {
            gap: 7px;
          }
        }

        /*
        ============================================
        PRINT
        ============================================
        */

        @media print {
          .order-actions {
            display: none !important;
          }
        }

        /*
         * Dedicated print mode used by mobile/PWA.
         * The order print component remains responsible for rendering
         * the actual ticket/order content.
         */
        @media screen {
          body[data-print-order="true"] .order-actions {
            display: none !important;
          }
        }
      `}</style>

      <div className="actions-title">
        Acciones
      </div>

      <div className="actions-grid">

        {/* IMPRIMIR */}

        <button
          type="button"
          className="action-item"
          onClick={printOrder}
          aria-label="Imprimir pedido"
        >
          <span className="action-left">
            <span className="action-icon">
              🖨
            </span>

              <span className="action-label">
               Imprimir pedido
              </span>
          </span>

          <span className="action-arrow">
            →
          </span>
        </button>

        {/* TRACKING */}

        <button
          type="button"
          className="action-item"
          onClick={() =>
            copy(order.tracking_code)
          }
          disabled={
            !order.tracking_code
          }
        >
          <span className="action-left">
            <span className="action-icon">
              #
            </span>

            <span className="action-label">
              Copiar tracking
            </span>
          </span>

          <span className="action-arrow">
            →
          </span>
        </button>

        {/* LLAMAR */}

        <button
          type="button"
          className="action-item"
          onClick={callCustomer}
          disabled={!hasPhone}
        >
          <span className="action-left">
            <span className="action-icon">
              ☎
            </span>

            <span className="action-label">
              Llamar
            </span>
          </span>

          <span className="action-arrow">
            →
          </span>
        </button>

        {/* WHATSAPP */}

        <button
          type="button"
          className="action-item"
          onClick={whatsapp}
          disabled={!hasPhone}
        >
          <span className="action-left">
            <span className="action-icon">
              ◌
            </span>

            <span className="action-label">
              WhatsApp
            </span>
          </span>

          <span className="action-arrow">
            →
          </span>
        </button>
      </div>

      {/* MAPA */}

      {hasMap && (
        <button
          type="button"
          className="action-link map-action"
          onClick={openMap}
        >
          <span className="action-link-left">
            <span className="action-link-icon">
              📍
            </span>

            <span>
              Abrir ubicación en Maps
            </span>
          </span>

          <span className="action-link-arrow">
            →
          </span>
        </button>
      )}

      {/* COMPROBANTE */}

      {proofUrl && (
        <a
          href={proofUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="action-link proof-action"
        >
          <span className="action-link-left">
            <span className="action-link-icon">
              ◉
            </span>

            <span>
              Ver comprobante de pago
            </span>
          </span>

          <span className="action-link-arrow">
            →
          </span>
        </a>
      )}

      {/* DESCARGAR COMPROBANTE */}

      {proofUrl && (
        <a
          href={proofUrl}
          download
          className="action-link proof-action"
        >
          <span className="action-link-left">
            <span className="action-link-icon">
              ↓
            </span>

            <span>
              Descargar comprobante
            </span>
          </span>

          <span className="action-link-arrow">
            →
          </span>
        </a>
      )}
    </section>
  );
}