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
    ? products.filter((p) => p.category === selectedCategory)
    : products;

  return (
    <section className="max-w-md md:max-w-4xl mx-auto p-4 py-12">
      <h2 className="text-3xl font-bold mb-8 wolf-title">Menú Digital</h2>

      {/* Botones de Categorías */}
      <div className="flex gap-3 mb-8 flex-wrap">
        {categories.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-5 py-2.5 rounded-full transition-all duration-300 font-medium ${
              selectedCategory === category
                ? "bg-[#f97316] text-white"
                : "bg-white/5 text-white/70 hover:bg-white/10"
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      {/* Grid de Productos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <motion.div
            key={product.id}
            whileHover={{ y: -5 }}
            className="premium-card flex flex-col overflow-hidden"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-5 flex flex-col flex-grow">
              <h3 className="text-xl font-bold text-white mb-2">{product.name}</h3>
              <p className="text-[#f97316] font-bold text-xl mb-4">
                ${getDisplayPrice(product.price, restaurant).toFixed(2)}
              </p>

              <button
                onClick={() => addToCart(product)}
                className="wolf-button w-full mt-auto py-3 rounded-xl font-bold"
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