"use client";

import { useEffect, useState } from "react";
import { ImageOff, X } from "lucide-react";

interface Props {
  imageUrl: string | null;
  alt: string;
  open: boolean;
  onClose: () => void;
  primaryColor?: string;
}

export default function ProductImageLightbox({
  imageUrl,
  alt,
  open,
  onClose,
  primaryColor = "#f97316",
}: Props) {
  const [imageError, setImageError] = useState(false);

  useEffect(() => {
    setImageError(false);
  }, [imageUrl, open]);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Imagen ampliada de ${alt}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 1200,
        display: "grid",
        placeItems: "center",
        padding: 18,
        background: "rgba(0,0,0,.88)",
        backdropFilter: "blur(12px)",
      }}
    >
      <div
        style={{
          position: "relative",
          width: "min(96vw, 900px)",
          height: "min(88dvh, 760px)",
          display: "grid",
          placeItems: "center",
        }}
      >
        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={alt}
            onError={() => setImageError(true)}
            style={{
              maxWidth: "100%",
              maxHeight: "100%",
              objectFit: "contain",
              borderRadius: 18,
              boxShadow: `0 30px 100px ${primaryColor}22, 0 30px 100px rgba(0,0,0,.75)`,
              display: "block",
            }}
          />
        ) : (
          <div
            style={{
              width: "min(420px, 82vw)",
              aspectRatio: "4 / 3",
              borderRadius: 18,
              display: "grid",
              placeItems: "center",
              background: "#141414",
              border: "1px solid rgba(255,255,255,.10)",
              color: "rgba(255,255,255,.45)",
            }}
          >
            <ImageOff size={44} />
          </div>
        )}

        <button
          type="button"
          onClick={onClose}
          aria-label="Cerrar imagen"
          style={{
            position: "absolute",
            top: 4,
            right: 4,
            width: 44,
            height: 44,
            borderRadius: 999,
            display: "grid",
            placeItems: "center",
            border: "1px solid rgba(255,255,255,.14)",
            background: "rgba(20,20,20,.82)",
            color: "#fff",
            cursor: "pointer",
          }}
        >
          <X size={20} />
        </button>
      </div>
    </div>
  );
}
