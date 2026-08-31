"use client";

import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import {
  ArrowRight,
  ChevronDown,
  Menu as MenuIcon,
  X,
} from "lucide-react";
import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  restaurant: any;
}

type ButtonStyle = "pill" | "rounded" | "square" | "outline" | "ghost";

function resolveButtonStyle(value: unknown): ButtonStyle {
  const normalized = String(value ?? "").toLowerCase();

  if (["pill", "capsule"].includes(normalized)) return "pill";
  if (["square", "sharp", "angular"].includes(normalized)) return "square";
  if (["outline", "outlined"].includes(normalized)) return "outline";
  if (["ghost", "minimal"].includes(normalized)) return "ghost";
  return "rounded";
}

function radiusForStyle(style: ButtonStyle, radius: unknown) {
  if (style === "pill") return 999;
  if (style === "square") return 8;

  const raw = String(radius ?? "").toLowerCase();
  if (raw.includes("xl")) return 22;
  if (raw.includes("lg")) return 16;
  if (raw.includes("sm")) return 8;

  const parsed = Number.parseInt(raw, 10);
  if (Number.isFinite(parsed)) return Math.max(6, Math.min(parsed, 28));

  return style === "ghost" || style === "outline" ? 12 : 14;
}

function animationConfig(style: unknown) {
  const normalized = String(style ?? "").toLowerCase();

  if (["none", "off", "static"].includes(normalized)) {
    return { duration: 0.01, ease: "linear" as const };
  }

  if (["snappy", "fast"].includes(normalized)) {
    return { duration: 0.22, ease: "easeOut" as const };
  }

  return { duration: 0.32, ease: "easeOut" as const };
}

