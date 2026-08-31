import { DESIGN_THEME_REGISTRY } from "@/lib/theme/designThemes";

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

const value = (input: unknown, fallback: string) =>
  typeof input === "string" && input.trim() ? input.trim() : fallback;

const radiusValue = (input: unknown) => {
  const v = value(input, "18px").toLowerCase();
  if (v === "small") return "12px";
  if (v === "medium") return "18px";
  if (v === "large") return "28px";
  if (/^\\d+(?:\\.\\d+)?px$/.test(v)) return v;
  return "18px";
};

const getDesign = (settings: any) => {
  const assigned = settings?.designTheme?.catalog;
  const assignedSlug = value(
    assigned?.slug ?? assigned?.id,
    ""
  ).toLowerCase();

  if (assignedSlug) {
    return (
      DESIGN_THEME_REGISTRY.find(
        (item) => item.slug === assignedSlug || item.id === assignedSlug
      ) ??
      DESIGN_THEME_REGISTRY.find(
        (item) => item.heroStyle === assigned?.hero_style &&
          item.menuStyle === assigned?.menu_style
      ) ??
      DESIGN_THEME_REGISTRY[0]
    );
  }

  return DESIGN_THEME_REGISTRY[0];
};

/**
 * Two independent layers are deliberately kept separate:
 *
 * Theme settings = color / typography / buttons / effects.
 * Design assignment = Hero + Menu + Gallery composition.
 */
export function getTheme(restaurant: any): WolfTheme {
  const settings = restaurant?.themeSettings ?? {};
  const design = getDesign(settings);

  return {
    primary: value(
      settings.primary_color ?? restaurant?.primary_color,
      "#f97316"
    ),
    secondary: value(
      settings.secondary_color ?? restaurant?.secondary_color,
      "#fb923c"
    ),
    background: value(
      settings.background_color ?? restaurant?.background_color,
      "#050505"
    ),
    text: value(
      settings.text_color ?? restaurant?.text_color,
      "#ffffff"
    ),
    buttonStyle: value(
      settings.button_style ?? restaurant?.button_style,
      "Solid"
    ),
    cardStyle: value(
      settings.card_style ?? restaurant?.card_style,
      "glass"
    ),
    fontFamily: value(
      settings.font_family ?? restaurant?.font_family,
      "Inter"
    ),
    heroOverlay: value(
      settings.hero_overlay ?? restaurant?.hero_overlay,
      "dark"
    ),
    glow:
      settings.glow_effect ??
      restaurant?.glow_effect ??
      true,
    animationStyle: value(
      settings.animation_style ?? restaurant?.animation_style,
      "smooth"
    ),
    shadowIntensity: value(
      settings.shadow_intensity ?? restaurant?.shadow_intensity,
      "medium"
    ),
    radius: radiusValue(
      settings.radius ?? restaurant?.radius
    ),

    designId: design.slug,
    heroStyle: design.heroStyle,
    menuStyle: design.menuStyle,
    galleryStyle: design.galleryStyle,
  };
}
