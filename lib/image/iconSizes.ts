export interface PWAIconDefinition {
  name: string;
  size: number;
  filename: string;
  type: "image/png"; // Definimos el tipo explícitamente
  purpose?: "any" | "maskable";
  apple?: boolean;
  favicon?: boolean;
}

export const PWA_ICON_SIZES: PWAIconDefinition[] = [
  // Iconos estándar (Android / Windows)
  { name: "icon-72", size: 72, filename: "icon-72.png", type: "image/png" },
  { name: "icon-96", size: 96, filename: "icon-96.png", type: "image/png" },
  { name: "icon-128", size: 128, filename: "icon-128.png", type: "image/png" },
  { name: "icon-144", size: 144, filename: "icon-144.png", type: "image/png" },
  { name: "icon-192", size: 192, filename: "icon-192.png", type: "image/png" },
  { name: "icon-384", size: 384, filename: "icon-384.png", type: "image/png" },
  { name: "icon-512", size: 512, filename: "icon-512.png", type: "image/png" },
  
  // Iconos especializados
  { name: "icon-152", size: 152, filename: "icon-152.png", type: "image/png", apple: true },
  { name: "apple-touch-icon", size: 180, filename: "apple-touch-icon.png", type: "image/png", apple: true },
  { name: "maskable-icon", size: 512, filename: "maskable-icon.png", type: "image/png", purpose: "maskable" },
  
  // Favicon
  { name: "favicon", size: 64, filename: "favicon.png", type: "image/png", favicon: true },
];