export default function Navbar({ restaurant }: Props) {
  const theme = getTheme(restaurant);

  const aboutEnabled =
    restaurant?.show_about === true ||
    restaurant?.show_about === 1 ||
    restaurant?.show_about === "true" ||
    restaurant?.show_about === "1";

  const scrollToSection = (id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    const navbarHeight =
      document.querySelector(".wolf-navbar")?.getBoundingClientRect().height ?? 0;
    const top =
      target.getBoundingClientRect().top +
      window.scrollY -
      navbarHeight -
      12;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: "smooth",
    });
  };

  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  const buttonStyle = resolveButtonStyle(theme.buttonStyle);
  const buttonRadius = radiusForStyle(buttonStyle, theme.radius);
  const motionConfig = animationConfig(theme.animationStyle);
  const glowEnabled = theme.glow !== false;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [mobileOpen]);

  const surface = scrolled
    ? `color-mix(in srgb, ${theme.background} 88%, transparent)`
    : `color-mix(in srgb, ${theme.background} 56%, transparent)`;

  const buttonCss = useMemo(() => {
    const base: React.CSSProperties = {
      minHeight: 42,
      display: "inline-flex",
      alignItems: "center",
      justifyContent: "center",
      gap: 8,
      padding: "0 15px",
      borderRadius: buttonRadius,
      border: `1px solid ${buttonStyle === "outline" ? `${theme.primary}66` : "transparent"}`,
      background:
        buttonStyle === "outline"
          ? "transparent"
          : buttonStyle === "ghost"
            ? "rgba(255,255,255,.05)"
            : theme.primary,
      color: theme.text,
      boxShadow:
        glowEnabled && !["ghost", "outline"].includes(buttonStyle)
          ? `0 8px 26px ${theme.primary}30`
          : "none",
      fontWeight: 760,
      fontSize: 13,
      lineHeight: 1,
      textDecoration: "none",
      whiteSpace: "nowrap",
      transition:
        "transform .22s ease, box-shadow .22s ease, background .22s ease, border-color .22s ease, opacity .22s ease",
    };

    return base;
  }, [
    buttonRadius,
    buttonStyle,
    glowEnabled,
    theme.primary,
    theme.text,
  ]);

  const closedButtonCss: React.CSSProperties = {
    ...buttonCss,
    background: "transparent",
    color: "#ef4444",
    borderColor: "rgba(239,68,68,.30)",
    boxShadow: "none",
    cursor: "not-allowed",
  };

  return (
    <>
      <motion.nav
        initial={false}
        animate={{ y: 0 }}
        transition={motionConfig}
        className="wolf-navbar"
        style={
          {
            "--nav-bg": surface,
            "--nav-border": scrolled
              ? "rgba(255,255,255,.10)"
              : "transparent",
            "--nav-text": theme.text,
            "--nav-primary": theme.primary,
            "--nav-shadow": scrolled
              ? "0 12px 38px rgba(0,0,0,.16)"
              : "none",
            "--nav-radius": `${buttonRadius}px`,
          } as React.CSSProperties
        }
      >
        <div className="wolf-navbar__inner">
          <a className="wolf-navbar__brand" href="#top">
            <span
              className="wolf-navbar__logo"
              style={{ borderColor: `${theme.primary}88` }}
            >
              {restaurant.logo_url ? (
                <img
                  src={restaurant.logo_url}
                  alt=""
                  className="wolf-navbar__logo-image"
                />
              ) : (
                <span>{String(restaurant.name ?? "R").charAt(0)}</span>
              )}
            </span>

            <span className="wolf-navbar__name">{restaurant.name}</span>
          </a>

          <div className="wolf-navbar__links" aria-label="Navegación principal">
            <a
              href="#menu"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("menu");
              }}
            >
              Menú
            </a>
            {aboutEnabled && (
              <a
                href="#about"
                onClick={(event) => {
                  event.preventDefault();
                  scrollToSection("about");
                }}
              >
                Nosotros
              </a>
            )}
            <a
              href="#contact"
              onClick={(event) => {
                event.preventDefault();
                scrollToSection("contact");
              }}
            >
              Contacto
            </a>
          </div>

          <div className="wolf-navbar__actions">
            {restaurant.is_open ? (
              <Link
                href={`/${restaurant.slug}/order`}
                className={`wolf-navbar__order wolf-navbar__order--${buttonStyle}`}
                style={buttonCss}
              >
                <span>{restaurant.navbar_button_text || "Ordenar Ahora"}</span>
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            ) : (
              <button
                type="button"
                className="wolf-navbar__order wolf-navbar__order--closed"
                style={closedButtonCss}
                disabled
              >
                <span>Cerrado</span>
              </button>
            )}

            <button
              type="button"
              className="wolf-navbar__menu-button"
              onClick={() => setMobileOpen((value) => !value)}
              aria-expanded={mobileOpen}
              aria-controls="wolf-navbar-mobile"
              aria-label={mobileOpen ? "Cerrar menú" : "Abrir menú"}
            >
              {mobileOpen ? (
                <X size={18} strokeWidth={2} />
              ) : (
                <MenuIcon size={18} strokeWidth={2} />
              )}
            </button>
          </div>
        </div>
      </motion.nav>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              className="wolf-navbar__backdrop"
              aria-label="Cerrar menú"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
            />

            <motion.div
              id="wolf-navbar-mobile"
              className="wolf-navbar__mobile-panel"
              initial={{ opacity: 0, y: -10, scale: 0.985 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.985 }}
              transition={motionConfig}
              style={{
                background: `color-mix(in srgb, ${theme.background} 96%, transparent)`,
                borderColor: "rgba(255,255,255,.08)",
              }}
            >
              <div className="wolf-navbar__mobile-head">
                <span>Explorar</span>
                <ChevronDown size={15} strokeWidth={1.8} />
              </div>

              <a
                href="#menu"
                onClick={(event) => {
                  event.preventDefault();
                  setMobileOpen(false);
                  scrollToSection("menu");
                }}
              >
                <span>Menú</span>
                <ArrowRight size={15} />
              </a>

              {aboutEnabled && (
                <a
                  href="#about"
                  onClick={(event) => {
                    event.preventDefault();
                    setMobileOpen(false);
                    scrollToSection("about");
                  }}
                >
                  <span>Nosotros</span>
                  <ArrowRight size={15} />
                </a>
              )}

              <a
                href="#contact"
                onClick={(event) => {
                  event.preventDefault();
                  setMobileOpen(false);
                  scrollToSection("contact");
                }}
              >
                <span>Contacto</span>
                <ArrowRight size={15} />
              </a>

              {restaurant.is_open && (
                <Link
                  href={`/${restaurant.slug}/order`}
                  className="wolf-navbar__mobile-order"
                  onClick={() => setMobileOpen(false)}
                  style={buttonCss}
                >
                  <span>{restaurant.navbar_button_text || "Ordenar Ahora"}</span>
                  <ArrowRight size={15} />
                </Link>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <style jsx>{`
        .wolf-navbar {
          position: fixed;
          inset: 0 0 auto;
          z-index: 9999;
          width: 100%;
          padding: 9px 12px;
          background: var(--nav-bg);
          border-bottom: 1px solid var(--nav-border);
          box-shadow: var(--nav-shadow);
          backdrop-filter: blur(18px) saturate(135%);
          -webkit-backdrop-filter: blur(18px) saturate(135%);
          transition:
            background 0.28s ease,
            border-color 0.28s ease,
            box-shadow 0.28s ease;
        }

        .wolf-navbar__inner {
          width: min(1260px, 100%);
          min-height: 58px;
          margin: 0 auto;
          padding: 0 4px;
          display: grid;
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          gap: 16px;
        }

        .wolf-navbar__brand {
          min-width: 0;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          justify-self: start;
          color: var(--nav-text);
          text-decoration: none;
        }

        .wolf-navbar__logo {
          width: 42px;
          height: 42px;
          border: 1px solid;
          border-radius: 13px;
          overflow: hidden;
          display: grid;
          place-items: center;
          flex: 0 0 auto;
          background: rgba(255, 255, 255, 0.045);
          color: var(--nav-primary);
          font-weight: 850;
          font-size: 15px;
        }

        .wolf-navbar__logo-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .wolf-navbar__name {
          min-width: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: 15px;
          font-weight: 780;
          letter-spacing: -0.02em;
        }

        .wolf-navbar__links {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 28px;
        }

        .wolf-navbar__links a {
          position: relative;
          color: var(--nav-text);
          text-decoration: none;
          font-size: 13px;
          font-weight: 650;
          opacity: 0.72;
          transition: opacity 0.2s ease, color 0.2s ease;
        }

        .wolf-navbar__links a::after {
          content: "";
          position: absolute;
          left: 50%;
          bottom: -7px;
          width: 0;
          height: 1px;
          border-radius: 999px;
          background: var(--nav-primary);
          transform: translateX(-50%);
          transition: width 0.2s ease;
        }

        .wolf-navbar__links a:hover {
          opacity: 1;
          color: var(--nav-primary);
        }

        .wolf-navbar__links a:hover::after {
          width: 18px;
        }

        .wolf-navbar__actions {
          display: flex;
          align-items: center;
          justify-self: end;
          gap: 8px;
        }

        .wolf-navbar__order {
          min-width: 0;
        }

        .wolf-navbar__order:hover,
        .wolf-navbar__mobile-order:hover {
          transform: translateY(-1px);
        }

        .wolf-navbar__order:active,
        .wolf-navbar__mobile-order:active {
          transform: scale(0.985);
        }

        .wolf-navbar__menu-button {
          display: none;
          width: 42px;
          height: 42px;
          padding: 0;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 13px;
          place-items: center;
          background: rgba(255,255,255,.045);
          color: var(--nav-text);
          cursor: pointer;
        }

        .wolf-navbar__backdrop {
          position: fixed;
          inset: 0;
          z-index: 9997;
          width: 100%;
          height: 100%;
          padding: 0;
          border: 0;
          background: rgba(0,0,0,.34);
          cursor: pointer;
        }

        .wolf-navbar__mobile-panel {
          position: fixed;
          top: 73px;
          left: 12px;
          right: 12px;
          z-index: 9998;
          padding: 10px;
          border: 1px solid;
          border-radius: 18px;
          box-shadow: 0 22px 70px rgba(0,0,0,.28);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
        }

        .wolf-navbar__mobile-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 9px 10px;
          color: rgba(255,255,255,.4);
          text-transform: uppercase;
          letter-spacing: .11em;
          font-size: 9px;
          font-weight: 800;
        }

        .wolf-navbar__mobile-panel > a {
          min-height: 46px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 0 10px;
          border-top: 1px solid rgba(255,255,255,.055);
          color: var(--nav-text);
          text-decoration: none;
          font-size: 13px;
          font-weight: 680;
        }

        .wolf-navbar__mobile-panel > a svg {
          opacity: .45;
        }

        .wolf-navbar__mobile-order {
          width: 100%;
          margin-top: 8px;
        }

        @media (max-width: 820px) {
          .wolf-navbar {
            padding: 8px 10px;
          }

          .wolf-navbar__inner {
            min-height: 54px;
            grid-template-columns: 1fr auto;
          }

          .wolf-navbar__links {
            display: none;
          }

          .wolf-navbar__name {
            max-width: 46vw;
          }

          .wolf-navbar__menu-button {
            display: grid;
          }

          .wolf-navbar__order {
            min-height: 40px !important;
            height: 40px;
            padding-inline: 13px !important;
            font-size: 12px !important;
          }
        }

        @media (max-width: 480px) {
          .wolf-navbar__name {
            display: none;
          }

          .wolf-navbar__logo {
            width: 40px;
            height: 40px;
            border-radius: 12px;
          }

          .wolf-navbar__actions {
            gap: 6px;
          }

          .wolf-navbar__order {
            padding-inline: 12px !important;
          }

          .wolf-navbar__order svg {
            display: none;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .wolf-navbar,
          .wolf-navbar__links a,
          .wolf-navbar__links a::after,
          .wolf-navbar__order,
          .wolf-navbar__mobile-order {
            transition: none !important;
          }
        }
      `}</style>
    </>
  );
}
