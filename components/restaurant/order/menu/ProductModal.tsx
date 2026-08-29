"use client";

import { useEffect, useState } from "react";
import { ShoppingCart, Utensils, ZoomIn, X } from "lucide-react";
import type { Product } from "../types";
import ProductImageLightbox from "./ProductImageLightbox";

interface Props {
  product: Product | null;
  finalPrice: number;
  primaryColor: string;
  onClose: () => void;
  onAdd: () => void;
}

export default function ProductModal({
  product,
  finalPrice,
  primaryColor,
  onClose,
  onAdd,
}: Props) {
  const [imageError, setImageError] = useState(false);
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setImageError(false);
    setZoomOpen(false);
  }, [product?.id]);

  if (!product) return null;

  const imageUrl = product.image_url || product.image || null;
  const canShowImage = Boolean(imageUrl) && !imageError;

  return (
    <>
      <div
        onClick={onClose}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.76)",
          zIndex: 999,
          backdropFilter: "blur(4px)",
        }}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label={`Detalle de ${product.name}`}
        style={{
          position: "fixed",
          left: "50%",
          top: "50%",
          transform: "translate(-50%,-50%)",
          width: "92%",
          maxWidth: 420,
          maxHeight: "90dvh",
          overflowY: "auto",
          background: "#181818",
          border: "1px solid rgba(255,255,255,.08)",
          borderRadius: 20,
          overflow: "hidden",
          zIndex: 1000,
          boxShadow: "0 30px 90px rgba(0,0,0,.55)",
        }}
      >
        <div style={{ position: "relative", background: "rgba(255,255,255,.05)" }}>
          {canShowImage ? (
            <button
              type="button"
              onClick={() => setZoomOpen(true)}
              aria-label={`Ampliar foto de ${product.name}`}
              style={{
                display: "block",
                width: "100%",
                padding: 0,
                border: 0,
                background: "transparent",
                cursor: "zoom-in",
              }}
            >
              <img
                src={imageUrl!}
                alt={product.name}
                onError={() => setImageError(true)}
                style={{
                  width: "100%",
                  height: 250,
                  objectFit: "cover",
                  display: "block",
                }}
              />
              <span
                style={{
                  position: "absolute",
                  left: 14,
                  bottom: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  padding: "8px 10px",
                  borderRadius: 999,
                  background: "rgba(0,0,0,.58)",
                  color: "#fff",
                  fontSize: 12,
                  fontWeight: 700,
                  backdropFilter: "blur(8px)",
                }}
              >
                <ZoomIn size={14} />
                Ampliar foto
              </span>
            </button>
          ) : (
            <div
              style={{
                height: 180,
                display: "grid",
                placeItems: "center",
                color: "rgba(255,255,255,.72)",
              }}
            >
              <Utensils size={48} strokeWidth={1.4} />
            </div>
          )}

          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar detalle"
            style={{
              position: "absolute",
              top: 12,
              right: 12,
              width: 40,
              height: 40,
              borderRadius: 999,
              border: "1px solid rgba(255,255,255,.16)",
              background: "rgba(0,0,0,.56)",
              color: "#fff",
              display: "grid",
              placeItems: "center",
              cursor: "pointer",
              backdropFilter: "blur(8px)",
            }}
          >
            <X size={18} />
          </button>
        </div>

        <div style={{ padding: 20 }}>
          <h2 style={{ color: "#fff", margin: "0 0 10px" }}>{product.name}</h2>

          <p style={{ color: "#ccc", lineHeight: 1.6, margin: 0 }}>
            {product.description}
          </p>

          <h3 style={{ color: primaryColor, marginTop: 20, marginBottom: 0 }}>
            ${finalPrice.toFixed(2)}
          </h3>

          <button
            type="button"
            onClick={onAdd}
            style={{
              width: "100%",
              marginTop: 20,
              padding: 14,
              border: "none",
              borderRadius: 12,
              background: primaryColor,
              color: "#fff",
              cursor: "pointer",
              fontWeight: 700,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 8,
            }}
          >
            <ShoppingCart size={17} />
            Añadir al carrito
          </button>
        </div>
      </div>

      <ProductImageLightbox
        imageUrl={canShowImage ? imageUrl! : null}
        alt={product.name}
        open={zoomOpen}
        onClose={() => setZoomOpen(false)}
        primaryColor={primaryColor}
      />
    </>
  );
}