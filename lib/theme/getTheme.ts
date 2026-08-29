export type ThemeSettings = {
  primary_color?: string | null;
  secondary_color?: string | null;
  background_color?: string | null;
  text_color?: string | null;

  button_style?: string | null;
  card_style?: string | null;
  font_family?: string | null;
  hero_overlay?: string | null;
  glow_effect?: boolean | null;
  card_border?: boolean | null;
  animation_style?: string | null;
  shadow_intensity?: string | null;
  radius?: string | number | null;
  theme_style?: string | null;
};

type DesignVisual = {
  designId: string;
  heroStyle: string;
  menuStyle: string;
  galleryStyle: string;
};

const DESIGN_MAP: Record<string, DesignVisual> = {
  cinematic: {
    designId: "cinematic",
    heroStyle: "fullscreen",
    menuStyle: "cinematic",
    galleryStyle: "masonry",
  },
  minimal: {
    designId: "minimal",
    heroStyle: "split",
    menuStyle: "minimal",
    galleryStyle: "minimal",
  },
  luxury: {
    designId: "luxury",
    heroStyle: "framed",
    menuStyle: "luxury",
    galleryStyle: "luxury",
  },
  neon: {
    designId: "neon",
    heroStyle: "asymmetric",
    menuStyle: "neon",
    galleryStyle: "neon",
  },
  editorial: {
    designId: "editorial",
    heroStyle: "editorial",
    menuStyle: "editorial",
    galleryStyle: "editorial",
  },
  glass: {
    designId: "glass",
    heroStyle: "floating",
    menuStyle: "glass",
    galleryStyle: "glass",
  },
  nature: {
    designId: "nature",
    heroStyle: "nature",
    menuStyle: "nature",
    galleryStyle: "nature",
  },
  split: {
    designId: "split",
    heroStyle: "split",
    menuStyle: "cards",
    galleryStyle: "grid",
  },
  center: {
    designId: "center",
    heroStyle: "center",
    menuStyle: "minimal",
    galleryStyle: "grid",
  },
  bold: {
    designId: "bold",
    heroStyle: "bold",
    menuStyle: "cards",
    galleryStyle: "grid",
  },
  classic: {
    designId: "classic",
    heroStyle: "classic",
    menuStyle: "list",
    galleryStyle: "grid",
  },
  air: {
    designId: "air",
    heroStyle: "air",
    menuStyle: "air",
    galleryStyle: "air",
  },
  monolith: {
    designId: "monolith",
    heroStyle: "monolith",
    menuStyle: "monolith",
    galleryStyle: "monolith",
  },
  atelier: {
    designId: "atelier",
    heroStyle: "atelier",
    menuStyle: "atelier",
    galleryStyle: "atelier",
  },
  noir: {
    designId: "noir",
    heroStyle: "noir",
    menuStyle: "signature",
    galleryStyle: "signature",
  },
};


function normalizeDesignId(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function firstString(...values: unknown[]): string | undefined {
  return values.find(
    (value): value is string =>
      typeof value === "string" && value.trim().length > 0
  );
}

function nestedTheme(restaurant: any): any {
  const candidate =
    restaurant?.themeSettings ??
    restaurant?.theme_settings ??
    restaurant?.theme ??
    {};

  return candidate && typeof candidate === "object" ? candidate : {};
}

export function getTheme(restaurant: any) {
  const settings = nestedTheme(restaurant);
  const rawThemeStyle =
    firstString(
      settings.theme_style,
      settings.themeStyle,
      restaurant?.theme_style,
      restaurant?.themeStyle
    ) ?? "cinematic";

  const themeStyle = normalizeDesignId(rawThemeStyle);

  const design = DESIGN_MAP[themeStyle] ?? DESIGN_MAP.cinematic;

  return {
    primary:
      firstString(
        settings.primary_color,
        settings.primary,
        restaurant?.primary_color
      ) ?? "#f97316",

    secondary:
      firstString(
        settings.secondary_color,
        settings.secondary,
        restaurant?.secondary_color
      ) ?? "#111827",

    background:
      firstString(
        settings.background_color,
        settings.background,
        restaurant?.background_color
      ) ?? "#09090b",

    text:
      firstString(
        settings.text_color,
        settings.text,
        restaurant?.text_color
      ) ?? "#ffffff",

    buttonStyle:
      firstString(settings.button_style, restaurant?.button_style) ??
      "rounded",

    cardStyle:
      firstString(settings.card_style, restaurant?.card_style) ??
      "glass",

    fontFamily:
      firstString(settings.font_family, restaurant?.font_family) ??
      "Inter",

    heroOverlay:
      firstString(settings.hero_overlay, restaurant?.hero_overlay) ??
      "dark",

    glow:
      typeof settings.glow_effect === "boolean"
        ? settings.glow_effect
        : typeof restaurant?.glow_effect === "boolean"
          ? restaurant.glow_effect
          : true,

    cardBorder:
      typeof settings.card_border === "boolean"
        ? settings.card_border
        : typeof restaurant?.card_border === "boolean"
          ? restaurant.card_border
          : true,

    animationStyle:
      firstString(
        settings.animation_style,
        restaurant?.animation_style
      ) ?? "smooth",

    shadowIntensity:
      firstString(
        settings.shadow_intensity,
        restaurant?.shadow_intensity
      ) ?? "medium",

    radius:
      settings.radius ?? restaurant?.radius ?? "16",

    themeStyle,

    // Backward-compatible names used by Hero/Menu/Gallery.
    designId:
      firstString(
        settings.design_id,
        settings.designId,
        restaurant?.design_id,
        restaurant?.designId
      ) ?? design.designId,

    heroStyle:
      firstString(
        settings.hero_style,
        settings.heroStyle,
        restaurant?.hero_style,
        restaurant?.heroStyle
      ) ?? design.heroStyle,

    menuStyle:
      firstString(
        settings.menu_style,
        settings.menuStyle,
        restaurant?.menu_style,
        restaurant?.menuStyle
      ) ?? design.menuStyle,

    galleryStyle:
      firstString(
        settings.gallery_style,
        settings.galleryStyle,
        restaurant?.gallery_style,
        restaurant?.galleryStyle
      ) ?? design.galleryStyle,
  };
}
