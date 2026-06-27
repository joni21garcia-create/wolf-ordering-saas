export interface PWAIconDefinition {
  name: string;
  size: number;
  filename: string;
  purpose?: "any" | "maskable";
  apple?: boolean;
  favicon?: boolean;
}

export const PWA_ICON_SIZES: PWAIconDefinition[] = [
  {
    name: "icon-72",
    size: 72,
    filename: "icon-72.png",
  },
  {
    name: "icon-96",
    size: 96,
    filename: "icon-96.png",
  },
  {
    name: "icon-128",
    size: 128,
    filename: "icon-128.png",
  },
  {
    name: "icon-144",
    size: 144,
    filename: "icon-144.png",
  },
  {
    name: "icon-152",
    size: 152,
    filename: "icon-152.png",
    apple: true,
  },
  {
    name: "icon-192",
    size: 192,
    filename: "icon-192.png",
  },
  {
    name: "icon-384",
    size: 384,
    filename: "icon-384.png",
  },
  {
    name: "icon-512",
    size: 512,
    filename: "icon-512.png",
  },
  {
    name: "apple-touch-icon",
    size: 180,
    filename: "apple-touch-icon.png",
    apple: true,
  },
  {
    name: "maskable-icon",
    size: 512,
    filename: "maskable-icon.png",
    purpose: "maskable",
  },
  {
    name: "favicon",
    size: 64,
    filename: "favicon.png",
    favicon: true,
  },
];