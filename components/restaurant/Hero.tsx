"use client";

import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
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
  ArrowUpRight,
} from "lucide-react";

import { getTheme } from "@/lib/theme/getTheme";
import { getRestaurantStatus } from "@/lib/schedule";

type ScheduleParam = Parameters<typeof getRestaurantStatus>[0];

// -----------------------------------------------------------------------------
// TYPES
// -----------------------------------------------------------------------------

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
  [key: string]: unknown;
}

export interface HeroProps {
  restaurant: RestaurantData;
}

const DEFAULT_BANNER =
  "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=1600";

// -----------------------------------------------------------------------------
// HERO
// -----------------------------------------------------------------------------

const Hero = React.memo(function Hero({ restaurant }: HeroProps) {
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);

  // ---------------------------------------------------------------------------
  // MOUNT + HORARIO
  // ---------------------------------------------------------------------------

  useEffect(() => {
    setMounted(true);

    const interval = setInterval(() => {
      setTick((value) => value + 1);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // ---------------------------------------------------------------------------
  // SLIDES
  // ---------------------------------------------------------------------------

  const slides = useMemo(() => {
    if (
      Array.isArray(restaurant?.heroSlides) &&
      restaurant.heroSlides.length > 0
    ) {
      return restaurant.heroSlides;
    }

    if (
      Array.isArray(restaurant?.slides) &&
      restaurant.slides.length > 0
    ) {
      return restaurant.slides;
    }

    return [];
  }, [restaurant?.heroSlides, restaurant?.slides]);

  useEffect(() => {
    if (currentSlide >= slides.length && slides.length > 0) {
      setCurrentSlide(0);
    }
  }, [currentSlide, slides.length]);

  const nextSlide = useCallback(() => {
    if (slides.length <= 1) return;

    setCurrentSlide((previous) =>
      previous >= slides.length - 1 ? 0 : previous + 1
    );
  }, [slides.length]);

  useEffect(() => {
    if (slides.length <= 1) return;

    const interval = setInterval(nextSlide, 5000);

    return () => clearInterval(interval);
  }, [slides.length, nextSlide]);

  // ---------------------------------------------------------------------------
  // SCHEDULE
  // ---------------------------------------------------------------------------

  const scheduleData = useMemo(
    () =>
      (restaurant.schedule ??
        restaurant.schedules?.[0] ??
        restaurant) as ScheduleParam,
    [restaurant]
  );

  const status = useMemo(() => {
    if (!mounted) {
      return {
        isOpen: false,
        isClosingSoon: false,
        message: "",
        schedule: "",
        isCalculated: false,
      };
    }

    const rawStatus = getRestaurantStatus(scheduleData);

    return {
      isOpen: Boolean(rawStatus?.isOpen),
      isClosingSoon: Boolean(rawStatus?.isClosingSoon),
      message: rawStatus?.message ?? "",
      schedule: rawStatus?.schedule ?? "",
      isCalculated: true,
    };
  }, [scheduleData, mounted, tick]);

  // ---------------------------------------------------------------------------
  // THEME
  // ---------------------------------------------------------------------------

  const theme = useMemo(
    () =>
      getTheme(restaurant) || {
        primary: "#f97316",
        text: "#ffffff",
      },
    [restaurant]
  );

  // ---------------------------------------------------------------------------
  // CURRENT SLIDE
  // ---------------------------------------------------------------------------

  const currentSlideData =
    slides.length > 0 ? slides[currentSlide] : null;

  const backgroundImage =
    currentSlideData?.image_url ||
    restaurant?.banner_url ||
    DEFAULT_BANNER;

  const titleHtml =
    currentSlideData?.title ||
    restaurant.name ||
    "Wolf Ordering";

  const subtitleHtml =
    currentSlideData?.subtitle ||
    restaurant.description ||
    "Las mejores hamburguesas artesanales.";

  const buttonText =
    currentSlideData?.button_text ||
    "Ordenar Ahora";

  const orderUrl =
    currentSlideData?.button_url ||
    (restaurant.slug
      ? `/${restaurant.slug}/order`
      : "#order");

  // ---------------------------------------------------------------------------
  // EMPTY STATE
  // ---------------------------------------------------------------------------

  if (!restaurant || Object.keys(restaurant).length === 0) {
    return (
      <section
        id="top"
        className="min-h-screen flex items-center justify-center bg-[#080808]"
      >
        <div className="text-white/50 font-medium">
          Cargando restaurante...
        </div>
      </section>
    );
  }

  // ---------------------------------------------------------------------------
  // RENDER
  // ---------------------------------------------------------------------------

  return (
    <section
      id="top"
      aria-label={`Sección principal de ${
        restaurant.name || "Restaurante"
      }`}
      className="
        relative
        min-h-[760px]
        h-[100svh]
        max-h-[1080px]
        flex
        items-center
        overflow-hidden
        bg-[#070707]
        text-white
      "
    >
      {/* ------------------------------------------------------------------ */}
      {/* BACKGROUND                                                         */}
      {/* ------------------------------------------------------------------ */}

      <AnimatePresence mode="wait">
        <motion.div
          key={backgroundImage}
          initial={{
            opacity: 0,
            scale: 1.08,
          }}
          animate={{
            opacity: 1,
            scale: 1,
          }}
          exit={{
            opacity: 0,
            scale: 1.02,
          }}
          transition={{
            opacity: {
              duration: 0.9,
              ease: "easeOut",
            },
            scale: {
              duration: 7,
              ease: "easeOut",
            },
          }}
          className="
            absolute
            inset-0
            z-0
            overflow-hidden
            select-none
          "
        >
          <Image
            src={backgroundImage}
            alt={restaurant.name || "Restaurante"}
            fill
            priority
            sizes="100vw"
            className="
              object-cover
              object-center
            "
          />

          {/* Cinematic darkening */}
          <div className="absolute inset-0 bg-black/25" />

          {/* Bottom cinematic gradient */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-[#050505]
              via-[#050505]/55
              to-black/10
            "
          />

          {/* Left readability gradient */}
          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-black/80
              via-black/45
              to-transparent
            "
          />

          {/* Top protection */}
          <div
            className="
              absolute
              inset-x-0
              top-0
              h-40
              bg-gradient-to-b
              from-black/50
              to-transparent
            "
          />

          {/* Primary-color atmosphere */}
          <motion.div
            animate={{
              opacity: [0.16, 0.24, 0.16],
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="
              absolute
              -left-32
              -top-32
              h-[520px]
              w-[520px]
              rounded-full
              blur-[130px]
              pointer-events-none
            "
            style={{
              backgroundColor: theme.primary,
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* ------------------------------------------------------------------ */}
      {/* PREMIUM GRAIN / LIGHT                                               */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          z-[1]
          opacity-[0.035]
          mix-blend-overlay
        "
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='.8'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ------------------------------------------------------------------ */}
      {/* CONTENT                                                             */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          relative
          z-10
          w-full
          max-w-7xl
          mx-auto
          px-5
          sm:px-8
          lg:px-10
        "
      >
        <div className="max-w-4xl pt-20 sm:pt-24 lg:pt-12">

          {/* -------------------------------------------------------------- */}
          {/* STATUS PILL                                                     */}
          {/* -------------------------------------------------------------- */}

          <motion.div
            initial={{
              opacity: 0,
              y: 18,
              filter: "blur(8px)",
            }}
            animate={{
              opacity: 1,
              y: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              inline-flex
              items-center
              gap-3
              rounded-full
              border
              border-white/15
              bg-white/[0.08]
              px-4
              py-2.5
              backdrop-blur-xl
              shadow-[0_12px_40px_rgba(0,0,0,0.25)]
              mb-7
              sm:mb-9
            "
          >
            {!status.isCalculated ? (
              <span className="text-xs sm:text-sm font-medium text-white/65">
                Verificando horario...
              </span>
            ) : (
              <>
                <span className="relative flex h-2.5 w-2.5">
                  <span
                    className={`absolute inset-0 rounded-full animate-ping opacity-70 ${
                      status.isOpen
                        ? status.isClosingSoon
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                        : "bg-rose-500"
                    }`}
                  />

                  <span
                    className={`relative h-2.5 w-2.5 rounded-full ${
                      status.isOpen
                        ? status.isClosingSoon
                          ? "bg-amber-400"
                          : "bg-emerald-400"
                        : "bg-rose-500"
                    }`}
                  />
                </span>

                {status.message && (
                  <span className="flex items-center gap-2 text-xs sm:text-sm font-semibold tracking-wide text-white/90">
                    <Clock className="h-3.5 w-3.5 text-white/60" />
                    {status.message}
                  </span>
                )}

                {status.schedule && (
                  <>
                    {status.message && (
                      <span className="text-white/25">
                        •
                      </span>
                    )}

                    <span className="text-xs sm:text-sm font-medium text-white/65">
                      {status.schedule}
                    </span>
                  </>
                )}
              </>
            )}
          </motion.div>

          {/* -------------------------------------------------------------- */}
          {/* TITLE / SUBTITLE                                                 */}
          {/* -------------------------------------------------------------- */}

          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{
                opacity: 0,
                y: 24,
                filter: "blur(10px)",
              }}
              animate={{
                opacity: 1,
                y: 0,
                filter: "blur(0px)",
              }}
              exit={{
                opacity: 0,
                y: -18,
                filter: "blur(8px)",
              }}
              transition={{
                duration: 0.65,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <h1
                className="
                  max-w-4xl
                  text-[2.75rem]
                  leading-[0.98]
                  tracking-[-0.045em]
                  font-black
                  text-white
                  drop-shadow-[0_8px_30px_rgba(0,0,0,0.45)]
                  sm:text-6xl
                  md:text-7xl
                  lg:text-[5.5rem]
                  xl:text-[6.2rem]
                "
                dangerouslySetInnerHTML={{
                  __html: titleHtml || "",
                }}
              />

              <p
                className="
                  mt-5
                  max-w-2xl
                  text-base
                  leading-relaxed
                  text-white/72
                  drop-shadow-[0_4px_18px_rgba(0,0,0,0.45)]
                  sm:mt-7
                  sm:text-lg
                  lg:text-xl
                "
                dangerouslySetInnerHTML={{
                  __html: subtitleHtml || "",
                }}
              />
            </motion.div>
          </AnimatePresence>

          {/* -------------------------------------------------------------- */}
          {/* ACTIONS                                                          */}
          {/* -------------------------------------------------------------- */}

          <motion.div
            initial={{
              opacity: 0,
              y: 22,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            transition={{
              duration: 0.65,
              delay: 0.18,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="
              mt-8
              flex
              flex-col
              gap-3
              sm:mt-10
              sm:flex-row
              sm:items-center
            "
          >
            {!status.isCalculated || status.isOpen ? (
              <Link
                href={orderUrl}
                className="
                  group
                  w-full
                  sm:w-auto
                  rounded-2xl
                  outline-none
                  focus-visible:ring-2
                  focus-visible:ring-white/80
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-black
                "
              >
                <motion.div
                  whileHover={{
                    scale: 1.025,
                    y: -2,
                  }}
                  whileTap={{
                    scale: 0.97,
                  }}
                  className="
                    relative
                    flex
                    min-h-14
                    w-full
                    items-center
                    justify-center
                    gap-3
                    overflow-hidden
                    rounded-2xl
                    px-7
                    py-4
                    text-base
                    font-bold
                    shadow-2xl
                    sm:w-auto
                    sm:min-w-[190px]
                  "
                  style={{
                    backgroundColor: theme.primary,
                    color: theme.text,
                    boxShadow: `
                      0 18px 45px -15px ${theme.primary}99,
                      0 8px 25px rgba(0,0,0,0.25)
                    `,
                  }}
                >
                  {/* Shine */}
                  <span
                    className="
                      pointer-events-none
                      absolute
                      inset-y-0
                      -left-1/2
                      w-1/3
                      -skew-x-12
                      bg-white/20
                      transition-all
                      duration-700
                      group-hover:left-[120%]
                    "
                  />

                  <ShoppingBag className="relative z-10 h-5 w-5" />

                  <span className="relative z-10">
                    {buttonText}
                  </span>

                  <ArrowUpRight
                    className="
                      relative
                      z-10
                      h-4
                      w-4
                      opacity-70
                      transition-transform
                      duration-300
                      group-hover:translate-x-0.5
                      group-hover:-translate-y-0.5
                    "
                  />
                </motion.div>
              </Link>
            ) : (
              <button
                disabled
                type="button"
                aria-disabled="true"
                className="
                  flex
                  min-h-14
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  border-rose-400/20
                  bg-black/25
                  px-7
                  py-4
                  text-base
                  font-bold
                  text-rose-300
                  backdrop-blur-xl
                  sm:w-auto
                "
              >
                <Lock className="h-5 w-5" />
                <span>Restaurante Cerrado</span>
              </button>
            )}

            <a
              href="#menu"
              className="
                group
                w-full
                sm:w-auto
                rounded-2xl
                outline-none
                focus-visible:ring-2
                focus-visible:ring-white/80
              "
            >
              <motion.div
                whileHover={{
                  y: -2,
                  backgroundColor: "rgba(255,255,255,0.14)",
                }}
                whileTap={{
                  scale: 0.97,
                }}
                className="
                  flex
                  min-h-14
                  w-full
                  items-center
                  justify-center
                  gap-3
                  rounded-2xl
                  border
                  border-white/15
                  bg-white/[0.07]
                  px-7
                  py-4
                  text-base
                  font-semibold
                  text-white
                  backdrop-blur-xl
                  transition-colors
                  duration-300
                  sm:w-auto
                "
              >
                <Utensils className="h-5 w-5 text-white/75 transition-transform duration-300 group-hover:rotate-[-8deg]" />

                <span>Ver Menú</span>

                <ChevronDown className="h-4 w-4 rotate-[-90deg] text-white/45 transition-transform duration-300 group-hover:translate-x-1" />
              </motion.div>
            </a>
          </motion.div>

          {/* -------------------------------------------------------------- */}
          {/* SLIDE INDICATORS                                                 */}
          {/* -------------------------------------------------------------- */}

          {slides.length > 1 && (
            <motion.div
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              transition={{
                delay: 0.45,
                duration: 0.5,
              }}
              className="mt-9 flex items-center gap-2.5 sm:mt-11"
            >
              {slides.map((_, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => setCurrentSlide(index)}
                  aria-label={`Ir al slide ${index + 1}`}
                  aria-current={
                    currentSlide === index
                      ? "true"
                      : undefined
                  }
                  className="
                    relative
                    h-1.5
                    overflow-hidden
                    rounded-full
                    bg-white/20
                    transition-all
                    duration-500
                    hover:bg-white/35
                  "
                  style={{
                    width:
                      currentSlide === index
                        ? 42
                        : 7,
                  }}
                >
                  {currentSlide === index && (
                    <motion.span
                      layoutId="activeHeroIndicator"
                      className="absolute inset-0 rounded-full"
                      style={{
                        backgroundColor: theme.primary,
                      }}
                    />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* BOTTOM FADE                                                        */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-10
          h-32
          bg-gradient-to-t
          from-black
          to-transparent
        "
      />

      {/* ------------------------------------------------------------------ */}
      {/* EXPLORE                                                            */}
      {/* ------------------------------------------------------------------ */}

      <motion.a
        href="#menu"
        initial={{
          opacity: 0,
          y: 8,
        }}
        animate={{
          opacity: 1,
          y: [0, 5, 0],
        }}
        transition={{
          opacity: {
            duration: 0.8,
            delay: 1,
          },
          y: {
            duration: 2.4,
            repeat: Infinity,
            ease: "easeInOut",
          },
        }}
        className="
          absolute
          bottom-7
          left-1/2
          z-20
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-2
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.28em]
          text-white/45
          transition-colors
          hover:text-white/80
          lg:flex
        "
      >
        <span>Explorar</span>

        <ChevronDown className="h-4 w-4" />
      </motion.a>

      {/* ------------------------------------------------------------------ */}
      {/* PREMIUM EDGE GLOW                                                  */}
      {/* ------------------------------------------------------------------ */}

      <div
        className="
          pointer-events-none
          absolute
          bottom-0
          left-0
          right-0
          z-10
          h-px
          opacity-70
        "
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${theme.primary},
            transparent
          )`,
        }}
      />
    </section>
  );
});

export default Hero;