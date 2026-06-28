import { getManagerPWASettings } from "@/lib/pwa/getManagerPWASettings";

export async function buildManagerManifest() {
  const settings = await getManagerPWASettings();

  if (!settings) {
    throw new Error(
      "No existe configuración de la PWA del Manager."
    );
  }

  return {
    id: "/manager",

    name: settings.app_name,

    short_name: settings.short_name,

    description: settings.description,

    start_url: "/manager",

    scope: "/manager/",

    display: settings.display,

    orientation: settings.orientation,

    background_color:
      settings.background_color,

    theme_color:
      settings.theme_color,

      lang: "es",

      dir: "ltr",

     icons: [
      {
        src:
          settings.icon_72_url ??
          settings.app_logo,
        sizes: "72x72",
        type: "image/png",
      },
      {
        src:
          settings.icon_96_url ??
          settings.app_logo,
        sizes: "96x96",
        type: "image/png",
      },
      {
        src:
          settings.icon_128_url ??
          settings.app_logo,
        sizes: "128x128",
        type: "image/png",
      },
      {
        src:
          settings.icon_144_url ??
          settings.app_logo,
        sizes: "144x144",
        type: "image/png",
      },
      {
        src:
          settings.icon_152_url ??
          settings.app_logo,
        sizes: "152x152",
        type: "image/png",
      },
      {
        src:
          settings.icon_192_url ??
          settings.app_logo,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src:
          settings.icon_384_url ??
          settings.app_logo,
        sizes: "384x384",
        type: "image/png",
      },
      {
        src:
          settings.icon_512_url ??
          settings.app_logo,
        sizes: "512x512",
        type: "image/png",
      },
      {
        src:
          settings.maskable_icon_url ??
          settings.app_logo,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}