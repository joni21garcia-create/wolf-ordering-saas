"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { getFinalPrice, getCommissionConfig } from "@/lib/configuration/pricing";

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

export default function DigitalMenu({ restaurant, addToCart }: Props) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    loadProducts();
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from("products")
      .select(`*, categories(name)`)
      .eq("restaurant_id", restaurant.id)
      .eq("available", true);

    if (error) return;

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
    if (uniqueCategories.length > 0) setSelectedCategory(uniqueCategories[0]);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <section style={{ marginTop: "50px" }}>
      <h2 className="wolf-title" style={{ fontSize: isMobile ? "28px" : "36px", marginBottom: "30px" }}>
        Menú Digital
      </h2>

      <div
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: "30px",
          overflowX: "auto",
          paddingBottom: "10px",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: "10px 16px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: selectedCategory === category ? "#f97316" : "#111",
              color: "#fff",
              transition: ".3s",
              fontSize: "14px",
            }}
          >
            {category}
          </button>
        ))}
      </div>

      {/* AJUSTE: He cambiado el grid para que en desktop (dentro de la col de 2/3) 
          se vea bien en 2 columnas, aprovechando el espacio */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: isMobile ? 0 : -8, scale: isMobile ? 1 : 1.02 }}
            className="glass-card wolf-shadow"
            style={{ overflow: "hidden" }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "180px", objectFit: "cover" }}
            />

            <div style={{ padding: "20px" }}>
              <h3 style={{ color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "10px" }}>
                {product.name}
              </h3>
              <p style={{ color: "#f97316", fontWeight: "bold", fontSize: "16px" }}>
                ${getFinalPrice(product.price, getCommissionConfig(restaurant)).toFixed(2)}
              </p>
              <button
                onClick={() => addToCart(product)}
                className="wolf-button"
                style={{
                  width: "100%",
                  marginTop: "15px",
                  padding: "12px",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Agregar al carrito
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}