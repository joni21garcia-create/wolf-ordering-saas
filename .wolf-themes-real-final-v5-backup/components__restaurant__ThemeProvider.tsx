"use client";

import { useEffect } from "react";
import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  theme?: any;
}

export default function ThemeProvider({ theme: rawTheme }: Props) {
  useEffect(() => {
    const theme = getTheme({
      themeSettings: rawTheme ?? {},
    });

    const root = document.documentElement;
    const body = document.body;

    const fontFamily =
      theme.fontFamily === "Inter"
        ? 'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif'
        : theme.fontFamily;

    const shadow =
      theme.shadowIntensity === "none"
        ? "none"
        : theme.shadowIntensity === "soft"
          ? "0 8px 28px rgba(0,0,0,.18)"
          : theme.shadowIntensity === "strong"
            ? "0 24px 80px rgba(0,0,0,.42)"
            : "0 14px 46px rgba(0,0,0,.30)";

    const glow = theme.glow
      ? `0 0 32px ${theme.primary}40`
      : "none";

    const setVar = (name: string, value: string) => {
      root.style.setProperty(name, value);
    };

    /*
     * These variables are the bridge between ThemeSettings and the existing
     * public components. Components that call getTheme() also receive the
     * same values directly.
     */
    setVar("--primary", theme.primary);
    setVar("--primary-hover", theme.secondary || theme.primary);
    setVar("--secondary", theme.secondary || theme.primary);

    setVar("--background", theme.background);
    setVar("--background-soft", theme.background);
    setVar("--surface", theme.background);
    setVar("--surface-light", theme.background);

    setVar("--text", theme.text);
    setVar("--text-secondary", theme.text);
    setVar("--text-muted", `${theme.text}99`);
    setVar("--border", `${theme.text}18`);

    setVar("--font-family", fontFamily);
    setVar("--radius-sm", theme.radius);
    setVar("--radius-md", theme.radius);
    setVar("--radius-lg", theme.radius);
    setVar("--radius-xl", theme.radius);

    setVar("--wolf-primary", theme.primary);
    setVar("--wolf-secondary", theme.secondary || theme.primary);
    setVar("--wolf-background", theme.background);
    setVar("--wolf-text", theme.text);
    setVar("--wolf-shadow", shadow);
    setVar("--wolf-glow", glow);

    /*
     * Design ids are exposed on BOTH html and body so CSS can target either
     * level. Numeric ids are compatible with the existing 10/20/.../150
     * design family.
     */
    root.dataset.wolfTheme = "true";
    root.dataset.wolfDesign = theme.designId;
    root.dataset.wolfHero = theme.heroStyle;
    root.dataset.wolfMenu = theme.menuStyle;
    root.dataset.wolfGallery = theme.galleryStyle;
    root.dataset.wolfButtonStyle = theme.buttonStyle;
    root.dataset.wolfCardStyle = theme.cardStyle;
    root.dataset.wolfAnimation = theme.animationStyle;
    root.dataset.wolfShadow = theme.shadowIntensity;
    root.dataset.wolfRadius = theme.radius;

    body.dataset.wolfTheme = "true";
    body.dataset.wolfDesign = theme.designId;
    body.dataset.wolfHero = theme.heroStyle;
    body.dataset.wolfMenu = theme.menuStyle;
    body.dataset.wolfGallery = theme.galleryStyle;
    body.dataset.wolfButtonStyle = theme.buttonStyle;
    body.dataset.wolfCardStyle = theme.cardStyle;
    body.dataset.wolfAnimation = theme.animationStyle;
    body.dataset.wolfShadow = theme.shadowIntensity;

    /*
     * Public canvas: use the configured background and remove the old
     * hard-coded global gradient.
     */
    root.style.backgroundColor = theme.background;
    body.style.backgroundColor = theme.background;
    body.style.backgroundImage = "none";
    body.style.color = theme.text;
    body.style.fontFamily = fontFamily;

    const styleId = "wolf-theme-runtime-v4";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;

    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      html[data-wolf-theme="true"] {
        background-color: var(--wolf-background) !important;
      }

      body[data-wolf-theme="true"] {
        background-color: var(--wolf-background) !important;
        background-image: none !important;
        color: var(--wolf-text) !important;
        font-family: var(--font-family) !important;
      }

      /*
       * Only opt-in public sections are repainted. This preserves image
       * layers and the specific artwork of each design.
       */
      body[data-wolf-theme="true"]
      [data-wolf-theme-section="true"] {
        background-color: var(--wolf-background) !important;
        color: var(--wolf-text);
      }

      body[data-wolf-theme="true"]
      [data-wolf-theme-section="true"] h1,
      body[data-wolf-theme="true"]
      [data-wolf-theme-section="true"] h2,
      body[data-wolf-theme="true"]
      [data-wolf-theme-section="true"] h3,
      body[data-wolf-theme="true"]
      [data-wolf-theme-section="true"] h4,
      body[data-wolf-theme="true"]
      [data-wolf-theme-section="true"] h5,
      body[data-wolf-theme="true"]
      [data-wolf-theme-section="true"] h6 {
        color: var(--wolf-text) !important;
      }

      body[data-wolf-theme="true"]
      [data-wolf-theme-section="true"] p {
        color: color-mix(in srgb, var(--wolf-text) 74%, transparent) !important;
      }

      /*
       * Existing global effects remain subtle and follow the selected
       * accent instead of hard-coded orange where components opt in.
       */
      body[data-wolf-theme="true"] [data-wolf-button] {
        font-family: var(--font-family);
        transition:
          transform .22s ease,
          box-shadow .22s ease,
          border-radius .22s ease,
          filter .22s ease;
      }

      body[data-wolf-theme="true"] [data-wolf-button]:hover {
        transform: translateY(-2px);
      }

      body[data-wolf-theme="true"][data-wolf-button-style="pill"]
      [data-wolf-button] {
        border-radius: 999px !important;
      }

      body[data-wolf-theme="true"][data-wolf-button-style="rounded"]
      [data-wolf-button] {
        border-radius: var(--radius-lg) !important;
      }

      body[data-wolf-theme="true"][data-wolf-button-style="square"]
      [data-wolf-button] {
        border-radius: 8px !important;
      }

      body[data-wolf-theme="true"][data-wolf-card-style="glass"]
      [data-wolf-card] {
        background: color-mix(in srgb, var(--wolf-background) 76%, transparent);
        border-color: color-mix(in srgb, var(--wolf-text) 12%, transparent);
        backdrop-filter: blur(16px);
        box-shadow: var(--wolf-shadow);
      }

      body[data-wolf-theme="true"][data-wolf-card-style="solid"]
      [data-wolf-card] {
        background: var(--wolf-background);
        box-shadow: var(--wolf-shadow);
      }

      body[data-wolf-theme="true"][data-wolf-card-style="flat"]
      [data-wolf-card] {
        background: transparent;
        box-shadow: none;
      }

      body[data-wolf-theme="true"][data-wolf-animation="none"] * {
        animation: none !important;
        transition: none !important;
      }

      body[data-wolf-theme="true"][data-wolf-animation="subtle"] * {
        transition-duration: .22s !important;
      }
    `;

    return () => {
      [
        "wolfTheme",
        "wolfDesign",
        "wolfHero",
        "wolfMenu",
        "wolfGallery",
        "wolfButtonStyle",
        "wolfCardStyle",
        "wolfAnimation",
        "wolfShadow",
        "wolfRadius",
      ].forEach((key) => {
        delete (root.dataset as Record<string, string | undefined>)[key];
        delete (body.dataset as Record<string, string | undefined>)[key];
      });

      root.style.removeProperty("background-color");
      body.style.removeProperty("background-color");
      body.style.removeProperty("background-image");
      body.style.removeProperty("color");
      body.style.removeProperty("font-family");

      style?.remove();
    };
  }, [rawTheme]);

  return null;
}
