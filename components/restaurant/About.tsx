"use client";

import { motion } from "framer-motion";
import { getTheme } from "@/lib/theme/getTheme";


interface Props {
  restaurant: any;
}

export default function About({
  restaurant,
}: Props) {

const theme =
  getTheme(restaurant); 

  return (
    <section
      id="about"
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
          width: "450px",
          height: "450px",
          borderRadius: "50%",
      background:
  theme.primary,
          filter: "blur(180px)",
          opacity: 0.1,
          top: "-150px",
          left: "-150px",
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
          position: "relative",
          zIndex: 2,
        }}
      >
        <h2
          style={{
             color: theme.text,
            textShadow:
  theme.glow
    ? `0 0 30px ${theme.primary}55`
    : "none",
            fontSize:
              "clamp(2.8rem,5vw,4.5rem)",
            fontWeight: "800",
            marginBottom: "30px",
          }}
        >
     
  {restaurant.about_title ||
    "Nuestra Historia"}
</h2>

        <p
          style={{
            color: theme.text,
            fontSize: "1.1rem",
            lineHeight: 1.8,
            maxWidth: "800px",
            marginBottom: "70px",
          }}
        >
          
    {restaurant.about_description}
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "25px",
          }}
        >
          {[
  restaurant.show_about_stat1 && {
    number:
      restaurant.about_stat1_value,
    label:
      restaurant.about_stat1_label,
  },

  restaurant.show_about_stat2 && {
    number:
      restaurant.about_stat2_value,
    label:
      restaurant.about_stat2_label,
  },

  restaurant.show_about_stat3 && {
    number:
      restaurant.about_stat3_value,
    label:
      restaurant.about_stat3_label,
  },
].filter(Boolean).map((item) => (
            <div
              key={item.label}
              style={{
               background:
  theme.cardStyle ===
  "glass"
    ? "rgba(255,255,255,.05)"
    : "#111111",
                backdropFilter:
                  "blur(20px)",
                border:
                  "1px solid rgba(255,255,255,.08)",
                borderRadius: "24px",
                padding: "35px",
                textAlign: "center",
                boxShadow:
  theme.glow
    ? `0 0 25px ${theme.primary}15`
    : "none",
              }}
            >
              <h3
                style={{
                 color:
  theme.primary,
  textShadow:
      theme.glow
        ? `0 0 20px ${theme.primary}55`
        : "none",
                  fontSize: "3rem",
                  marginBottom: "10px",
                }}
              >
                {item.number}
              </h3>

              <p
                style={{
                 color: theme.text,
                }}
              >
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </motion.div>
    </section>
  );
}