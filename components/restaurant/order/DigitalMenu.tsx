"use client";

import {
  useState,
  useEffect,
} from "react";

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

  addToCart: (
    product: Product
  ) => void;
}

function getDisplayPrice(
  price: number,
  restaurant: any
) {
  if (
    !restaurant?.commission_active
  ) {
    return price;
  }

  const percentage =
    Number(
      restaurant.commission_percentage
    ) || 0;

  if (
    restaurant.commission_type ===
    "customer"
  ) {
    return (
      price +
      (price * percentage) / 100
    );
  }

  return price;
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

console.log(
    "restaurant recibido:",
    restaurant
  );

 

console.log(
  "CONFIG COMISION:",
  {
    commission_mode:
      restaurant.commission_mode,

    commission_active:
      restaurant.commission_active,

    commission_type:
      restaurant.commission_type,

    commission_percentage:
      restaurant.commission_percentage,
  }
);

   const {
  data,
  error,
} = await supabase
  .from("products")
.select(`
  *,
  categories(name)
`)
  .eq(
    "restaurant_id",
    restaurant.id
  )
  .eq(
    "available",
    true
  );

      if (error) {
        console.error(
          "Error cargando productos:",
          error
        );
        return;
      }
const formattedProducts =
  (data || []).map(
    (product: any) => ({
      id: product.id,

      restaurant_id:
        product.restaurant_id,

      name: product.name,

      price:
        Number(
          product.price
        ) || 0,

      image:
        product.image_url ||
        "/placeholder-product.jpg",

     category:
  product.categories?.name ||
  "Disponibles",
    })
  );

      setProducts(
        formattedProducts
      );

      const uniqueCategories =
        [
          ...new Set(
            formattedProducts.map(
              (p) =>
                p.category
            )
          ),
        ];

      setCategories(
        uniqueCategories
      );

      if (
        uniqueCategories.length >
        0
      ) {
        setSelectedCategory(
          uniqueCategories[0]
        );
      }
    };

  const filteredProducts =
    selectedCategory
      ? products.filter(
          (product) =>
            product.category ===
            selectedCategory
        )
      : products;

  return (
    <section
      style={{
        marginTop: "50px",
      }}
    >
      <h2
        className="wolf-title"
        style={{
          fontSize: "36px",
          marginBottom: "30px",
        }}
      >
        Menú Digital
      </h2>

      <div
        style={{
          display: "flex",
          gap: "15px",
          marginBottom: "30px",
          flexWrap: "wrap",
        }}
      >
        {categories.map(
          (category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category
                )
              }
              style={{
                padding:
                  "12px 20px",
                borderRadius:
                  "999px",
                border: "none",
                cursor: "pointer",
                background:
                  selectedCategory ===
                  category
                    ? "#f97316"
                    : "#111",
                color: "#fff",
                transition:
                  ".3s",
              }}
            >
              {category}
            </button>
          )
        )}
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(300px,1fr))",
          gap: "20px",
        }}
      >
        {filteredProducts.map(
          (product) => (
            <motion.div
              key={product.id}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
              className="glass-card wolf-shadow"
              style={{
                overflow:
                  "hidden",
              }}
            >
              <img
                src={product.image}
                alt={product.name}
                style={{
                  width: "100%",
                  height:
                    "220px",
                  objectFit:
                    "cover",
                }}
              />

              <div
                style={{
                  padding:
                    "20px",
                }}
              >
                <h3
                  style={{
                    color:
                      "#fff",
                    fontSize:
                      "22px",
                    fontWeight:
                      "700",
                    marginBottom:
                      "10px",
                  }}
                >
                  {product.name}
                </h3>

               <p
  style={{
    color:
      "#f97316",
    fontWeight:
      "bold",
    fontSize:
      "20px",
  }}
>
  $
  {getDisplayPrice(
    product.price,
    restaurant
  ).toFixed(2)}
</p>

                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.95,
                  }}
                  onClick={() =>
                    addToCart(
                      product
                    )
                  }
                  className="wolf-button"
                  style={{
                    width:
                      "100%",
                    marginTop:
                      "15px",
                    padding:
                      "14px",
                    border:
                      "none",
                    borderRadius:
                      "12px",
                    cursor:
                      "pointer",
                    fontWeight:
                      "700",
                  }}
                >
                  Agregar al carrito
                </motion.button>
              </div>
            </motion.div>
          )
        )}
      </div>
    </section>
  );
}