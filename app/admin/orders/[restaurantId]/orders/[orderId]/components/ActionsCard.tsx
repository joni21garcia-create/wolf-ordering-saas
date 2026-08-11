"use client";

import { useState } from "react";

interface Props {
  order: any;
  onUpdatePayment: (
    orderId: string,
    payment: string
  ) => Promise<void>;
}

export default function ActionsCard({
  order,
  onUpdatePayment,
}: Props) {
  const [copyLabel, setCopyLabel] = useState("Copiar tracking");
  const [activeAction, setActiveAction] = useState<string | null>(null);
  const [localPaymentStatus, setLocalPaymentStatus] =
    useState<string | null>(null);

  const paymentStatus =
    localPaymentStatus ?? order.payment_status;

  function pressAction(action: string) {
    setActiveAction(action);
    window.setTimeout(() => setActiveAction(null), 220);
  }

  async function copy(text?: string) {
    if (!text) return;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        textarea.remove();
      }

      setCopyLabel("✓ Tracking copiado");
      window.setTimeout(() => setCopyLabel("Copiar tracking"), 1800);
    } catch (error) {
      console.error("Error copiando tracking:", error);
      setCopyLabel("No se pudo copiar");
      window.setTimeout(() => setCopyLabel("Copiar tracking"), 1800);
    }
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

  async function handlePaymentToggle() {
    const nextPayment =
      paymentStatus === "paid"
        ? "pending"
        : "paid";

    pressAction("payment");
    setLocalPaymentStatus(nextPayment);

    try {
      await onUpdatePayment(
        String(order.id),
        nextPayment
      );

      window.setTimeout(() => {
        setLocalPaymentStatus(null);
      }, 250);
    } catch (error) {
      setLocalPaymentStatus(null);
      console.error(
        "Error actualizando pago:",
        error
      );
      throw error;
    }
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
       * Android / PWA:
       * Open the generated PDF directly.
       *
       * We intentionally do NOT use navigator.share() first:
       * the requested flow is Wolf -> PDF viewer -> Android "Imprimir".
       */
      const url = URL.createObjectURL(blob);

      /*
       * Mobile/PWA fallback:
       * Open only the generated PDF, never the order page.
       * Android's PDF viewer can expose the system Print action.
       */
      if (isMobileDevice || isStandalonePwa) {
        const opened = window.open(url, "_blank", "noopener,noreferrer");

        if (!opened) {
          window.location.href = url;
        }

        window.setTimeout(() => URL.revokeObjectURL(url), 120000);
        return;
      }

      /*
       * Desktop fallback:
       * Print the generated PDF without navigating away from the order.
       */
      const iframe = document.createElement("iframe");
      iframe.style.position = "fixed";
      iframe.style.width = "1px";
      iframe.style.height = "1px";
      iframe.style.border = "0";
      iframe.style.opacity = "0";
      iframe.src = url;

      document.body.appendChild(iframe);

      iframe.onload = () => {
        window.setTimeout(() => {
          try {
            iframe.contentWindow?.focus();
            iframe.contentWindow?.print();
          } catch (error) {
            console.error("No fue posible abrir la impresión:", error);
            window.open(url, "_blank", "noopener,noreferrer");
          }

          window.setTimeout(() => {
            iframe.remove();
            URL.revokeObjectURL(url);
          }, 3000);
        }, 250);
      };

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

        .action-item.action-pressed {
          transform: translateY(1px) scale(.975);
          background: rgba(249,115,22,.09);
          border-color: rgba(249,115,22,.28);
          color: #fff;
        }

        .action-item.action-pressed .action-arrow {
          color: #f97316;
          transform: translateX(4px);
        }

        .action-arrow {
          flex: 0 0 auto;
          color: #444;
          font-size: 14px;
          transition:
            color .18s ease,
            transform .18s ease;
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

        .payment-action {
          width: 100%;
          min-height: 44px;
          margin-top: 8px;

          display: flex;
          align-items: center;
          justify-content: space-between;

          gap: 12px;
          padding: 0 13px;

          border: 1px solid rgba(249,115,22,.18);
          border-radius: 12px;

          background: rgba(249,115,22,.055);
          color: #d6d6d6;

          font-size: 11px;
          font-weight: 700;

          cursor: pointer;

          transition:
            background .18s ease,
            border-color .18s ease,
            color .18s ease,
            transform .18s ease,
            box-shadow .18s ease;
        }

        .payment-action:hover {
          background: rgba(249,115,22,.10);
          border-color: rgba(249,115,22,.30);
          color: #fff;
        }

        .payment-action.is-paid {
          border-color: rgba(34,197,94,.22);
          background: rgba(34,197,94,.055);
        }

        .payment-action.payment-pressed {
          transform: translateY(1px) scale(.975);
          border-color: rgba(249,115,22,.42);
          box-shadow: 0 0 0 3px rgba(249,115,22,.08);
        }

        .payment-action.is-paid.payment-pressed {
          border-color: rgba(34,197,94,.42);
          box-shadow: 0 0 0 3px rgba(34,197,94,.08);
        }

        .payment-action-left {
          display: flex;
          align-items: center;
          gap: 9px;
        }

        .payment-action-icon {
          width: 25px;
          height: 25px;

          display: flex;
          align-items: center;
          justify-content: center;

          border-radius: 8px;
          background: rgba(255,255,255,.045);
          font-size: 12px;
        }

        .payment-action-arrow {
          font-size: 14px;
          color: #f97316;

          transition:
            transform .18s ease,
            color .18s ease;
        }

        .payment-action.payment-pressed
          .payment-action-arrow {
          transform: translateX(4px);
        }

        .payment-action.is-paid
          .payment-action-arrow {
          color: #22c55e;
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

        .action-pressed-link {
          color: #f97316 !important;
          transform: translateX(2px);
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
          className={`action-item ${activeAction === "print" ? "action-pressed" : ""}`}
          onClick={() => {
            pressAction("print");
            void printOrder();
          }}
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
          className={`action-item ${activeAction === "tracking" ? "action-pressed" : ""}`}
          onClick={() => {
            pressAction("tracking");
            void copy(order.tracking_code);
          }}
          disabled={
            !order.tracking_code
          }
        >
          <span className="action-left">
            <span className="action-icon">
              #
            </span>

            <span className="action-label">
              {copyLabel}
            </span>
          </span>

          <span className="action-arrow">
            →
          </span>
        </button>

        {/* LLAMAR */}

        <button
          type="button"
          className={`action-item ${activeAction === "call" ? "action-pressed" : ""}`}
          onClick={() => {
            pressAction("call");
            callCustomer();
          }}
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
          className={`action-item ${activeAction === "whatsapp" ? "action-pressed" : ""}`}
          onClick={() => {
            pressAction("whatsapp");
            whatsapp();
          }}
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

      {/* PAGO */}

      <button
        type="button"
        className={`payment-action ${
          activeAction === "payment"
            ? "payment-pressed"
            : ""
        } ${
          paymentStatus === "paid"
            ? "is-paid"
            : ""
        }`}
        onClick={() => {
          void handlePaymentToggle();
        }}
        aria-label={
          paymentStatus === "paid"
            ? "Marcar pago como pendiente"
            : "Marcar pedido como pagado"
        }
      >
        <span className="payment-action-left">
          <span className="payment-action-icon">
            💳
          </span>

          <span>
            {paymentStatus === "paid"
              ? "Pagado"
              : "Marcar pagado"}
          </span>
        </span>

        <span className="payment-action-arrow">
          {paymentStatus === "paid"
            ? "✓"
            : "→"}
        </span>
      </button>

      {/* MAPA */}

      {hasMap && (
        <button
          type="button"
          className={`action-link map-action ${activeAction === "map" ? "action-pressed-link" : ""}`}
          onClick={() => {
            pressAction("map");
            openMap();
          }}
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