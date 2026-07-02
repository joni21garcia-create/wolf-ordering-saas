"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";

interface Props {
  restaurant: any;
}

export default function RestaurantMap({ restaurant }: Props) {
  // Estado para evitar el error de hidratación
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const googleMapsUrl = restaurant.latitude && restaurant.longitude
    ? `https://www.google.com/maps/search/?api=1&query=${restaurant.latitude},${restaurant.longitude}`
    : "#";

  // Si aún no se ha montado, renderizamos un div vacío o un esqueleto 
  // para que el servidor y el cliente coincidan.
  if (!isMounted) {
    return <div style={{ marginTop: "40px", height: "400px" }} />;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      style={{
        marginTop: "40px",
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "30px",
        overflow: "hidden",
        width: "100%",
      }}
    >
      <div style={{ padding: "30px" }}>
        <h2 style={{ color: "#fff", fontSize: "28px", marginBottom: "10px" }}>
          📍 Ubicación
        </h2>
        <p style={{ color: "rgba(255,255,255,.75)" }}>{restaurant.address}</p>
        <p style={{ color: "rgba(255,255,255,.45)", marginTop: "8px", fontSize: "13px" }}>
          {restaurant.latitude}, {restaurant.longitude}
        </p>
      </div>

      <div
        onClick={() => window.open(googleMapsUrl, "_blank")}
        style={{
          width: "100%",
          height: "320px",
          cursor: "pointer",
        }}
      >
        <iframe
          src={`https://maps.google.com/maps?q=${restaurant.latitude},${restaurant.longitude}&z=15&output=embed`}
          width="100%"
          height="100%"
          loading="lazy"
          style={{ border: "none", pointerEvents: "none" }}
        />
      </div>
    </motion.div>
  );
}