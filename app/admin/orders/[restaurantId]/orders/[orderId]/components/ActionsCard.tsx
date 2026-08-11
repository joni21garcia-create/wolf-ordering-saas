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

  async function printOrder() {
    /*
     * Android/PWA: window.print() and window.open() are not reliable
     * inside installed PWAs. We therefore create the order as a real PDF
     * in the browser and hand that PDF to the Android share sheet.
     *
     * On Android the user can choose "Imprimir" from the system share/open
     * flow, without leaving Wolf and navigating back to the order.
     *
     * Desktop / browsers without Web Share fall back to the native
     * browser print dialog.
     */
    try {
      const { PDFDocument, StandardFonts, rgb } =
        await import("pdf-lib");

      const pdf = await PDFDocument.create();
      const font = await pdf.embedFont(
        StandardFonts.Helvetica
      );
      const bold = await pdf.embedFont(
        StandardFonts.HelveticaBold
      );

      const pageWidth = 226.77; // 80 mm in points
      const margin = 18;
      const contentWidth =
        pageWidth - margin * 2;

      const escapeText = (value: unknown) =>
        String(value ?? "")
          .replace(/\r?\n/g, " ")
          .trim();

      const money = (value: unknown) =>
        `$${Number(value ?? 0).toFixed(2)}`;

      const wrapText = (
        value: string,
        maxChars: number
      ) => {
        const words = value.split(/\s+/);
        const lines: string[] = [];
        let line = "";

        for (const word of words) {
          const next = line
            ? `${line} ${word}`
            : word;

          if (next.length > maxChars && line) {
            lines.push(line);
            line = word;
          } else {
            line = next;
          }
        }

        if (line) lines.push(line);

        return lines.length
          ? lines
          : [""];
      };

      const products = Array.isArray(
        order.order_items
      )
        ? order.order_items
        : [];

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
              timeZone:
                "America/Bogota",
            }
          )
        : "—";

      const time = created
        ? created.toLocaleTimeString(
            "es-CO",
            {
              hour: "2-digit",
              minute: "2-digit",
              timeZone:
                "America/Bogota",
            }
          )
        : "—";

      const orderType =
        order.order_type ===
        "delivery"
          ? "Delivery"
          : order.order_type ===
              "pickup"
            ? "Pick-up"
            : order.order_type ===
                "dine_in"
              ? "Restaurante"
              : order.order_type ||
                "—";

      const paymentMethod =
        order.payment_method ===
        "cash"
          ? "Efectivo"
          : order.payment_method ===
              "qr"
            ? "QR"
            : order.payment_method ===
                  "transfer" ||
                order.payment_method ===
                  "bank_transfer"
              ? "Transferencia"
              : order.payment_method ===
                  "card"
                ? "Tarjeta"
                : order.payment_method ||
                  "Sin método";

      const subtotal = Number(
        order.subtotal ?? 0
      );

      const commission = Number(
        order.commission_amount ?? 0
      );

      const total = Number(
        order.total ??
          subtotal + commission
      );

      const lineHeight = 12;

      const estimateHeight =
        240 +
        products.length * 30 +
        (order.delivery_address
          ? 35
          : 0) +
        (order.delivery_instructions
          ? 35
          : 0) +
        (order.notes ? 45 : 0);

      const page = pdf.addPage([
        pageWidth,
        estimateHeight,
      ]);

      let y =
        estimateHeight - margin;

      const textColor = rgb(0, 0, 0);
      const gray = rgb(
        0.35,
        0.35,
        0.35
      );

      const draw = (
        value: string,
        options: {
          size?: number;
          font?: typeof font;
          color?: ReturnType<
            typeof rgb
          >;
          x?: number;
        } = {}
      ) => {
        const size =
          options.size ?? 9;

        page.drawText(value, {
          x: options.x ?? margin,
          y,
          size,
          font:
            options.font ?? font,
          color:
            options.color ??
            textColor,
        });

        y -= size + 5;
      };

      const divider = () => {
        page.drawLine({
          start: {
            x: margin,
            y,
          },
          end: {
            x: pageWidth - margin,
            y,
          },
          thickness: 0.6,
          color: gray,
        });

        y -= 10;
      };

      draw("WOLF", {
        size: 16,
        font: bold,
      });

      y -= 2;

      draw("PEDIDO", {
        size: 12,
        font: bold,
      });

      draw(
        `#${escapeText(
          order.tracking_code ?? "—"
        )}`,
        {
          size: 9,
          font: bold,
        }
      );

      draw(`${date} · ${time}`, {
        size: 8,
        color: gray,
      });

      divider();

      draw("CLIENTE", {
        size: 8,
        font: bold,
      });

      draw(
        escapeText(
          order.customer_name ??
            "No registrado"
        ),
        {
          size: 9,
          font: bold,
        }
      );

      draw(
        escapeText(
          order.customer_phone ??
            "Sin teléfono"
        ),
        {
          size: 8,
        }
      );

      if (order.customer_email) {
        draw(
          escapeText(
            order.customer_email
          ),
          {
            size: 8,
          }
        );
      }

      draw(
        `Tipo: ${orderType}`,
        {
          size: 8,
        }
      );

      if (order.delivery_address) {
        draw("DIRECCIÓN", {
          size: 8,
          font: bold,
        });

        for (const line of wrapText(
          escapeText(
            order.delivery_address
          ),
          42
        )) {
          draw(line, {
            size: 8,
          });
        }
      }

      if (
        order.delivery_instructions
      ) {
        draw("INSTRUCCIONES", {
          size: 8,
          font: bold,
        });

        for (const line of wrapText(
          escapeText(
            order.delivery_instructions
          ),
          42
        )) {
          draw(line, {
            size: 8,
          });
        }
      }

      divider();

      draw("PRODUCTOS", {
        size: 8,
        font: bold,
      });

      for (const item of products) {
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

        draw(
          escapeText(
            item.products?.name ??
              "Producto"
          ),
          {
            size: 8,
            font: bold,
          }
        );

        draw(
          `${quantity} × ${money(
            unitPrice
          )}     ${money(
            itemSubtotal
          )}`,
          {
            size: 8,
          }
        );
      }

      y -= 2;

      draw(
        `Productos: ${money(
          subtotal
        )}`,
        {
          size: 8,
        }
      );

      if (commission > 0) {
        draw(
          `Comisión: ${money(
            commission
          )}`,
          {
            size: 8,
          }
        );
      }

      draw(
        `TOTAL: ${money(total)}`,
        {
          size: 11,
          font: bold,
        }
      );

      divider();

      draw("PAGO", {
        size: 8,
        font: bold,
      });

      draw(
        `Método: ${paymentMethod}`,
        {
          size: 8,
        }
      );

      draw(
        `Estado: ${
          order.payment_status ===
          "paid"
            ? "Pagado"
            : "Pendiente"
        }`,
        {
          size: 8,
        }
      );

      if (
        order.payment_method ===
        "cash"
      ) {
        draw(
          `Recibido: ${money(
            order.cash_amount
          )}`,
          {
            size: 8,
          }
        );

        draw(
          `Cambio: ${money(
            order.change_amount
          )}`,
          {
            size: 8,
          }
        );
      }

      if (order.notes) {
        divider();

        draw("NOTAS", {
          size: 8,
          font: bold,
        });

        for (const line of wrapText(
          escapeText(order.notes),
          42
        )) {
          draw(line, {
            size: 8,
          });
        }
      }

      y -= 8;

      draw(
        "Pedido generado desde Wolf",
        {
          size: 7,
          color: gray,
        }
      );

      const pdfBytes =
        await pdf.save();

