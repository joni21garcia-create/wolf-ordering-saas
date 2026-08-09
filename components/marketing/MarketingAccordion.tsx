"use client";

import { useState, type ReactNode } from "react";
import {
  ChevronDown,
  QrCode,
  Share2,
  Settings2,
  Image,
} from "lucide-react";

interface Props {
  children?: ReactNode;
  qrContent?: ReactNode;
  actions?: ReactNode;
  qrSettings?: ReactNode;
  poster?: ReactNode;
}

export default function MarketingAccordion({
  children,
  qrContent,
  actions,
  qrSettings,
  poster,
}: Props) {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [posterOpen, setPosterOpen] = useState(false);

  return (
    <>
      <style>{`

        .wolf-marketing{
          width:100%;
          display:flex;
          flex-direction:column;
          gap:18px;
        }

        /* QR PRINCIPAL */

        .wolf-marketing-main{
          width:100%;
          background:#111827;
          border:1px solid rgba(255,255,255,.08);
          border-radius:24px;
          padding:20px;
          box-sizing:border-box;
        }

        .wolf-marketing-main-header{
          display:flex;
          align-items:center;
          gap:10px;
          margin-bottom:18px;
        }

        .wolf-marketing-main-icon{
          width:38px;
          height:38px;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(249,115,22,.12);
          color:#f97316;
        }

        .wolf-marketing-main-title{
          font-size:17px;
          font-weight:800;
          color:#fff;
        }

        .wolf-marketing-main-subtitle{
          margin-top:3px;
          font-size:12px;
          color:#8b8b8b;
        }

        .wolf-marketing-qr{
          display:flex;
          justify-content:center;
          width:100%;
        }

        /* ACCIONES */

        .wolf-marketing-actions{
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:10px;
        }

        .wolf-marketing-action{
          min-height:54px;
          border:none;
          border-radius:14px;
          background:#111827;
          border:1px solid rgba(255,255,255,.08);
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:center;
          gap:8px;
          font-size:13px;
          font-weight:700;
          cursor:pointer;
          transition:.2s ease;
        }

        .wolf-marketing-action:hover{
          border-color:rgba(249,115,22,.4);
          background:#171f2d;
        }

        .wolf-marketing-action.primary{
          background:#f97316;
          border-color:#f97316;
        }

        .wolf-marketing-action.primary:hover{
          background:#ea580c;
        }

        /* SECCIONES */

        .wolf-marketing-section{
          width:100%;
          background:#111827;
          border:1px solid rgba(255,255,255,.08);
          border-radius:20px;
          overflow:hidden;
        }

        .wolf-marketing-section-button{
          width:100%;
          min-height:72px;
          padding:15px 18px;
          background:none;
          border:none;
          color:#fff;
          display:flex;
          align-items:center;
          justify-content:space-between;
          text-align:left;
          cursor:pointer;
        }

        .wolf-marketing-section-left{
          display:flex;
          align-items:center;
          gap:12px;
          min-width:0;
        }

        .wolf-marketing-section-icon{
          width:40px;
          height:40px;
          flex:none;
          border-radius:12px;
          display:flex;
          align-items:center;
          justify-content:center;
          background:rgba(249,115,22,.10);
          color:#f97316;
        }

        .wolf-marketing-section-title{
          font-size:15px;
          font-weight:800;
          color:#fff;
        }

        .wolf-marketing-section-subtitle{
          margin-top:4px;
          font-size:12px;
          color:#8b8b8b;
        }

        .wolf-marketing-chevron{
          flex:none;
          color:#f97316;
          transition:transform .25s ease;
        }

        .wolf-marketing-chevron.open{
          transform:rotate(180deg);
        }

        .wolf-marketing-section-content{
          padding:0 18px 20px;
        }

        @media(max-width:600px){

          .wolf-marketing{
            gap:14px;
          }

          .wolf-marketing-main{
            padding:16px;
            border-radius:20px;
          }

          .wolf-marketing-main-title{
            font-size:16px;
          }

          .wolf-marketing-actions{
            gap:8px;
          }

          .wolf-marketing-action{
            min-height:50px;
            font-size:12px;
          }

          .wolf-marketing-section-button{
            min-height:68px;
            padding:14px;
          }

          .wolf-marketing-section-title{
            font-size:14px;
          }

          .wolf-marketing-section-subtitle{
            font-size:11px;
          }

        }

      `}</style>

      <div className="wolf-marketing">

        {/* ========================================= */}
        {/* QR */}
        {/* ========================================= */}

        <section className="wolf-marketing-main">

          <div className="wolf-marketing-main-header">

            <div className="wolf-marketing-main-icon">
              <QrCode size={20} />
            </div>

            <div>
              <div className="wolf-marketing-main-title">
                Código QR
              </div>

              <div className="wolf-marketing-main-subtitle">
                Comparte el menú digital de tu restaurante
              </div>
            </div>

          </div>

          <div className="wolf-marketing-qr">
            {qrContent}
          </div>

        </section>

        {/* ========================================= */}
        {/* ACCIONES */}
        {/* ========================================= */}

        {actions && (
          <section>
            {actions}
          </section>
        )}

        {/* ========================================= */}
        {/* CONFIGURACIÓN QR */}
        {/* ========================================= */}

        <section className="wolf-marketing-section">

          <button
            type="button"
            className="wolf-marketing-section-button"
            onClick={() =>
              setSettingsOpen((value) => !value)
            }
          >

            <div className="wolf-marketing-section-left">

              <div className="wolf-marketing-section-icon">
                <Settings2 size={19} />
              </div>

              <div>

                <div className="wolf-marketing-section-title">
                  Personalizar código QR
                </div>

                <div className="wolf-marketing-section-subtitle">
                  Color, resolución y logo
                </div>

              </div>

            </div>

            <ChevronDown
              size={20}
              className={
                settingsOpen
                  ? "wolf-marketing-chevron open"
                  : "wolf-marketing-chevron"
              }
            />

          </button>

          {settingsOpen && (
            <div className="wolf-marketing-section-content">
              {qrSettings}
            </div>
          )}

        </section>

        {/* ========================================= */}
        {/* PÓSTER */}
        {/* ========================================= */}

        <section className="wolf-marketing-section">

          <button
            type="button"
            className="wolf-marketing-section-button"
            onClick={() =>
              setPosterOpen((value) => !value)
            }
          >

            <div className="wolf-marketing-section-left">

              <div className="wolf-marketing-section-icon">
                <Image size={19} />
              </div>

              <div>

                <div className="wolf-marketing-section-title">
                  Póster promocional
                </div>

                <div className="wolf-marketing-section-subtitle">
                  Vista previa del material para imprimir
                </div>

              </div>

            </div>

            <ChevronDown
              size={20}
              className={
                posterOpen
                  ? "wolf-marketing-chevron open"
                  : "wolf-marketing-chevron"
              }
            />

          </button>

          {posterOpen && (
            <div className="wolf-marketing-section-content">
              {poster}
            </div>
          )}

        </section>

        {children}

      </div>
    </>
  );
}