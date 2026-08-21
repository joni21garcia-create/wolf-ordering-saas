"use client";

import { RestaurantPWASettings } from "@/types/pwa";

interface Props {
  settings: RestaurantPWASettings;
}

export default function PhonePreview({ settings }: Props) {
  const logoSrc = settings.app_logo
    ? `${settings.app_logo}?t=${Date.now()}`
    : null;

  return (
    <section className="preview">
      <style jsx>{`
        .preview {
          width: 100%;
          min-width: 0;
          display: flex;
          justify-content: center;
          padding: 6px 0 10px;
          box-sizing: border-box;
        }

        .device {
          position: relative;
          width: min(100%, 292px);
          aspect-ratio: 0.49;
          max-height: 590px;
          overflow: hidden;
          border: 7px solid #111827;
          border-radius: 36px;
          background: ${settings.background_color || "#000"};
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.28);
          box-sizing: border-box;
        }

        .island {
          position: absolute;
          z-index: 20;
          top: 9px;
          left: 50%;
          width: 94px;
          height: 21px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: #000;
        }

        .screen {
          width: 100%;
          height: 100%;
          min-height: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: clamp(18px, 6vw, 30px);
          box-sizing: border-box;
          text-align: center;
        }

        .logo {
          width: clamp(78px, 30vw, 112px);
          aspect-ratio: 1;
          flex: 0 0 auto;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          margin-bottom: 20px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.96);
          border: 1px solid rgba(255, 255, 255, 0.16);
        }

        .logo img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .fallback {
          font-size: clamp(34px, 12vw, 46px);
        }

        .name {
          max-width: 100%;
          margin: 0;
          color: ${settings.theme_color || "#fff"};
          font-size: clamp(20px, 7vw, 26px);
          font-weight: 800;
          line-height: 1.08;
          overflow-wrap: anywhere;
        }

        .description {
          max-width: 100%;
          margin: 9px 0 22px;
          color: #999;
          font-size: clamp(12px, 3.8vw, 14px);
          line-height: 1.45;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .open-button {
          width: 100%;
          min-height: 46px;
          border: 0;
          border-radius: 13px;
          padding: 0 16px;
          box-sizing: border-box;
          color: #fff;
          background: ${settings.theme_color || "#f97316"};
          font-size: 14px;
          font-weight: 800;
        }

        .caption {
          margin-top: 22px;
          color: #777;
          font-size: 10px;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        @media (max-width: 430px) {
          .device {
            width: min(100%, 270px);
            border-width: 6px;
            border-radius: 31px;
          }

          .island {
            top: 8px;
            width: 82px;
            height: 18px;
          }

          .screen {
            padding: 18px;
          }

          .logo {
            margin-bottom: 16px;
            border-radius: 20px;
          }

          .description {
            margin-bottom: 18px;
          }

          .caption {
            margin-top: 18px;
          }
        }
      `}</style>

      <div className="device">
        <div className="island" aria-hidden="true" />

        <div className="screen">
          <div className="logo">
            {logoSrc ? (
              <img
                src={logoSrc}
                alt={settings.app_name || "Logo"}
              />
            ) : (
              <span className="fallback" aria-hidden="true">
                🍽️
              </span>
            )}
          </div>

          <h2 className="name">
            {settings.app_name || "Tu aplicación"}
          </h2>

          <p className="description">
            {settings.description || "Vista previa de tu aplicación PWA."}
          </p>

          <button type="button" className="open-button">
            Abrir aplicación
          </button>

          <div className="caption">
            Vista previa PWA
          </div>
        </div>
      </div>
    </section>
  );
}