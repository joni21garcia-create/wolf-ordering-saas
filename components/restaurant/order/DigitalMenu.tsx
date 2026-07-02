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
    const handleResize = () => setIsMobile(window.innerWidth < 1024);
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
    <section>
      {/* Menú compacto: margen superior reducido */}
      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "20px",
          overflowX: "auto",
          paddingBottom: "5px",
        }}
      >
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            style={{
              padding: "6px 14px",
              borderRadius: "8px",
              border: "none",
              cursor: "pointer",
              whiteSpace: "nowrap",
              background: selectedCategory === category ? "#f97316" : "rgba(255,255,255,0.05)",
              color: "#fff",
              fontSize: "13px",
              fontWeight: 500,
            }}
          >
            {category}
          </button>
        ))}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill, minmax(200px, 1fr))",
          gap: "12px",
        }}
      >
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ scale: 1.01 }}
            className="glass-card"
            style={{ 
                overflow: "hidden", 
                borderRadius: "12px",
                display: "flex",
                flexDirection: "column"
            }}
          >
            <img
              src={product.image}
              alt={product.name}
              style={{ width: "100%", height: "120px", objectFit: "cover" }}
            />

            <div style={{ padding: "12px", flex: 1, display: "flex", flexDirection: "column" }}>
              <h3 style={{ fontSize: "14px", fontWeight: "600", marginBottom: "4px" }}>
                {product.name}
              </h3>
              <p style={{ color: "#f97316", fontWeight: "700", fontSize: "14px", marginBottom: "10px" }}>
                ${getFinalPrice(product.price, getCommissionConfig(restaurant)).toFixed(2)}
              </p>
              
              <button
                onClick={() => addToCart(product)}
                className="wolf-button"
                style={{
                  marginTop: "auto",
                  padding: "8px",
                  fontSize: "12px",
                  borderRadius: "8px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "700",
                }}
              >
                Agregar
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}