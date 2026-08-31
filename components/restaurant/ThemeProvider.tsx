"use client";

import { useEffect } from "react";
import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  theme?: any;
}

export default function ThemeProvider({ theme: rawTheme }: Props) {
  useEffect(() => {
    const theme = getTheme({ themeSettings: rawTheme ?? {} });
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

    const setVar = (name: string, value: string) => {
      root.style.setProperty(name, value);
    };

    // Existing design CSS consumes these exact variable names.
    setVar("--bg-color", theme.background);
    setVar("--text-color", theme.text);
    setVar("--primary-color", theme.primary);
    setVar("--secondary-color", theme.secondary);
    setVar("--shadow-style", shadow);
    setVar("--radius-style", theme.radius);

    // Existing app-wide tokens.
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
    setVar(
      "--wolf-glow",
      theme.glow ? `0 0 34px ${theme.primary}40` : "none"
    );

    root.dataset.wolfTheme = "true";
    root.dataset.wolfDesign = theme.designId;
    root.dataset.wolfHero = theme.heroStyle;
    root.dataset.wolfMenu = theme.menuStyle;
    root.dataset.wolfGallery = theme.galleryStyle;
    root.dataset.wolfButtonStyle = theme.buttonStyle;
    root.dataset.wolfCardStyle = theme.cardStyle;
    root.dataset.wolfAnimation = theme.animationStyle;
    root.dataset.wolfShadow = theme.shadowIntensity;

    body.dataset.wolfTheme = "true";
    body.dataset.wolfDesign = theme.designId;
    body.dataset.wolfHero = theme.heroStyle;
    body.dataset.wolfMenu = theme.menuStyle;
    body.dataset.wolfGallery = theme.galleryStyle;
    body.dataset.wolfButtonStyle = theme.buttonStyle;
    body.dataset.wolfCardStyle = theme.cardStyle;
    body.dataset.wolfAnimation = theme.animationStyle;
    body.dataset.wolfShadow = theme.shadowIntensity;

    root.style.backgroundColor = theme.background;
    body.style.backgroundColor = theme.background;
    body.style.backgroundImage = "none";
    body.style.color = theme.text;
    body.style.fontFamily = fontFamily;

    const styleId = "wolf-theme-runtime-real-final";
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }

    style.textContent = `
      html[data-wolf-theme="true"] {
        background: var(--bg-color) !important;
      }

      body[data-wolf-theme="true"] {
        background: var(--bg-color) !important;
        color: var(--text-color) !important;
        font-family: var(--font-family) !important;
      }

      /* Full public canvas: the selected background wins over the old global gradient. */
      body[data-wolf-theme="true"] #featured-menu,
      body[data-wolf-theme="true"] #menu,
      body[data-wolf-theme="true"] #about,
      body[data-wolf-theme="true"] #services,
      body[data-wolf-theme="true"] #order,
      body[data-wolf-theme="true"] footer,
      body[data-wolf-theme="true"] [data-wolf-theme-section="true"] {
        background: var(--bg-color) !important;
        color: var(--text-color);
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
        color: var(--text-color) !important;
      }

      body[data-wolf-theme="true"] [data-wolf-theme-section="true"] p {
        color: color-mix(in srgb, var(--text-color) 74%, transparent) !important;
      }

      /* Button styles are global only on the public restaurant surface. */
      body[data-wolf-theme="true"] .wolf-hero-actions a > div,
      body[data-wolf-theme="true"] .wolf-hero-actions > button,
      body[data-wolf-theme="true"] #featured-menu button,
      body[data-wolf-theme="true"] #menu button,
      body[data-wolf-theme="true"] #order a[role="button"],
      body[data-wolf-theme="true"] #order button {
        transition:
          transform .22s ease,
          box-shadow .22s ease,
          border-radius .22s ease,
          filter .22s ease;
      }

      body[data-wolf-theme="true"][data-wolf-button-style="Pill"]
      .wolf-hero-actions a > div,
      body[data-wolf-theme="true"][data-wolf-button-style="Pill"]
      #featured-menu button,
      body[data-wolf-theme="true"][data-wolf-button-style="Pill"]
      #menu button,
      body[data-wolf-theme="true"][data-wolf-button-style="Pill"]
      #order a[role="button"],
      body[data-wolf-theme="true"][data-wolf-button-style="Pill"]
      #order button {
        border-radius: 999px !important;
      }

      body[data-wolf-theme="true"][data-wolf-button-style="Glass"]
      .wolf-hero-actions a > div,
      body[data-wolf-theme="true"][data-wolf-button-style="Glass"]
      #featured-menu button,
      body[data-wolf-theme="true"][data-wolf-button-style="Glass"]
      #menu button {
        background: color-mix(in srgb, var(--bg-color) 45%, transparent) !important;
        border: 1px solid color-mix(in srgb, var(--text-color) 18%, transparent) !important;
        backdrop-filter: blur(18px);
      }

      body[data-wolf-theme="true"][data-wolf-button-style="Outline"]
      .wolf-hero-actions a > div,
      body[data-wolf-theme="true"][data-wolf-button-style="Outline"]
      #featured-menu button,
      body[data-wolf-theme="true"][data-wolf-button-style="Outline"]
      #menu button {
        background: transparent !important;
        color: var(--text-color) !important;
        border: 1px solid var(--primary-color) !important;
        box-shadow: none !important;
      }

      body[data-wolf-theme="true"][data-wolf-button-style="Gradient"]
      .wolf-hero-actions a > div,
      body[data-wolf-theme="true"][data-wolf-button-style="Gradient"]
      #featured-menu button,
      body[data-wolf-theme="true"][data-wolf-button-style="Gradient"]
      #menu button {
        background: linear-gradient(135deg, var(--primary-color), var(--secondary-color)) !important;
      }

      body[data-wolf-theme="true"][data-wolf-button-style="Neubrutalism"]
      .wolf-hero-actions a > div,
      body[data-wolf-theme="true"][data-wolf-button-style="Neubrutalism"]
      #featured-menu button,
      body[data-wolf-theme="true"][data-wolf-button-style="Neubrutalism"]
      #menu button {
        border: 2px solid var(--text-color) !important;
        box-shadow: 5px 5px 0 var(--text-color) !important;
        border-radius: 8px !important;
      }

      body[data-wolf-theme="true"][data-wolf-button-style="Solid"]
      .wolf-hero-actions a > div,
      body[data-wolf-theme="true"][data-wolf-button-style="Solid"]
      #featured-menu button,
      body[data-wolf-theme="true"][data-wolf-button-style="Solid"]
      #menu button {
        border-radius: var(--radius-style) !important;
      }

      body[data-wolf-theme="true"] .wolf-hero-actions a:hover > div,
      body[data-wolf-theme="true"] #featured-menu button:hover,
      body[data-wolf-theme="true"] #menu button:hover {
        transform: translateY(-2px);
      }

      body[data-wolf-theme="true"][data-wolf-animation="none"] * {
        animation: none !important;
        transition: none !important;
      }
      body[data-wolf-theme="true"][data-wolf-animation="scale"]
      .wolf-hero-actions a > div,
      body[data-wolf-theme="true"][data-wolf-animation="scale"]
      #featured-menu button,
      body[data-wolf-theme="true"][data-wolf-animation="scale"]
      #menu button {
        transition: transform .2s ease, box-shadow .2s ease !important;
      }
      body[data-wolf-theme="true"][data-wolf-animation="bounce"]
      .wolf-hero-actions a > div:hover,
      body[data-wolf-theme="true"][data-wolf-animation="bounce"]
      #featured-menu button:hover,
      body[data-wolf-theme="true"][data-wolf-animation="bounce"]
      #menu button:hover {
        animation: wolf-theme-bounce .55s cubic-bezier(.34,1.56,.64,1);
      }
      @keyframes wolf-theme-bounce {
        0% { transform:translateY(0) scale(1); }
        55% { transform:translateY(-3px) scale(1.035); }
        100% { transform:translateY(0) scale(1); }
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
      ].forEach((key) => {
        delete (root.dataset as Record<string, string | undefined>)[key];
        delete (body.dataset as Record<string, string | undefined>)[key];
      });
      style?.remove();
    };
  }, [rawTheme]);

  return null;
}
