"use client";

import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { getTheme } from "@/lib/theme/getTheme";


interface Props {
  restaurant: any;
}

export default function FloatingWhatsApp({
  restaurant,
}: Props) {

const theme =
  getTheme(restaurant);

  const message =
    "Hola, quiero realizar un pedido.";

  return (
    <motion.a
      href={`https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(
        message
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      initial={{
        scale: 0,
      }}
      animate={{
        scale: 1,
      }}
      whileHover={{
  scale: 1.1,

  boxShadow:
    theme.glow
      ? `0 0 35px ${theme.primary}`
      : undefined,
}}
      whileTap={{
        scale: 0.95,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
      }}
      style={{
        position: "fixed",
        bottom: "30px",
        right: "30px",
        width: "72px",
        height: "72px",
        borderRadius:
  theme.buttonStyle ===
  "rounded"
    ? "50%"
    : "18px",
       background:
  `linear-gradient(
    135deg,
    ${theme.primary},
    ${theme.secondary}
  )`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textDecoration: "none",
        zIndex: 99999,
        boxShadow:
  theme.glow
    ? `0 15px 45px ${theme.primary}55`
    : "none",
      }}
    >
      <motion.div
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
        }}
      >
        <FaWhatsapp
          size={38}
          color="#fff"
        />
      </motion.div>
    </motion.a>
  );
}