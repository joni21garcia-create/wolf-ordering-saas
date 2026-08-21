"use client";

import Link from "next/link";
import { CalendarDays } from "lucide-react";
import { motion } from "framer-motion";

type FloatingReservationButtonProps = {
  slug: string;
  primaryColor?: string;
};

export function FloatingReservationButton({
  slug,
  primaryColor = "#2563EB",
}: FloatingReservationButtonProps) {
  const reservationUrl = `/reserve/${encodeURIComponent(slug)}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, y: 16 }}
      animate={{
        opacity: 1,
        scale: 1,
        y: [0, -3, 0],
      }}
      transition={{
        opacity: {
          duration: 0.3,
        },
        scale: {
          duration: 0.3,
          ease: [0.22, 1, 0.36, 1],
        },
        y: {
          duration: 3.5,
          repeat: Infinity,
          repeatType: "mirror",
          ease: "easeInOut",
        },
      }}
      className="fixed bottom-5 right-5 z-[60] sm:bottom-6 sm:right-6"
    >
      <Link
        href={reservationUrl}
        aria-label="Reservar mesa"
        className="
          group
          relative
          flex
          h-14
          w-14
          items-center
          justify-center
          overflow-hidden
          rounded-full
          border
          text-white
          backdrop-blur-xl
          transition-all
          duration-300
          hover:-translate-y-1
          active:scale-95
          focus:outline-none
          focus-visible:ring-2
          focus-visible:ring-white/70
          focus-visible:ring-offset-2
          sm:h-auto
          sm:w-auto
          sm:min-w-[160px]
          sm:px-5
          sm:py-3
        "
        style={{
          backgroundColor: `color-mix(in srgb, ${primaryColor} 72%, transparent)`,
          borderColor: `color-mix(in srgb, ${primaryColor} 55%, white 20%)`,
          boxShadow: `
            0 8px 28px rgba(0, 0, 0, 0.20),
            0 0 20px color-mix(in srgb, ${primaryColor} 20%, transparent)
          `,
        }}
      >
        {/* Brillo superior */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-0
            rounded-full
            bg-gradient-to-b
            from-white/15
            via-transparent
            to-transparent
          "
        />

        {/* Reflejo al pasar el mouse */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            inset-y-0
            -left-1/2
            w-1/3
            -skew-x-12
            bg-white/15
            opacity-0
            transition-all
            duration-500
            group-hover:left-[120%]
            group-hover:opacity-100
          "
        />

        <span className="relative z-10 flex items-center justify-center gap-2.5">
          <CalendarDays
            size={21}
            strokeWidth={2}
            className="
              shrink-0
              transition-transform
              duration-300
              group-hover:scale-110
            "
            aria-hidden="true"
          />

          <span className="hidden whitespace-nowrap text-sm font-semibold sm:inline">
            Reservar mesa
          </span>
        </span>
      </Link>
    </motion.div>
  );
}