import sharp from "sharp";

export interface OptimizeImageOptions {
  width: number;
  height: number;
  format?: "png" | "webp" | "jpeg";
  quality?: number;
}

export async function optimizeImage(
  image: Buffer,
  options: OptimizeImageOptions
): Promise<Buffer> {

  const {
    width,
    height,
    format = "png",
    quality = 90,
  } = options;

  let pipeline = sharp(image)
    .resize({
      width,
      height,
      fit: "inside",
      withoutEnlargement: true,
    });

  switch (format) {

    case "webp":

      pipeline = pipeline.webp({
        quality,
      });

      break;

    case "jpeg":

      pipeline = pipeline.jpeg({
        quality,
      });

      break;

    default:

      pipeline = pipeline.png({
        compressionLevel: 9,
        quality,
      });

      break;

  }

 const buffer = await pipeline.toBuffer();

console.log("Optimized image bytes:", buffer.length);

return buffer;

}