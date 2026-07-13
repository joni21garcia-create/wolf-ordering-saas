import {
  PDFDocument,
  StandardFonts,
  rgb,
} from "pdf-lib";

type Props = {
  title: string;
  version: string;
  content: string;

  ownerName: string;
  ownerEmail: string;

  restaurantName: string;

  acceptedAt: string;

  ip: string | null;
  userAgent: string | null;

  token: string;
};

export async function generateAgreementPdf(
  data: Props
) {
  const pdf =
    await PDFDocument.create();

  const page =
    pdf.addPage([595, 842]);

  const font =
    await pdf.embedFont(
      StandardFonts.Helvetica
    );

  const bold =
    await pdf.embedFont(
      StandardFonts.HelveticaBold
    );

  const {
    width,
    height,
  } = page.getSize();

  let y = height - 50;

  page.drawText(
    "WOLF ORDERING",
    {
      x: 40,
      y,
      size: 22,
      font: bold,
      color: rgb(
        0.95,
        0.42,
        0.08
      ),
    }
  );

  y -= 35;

  page.drawText(
    data.title,
    {
      x: 40,
      y,
      size: 18,
      font: bold,
    }
  );

  y -= 25;

  page.drawText(
    `Versión: ${data.version}`,
    {
      x: 40,
      y,
      size: 11,
      font,
    }
  );

  y -= 18;

  page.drawText(
    `Restaurante: ${data.restaurantName}`,
    {
      x: 40,
      y,
      size: 11,
      font,
    }
  );

  y -= 18;

  page.drawText(
    `Propietario: ${data.ownerName}`,
    {
      x: 40,
      y,
      size: 11,
      font,
    }
  );

  y -= 18;

  page.drawText(
    `Correo: ${data.ownerEmail}`,
    {
      x: 40,
      y,
      size: 11,
      font,
    }
  );

  y -= 18;

  page.drawText(
    `Aceptado: ${data.acceptedAt}`,
    {
      x: 40,
      y,
      size: 11,
      font,
    }
  );

  y -= 18;

  page.drawText(
    `IP: ${data.ip ?? "-"}`,
    {
      x: 40,
      y,
      size: 11,
      font,
    }
  );

  y -= 18;

  page.drawText(
    `Token: ${data.token}`,
    {
      x: 40,
      y,
      size: 11,
      font,
    }
  );

  y -= 30;

  const lines =
    data.content.split("\n");

  for (const line of lines) {
    if (y < 50) {
      break;
    }

    page.drawText(
      line,
      {
        x: 40,
        y,
        size: 10,
        font,
      }
    );

    y -= 14;
  }

  return await pdf.save();
}