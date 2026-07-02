"use client";

import { motion } from "framer-motion";

interface Props {
  restaurant: any;
}

export default function RestaurantMap({ restaurant }: Props) {
  // Blindaje: Corrección de formato de URL para Google Maps
  const lat = restaurant.latitude;
  const lng = restaurant.longitude;
  
  // URL funcional para abrir en nueva pestaña y para el iframe
  const googleMapsUrl = lat && lng 
    ? `https://www.google.com/maps/search/?api=1&query=${lat},${lng}` 
    : "#";

  if (!lat || !lng) return null; // No renderizar si no hay ubicación

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
      }}
    >
      <div style={{ padding: "30px" }}>
        <h2 style={{ color: "#fff", fontSize: "28px", marginBottom: "10px" }}>
          📍 Ubicación
        </h2>
        <p style={{ color: "rgba(255,255,255,.75)" }}>
          {restaurant.address || "Dirección no disponible"}
        </p>
      </div>

      <div
        onClick={() => window.open(googleMapsUrl, "_blank")}
        style={{
          width: "100%",
          height: "320px",
          cursor: "pointer",
          position: "relative",
        }}
      >
        {/* El iframe embebido correcto */}
        <iframe
          src={`https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d1000!2d${lng}!3d${lat}!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1ses!2sec!4v1!5m2!1ses!2sec`}
          width="100%"
          height="100%"
          loading="lazy"
          style={{
            border: "none",
            pointerEvents: "none", // Evita que el usuario quede atrapado dentro del scroll del mapa
          }}
        />
        
        {/* Capa invisible para asegurar el clic al abrir mapa */}
        <div style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "transparent"
        }} />
      </div>
    </motion.div>
  );
}