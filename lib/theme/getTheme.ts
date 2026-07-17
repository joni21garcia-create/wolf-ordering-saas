export function getTheme(restaurant: any) {
  const settings = restaurant?.themeSettings || {};

  return {
    // Colores principales
    primary:
      settings.primary_color ??
      restaurant?.primary_color ??
      "#f97316",

    secondary:
      settings.secondary_color ??
      restaurant?.secondary_color ??
      "#fb923c",

    background:
      settings.background_color ??
      restaurant?.background_color ??
      "#050505",

    text:
      settings.text_color ??
      restaurant?.text_color ??
      "#ffffff",

    // Estilos
    buttonStyle:
      settings.button_style ??
      restaurant?.button_style ??
      "rounded",

    cardStyle:
      settings.card_style ??
      restaurant?.card_style ??
      "glass",

    fontFamily:
      settings.font_family ??
      restaurant?.font_family ??
      "Inter",

    // Overlay del Hero
    heroOverlay:
      settings.hero_overlay ??
      restaurant?.hero_overlay ??
      "dark",

    // Glow Premium
    glow:
      settings.glow_effect ??
      restaurant?.glow_effect ??
      true,

    // Animaciones
    animationStyle:
      settings.animation_style ??
      restaurant?.animation_style ??
      "smooth",

    // Intensidad de sombras
    shadowIntensity:
      settings.shadow_intensity ??
      restaurant?.shadow_intensity ??
      "medium",
  };
}