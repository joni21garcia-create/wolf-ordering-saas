"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import OpenStatus from "./OpenStatus";
import { getTheme } from "@/lib/theme/getTheme";

interface HeroProps {
  restaurant: any;
}

export default function Hero({ restaurant }: HeroProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 🛠️ FIX: Si restaurant viene vacío desde el server de Vercel por un error de fetch, evitamos el crash
  if (!restaurant || Object.keys(restaurant).length === 0) {
    return (
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111827" }}>
        <div className="animate-pulse text-gray-400">Cargando restaurante...</div>
      </section>
    );
  }

  const theme = getTheme(restaurant);
  const slides = restaurant.heroSlides || [];
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // Fallback real si no hay banner_url
  const backgroundImage =
    slides.length > 0
      ? slides[currentSlide]?.image_url
      : (restaurant.banner_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000");

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
      }}
    >
      {/* Imagen fondo */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          transition: "background-image .8s ease",
          transform: "scale(1.05)",
        }}
      />

      {/* Overlay oscuro - Ajustado más opaco en móvil para máxima legibilidad */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: isMobile
            ? "linear-gradient(180deg, rgba(5,5,5,.85) 0%, rgba(5,5,5,.92) 60%, rgba(5,5,5,.98) 100%)"
            : "linear-gradient(90deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.75) 45%, rgba(0,0,0,.40) 100%)",
        }}
      />

      {/* Glow premium */}
      <div
        style={{
          position: "absolute",
          width: isMobile ? "300px" : "500px",
          height: isMobile ? "300px" : "500px",
          borderRadius: "50%",
          background: theme?.primary || "#f97316",
          filter: "blur(140px)",
          opacity: 0.12,
          top: "-60px",
          right: "-60px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1400px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          padding: isMobile ? "120px 24px 60px 24px" : "0 40px", // Más padding superior en móvil para no chocar con el menú flotante
        }}
      >
        <div style={{ maxWidth: "750px", width: "100%" }}>
          <h1
            style={{
              fontSize: isMobile ? "2.6rem" : "clamp(3.5rem, 7vw, 6rem)", 
              lineHeight: 1.1,
              fontWeight: "900",
              color: "#ffffff",
              marginBottom: isMobile ? "16px" : "24px",
            }}
          >
            {slides.length > 0
              ? slides[currentSlide]?.title
              : (restaurant.name || "Wolf Ordering")}
          </h1>

          <p
            style={{
              fontSize: isMobile ? "1.05rem" : "1.2rem",
              lineHeight: 1.6,
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "650px",
              marginBottom: isMobile ? "28px" : "40px",
            }}
          >
            {slides.length > 0
              ? slides[currentSlide]?.subtitle
              : (restaurant.description || "Las mejores hamburguesas artesanales.")}
          </p>
          
          {/* Badge de Horario */}
          <div
            style={{
              display: isMobile ? "flex" : "inline-flex",
              flexDirection: isMobile ? "column" : "row",
              alignItems: isMobile ? "flex-start" : "center",
              gap: isMobile ? "4px" : "10px",
              marginBottom: isMobile ? "35px" : "35px",
              padding: isMobile ? "10px 16px" : "12px 18px",
              borderRadius: isMobile ? "14px" : "999px",
              background: restaurant.is_open ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)",
              border: restaurant.is_open ? "1px solid rgba(34,197,94,.25)" : "1px solid rgba(239,68,68,.25)",
              color: restaurant.is_open ? "#22c55e" : "#ef4444",
              fontWeight: "700",
              fontSize: isMobile ? "14px" : "16px",
              width: isMobile ? "fit-content" : "auto"
            }}
          >
            <span>
              {restaurant.is_open ? "🟢 Abierto ahora" : "🔴 Cerrado ahora"}
            </span>
            <span style={{ color: "#ffffff", opacity: 0.85, fontWeight: "500" }}>
              Hoy {restaurant.today_open || "08:00"} - {restaurant.today_close || "23:00"}
            </span>
          </div>

          {/* Botones de acción masiva */}
          <div style={{ 
            display: "flex", 
            gap: isMobile ? "14px" : "20px", 
            flexDirection: isMobile ? "column" : "row",
            width: isMobile ? "100%" : "auto"
          }}>
            {restaurant.is_open ? (
              <Link href={slides.length > 0 && slides[currentSlide]?.button_url ? slides[currentSlide].button_url : `/${restaurant.slug}/order`} style={{ width: isMobile ? "100%" : "auto" }}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: theme?.primary || "#f97316",
                    color: theme?.text || "#ffffff",
                    border: "none",
                    padding: isMobile ? "16px" : "18px 38px",
                    borderRadius: "16px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: isMobile ? "16px" : "18px",
                    width: "100%",
                    boxShadow: `0 15px 35px ${(theme?.primary || "#f97316")}40`,
                  }}
                >
                  {slides.length > 0 ? slides[currentSlide]?.button_text : "Ordenar Ahora"}
                </motion.button>
              </Link>
            ) : (
              <button
                disabled
                style={{
                  background: "rgba(239,68,68,.15)",
                  color: "#ef4444",
                  border: "1px solid rgba(239,68,68,.25)",
                  padding: isMobile ? "16px" : "18px 38px",
                  borderRadius: "16px",
                  fontWeight: "700",
                  fontSize: isMobile ? "16px" : "18px",
                  cursor: "not-allowed",
                  width: isMobile ? "100%" : "auto"
                }}
              >
                🔒 Restaurante Cerrado
              </button>
            )}
            <a href="#menu" style={{ textDecoration: "none", width: isMobile ? "100%" : "auto" }}>
              <button
                style={{
                  background: "rgba(255,255,255,.06)",
                  border: "1px solid rgba(255,255,255,.12)",
                  color: "#ffffff",
                  padding: isMobile ? "16px" : "18px 38px",
                  borderRadius: "16px",
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: isMobile ? "16px" : "18px",
                  width: "100%",
                }}
              >
                Ver Menú
              </button>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}