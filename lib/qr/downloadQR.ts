export function downloadPNG(
  qrImage: string,
  restaurantName: string
) {

  const link =
    document.createElement("a");

  link.href = qrImage;

  link.download =
    `${restaurantName
      .replace(/\s+/g, "-")
      .toLowerCase()}-qr.png`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

}