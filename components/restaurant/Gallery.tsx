"use client";

import styles from "./Gallery.module.css";
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
    <section className={styles.gallerySection} style={{ background: theme.background }}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span style={{ color: theme.primary, letterSpacing: "2px", fontSize: "0.8rem", fontWeight: 700 }}>
            GALERÍA
          </span>
          <h2 style={{ color: theme.text, fontSize: "clamp(1.8rem, 5vw, 2.5rem)", marginTop: "10px" }}>
            Descubre Nuestro Espacio
          </h2>
        </div>

        <div className={styles.grid}>
          {gallery.map((image: any) => (
            <motion.div
              key={image.id}
              className={styles.card}
              whileHover={{ scale: 0.98 }}
              transition={{ duration: 0.3 }}
            >
              <img
                src={image.image_url}
                alt={image.title || "Imagen de galería"}
                loading="lazy"
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