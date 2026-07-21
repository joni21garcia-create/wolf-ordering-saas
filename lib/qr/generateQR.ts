import QRCode from "qrcode";

interface GenerateQROptions {
  url: string;
  size?: number;
  color?: string;
}

export async function generateQRCode({
  url,
  size = 1024,
  color = "#000000",
}: GenerateQROptions): Promise<string> {

  return await QRCode.toDataURL(url, {

    width: size,

    margin: 2,

    errorCorrectionLevel: "H",

    color: {

      dark: color,

      light: "#FFFFFF",

    },

  });

}


