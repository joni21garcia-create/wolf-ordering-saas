"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getTheme } from "@/lib/theme/getTheme";

interface Props {
  restaurant: any;
}

export default function Navbar({ restaurant }: Props) {
  const theme = getTheme(restaurant);
  const [scrolled, setScrolled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    
    handleScroll();
    checkMobile();
    
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", checkMobile);
    
    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", checkMobile);
    };
  }, []);

  return (
    <motion.nav
      initial={false}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        background: scrolled ? "rgba(0,0,0,.75)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.08)" : "none",
        transition: "all .3s ease",
      }}
    >
      <div style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: isMobile ? "12px 16px" : "18px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        gap: "12px",
      }}>
        {/* Logo - Ajustado a 50px en móvil */}
        <a href="#" style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}>
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            style={{
              width: isMobile ? "45px" : "90px",
              height: isMobile ? "45px" : "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${theme.primary}`,
            }}
          />
          {!isMobile && (
            <span style={{ color: theme.text, fontWeight: 700, fontSize: "18px" }}>
              {restaurant.name}
            </span>
          )}
        </a>

        {/* Navegación - Oculta en móvil para limpiar espacio */}
        {!isMobile && (
          <div style={{ display: "flex", gap: "30px", color: theme.text }}>
            <a href="#menu" style={{ color: theme.text, textDecoration: "none" }}>Menú</a>
            <a href="#about" style={{ color: theme.text, textDecoration: "none" }}>Nosotros</a>
            <a href="#contact" style={{ color: theme.text, textDecoration: "none" }}>Contacto</a>
          </div>
        )}

        {/* Botón */}
        <div>
          {restaurant.is_open ? (
            <Link href={`/${restaurant.slug}/order`}>
              <button style={{
                background: theme.primary,
                color: theme.text,
                border: "none",
                padding: isMobile ? "10px 16px" : "14px 28px",
                borderRadius: "12px",
                fontWeight: 700,
                cursor: "pointer",
                fontSize: isMobile ? "13px" : "16px"
              }}>
                {isMobile ? "Pedir" : (restaurant.navbar_button_text || "Ordenar Ahora")}
              </button>
            </Link>
          ) : (
            <button disabled style={{
              background: "transparent",
              color: "#ef4444",
              border: "1px solid #ef4444",
              padding: isMobile ? "10px 16px" : "14px 28px",
              borderRadius: "12px",
              fontWeight: 700,
              cursor: "not-allowed",
              fontSize: isMobile ? "13px" : "16px"
            }}>
              🔒 Cerrado
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}