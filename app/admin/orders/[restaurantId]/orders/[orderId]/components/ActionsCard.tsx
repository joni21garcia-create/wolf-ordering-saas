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
     * window.print() is supported by normal browsers, but Android PWAs
     * and some in-app WebViews may not expose the print dialog correctly.
     *
     * We keep the native print call first, and provide a dedicated
     * printable popup as a fallback when the browser does not handle it.
     */
    const printUrl =
      `${window.location.href}${
        window.location.href.includes("?")
          ? "&"
          : "?"
      }print=order`;

    const printWindow = window.open(
      printUrl,
      "_blank",
      "noopener,noreferrer"
    );

    if (printWindow) {
      return;
    }

    window.print();
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