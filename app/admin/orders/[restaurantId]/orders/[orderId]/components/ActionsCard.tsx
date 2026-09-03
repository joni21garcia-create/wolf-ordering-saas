"use client";

import { useState } from "react";
import { Printer } from "@capgo/capacitor-printer";
import ProofDownloadButton from "@/components/restaurant/ProofDownloadButton";

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
     * ANDROID:
     * No se toca el flujo nativo que ya funciona.
     * Solo Android genera el PDF y lo entrega al PrintManager.
     */
    const isNativeAndroid =
      typeof window !== "undefined" &&
      Boolean((window as any).Capacitor?.isNativePlatform?.()) &&
      (window as any).Capacitor?.getPlatform?.() === "android";

    if (isNativeAndroid) {
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

        const pageWidth = 226.77;
        const margin = 18;

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
          return lines.length ? lines : [""];
        };

        const products = Array.isArray(order.order_items)
          ? order.order_items
          : [];

        const restaurant =
          order.restaurant ??
          order.restaurants ??
          order.restaurant_info ??
          {};

        const restaurantName =
          restaurant.name ??
          order.restaurant_name ??
          order.restaurant?.name ??
          "WOLF";

        const restaurantPhone =
          restaurant.phone ??
          restaurant.phone_number ??
          order.restaurant_phone ??
          null;

        const restaurantEmail =
          restaurant.email ??
          order.restaurant_email ??
          null;

        const restaurantAddress =
          restaurant.address ??
          restaurant.address_line ??
          order.restaurant_address ??
          null;

        const restaurantLogo =
          restaurant.logo_url ??
          restaurant.logo ??
          restaurant.image_url ??
          order.restaurant_logo_url ??
          null;

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
        const commission = Number(
          order.commission_amount ?? 0
        );
        const deliveryFee = Number(
          order.delivery_fee ?? 0
        );
        const total = Number(
          order.total ?? subtotal + deliveryFee + commission
        );

        const estimateHeight =
          315 +
          products.length * 30 +
          (restaurantAddress ? 35 : 0) +
          (restaurantPhone ? 16 : 0) +
          (restaurantEmail ? 16 : 0) +
          (restaurantLogo ? 42 : 0) +
          (order.delivery_address ? 35 : 0) +
          (order.delivery_instructions ? 35 : 0) +
          (order.notes ? 45 : 0);

        const page = pdf.addPage([
          pageWidth,
          estimateHeight,
        ]);

        let y = estimateHeight - margin;

        const textColor = rgb(0, 0, 0);
        const gray = rgb(0.35, 0.35, 0.35);

        const draw = (
          value: string,
          options: {
            size?: number;
            font?: typeof font;
            color?: ReturnType<typeof rgb>;
            x?: number;
          } = {}
        ) => {
          const size = options.size ?? 9;

          page.drawText(value, {
            x: options.x ?? margin,
            y,
            size,
            font: options.font ?? font,
            color: options.color ?? textColor,
          });

          y -= size + 5;
        };

        const divider = () => {
          page.drawLine({
            start: { x: margin, y },
            end: { x: pageWidth - margin, y },
            thickness: 0.6,
            color: gray,
          });

          y -= 10;
        };

        if (restaurantLogo) {
          try {
            const response = await fetch(
              String(restaurantLogo)
            );

            if (response.ok) {
              const imageBytes =
                new Uint8Array(
                  await response.arrayBuffer()
                );

              const contentType =
                response.headers.get("content-type") ?? "";

              const image = contentType.includes("png")
                ? await pdf.embedPng(imageBytes)
                : await pdf.embedJpg(imageBytes);

              const scale = Math.min(
                1,
                42 / image.width,
                42 / image.height
              );

              const width = image.width * scale;
              const height = image.height * scale;

              page.drawImage(image, {
                x: (pageWidth - width) / 2,
                y: y - height + 4,
                width,
                height,
              });

              y -= height + 10;
            }
          } catch (logoError) {
            console.warn(
              "No se pudo incrustar el logo del restaurante:",
              logoError
            );
          }
        }

        draw(escapeText(restaurantName), {
          size: 15,
          font: bold,
        });

        if (restaurantAddress) {
          for (const line of wrapText(
            escapeText(restaurantAddress),
            42
          )) {
            draw(line, {
              size: 7,
              color: gray,
            });
          }
        }

        if (restaurantPhone) {
          draw(`Tel: ${escapeText(restaurantPhone)}`, {
            size: 7,
            color: gray,
          });
        }

        if (restaurantEmail) {
          draw(escapeText(restaurantEmail), {
            size: 7,
            color: gray,
          });
        }

        y -= 3;

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

        draw("DATOS DEL CLIENTE", {
          size: 8,
          font: bold,
        });

        draw(
          escapeText(
            order.customer_name ?? "No registrado"
          ),
          {
            size: 9,
            font: bold,
          }
        );

        draw(
          escapeText(
            order.customer_phone ?? "Sin teléfono"
          ),
          { size: 8 }
        );

        if (order.customer_email) {
          draw(
            escapeText(order.customer_email),
            { size: 8 }
          );
        }

        draw(`Tipo: ${orderType}`, {
          size: 8,
        });

        if (order.delivery_address) {
          draw("DIRECCIÓN", {
            size: 8,
            font: bold,
          });

          for (const line of wrapText(
            escapeText(order.delivery_address),
            42
          )) {
            draw(line, { size: 8 });
          }
        }

        if (order.delivery_instructions) {
          draw("INSTRUCCIONES", {
            size: 8,
            font: bold,
          });

          for (const line of wrapText(
            escapeText(order.delivery_instructions),
            42
          )) {
            draw(line, { size: 8 });
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

          const itemSubtotal = Number(
            item.subtotal ??
              quantity * unitPrice
          );

          draw(
            escapeText(
              item.products?.name ?? "Producto"
            ),
            {
              size: 8,
              font: bold,
            }
          );

          draw(
            `${quantity} × ${money(
              unitPrice
            )}     ${money(itemSubtotal)}`,
            { size: 8 }
          );
        }

        y -= 2;

        draw(
          `Productos: ${money(subtotal)}`,
          { size: 8 }
        );

        if (deliveryFee > 0) {
          draw(
            `Domicilio: ${money(deliveryFee)}`,
            { size: 8 }
          );
        }

        if (commission > 0) {
          draw(
            `Comisión: ${money(commission)}`,
            { size: 8 }
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
          { size: 8 }
        );

        draw(
          `Estado: ${
            order.payment_status === "paid"
              ? "Pagado"
              : "Pendiente"
          }`,
          { size: 8 }
        );

        if (order.payment_method === "cash") {
          draw(
            `Recibido: ${money(
              order.cash_amount
            )}`,
            { size: 8 }
          );

          draw(
            `Cambio: ${money(
              order.change_amount
            )}`,
            { size: 8 }
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
            draw(line, { size: 8 });
          }
        }

        y -= 8;

        draw("Pedido generado desde Wolf", {
          size: 7,
          color: gray,
        });

        const pdfBytes = await pdf.save();

        let binary = "";
        const bytes = new Uint8Array(pdfBytes);
        const chunkSize = 0x8000;

        for (
          let i = 0;
          i < bytes.length;
          i += chunkSize
        ) {
          binary += String.fromCharCode(
            ...bytes.subarray(
              i,
              Math.min(
                i + chunkSize,
                bytes.length
              )
            )
          );
        }

        const base64 = btoa(binary);

        await Printer.printBase64({
          name: `Pedido ${String(
            order.tracking_code ??
              order.id ??
              "Wolf"
          )}`,
          data: base64,
          mimeType: "application/pdf",
        });

        return;
      } catch (error) {
        console.error(
          "Error generando/imprimiendo pedido Android:",
          error
        );
        return;
      }
    }

    /*
     * PWA / navegador:
     * NO generamos un PDF ni abrimos una pestaña intermedia.
     * Abrimos directamente el diálogo de impresión del navegador.
     *
     * La hoja .wolf-pwa-print-sheet es visible únicamente durante print,
     * por lo que el usuario imprime el comprobante y puede elegir
     * impresora o "Guardar como PDF".
     */
    try {
      // Use the dedicated OrderPrintView for both normal web and PWA.
      // Keeping the printable view in the document (instead of opening a
      // popup) also works when the app is installed as a standalone PWA.
      document.body.setAttribute(
        "data-print-order",
        "true"
      );

      const cleanup = () => {
        document.body.removeAttribute(
          "data-print-order"
        );
      };

      window.addEventListener(
        "afterprint",
        cleanup,
        { once: true }
      );

      // Give the browser one frame to apply the print view before opening
      // its print manager.
      window.requestAnimationFrame(() => {
        window.setTimeout(() => {
          window.print();
        }, 80);
      });

      window.setTimeout(cleanup, 120000);
    } catch (error) {
      console.error(
        "No fue posible abrir la impresión PWA:",
        error
      );

      document.body.removeAttribute(
        "data-wolf-pwa-print"
      );

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

        .action-item:first-child {
          position: relative;
          overflow: hidden;
        }

        .action-item:first-child::after {
          content: "";
          position: absolute;
          inset: 0;
          transform: translateX(-120%);
          background: linear-gradient(
            105deg,
            transparent 35%,
            rgba(255,255,255,.07) 50%,
            transparent 65%
          );
          transition: transform .45s ease;
          pointer-events: none;
        }

        .action-item:first-child:hover::after {
          transform: translateX(120%);
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


        .wolf-pwa-print-sheet {
          display: none;
        }

        @media print {
          body[data-wolf-pwa-print] {
            background: #fff !important;
          }

          body[data-wolf-pwa-print] * {
            visibility: hidden !important;
          }

          body[data-wolf-pwa-print]
            .wolf-pwa-print-sheet,
          body[data-wolf-pwa-print]
            .wolf-pwa-print-sheet * {
            visibility: visible !important;
          }

          body[data-wolf-pwa-print]
            .wolf-pwa-print-sheet {
            display: block !important;
            position: absolute !important;
            inset: 0 !important;
            width: 100% !important;
            background: #fff !important;
            color: #111 !important;
            font-family: Arial, Helvetica, sans-serif !important;
          }

          body[data-wolf-pwa-print]
            .wolf-pwa-print-page {
            width: 100%;
            max-width: 760px;
            margin: 0 auto;
            padding: 28px;
            box-sizing: border-box;
            background: #fff;
          }

          .wolf-pwa-print-brand {
            display: flex;
            align-items: center;
            gap: 14px;
            padding-bottom: 18px;
            border-bottom: 1px solid #e8e8e8;
          }

          .wolf-pwa-print-logo {
            width: 48px;
            height: 48px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex: 0 0 48px;
            border-radius: 13px;
            background: #111;
            color: #fff;
            font-size: 20px;
            font-weight: 900;
          }

          .wolf-pwa-print-restaurant {
            font-size: 17px;
            font-weight: 900;
          }

          .wolf-pwa-print-muted {
            margin-top: 2px;
            color: #777;
            font-size: 9px;
          }

          .wolf-pwa-print-heading {
            display: flex;
            justify-content: space-between;
            align-items: flex-end;
            gap: 20px;
            padding: 20px 0 14px;
          }

          .wolf-pwa-print-kicker {
            margin-bottom: 4px;
            color: #777;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1.3px;
          }

          .wolf-pwa-print-title {
            font-size: 22px;
            font-weight: 900;
          }

          .wolf-pwa-print-date {
            color: #666;
            font-size: 9px;
            white-space: nowrap;
          }

          .wolf-pwa-print-grid {
            display: grid;
            grid-template-columns: repeat(4, 1fr);
            gap: 8px;
            margin-bottom: 12px;
          }

          .wolf-pwa-print-grid > div {
            min-width: 0;
            padding: 10px;
            border: 1px solid #e8e8e8;
            border-radius: 10px;
          }

          .wolf-pwa-print-grid span {
            display: block;
            margin-bottom: 4px;
            color: #777;
            font-size: 8px;
            text-transform: uppercase;
            letter-spacing: .6px;
          }

          .wolf-pwa-print-grid strong {
            display: block;
            font-size: 10px;
          }

          .wolf-pwa-print-box {
            margin-top: 10px;
            padding: 12px;
            border: 1px solid #e8e8e8;
            border-radius: 11px;
            font-size: 9px;
            line-height: 1.55;
          }

          .wolf-pwa-print-box-title {
            margin-bottom: 7px;
            font-size: 8px;
            font-weight: 900;
            letter-spacing: 1px;
          }

          .wolf-pwa-print-item {
            display: flex;
            justify-content: space-between;
            gap: 18px;
            padding: 9px 0;
            border-bottom: 1px solid #eee;
          }

          .wolf-pwa-print-item:last-child {
            border-bottom: 0;
          }

          .wolf-pwa-print-item strong {
            display: block;
            font-size: 10px;
          }

          .wolf-pwa-print-item span {
            display: block;
            margin-top: 2px;
            color: #777;
            font-size: 8px;
          }

          .wolf-pwa-print-totals {
            width: 290px;
            margin: 14px 0 0 auto;
          }

          .wolf-pwa-print-totals > div {
            display: flex;
            justify-content: space-between;
            padding: 5px 0;
            font-size: 9px;
          }

          .wolf-pwa-print-total {
            margin-top: 5px;
            padding-top: 9px !important;
            border-top: 1.5px solid #111;
            font-size: 15px !important;
            font-weight: 900;
          }

          .wolf-pwa-print-footer-info {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 18px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            color: #555;
            font-size: 8px;
          }

          .wolf-pwa-print-footer {
            display: flex;
            justify-content: space-between;
            gap: 15px;
            margin-top: 18px;
            padding-top: 10px;
            border-top: 1px solid #eee;
            color: #777;
            font-size: 8px;
          }

          @page {
            margin: 10mm;
          }
        }

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
        <ProofDownloadButton
          url={proofUrl}
          fileName={`comprobante-${String(order.id ?? "pago")}`}
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
        </ProofDownloadButton>
      )}
      <div className="wolf-pwa-print-sheet" aria-hidden="true">
        <div className="wolf-pwa-print-page">
          <div className="wolf-pwa-print-brand">
            <div className="wolf-pwa-print-logo">
              {String(
                order.restaurant?.name ??
                  order.restaurant_name ??
                  "W"
              ).slice(0, 1).toUpperCase()}
            </div>

            <div>
              <div className="wolf-pwa-print-restaurant">
                {order.restaurant?.name ??
                  order.restaurant_name ??
                  "WOLF"}
              </div>

              {(order.restaurant?.address ??
                order.restaurant_address) && (
                <div className="wolf-pwa-print-muted">
                  {order.restaurant?.address ??
                    order.restaurant_address}
                </div>
              )}

              {(order.restaurant?.phone ??
                order.restaurant_phone) && (
                <div className="wolf-pwa-print-muted">
                  Tel.{" "}
                  {order.restaurant?.phone ??
                    order.restaurant_phone}
                </div>
              )}
            </div>
          </div>

          <div className="wolf-pwa-print-heading">
            <div>
              <div className="wolf-pwa-print-kicker">
                COMPROBANTE DE PEDIDO
              </div>
              <div className="wolf-pwa-print-title">
                Pedido #
                {order.tracking_code ?? "—"}
              </div>
            </div>

            <div className="wolf-pwa-print-date">
              {order.created_at
                ? new Date(
                    order.created_at
                  ).toLocaleString("es-CO", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })
                : "—"}
            </div>
          </div>

          <div className="wolf-pwa-print-grid">
            <div>
              <span>Cliente</span>
              <strong>
                {order.customer_name ??
                  "No registrado"}
              </strong>
            </div>

            <div>
              <span>Teléfono</span>
              <strong>
                {order.customer_phone ??
                  "—"}
              </strong>
            </div>

            <div>
              <span>Tipo</span>
              <strong>
                {order.order_type ===
                "delivery"
                  ? "Delivery"
                  : order.order_type ===
                      "pickup"
                    ? "Pick-up"
                    : "Restaurante"}
              </strong>
            </div>

            <div>
              <span>Pago</span>
              <strong>
                {paymentStatus === "paid"
                  ? "Pagado"
                  : "Pendiente"}
              </strong>
            </div>
          </div>

          {(order.delivery_address ||
            order.delivery_sector ||
            order.delivery_instructions) && (
            <div className="wolf-pwa-print-box">
              <div className="wolf-pwa-print-box-title">
                ENTREGA
              </div>

              {order.delivery_address && (
                <div>
                  <strong>Dirección:</strong>{" "}
                  {order.delivery_address}
                </div>
              )}

              {order.delivery_sector && (
                <div>
                  <strong>Sector:</strong>{" "}
                  {order.delivery_sector}
                </div>
              )}

              {order.delivery_instructions && (
                <div>
                  <strong>Instrucciones:</strong>{" "}
                  {order.delivery_instructions}
                </div>
              )}
            </div>
          )}

          <div className="wolf-pwa-print-box">
            <div className="wolf-pwa-print-box-title">
              PRODUCTOS
            </div>

            {(
              Array.isArray(order.order_items)
                ? order.order_items
                : []
            ).map(
              (
                item: any,
                index: number
              ) => (
                <div
                  className="wolf-pwa-print-item"
                  key={
                    item.id ??
                    `${item.products?.name}-${index}`
                  }
                >
                  <div>
                    <strong>
                      {item.products?.name ??
                        "Producto"}
                    </strong>
                    <span>
                      {Number(
                        item.quantity ?? 0
                      )}{" "}
                      × $
                      {Number(
                        item.unit_price ?? 0
                      ).toFixed(2)}
                    </span>
                  </div>

                  <strong>
                    $
                    {Number(
                      item.subtotal ??
                        Number(
                          item.quantity ?? 0
                        ) *
                          Number(
                            item.unit_price ?? 0
                          )
                    ).toFixed(2)}
                  </strong>
                </div>
              )
            )}
          </div>

          <div className="wolf-pwa-print-totals">
            <div>
              <span>Subtotal</span>
              <strong>
                $
                {Number(
                  order.subtotal ?? 0
                ).toFixed(2)}
              </strong>
            </div>

            {Number(
              order.delivery_fee ?? 0
            ) > 0 && (
              <div>
                <span>Domicilio</span>
                <strong>
                  $
                  {Number(
                    order.delivery_fee
                  ).toFixed(2)}
                </strong>
              </div>
            )}

            <div className="wolf-pwa-print-total">
              <span>Total</span>
              <strong>
                $
                {Number(
                  order.total ?? 0
                ).toFixed(2)}
              </strong>
            </div>
          </div>

          {(order.payment_method ||
            order.notes) && (
            <div className="wolf-pwa-print-footer-info">
              {order.payment_method && (
                <span>
                  Método:{" "}
                  {order.payment_method ===
                  "cash"
                    ? "Efectivo"
                    : order.payment_method ===
                        "qr"
                      ? "QR"
                      : order.payment_method ===
                          "card"
                        ? "Tarjeta"
                        : "Transferencia"}
                </span>
              )}

              {order.notes && (
                <span>
                  Nota: {order.notes}
                </span>
              )}
            </div>
          )}

          <div className="wolf-pwa-print-footer">
            <strong>
              {order.restaurant?.name ??
                order.restaurant_name ??
                "WOLF"}
            </strong>
            <span>
              Pedido generado desde Wolf ·{" "}
              {order.tracking_code ?? ""}
            </span>
          </div>
        </div>
      </div>

    </section>
  );
}
