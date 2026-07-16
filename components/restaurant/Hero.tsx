"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { getTheme } from "@/lib/theme/getTheme";

interface HeroProps {
  restaurant: any;
}

export default function Hero({
  restaurant,
}: HeroProps) {
  // 🛠️ FIX: Si restaurant viene vacío desde el server, evitamos el crash
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

  // Estados dinámicos basados en la hora real
  const [isOpenNow, setIsOpenNow] = useState<boolean>(false);
  const [isClosingSoon, setIsClosingSoon] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<React.ReactNode>("Cargando horarios...");

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) =>
        prev === slides.length - 1 ? 0 : prev + 1
      );
    }, 5000);

    return () => clearInterval(interval);
  }, [slides.length]);

  // --- LÓGICA DE HORARIOS ---
  const daysOfWeek = [
    "sunday",
    "monday",
    "tuesday",
    "wednesday",
    "thursday",
    "friday",
    "saturday",
  ];

  // Busca dinámicamente los campos de apertura/cierre en cualquier estructura posible del objeto restaurant
  function getSchedule(dayIndex: number, type: "open" | "close"): string | null {
    const dayName = daysOfWeek[dayIndex];
    const key = `${dayName}_${type}`;

    // 1. Si los horarios están directamente en la raíz de 'restaurant'
    if (restaurant[key] !== undefined && restaurant[key] !== null) {
      return restaurant[key];
    }

    // 2. Si vienen en un array llamado 'schedules' (muy común en bases de datos relacionales)
    if (restaurant.schedules && Array.isArray(restaurant.schedules) && restaurant.schedules.length > 0) {
      return restaurant.schedules[0][key] || null;
    }

    // 3. Si vienen en un objeto de relación único llamado 'schedule'
    if (restaurant.schedule) {
      return restaurant.schedule[key] || null;
    }

    // 4. Si el prop 'restaurant' que recibes es directamente el array de horarios que mandaste
    if (Array.isArray(restaurant) && restaurant.length > 0) {
      return restaurant[0][key] || null;
    }

    return null;
  }

  // Convierte un formato de hora de 24h ("08:30" o "16:00") a 12h ("08:30 a. m." o "04:00 p. m.")
  const format12h = (time24: string) => {
    if (!time24) return "";
    const [hoursStr, minutesStr] = time24.split(":");
    let hours = parseInt(hoursStr, 10);
    const ampm = hours >= 12 ? "p. m." : "a. m.";
    hours = hours % 12;
    hours = hours ? hours : 12; // el número '0' debe ser '12'
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    return `${formattedHours}:${minutesStr} ${ampm}`;
  };

  // Cálculo del estado en tiempo real (Abierto, Cerrado, Abre Mañana, Cierra Pronto)
  useEffect(() => {
    const checkScheduleAndStatus = () => {
      const now = new Date();
      const todayIndex = now.getDay();
      
      const todayOpen = getSchedule(todayIndex, "open");   // Ej: "08:30"
      const todayClose = getSchedule(todayIndex, "close"); // Ej: "16:00"

      // Convertir formato "HH:MM" a minutos desde la medianoche
      const timeToMinutes = (timeStr: string) => {
        const [hours, minutes] = timeStr.split(":").map(Number);
        return hours * 60 + minutes;
      };

      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      // Verificar si hoy abre y si la hora actual está dentro del rango
      let openToday = false;
      let closingSoon = false;

      if (todayOpen && todayClose) {
        const openMin = timeToMinutes(todayOpen);
        const closeMin = timeToMinutes(todayClose);

        if (currentMinutes >= openMin && currentMinutes < closeMin) {
          openToday = true;

          // Configura aquí el tiempo de advertencia (60 minutos antes de cerrar)
          const TIEMPO_AVISO_MINUTOS = 60; 
          const minutesToClose = closeMin - currentMinutes;

          if (minutesToClose <= TIEMPO_AVISO_MINUTOS) {
            closingSoon = true;
          }
        }
      }

      // 1. Caso: El restaurante está abierto en este preciso momento
      if (openToday) {
        setIsOpenNow(true);
        if (closingSoon) {
          setIsClosingSoon(true);
          setStatusText(
            <>
              Hoy <span style={{ fontWeight: "700" }}>{format12h(todayOpen!)}</span> - <span style={{ fontWeight: "700" }}>{format12h(todayClose!)}</span>
              <span style={{ color: "#facc15", fontWeight: "800", marginLeft: "8px" }}>⚠️ ¡CIERRA PRONTO!</span>
            </>
          );
        } else {
          setIsClosingSoon(false);
          setStatusText(
            <>
              Hoy <span style={{ fontWeight: "700", color: "#ffffff" }}>{format12h(todayOpen!)}</span> - <span style={{ fontWeight: "700", color: "#ffffff" }}>{format12h(todayClose!)}</span>
            </>
          );
        }
      } 
      // 2. Caso: El restaurante está cerrado hoy. Mostramos cuándo abre mañana.
      else {
        setIsOpenNow(false);
        setIsClosingSoon(false);

        const tomorrowIndex = (todayIndex + 1) % 7;
        const tomorrowOpenTime = getSchedule(tomorrowIndex, "open");

        if (tomorrowOpenTime) {
          setStatusText(
            <>
              Abre mañana a las <span style={{ fontWeight: "700", color: "#ffffff" }}>{format12h(tomorrowOpenTime)}</span>
            </>
          );
        } else {
          setStatusText("Cerrado");
        }
      }
    };

    checkScheduleAndStatus();
    // Re-evaluar cada 30 segundos para el cambio de minuto de "Cierra Pronto"
    const interval = setInterval(checkScheduleAndStatus, 30000);
    return () => clearInterval(interval);
  }, [restaurant]);

  // Fallback real de banner
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
          
          {/* TÍTULO ENRIQUECIDO */}
          <h1
            style={{
              fontSize: "clamp(2.5rem, 6vw, 5.5rem)",
              lineHeight: 1.2,
              fontWeight: "900",
              color: "#ffffff",
              marginBottom: "24px",
            }}
            dangerouslySetInnerHTML={{
              __html: slides.length > 0
                ? (slides[currentSlide]?.title || "")
                : (restaurant.name || "Wolf Ordering")
            }}
          />

          {/* SUBTÍTULO ENRIQUECIDO */}
          <p
            style={{
              fontSize: "1.2rem",
              lineHeight: 1.8,
              color: "rgba(255, 255, 255, 0.8)",
              maxWidth: "650px",
              marginBottom: "40px",
            }}
            dangerouslySetInnerHTML={{
              __html: slides.length > 0
                ? (slides[currentSlide]?.subtitle || "")
                : (restaurant.description || "Las mejores hamburguesas artesanales.")
            }}
          />
          
          {/* CONTROL DE ESTADO SUPER PREMIUM CON GLASSMORPHISM */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "14px",
              marginBottom: "35px",
              padding: "10px 20px",
              borderRadius: "100px",
              background: isOpenNow 
                ? isClosingSoon
                  ? "linear-gradient(135deg, rgba(250,204,21,0.12) 0%, rgba(250,204,21,0.04) 100%)" // Fondo Amarillo para advertencia de cierre
                  : "linear-gradient(135deg, rgba(34,197,94,0.12) 0%, rgba(34,197,94,0.04) 100%)" // Fondo Verde
                : "linear-gradient(135deg, rgba(239,68,68,0.12) 0%, rgba(239,68,68,0.04) 100%)", // Fondo Rojo
              border: isOpenNow 
                ? isClosingSoon
                  ? "1px solid rgba(250,204,21,0.4)" // Borde Amarillo
                  : "1px solid rgba(34,197,94,0.3)" // Borde Verde
                : "1px solid rgba(239,68,68,0.3)", // Borde Rojo
              boxShadow: isOpenNow
                ? isClosingSoon
                  ? "0 8px 32px 0 rgba(250,204,21, 0.08), inset 0 1px 1px rgba(255,255,255,0.05)"
                  : "0 8px 32px 0 rgba(34,197,94, 0.08), inset 0 1px 1px rgba(255,255,255,0.05)"
                : "0 8px 32px 0 rgba(239,68,68, 0.08), inset 0 1px 1px rgba(255,255,255,0.05)",
              backdropFilter: "blur(12px)",
              WebkitBackdropFilter: "blur(12px)",
            }}
          >
            {/* Punto de Pulso de Luz */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ position: "relative", display: "flex", width: "10px", height: "10px" }}>
                <span 
                  className="animate-ping"
                  style={{
                    position: "absolute",
                    display: "inline-flex",
                    height: "100%",
                    width: "100%",
                    borderRadius: "50%",
                    backgroundColor: isOpenNow ? (isClosingSoon ? "#facc15" : "#22c55e") : "#ef4444",
                    opacity: 0.6,
                  }}
                />
                <span 
                  style={{
                    position: "relative",
                    display: "inline-flex",
                    borderRadius: "50%",
                    height: "10px",
                    width: "10px",
                    backgroundColor: isOpenNow ? (isClosingSoon ? "#facc15" : "#22c55e") : "#ef4444",
                    boxShadow: isOpenNow 
                      ? (isClosingSoon ? "0 0 10px #facc15" : "0 0 10px #22c55e") 
                      : "0 0 10px #ef4444",
                  }}
                />
              </span>
              
              <span
                style={{
                  color: isOpenNow ? (isClosingSoon ? "#facc15" : "#4ade80") : "#f87171",
                  fontWeight: "800",
                  fontSize: "12px",
                  textTransform: "uppercase",
                  letterSpacing: "1.5px",
                }}
              >
                {isOpenNow ? "Abierto" : "Cerrado"}
              </span>
            </div>

            {/* Separador */}
            <div 
              style={{ 
                width: "1px", 
                height: "14px", 
                backgroundColor: "rgba(255, 255, 255, 0.15)" 
              }} 
            />

            {/* Horario Dinámico e Inteligente */}
            <span style={{ color: "rgba(255, 255, 255, 0.85)", fontSize: "13px", fontWeight: "500" }}>
              {statusText}
            </span>
          </div>

          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            {isOpenNow ? (
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