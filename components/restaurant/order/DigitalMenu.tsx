"use client";

import {
  useState,
  useEffect,
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

  return (
    <section style={{ marginTop: "40px", width: "100%", boxSizing: "border-box" }}>
      {/* INYECTAMOS CLASES CSS PROFESIONALES PARA MÓVILES Y ESCRITORIO */}
      <style>{`
        .wolf-categories-container {
          display: flex;
          gap: 10px;
          margin-bottom: 24px;
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
          padding: 10px 18px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
          white-space: nowrap;
          transition: background-color 0.2s ease, color 0.2s ease;
        }
        .wolf-products-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
          gap: 20px;
          width: 100%;
        }
        @media (min-width: 640px) {
          .wolf-categories-container {
            gap: 14px;
            overflow-x: visible;
            flex-wrap: wrap;
          }
          .wolf-categories-btn {
            padding: 12px 22px;
            font-size: 15px;
          }
          .wolf-products-grid {
            gap: 24px;
          }
        }
      `}</style>

      <h2
        className="wolf-title"
        style={{
          fontSize: "clamp(26px, 5vw, 36px)",
          marginBottom: "24px",
          fontWeight: "800",
          margin: "0 0 20px 0"
        }}
      >
        Menú Digital
      </h2>

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

      {/* GRILLA FLEXIBLE DE TARJETAS DE PRODUCTOS */}
      <div className="wolf-products-grid">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{
              y: -6,
              scale: 1.01,
            }}
            className="glass-card wolf-shadow"
            style={{
              overflow: "hidden",
              borderRadius: "24px",
              background: "rgba(255,255,255,.03)",
              border: "1px solid rgba(255,255,255,.06)",
              display: "flex",
              flexDirection: "column",
              boxSizing: "border-box",
              width: "100%"
            }}
          >
            <div style={{ width: "100%", height: "180px", position: "relative", background: "#1a1a1a" }}>
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
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                justifyContent: "between"
              }}
            >
              <div style={{ flexGrow: 1 }}>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "18px",
                    fontWeight: "700",
                    marginBottom: "8px",
                    marginTop: 0,
                    lineHeight: "1.3"
                  }}
                >
                  {product.name}
                </h3>

                <p
                  style={{
                    color: "#f97316",
                    fontWeight: "800",
                    fontSize: "18px",
                    margin: "0 0 16px 0"
                  }}
                >
                  $
                  {getFinalPrice(
                    product.price,
                    getCommissionConfig(restaurant)
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
                  padding: "12px",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "14px",
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