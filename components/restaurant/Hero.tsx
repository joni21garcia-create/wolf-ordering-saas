"use client";

import React, { useState, useEffect, useMemo, useCallback, useSyncExternalStore } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import {
  Clock,
  ShoppingBag,
  Utensils,
  ChevronDown,
  Sparkles,
  Lock,
} from "lucide-react";
import { getTheme } from "@/lib/theme/getTheme";
import { getRestaurantStatus } from "@/lib/schedule";

// Extraemos directamente el tipo de parámetro que espera getRestaurantStatus
type ScheduleParam = Parameters<typeof getRestaurantStatus>[0];

// --- TIPOS ESTRICTOS ---
export interface HeroSlide {
  id?: string | number;
  image_url?: string;
  title?: string;
  subtitle?: string;
  button_text?: string;
  button_url?: string;
}

export interface RestaurantData {
  id?: string | number;
  name?: string;
  slug?: string;
  description?: string;
  banner_url?: string;
  primary_color?: string;
  secondary_color?: string;
  text_color?: string;
  schedule?: ScheduleParam;
  schedules?: ScheduleParam[];
  slides?: HeroSlide[];
  heroSlides?: HeroSlide[];
  [key: string]: unknown; // Permite propiedades de horario directo (monday_open, etc.)
}

export interface HeroProps {
  restaurant: RestaurantData;
}

// --- SINCRONIZADOR DE TIEMPO SSR (Evita Mismatch) ---
let timeListeners: Array<() => void> = [];
let timeIntervalId: ReturnType<typeof setInterval> | null = null;

function subscribeTime(callback: () => void) {
  timeListeners.push(callback);
  if (!timeIntervalId && typeof window !== "undefined") {
    timeIntervalId = setInterval(() => {
      timeListeners.forEach((listener) => listener());
    }, 30000);
  }
  return () => {
    timeListeners = timeListeners.filter((l) => l !== callback);
    if (timeListeners.length === 0 && timeIntervalId) {
      clearInterval(timeIntervalId);
      timeIntervalId = null;
    }
  };
}

function getTimeSnapshot() {
  return Math.floor(Date.now() / 30000);
}

function getServerTimeSnapshot() {
  return 0;
}

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1000";

