"use client";

import {
  useState,
  useEffect,
  useRef,
} from "react";

import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import {
  getFinalPrice,
  getCommissionConfig,
} from "@/lib/configuration/pricing";

interface Product {
  id: string;
  restaurant_id: string;
  category: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

interface Props {
  restaurant: any;
  addToCart: (
    product: Product
  ) => void;
}

export default function DigitalMenu({
  restaurant,
  addToCart,
}: Props) {

  const [products, setProducts] =
    useState<Product[]>([]);

  const [categories, setCategories] =
    useState<string[]>([]);

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState("");

  const sliderRef = useRef<HTMLDivElement>(null);

  // Ajustado a -284px (260px de tarjeta + 24px de gap) para un scroll exacto
  const scrollLeft = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: -284, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (sliderRef.current) {
      sliderRef.current.scrollBy({ left: 284, behavior: "smooth" });
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts =
    async () => {

      console.log("restaurant recibido:", restaurant);

      console.log(
        "CONFIG COMISION:",
        {
          commission_mode: restaurant.commission_mode,
          commission_active: restaurant.commission_active,
          commission_type: restaurant.commission_type,
          commission_percentage: restaurant.commission_percentage,
        }
      );

      const { data, error } = await supabase
        .from("products")
        .select(`
          *,
          categories(name)
        `)
        .eq("restaurant_id", restaurant.id)
        .eq("available", true);

      if (error) {
        console.error("Error cargando productos:", error);
        return;
      }

      const formattedProducts = (data || []).map(
        (product: any) => ({
          id: product.id,
          restaurant_id: product.restaurant_id,
          name: product.name,
          description: product.description || "",
          price: Number(product.price) || 0,
          image: product.image_url || "/placeholder-product.jpg",
          category: product.categories?.name || "Disponibles",
        })
      );

      setProducts(formattedProducts);

      const uniqueCategories = [
        ...new Set(
          formattedProducts.map((p) => p.category)
        ),
      ];

      setCategories(uniqueCategories);

      if (uniqueCategories.length > 0) {
        setSelectedCategory(uniqueCategories[0]);
      }
    };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  const commissionConfig =
    getCommissionConfig(restaurant);

  return (
    <section style={{ marginTop: "30px", width: "100%", boxSizing: "border-box" }}>
      {/* INYECTAMOS CLASES CSS PROFESIONALES PARA MÓVILES Y ESCRITORIO */}
      <style>{`
        .wolf-categories-container {
          display: flex;
          gap: 8px;
          margin-bottom: 20px;
          overflow-x: auto;
          scrollbar-width: none; /* Firefox */
          -ms-overflow-style: none;  /* IE and Edge */
          padding-bottom: 4px;
          width: 100%;
        }
        .wolf-categories-container::-webkit-scrollbar {
          display: none; /* Chrome, Safari and Opera */
        }
        .wolf-categories-btn {
          padding: 8px 16px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 13px;
          font-weight: 600;
          white-space: nowrap;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .wolf-products-slider {
          display: flex;
          gap: 24px;
          overflow-x: auto;
          scrollbar-width: none;
          -ms-overflow-style: none;
          padding-bottom: 12px;
          width: 100%;
          scroll-behavior: smooth;
        }
        .wolf-products-slider::-webkit-scrollbar {
          display: none;
        }
        @media (min-width: 640px) {
          .wolf-categories-container {
            gap: 10px;
            overflow-x: visible;
            flex-wrap: wrap;
          }
          .wolf-categories-btn {
            padding: 10px 20px;
            font-size: 14px;
          }
        }
      `}</style>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <h2
          className="wolf-title"
          style={{
            fontSize: "clamp(22px, 4vw, 30px)",
            fontWeight: "800",
            margin: 0
          }}
        >
          Menú Digital
        </h2>

        {/* FLECHAS DE NAVEGACIÓN HORIZONTAL COMPACTAS */}
        <div style={{ display: "flex", gap: "8px" }}>
          <button
            onClick={scrollLeft}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.1)",
              color: "#fff",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            aria-label="Anterior"
          >
            &#10094;
          </button>
          <button
            onClick={scrollRight}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              background: "rgba(255,255,255,.05)",
              border: "1px solid rgba(255,255,255,.1)",
              color: "#fff",
              fontSize: "14px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              transition: "background 0.2s ease",
            }}
            aria-label="Siguiente"
          >
            &#10095;
          </button>
        </div>
      </div>

      {/* CONTENEDOR DE CATEGORÍAS EN MÓVIL ESTILO CAROUSEL */}
      <div className="wolf-categories-container">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className="wolf-categories-btn"
            style={{
              background: selectedCategory === category ? "#f97316" : "rgba(255,255,255,.05)",
              color: "#fff",
              border: selectedCategory === category ? "none" : "1px solid rgba(255,255,255,.05)"
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* FILA DE SCROLL HORIZONTAL DE PRODUCTOS (TARJETAS MÁS PEQUEÑAS) */}
      <div ref={sliderRef} className="wolf-products-slider">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{
              y: -4,
              scale: 1.01,
            }}
            className="glass-card wolf-shadow"
            style={{
              flex: "0 0 260px", // Tarjeta reducida de 320px a 260px
              overflow: "hidden",
              borderRadius: "20px",
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.06)",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box"
            }}
          >
            {/* Imagen con altura optimizada a 160px */}
            <div style={{ width: "100%", height: "160px", position: "relative", background: "#1a1a1a" }}>
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  display: "block"
                }}
              />
            </div>

            <div
              style={{
                padding: "16px", // Padding interior más compacto
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "space-between"
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "16px", // Título ligeramente más pequeño
                    fontWeight: "700",
                    marginBottom: "6px",
                    marginTop: 0,
                    lineHeight: "1.3",
                    display: "-webkit-box",
                    WebkitLineClamp: 1,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden"
                  }}
                >
                  {product.name}
                </h3>

                <p
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: "13px", // Descripción compacta
                    lineHeight: "1.4",
                    margin: "0 0 10px 0",
                    display: "-webkit-box",
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: "vertical",
                    overflow: "hidden",
                    height: "36px" // Altura fija para que todas las tarjetas midan exactamente lo mismo
                  }}
                >
                  {product.description}
                </p>

                <p
                  style={{
                    color: "#f97316",
                    fontWeight: "800",
                    fontSize: "18px", // Precio más sutil
                    margin: "0 0 12px 0"
                  }}
                >
                  $
                  {getFinalPrice(
                    product.price,
                    commissionConfig
                  ).toFixed(2)}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => addToCart(product)}
                className="wolf-button"
                style={{
                  width: "100%",
                  padding: "10px", // Botón más esbelto
                  border: "none",
                  borderRadius: "10px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "13px",
                  boxSizing: "border-box"
                }}
              >
                Agregar al carrito
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}