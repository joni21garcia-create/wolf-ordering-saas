"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getTheme } from "@/lib/theme/getTheme";


interface Props {
  restaurant: any;
}

export default function Navbar({
  restaurant,
}: Props) {

  const theme =
  getTheme(restaurant);

console.log(
    "THEME SETTINGS:",
    restaurant.themeSettings
  );

  const [scrolled, setScrolled] =
    useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(
        window.scrollY > 50
      );
    };

    window.addEventListener(
      "scroll",
      handleScroll
    );

    return () =>
      window.removeEventListener(
        "scroll",
        handleScroll
      );
  }, []);

  return (
    <motion.nav
      initial={{
        y: -100,
      }}
      animate={{
        y: 0,
      }}
      transition={{
        duration: 0.5,
      }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        backdropFilter: scrolled
          ? "blur(20px)"
          : "none",
        background: scrolled
          ? "rgba(0,0,0,.75)"
          : "transparent",
        borderBottom: scrolled
          ? "1px solid rgba(255,255,255,.08)"
          : "none",
        transition: "all .3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "18px 24px",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            textDecoration: "none",
          }}
        >
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            style={{
              width: "90px",
              height: "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${theme.primary}`,
            }}
          />

          <span
            style={{
              color: theme.text,
              fontWeight: "700",
              fontSize: "18px",
            }}
          >
            {restaurant.name}
          </span>
        </a>

        {/* Menu */}
        <div
          style={{
            display: "flex",
            gap: "30px",
           color: theme.text,
            flexWrap: "wrap",
          }}
        >
          <a
            href="#menu"
            style={{
             color: theme.text,
              textDecoration: "none",
            }}
          >
            Menú
          </a>

          <a
            href="#about"
            style={{
            color: theme.text,
      
              textDecoration: "none",
            }}
          >
            Nosotros
          </a>

          <a
            href="#contact"
            style={{
             color: theme.text,
              textDecoration: "none",
            }}
          >
            Contacto
          </a>
        </div>

        {/* Botón */}
       {restaurant.is_open ? (
  <Link href={`/${restaurant.slug}/order`}>
    <button
      style={{
        background:
  theme.primary,
        color: theme.text,
        border: "none",
        padding: "14px 28px",
        borderRadius: "14px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow:
  `0 10px 30px ${theme.primary}55`,
      }}
    >
     {restaurant.navbar_button_text ||
  "Ordenar Ahora"}
    </button>
  </Link>
) : (
  <button
    disabled
    style={{
      background:
  theme.primary,
      color: "#ef4444",
      border:
        "1px solid rgba(239,68,68,.25)",
      padding: "14px 28px",
      borderRadius: "14px",
      fontWeight: "700",
      cursor: "not-allowed",
    }}
  >
      🔒 Cerrado
  </button>
)}
      </div>
    </motion.nav>
  );
}