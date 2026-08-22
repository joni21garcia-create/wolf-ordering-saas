"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";
import { Capacitor } from "@capacitor/core";
import {
  saveBase64FileOnAndroid,
} from "@/lib/capacitor/download";

interface Props {
  restaurantName: string;
  logoUrl: string | null;
  reviewsUrl: string;
}

/* -------------------------------------------------------------------------- */
/* HELPERS                                                                    */
/* -------------------------------------------------------------------------- */

function dataUrlToUint8Array(dataUrl: string) {
  const base64 = dataUrl.split(",")[1];

  if (!base64) {
    throw new Error("Imagen PNG inválida.");
  }

  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);

  for (let index = 0; index < binary.length; index++) {
    bytes[index] = binary.charCodeAt(index);
  }

  return bytes;
}

function sanitizeFileName(value: string) {
  return (
    value
      .trim()
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "")
      .replace(/\s+/g, "-")
      .toLowerCase() || "restaurante"
  );
}

function isNativeAndroid() {
  if (typeof window === "undefined") {
    return false;
  }

  const capacitor = (window as any).Capacitor;

  return Boolean(
    capacitor?.isNativePlatform?.() &&
      capacitor?.getPlatform?.() === "android",
  );
}

function isMobileDevice() {
  if (typeof navigator === "undefined") {
    return false;
  }

  return /Android|iPhone|iPad|iPod/i.test(
    navigator.userAgent,
  );
}

function isStandalonePwa() {
  if (typeof window === "undefined") {
    return false;
  }

  return window.matchMedia(
    "(display-mode: standalone)",
  ).matches;
}

/* -------------------------------------------------------------------------- */
/* COMPONENT                                                                  */
/* -------------------------------------------------------------------------- */

