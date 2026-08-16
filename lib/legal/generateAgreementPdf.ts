import {
  PDFDocument,
  PDFFont,
  PDFPage,
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

const PAGE_WIDTH = 595.28;
const PAGE_HEIGHT = 841.89;

const MARGIN_X = 46;
const TOP_Y = 54;
const BOTTOM_Y = 54;
const CONTENT_WIDTH = PAGE_WIDTH - MARGIN_X * 2;

const COLORS = {
  ink: rgb(0.08, 0.08, 0.09),
  muted: rgb(0.43, 0.43, 0.45),
  soft: rgb(0.67, 0.67, 0.69),
  line: rgb(0.88, 0.88, 0.89),
  panel: rgb(0.965, 0.965, 0.97),
  accent: rgb(0.95, 0.42, 0.08),
  success: rgb(0.10, 0.58, 0.32),
  white: rgb(1, 1, 1),
};

function clean(value: string | null | undefined) {
  return value?.trim() || "—";
}

function formatAcceptedAt(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value || "—";
  }

  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function splitLongWord(
  word: string,
  font: PDFFont,
  size: number,
  maxWidth: number
) {
  const chunks: string[] = [];
  let current = "";

  for (const char of word) {
    const candidate = current + char;

    if (
      current &&
      font.widthOfTextAtSize(candidate, size) > maxWidth
    ) {
      chunks.push(current);
      current = char;
    } else {
      current = candidate;
    }
  }

  if (current) {
    chunks.push(current);
  }

  return chunks;
}

function wrapText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number
) {
  const result: string[] = [];

  for (const rawLine of text.replace(/\r\n/g, "\n").split("\n")) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      result.push("");
      continue;
    }

    const words = line.split(/\s+/);
    let current = "";

    for (const word of words) {
      if (font.widthOfTextAtSize(word, size) > maxWidth) {
        if (current) {
          result.push(current);
          current = "";
        }

        result.push(
          ...splitLongWord(word, font, size, maxWidth)
        );
        continue;
      }

      const candidate = current
        ? `${current} ${word}`
        : word;

      if (
        current &&
        font.widthOfTextAtSize(candidate, size) > maxWidth
      ) {
        result.push(current);
        current = word;
      } else {
        current = candidate;
      }
    }

    if (current) {
      result.push(current);
    }
  }

  return result;
}

function drawRule(
  page: PDFPage,
  y: number,
  width = CONTENT_WIDTH
) {
  page.drawLine({
    start: { x: MARGIN_X, y },
    end: { x: MARGIN_X + width, y },
    thickness: 0.7,
    color: COLORS.line,
  });
}

function drawHeader(
  page: PDFPage,
  bold: PDFFont,
  regular: PDFFont
) {
  page.drawText("WOLF", {
    x: MARGIN_X,
    y: PAGE_HEIGHT - TOP_Y,
    size: 16,
    font: bold,
    color: COLORS.accent,
  });

  page.drawText("ORDERING", {
    x: MARGIN_X + 48,
    y: PAGE_HEIGHT - TOP_Y,
    size: 16,
    font: bold,
    color: COLORS.ink,
  });

  page.drawText("DOCUMENTO LEGAL", {
    x: PAGE_WIDTH - MARGIN_X - 104,
    y: PAGE_HEIGHT - TOP_Y + 1,
    size: 6.5,
    font: bold,
    color: COLORS.muted,
  });

  page.drawText("Acuerdo comercial", {
    x: PAGE_WIDTH - MARGIN_X - 104,
    y: PAGE_HEIGHT - TOP_Y - 10,
    size: 7,
    font: regular,
    color: COLORS.soft,
  });

  drawRule(page, PAGE_HEIGHT - TOP_Y - 25);
}

function drawFooter(
  page: PDFPage,
  pageNumber: number,
  bold: PDFFont,
  regular: PDFFont
) {
  drawRule(page, BOTTOM_Y - 12);

  page.drawText("WOLF ORDERING", {
    x: MARGIN_X,
    y: BOTTOM_Y - 27,
    size: 6,
    font: bold,
    color: COLORS.muted,
  });

  page.drawText("Documento generado para trazabilidad legal", {
    x: MARGIN_X + 65,
    y: BOTTOM_Y - 27,
    size: 5.5,
    font: regular,
    color: COLORS.soft,
  });

  const pageText = `Página ${pageNumber}`;

  page.drawText(pageText, {
    x:
      PAGE_WIDTH -
      MARGIN_X -
      regular.widthOfTextAtSize(pageText, 5.5),
    y: BOTTOM_Y - 27,
    size: 5.5,
    font: regular,
    color: COLORS.soft,
  });
}

function drawLabelValue(
  page: PDFPage,
  label: string,
  value: string,
  x: number,
  y: number,
  width: number,
  bold: PDFFont,
  regular: PDFFont
) {
  page.drawText(label.toUpperCase(), {
    x,
    y,
    size: 5.5,
    font: bold,
    color: COLORS.soft,
  });

  const lines = wrapText(value, regular, 8.5, width);

  page.drawText(lines[0] || "—", {
    x,
    y: y - 12,
    size: 8.5,
    font: regular,
    color: COLORS.ink,
  });

  return y - 27;
}

