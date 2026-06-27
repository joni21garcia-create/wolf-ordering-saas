"use client";

import { motion } from "framer-motion";
import Link from "next/link";

import { getTheme } from "@/lib/theme/getTheme";


interface Props {
  restaurant: any;
}

export default function CTA({
  restaurant,
}: Props) {

  const theme =
  getTheme(restaurant);

if (!restaurant.show_cta)
  return null;

  return (
    <section
      id="contact"
      style={{
        padding: "120px 20px",
        background:
  `linear-gradient(
    180deg,
    ${theme.background} 0%,
    ${theme.background}dd 100%
  )`,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Glow */}
      <div
        style={{
          position: "absolute",
          width: "500px",
          height: "500px",
          borderRadius: "50%",
          background:
  theme.primary,
          filter: "blur(180px)",
          opacity: 0.12,
          top: "-200px",
          right: "-150px",
        }}
      />

      <motion.div
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
        }}
        transition={{
          duration: 0.8,
        }}
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          textAlign: "center",
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          style={{
            fontSize:
              "clamp(2.8rem,6vw,5rem)",
            fontWeight: "800",
           color: theme.text,
            textShadow:
  theme.glow
    ? `0 0 30px ${theme.primary}55`
    : "none",
            marginBottom: "25px",
          }}
        >
          {restaurant.cta_title ||
 "¿Listo para ordenar?"}
        </h2>

        <p
          style={{
            maxWidth: "750px",
            margin: "0 auto",
            color: theme.text,
opacity: 0.75,
            fontSize: "1.2rem",
            lineHeight: 1.8,
          }}
        >
          {restaurant.cta_description ||
 "Haz tu pedido ahora mismo y recibe la mejor experiencia gastronómica directamente en tu hogar."}
        </p>

        {restaurant.is_open ? (
  <Link href={`/${restaurant.slug}/order`}>
    <button
      style={{
        background:
  theme.primary,
        color: theme.text,
        border: "none",
        padding: "14px 28px",
        borderRadius: "14px",
        fontWeight: "700",
        cursor: "pointer",
        boxShadow:
  theme.glow
    ? `0 10px 30px ${theme.primary}55`
    : "none",
      }}
    >
      {restaurant.cta_button_text ||
 "Ordenar Ahora 🚀"}
    </button>
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
      padding: "14px 28px",
     borderRadius:
  theme.buttonStyle ===
  "rounded"
    ? "999px"
    : "14px",
      fontWeight: "700",
      cursor: "not-allowed",
    }}
  >
      🔒 Cerrado
  </button>
)}
      </motion.div>
    </section>
  );
}