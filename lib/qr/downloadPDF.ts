import jsPDF from "jspdf";

interface DownloadPDFProps {
  restaurantName: string;
  qrImage: string;
  url: string;
  logoUrl?: string;
}

/**
 * Convierte una imagen remota en PNG circular.
 *
 * Esto permite que el logo del PDF tenga el mismo tratamiento
 * visual circular que PosterPreview y QRPreview.
 */
async function loadCircularLogo(
  logoUrl: string,
  size = 400,
): Promise<string> {
  const response = await fetch(logoUrl);

  if (!response.ok) {
    throw new Error(
      `No fue posible cargar el logo (${response.status}).`,
    );
  }

  const blob = await response.blob();

  const objectUrl = URL.createObjectURL(blob);

  try {
    const image = new Image();

    image.src = objectUrl;

    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () =>
        reject(
          new Error(
            "No fue posible procesar el logo.",
          ),
        );
    });

    const canvas = document.createElement("canvas");

    canvas.width = size;
    canvas.height = size;

    const context = canvas.getContext("2d");

    if (!context) {
      throw new Error(
        "No fue posible crear el canvas del logo.",
      );
    }

    context.clearRect(0, 0, size, size);

    /*
     * Círculo exterior.
     */
    context.beginPath();
    context.arc(
      size / 2,
      size / 2,
      size / 2,
      0,
      Math.PI * 2,
    );
    context.closePath();
    context.clip();

    /*
     * Fondo blanco.
     */
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, size, size);

    /*
     * Object-fit: cover.
     */
    const imageRatio =
      image.width / image.height;

    let drawWidth = size;
    let drawHeight = size;
    let offsetX = 0;
    let offsetY = 0;

    if (imageRatio > 1) {
      drawHeight = size;
      drawWidth = size * imageRatio;
      offsetX = (size - drawWidth) / 2;
    } else {
      drawWidth = size;
      drawHeight = size / imageRatio;
      offsetY = (size - drawHeight) / 2;
    }

    context.drawImage(
      image,
      offsetX,
      offsetY,
      drawWidth,
      drawHeight,
    );

    return canvas.toDataURL("image/png");
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Divide una URL larga para evitar que se salga del PDF.
 */
function drawWrappedUrl(
  pdf: jsPDF,
  url: string,
  pageWidth: number,
  y: number,
): number {
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(120, 120, 120);

  const maxWidth = pageWidth - 48;

  const lines = pdf.splitTextToSize(
    url,
    maxWidth,
  );

  pdf.text(lines, pageWidth / 2, y, {
    align: "center",
  });

  return y + lines.length * 4.5;
}

