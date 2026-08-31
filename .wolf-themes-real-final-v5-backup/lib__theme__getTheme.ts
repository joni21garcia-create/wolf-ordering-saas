export interface WolfTheme {
  primary: string;
  secondary: string;
  background: string;
  text: string;

  buttonStyle: string;
  cardStyle: string;
  fontFamily: string;
  heroOverlay: string;

  glow: boolean;
  animationStyle: string;
  shadowIntensity: string;
  radius: string;

  designId: string;
  heroStyle: string;
  menuStyle: string;
  galleryStyle: string;
}

const readString = (value: unknown, fallback: string): string =>
  typeof value === "string" && value.trim()
    ? value.trim()
    : fallback;

const normalizeRadius = (value: unknown): string => {
  const v = readString(value, "18px").toLowerCase();

  if (v === "small") return "12px";
  if (v === "medium") return "18px";
  if (v === "large") return "28px";
  if (/^\d+(?:\.\d+)?px$/.test(v)) return v;

  return "18px";
};

/*
 * ThemeSettings stores the selected visual design in theme_style.
 * Older records may contain a numeric id, a slug, or a display-name slug.
 * Normalize all of those to the ids used by the public design layer.
 */
const normalizeDesignId = (value: unknown): string => {
  const raw = readString(value, "10").toLowerCase();

  const aliases: Record<string, string> = {
    "1": "10",
    "cinematic": "10",
    "cinematic-dark": "10",
    "cinematic / dark": "10",
    "dark": "10",

    "2": "20",
    "minimal": "20",
    "minimal-light": "20",
    "minimal / light": "20",
    "light": "20",

    "3": "30",
    "luxury": "30",
    "luxury-gold": "30",
    "luxury / gold": "30",
    "gold": "30",

    "4": "40",
    "neon": "40",
    "neon-urban": "40",
    "neon / urban": "40",
    "urban": "40",

    "5": "50",
    "editorial": "50",
    "editorial-magazine": "50",
    "editorial / magazine": "50",
    "magazine": "50",

    "6": "60",
    "glass": "60",
    "glass-blur": "60",
    "glass / blur": "60",

    "7": "70",
    "nature": "70",
    "nature-warm": "70",
    "nature / warm": "70",

    "8": "80",
    "split": "80",
    "split-clean": "80",
    "split / clean": "80",

    "9": "90",
    "center": "90",
    "center-focus": "90",
    "center / focus": "90",

    "10": "100",
    "bold": "100",
    "bold-colorful": "100",
    "bold / colorful": "100",

    "11": "110",
    "classic": "110",
    "classic-elegant": "110",
    "classic / elegant": "110",

    "12": "120",
    "air": "120",
    "air-swiss": "120",
    "air / swiss": "120",

    "13": "130",
    "monolith": "130",
    "monolith-luxe": "130",
    "monolith / luxe": "130",

    "14": "140",
    "atelier": "140",
    "atelier-art": "140",
    "atelier / art": "140",

    "15": "150",
    "noir": "150",
    "noir-signature": "150",
    "noir / signature": "150",
    "signature": "150",
  };

  return aliases[raw] ?? raw;
};

export function getTheme(restaurant: any): WolfTheme {
  const settings = restaurant?.themeSettings ?? {};

  const designId = normalizeDesignId(
    settings.design_id ??
      settings.designId ??
      settings.theme_style ??
      restaurant?.design_id ??
      restaurant?.theme_style
  );

  return {
    primary: readString(
      settings.primary_color ?? restaurant?.primary_color,
      "#f97316"
    ),

    secondary: readString(
      settings.secondary_color ?? restaurant?.secondary_color,
      "#fb923c"
    ),

    background: readString(
      settings.background_color ?? restaurant?.background_color,
      "#050505"
    ),

    text: readString(
      settings.text_color ?? restaurant?.text_color,
      "#ffffff"
    ),

    buttonStyle: readString(
      settings.button_style ?? restaurant?.button_style,
      "rounded"
    ),

    cardStyle: readString(
      settings.card_style ?? restaurant?.card_style,
      "glass"
    ),

    fontFamily: readString(
      settings.font_family ?? restaurant?.font_family,
      "Inter"
    ),

    heroOverlay: readString(
      settings.hero_overlay ?? restaurant?.hero_overlay,
      "dark"
    ),

    glow:
      settings.glow_effect ??
      restaurant?.glow_effect ??
      true,

    animationStyle: readString(
      settings.animation_style ?? restaurant?.animation_style,
      "smooth"
    ),

    shadowIntensity: readString(
      settings.shadow_intensity ?? restaurant?.shadow_intensity,
      "medium"
    ),

    radius: normalizeRadius(
      settings.radius ?? restaurant?.radius
    ),

    designId,

    /*
     * Current designs share the same selected visual id unless a future
     * record explicitly overrides one of the three surfaces.
     */
    heroStyle: readString(
      settings.hero_style ?? restaurant?.hero_style,
      designId
    ),

    menuStyle: readString(
      settings.menu_style ?? restaurant?.menu_style,
      designId
    ),

    galleryStyle: readString(
      settings.gallery_style ?? restaurant?.gallery_style,
      designId
    ),
  };
}
