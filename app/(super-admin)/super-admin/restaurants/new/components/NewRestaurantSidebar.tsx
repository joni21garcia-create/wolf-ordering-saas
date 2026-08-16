"use client";

import { useEffect, useState } from "react";

interface Props {
  currentStep: number;
  totalSteps: number;

  restaurantName?: string;
  slug?: string;
  owner?: string;
  email?: string;

  plan?: string;

  agreementAccepted?: boolean;
}

export default function NewRestaurantSidebar({
  currentStep,
  totalSteps,
  restaurantName,
  slug,
  owner,
  email,
  plan,
  agreementAccepted,
}: Props) {
  const progress = Math.round((currentStep / totalSteps) * 100);
  const [drawerOpen, setDrawerOpen] = useState(false);

  useEffect(() => {
    if (!drawerOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setDrawerOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [drawerOpen]);

  useEffect(() => {
    if (!drawerOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [drawerOpen]);

  return (
    <aside className="sidebar">
      <div className="desktop-sidebar">
        <Card>
          <Title>Progreso</Title>

          <div className="progress-wrap">
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>

            <div className="progress-meta">
              <span>
                Paso {currentStep} de {totalSteps}
              </span>
              <strong>{progress}%</strong>
            </div>
          </div>
        </Card>

        <Card>
          <Title>Resumen</Title>

          <Summary label="Nombre" value={restaurantName ?? "Sin definir"} />
          <Summary label="Slug" value={slug ?? "--"} />
          <Summary label="Propietario" value={owner ?? "--"} />
          <Summary label="Correo" value={email ?? "--"} />
          <Summary label="Plan" value={plan ?? "Starter"} />
        </Card>

        <Card>
          <Title>Acuerdo Comercial</Title>

          <div className="agreement-status">
            <span>Estado</span>
            <strong className={agreementAccepted ? "accepted" : "pending"}>
              {agreementAccepted ? "Aceptado" : "Pendiente"}
            </strong>
          </div>

          <p>
            La creación del restaurante solamente podrá finalizar cuando el
            acuerdo comercial haya sido aceptado y firmado.
          </p>
        </Card>

        <Card>
          <Title>Recomendaciones</Title>

          <ul>
            <li>Usa un slug corto.</li>
            <li>Sube un logo cuadrado.</li>
            <li>Configura WhatsApp.</li>
            <li>Firma el Agreement.</li>
          </ul>
        </Card>
      </div>

      <div className="mobile-sidebar">
        <button
          type="button"
          className="mobile-drawer-trigger"
          onClick={() => setDrawerOpen(true)}
          aria-expanded={drawerOpen}
          aria-controls="wolf-restaurant-summary"
        >
          <span className="mobile-drawer-hint" aria-hidden="true">
            ≡
          </span>

          <span className="mobile-drawer-trigger-copy">
            <strong>Resumen</strong>
            <span>
              {progress}% · {agreementAccepted ? "Listo" : "Pendiente"}
            </span>
          </span>

          <span className="mobile-drawer-trigger-arrow" aria-hidden="true">
            →
          </span>
        </button>

        {drawerOpen && (
          <div className="mobile-drawer-layer">
            <button
              type="button"
              className="mobile-drawer-backdrop"
              aria-label="Cerrar resumen"
              onClick={() => setDrawerOpen(false)}
            />

            <aside
              id="wolf-restaurant-summary"
              className="mobile-drawer-panel"
              aria-label="Resumen del restaurante"
            >
              <div className="mobile-drawer-panel-head">
                <div>
                  <span className="mobile-drawer-eyebrow">WOLF SHELL</span>
                  <strong>Resumen del restaurante</strong>
                  <span>{restaurantName?.trim() || "Sin definir"}</span>
                </div>

                <button
                  type="button"
                  className="mobile-drawer-close"
                  aria-label="Cerrar resumen"
                  onClick={() => setDrawerOpen(false)}
                >
                  ×
                </button>
              </div>

              <div className="mobile-shell-content">
                <div className="mobile-grid">
                  <MobileSummary
                    label="Nombre"
                    value={restaurantName?.trim() || "Sin definir"}
                  />
                  <MobileSummary label="Slug" value={slug?.trim() || "--"} />
                  <MobileSummary
                    label="Propietario"
                    value={owner?.trim() || "--"}
                  />
                  <MobileSummary label="Correo" value={email?.trim() || "--"} />
                  <MobileSummary
                    label="Plan"
                    value={plan?.trim() || "Starter"}
                  />
                </div>

                <div className="mobile-agreement">
                  <span>Acuerdo Comercial</span>
                  <strong className={agreementAccepted ? "accepted" : "pending"}>
                    {agreementAccepted ? "Aceptado" : "Pendiente"}
                  </strong>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      <style jsx>{`
        .sidebar {
          min-width: 0;
          width: 100%;
        }

        .desktop-sidebar {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: sticky;
          top: 20px;
        }

        .mobile-sidebar {
          display: none;
        }

        .progress-wrap {
          margin-top: 16px;
        }

        .progress-track {
          width: 100%;
          height: 6px;
          overflow: hidden;
          border-radius: 999px;
          background: #242424;
        }

        .progress-fill {
          height: 100%;
          border-radius: inherit;
          background: linear-gradient(90deg, #f97316, #fb923c);
          transition: width 0.3s ease;
        }

        .progress-meta {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-top: 8px;
          color: #777;
          font-size: 8px;
          line-height: 1.2;
        }

        .progress-meta strong {
          color: #fff;
          font-size: 9px;
          font-weight: 850;
        }

        .agreement-status {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 13px;
          color: #777;
          font-size: 8px;
        }

        .agreement-status strong,
        .mobile-agreement strong {
          font-size: 8px;
          font-weight: 850;
        }

        .accepted {
          color: #22c55e;
        }

        .pending {
          color: #f59e0b;
        }

        .desktop-sidebar p {
          margin: 10px 0 0;
          color: #777;
          font-size: 8px;
          line-height: 1.55;
        }

        .desktop-sidebar ul {
          margin: 12px 0 0;
          padding-left: 14px;
          color: #777;
          font-size: 8px;
          line-height: 1.75;
        }

        .desktop-sidebar li::marker {
          color: #f97316;
        }

        @media (max-width: 820px) {
          .desktop-sidebar {
            display: none;
          }

          .mobile-sidebar {
            display: block;
            width: 100%;
            margin-top: 0;
          }

          .mobile-drawer-trigger {
            min-height: 48px;
            display: flex;
            align-items: center;
            gap: 9px;
            padding: 7px 10px;
            border: 1px solid rgba(255, 255, 255, 0.07);
            border-radius: 14px;
            background: rgba(17, 17, 17, 0.94);
            box-shadow: 0 8px 24px rgba(0, 0, 0, 0.18);
            cursor: pointer;
            list-style: none;
            user-select: none;
            -webkit-appearance: none;
            appearance: none;
            color: inherit;
            font: inherit;
            text-align: left;
          }

          .mobile-drawer-trigger::-webkit-details-marker {
            display: none;
          }

          .mobile-drawer-hint {
            width: 27px;
            height: 27px;
            flex: 0 0 27px;
            display: grid;
            place-items: center;
            border-radius: 9px;
            background: rgba(249, 115, 22, 0.08);
            color: #f97316;
            font-size: 15px;
          }

          .mobile-drawer-trigger-copy {
            min-width: 0;
            display: grid;
            gap: 2px;
          }

          .mobile-drawer-trigger-copy strong {
            color: #f1f1f1;
            font-size: 11px;
            line-height: 1.15;
            font-weight: 850;
          }

          .mobile-drawer-trigger-copy span {
            color: #707070;
            font-size: 8px;
            line-height: 1.2;
          }

          .mobile-drawer-trigger-arrow {
            margin-left: auto;
            color: #f97316;
            font-size: 16px;
          }

          .mobile-drawer-layer {
            position: fixed;
            inset: 0;
            z-index: 90;
          }

          .mobile-drawer-backdrop {
            position: absolute;
            inset: 0;
            z-index: 0;
            width: 100%;
            height: 100%;
            padding: 0;
            border: 0;
            background: rgba(0, 0, 0, 0.58);
            cursor: pointer;
            backdrop-filter: blur(3px);
          }

          .mobile-drawer-panel {
            position: fixed;
            top: 0;
            right: 0;
            z-index: 1;
            width: min(88vw, 360px);
            height: 100dvh;
            box-sizing: border-box;
            overflow-y: auto;
            padding:
              calc(18px + env(safe-area-inset-top))
              16px
              calc(18px + env(safe-area-inset-bottom));
            border-left: 1px solid rgba(255, 255, 255, 0.08);
            background:
              radial-gradient(circle at 100% 0%, rgba(249, 115, 22, 0.08), transparent 34%),
              #101010;
            box-shadow: -18px 0 50px rgba(0, 0, 0, 0.45);
            animation: wolf-drawer-in 190ms ease-out both;
          }

          .mobile-drawer-panel-head {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            gap: 14px;
            padding-bottom: 16px;
            margin-bottom: 14px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.07);
          }

          .mobile-drawer-panel-head > div {
            min-width: 0;
            display: grid;
            gap: 4px;
          }

          .mobile-drawer-eyebrow {
            color: #f97316;
            font-size: 7px;
            font-weight: 900;
            letter-spacing: 1.4px;
          }

          .mobile-drawer-panel-head strong {
            color: #fff;
            font-size: 18px;
            line-height: 1.05;
            font-weight: 900;
          }

          .mobile-drawer-panel-head > div > span:last-child {
            overflow: hidden;
            color: #777;
            font-size: 10px;
            text-overflow: ellipsis;
            white-space: nowrap;
          }

          .mobile-drawer-close {
            width: 34px;
            height: 34px;
            flex: 0 0 34px;
            display: grid;
            place-items: center;
            border: 1px solid rgba(255, 255, 255, 0.06);
            border-radius: 10px;
            background: #171717;
            color: #f97316;
            font-size: 20px;
            line-height: 1;
            cursor: pointer;
            -webkit-appearance: none;
            appearance: none;
            font-family: inherit;
            padding: 0;
          }

          .mobile-shell-content {
            display: grid;
            gap: 9px;
          }

          .mobile-shell-content :global(.summary) {
            min-width: 0;
          }

          @keyframes wolf-drawer-in {
            from {
              opacity: 0;
              transform: translateX(24px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @media (max-width: 390px) {
            .mobile-drawer-panel {
              width: min(92vw, 340px);
              padding-inline: 13px;
            }

            .mobile-drawer-trigger {
              min-height: 46px;
              padding-inline: 9px;
            }
          }

      `}</style>
    </aside>
  );
}

function Card({ children }: { children: React.ReactNode }) {
  return <div className="card">{children}</div>;
}

function Title({ children }: { children: React.ReactNode }) {
  return <h3 className="title">{children}</h3>;
}

function Summary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="summary">
      <span>{label}</span>
      <strong>{value}</strong>

      <style jsx>{`
        .card {
          box-sizing: border-box;
          padding: 16px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 16px;
          background: linear-gradient(180deg, #171717, #101010);
        }

        .title {
          margin: 0;
          color: #fff;
          font-size: 11px;
          line-height: 1.2;
          font-weight: 850;
          letter-spacing: -0.01em;
        }

        .summary {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 12px;
          margin-top: 11px;
        }

        .summary span {
          min-width: 0;
          color: #777;
          font-size: 7px;
        }

        .summary strong {
          min-width: 0;
          max-width: 68%;
          overflow-wrap: anywhere;
          color: #fff;
          text-align: right;
          font-size: 7px;
          font-weight: 750;
        }
      `}</style>
    </div>
  );
}

function MobileSummary({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="mobile-summary">
      <span>{label}</span>
      <strong>{value}</strong>

      <style jsx>{`
        .mobile-summary {
          min-width: 0;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.045);
          border-radius: 8px;
          background: rgba(255, 255, 255, 0.018);
        }

        span,
        strong {
          display: block;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        span {
          color: rgba(255, 255, 255, 0.24);
          font-size: 5.5px;
          text-transform: uppercase;
          letter-spacing: 0.35px;
        }

        strong {
          margin-top: 3px;
          color: rgba(255, 255, 255, 0.66);
          font-size: 6.5px;
          font-weight: 750;
        }
      `}</style>
    </div>
  );
}