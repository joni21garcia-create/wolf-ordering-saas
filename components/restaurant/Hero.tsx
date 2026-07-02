"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getTheme } from "@/lib/theme/getTheme";

interface HeroProps {
  restaurant: any;
}

export default function Hero({ restaurant }: HeroProps) {
  // 1. Manejo de estado inicial para evitar parpadeos
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!restaurant || Object.keys(restaurant).length === 0) {
    return (
      <section style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#111827" }}>
        <div className="animate-pulse text-gray-400">Cargando...</div>
      </section>
    );
  }

  const theme = getTheme(restaurant);
  const slides = restaurant.heroSlides || [];

  // 2. Lógica de slides simple
  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 5000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const backgroundImage = slides.length > 0 
    ? slides[currentSlide]?.image_url 
    : (restaurant.banner_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000");

  return (
    <section style={{ position: "relative", minHeight: "90vh", overflow: "hidden" }}>
      {/* Imagen fondo */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover", backgroundPosition: "center",
        transition: "background-image .8s ease",
        transform: "scale(1.05)",
      }} />

      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.4) 100%)" }} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        style={{
          position: "relative", zIndex: 10,
          maxWidth: "1400px", margin: "0 auto",
          minHeight: "90vh", display: "flex", alignItems: "center",
          padding: "0 20px" // Padding cómodo para móviles
        }}
      >
        <div style={{ maxWidth: "750px" }}>
          {/* Título responsivo usando clamp */}
          <h1 style={{ 
            fontSize: "clamp(2.5rem, 8vw, 5rem)", 
            lineHeight: 1.1, fontWeight: "900", color: "#fff", marginBottom: "20px" 
          }}>
            {slides.length > 0 ? slides[currentSlide]?.title : restaurant.name}
          </h1>

          <p style={{ 
            fontSize: "clamp(1rem, 3vw, 1.25rem)", 
            color: "rgba(255, 255, 255, 0.8)", marginBottom: "30px" 
          }}>
            {slides.length > 0 ? slides[currentSlide]?.subtitle : restaurant.description}
          </p>
          
          {/* Botones: Flex-wrap asegura que se acomoden en vertical en móviles */}
          <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
            {restaurant.is_open ? (
              <Link href={slides.length > 0 && slides[currentSlide]?.button_url ? slides[currentSlide].button_url : `/${restaurant.slug}/order`}>
                <button style={{
                  background: theme?.primary || "#f97316",
                  color: theme?.text || "#ffffff",
                  border: "none", padding: "16px 32px", borderRadius: "14px",
                  fontWeight: "700", fontSize: "16px", cursor: "pointer"
                }}>
                  {slides.length > 0 ? slides[currentSlide]?.button_text : "Ordenar Ahora"}
                </button>
              </Link>
            ) : (
              <button disabled style={{
                background: "rgba(239,68,68,.1)", color: "#ef4444",
                border: "1px solid rgba(239,68,68,.2)", padding: "16px 32px",
                borderRadius: "14px", fontWeight: "700", cursor: "not-allowed"
              }}>
                🔒 Cerrado
              </button>
            )}
            <a href="#menu" style={{ textDecoration: "none" }}>
              <button style={{
                background: "rgba(255,255,255,.1)", border: "1px solid rgba(255,255,255,.2)",
                color: "#fff", padding: "16px 32px", borderRadius: "14px",
                cursor: "pointer", fontWeight: "600"
              }}>Ver Menú</button>
            </a>
          </div>
        </div>
      </motion.div>
    </section>
  );
}