const blob = new Blob(
  [new Uint8Array(pdfBytes)],
  {
    type: "application/pdf",
  }
);

      const file = new File(
        [blob],
        `pedido-${String(
          order.tracking_code ??
            order.id ??
            "wolf"
        )}.pdf`,
        {
          type:
            "application/pdf",
        }
      );

      const isMobileDevice =
        typeof navigator !== "undefined" &&
        /Android|iPhone|iPad|iPod/i.test(
          navigator.userAgent
        );

      const isStandalonePwa =
        typeof window !== "undefined" &&
        window.matchMedia(
          "(display-mode: standalone)"
        ).matches;

      /*
       * Android/iOS and installed PWA:
       * keep the user inside the app and open
       * the native share sheet with the real PDF.
       *
       * From Android the user can choose the
       * installed printer/print service.
       */
      if (
        (isMobileDevice ||
          isStandalonePwa) &&
        typeof navigator !==
          "undefined" &&
        "share" in navigator &&
        typeof navigator.share ===
          "function"
      ) {
        const canShareFiles =
          "canShare" in navigator
            ? navigator.canShare({
                files: [file],
              })
            : true;

        if (canShareFiles) {
          await navigator.share({
            title: "Pedido Wolf",
            text: `Pedido #${String(
              order.tracking_code ??
                ""
            )}`,
            files: [file],
          });

          return;
        }
      }

      /*
       * Browser fallback:
       * open the generated PDF in the current
       * browser PDF viewer. The browser/OS can
       * then print or save it.
       */
      const url =
        URL.createObjectURL(blob);

      const link =
        document.createElement("a");

      link.href = url;
      link.target = "_blank";
      link.rel =
        "noopener noreferrer";
      link.download =
        file.name;

      document.body.appendChild(
        link
      );

      link.click();

      link.remove();

      window.setTimeout(() => {
        URL.revokeObjectURL(url);
      }, 60000);
    } catch (error) {
      /*
       * Closing/canceling Android's share sheet
       * is not an application error.
       */
      if (
        error instanceof DOMException &&
        error.name ===
          "AbortError"
      ) {
        return;
      }

      console.error(
        "Error generando PDF del pedido:",
        error
      );

      /*
       * Last-resort fallback for desktop
       * browsers with native printing.
       */
      window.print();
    }
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