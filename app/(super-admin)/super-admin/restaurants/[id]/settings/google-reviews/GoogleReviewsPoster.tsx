"use client";

import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { toPng } from "html-to-image";

interface Props {
  restaurantName: string;
  logoUrl: string | null;
  reviewsUrl: string;
}

export default function GoogleReviewsPoster({
  restaurantName,
  logoUrl,
  reviewsUrl,
}: Props) {
  const [qr, setQr] = useState("");

  /*
   * ============================================================
   * GENERAR QR
   * ============================================================
   */

  useEffect(() => {
    async function generateQR() {
      if (!reviewsUrl) {
        setQr("");
        return;
      }

      try {
        const result = await QRCode.toDataURL(reviewsUrl, {
          width: 800,
          margin: 1,
          errorCorrectionLevel: "H",
        });

        setQr(result);
      } catch (error) {
        console.error("Error generando QR:", error);
        setQr("");
      }
    }

    generateQR();
  }, [reviewsUrl]);

  /*
   * ============================================================
   * GENERAR IMAGEN DEL POSTER
   * ============================================================
   */

  async function getPosterImage() {
    const poster = document.getElementById(
      "google-review-poster"
    );

    if (!poster) {
      console.error(
        "No se encontró el elemento #google-review-poster"
      );

      return null;
    }

    try {
      if (document.fonts?.ready) {
        await document.fonts.ready;
      }

      const images = Array.from(poster.querySelectorAll("img"));
      await Promise.all(
        images.map(
          (img) =>
            img.complete
              ? Promise.resolve()
              : new Promise<void>((resolve) => {
                  img.addEventListener("load", () => resolve(), { once: true });
                  img.addEventListener("error", () => resolve(), { once: true });
                })
        )
      );

      const rect = poster.getBoundingClientRect();
      const width = Math.ceil(rect.width);
      const height = Math.ceil(rect.height);

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
        "Error generando imagen del poster:",
        error
      );

      return null;
    }
  }

  /*
   * ============================================================
   * DESCARGAR PNG
   * ============================================================
   */

  async function downloadPoster() {
    const image = await getPosterImage();

    if (!image) return;

    const link = document.createElement("a");

    link.download = `${
      restaurantName || "restaurante"
    }-google-review.png`;

    link.href = image;

    document.body.appendChild(link);

    link.click();

    link.remove();
  }

  /*
   * ============================================================
   * IMPRIMIR POSTER
   * ============================================================
   *
   * IMPORTANTE:
   * La impresión utiliza exactamente la misma imagen
   * generada para el PNG.
   *
   * Primero debemos asegurarnos de que el poster original
   * ya esté correctamente construido.
   */

  async function printPoster() {
    const image = await getPosterImage();

    if (!image) return;

    const win = window.open("", "_blank");

    if (!win) {
      alert(
        "El navegador bloqueó la ventana de impresión. " +
          "Permite ventanas emergentes para este sitio."
      );

      return;
    }

    win.document.open();

    win.document.write(`
      <!DOCTYPE html>

      <html lang="es">

      <head>

        <meta charset="UTF-8" />

        <title>
          ${restaurantName || "Google Reviews"}
        </title>

        <style>

          *,
          *::before,
          *::after {
            box-sizing: border-box;
          }

          @page {
            size: A4 portrait;
            margin: 0;
          }

          html,
          body {
            margin: 0;
            padding: 0;
            width: 100%;
            min-height: 100%;
            background: #ffffff;
          }

          body {
            display: flex;
            justify-content: center;
            align-items: center;
          }

          .print-page {
            width: 100vw;
            height: 100vh;
            min-height: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 8mm;
          }

          .print-poster {
            display: block;
            width: auto;
            height: auto;
            max-width: 100%;
            max-height: 100%;
            object-fit: contain;
            object-position: center center;
            margin: 0 auto;
          }

          @media print {
            html,
            body {
              width: 210mm;
              height: 297mm;
              min-height: 297mm;
            }

            .print-page {
              width: 210mm;
              height: 297mm;
              min-height: 297mm;
              padding: 8mm;
              display: flex;
              justify-content: center;
              align-items: center;
              overflow: hidden;
            }

            .print-poster {
              width: auto;
              height: auto;
              max-width: 100%;
              max-height: 100%;
              object-fit: contain;
              object-position: center center;
              margin: 0 auto;
            }
          }

        </style>

      </head>

      <body>

        <main class="print-page">

          <img
            class="print-poster"
            src="${image}"
            alt="Poster Google Reviews"
          />

        </main>

        <script>

          const image =
            document.querySelector(".print-poster");

          function printWhenReady() {

            if (image && image.complete) {

              setTimeout(() => {

                window.focus();

                window.print();

              }, 250);

            }

          }

          if (image) {

            image.addEventListener(
              "load",
              printWhenReady
            );

          }

          printWhenReady();

        </script>

      </body>

      </html>
    `);

    win.document.close();
  }

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <section className="wrapper">

      <style jsx>{`

        /*
         * ======================================================
         * CONTENEDOR PRINCIPAL
         * ======================================================
         */

        .wrapper {
          width: 100%;
          max-width: 100%;

          padding: 18px;

          box-sizing: border-box;

          border-radius: 22px;

          border: 1px solid
            rgba(255, 255, 255, 0.08);

          background:
            rgba(255, 255, 255, 0.03);

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

        /*
         * ======================================================
         * POSTER
         * ======================================================
         *
         * ESTA ES LA CORRECCIÓN PRINCIPAL.
         *
         * El ancho es controlado.
         *
         * box-sizing:border-box hace que el padding quede
         * DENTRO de los 380px.
         *
         * overflow:visible evita que el nombre o QR sean
         * cortados por el propio poster.
         */
        .name {
          width: 100%;
          max-width: 100%;

          margin-top: 16px;

          color: #202124;
          font-size: 27px;
          font-weight: 800;
          line-height: 1.15;

          text-align: center;

          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        /*
         * ======================================================
         * LOGO
         * ======================================================
         */

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

          box-shadow: 0 4px 14px rgba(60, 64, 67, 0.12);
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

        /*
         * ======================================================
         * NOMBRE
         * ======================================================
         *
         * Se permite que el texto se adapte al ancho disponible
         * en lugar de salir por el lado derecho.
         */
        .name {
          width: 100%;
          max-width: 100%;

          margin-top: 16px;

          color: #202124;
          font-size: 27px;
          font-weight: 800;
          line-height: 1.15;

          text-align: center;

          white-space: normal;
          overflow-wrap: anywhere;
          word-break: break-word;
        }

        /*
         * ======================================================
         * ESTRELLAS
         * ======================================================
         */

        .stars {
          width: 100%;

          margin: 14px 0 12px;

          font-size: 30px;
          line-height: 1;

          color: #fbbc04;

          text-align: center;
          white-space: nowrap;

          letter-spacing: 2px;
        }

        /*
         * ======================================================
         * MENSAJE
         * ======================================================
         */

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

        /*
         * ======================================================
         * QR
         * ======================================================
         *
         * El QR nunca puede superar el ancho disponible.
         */

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

          box-shadow: 0 3px 12px rgba(60, 64, 67, 0.10);
        }

.qr {
  display: block;

  width: 100%;
  height: 100%;

  max-width: 100%;
  max-height: 100%;

  object-fit: contain;
}

        /*
         * ======================================================
         * TEXTO INFERIOR
         * ======================================================
         */

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

          background: linear-gradient(
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

        /*
         * ======================================================
         * BOTONES
         * ======================================================
         */

        .actions {
          width: 100%;

          display: flex;

          gap: 8px;
        }

        button {
          flex: 1;

          min-width: 0;

          height: 42px;

          padding: 0 12px;

          border-radius: 12px;

          background:
            rgba(255, 255, 255, 0.05);

          color: white;

          border: 1px solid
            rgba(255, 255, 255, 0.1);

          font-weight: 800;

          cursor: pointer;

          box-sizing: border-box;

          transition:
            background 0.2s ease,
            transform 0.2s ease;
        }

        button:hover {
          background:
            rgba(255, 255, 255, 0.09);

          transform: translateY(-1px);
        }

        /*
         * ======================================================
         * MÓVIL
         * ======================================================
         */

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
            letter-spacing: 1px;
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
            flex-direction: column;
          }

          button {
            width: 100%;
          }

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

          box-shadow: 0 14px 38px rgba(60, 64, 67, 0.16);

          /* Nunca recortar el contenido del poster. */
          overflow: visible;
        }

        .poster > * {
          max-width: 100%;
          min-width: 0;
        }

        .poster .name,
        .poster .message,
        .poster .scan,
        .poster .google {
          overflow: visible;
          white-space: normal;
        }

          .name {
            font-size: 24px;
          }

          .stars {
            font-size: 28px;
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
            flex-direction: column;
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
              WebkitBackgroundClip: "text",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            G
          </span>
          <span>Reseñas en Google</span>
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
          {restaurantName || "Restaurante"}
        </div>

        {/* ESTRELLAS */}

        <div className="stars">
          ★★★★★
        </div>

        {/* MENSAJE */}

        <div className="message">
          ¿Te gustó nuestra atención?
          <br />
          Ayúdanos dejando una reseña en Google.
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
          <div>
            Configura Google Reviews
          </div>
        )}

        {/* CTA */}

        <div className="scan">
          Escanea el código para dejar tu reseña
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
        >
          🖼 Descargar PNG
        </button>

        <button
          type="button"
          onClick={printPoster}
        >
          🖨 Imprimir cartel
        </button>

      </div>

    </section>
  );
}