export async function generateAgreementPdf(data: Props) {
  const pdf = await PDFDocument.create();

  const regular = await pdf.embedFont(StandardFonts.Helvetica);
  const bold = await pdf.embedFont(StandardFonts.HelveticaBold);

  let page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
  let pageNumber = 1;

  const pages: PDFPage[] = [page];

  const createPage = () => {
    page = pdf.addPage([PAGE_WIDTH, PAGE_HEIGHT]);
    pageNumber += 1;
    pages.push(page);
    return page;
  };

  const usableBottom = BOTTOM_Y + 32;

  const ensureSpace = (height: number) => {
    if (y - height < usableBottom) {
      page = createPage();
      y = PAGE_HEIGHT - TOP_Y - 42;
      drawHeader(page, bold, regular);
      return true;
    }

    return false;
  };

  drawHeader(page, bold, regular);

  let y = PAGE_HEIGHT - TOP_Y - 62;

  page.drawText(clean(data.title), {
    x: MARGIN_X,
    y,
    size: 21,
    font: bold,
    color: COLORS.ink,
    maxWidth: CONTENT_WIDTH,
  });

  y -= 20;

  page.drawText(`Versión ${clean(data.version)}`, {
    x: MARGIN_X,
    y,
    size: 8,
    font: regular,
    color: COLORS.muted,
  });

  y -= 30;

  ensureSpace(108);

  page.drawRectangle({
    x: MARGIN_X,
    y: y - 92,
    width: CONTENT_WIDTH,
    height: 92,
    color: COLORS.panel,
  });

  page.drawText("DATOS DEL ACUERDO", {
    x: MARGIN_X + 14,
    y: y - 16,
    size: 6,
    font: bold,
    color: COLORS.muted,
  });

  const colWidth = (CONTENT_WIDTH - 42) / 2;
  const leftX = MARGIN_X + 14;
  const rightX = leftX + colWidth + 14;

  drawLabelValue(
    page,
    "Restaurante",
    clean(data.restaurantName),
    leftX,
    y - 34,
    colWidth,
    bold,
    regular
  );

  drawLabelValue(
    page,
    "Propietario",
    clean(data.ownerName),
    rightX,
    y - 34,
    colWidth,
    bold,
    regular
  );

  drawLabelValue(
    page,
    "Correo",
    clean(data.ownerEmail),
    leftX,
    y - 62,
    colWidth,
    bold,
    regular
  );

  drawLabelValue(
    page,
    "Aceptado",
    formatAcceptedAt(data.acceptedAt),
    rightX,
    y - 62,
    colWidth,
    bold,
    regular
  );

  y -= 114;

  ensureSpace(62);

  page.drawRectangle({
    x: MARGIN_X,
    y: y - 42,
    width: CONTENT_WIDTH,
    height: 42,
    color: COLORS.white,
    borderColor: COLORS.line,
    borderWidth: 0.7,
  });

  page.drawCircle({
    x: MARGIN_X + 18,
    y: y - 21,
    size: 7,
    color: COLORS.success,
  });

  page.drawText("ACEPTADO", {
    x: MARGIN_X + 32,
    y: y - 17,
    size: 7,
    font: bold,
    color: COLORS.success,
  });

  page.drawText(
    "El acuerdo registra una aceptación electrónica.",
    {
      x: MARGIN_X + 32,
      y: y - 29,
      size: 6.5,
      font: regular,
      color: COLORS.muted,
    }
  );

  y -= 62;

  page.drawText("CONTENIDO DEL ACUERDO", {
    x: MARGIN_X,
    y,
    size: 7,
    font: bold,
    color: COLORS.muted,
  });

  y -= 18;

  const contentLines = wrapText(
    clean(data.content),
    regular,
    9.2,
    CONTENT_WIDTH
  );

  for (const line of contentLines) {
    const lineHeight = line ? 14 : 8;

    ensureSpace(lineHeight);

    if (line) {
      page.drawText(line, {
        x: MARGIN_X,
        y,
        size: 9.2,
        font: regular,
        color: COLORS.ink,
      });
    }

    y -= lineHeight;
  }

  y -= 18;

  ensureSpace(104);

  drawRule(page, y);

  y -= 22;

  page.drawText("EVIDENCIA DE ACEPTACIÓN", {
    x: MARGIN_X,
    y,
    size: 7,
    font: bold,
    color: COLORS.muted,
  });

  y -= 18;

  const evidence = [
    ["Fecha y hora", formatAcceptedAt(data.acceptedAt)],
    ["Dirección IP", clean(data.ip)],
    ["Navegador / dispositivo", clean(data.userAgent)],
    ["Token de trazabilidad", clean(data.token)],
  ];

  for (const [label, value] of evidence) {
    ensureSpace(28);

    page.drawText(label, {
      x: MARGIN_X,
      y,
      size: 6,
      font: bold,
      color: COLORS.soft,
    });

    const valueLines = wrapText(
      value,
      regular,
      7,
      CONTENT_WIDTH - 145
    );

    page.drawText(valueLines[0] || "—", {
      x: MARGIN_X + 145,
      y,
      size: 7,
      font: regular,
      color: COLORS.ink,
    });

    y -= 18;
  }

  pages.forEach((pdfPage, index) => {
    drawFooter(pdfPage, index + 1, bold, regular);
  });

  return await pdf.save();
}