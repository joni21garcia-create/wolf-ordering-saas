"use client";

import styles from "./Gallery.module.css";
import "./GalleryDesigns.css";
import { getTheme } from "@/lib/theme/getTheme";
import { motion } from "framer-motion";

interface Props {
  restaurant: any;
}

export default function Gallery({ restaurant }: Props) {
  const theme = getTheme(restaurant);

  // Filtramos las imágenes activas
  const gallery = restaurant.gallery?.filter((image: any) => image.active) || [];

  if (!gallery.length) return null;

  return (
    <section data-wolf-gallery={theme.galleryStyle} data-wolf-design={theme.designId} className={styles.gallerySection} style={{ background: theme.background }}>
      <div className={`${styles.container} wolf-gallery-shell`}>
        <div className={`${styles.header} wolf-gallery-header`}>
          <span style={{ color: theme.primary, letterSpacing: "2px", fontSize: "0.8rem", fontWeight: 700 }}>
            GALERÍA
          </span>
          <h2 style={{ color: theme.text, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", marginTop: "10px" }}>
            Descubre Nuestro Espacio
          </h2>
        </div>

        {/* Forzamos el grid a mostrar 2 fotos (columnas) usando estilos inline de alta prioridad */}
        <div 
          className={`${styles.grid} wolf-gallery-grid`}
          style={{
            display: "grid",
            // repeat(2, 1fr) asegura 2 columnas fijas. En pantallas muy grandes se puede expandir si lo deseas, pero aquí queda en 2.
            gridTemplateColumns: "repeat(2, 1fr)", 
            gap: "12px", // Un gap optimizado para que luzca simétrico en formato de doble columna
            width: "100%",
          }}
        >
          {gallery.map((image: any) => (
            <motion.div
              key={image.id}
              className={`${styles.card} wolf-gallery-card`}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
              style={{
                width: "100%",
                overflow: "hidden",
                position: "relative",
              }}
            >
              <img
                src={image.image_url}
                alt={image.title || "Imagen de galería"}
                loading="lazy"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <div className={styles.overlay}>
                <h3 style={{ color: "#fff", fontSize: "1.1rem", margin: 0 }}>
                  {image.title}
                </h3>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


