"use client";

import "./MenuDesigns.css";
import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { getTheme } from "@/lib/theme/getTheme";
import { ShoppingCart, Utensils, ZoomIn } from "lucide-react";
import { getCommissionConfig } from "@/lib/configuration/pricing";
import { useCart } from "./order/hooks/useCart";
import ProductModal from "./order/menu/ProductModal";
import type { Product as CartProduct } from "./order/types";

function getDisplayPrice(price: number, restaurant: any) {
  if (!restaurant?.commission_active) {
    return price;
  }

  const percentage = Number(restaurant.commission_percentage) || 0;

  if (restaurant.commission_type === "customer") {
    return price + (price * percentage) / 100;
  }

  return price;
}

interface Props {
  restaurant: any;
}

export default function Menu({ restaurant }: Props) {
  const theme = getTheme(restaurant);
  const categories = restaurant.categories || [];
  const products = restaurant.products || [];
  const commissionConfig = getCommissionConfig(restaurant);
  const { addToCart } = useCart(commissionConfig);
  const [selectedProduct, setSelectedProduct] = useState<CartProduct | null>(null);
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({});

  const availableCategories = categories.filter((cat: any) =>
    products.some((p: any) => p.category_id === cat.id && p.available === true)
  );

  const [selectedCategory, setSelectedCategory] = useState<string>(
    availableCategories[0]?.id || ""
  );

  // Referencias para los desplazamientos horizontales
  const sliderRef = useRef<HTMLDivElement>(null);
  const categoriesBarRef = useRef<HTMLDivElement>(null);

  // Funciones de scroll para los productos
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -230, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 230, behavior: "smooth" });
    }
  };

  // Funciones de scroll para la BARRA DE CATEGORÍAS
  const scrollCategoriesLeft = () => {
    if (categoriesBarRef.current) {
      categoriesBarRef.current.scrollBy({ left: -250, behavior: "smooth" });
    }
  };

  const scrollCategoriesRight = () => {
    if (categoriesBarRef.current) {
      categoriesBarRef.current.scrollBy({ left: 250, behavior: "smooth" });
    }
  };

  return (
    <section data-wolf-theme-section="true"
      data-wolf-menu={theme.menuStyle}
      data-wolf-design={theme.designId}
      id="menu"
      style={{
        position: "relative",
        overflow: "hidden",
        padding: "60px 16px",
        background: "radial-gradient(circle at 50% 0%, #141414 0%, #080808 60%, #030303 100%)",
      }}
    >
      {/* Glows ambientales */}
      <div
        style={{
          position: "absolute",
          width: "450px",
          height: "450px",
          background: theme.primary,
          filter: "blur(180px)",
          opacity: 0.07,
          top: "-100px",
          left: "-150px",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          width: "400px",
          height: "400px",
          background: theme.secondary || theme.primary,
          filter: "blur(160px)",
          opacity: 0.04,
          bottom: "-100px",
          right: "-150px",
          pointerEvents: "none",
        }}
      />

      <div
        className="wolf-menu-shell"
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div className="wolf-menu-header" style={{ marginBottom: "25px", textAlign: "left" }}>
          <span style={{ color: theme.primary, textTransform: "uppercase", letterSpacing: "2.5px", fontSize: "11px", fontWeight: "800", display: "block", marginBottom: "6px" }}>
            Nuestra Selección
          </span>
          <h2
            style={{
              fontSize: "clamp(1.8rem, 3vw, 2.8rem)",
              fontWeight: "800",
              color: "#ffffff",
              letterSpacing: "-1px",
              margin: 0,
            }}
          >
            Menú Exclusivo
          </h2>
        </div>

        {/* BARRA DE CATEGORÍAS CON FLECHAS EN LOS EXTREMOS */}
        <div className="wolf-menu-categories"
          style={{ 
            position: "sticky", 
            top: "15px", 
            zIndex: 40, 
            background: "rgba(10, 10, 10, 0.85)", 
            backdropFilter: "blur(16px)", 
            WebkitBackdropFilter: "blur(16px)",
            padding: "10px 4px", 
            marginBottom: "30px", 
            borderBottom: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            borderRadius: "14px",
            display: "flex",
            alignItems: "center"
          }}
        >
          {/* Flecha Izquierda Categorías */}
          <button
            onClick={scrollCategoriesLeft}
            aria-label="Anterior categoría"
            style={{
              position: "absolute",
              left: "6px",
              zIndex: 50,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(20, 20, 20, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              fontSize: "12px"
            }}
          >
            &#10094;
          </button>

          {/* Lista scrolleable de categorías */}
          <div 
            ref={categoriesBarRef}
            style={{ 
              display: "flex", 
              gap: "8px", 
              overflowX: "auto", 
              padding: "0 42px 4px 42px",
              scrollbarWidth: "none",
              scrollBehavior: "smooth",
              width: "100%"
            }}
          >
            {availableCategories.map((cat: any) => {
              const activeId = selectedCategory || availableCategories[0]?.id;
              const isSelected = activeId === cat.id;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  style={{
                    flexShrink: 0,
                    padding: "8px 16px",
                    borderRadius: "10px",
                    border: isSelected ? `1px solid ${theme.primary}` : "1px solid rgba(255,255,255,0.08)",
                    background: isSelected ? `${theme.primary}25` : "rgba(255,255,255,0.03)",
                    color: isSelected ? theme.primary : "#fff",
                    fontWeight: "700",
                    cursor: "pointer",
                    fontSize: "13px",
                    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                    boxShadow: isSelected ? `0 0 12px ${theme.primary}33` : "none"
                  }}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Flecha Derecha Categorías */}
          <button
            onClick={scrollCategoriesRight}
            aria-label="Siguiente categoría"
            style={{
              position: "absolute",
              right: "6px",
              zIndex: 50,
              width: "32px",
              height: "32px",
              borderRadius: "50%",
              background: "rgba(20, 20, 20, 0.9)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              color: "#ffffff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
              backdropFilter: "blur(8px)",
              fontSize: "12px"
            }}
          >
            &#10095;
          </button>
        </div>

        {/* CONTENIDO CON SCROLL HORIZONTAL Y FLECHAS DE NAVEGACIÓN */}
        {categories.map((category: any) => {
          const activeId = selectedCategory || availableCategories[0]?.id;
          
          if (category.id !== activeId) {
            return null;
          }

          const categoryProducts = products.filter(
            (product: any) =>
              product.category_id === category.id &&
              product.available === true
          );

          if (categoryProducts.length === 0) {
            return (
              <div key={category.id} style={{ textAlign: "center", padding: "40px 0", color: "rgba(255,255,255,0.5)", fontSize: "13px" }}>
                No hay productos disponibles en esta categoría por el momento.
              </div>
            );
          }

          return (
            <motion.div
              className="wolf-menu-category"
              key={category.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              style={{ marginBottom: "40px" }}
            >
              {/* Cabecera de Categoría y Flechas de Navegación de Productos */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px", gap: "12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", flex: 1 }}>
                  <h3
                    style={{
                      fontSize: "20px",
                      fontWeight: "800",
                      color: "#ffffff",
                      letterSpacing: "-0.5px",
                      margin: 0,
                      whiteSpace: "nowrap",
                    }}
                  >
                    {category.name}
                  </h3>
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg, rgba(255,255,255,0.1), transparent)" }} />
                </div>

                {/* Botones de Flecha para los productos */}
                <div style={{ display: "flex", gap: "6px" }}>
                  <button
                    onClick={scrollLeft}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.primary;
                      e.currentTarget.style.borderColor = theme.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                    aria-label="Anterior"
                  >
                    &#10094;
                  </button>

                  <button
                    onClick={scrollRight}
                    style={{
                      width: "34px",
                      height: "34px",
                      borderRadius: "50%",
                      background: "rgba(255,255,255,0.05)",
                      border: "1px solid rgba(255,255,255,0.1)",
                      color: "#fff",
                      fontSize: "13px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      cursor: "pointer",
                      transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = theme.primary;
                      e.currentTarget.style.borderColor = theme.primary;
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "rgba(255,255,255,0.05)";
                      e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                    }}
                    aria-label="Siguiente"
                  >
                    &#10095;
                  </button>
                </div>
              </div>

              {/* FILA DE SCROLL HORIZONTAL DE PRODUCTOS */}
              <div
                ref={sliderRef}
                style={{
                  display: "flex",
                  gap: "14px",
                  overflowX: "auto",
                  paddingBottom: "10px",
                  scrollbarWidth: "none",
                  WebkitOverflowScrolling: "touch",
                  scrollBehavior: "smooth",
                }}
              >
                {categoryProducts.map((product: any) => (
                  <motion.div
                    className="wolf-menu-product"
                    key={product.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                    whileHover={{
                      y: -4,
                      borderColor: `${theme.primary}66`,
                      boxShadow: `0 15px 30px rgba(0,0,0,0.6), 0 0 15px ${theme.primary}20`,
                    }}
                    style={{
                      flex: "0 0 210px",
                      background: theme.cardStyle === "glass" ? "rgba(20,20,20,0.6)" : "#111111",
                      backdropFilter: "blur(20px)",
                      WebkitBackdropFilter: "blur(20px)",
                      border: "1px solid rgba(255,255,255,0.07)",
                      borderRadius: "16px",
                      overflow: "hidden",
                      cursor: "pointer",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      transition: "border-color 0.3s ease",
                    }}
                  >
                    {/* IMAGEN COMPACTA */}
                    <div
                      style={{ position: "relative", overflow: "hidden", height: "130px", background: "rgba(255,255,255,.06)" }}
                      onClick={(event) => {
                        event.stopPropagation();
                        if (product.image_url && !imageErrors[product.id]) {
                          setSelectedProduct({
                            id: product.id,
                            restaurant_id: product.restaurant_id ?? restaurant.id,
                            category: category.name,
                            name: product.name,
                            description: product.description ?? "",
                            price: Number(product.price) || 0,
                            image: product.image_url,
                            image_url: product.image_url,
                          });
                        } else {
                          setSelectedProduct({
                            id: product.id,
                            restaurant_id: product.restaurant_id ?? restaurant.id,
                            category: category.name,
                            name: product.name,
                            description: product.description ?? "",
                            price: Number(product.price) || 0,
                            image: null,
                            image_url: null,
                          });
                        }
                      }}
                    >
                      {product.image_url && !imageErrors[product.id] ? (
                        <motion.img
                          src={product.image_url}
                          alt={product.name}
                          whileHover={{ scale: 1.08 }}
                          transition={{ duration: 0.5, ease: "easeOut" }}
                          onError={() => setImageErrors((prev) => ({ ...prev, [product.id]: true }))}
                          style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.95, display: "block" }}
                        />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "grid", placeItems: "center", color: "rgba(255,255,255,.56)" }}>
                          <Utensils size={34} strokeWidth={1.6} />
                        </div>
                      )}
                      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.5))", pointerEvents: "none" }} />
                      {product.image_url && !imageErrors[product.id] && (
                        <span style={{ position: "absolute", right: 8, bottom: 8, width: 30, height: 30, borderRadius: 999, display: "grid", placeItems: "center", background: "rgba(0,0,0,.56)", color: "#fff", pointerEvents: "none" }}>
                          <ZoomIn size={15} />
                        </span>
                      )}
                    </div>

                    {/* CONTENIDO INTERNO */}
                    <div style={{ padding: "12px", display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between" }}>
                      <div>
                        <h4
                          style={{
                            color: "#fff",
                            fontSize: "14px",
                            fontWeight: "700",
                            marginBottom: "4px",
                            letterSpacing: "-0.2px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          }}
                        >
                          {product.name}
                        </h4>

                        <p
                          style={{
                            color: "rgba(255,255,255,0.6)",
                            fontSize: "11px",
                            lineHeight: 1.4,
                            marginBottom: "12px",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {product.description}
                        </p>
                      </div>

                      <div style={{ paddingTop: "8px", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 9 }}>
                          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.4)", fontWeight: "600", textTransform: "uppercase" }}>Precio</span>
                          <strong style={{ fontSize: "16px", fontWeight: "800", color: theme.primary, letterSpacing: "-0.5px" }}>
                            ${getDisplayPrice(Number(product.price), restaurant).toFixed(2)}
                          </strong>
                        </div>
                        <button
                          type="button"
                          onClick={(event) => {
                            event.stopPropagation();
                            const cartProduct: CartProduct = {
                              id: product.id,
                              restaurant_id: product.restaurant_id ?? restaurant.id,
                              category: category.name,
                              name: product.name,
                              description: product.description ?? "",
                              price: Number(product.price) || 0,
                              image: product.image_url ?? null,
                              image_url: product.image_url ?? null,
                            };
                            addToCart(cartProduct);
                          }}
                          style={{ width: "100%", border: 0, borderRadius: 10, padding: "9px 11px", background: theme.primary, color: theme.text ?? "#fff", fontWeight: 750, fontSize: 12, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 7 }}
                        >
                          <ShoppingCart size={14} />
                          AÑadir al carrito
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          );
        })}
      </div>

      <ProductModal
        product={selectedProduct}
        finalPrice={selectedProduct ? getDisplayPrice(Number(selectedProduct.price), restaurant) : 0}
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




