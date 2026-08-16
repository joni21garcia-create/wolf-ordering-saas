 "use client";

import { useEffect, useState } from "react";

interface Props {
  version: string;
}

const SECTIONS = [
  {
    title: "1. Objeto del Acuerdo",
    body:
      "Wolf Ordering SaaS proporciona una plataforma tecnológica para la gestión de pedidos, administración del restaurante y herramientas comerciales.",
  },
  {
    title: "2. Responsabilidades",
    body:
      "El restaurante será responsable de mantener actualizada su información, precios, productos y horarios de atención.",
  },
  {
    title: "3. Comisión",
    body:
      "Las comisiones aplicables serán las configuradas en el plan contratado y serán reflejadas en cada liquidación financiera.",
  },
  {
    title: "4. Pagos",
    body:
      "Las liquidaciones serán generadas automáticamente según la configuración del sistema y el calendario establecido por Wolf Ordering.",
  },
  {
    title: "5. Protección de Datos",
    body:
      "Toda la información será tratada conforme a la política de privacidad vigente y las leyes aplicables.",
  },
  {
    title: "6. Terminación",
    body:
      "Cualquiera de las partes podrá finalizar la relación comercial respetando las condiciones establecidas en el contrato.",
  },
];

export default function NewRestaurantAgreementPreview({ version }: Props) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const scrollToSection = (index: number) => {
    requestAnimationFrame(() => {
      document
        .getElementById(`agreement-section-${index + 1}`)
        ?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
  };

  return (
    <>
      {/* Compacto por defecto: el documento solo aparece al pulsar. */}
      <button
        type="button"
        className="agreement-shell-trigger"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="wolf-agreement-shell"
      >
        <span className="trigger-icon">☷</span>

        <span className="trigger-copy">
          <span className="trigger-kicker">WOLF SHELL</span>
          <strong>Acuerdo Comercial</strong>
          <span>
            Versión {version} · Documento pendiente de aceptación y firma
          </span>
        </span>

        <span className="trigger-arrow" aria-hidden="true">
          →
        </span>
      </button>

      {open && (
        <div
          className="agreement-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setOpen(false);
          }}
        >
          <aside
            id="wolf-agreement-shell"
            className="agreement-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Acuerdo Comercial"
          >
            <div className="drawer-topbar">
              <div>
                <span className="drawer-kicker">WOLF ORDERING SAAS</span>
                <strong>Acuerdo Comercial</strong>
                <span>Versión {version}</span>
              </div>

              <button
                type="button"
                className="drawer-close"
                onClick={() => setOpen(false)}
                aria-label="Cerrar acuerdo comercial"
              >
                ×
              </button>
            </div>

            <div className="drawer-body">
              <div className="document">
                <header className="document-header">
                  <div className="document-kicker">WOLF ORDERING SAAS</div>

                  <h1>Acuerdo Comercial</h1>

                  <p>
                    Acuerdo Comercial para la utilización de la plataforma Wolf
                    Ordering.
                  </p>

                  <div className="document-meta">
                    <span>Versión</span>
                    <strong>{version}</strong>
                  </div>
                </header>

                <div className="mobile-index">
                  <details>
                    <summary>
                      <span>Índice del acuerdo</span>
                      <b>+</b>
                    </summary>

                    <nav>
                      {SECTIONS.map((section, index) => (
                        <a
                          key={section.title}
                          href={`#agreement-section-${index + 1}`}
                          onClick={(event) => {
                            event.preventDefault();
                            scrollToSection(index);
                          }}
                        >
                          <span>{String(index + 1).padStart(2, "0")}</span>
                          {section.title.replace(/^\d+\.\s*/, "")}
                        </a>
                      ))}
                    </nav>
                  </details>
                </div>

                <div className="sections">
                  {SECTIONS.map((section, index) => (
                    <section
                      id={`agreement-section-${index + 1}`}
                      key={section.title}
                      className="document-section"
                    >
                      <div className="section-number">
                        {String(index + 1).padStart(2, "0")}
                      </div>

                      <div>
                        <h2>{section.title}</h2>
                        <p>{section.body}</p>
                      </div>
                    </section>
                  ))}
                </div>

                <footer className="document-footer">
                  <div className="footer-icon">✓</div>

                  <div>
                    <strong>Firma electrónica</strong>
                    <p>
                      Este documento será firmado electrónicamente en el
                      siguiente paso.
                    </p>
                  </div>
                </footer>
              </div>
            </div>
          </aside>
        </div>
      )}

      <style jsx>{`
        .agreement-shell-trigger {
          width: 100%;
          min-width: 0;
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) 32px;
          align-items: center;
          gap: 11px;
          padding: 13px 14px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 16px;
          background: linear-gradient(135deg, #171717, #101010);
          color: #fff;
          text-align: left;
          cursor: pointer;
          transition:
            transform 0.18s ease,
            border-color 0.18s ease,
            background 0.18s ease;
        }

        .agreement-shell-trigger:hover {
          transform: translateY(-1px);
          border-color: rgba(249, 115, 22, 0.35);
          background: linear-gradient(135deg, #1a1a1a, #121212);
        }

        .trigger-icon {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: rgba(249, 115, 22, 0.12);
          color: #f97316;
          font-size: 15px;
          font-weight: 900;
        }

        .trigger-copy {
          min-width: 0;
          display: grid;
          gap: 2px;
        }

        .trigger-kicker {
          color: #f97316;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.2px;
        }

        .trigger-copy strong {
          overflow: hidden;
          color: #fff;
          font-size: 13px;
          font-weight: 850;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .trigger-copy span:last-child {
          overflow: hidden;
          color: #777;
          font-size: 8px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .trigger-arrow {
          width: 30px;
          height: 30px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          background: #1f1f1f;
          color: #f97316;
          font-size: 15px;
          transition: transform 0.18s ease;
        }

        .agreement-shell-trigger:hover .trigger-arrow {
          transform: translateX(2px);
        }

        .agreement-overlay {
          position: fixed;
          inset: 0;
          z-index: 9999;
          display: flex;
          justify-content: flex-end;
          background: rgba(0, 0, 0, 0.58);
          backdrop-filter: blur(5px);
          animation: overlay-in 0.18s ease-out;
        }

        .agreement-drawer {
          width: min(820px, 92vw);
          height: 100dvh;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-left: 1px solid rgba(255, 255, 255, 0.08);
          background: #0d0d0d;
          box-shadow: -24px 0 80px rgba(0, 0, 0, 0.45);
          animation: drawer-in 0.24s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .drawer-topbar {
          min-height: 68px;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          padding: 12px 18px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          background: linear-gradient(180deg, #151515, #101010);
        }

        .drawer-topbar > div {
          min-width: 0;
          display: grid;
          gap: 2px;
        }

        .drawer-kicker {
          color: #f97316;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .drawer-topbar strong {
          color: #fff;
          font-size: 15px;
          font-weight: 900;
        }

        .drawer-topbar > div > span:last-child {
          color: #777;
          font-size: 8px;
        }

        .drawer-close {
          width: 36px;
          height: 36px;
          flex: 0 0 36px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(255, 255, 255, 0.07);
          border-radius: 10px;
          background: #1b1b1b;
          color: #f97316;
          font-size: 22px;
          line-height: 1;
          cursor: pointer;
          transition:
            background 0.15s ease,
            transform 0.15s ease;
        }

        .drawer-close:hover {
          background: #24180f;
          transform: scale(1.03);
        }

        .drawer-body {
          min-height: 0;
          flex: 1;
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 22px;
          scrollbar-width: thin;
        }

        .document {
          width: 100%;
          max-width: 760px;
          margin: 0 auto;
          box-sizing: border-box;
          overflow: hidden;
          border-radius: 18px;
          background: #fff;
          color: #111827;
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.25);
        }

        .document-header {
          padding: 28px 30px 22px;
          border-bottom: 1px solid #e5e7eb;
        }

        .document-kicker {
          color: #f97316;
          font-size: 7px;
          font-weight: 900;
          letter-spacing: 1.4px;
        }

        .document-header h1 {
          margin: 8px 0 0;
          font-size: clamp(26px, 4vw, 34px);
          line-height: 1;
          font-weight: 950;
          letter-spacing: -0.045em;
        }

        .document-header p {
          max-width: 650px;
          margin: 9px 0 0;
          color: #6b7280;
          font-size: 10px;
          line-height: 1.55;
        }

        .document-meta {
          width: fit-content;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-top: 14px;
          padding: 6px 9px;
          border-radius: 999px;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 7px;
        }

        .document-meta strong {
          color: #2563eb;
          font-weight: 850;
        }

        .sections {
          padding: 4px 30px 0;
        }

        .document-section {
          display: grid;
          grid-template-columns: 28px minmax(0, 1fr);
          gap: 12px;
          padding: 22px 0;
          border-bottom: 1px solid #eef0f2;
          scroll-margin-top: 20px;
        }

        .section-number {
          width: 25px;
          height: 25px;
          display: grid;
          place-items: center;
          border-radius: 7px;
          background: #f3f4f6;
          color: #6b7280;
          font-size: 6px;
          font-weight: 900;
        }

        .document-section h2 {
          margin: 1px 0 7px;
          font-size: 15px;
          line-height: 1.2;
          font-weight: 850;
          letter-spacing: -0.02em;
        }

        .document-section p {
          max-width: 720px;
          margin: 0;
          color: #4b5563;
          font-size: 9px;
          line-height: 1.75;
        }

        .document-footer {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          margin: 22px 30px 28px;
          padding: 13px;
          border: 1px solid #e5e7eb;
          border-radius: 10px;
          background: #f9fafb;
        }

        .footer-icon {
          width: 22px;
          height: 22px;
          flex: 0 0 22px;
          display: grid;
          place-items: center;
          border-radius: 6px;
          background: #ecfdf5;
          color: #16a34a;
          font-size: 9px;
          font-weight: 900;
        }

        .document-footer strong {
          color: #111827;
          font-size: 8px;
          font-weight: 850;
        }

        .document-footer p {
          margin: 3px 0 0;
          color: #6b7280;
          font-size: 7px;
          line-height: 1.5;
        }

        .mobile-index {
          display: block;
          padding: 10px 14px 0;
        }

        .mobile-index details {
          border: 1px solid #e5e7eb;
          border-radius: 9px;
          overflow: hidden;
        }

        .mobile-index summary {
          min-height: 36px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 10px;
          color: #374151;
          font-size: 8px;
          font-weight: 800;
          cursor: pointer;
          list-style: none;
        }

        .mobile-index summary::-webkit-details-marker {
          display: none;
        }

        .mobile-index summary b {
          font-size: 13px;
          font-weight: 500;
          color: #9ca3af;
        }

        .mobile-index nav {
          display: grid;
          border-top: 1px solid #eef0f2;
        }

        .mobile-index nav a {
          display: flex;
          align-items: center;
          gap: 7px;
          padding: 8px 10px;
          border-bottom: 1px solid #f1f2f3;
          color: #6b7280;
          text-decoration: none;
          font-size: 7px;
        }

        .mobile-index nav a span {
          color: #f97316;
          font-size: 6px;
          font-weight: 900;
        }

        @keyframes overlay-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes drawer-in {
          from {
            transform: translateX(100%);
          }
          to {
            transform: translateX(0);
          }
        }

        @media (max-width: 640px) {
          .agreement-overlay {
            justify-content: stretch;
          }

          .agreement-drawer {
            width: 100%;
            border-left: 0;
          }

          .drawer-topbar {
            min-height: 62px;
            padding: 10px 13px;
          }

          .drawer-body {
            padding: 10px;
          }

          .document {
            border-radius: 14px;
          }

          .document-header {
            padding: 19px 16px 15px;
          }

          .document-kicker {
            font-size: 6px;
          }

          .document-header h1 {
            font-size: 25px;
          }

          .document-header p {
            margin-top: 7px;
            font-size: 8px;
            line-height: 1.5;
          }

          .document-meta {
            margin-top: 10px;
            padding: 5px 8px;
            font-size: 6px;
          }

          .mobile-index {
            padding: 8px 10px 0;
          }

          .sections {
            padding: 0 16px;
          }

          .document-section {
            grid-template-columns: 23px minmax(0, 1fr);
            gap: 9px;
            padding: 16px 0;
          }

          .section-number {
            width: 22px;
            height: 22px;
            border-radius: 6px;
          }

          .document-section h2 {
            font-size: 12px;
          }

          .document-section p {
            font-size: 8px;
            line-height: 1.65;
          }

          .document-footer {
            margin: 16px;
            padding: 10px;
          }

          .document-footer strong {
            font-size: 7px;
          }

          .document-footer p {
            font-size: 6.5px;
          }
        }

        @media (max-width: 390px) {
          .agreement-shell-trigger {
            grid-template-columns: 32px minmax(0, 1fr) 28px;
            gap: 9px;
            padding: 11px;
          }

          .trigger-icon {
            width: 32px;
            height: 32px;
          }

          .trigger-copy strong {
            font-size: 12px;
          }

          .trigger-copy span:last-child {
            font-size: 7px;
          }

          .trigger-arrow {
            width: 28px;
            height: 28px;
          }

          .drawer-body {
            padding: 8px;
          }

          .document-header {
            padding-inline: 13px;
          }

          .sections {
            padding-inline: 13px;
          }

          .document-section {
            grid-template-columns: 21px minmax(0, 1fr);
            gap: 7px;
          }

          .section-number {
            width: 21px;
            height: 21px;
          }

          .document-section h2 {
            font-size: 11px;
          }

          .document-section p {
            font-size: 7.5px;
          }

          .document-footer {
            margin-inline: 13px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .agreement-overlay,
          .agreement-drawer {
            animation: none;
          }

          .agreement-shell-trigger,
          .trigger-arrow,
          .drawer-close {
            transition: none;
          }
        }
      `}</style>
    </>
  );
}