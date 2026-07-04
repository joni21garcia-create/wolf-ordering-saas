"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import OpenStatus from "./OpenStatus";
import { getTheme } from "@/lib/theme/getTheme";

interface HeroProps {
  restaurant: any;
}

export default function Hero({
  restaurant,
}: HeroProps) {
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

  // 🛠️ FIX: Aseguramos un fallback real si no hay banner_url
  const backgroundImage =
    slides.length > 0
      ? slides[currentSlide]?.image_url
      : (restaurant.banner_url || "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000"); // Fallback global de hamburguesa premium por si las moscas

  return (
    <section
      style={{
        position: "relative",
        minHeight: "100vh",
        overflow: "hidden",
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

      {/* Overlay oscuro */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "linear-gradient(90deg, rgba(0,0,0,.95) 0%, rgba(0,0,0,.75) 45%, rgba(0,0,0,.40) 100%)",
        }}
      />

      {/* Glow premium */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background: theme?.primary || "#f97316",
          filter: "blur(180px)",
          opacity: 0.15,
          top: "-120px",
          right: "-120px",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        style={{
          position: "relative",
          zIndex: 10,
          maxWidth: "1400px",
          margin: "0 auto",
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "0 40px",
        }}
      >
        <div style={{ maxWidth: "750px" }}>
          <h1
            style={{
              fontSize: "clamp(3.5rem, 7vw, 6rem)", // Ajuste ligero de escala para evitar desbordes móviles
              lineHeight: 1.1,
              fontWeight: "900",
              color: "#ffffff",
              marginBottom: "24px",
            }}
          >
            {slides.length > 0
              ? slides[currentSlide]?.title
              : (restaurant.name || "Wolf Ordering")}
          </h1>

          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "650px",
              marginBottom: "40px",
            }}
          >
            {slides.length > 0
              ? slides[currentSlide]?.subtitle
              : (restaurant.description || "Las mejores hamburguesas artesanales.")}
          </p>
          
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "35px",
              padding: "12px 18px",
              borderRadius: "999px",
              background: restaurant.is_open ? "rgba(34,197,94,.12)" : "rgba(239,68,68,.12)",
              border: restaurant.is_open ? "1px solid rgba(34,197,94,.25)" : "1px solid rgba(239,68,68,.25)",
              color: restaurant.is_open ? "#22c55e" : "#ef4444",
              fontWeight: "700",
            }}
          >
            <span>
              {restaurant.is_open ? "🟢 Abierto ahora" : "🔴 Cerrado ahora"}
            </span>
            <span style={{ color: "#ffffff", opacity: 0.85 }}>
              Hoy {restaurant.today_open || "08:00"} - {restaurant.today_close || "23:00"}
            </span>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {restaurant.is_open ? (
              <Link href={slides.length > 0 && slides[currentSlide]?.button_url ? slides[currentSlide].button_url : `/${restaurant.slug}/order`}>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  style={{
                    background: theme?.primary || "#f97316",
                    color: theme?.text || "#ffffff",
                    border: "none",
                    padding: "18px 38px",
                    borderRadius: "18px",
                    cursor: "pointer",
                    fontWeight: "700",
                    fontSize: "18px",
                    boxShadow: `0 20px 50px ${(theme?.primary || "#f97316")}55`,
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
                  padding: "18px 38px",
                  borderRadius: "18px",
                  fontWeight: "700",
                  fontSize: "18px",
                  cursor: "not-allowed",
                }}
              >
                🔒 Restaurante Cerrado
              </button>
            )}
            <a href="#menu" style={{ textDecoration: "none" }}>
              <button
                style={{
                  background: "rgba(255,255,255,.08)",
                  border: "1px solid rgba(255,255,255,.15)",
                  color: "#ffffff",
                  padding: "18px 38px",
                  borderRadius: "18px",
                  backdropFilter: "blur(12px)",
                  cursor: "pointer",
                  fontWeight: "600",
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