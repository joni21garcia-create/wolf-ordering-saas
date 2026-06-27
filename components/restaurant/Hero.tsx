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

const theme =
  getTheme(restaurant);

  const slides =
    restaurant.heroSlides || [];

  const [currentSlide, setCurrentSlide] =
    useState(0);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1
          ? 0
          : prev + 1
      );
    }, 5000);

    return () =>
      clearInterval(interval);
  }, [slides.length]);

  const backgroundImage =
    slides.length > 0
      ? slides[currentSlide]?.image_url
      : restaurant.banner_url;

      const isOpen =
  restaurant.is_open ??
  true;

const todayOpen =
  restaurant.today_open ??
  "08:00";

const todayClose =
  restaurant.today_close ??
  "22:00";

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
          transition:
            "background-image .8s ease",
          transform: "scale(1.05)",
        }}
      />

      {/* Overlay oscuro */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(90deg, rgba(0,0,0,.90) 0%, rgba(0,0,0,.70) 45%, rgba(0,0,0,.50) 100%)",
        }}
      />

      {/* Glow premium */}
     <div
  style={{
    position: "absolute",
    width: "500px",
    height: "500px",
    borderRadius: "50%",
    background:
      theme.primary,
    filter: "blur(180px)",
    opacity: 0.15,
    top: "-120px",
    right: "-120px",
  }}
/>

      <motion.div
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        transition={{
          duration: 0.8,
        }}
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
        <div
          style={{
            maxWidth: "750px",
          }}
        >
         
<h1
  style={{
    fontSize:
      "clamp(4rem,8vw,7rem)",
    lineHeight: 1,
    fontWeight: "900",
    color: "var(--text-color)",
    marginBottom: "24px",
  }}
>
  {slides.length > 0
    ? slides[currentSlide]?.title
    : restaurant.name}
</h1>

<p
  style={{
    fontSize: "1.3rem",
    lineHeight: 1.8,
    color:
      "var(--text-color)",
              maxWidth: "650px",
              marginBottom: "40px",
            }}
          >
            
 {
  slides.length > 0
    ? slides[currentSlide]?.subtitle
    : restaurant.description
}
          </p>
          
<div
  style={{
    display: "inline-flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "35px",
    padding: "12px 18px",
    borderRadius: "999px",
    background:
      restaurant.is_open
        ? "rgba(34,197,94,.12)"
        : "rgba(239,68,68,.12)",
    border: restaurant.is_open
      ? "1px solid rgba(34,197,94,.25)"
      : "1px solid rgba(239,68,68,.25)",
    color:
      restaurant.is_open
        ? "#22c55e"
        : "#ef4444",
    fontWeight: "700",
  }}
>
  <span>
    {restaurant.is_open
      ? "🟢 Abierto ahora"
      : "🔴 Cerrado ahora"}
  </span>


    <span
  style={{
    color:
      "var(--text-color)",
    opacity: 0.8,
  }}
>
  </span>

<span
  style={{
    color:
      "var(--text-color)",
    opacity: 0.85,
  }}
>
    Hoy {restaurant.today_open} -{" "}
    {restaurant.today_close}
  </span>
</div>


          <div
            style={{
              display: "flex",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
          {restaurant.is_open ? (
  <Link
    href={
      slides.length > 0 &&
      slides[currentSlide]?.button_url
        ? slides[currentSlide].button_url
        : `/${restaurant.slug}/order`
    }
  >
    <motion.button
      whileHover={{
        scale: 1.05,
      }}
      whileTap={{
        scale: 0.95,
      }}
     style={{
  background:
    theme.primary,
      color: theme.text,
        border: "none",
        padding: "18px 38px",
        borderRadius: "18px",
        cursor: "pointer",
        fontWeight: "700",
        fontSize: "18px",
       boxShadow: `0 20px 50px ${theme.primary}55`,
      }}
    >
      {slides.length > 0
        ? slides[currentSlide]?.button_text
        : "Ordenar Ahora"}
    </motion.button>
  </Link>
) : (
  <button
    disabled
    style={{
      background:
        "rgba(239,68,68,.15)",
      color: "#ef4444",
      border:
        "1px solid rgba(239,68,68,.25)",
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
<a
  href="#menu"
  style={{
    textDecoration: "none",
  }}
>
  <button
    style={{
      background:
        "rgba(255,255,255,.08)",
      border:
        "1px solid rgba(255,255,255,.15)",
     color:
  "var(--text-color)",
      padding:
        "18px 38px",
      borderRadius: "18px",
      backdropFilter:
        "blur(12px)",
      cursor: "pointer",
      fontWeight: "600",
    }}
  >
    Ver Menú
  </button>
</a>
          </div>

          {slides.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginTop: "40px",
              }}
            >
              {slides.map(
                (
                  _: any,
                  index: number
                ) => (
                  <button
                    key={index}
                    onClick={() =>
                      setCurrentSlide(
                        index
                      )
                    }
                    style={{
                      width:
                        index ===
                        currentSlide
                          ? "40px"
                          : "12px",
                      height: "12px",
                      borderRadius:
                        "999px",
                      border: "none",
                      transition:
                        ".3s",
                      cursor:
                        "pointer",
                      background:
  index === currentSlide
    ? theme.primary
    : "rgba(255,255,255,.3)",
                    }}
                  />
                )
              )}
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}