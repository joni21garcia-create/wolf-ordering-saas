"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Props {
  restaurant: any;
}

export default function RestaurantMap({ restaurant }: Props) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const googleMapsUrl = restaurant.latitude && restaurant.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`
    : "#";

  if (!isMounted) {
    return <div style={{ height: "200px", width: "100%" }} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "24px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div style={{ padding: "20px" }}>
        <h2 style={{ color: "#fff", fontSize: "18px", marginBottom: "4px", fontWeight: "700" }}>
          📍 Ubicación
        </h2>
        <p style={{ color: "rgba(255,255,255,.6)", fontSize: "13px" }}>{restaurant.address}</p>
      </div>

      <div
        onClick={() => window.open(googleMapsUrl, "_blank")}
        style={{
          width: "100%",
          height: "200px", // Altura reducida para ser más compacto
          cursor: "pointer",
        }}
      >
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3984.7!2d${restaurant.longitude}!3d${restaurant.latitude}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2z${restaurant.latitude}%2C${restaurant.longitude}!5e0!3m2!1ses!2sec!4v1600000000000!5m2!1ses!2sec`}
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: "none", pointerEvents: "none" }}
        />
      </div>
    </motion.div>
  );
}