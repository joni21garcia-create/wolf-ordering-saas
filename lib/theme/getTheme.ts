export function getTheme(
  restaurant: any
) {
  return {
    primary:
      restaurant?.themeSettings
        ?.primary_color ||
      restaurant.primary_color,

    secondary:
      restaurant?.themeSettings
        ?.secondary_color ||
      "#fb923c",

    background:
      restaurant?.themeSettings
        ?.background_color ||
      "#050505",

    text:
      restaurant?.themeSettings
        ?.text_color ||
      "#ffffff",

    buttonStyle:
      restaurant?.themeSettings
        ?.button_style ||
      "rounded",

    cardStyle:
      restaurant?.themeSettings
        ?.card_style ||
      "glass",

    glow:
      restaurant?.themeSettings
        ?.glow_effect ??
      true,
  };
}