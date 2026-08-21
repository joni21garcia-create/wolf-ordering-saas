"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";

interface Props {
  url: string;
  restaurantName: string;
}

export default function GoogleReviewsQR({
  url,
  restaurantName,
}: Props) {
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function generateQR() {
      if (!url) {
        setQrDataUrl("");
        return;
      }

      try {
        setGenerating(true);

        const dataUrl = await QRCode.toDataURL(url, {
          width: 600,
          margin: 2,
          errorCorrectionLevel: "H",
          color: {
            dark: "#111111",
            light: "#ffffff",
          },
        });

        if (!cancelled) {
          setQrDataUrl(dataUrl);
        }
      } catch (error) {
        console.error("Error generando QR:", error);

        if (!cancelled) {
          setQrDataUrl("");
        }
      } finally {
        if (!cancelled) {
          setGenerating(false);
        }
      }
    }

    generateQR();

    return () => {
      cancelled = true;
    };
  }, [url]);

  async function handleCopy() {
    if (!url) return;

    try {
      await navigator.clipboard.writeText(url);
    } catch (error) {
      console.error("No se pudo copiar el enlace:", error);
    }
  }

  function handleDownload() {
    if (!qrDataUrl) return;

    const safeName = slugify(
      restaurantName || "restaurante"
    );

    const link = document.createElement("a");

    link.href = qrDataUrl;
    link.download = `${safeName}-google-reviews-qr.png`;

    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  function handlePrint() {
    if (!qrDataUrl) return;

    const printWindow = window.open(
      "",
      "_blank",
      "width=700,height=850"
    );

    if (!printWindow) return;

    const safeRestaurantName = escapeHtml(
      restaurantName || "Restaurante"
    );

    printWindow.document.write(`
      <!doctype html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />

          <title>
            QR Google Reviews · ${safeRestaurantName}
          </title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              min-height: 100vh;
              display: grid;
              place-items: center;
              background: #ffffff;
              color: #111111;
              font-family:
                Arial,
                Helvetica,
                sans-serif;
            }

            .sheet {
              width: 100%;
              max-width: 620px;
              padding: 48px 30px;
              text-align: center;
            }

            .stars {
              margin-bottom: 14px;
              color: #f59e0b;
              font-size: 32px;
              letter-spacing: 4px;
            }

            h1 {
              margin: 0;
              font-size: 30px;
            }

            p {
              margin: 10px 0 26px;
              color: #666666;
              font-size: 15px;
            }

            img {
              width: 420px;
              max-width: 80vw;
              height: auto;
            }

            .restaurant {
              margin-top: 24px;
              font-size: 18px;
              font-weight: 700;
            }

            .hint {
              margin-top: 8px;
              color: #777777;
              font-size: 13px;
            }
          </style>
        </head>

        <body>
          <main class="sheet">
            <div class="stars">
              ★★★★★
            </div>

            <h1>
              ¿Cómo fue tu experiencia?
            </h1>

            <p>
              Escanea el código para dejarnos una reseña
              en Google.
            </p>

            <img
              src="${qrDataUrl}"
              alt="Código QR de Google Reviews"
            />

            <div class="restaurant">
              ${safeRestaurantName}
            </div>

            <div class="hint">
              Gracias por ayudarnos a mejorar.
            </div>
          </main>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
    }, 250);
  }

  return (
    <div className="qr-module">
      <style jsx>{`
        .qr-module {
          margin-top: 14px;
        }

        .layout {
          display: grid;
          grid-template-columns:
            minmax(170px, 210px)
            minmax(0, 1fr);
          gap: 16px;
          align-items: center;
        }

        .qr-box {
          width: 100%;
          aspect-ratio: 1;
          display: grid;
          place-items: center;
          padding: 10px;
          border-radius: 17px;
          background: #fff;
          border: 1px solid
            rgba(255, 255, 255, 0.08);
          box-sizing: border-box;
        }

        .qr-image {
          width: 100%;
          height: 100%;
          object-fit: contain;
          image-rendering: pixelated;
        }

        .empty {
          padding: 18px;
          color: #777;
          font-size: 10px;
          line-height: 1.5;
          text-align: center;
        }

        .loading {
          color: #aaa;
        }

        .info {
          min-width: 0;
        }

        .info-title {
          color: #fff;
          font-size: 13px;
          font-weight: 800;
        }

        .info-text {
          margin-top: 6px;
          color: #777;
          font-size: 11px;
          line-height: 1.5;
        }

        .actions {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
          margin-top: 13px;
        }

        .action {
          min-height: 40px;
          padding: 0 8px;
          border: 1px solid
            rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          background: rgba(255, 255, 255, 0.04);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
        }

        .action:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.08);
        }

        .action:disabled {
          opacity: 0.4;
          cursor: not-allowed;
        }

        .primary {
          border-color: rgba(249, 115, 22, 0.35);
          background: rgba(249, 115, 22, 0.12);
          color: #fb923c;
        }

        .url {
          margin-top: 10px;
          overflow: hidden;
          color: #555;
          font-size: 9px;
          line-height: 1.4;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        @media (max-width: 560px) {
          .layout {
            grid-template-columns: 1fr;
          }

          .qr-box {
            width: min(220px, 70vw);
            justify-self: center;
          }

          .actions {
            grid-template-columns:
              repeat(3, minmax(0, 1fr));
          }

          .url {
            text-align: center;
          }
        }
      `}</style>

      <div className="layout">
        <div className="qr-box">
          {generating ? (
            <div className="empty loading">
              Generando QR...
            </div>
          ) : qrDataUrl ? (
            <img
              className="qr-image"
              src={qrDataUrl}
              alt="Código QR para Google Reviews"
            />
          ) : (
            <div className="empty">
              Introduce un enlace válido de Google Reviews
              para generar el código.
            </div>
          )}
        </div>

        <div className="info">
          <div className="info-title">
            QR del restaurante
          </div>

          <div className="info-text">
            Este código lleva directamente a la página
            donde el cliente puede escribir su reseña.
          </div>

          <div className="actions">
            <button
              type="button"
              className="action"
              onClick={handleCopy}
              disabled={!url}
            >
              ⧉ Copiar
            </button>

            <button
              type="button"
              className="action primary"
              onClick={handleDownload}
              disabled={!qrDataUrl}
            >
              ↓ Descargar
            </button>

            <button
              type="button"
              className="action"
              onClick={handlePrint}
              disabled={!qrDataUrl}
            >
              ⎙ Imprimir
            </button>
          </div>

          {url && (
            <div className="url" title={url}>
              {url}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function slugify(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    return entities[character];
  });
}