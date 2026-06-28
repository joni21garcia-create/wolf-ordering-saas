export interface ManifestIcon {
  src: string;
  sizes: string;
  type: "image/png";
  purpose?: "any" | "maskable";
}

export interface WolfManifest {
  id: string;

  name: string;

  short_name: string;

  description: string;

  start_url: string;

  scope: string;

  display:
    | "standalone"
    | "fullscreen"
    | "minimal-ui"
    | "browser";

  orientation:
    | "portrait"
    | "landscape"
    | "any";

  background_color: string;

  theme_color: string;

  lang?: string;

  dir?: "ltr" | "rtl";

  icons: ManifestIcon[];
}