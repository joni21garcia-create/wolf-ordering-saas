"use client";

import { getTheme } from "@/lib/theme/getTheme";
import Link from "next/link";
import { motion } from "framer-motion";

interface Props {
  restaurant: any;
}

function getDisplayPrice(product: any, restaurant: any) {
  const basePrice = Number(product.price) || 0;
  if (!restaurant?.commission_active) return basePrice;
  const percentage = Number(restaurant.commission_percentage) || 0;
  return restaurant.commission_type === "customer" 
    ? basePrice + (basePrice * percentage) / 100 
    : basePrice;
}

export default function FeaturedMenu({ restaurant }: Props) {
  const theme = getTheme(restaurant);
  const featuredProducts = restaurant.featuredProducts || [];

  if (featuredProducts.length === 0) return null;

  return (
    <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "60px 20px" }}>
      <h2 style={{ 
        fontSize: "clamp(1.8rem, 5vw, 2.5rem)", 
        fontWeight: "bold", 
        color: theme.text, 
        marginBottom: "40px",
        textAlign: "center" 
      }}>
        Menú Destacado
      </h2>

      <div style={{ 
        display: "grid", 
        // Se ajusta automáticamente: de 1 columna en móvil a 3 en desktop
        gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", 
        gap: "24px" 
      }}>
        {featuredProducts.map((product: any) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -5 }}
            style={{ 
              background: theme.cardStyle === "glass" ? "rgba(255,255,255,.06)" : theme.background,
              borderRadius: "20px",
              overflow: "hidden",
              boxShadow: theme.glow ? `0 0 30px ${theme.primary}20` : "0 10px 30px rgba(0,0,0,.08)",
              display: "flex",
              flexDirection: "column"
            }}
          >
            <div style={{ width: "100%", height: "200px", overflow: "hidden" }}>
              <img
                src={product.image_url}
                alt={product.name}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
            </div>

            <div style={{ padding: "20px", display: "flex", flexDirection: "column", flexGrow: 1 }}>
              <h3 style={{ fontSize: "1.25rem", fontWeight: "bold", color: theme.text, marginBottom: "8px" }}>
                {product.name}
              </h3>
              <p style={{ color: theme.text, opacity: 0.7, marginBottom: "20px", flexGrow: 1, fontSize: "0.95rem" }}>
                {product.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "auto" }}>
                <strong style={{ fontSize: "1.5rem", color: theme.primary }}>
                  ${getDisplayPrice(product, restaurant).toFixed(2)}
                </strong>

                {restaurant.is_open && (
                  <Link href={`/${restaurant.slug}/order`}>
                    <button style={{
                      background: theme.primary,
                      color: theme.text,
                      border: "none",
                      padding: "10px 20px",
                      borderRadius: theme.buttonStyle === "rounded" ? "999px" : "12px",
                      cursor: "pointer",
                      fontWeight: "700"
                    }}>
                      {restaurant.navbar_button_text || "Ordenar"}
                    </button>
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}