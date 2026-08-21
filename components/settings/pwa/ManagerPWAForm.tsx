"use client";

import SectionCard from "./SectionCard";

export default function ManagerPWAForm() {
  return (
    <SectionCard
      title="Wolf Manager"
      subtitle="Configuración de la aplicación administrativa."
      defaultOpen
      accent="green"
    >
      <div className="manager-box">
        <style jsx>{`
          .manager-box {
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 4px 0;
          }

          .item {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 14px;
            border-radius: 14px;
            border: 1px solid rgba(255,255,255,.06);
            background: rgba(255,255,255,.025);
          }

          .icon {
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 10px;
            background: rgba(34,197,94,.12);
          }

          .title {
            color: #fff;
            font-size: 13px;
            font-weight: 800;
          }

          .text {
            margin-top: 3px;
            color: #888;
            font-size: 11px;
          }
        `}</style>

        <div className="item">
          <div className="icon">🐺</div>

          <div>
            <div className="title">
              Wolf Ordering Manager
            </div>

            <div className="text">
              Panel administrativo optimizado para PWA.
            </div>
          </div>
        </div>
      </div>
    </SectionCard>
  );
}