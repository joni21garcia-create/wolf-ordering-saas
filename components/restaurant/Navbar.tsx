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
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);
    
    // Configuración inicial
    handleScroll();
    handleResize();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 9999,
        backdropFilter: scrolled ? "blur(20px)" : "none",
        WebkitBackdropFilter: scrolled ? "blur(20px)" : "none", // Soporte Safari iOS
        background: scrolled ? "rgba(0,0,0,.75)" : "transparent",
        borderBottom: scrolled ? "1px solid rgba(255,255,255,.08)" : "none",
        transition: "all .3s ease",
      }}
    >
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: isMobile ? "12px 16px" : "18px 24px", // Padding optimizado en móvil
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px"
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: isMobile ? "8px" : "12px",
            textDecoration: "none",
            minWidth: 0, // Evita desbordamientos de texto interno
          }}
        >
          <img
            src={restaurant.logo_url}
            alt={restaurant.name}
            style={{
              width: isMobile ? "45px" : "90px", // Reducción estratégica del logo en celular
              height: isMobile ? "45px" : "90px",
              borderRadius: "50%",
              objectFit: "cover",
              border: `2px solid ${theme.primary}`,
              flexShrink: 0,
            }}
          />

          <span
            style={{
              color: theme.text,
              fontWeight: "800",
              fontSize: isMobile ? "15px" : "18px",
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis", // Si el nombre es muy largo, no rompe el diseño
            }}
          >
            {restaurant.name}
          </span>
        </a>

        {/* Menu - Se oculta en móviles para evitar el encimado de la captura image_9593bc.png */}
        {!isMobile && (
          <div
            style={{
              display: "flex",
              gap: "30px",
              color: theme.text,
            }}
          >
            <a href="#menu" style={{ color: theme.text, textDecoration: "none" }}>
              Menú
            </a>
            <a href="#about" style={{ color: theme.text, textDecoration: "none" }}>
              Nosotros
            </a>
            <a href="#contact" style={{ color: theme.text, textDecoration: "none" }}>
              Contacto
            </a>
          </div>
        )}

        {/* Botón de Acción */}
        <div style={{ flexShrink: 0 }}>
          {restaurant.is_open ? (
            <Link href={`/${restaurant.slug}/order`}>
              <button
                style={{
                  background: theme.primary,
                  color: theme.text,
                  border: "none",
                  padding: isMobile ? "10px 16px" : "14px 28px", // Botón más compacto y estético en móviles
                  borderRadius: "12px",
                  fontWeight: "700",
                  fontSize: isMobile ? "13px" : "15px",
                  cursor: "pointer",
                  boxShadow: `0 10px 30px ${theme.primary}55`,
                  whiteSpace: "nowrap",
                }}
              >
                {restaurant.navbar_button_text || "Ordenar Ahora"}
              </button>
            </Link>
          ) : (
            <button
              disabled
              style={{
                background: "rgba(255,255,255,.05)",
                color: "#ef4444",
                border: "1px solid rgba(239,68,68,.25)",
                padding: isMobile ? "10px 16px" : "14px 28px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: isMobile ? "13px" : "15px",
                cursor: "not-allowed",
                whiteSpace: "nowrap",
              }}
            >
              🔒 Cerrado
            </button>
          )}
        </div>
      </div>
    </motion.nav>
  );
}