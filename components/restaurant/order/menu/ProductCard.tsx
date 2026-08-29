"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ShoppingCart, Utensils, ZoomIn } from "lucide-react";
import {
  productCard,
  productImage,
  productContent,
  price,
  button,
} from "./menu.styles";

import type { Product } from "../types";
import ProductImageLightbox from "./ProductImageLightbox";

interface Props {
  product: Product;
  finalPrice: number;
  primaryColor?: string;
  onAdd: () => void;
  onOpen: (product: Product) => void;
}

export default function ProductCard({
  product,
  finalPrice,
  primaryColor = "#f97316",
  onAdd,
  onOpen,
}: Props) {
  const [imageError, setImageError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);
  const imageUrl = product.image_url || product.image || null;
  const canShowImage = Boolean(imageUrl) && !imageError;

  return (
    <>
      <motion.div
        whileHover={{ y: -3, scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={() => onOpen(product)}
        style={productCard(primaryColor)}
      >
        <div
          style={{
            position: "relative",
            ...productImage,
            background: "rgba(255,255,255,.06)",
            cursor: canShowImage ? "zoom-in" : "default",
          }}
          onClick={(event) => {
            if (!canShowImage) return;
            event.stopPropagation();
            setZoomOpen(true);
          }}
        >
          {canShowImage ? (
            <img
              src={imageUrl!}
              alt={product.name}
              onError={() => setImageError(true)}
              style={{ ...productImage, display: "block" }}
            />
          ) : (
            <div
              aria-label={`Sin imagen para ${product.name}`}
              style={{
                ...productImage,
                display: "grid",
                placeItems: "center",
                color: "rgba(255,255,255,.62)",
              }}
            >
              <Utensils size={34} strokeWidth={1.6} />
            </div>
          )}

          {canShowImage && (
            <span
              aria-hidden="true"
              style={{
                position: "absolute",
                right: 8,
                bottom: 8,
                width: 30,
                height: 30,
                borderRadius: 999,
                display: "grid",
                placeItems: "center",
                background: "rgba(0,0,0,.56)",
                border: "1px solid rgba(255,255,255,.16)",
                color: "#fff",
                backdropFilter: "blur(8px)",
              }}
            >
              <ZoomIn size={15} />
            </span>
          )}
        </div>

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

            <div style={price}>${finalPrice.toFixed(2)}</div>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              onAdd();
            }}
            style={{
              ...button,
              background: primaryColor,
              color: "#FFF",
              marginTop: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <ShoppingCart size={15} strokeWidth={2.2} />
            Añadir al carrito
          </motion.button>
        </div>
      </motion.div>

      <ProductImageLightbox
        imageUrl={canShowImage ? imageUrl : null}
        alt={product.name}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        primaryColor={primaryColor}
      />
    </>
  );
}
