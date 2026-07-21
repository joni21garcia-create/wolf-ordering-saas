"use client";

interface Props {
  theme: {
    primary_color?: string;
    secondary_color?: string;
    background_color?: string;
    text_color?: string;

    button_style?: string;
    font_family?: string;
    card_style?: string;

    hero_overlay?: string;
    glow_effect?: boolean;

    animation_style?: string;
    shadow_intensity?: string;
  };
}

export default function ThemeProvider({ theme }: Props) {
  if (!theme) return null;

  const getButtonRadius = (style?: string) => {
    switch (style) {
      case "pill":
        return "9999px";

      case "rounded":
        return "16px";

      case "square":
      default:
        return "8px";
    }
  };

  const getCardBackground = (style?: string) => {
    switch (style) {
      case "solid":
        return "rgba(18,18,18,.95)";

      case "neon":
        return "linear-gradient(135deg, rgba(30,15,5,.95) 0%, rgba(10,10,10,.98) 100%)";

      case "glass":
      default:
        return "linear-gradient(135deg, rgba(25,25,25,.60) 0%, rgba(12,12,12,.75) 100%)";
    }
  };

  const getHeroOverlay = (style?: string) => {
    switch (style) {
      case "light":
        return "linear-gradient(90deg, rgba(255,255,255,.30) 0%, rgba(255,255,255,.10) 100%)";

      case "orange":
        return "linear-gradient(90deg, rgba(249,115,22,.70) 0%, rgba(0,0,0,.50) 100%)";

      case "premium":
        return "linear-gradient(90deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.60) 45%, rgba(249,115,22,.15) 100%)";

      case "dark":
      default:
        return "linear-gradient(90deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.75) 45%, rgba(0,0,0,.40) 100%)";
    }
  };

  const getShadow = (value?: string) => {
    switch (value) {
      case "low":
        return "0 8px 20px rgba(0,0,0,.25)";

      case "high":
        return "0 25px 70px rgba(0,0,0,.55)";

      case "medium":
      default:
        return "0 18px 45px rgba(0,0,0,.40)";
    }
  };

  const getAnimation = (value?: string) => {
    switch (value) {
      case "none":
        return "0s";

      case "fast":
        return ".20s";

      case "slow":
        return ".60s";

      case "smooth":
      default:
        return ".35s";
    }
  };

  return (
    <style jsx global>{`
      :root {
        --primary-color: ${theme.primary_color || "#f97316"};
        --secondary-color: ${theme.secondary_color || "#fb923c"};
        --bg-color: ${theme.background_color || "#050505"};
        --text-color: ${theme.text_color || "#ffffff"};

        --btn-radius: ${getButtonRadius(theme.button_style)};
        --card-bg: ${getCardBackground(theme.card_style)};
        --font-family: ${
          theme.font_family
            ? `"${theme.font_family}", sans-serif`
            : "system-ui, sans-serif"
        };

        --hero-overlay: ${getHeroOverlay(theme.hero_overlay)};
        --shadow-style: ${getShadow(theme.shadow_intensity)};
        --animation-speed: ${getAnimation(theme.animation_style)};
      }

      html,
      body {
        background: var(--bg-color) !important;
        color: var(--text-color) !important;
        font-family: var(--font-family) !important;
      }

      button,
      input,
      textarea,
      select {
        font-family: var(--font-family) !important;
        transition:
          background var(--animation-speed),
          color var(--animation-speed),
          border-color var(--animation-speed),
          transform var(--animation-speed),
          box-shadow var(--animation-speed);
        border-radius: var(--btn-radius);
      }

      .premium-card,
      .theme-card,
      .glass-card {
        background: var(--card-bg);
        box-shadow: var(--shadow-style);
        transition: all var(--animation-speed);
      }

      ${
        theme.glow_effect
          ? `
      .premium-card,
      .theme-card,
      .glass-card {
        box-shadow:
          var(--shadow-style),
          0 0 25px color-mix(in srgb, var(--primary-color) 35%, transparent);
      }
      `
          : ""
      }
    `}</style>
  );
}


