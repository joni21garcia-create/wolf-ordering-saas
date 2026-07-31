const PUBLIC_R2_URL = process.env.R2_PUBLIC_URL!;

/**
 * Devuelve la URL pública de un archivo almacenado en R2.
 *
 * Ejemplo:
 * hero/restaurant123/banner.webp
 *
 * =>
 * https://pub-xxxxxxxx.r2.dev/hero/restaurant123/banner.webp
 */
export function getPublicUrl(key: string): string {
  return `${PUBLIC_R2_URL}/${key}`;
}