"use client";

import { useRef, useState } from "react";
import { ShoppingCart, Utensils, ZoomIn } from "lucide-react";
import { getTheme } from "@/lib/theme/getTheme";
import {
  getFinalPrice,
  getCommissionConfig,
} from "@/lib/configuration/pricing";
import { useCart } from "./order/hooks/useCart";
import ProductModal from "./order/menu/ProductModal";
import type { Product as CartProduct } from "./order/types";

interface Props {
  restaurant: any;
}

export default function FeaturedMenu({ restaurant }: Props) {
  const theme = getTheme(restaurant);
  const commissionConfig = getCommissionConfig(restaurant);
  const { addToCart } = useCart(commissionConfig);
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});
  const [addedProductId, setAddedProductId] = useState<string | null>(null);

  const featuredSliderRef = useRef<HTMLDivElement>(null);

  const scrollFeaturedLeft = () => {
    featuredSliderRef.current?.scrollBy({
      left: -250,
      behavior: "smooth",
    });
  };

  const scrollFeaturedRight = () => {
    featuredSliderRef.current?.scrollBy({
      left: 250,
      behavior: "smooth",
    });
  };

  const featuredProducts = restaurant.featuredProducts || [];
  if (featuredProducts.length === 0) return null;

  const toCartProduct = (product: any): CartProduct => ({
    id: product.id,
    restaurant_id: product.restaurant_id ?? restaurant.id,
    category: product.category?.name ?? product.category ?? "Destacados",
    name: product.name,
    description: product.description ?? "",
    price: Number(product.price) || 0,
    image: product.image_url ?? null,
    image_url: product.image_url ?? null,
  });

  const handleAdd = (product: any) => {
    addToCart(toCartProduct(product));
    setAddedProductId(product.id);
    window.setTimeout(() => {
      setAddedProductId((current) => (current === product.id ? null : current));
    }, 1200);
  };

  return (
    <section data-wolf-theme-section="true"
      id="featured-menu"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "60px 16px",
        background: "radial-gradient(circle at 50% 0%, #141414 0%, #080808 60%, #030303 100%)",
      }}
    >
      <div style={{ position: "absolute", width: 450, height: 450, background: theme.primary, filter: "blur(180px)", opacity: 0.07, top: -100, left: -150, pointerEvents: "none" }} />
      <div style={{ position: "absolute", width: 400, height: 400, background: theme.secondary || theme.primary, filter: "blur(160px)", opacity: 0.04, bottom: -100, right: -150, pointerEvents: "none" }} />

      <div style={{ maxWidth: 1200, margin: "0 auto", position: "relative", zIndex: 2 }}>
        <div style={{ marginBottom: 25, textAlign: "left" }}>
          <span style={{ color: theme.primary, textTransform: "uppercase", letterSpacing: "2.5px", fontSize: 11, fontWeight: 800, display: "block", marginBottom: 6 }}>
            Selección Especial
          </span>
          <h2 style={{ fontSize: "clamp(1.8rem, 3vw, 2.8rem)", fontWeight: 800, color: "#ffffff", letterSpacing: "-1px", margin: 0 }}>
            Menú Destacado
          </h2>
        </div>

        <div
          style={{
            position: "relative",
            width: "100%",
          }}
        >
          {/* Flecha izquierda */}
          <button
            type="button"
            onClick={scrollFeaturedLeft}
            aria-label="Anterior producto destacado"
            style={{
              position: "absolute",
              left: 6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(20,20,20,0.92)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              fontSize: 14,
            }}
          >
            &#10094;
          </button>

          {/* Carrusel de productos destacados */}
          <div
            ref={featuredSliderRef}
            style={{
              display: "flex",
              gap: 14,
              overflowX: "auto",
              padding: "0 48px 10px",
              scrollbarWidth: "none",
              WebkitOverflowScrolling: "touch",
              scrollBehavior: "smooth",
            }}
          >
            {featuredProducts.map((product: any) => {
            const imageUrl = product.image_url ?? null;
            const imageFailed = imageErrors[product.id];
            const isAdded = addedProductId === product.id;

            return (
              <div
                key={product.id}
                style={{ flex: "0 0 210px", background: theme.cardStyle === "glass" ? "rgba(20,20,20,0.6)" : "#111111", backdropFilter: "blur(20px)", WebkitBackdropFilter: "blur(20px)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 16, overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", boxShadow: theme.glow ? `0 0 20px ${theme.primary}20` : "0 10px 30px rgba(0,0,0,0.6)" }}
              >
                <div
                  style={{ position: "relative", overflow: "hidden", height: 130, background: "rgba(255,255,255,.06)", cursor: imageUrl && !imageFailed ? "zoom-in" : "default" }}
                  onClick={() => setSelectedProduct(toCartProduct(product))}
                >
                  {imageUrl && !imageFailed ? (
                    <img
                      src={imageUrl}
                      alt={product.name}
                      onError={() => setImageErrors((prev) => ({ ...prev, [product.id]: true }))}
                      style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95, display: "block" }}
                    />
                  ) : (
                    <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "rgba(255,255,255,.56)" }}>
                      <Utensils size={34} strokeWidth={1.6} />
                    </div>
                  )}
                  <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.5))", pointerEvents: "none" }} />
                  {imageUrl && !imageFailed && <span style={{ position: "absolute", right: 8, bottom: 8, width: 30, height: 30, borderRadius: 999, display: "grid", placeItems: "center", background: "rgba(0,0,0,.56)", color: "#fff", pointerEvents: "none" }}><ZoomIn size={15} /></span>}
                </div>

                <div style={{ padding: 12, display: "flex", flexDirection: "column", gap: 12, flex: 1 }}>
                  <div style={{ flex: 1, cursor: "pointer" }} onClick={() => setSelectedProduct(toCartProduct(product))}>
                    <h3 style={{ color: "#fff", fontSize: 14, fontWeight: 700, margin: "0 0 4px", letterSpacing: "-0.2px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{product.name}</h3>
                    <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 11, lineHeight: 1.4, margin: 0, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{product.description}</p>
                  </div>

                  <div>
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8, borderTop: "1px solid rgba(255,255,255,0.06)", marginBottom: 8 }}>
                      <span style={{ fontSize: 10, color: "rgba(255,255,255,0.4)", fontWeight: 600, textTransform: "uppercase" }}>Precio</span>
                      <strong style={{ fontSize: 16, fontWeight: 800, color: theme.primary, letterSpacing: "-0.5px" }}>${getFinalPrice(Number(product.price), commissionConfig).toFixed(2)}</strong>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleAdd(product)}
                      style={{ width: "100%", border: 0, borderRadius: theme.buttonStyle === "rounded" ? 999 : 10, padding: "9px 11px", background: isAdded ? "rgba(255,255,255,.12)" : theme.primary, color: isAdded ? "#fff" : theme.text, fontWeight: 750, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7, transition: "all .2s ease" }}
                    >
                      <ShoppingCart size={14} />
                      {isAdded ? "Añadido ✓" : "Añadir al carrito"}
                    </button>
                  </div>
                </div>
              </div>
            );
            })}
          </div>

          {/* Flecha derecha */}
          <button
            type="button"
            onClick={scrollFeaturedRight}
            aria-label="Siguiente producto destacado"
            style={{
              position: "absolute",
              right: 6,
              top: "50%",
              transform: "translateY(-50%)",
              zIndex: 20,
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: "rgba(20,20,20,0.92)",
              border: "1px solid rgba(255,255,255,0.2)",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 6px 18px rgba(0,0,0,0.5)",
              backdropFilter: "blur(10px)",
              fontSize: 14,
            }}
          >
            &#10095;
          </button>
        </div>
      </div>

      <ProductModal
        product={selectedProduct}
        finalPrice={selectedProduct ? getFinalPrice(Number(selectedProduct.price), commissionConfig) : 0}
        primaryColor={theme.primary}
        onClose={() => setSelectedProduct(null)}
        onAdd={() => {
          if (!selectedProduct) return;
          addToCart(selectedProduct);
          setSelectedProduct(null);
        }}
      />
    </section>
  );
}