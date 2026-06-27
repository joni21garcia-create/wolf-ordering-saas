import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Wolf Ordering",

    short_name: "Wolf",

    description:
      "Sistema SaaS para pedidos digitales.",

    start_url: "/",

    display: "standalone",

    background_color: "#111827",

    theme_color: "#f97316",

    orientation: "portrait",

    icons: [
      {
        src: "/wolf-logo.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/wolf-logo.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}