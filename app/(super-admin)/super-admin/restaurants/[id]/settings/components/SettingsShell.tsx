"use client";

import { ReactNode } from "react";
import { useRouter } from "next/navigation";

interface Props {
  restaurantName?: string;
  progress?: number;
  children: ReactNode;
}

export default function SettingsShell({
  restaurantName,
  progress = 0,
  children,
}: Props) {
  const router = useRouter();

  return (
    <main className="shell">
      <header className="topbar">
        <button type="button" className="back" onClick={() => router.back()} aria-label="Volver">
          <span>‹</span>
          <span>Configuración</span>
        </button>

        {restaurantName && (
          <div className="restaurant">
            <span className="dot" />
            <span>{restaurantName}</span>
          </div>
        )}
      </header>

      <div className="content">
        <section className="intro">
          <div>
            <span className="eyebrow">WOLF RESTAURANT OS</span>
            <h1>Configuración</h1>
            <p>Administra tu restaurante desde un solo lugar.</p>
          </div>

          <div className="progress">
            <div className="progress-row">
              <span>Configuración</span>
              <strong>{progress}%</strong>
            </div>
            <div className="track">
              <div
                className="fill"
                style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
              />
            </div>
          </div>
        </section>

        <section className="body">{children}</section>
      </div>

      <style jsx>{`
        .shell {
          min-height: 100dvh;
          background: radial-gradient(circle at 100% 0%, rgba(249, 115, 22, 0.08), transparent 28%), #070707;
          color: #fff;
        }
        .topbar {
          position: sticky;
          top: 0;
          z-index: 40;
          min-height: 54px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 8px max(16px, calc((100vw - 1180px) / 2));
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          background: rgba(7, 7, 7, 0.88);
          backdrop-filter: blur(18px);
        }
        .back {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding: 7px 9px;
          border: 0;
          border-radius: 9px;
          background: transparent;
          color: #d0d0d0;
          font: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
        }
        .back:hover { background: rgba(255, 255, 255, 0.05); color: #fff; }
        .back span:first-child { color: #ff914b; font-size: 23px; font-weight: 300; line-height: 12px; }
        .restaurant {
          max-width: 48%;
          display: flex;
          align-items: center;
          gap: 6px;
          overflow: hidden;
          color: #8e8e8e;
          font-size: 10px;
          font-weight: 650;
          white-space: nowrap;
        }
        .restaurant span:last-child { overflow: hidden; text-overflow: ellipsis; }
        .dot {
          width: 5px;
          height: 5px;
          flex: 0 0 5px;
          border-radius: 50%;
          background: #22c55e;
          box-shadow: 0 0 7px rgba(34, 197, 94, 0.4);
        }
        .content {
          width: min(100%, 1180px);
          margin: 0 auto;
          padding: 22px 18px 42px;
          box-sizing: border-box;
        }
        .intro {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 250px;
          align-items: end;
          gap: 24px;
          padding: 4px 0 20px;
        }
        .eyebrow { color: #ff914b; font-size: 9px; font-weight: 800; letter-spacing: 1.3px; }
        h1 {
          margin: 5px 0 0;
          color: #f4f4f4;
          font-size: clamp(25px, 4vw, 32px);
          line-height: 1.05;
          font-weight: 850;
          letter-spacing: -0.04em;
        }
        .intro p { margin: 7px 0 0; color: #666; font-size: 11px; line-height: 1.45; }
        .progress {
          padding: 11px 12px;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 12px;
          background: rgba(255, 255, 255, 0.025);
        }
        .progress-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 7px;
          color: #777;
          font-size: 9px;
          font-weight: 700;
        }
        .progress-row strong { color: #4ade80; font-size: 10px; }
        .track { height: 4px; overflow: hidden; border-radius: 99px; background: rgba(255, 255, 255, 0.07); }
        .fill { height: 100%; border-radius: inherit; background: #22c55e; transition: width 0.25s ease; }
        .body { min-width: 0; }

        @media (max-width: 700px) {
          .topbar { min-height: 50px; }
          .content { padding: 17px 13px 30px; }
          .intro { grid-template-columns: 1fr; gap: 13px; padding-bottom: 15px; }
          .progress { width: 100%; box-sizing: border-box; }
        }
      `}</style>
    </main>
  );
}