export default function Hero({ restaurant }: HeroProps) {
  // Manejo de carga/estado vacío
  if (!restaurant || Object.keys(restaurant).length === 0) {
    return (
      <section
        id="top"
        className="min-h-screen flex items-center justify-center bg-[#111827]"
      >
        <div className="animate-pulse text-gray-400 font-medium">
          Cargando restaurante...
        </div>
      </section>
    );
  }

  // Extraer Slides
  const slides = useMemo(() => {
    if (Array.isArray(restaurant?.heroSlides) && restaurant.heroSlides.length > 0) {
      return restaurant.heroSlides;
    }
    if (Array.isArray(restaurant?.slides) && restaurant.slides.length > 0) {
      return restaurant.slides;
    }
    return [];
  }, [restaurant?.heroSlides, restaurant?.slides]);

  const [currentSlide, setCurrentSlide] = useState(0);

  // Sincronizador para que el cambio de minutos en cliente sea seguro
  useSyncExternalStore(subscribeTime, getTimeSnapshot, getServerTimeSnapshot);

  // Rotación de Slides
  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;
    setCurrentSlide((prev) => (prev >= slides.length - 1 ? 0 : prev + 1));
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [slides.length, nextSlide]);

  // Cálculo de Horarios
  const status = useMemo(() => {
    const scheduleData = (restaurant.schedule ??
      restaurant.schedules?.[0] ??
      restaurant) as ScheduleParam;

    const rawStatus = getRestaurantStatus(scheduleData);

    return {
      isOpen: Boolean(rawStatus?.isOpen),
      isClosingSoon: Boolean(rawStatus?.isClosingSoon),
      message: rawStatus?.message || (rawStatus?.isOpen ? "Abierto" : "Cerrado"),
      schedule: rawStatus?.schedule || undefined,
    };
  }, [restaurant]);

  // Tema dinámico
  const theme = getTheme(restaurant) || { primary: "#f97316", text: "#ffffff" };

  const currentSlideData = slides.length > 0 ? slides[currentSlide] : null;

  const backgroundImage =
    currentSlideData?.image_url ||
    restaurant?.banner_url ||
    DEFAULT_BANNER;

  const titleHtml = currentSlideData?.title || restaurant.name || "Wolf Ordering";
  const subtitleHtml =
    currentSlideData?.subtitle ||
    restaurant.description ||
    "Las mejores hamburguesas artesanales.";
  const buttonText = currentSlideData?.button_text || "Ordenar Ahora";
  const orderUrl =
    currentSlideData?.button_url ||
    (restaurant.slug ? `/${restaurant.slug}/order` : "#order");

  return (
    <section
      id="top"
      aria-label={`Sección principal de ${restaurant.name || "Restaurante"}`}
      className="relative min-h-[90vh] lg:min-h-screen flex items-center justify-center overflow-hidden bg-[#0F172A] pt-20 pb-16 lg:py-0"
    >
      {/* --- FONDO CON TRANSICIÓN DE IMAGEN --- */}
      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundImage}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 z-0 select-none"
        >
          <Image
            src={backgroundImage}
            alt="Hero Background"
            fill
            priority
            sizes="100vw"
            className="object-cover object-center transform-gpu"
          />
          {/* Gradiantes de superposición para legibilidad */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A] via-[#0F172A]/70 to-[#0F172A]/40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/90 via-[#0F172A]/50 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* --- GLOW AMBIENTAL DINÁMICO --- */}
      <div
        className="absolute w-[350px] sm:w-[600px] h-[350px] sm:h-[600px] rounded-full filter blur-[120px] sm:blur-[180px] opacity-25 -top-20 -left-20 pointer-events-none transform-gpu transition-colors duration-700 z-0"
        style={{ backgroundColor: theme.primary }}
      />

      {/* --- CONTENIDO PRINCIPAL --- */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="max-w-3xl">
          
          {/* BADGE DE ESTADO */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full backdrop-blur-md bg-white/10 border border-white/15 shadow-xl mb-6 sm:mb-8"
          >
            <span className="relative flex h-3 w-3">
              <span
                className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                  status.isOpen
                    ? status.isClosingSoon
                      ? "bg-amber-400"
                      : "bg-emerald-400"
                    : "bg-rose-500"
                }`}
              />
              <span
                className={`relative inline-flex rounded-full h-3 w-3 ${
                  status.isOpen
                    ? status.isClosingSoon
                      ? "bg-amber-500"
                      : "bg-emerald-500"
                    : "bg-rose-500"
                }`}
              />
            </span>

            <span className="text-xs sm:text-sm font-semibold tracking-wide uppercase text-white/90 flex items-center gap-2">
              <Clock className="w-3.5 h-3.5 opacity-80" />
              <span>
                {status.isOpen
                  ? status.isClosingSoon
                    ? "Cierra pronto"
                    : "Abierto ahora"
                  : "Cerrado"}
              </span>
            </span>

            {status.schedule && (
              <>
                <span className="text-white/40">•</span>
                <span className="text-xs sm:text-sm text-white/70 font-medium">
                  {status.schedule}
                </span>
              </>
            )}
          </motion.div>

          {/* TÍTULO Y SUBTÍTULO CON ANIMACIÓN POR SLIDE */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              <h1
                className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1] mb-4 sm:mb-6 drop-shadow-md"
                dangerouslySetInnerHTML={{ __html: titleHtml }}
              />

              <p
                className="text-lg sm:text-xl text-white/80 font-normal leading-relaxed max-w-2xl mb-8 sm:mb-10 drop-shadow-sm"
                dangerouslySetInnerHTML={{ __html: subtitleHtml }}
              />
            </motion.div>
          </AnimatePresence>

          {/* BOTONES DE ACCIÓN */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4"
          >
            {status.isOpen ? (
              <Link
                href={orderUrl}
                className="w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-white rounded-2xl"
              >
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  type="button"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 shadow-2xl transition-all duration-300"
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.text,
                    boxShadow: `0 12px 35px -10px ${theme.primary}80`,
                  }}
                >
                  <ShoppingBag className="w-5 h-5" />
                  <span>{buttonText}</span>
                  <Sparkles className="w-4 h-4 opacity-75" />
                </motion.button>
              </Link>
            ) : (
              <button
                disabled
                type="button"
                aria-disabled="true"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl font-bold text-lg flex items-center justify-center gap-3 bg-rose-500/15 text-rose-400 border border-rose-500/30 cursor-not-allowed backdrop-blur-md"
              >
                <Lock className="w-5 h-5" />
                <span>Restaurante Cerrado</span>
              </button>
            )}

            <a
              href="#menu"
              className="w-full sm:w-auto outline-none focus-visible:ring-2 focus-visible:ring-white rounded-2xl"
            >
              <button
                type="button"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold text-lg flex items-center justify-center gap-3 backdrop-blur-md transition-all duration-200 active:scale-95"
              >
                <Utensils className="w-5 h-5" />
                <span>Ver Menú</span>
              </button>
            </a>
          </motion.div>

          {/* INDICADORES / SLIDER BULLETS */}
          {slides.length > 1 && (
            <div className="flex items-center gap-3 mt-10 sm:mt-12">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Ir al slide ${index + 1}`}
                  className={`h-2 rounded-full transition-all duration-500 ${
                    currentSlide === index
                      ? "w-10 bg-white"
                      : "w-2 bg-white/30 hover:bg-white/50"
                  }`}
                  style={{
                    backgroundColor:
                      currentSlide === index ? theme.primary : undefined,
                  }}
                />
              ))}
            </div>
          )}

        </div>
      </div>

      {/* BOTÓN FLOTANTE SCROLL */}
      <motion.a
        href="#menu"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{
          repeat: Infinity,
          repeatType: "reverse",
          duration: 1.2,
        }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 text-white/60 hover:text-white transition-colors hidden lg:flex flex-col items-center gap-1 text-xs font-medium uppercase tracking-widest"
      >
        <span>Explorar</span>
        <ChevronDown className="w-4 h-4" />
      </motion.a>
    </section>
  );
}