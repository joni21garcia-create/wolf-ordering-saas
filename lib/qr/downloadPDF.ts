import jsPDF from "jspdf";

interface DownloadPDFProps {
  restaurantName: string;
  qrImage: string;
  url: string;
  logoUrl?: string;
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

  const pageWidth = pdf.internal.pageSize.getWidth();

  let currentY = 18;

  // ------------------------
  // LOGO
  // ------------------------

  if (logoUrl) {

    try {

      const response =
        await fetch(logoUrl);

      const blob =
        await response.blob();

      const base64 =
        await new Promise<string>((resolve) => {

          const reader = new FileReader();

          reader.onloadend = () =>
            resolve(reader.result as string);

          reader.readAsDataURL(blob);

        });

      pdf.addImage(
        base64,
        "PNG",
        pageWidth / 2 - 18,
        currentY,
        36,
        36
      );

      currentY += 44;

    } catch (error) {

      console.warn(
        "No fue posible cargar el logo."
      );

    }

  }

  // ------------------------
  // RESTAURANTE
  // ------------------------

  pdf.setFont("helvetica", "bold");

  pdf.setFontSize(22);

  pdf.text(
    restaurantName,
    pageWidth / 2,
    currentY,
    {
      align: "center",
    }
  );

  currentY += 12;

  pdf.setFontSize(13);

  pdf.setFont("helvetica", "normal");

  pdf.text(
    "Escanea para ordenar",
    pageWidth / 2,
    currentY,
    {
      align: "center",
    }
  );

  currentY += 12;

  // ------------------------
  // QR
  // ------------------------

  pdf.addImage(
    qrImage,
    "PNG",
    pageWidth / 2 - 40,
    currentY,
    80,
    80
  );

  currentY += 92;

  // ------------------------
  // URL
  // ------------------------

  pdf.setFontSize(11);

  pdf.text(
    url,
    pageWidth / 2,
    currentY,
    {
      align: "center",
    }
  );

  currentY += 18;

  pdf.setDrawColor(220);

  pdf.line(
    20,
    currentY,
    pageWidth - 20,
    currentY
  );

  currentY += 10;

  pdf.setFontSize(10);

  pdf.setTextColor(120);

  pdf.text(
    "Powered by Wolf Ordering",
    pageWidth / 2,
    currentY,
    {
      align: "center",
    }
  );

  pdf.save(
    `${restaurantName
      .replace(/\s+/g, "-")
      .toLowerCase()}-qr.pdf`
  );

}