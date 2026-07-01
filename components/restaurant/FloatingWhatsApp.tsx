"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import { getTheme } from "@/lib/theme/getTheme";
import WhatsAppLockedModal from "@/components/restaurant/WhatsAppLockedModal";

interface Props {
  restaurant: any;
}

export default function FloatingWhatsApp({
  restaurant,
}: Props) {
  
  const theme = getTheme(restaurant);

  const [unlocked, setUnlocked] = useState(false);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!restaurant?.id) return;

    const key = `wolf_whatsapp_${restaurant.id}`;

    setUnlocked(localStorage.getItem(key) === "true");
  }, [restaurant?.id]);

  const message = "Hola, quiero realizar un pedido.";

  function handleClick() {
    if (!unlocked) {
      setShowModal(true);
      return;
    }

    window.open(
      `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(
        message
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  return (
    <>
      <WhatsAppLockedModal
        open={showModal}
        onClose={() => setShowModal(false)}
        primaryColor={theme.primary}
        orderUrl={`/${restaurant.slug}/order`}
      />

      <motion.button
        type="button"
        onClick={handleClick}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{
          scale: 1.1,
          boxShadow: theme.glow ? `0 0 35px ${theme.primary}` : undefined,
        }}
        whileTap={{ scale: 0.95 }}
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
          border: "none",
          outline: "none",
          cursor: "pointer",
          borderRadius: theme.buttonStyle === "rounded" ? "50%" : "18px",
          background: `linear-gradient(135deg, ${theme.primary}, ${theme.secondary})`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 99999,
          boxShadow: theme.glow
            ? `0 15px 45px ${theme.primary}55`
            : "0 15px 45px rgba(0,0,0,.25)",
        }}
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{
            duration: 1.8,
            repeat: Infinity,
          }}
        >
          <FaWhatsapp size={38} color="#fff" />
        </motion.div>

        {!unlocked && (
          <div
            style={{
              position: "absolute",
              top: "-6px",
              right: "-6px",
              width: "28px",
              height: "28px",
              borderRadius: "50%",
              background: "rgba(255, 255, 255, 0.95)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#374151",
              fontSize: "14px",
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              border: "1px solid rgba(0,0,0,0.1)",
            }}
          >
            🔒
          </div>
        )}
      </motion.button>
    </>
  );
}