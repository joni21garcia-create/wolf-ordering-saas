"use client";

import { motion } from "framer-motion";
import {
  productCard,
  productImage,
  productContent,
  price,
  button,
} from "./menu.styles";

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
  product: Product;
  finalPrice: number;
  primaryColor?: string;
  onAdd: () => void;

  onOpen: (
    product: Product
  ) => void;
}

export default function ProductCard({
  product,
  finalPrice,
  primaryColor = "#f97316",
  onAdd,
  onOpen,
}: Props) {
  return (
    <motion.div
      whileHover={{
        y: -3,
        scale: 1.01,
      }}
      whileTap={{
        scale: 0.99,
      }}
      onClick={() => onOpen(product)}
      style={productCard(primaryColor)}
    >
      <img
        src={product.image}
        alt={product.name}
        style={productImage}
      />

      <div style={productContent}>
        <div>
          <h3
            style={{
              color: "#FFF",
              fontSize: "16px",
              fontWeight: 700,
              margin: 0,
              marginBottom: "6px",
              display: "-webkit-box",
              WebkitLineClamp: 1,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.name}
          </h3>

          <p
            style={{
              color: "rgba(255,255,255,.65)",
              fontSize: "13px",
              lineHeight: 1.4,
              margin: 0,
              marginBottom: "12px",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: "36px",
            }}
          >
            {product.description}
          </p>

          <div style={price}>
            ${finalPrice.toFixed(2)}
          </div>
        </div>

        <motion.button
          whileTap={{
            scale: 0.97,
          }}
          onClick={(e) => {
            e.stopPropagation();
            onAdd();
          }}
          style={{
            ...button,
            background: primaryColor,
            color: "#FFF",
            marginTop: "16px",
          }}
        >
          Agregar
        </motion.button>
      </div>
    </motion.div>
  );
}