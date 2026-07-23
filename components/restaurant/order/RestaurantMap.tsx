"use client";

import { motion } from "framer-motion";

interface Props {
  restaurant: any;
}

export default function RestaurantMap({
  restaurant,
}: Props) {
  
  const latitude = restaurant?.latitude;
  const longitude = restaurant?.longitude;

  // URL correcta para redirección externa al hacer clic
  const googleMapsUrl = latitude && longitude
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : "#";


  return (
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
        duration: 0.6,
      }}
      style={{
        background: "rgba(255,255,255,.04)",
        border: "1px solid rgba(255,255,255,.08)",
        backdropFilter: "blur(20px)",
        borderRadius: "30px",
        overflow: "hidden",
        width: "100%",
        boxSizing: "border-box"
      }}
    >
      <div
        style={{
          padding: "24px",
        }}
      >
        <h2
          style={{
            color: "#fff",
            fontSize: "clamp(22px, 4vw, 28px)",
            marginBottom: "10px",
            fontWeight: "700",
            margin: 0
          }}
        >
          📍 Ubicación
        </h2>

        <p
          style={{
            color: "rgba(255,255,255,.75)",
            fontSize: "14px",
            lineHeight: "1.4",
            margin: "10px 0 0 0"
          }}
        >
          {restaurant?.address || "Dirección no configurada"}
        </p>

        {latitude && longitude && (
          <p
            style={{
              color: "rgba(255,255,255,.45)",
              marginTop: "8px",
              fontSize: "12px",
              fontFamily: "monospace",
              margin: "6px 0 0 0"
            }}
          >
            {latitude}, {longitude}
          </p>
        )}
      </div>

      {latitude && longitude ? (
        <div
          onClick={() => {
            if (googleMapsUrl !== "#") window.open(googleMapsUrl, "_blank");
          }}
          style={{
            width: "100%",
            height: "260px",
            cursor: "pointer",
            position: "relative",
            background: "#121212"
          }}
        >
          <iframe
            src={`https://maps.google.com/maps?q=${latitude},${longitude}&z=15&output=embed`}
            width="100%"
            height="100%"
            loading="lazy"
            style={{
              border: "none",
              pointerEvents: "none",
              display: "block"
            }}
          />
        </div>
      ) : (
        <div style={{ height: "120px", display: "flex", alignItems: "center", justifyContent: "center", color: "#555", fontSize: "14px" }}>
          Mapa no disponible
        </div>
      )}
    </motion.div>
  );
}


