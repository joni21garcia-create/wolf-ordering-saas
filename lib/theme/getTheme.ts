import { getDesignThemeBySlug } from "@/lib/theme/designThemes";

export function getTheme(restaurant: any) {
  const settings = restaurant?.themeSettings || {};
  const assigned = restaurant?.designTheme || {};
  const design = assigned?.catalog || assigned?.theme || assigned || {};
  const fallback = getDesignThemeBySlug(design?.slug || design?.theme_id);
  const designConfig = (design?.config && typeof design.config === "object" ? design.config : {}) as Record<string, any>;

  return {
    // IMPORTANT: these values remain exclusively controlled by the existing Theme settings.
    primary: settings.primary_color ?? restaurant?.primary_color ?? "#f97316",
    secondary: settings.secondary_color ?? restaurant?.secondary_color ?? "#fb923c",
    background: settings.background_color ?? restaurant?.background_color ?? "#050505",
    text: settings.text_color ?? restaurant?.text_color ?? "#ffffff",
    buttonStyle: settings.button_style ?? restaurant?.button_style ?? "rounded",
    cardStyle: settings.card_style ?? restaurant?.card_style ?? "glass",
    fontFamily: settings.font_family ?? restaurant?.font_family ?? "Inter",
    heroOverlay: settings.hero_overlay ?? restaurant?.hero_overlay ?? "dark",
    glow: settings.glow_effect ?? restaurant?.glow_effect ?? true,
    animationStyle: settings.animation_style ?? restaurant?.animation_style ?? "smooth",
    shadowIntensity: settings.shadow_intensity ?? restaurant?.shadow_intensity ?? "medium",

    // ONLY composition comes from the selected Design.
    designId: design?.slug ?? design?.id ?? fallback.id,
    heroStyle: design?.hero_style ?? fallback.heroStyle,
    menuStyle: design?.menu_style ?? fallback.menuStyle,
    galleryStyle: design?.gallery_style ?? fallback.galleryStyle,
    designName: design?.name ?? fallback.name,
    designConfig,
  };
}
