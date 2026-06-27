import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

import fs from "fs";
import path from "path";

import {
  PDFDocument,
  rgb,
  StandardFonts,
} from "pdf-lib";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateInvoiceNumber() {
  return "INV-" + Date.now();
}

export async function POST(
  request: Request
) {
  try {
    const rawBody =
      await request.text();

    console.log(
      "INVOICE BODY:",
      rawBody
    );

    const {
      liquidationId,
    } = JSON.parse(
      rawBody
    );

    const {
      data: liquidation,
      error: liquidationError,
    } = await supabase
      .from("liquidations")
      .select("*")
      .eq(
        "id",
        liquidationId
      )
      .single();

    if (
      liquidationError ||
      !liquidation
    ) {
      return NextResponse.json(
        {
          success: false,
          error:
            "Liquidación no encontrada",
        },
        {
          status: 404,
        }
      );
    }

    /*
 * VALIDAR SI YA EXISTE
 * UNA FACTURA
 */

const {
  data: existingInvoice,
} = await supabase
  .from("wolf_invoices")
  .select("*")
  .eq(
    "liquidation_id",
    liquidation.id
  )
  .maybeSingle();

if (existingInvoice) {
  return NextResponse.json(
    {
      success: false,
      error:
        "Ya existe un invoice para esta liquidación",
    },
    {
      status: 400,
    }
  );
}

    const invoiceNumber =
      generateInvoiceNumber();

    /*
     * 1. CREAR REGISTRO
     */

    const {
      data: invoice,
      error: invoiceError,
    } = await supabase
      .from("wolf_invoices")
      .insert({
        liquidation_id:
          liquidation.id,

        restaurant_id:
          liquidation.restaurant_id,

        invoice_number:
          invoiceNumber,

        total:
          liquidation.wolf_total,

        status:
          "generated",

        invoice_pdf_url:
          null,
      })
      .select()
      .single();

    if (invoiceError) {
      return NextResponse.json(
        {
          success: false,
          error:
            invoiceError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * 2. GENERAR PDF
     */

    const pdf =
  await PDFDocument.create();

const page =
  pdf.addPage([
    900,
    1200,
  ]);

const {
  width,
  height,
} = page.getSize();

const font =
  await pdf.embedFont(
    StandardFonts.Helvetica
  );

const fontBold =
  await pdf.embedFont(
    StandardFonts.HelveticaBold
  );

/*
|--------------------------------------------------------------------------
| COLORES WOLF
|--------------------------------------------------------------------------
*/

const wolfOrange =
  rgb(
    1,
    0.45,
    0
  );

const wolfDark =
  rgb(
    0.05,
    0.05,
    0.05
  );

const wolfGray =
  rgb(
    0.4,
    0.4,
    0.4
  );

/*
|--------------------------------------------------------------------------
| HEADER
|--------------------------------------------------------------------------
*/

page.drawRectangle({
  x: 0,
  y: height - 180,
  width,
  height: 180,
  color: wolfDark,
});

/*
|--------------------------------------------------------------------------
| LOGO
|--------------------------------------------------------------------------
*/

try {
  const logoPath =
    path.join(
      process.cwd(),
      "public",
      "wolf-logo.png"
    );

  const logoBytes =
    fs.readFileSync(
      logoPath
    );

  const logo =
    await pdf.embedPng(
      logoBytes
    );

  page.drawImage(
    logo,
    {
      x: 40,
      y:
        height - 150,
      width: 100,
      height: 100,
    }
  );
} catch {
  console.log(
    "Logo no encontrado"
  );
}

/*
|--------------------------------------------------------------------------
| TITULO
|--------------------------------------------------------------------------
*/

page.drawText(
  "WOLF ORDERING",
  {
    x: 170,
    y:
      height - 70,
    size: 32,
    font: fontBold,
    color: rgb(
      1,
      1,
      1
    ),
  }
);

page.drawText(
  "Restaurant Settlement Invoice",
  {
    x: 170,
    y:
      height - 105,
    size: 16,
    font,
    color: rgb(
      0.85,
      0.85,
      0.85
    ),
  }
);

/*
|--------------------------------------------------------------------------
| INVOICE INFO
|--------------------------------------------------------------------------
*/

page.drawText(
  `Invoice #: ${invoiceNumber}`,
  {
    x: 50,
    y:
      height - 240,
    size: 14,
    font: fontBold,
  }
);

page.drawText(
  `Issue Date: ${new Date().toLocaleDateString()}`,
  {
    x: 50,
    y:
      height - 270,
    size: 12,
    font,
  }
);

page.drawText(
  `Liquidation ID: ${liquidation.id}`,
  {
    x: 50,
    y:
      height - 300,
    size: 12,
    font,
  }
);

/*
|--------------------------------------------------------------------------
| BILL TO
|--------------------------------------------------------------------------
*/

page.drawText(
  "BILL TO",
  {
    x: 50,
    y:
      height - 360,
    size: 18,
    font: fontBold,
    color:
      wolfOrange,
  }
);

page.drawText(
  `Restaurant ID: ${liquidation.restaurant_id}`,
  {
    x: 50,
    y:
      height - 390,
    size: 13,
    font,
  }
);

page.drawText(
  `Period: ${liquidation.month}/${liquidation.year}`,
  {
    x: 50,
    y:
      height - 420,
    size: 13,
    font,
  }
);

/*
|--------------------------------------------------------------------------
| TARJETAS
|--------------------------------------------------------------------------
*/

const cardsY =
  height - 560;

const cardWidth =
  180;

const cardHeight =
  100;

function drawCard(
  x: number,
  title: string,
  value: string
) {
  page.drawRectangle({
    x,
    y: cardsY,
    width:
      cardWidth,
    height:
      cardHeight,
    color: rgb(
      0.97,
      0.97,
      0.97
    ),
  });

  page.drawText(
    title,
    {
      x:
        x + 15,
      y:
        cardsY + 65,
      size: 11,
      font,
      color:
        wolfGray,
    }
  );

  page.drawText(
    value,
    {
      x:
        x + 15,
      y:
        cardsY + 30,
      size: 22,
      font:
        fontBold,
    }
  );
}

drawCard(
  50,
  "TOTAL SALES",
  `$${Number(
    liquidation.sales_total
  ).toFixed(2)}`
);

drawCard(
  260,
  "WOLF FEE",
  `$${Number(
    liquidation.wolf_total
  ).toFixed(2)}`
);

drawCard(
  470,
  "RESTAURANT",
  `$${Number(
    liquidation.restaurant_total
  ).toFixed(2)}`
);

drawCard(
  680,
  "ORDERS",
  `${liquidation.total_orders}`
);

/*
|--------------------------------------------------------------------------
| TABLA
|--------------------------------------------------------------------------
*/

const tableY =
  height - 760;

page.drawRectangle({
  x: 50,
  y: tableY,
  width: 800,
  height: 40,
  color:
    wolfOrange,
});

page.drawText(
  "DESCRIPTION",
  {
    x: 70,
    y:
      tableY + 12,
    size: 13,
    font:
      fontBold,
    color: rgb(
      1,
      1,
      1
    ),
  }
);

page.drawText(
  "AMOUNT",
  {
    x: 700,
    y:
      tableY + 12,
    size: 13,
    font:
      fontBold,
    color: rgb(
      1,
      1,
      1
    ),
  }
);

const rows = [
  [
    "Gross Sales",
    liquidation.sales_total,
  ],
  [
    "Wolf Commission",
    liquidation.wolf_total,
  ],
  [
    "Restaurant Revenue",
    liquidation.restaurant_total,
  ],
];

let currentY =
  tableY - 50;

rows.forEach(
  (row) => {
    page.drawText(
      String(row[0]),
      {
        x: 70,
        y:
          currentY,
        size: 12,
        font,
      }
    );

    page.drawText(
      `$${Number(
        row[1]
      ).toFixed(2)}`,
      {
        x: 700,
        y:
          currentY,
        size: 12,
        font:
          fontBold,
      }
    );

    currentY -= 40;
  }
);

/*
|--------------------------------------------------------------------------
| STATUS
|--------------------------------------------------------------------------
*/

page.drawRectangle({
  x: 50,
  y: 180,
  width: 220,
  height: 60,
  color:
    liquidation.status ===
    "paid"
      ? rgb(
          0.15,
          0.7,
          0.3
        )
      : rgb(
          1,
          0.6,
          0
        ),
});

page.drawText(
  liquidation.status ===
    "paid"
    ? "PAID"
    : "PENDING",
  {
    x: 110,
    y: 202,
    size: 22,
    font:
      fontBold,
    color: rgb(
      1,
      1,
      1
    ),
  }
);

/*
|--------------------------------------------------------------------------
| FOOTER
|--------------------------------------------------------------------------
*/

page.drawLine({
  start: {
    x: 50,
    y: 120,
  },
  end: {
    x: 850,
    y: 120,
  },
  thickness: 1,
});

page.drawText(
  "Generated by Wolf Ordering Platform",
  {
    x: 50,
    y: 90,
    size: 11,
    font,
    color:
      wolfGray,
  }
);

page.drawText(
  "Restaurant Growth Platform",
  {
    x: 50,
    y: 70,
    size: 11,
    font,
    color:
      wolfGray,
  }
);

    const pdfBytes =
      await pdf.save();

    /*
     * 3. SUBIR PDF
     */

    const fileName =
      `${invoice.id}.pdf`;

    const {
      error: uploadError,
    } =
      await supabase.storage
        .from("invoices")
        .upload(
          fileName,
          pdfBytes,
          {
            contentType:
              "application/pdf",
            upsert: true,
          }
        );

    if (uploadError) {
      console.error(
        uploadError
      );

      return NextResponse.json(
        {
          success: false,
          error:
            uploadError.message,
        },
        {
          status: 500,
        }
      );
    }

    /*
     * 4. URL PUBLICA
     */

    const {
      data:
        publicUrlData,
    } =
      supabase.storage
        .from("invoices")
        .getPublicUrl(
          fileName
        );

    const pdfUrl =
      publicUrlData.publicUrl;

    /*
     * 5. ACTUALIZAR INVOICE
     */

    await supabase
      .from("wolf_invoices")
      .update({
        invoice_pdf_url:
          pdfUrl,
      })
      .eq(
        "id",
        invoice.id
      );

    /*
     * 6. ACTUALIZAR LIQUIDACION
     */

    await supabase
      .from("liquidations")
      .update({
        invoice_url:
          invoice.id,
      })
      .eq(
        "id",
        liquidation.id
      );

    return NextResponse.json({
      success: true,
      invoice,
      pdfUrl,
    });

  } catch (error: any) {
    console.error(
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error?.message ||
          "Error interno del servidor",
      },
      {
        status: 500,
      }
    );
  }
}