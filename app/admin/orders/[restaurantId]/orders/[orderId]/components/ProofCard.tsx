"use client";

import ProofDownloadButton from "@/components/restaurant/ProofDownloadButton";

interface Props {
  order: any;
}

export default function ProofCard({ order }: Props) {
  const proof =
    order.payment_proof_url ||
    order.proof_url ||
    null;

  if (!proof) {
    return (
      <section className="proof-empty">
        <style>{`
          .proof-empty {
            padding: 40px 4px;
            color: #666;
            text-align: center;
          }

          .proof-empty-title {
            color: #aaa;
            font-size: 15px;
            font-weight: 650;
          }

          .proof-empty-text {
            margin-top: 7px;
            color: #555;
            font-size: 12px;
          }
        `}</style>

        <div className="proof-empty-title">
          Sin comprobante
        </div>

        <div className="proof-empty-text">
          Este pedido no tiene un comprobante
          de pago adjunto.
        </div>
      </section>
    );
  }

  return (
    <section className="proof-native">
      <style>{`
        .proof-native {
          width: 100%;
          color: #fff;
        }

        /* ==========================================
           HEADER
        ========================================== */

        .proof-header {
          padding: 2px 0 18px;
        }

        .proof-title {
          margin: 0;

          color: #f5f5f5;
          font-size: 21px;
          font-weight: 750;
          letter-spacing: -.5px;
        }

        .proof-subtitle {
          margin-top: 6px;

          color: #666;
          font-size: 12px;
          line-height: 1.5;
        }

        /* ==========================================
           IMAGE
        ========================================== */

        .proof-image-wrapper {
          position: relative;

          overflow: hidden;

          border-radius: 18px;

          background: #111;

          border:
            1px solid rgba(255,255,255,.07);
        }

        .proof-image-link {
          display: block;

          cursor: zoom-in;
        }

        .proof-image {
          display: block;

          width: 100%;
          max-height: 68vh;

          object-fit: contain;

          background: #111;
        }

        /* ==========================================
           IMAGE HINT
        ========================================== */

        .proof-hint {
          position: absolute;
          right: 12px;
          bottom: 12px;

          display: flex;
          align-items: center;
          gap: 6px;

          padding:
            7px
            10px;

          border:
            1px solid rgba(255,255,255,.08);

          border-radius: 999px;

          background:
            rgba(0,0,0,.55);

          backdrop-filter: blur(10px);

          color: #bbb;

          font-size: 10px;
          font-weight: 600;

          pointer-events: none;
        }

        /* ==========================================
           ACTIONS
        ========================================== */

        .proof-actions {
          display: flex;
          align-items: center;

          gap: 9px;

          margin-top: 14px;
        }

        .proof-action {
          display: inline-flex;
          align-items: center;
          justify-content: center;

          min-height: 42px;

          padding:
            0
            15px;

          border:
            1px solid rgba(255,255,255,.07);

          border-radius: 13px;

          background:
            rgba(255,255,255,.025);

          color: #aaa;

          font-size: 12px;
          font-weight: 650;

          text-decoration: none;

          transition:
            background .18s ease,
            color .18s ease,
            border-color .18s ease;
        }

        .proof-action:hover {
          background:
            rgba(255,255,255,.06);

          border-color:
            rgba(255,255,255,.12);

          color: #fff;
        }

        .proof-action-primary {
          flex: 1;

          background:
            rgba(249,115,22,.08);

          border-color:
            rgba(249,115,22,.18);

          color: #f97316;
        }

        .proof-action-primary:hover {
          background:
            rgba(249,115,22,.13);

          border-color:
            rgba(249,115,22,.28);

          color: #fb923c;
        }

        /* ==========================================
           MOBILE
        ========================================== */

        @media (max-width: 420px) {
          .proof-title {
            font-size: 20px;
          }

          .proof-image-wrapper {
            border-radius: 16px;
          }

          .proof-actions {
            gap: 8px;
          }

          .proof-action {
            min-height: 40px;
            padding: 0 13px;
            font-size: 11px;
          }
        }
      `}</style>

      {/* HEADER */}

      <div className="proof-header">
        <h2 className="proof-title">
          Comprobante
        </h2>

        <div className="proof-subtitle">
          Comprobante de pago adjunto al pedido.
        </div>
      </div>

      {/* IMAGE */}

      <div className="proof-image-wrapper">
        <a
          href={proof}
          target="_blank"
          rel="noopener noreferrer"
          className="proof-image-link"
        >
          <img
            src={proof}
            alt="Comprobante de pago"
            className="proof-image"
          />

          <div className="proof-hint">
            <span>↗</span>
            <span>Ver completo</span>
          </div>
        </a>
      </div>

      {/* ACTIONS */}

      <div className="proof-actions">
        <a
          href={proof}
          target="_blank"
          rel="noopener noreferrer"
          className="proof-action proof-action-primary"
        >
          Ver completo
        </a>

        <ProofDownloadButton
          url={proof}
          fileName={`comprobante-${String(order.id ?? "pago")}`}
          className="proof-action"
        >
          Descargar
        </ProofDownloadButton>
      </div>
    </section>
  );
}
