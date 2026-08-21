"use client";

interface Props {
  children: React.ReactNode;
}

export default function FinanceLiquidationActions({
  children,
}: Props) {
  return (
    <section className="actions-section">
      <style jsx>{`
        .actions-section {
          width: 100%;
          min-width: 0;
          margin: 0 0 24px;
        }

        .panel {
          width: 100%;
          overflow: hidden;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.07);
          background: linear-gradient(180deg,#151515,#0d0d0d);
        }

        .panel > summary {
          list-style: none;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          min-height: 64px;
          padding: 0 16px;
          user-select: none;
        }

        .panel > summary::-webkit-details-marker {
          display: none;
        }

        .heading {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .icon {
          width: 32px;
          height: 32px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 10px;
          background: rgba(249,115,22,.1);
          border: 1px solid rgba(249,115,22,.18);
        }

        .title {
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }

        .subtitle {
          margin-top: 2px;
          color: #777;
          font-size: 10px;
          line-height: 1.4;
        }

        .right {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .badge {
          padding: 6px 9px;
          border-radius: 999px;
          background: rgba(249,115,22,.1);
          border: 1px solid rgba(249,115,22,.18);
          color: #f97316;
          font-size: 9px;
          font-weight: 800;
        }

        .chevron {
          color: #666;
          transition: transform .18s ease;
        }

        .panel[open] .chevron {
          transform: rotate(180deg);
        }

        .content {
          padding: 0 10px 12px;
          border-top: 1px solid rgba(255,255,255,.05);
        }

        .actions-box {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-wrap: wrap;
          padding: 14px;
        }

        .note {
          padding: 14px;
          border-top: 1px solid rgba(255,255,255,.05);
          color: #777;
          font-size: 12px;
          line-height: 1.5;
        }

        @media (max-width:560px) {
          .panel {
            border-radius: 15px;
          }

          .panel > summary {
            min-height: 58px;
            padding: 0 12px;
          }

          .title {
            font-size: 11px;
          }

          .subtitle {
            font-size: 9px;
          }

          .actions-box {
            padding: 10px;
          }

          .note {
            font-size: 11px;
          }
        }
      `}</style>

      <details className="panel" open>
        <summary>
          <span className="heading">
            <span className="icon">⚙</span>

            <span>
              <div className="title">
                Acciones Financieras
              </div>

              <div className="subtitle">
                Gestiona liquidaciones y documentos oficiales
              </div>
            </span>
          </span>

          <span className="right">
            <span className="badge">
              Finance Actions
            </span>

            <span className="chevron">
              ⌄
            </span>
          </span>
        </summary>

        <div className="content">
          <div className="actions-box">
            {children}
          </div>

          <div className="note">
            Las acciones disponibles dependen del estado de la
            liquidación. Una vez pagada, algunas operaciones dejan de
            estar disponibles para preservar la integridad financiera.
          </div>
        </div>
      </details>
    </section>
  );
}