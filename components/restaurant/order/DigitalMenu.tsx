"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";

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
  addToCart: (product: Product) => void;
}

function getDisplayPrice(price: number, restaurant: any) {
  if (!restaurant?.commission_active) return price;
  const percentage = Number(restaurant.commission_percentage) || 0;
  if (restaurant.commission_type === "customer") {
    return price + (price * percentage) / 100;
  }
  return price;
}

export default function DigitalMenu({ restaurant, addToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`*, categories(name)`)
      .eq("restaurant_id", restaurant?.id)
      .eq("available", true);

    if (error) {
      console.error("Error cargando productos:", error);
      return;
    }

    const formattedProducts = (data || []).map((product: any) => ({
      id: product.id,
      restaurant_id: product.restaurant_id,
      name: product.name,
      price: Number(product.price) || 0,
      image: product.image_url || "/placeholder-product.jpg",
      category: product.categories?.name || "Disponibles",
    }));

    setProducts(formattedProducts);
    const uniqueCategories = [...new Set(formattedProducts.map((p) => p.category))];
    setCategories(uniqueCategories);

    if (uniqueCategories.length > 0) {
      setSelectedCategory(uniqueCategories[0]);
    }
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <section style={{ marginTop: "30px", width: "100%" }}>
      <h2 className="wolf-title" style={{ fontSize: "28px", marginBottom: "20px" }}>
        Menú Digital
      </h2>

      {/* Categorías: Scroll horizontal para móviles */}
      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "25px",
          overflowX: "auto",
          paddingBottom: "10px",
          WebkitOverflowScrolling: "touch",
          scrollbarWidth: "none", // Oculta scrollbar en Firefox
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: "10px 20px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: selectedCategory === category ? "#f97316" : "#111",
              color: "#fff",
              transition: ".3s",
              fontWeight: "500",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid: Ajuste inteligente sin romper en pantallas pequeñas */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileTap={{ scale: 0.98 }}
            className="glass-card wolf-shadow"
            style={{ overflow: "hidden", borderRadius: "16px" }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "100%",
                height: "180px",
                objectFit: "cover",
              }}
            />

            <div style={{ padding: "20px" }}>
              <h3
                style={{
                  color: "#fff",
                  fontSize: "18px",
                  fontWeight: "700",
                  marginBottom: "8px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap"
                }}
              >
                {product.name}
              </h3>

              <p
                style={{
                  color: "#f97316",
                  fontWeight: "bold",
                  fontSize: "20px",
                  margin: "0 0 15px 0",
                }}
              >
                ${getDisplayPrice(product.price, restaurant).toFixed(2)}
              </p>

              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => addToCart(product)}
                className="wolf-button"
                style={{
                  width: "100%",
                  padding: "12px",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "700",
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