export async function downloadPDF({
  restaurantName,
  qrImage,
  url,
  logoUrl,
}: DownloadPDFProps) {
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
  });

  const pageWidth =
    pdf.internal.pageSize.getWidth();

  const pageHeight =
    pdf.internal.pageSize.getHeight();

  /*
   * =========================================================
   * COLORES
   * =========================================================
   */

  const dark = {
    r: 17,
    g: 24,
    b: 39,
  };

  const darkSecondary = {
    r: 31,
    g: 41,
    b: 55,
  };

  const orange = {
    r: 249,
    g: 115,
    b: 22,
  };

  const lightText = {
    r: 156,
    g: 163,
    b: 175,
  };

  const darkText = {
    r: 17,
    g: 24,
    b: 39,
  };

  /*
   * =========================================================
   * HEADER
   * =========================================================
   *
   * Aproximamos el mismo lenguaje visual del PosterPreview:
   * fondo oscuro + naranja + logo circular.
   */

  const headerHeight = 72;

  pdf.setFillColor(
    dark.r,
    dark.g,
    dark.b,
  );

  pdf.rect(
    0,
    0,
    pageWidth,
    headerHeight,
    "F",
  );

  /*
   * Orange decorative bar.
   */

  pdf.setFillColor(
    orange.r,
    orange.g,
    orange.b,
  );

  pdf.rect(
    0,
    0,
    pageWidth,
    2.5,
    "F",
  );

  /*
   * =========================================================
   * LOGO
   * =========================================================
   */

  let logoLoaded = false;

  if (logoUrl) {
    try {
      const circularLogo =
        await loadCircularLogo(
          logoUrl,
          500,
        );

      const logoSize = 28;
      const logoX =
        pageWidth / 2 -
        logoSize / 2;

      const logoY = 10;

      /*
       * Orange ring.
       */

      pdf.setFillColor(
        orange.r,
        orange.g,
        orange.b,
      );

      pdf.circle(
        pageWidth / 2,
        logoY + logoSize / 2,
        logoSize / 2 + 1.5,
        "F",
      );

      /*
       * White backing.
       */

      pdf.setFillColor(
        255,
        255,
        255,
      );

      pdf.circle(
        pageWidth / 2,
        logoY + logoSize / 2,
        logoSize / 2,
        "F",
      );

      /*
       * Circular PNG.
       */

      pdf.addImage(
        circularLogo,
        "PNG",
        logoX,
        logoY,
        logoSize,
        logoSize,
      );

      logoLoaded = true;
    } catch (error) {
      console.warn(
        "No fue posible cargar el logo.",
        error,
      );
    }
  }

  /*
   * =========================================================
   * RESTAURANTE
   * =========================================================
   */

  const restaurantTitleY =
    logoLoaded ? 49 : 25;

  pdf.setFont(
    "helvetica",
    "bold",
  );

  pdf.setFontSize(22);

  pdf.setTextColor(
    255,
    255,
    255,
  );

  pdf.text(
    restaurantName,
    pageWidth / 2,
    restaurantTitleY,
    {
      align: "center",
      maxWidth: pageWidth - 40,
    },
  );

  /*
   * =========================================================
   * BADGE
   * =========================================================
   */

  const badgeWidth = 42;
  const badgeHeight = 8;

  const badgeX =
    pageWidth / 2 -
    badgeWidth / 2;

  const badgeY =
    restaurantTitleY + 6;

  pdf.setFillColor(
    60,
    42,
    28,
  );

  pdf.roundedRect(
    badgeX,
    badgeY,
    badgeWidth,
    badgeHeight,
    4,
    4,
    "F",
  );

  pdf.setDrawColor(
    orange.r,
    orange.g,
    orange.b,
  );

  pdf.setLineWidth(0.35);

  pdf.roundedRect(
    badgeX,
    badgeY,
    badgeWidth,
    badgeHeight,
    4,
    4,
    "S",
  );

  pdf.setFont(
    "helvetica",
    "bold",
  );

  pdf.setFontSize(7.5);

  pdf.setTextColor(
    251,
    146,
    60,
  );

  pdf.text(
    "MENÚ DIGITAL",
    pageWidth / 2,
    badgeY + 5.3,
    {
      align: "center",
    },
  );

  /*
   * =========================================================
   * SUBTITLE
   * =========================================================
   */

  pdf.setFont(
    "helvetica",
    "normal",
  );

  pdf.setFontSize(9.5);

  pdf.setTextColor(
    226,
    232,
    240,
  );

  pdf.text(
    "Escanea el código y realiza tu pedido",
    pageWidth / 2,
    badgeY + 14,
    {
      align: "center",
    },
  );

  /*
   * =========================================================
   * QR AREA
   * =========================================================
   */

  const qrSize = 94;

  const qrX =
    pageWidth / 2 -
    qrSize / 2;

  const qrY = 92;

  /*
   * Shadow approximation.
   */

  pdf.setFillColor(
    230,
    232,
    235,
  );

  pdf.roundedRect(
    qrX - 3,
    qrY - 3,
    qrSize + 6,
    qrSize + 6,
    6,
    6,
    "F",
  );

  /*
   * White QR card.
   */

  pdf.setFillColor(
    255,
    255,
    255,
  );

  pdf.roundedRect(
    qrX - 2,
    qrY - 2,
    qrSize + 4,
    qrSize + 4,
    5,
    5,
    "F",
  );

  /*
   * QR.
   */

  pdf.addImage(
    qrImage,
    "PNG",
    qrX,
    qrY,
    qrSize,
    qrSize,
  );

  /*
   * =========================================================
   * CTA
   * =========================================================
   */

  const ctaY =
    qrY + qrSize + 18;

  /*
   * Orange dots.
   */

  pdf.setFillColor(
    orange.r,
    orange.g,
    orange.b,
  );

  pdf.circle(
    pageWidth / 2 - 25,
    ctaY - 1.8,
    1.2,
    "F",
  );

  pdf.circle(
    pageWidth / 2 + 25,
    ctaY - 1.8,
    1.2,
    "F",
  );

  pdf.setFont(
    "helvetica",
    "bold",
  );

  pdf.setFontSize(18);

  pdf.setTextColor(
    darkText.r,
    darkText.g,
    darkText.b,
  );

  pdf.text(
    "Escanéame",
    pageWidth / 2,
    ctaY,
    {
      align: "center",
    },
  );

  /*
   * =========================================================
   * DESCRIPTION
   * =========================================================
   */

  pdf.setFont(
    "helvetica",
    "normal",
  );

  pdf.setFontSize(10);

  pdf.setTextColor(
    107,
    114,
    128,
  );

  const description =
    "Accede al menú digital, realiza tu pedido y disfruta una experiencia rápida y sencilla.";

  const descriptionLines =
    pdf.splitTextToSize(
      description,
      pageWidth - 70,
    );

  pdf.text(
    descriptionLines,
    pageWidth / 2,
    ctaY + 8,
    {
      align: "center",
    },
  );

  /*
   * =========================================================
   * URL
   * =========================================================
   */

  const urlStartY =
    ctaY +
    8 +
    descriptionLines.length * 4.5 +
    12;

  pdf.setDrawColor(
    229,
    231,
    235,
  );

  pdf.setLineWidth(0.3);

  pdf.line(
    24,
    urlStartY,
    pageWidth - 24,
    urlStartY,
  );

  const urlY =
    urlStartY + 9;

  drawWrappedUrl(
    pdf,
    url,
    pageWidth,
    urlY,
  );

  /*
   * =========================================================
   * FOOTER
   * =========================================================
   */

  const footerHeight = 35;

  const footerY =
    pageHeight - footerHeight;

  pdf.setFillColor(
    dark.r,
    dark.g,
    dark.b,
  );

  pdf.rect(
    0,
    footerY,
    pageWidth,
    footerHeight,
    "F",
  );

  /*
   * Orange accent.
   */

  pdf.setFillColor(
    orange.r,
    orange.g,
    orange.b,
  );

  pdf.roundedRect(
    pageWidth / 2 - 12,
    footerY + 8,
    24,
    1.5,
    0.75,
    0.75,
    "F",
  );

  /*
   * Brand.
   */

  pdf.setFont(
    "helvetica",
    "bold",
  );

  pdf.setFontSize(11);

  pdf.setTextColor(
    255,
    255,
    255,
  );

  pdf.text(
    "Wolf Ordering",
    pageWidth / 2,
    footerY + 18,
    {
      align: "center",
    },
  );

  /*
   * Footer subtitle.
   */

  pdf.setFont(
    "helvetica",
    "normal",
  );

  pdf.setFontSize(8.5);

  pdf.setTextColor(
    lightText.r,
    lightText.g,
    lightText.b,
  );

  pdf.text(
    "Menú Digital • Pedidos Online",
    pageWidth / 2,
    footerY + 25,
    {
      align: "center",
    },
  );

  /*
   * =========================================================
   * SAVE
   * =========================================================
   */

  const safeName =
    restaurantName
      .trim()
      .replace(/\s+/g, "-")
      .toLowerCase();

  pdf.save(
    `${safeName}-qr.pdf`,
  );
}