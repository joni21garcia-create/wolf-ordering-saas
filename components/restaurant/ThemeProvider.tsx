"use client";

import { useEffect } from "react";
import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  theme?: any;
}

export default function ThemeProvider({ theme }: Props) {
  const resolved = getTheme({ themeSettings: theme });

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;

    root.style.setProperty("--theme-primary", resolved.primary);
    root.style.setProperty("--theme-secondary", resolved.secondary);
    root.style.setProperty("--theme-background", resolved.background);
    root.style.setProperty("--theme-text", resolved.text);
    root.style.setProperty("--theme-radius", `${resolved.radius}px`);
    root.style.setProperty("--theme-font-family", resolved.fontFamily);
    root.style.setProperty("--theme-card-border", resolved.cardBorder ? "1" : "0");
    root.style.setProperty("--theme-glow", resolved.glow ? "1" : "0");

    root.style.backgroundColor = resolved.background;
    body.style.backgroundColor = resolved.background;
    body.style.color = resolved.text;

    return () => {
      root.style.backgroundColor = "";
      body.style.backgroundColor = "";
      body.style.color = "";
    };
  }, [
    resolved.background,
    resolved.text,
    resolved.primary,
    resolved.secondary,
    resolved.radius,
    resolved.fontFamily,
    resolved.cardBorder,
    resolved.glow,
  ]);

  return (
    <style jsx global>{`
      html,
      body {
        min-height: 100%;
        background: var(--theme-background, #09090b) !important;
        color: var(--theme-text, #fff);
      }

      body {
        font-family:
          var(--theme-font-family, Inter),
          ui-sans-serif,
          system-ui,
          -apple-system,
          BlinkMacSystemFont,
          "Segoe UI",
          sans-serif;
      }

      /*
       * Only outer public sections are normalized to the chosen background.
       * Inner cards/overlays keep their own visual treatment, so changing the
       * background does not destroy the existing design language.
       */
      [data-wolf-theme-section="true"],
      #featured-menu,
      [data-wolf-menu],
      [data-wolf-gallery] {
        background: var(--theme-background, #09090b) !important;
        color: var(--theme-text, #fff);
      }

      #__next {
        min-height: 100vh;
        background: var(--theme-background, #09090b);
      }

      ::selection {
        background: color-mix(
          in srgb,
          var(--theme-primary) 30%,
          transparent
        );
        color: var(--theme-text);
      }

      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          scroll-behavior: auto !important;
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
        }
      }
    `}</style>
  );
}