export default function GoogleReviewsPoster({
  restaurantName,
  logoUrl,
  reviewsUrl,
}: Props) {
  const [qr, setQr] = useState("");
  const [busy, setBusy] = useState<
    "png" | "pdf" | null
  >(null);

  /* ------------------------------------------------------------------------ */
  /* GENERAR QR                                                               */
  /* ------------------------------------------------------------------------ */

  useEffect(() => {
    async function generateQR() {
      if (!reviewsUrl?.trim()) {
        setQr("");
        return;
      }

      try {
        const result =
          await QRCode.toDataURL(
            reviewsUrl.trim(),
            {
              width: 1000,
              margin: 2,
              errorCorrectionLevel: "H",
              color: {
                dark: "#000000",
                light: "#ffffff",
              },
            },
          );

        setQr(result);
      } catch (error) {
        console.error(
          "Error generando QR de Google Reviews:",
          error,
        );

        setQr("");
      }
    }

    generateQR();
  }, [reviewsUrl]);

  /* ------------------------------------------------------------------------ */
  /* GENERAR IMAGEN DEL POSTER                                                */
  /* ------------------------------------------------------------------------ */

  async function getPosterImage() {
    const poster =
      document.getElementById(
        "google-review-poster",
      );

    if (!poster) {
      console.error(
        "No se encontró #google-review-poster",
      );

      return null;
    }

    try {
      /*
       * Esperar fuentes.
       */

      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      /*
       * Esperar imágenes.
       */

      const images = Array.from(
        poster.querySelectorAll("img"),
      );

      await Promise.all(
        images.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>(
                  (resolve) => {
                    img.addEventListener(
                      "load",
                      () => resolve(),
                      { once: true },
                    );

                    img.addEventListener(
                      "error",
                      () => resolve(),
                      { once: true },
                    );
                  },
                ),
        ),
      );

      /*
       * Pequeña pausa para que WebView termine de pintar.
       */

      await new Promise((resolve) =>
        requestAnimationFrame(() =>
          requestAnimationFrame(resolve),
        ),
      );

      const rect =
        poster.getBoundingClientRect();

      const width = Math.max(
        1,
        Math.ceil(rect.width),
      );

      const height = Math.max(
        1,
        Math.ceil(rect.height),
      );

      return await toPng(poster, {
        cacheBust: true,
        pixelRatio: 3,
        backgroundColor: "#ffffff",

        width,
        height,

        canvasWidth: width * 3,
        canvasHeight: height * 3,

        style: {
          width: `${width}px`,
          height: `${height}px`,
          margin: "0",
          transform: "none",
        },
      });
    } catch (error) {
      console.error(
        "Error generando imagen del cartel:",
        error,
      );

      return null;
    }
  }

  /* ------------------------------------------------------------------------ */
  /* DESCARGAR PNG                                                            */
  /* ------------------------------------------------------------------------ */

 async function downloadPoster() {
  if (busy) return;

  setBusy("png");

  try {
    const image = await getPosterImage();

    if (!image) {
      alert(
        "No fue posible generar el PNG del cartel.",
      );
      return;
    }

    const fileName = `${sanitizeFileName(
      restaurantName,
    )}-google-review.png`;

    const isAndroid =
      isNativeAndroid();

    // ANDROID
    if (isAndroid) {
      const base64 =
        image.split(",")[1];

      if (!base64) {
        throw new Error(
          "No fue posible obtener el PNG en Base64.",
        );
      }

      await saveBase64FileOnAndroid(
        base64,
        fileName,
        "image/png",
      );

      return;
    }

    // WEB
    const link =
      document.createElement("a");

    link.download = fileName;
    link.href = image;

    document.body.appendChild(link);

    link.click();

    link.remove();
  } catch (error) {
    console.error(
      "Error descargando PNG:",
      error,
    );

    alert(
      "No fue posible descargar el PNG.",
    );
  } finally {
    setBusy(null);
  }
}

  /* ------------------------------------------------------------------------ */
  /* GENERAR PDF                                                              */
  /* ------------------------------------------------------------------------ */

  async function createPosterPdf(
    image: string,
  ) {
    const {
      PDFDocument,
    } = await import("pdf-lib");

    const pdf =
      await PDFDocument.create();

    /*
     * A4 en puntos.
     */

    const pageWidth = 595.28;
    const pageHeight = 841.89;

    const margin = 28;

    const page =
      pdf.addPage([
        pageWidth,
        pageHeight,
      ]);

    /*
     * Fondo blanco.
     */

    const {
      rgb,
    } = await import("pdf-lib");

    page.drawRectangle({
      x: 0,
      y: 0,
      width: pageWidth,
      height: pageHeight,
      color: rgb(
        1,
        1,
        1,
      ),
    });

    /*
     * Convertir PNG a bytes.
     */

    const pngBytes =
      dataUrlToUint8Array(
        image,
      );

    const embeddedImage =
      await pdf.embedPng(
        pngBytes,
      );

    const originalWidth =
      embeddedImage.width;

    const originalHeight =
      embeddedImage.height;

    /*
     * Área disponible.
     */

    const availableWidth =
      pageWidth - margin * 2;

    const availableHeight =
      pageHeight - margin * 2;

    /*
     * Mantener proporción.
     */

    const scale = Math.min(
      availableWidth /
        originalWidth,
      availableHeight /
        originalHeight,
    );

    const drawWidth =
      originalWidth * scale;

    const drawHeight =
      originalHeight * scale;

    /*
     * Centrar.
     */

    const x =
      (pageWidth -
        drawWidth) /
      2;

    const y =
      (pageHeight -
        drawHeight) /
      2;

    page.drawImage(
      embeddedImage,
      {
        x,
        y,
        width: drawWidth,
        height: drawHeight,
      },
    );

    return await pdf.save();
  }

  /* ------------------------------------------------------------------------ */
  /* DESCARGAR / ABRIR PDF                                                    */
  /* ------------------------------------------------------------------------ */

  async function downloadPDF() {
    if (busy) return;

    setBusy("pdf");

    try {
      const image =
        await getPosterImage();

      if (!image) {
        alert(
          "No fue posible generar el cartel para PDF.",
        );

        return;
      }

      const pdfBytes =
        await createPosterPdf(
          image,
        );

      const fileName = `${sanitizeFileName(
        restaurantName,
      )}-google-review.pdf`;

      /*
       * ================================================================
       * ANDROID CAPACITOR
       * ================================================================
       *
       * El proyecto ya tiene:
       *
       * @capgo/capacitor-printer
       *
       * instalado y funcionando.
       *
       * En Android enviamos el PDF directamente
       * al PrintManager nativo.
       */

      if (isNativeAndroid()) {
        try {
          const {
            Printer,
          } = await import(
            "@capgo/capacitor-printer"
          );

          const bytes =
            new Uint8Array(
              pdfBytes,
            );

          const chunkSize =
            0x8000;

          let binary = "";

          for (
            let index = 0;
            index <
            bytes.length;
            index += chunkSize
          ) {
            binary +=
              String.fromCharCode(
                ...bytes.subarray(
                  index,
                  Math.min(
                    index +
                      chunkSize,
                    bytes.length,
                  ),
                ),
              );
          }

          const base64 =
            btoa(binary);

          await Printer.printBase64(
            {
              name:
                restaurantName
                  ? `Google Reviews - ${restaurantName}`
                  : "Google Reviews",
              data: base64,
              mimeType:
                "application/pdf",
            },
          );

          return;
        } catch (error) {
          console.warn(
            "No fue posible abrir el PDF mediante el PrintManager de Android:",
            error,
          );

          /*
           * Si el usuario cancela el diálogo o
           * el plugin falla, continuamos con
           * los fallbacks.
           */
        }
      }

      /*
       * ================================================================
       * MÓVIL / PWA
       * ================================================================
       *
       * Compartimos el PDF como archivo real.
       *
       * Desde Android el usuario podrá:
       *
       * - Guardarlo
       * - Abrirlo
       * - Imprimirlo
       * - Enviarlo
       * - Guardarlo en Drive/Archivos
       */

      if (
        (isMobileDevice() ||
          isStandalonePwa()) &&
        typeof navigator !== "undefined" &&
        typeof navigator.share === "function"
      ) {
        try {
          const blob =
            new Blob(
              [
                new Uint8Array(
                  pdfBytes,
                ),
              ],
              {
                type:
                  "application/pdf",
              },
            );

          const file =
            new File(
              [blob],
              fileName,
              {
                type:
                  "application/pdf",
              },
            );

          const canShare =
            typeof navigator.canShare ===
            "function"
              ? navigator.canShare({
                  files: [file],
                })
              : true;

          if (canShare) {
            await navigator.share({
              title:
                "Google Reviews",
              text:
                `Cartel de Google Reviews - ${
                  restaurantName ||
                  "Restaurante"
                }`,
              files: [file],
            });

            return;
          }
        } catch (error) {
          if (
            error instanceof DOMException &&
            error.name === "AbortError"
          ) {
            return;
          }

          console.warn(
            "No fue posible compartir PDF:",
            error,
          );
        }
      }

      /*
       * ================================================================
       * WEB / DESKTOP
       * ================================================================
       */

      const blob =
        new Blob(
          [
            new Uint8Array(
              pdfBytes,
            ),
          ],
          {
            type:
              "application/pdf",
          },
        );

      const url =
        URL.createObjectURL(
          blob,
        );

      const link =
        document.createElement("a");

      link.href = url;
      link.download =
        fileName;

      document.body.appendChild(
        link,
      );

      link.click();

      link.remove();

      window.setTimeout(
        () =>
          URL.revokeObjectURL(
            url,
          ),
        60_000,
      );
    } catch (error) {
      console.error(
        "Error generando PDF de Google Reviews:",
        error,
      );

      alert(
        "No fue posible generar el PDF.",
      );
    } finally {
      setBusy(null);
    }
  }


  /* ------------------------------------------------------------------------ */
  /* UI                                                                        */
  /* ------------------------------------------------------------------------ */

  return (
    <section className="wrapper">
      <style jsx>{`
        .wrapper {
          width: 100%;
          max-width: 100%;
          padding: 18px;
          box-sizing: border-box;
          border-radius: 22px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.03);
          overflow: hidden;
        }

        .title {
          color: white;
          font-size: 12px;
          font-weight: 900;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }

        .subtitle {
          margin-top: 5px;
          color: #777;
          font-size: 11px;
        }

        .poster {
          width: 380px;
          max-width: calc(100vw - 36px);
          box-sizing: border-box;

          margin: 20px auto;
          padding: 30px 24px 26px;

          border-radius: 28px;
          border: 1px solid #dadce0;

          background: #ffffff;
          color: #202124;

          text-align: center;

          box-shadow:
            0 14px 38px rgba(60, 64, 67, 0.16);

          overflow: visible;
        }

        .poster > * {
          max-width: 100%;
          min-width: 0;
        }

        .logo {
          width: 78px;
          height: 78px;

          flex: 0 0 78px;

          margin: 0 auto;

          border-radius: 50%;
          overflow: hidden;

          display: grid;
          place-items: center;

          background: #ffffff;
          border: 1px solid #dadce0;

          box-shadow:
            0 4px 14px rgba(60, 64, 67, 0.12);
        }

        .logo img {
          width: 100%;
          height: 100%;
          display: block;
          object-fit: cover;
        }

        .fallback {
          font-size: 35px;
        }

        .name {
          width: 100%;
          max-width: 100%;

          margin-top: 16px;

          color: #202124;

          font-size: 24px;
          font-weight: 800;

          line-height: 1.15;
          text-align: center;

          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .stars {
          width: 100%;

          margin: 14px 0 12px;

          font-size: 28px;
          line-height: 1;

          color: #fbbc04;

          text-align: center;
          white-space: nowrap;

          letter-spacing: 1px;
        }

        .message {
          width: 100%;
          max-width: 100%;

          margin: 0 auto;

          color: #5f6368;

          font-size: 14px;
          line-height: 1.55;

          text-align: center;

          overflow-wrap: anywhere;
          word-break: break-word;
        }

        .qr-box {
          width: 224px;
          height: 224px;
          max-width: 100%;

          margin: 24px auto 18px;
          padding: 12px;

          box-sizing: border-box;

          background: #ffffff;

          border: 1px solid #dadce0;
          border-radius: 22px;

          display: flex;
          align-items: center;
          justify-content: center;

          overflow: hidden;

          box-shadow:
            0 3px 12px rgba(60, 64, 67, 0.10);
        }

        .qr {
          display: block;

          width: 100%;
          height: 100%;

          max-width: 100%;
          max-height: 100%;

          object-fit: contain;
        }

        .scan {
          width: 100%;

          color: #202124;

          font-size: 14px;
          font-weight: 700;
          line-height: 1.3;

          text-align: center;
        }

        .google {
          width: 100%;

          margin-top: 7px;

          font-size: 16px;
          font-weight: 800;

          text-align: center;

          background:
            linear-gradient(
              90deg,
              #4285f4 0%,
              #34a853 35%,
              #fbbc05 68%,
              #ea4335 100%
            );

          -webkit-background-clip: text;
          background-clip: text;

          color: transparent;
        }

        .actions {
          width: 100%;

          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));

          gap: 8px;
        }

        button {
          min-width: 0;

          min-height: 42px;

          padding: 0 10px;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.05);

          color: white;

          border:
            1px solid
            rgba(255, 255, 255, 0.1);

          font-weight: 800;
          font-size: 11px;

          cursor: pointer;

          box-sizing: border-box;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        button:hover:not(:disabled) {
          background:
            rgba(255, 255, 255, 0.09);

          transform: translateY(-1px);
        }

        button:disabled {
          opacity: 0.45;
          cursor: default;
        }

        @media (max-width: 480px) {
          .wrapper {
            padding: 12px;
          }

          .poster {
            width: 100%;
            max-width: 380px;

            padding: 26px 18px 24px;

            margin-left: auto;
            margin-right: auto;
          }

          .name {
            font-size: 24px;
          }

          .stars {
            font-size: 27px;
          }

          .message {
            font-size: 14px;
          }

          .qr-box {
            width: min(220px, 100%);
            height: auto;
            aspect-ratio: 1 / 1;
          }

          .actions {
            grid-template-columns: 1fr;
          }

          button {
            width: 100%;
          }
        }
      `}</style>

      <div className="title">
        Material premium
      </div>

      <div className="subtitle">
        Cartel QR para mesa o recepción
      </div>

      <div
        id="google-review-poster"
        className="poster"
      >
        {/* GOOGLE */}

        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 7,
            marginBottom: 4,
            color: "#5f6368",
            fontSize: 12,
            fontWeight: 700,
            letterSpacing: "0.02em",
          }}
        >
          <span
            style={{
              fontSize: 22,
              fontWeight: 900,
              lineHeight: 1,
              background:
                "linear-gradient(135deg, #4285f4 0%, #34a853 38%, #fbbc05 68%, #ea4335 100%)",
              WebkitBackgroundClip:
                "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            G
          </span>

          <span>
            Reseñas en Google
          </span>
        </div>

        <div
          style={{
            width: "64px",
            height: "3px",
            margin: "8px auto 18px",
            borderRadius: "99px",
            background:
              "linear-gradient(90deg, #4285f4 0%, #34a853 35%, #fbbc05 68%, #ea4335 100%)",
          }}
        />

        {/* LOGO */}

        <div className="logo">
          {logoUrl ? (
            <img
              src={logoUrl}
              alt={restaurantName}
            />
          ) : (
            <span className="fallback">
              🍽️
            </span>
          )}
        </div>

        {/* NOMBRE */}

        <div className="name">
          {restaurantName ||
            "Restaurante"}
        </div>

        {/* ESTRELLAS */}

        <div className="stars">
          ★★★★★
        </div>

        {/* MENSAJE */}

        <div className="message">
          ¿Te gustó nuestra
          atención?
          <br />
          Ayúdanos dejando una
          reseña en Google.
        </div>

        {/* QR */}

        {qr ? (
          <div className="qr-box">
            <img
              className="qr"
              src={qr}
              alt="QR Google Reviews"
            />
          </div>
        ) : (
          <div
            style={{
              margin:
                "24px auto 18px",
              color: "#777",
              fontSize: 12,
            }}
          >
            Configura Google Reviews
          </div>
        )}

        {/* CTA */}

        <div className="scan">
          Escanea el código para
          dejar tu reseña
        </div>

        <div className="google">
          Google Reviews
        </div>
      </div>

      {/* ACCIONES */}

      <div className="actions">
        <button
          type="button"
          onClick={downloadPoster}
          disabled={
            busy !== null
          }
        >
          {busy === "png"
            ? "Generando PNG..."
            : "🖼 Descargar PNG"}
        </button>

        <button
          type="button"
          onClick={downloadPDF}
          disabled={
            busy !== null
          }
        >
          {busy === "pdf"
            ? "Generando PDF..."
            : "📄 Descargar PDF"}
        </button>

      </div>
    </section>
  );
}