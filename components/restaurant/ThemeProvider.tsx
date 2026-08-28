"use client";

import React from "react";
import "./DesignChrome.css";

interface Props {
  theme: {
    primary?: string;
    secondary?: string;
    background?: string;
    text?: string;
    buttonStyle?: string;
    fontFamily?: string;
    cardStyle?: string;
    heroOverlay?: string;
    glow?: boolean;
    animationStyle?: string;
    shadowIntensity?: string;
    designId?: string;
    heroStyle?: string;
    menuStyle?: string;
    galleryStyle?: string;
  };
}

export default function ThemeProvider({ theme }: Props) {
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

  React.useEffect(() => {
    const root = document.documentElement;
    root.dataset.wolfDesign = theme.designId || "cinematic";
    return () => {
      delete root.dataset.wolfDesign;
    };
  }, [theme.designId]);

  return (
    <style jsx global>{`
      :root {
        --primary-color: ${theme.primary || "#f97316"};
        --secondary-color: ${theme.secondary || "#fb923c"};
        --bg-color: ${theme.background || "#050505"};
        --text-color: ${theme.text || "#ffffff"};

        --btn-radius: ${getButtonRadius(theme.buttonStyle)};
        --card-bg: ${getCardBackground(theme.cardStyle)};
        --font-family: ${
          theme.fontFamily
            ? `"${theme.fontFamily}", sans-serif`
            : "system-ui, sans-serif"
        };

        --hero-overlay: ${getHeroOverlay(theme.heroOverlay)};
        --shadow-style: ${getShadow(theme.shadowIntensity)};
        --animation-speed: ${getAnimation(theme.animationStyle)};
        --wolf-design: "${theme.designId || "cinematic"}";
      }

      html[data-wolf-design="minimal"],
      body[data-wolf-design="minimal"] {
        color-scheme: light;
      }

      html[data-wolf-design="editorial"],
      body[data-wolf-design="editorial"] {
        --btn-radius: 2px;
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
        theme.glow
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


