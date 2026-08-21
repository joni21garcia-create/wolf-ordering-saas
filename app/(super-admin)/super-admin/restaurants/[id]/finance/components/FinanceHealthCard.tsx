"use client";

interface HealthItem {
  title: string;
  status: "ok" | "warning";
}

interface Props {
  items: readonly HealthItem[];
}

export default function FinanceHealthCard({
  items,
}: Props) {
  const ok = items.filter(
    (item) => item.status === "ok"
  ).length;

  const healthy = ok === items.length;

  return (
    <section className="health-section">
      <style jsx>{`
        .health-section {
          width: 100%;
          min-width: 0;
          margin: 0 0 24px;
        }

        .panel {
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
          background: rgba(255,255,255,.045);
          border: 1px solid rgba(255,255,255,.06);
        }

        .title {
          color:#fff;
          font-size:13px;
          font-weight:800;
        }

        .subtitle {
          margin-top:2px;
          color:#777;
          font-size:10px;
        }

        .badge {
          padding:6px 10px;
          border-radius:999px;
          background:${healthy ? "rgba(34,197,94,.12)" : "rgba(245,158,11,.12)"};
          border:1px solid ${healthy ? "rgba(34,197,94,.22)" : "rgba(245,158,11,.22)"};
          color:${healthy ? "#22c55e" : "#f59e0b"};
          font-size:10px;
          font-weight:800;
        }

        .content {
          padding:0 10px 12px;
          border-top:1px solid rgba(255,255,255,.05);
          display:grid;
          grid-template-columns:repeat(5,minmax(0,1fr));
          gap:10px;
        }

        .item {
          padding:14px;
          border-radius:13px;
          background:rgba(255,255,255,.025);
          border:1px solid rgba(255,255,255,.05);
        }

        .name {
          color:#fff;
          font-size:12px;
          font-weight:700;
        }

        .status {
          margin-top:8px;
          font-size:11px;
          font-weight:800;
        }

        .ok { color:#22c55e; }
        .warning { color:#f59e0b; }

        @media(max-width:900px){
          .content {
            grid-template-columns:repeat(3,minmax(0,1fr));
          }
        }

        @media(max-width:560px){
          .panel {
            border-radius:15px;
          }

          .panel > summary {
            min-height:58px;
            padding:0 12px;
          }

          .content {
            grid-template-columns:repeat(2,minmax(0,1fr));
            padding:0 8px 8px;
          }

          .item {
            padding:12px;
          }
        }
      `}</style>

      <details className="panel" open>
        <summary>
          <span className="heading">
            <span className="icon">🩺</span>
            <span>
              <div className="title">
                Salud Financiera
              </div>
              <div className="subtitle">
                Estado general de configuración financiera
              </div>
            </span>
          </span>

          <span className="badge">
            {ok}/{items.length} Correctos
          </span>
        </summary>

        <div className="content">
          {items.map((item) => (
            <div className="item" key={item.title}>
              <div className="name">{item.title}</div>

              <div
                className={`status ${
                  item.status === "ok"
                    ? "ok"
                    : "warning"
                }`}
              >
                {item.status === "ok"
                  ? "Configurado"
                  : "Pendiente"}
              </div>
            </div>
          ))}
        </div>
      </details>
    </section>
  );
}