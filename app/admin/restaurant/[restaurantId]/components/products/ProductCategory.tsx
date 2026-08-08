"use client";

import { useState } from "react";

import ProductRow from "./ProductRow";
import type {
  RestaurantProduct,
} from "./ProductsPanel";

interface ProductCategoryProps {
  name: string;
  products: RestaurantProduct[];
  onToggleAvailability: (
    productId: string,
    currentAvailable: boolean
  ) => void;
}

export default function ProductCategory({
  name,
  products,
  onToggleAvailability,
}: ProductCategoryProps) {
  const [open, setOpen] =
    useState(false);

  return (
    <section
      style={{
        width: "100%",
        marginBottom: "7px",
        borderRadius: "13px",
        overflow: "hidden",
        background: "#121212",
        border:
          "1px solid rgba(255,255,255,.06)",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          CABECERA
          ===================================================== */}

      <button
        type="button"
        onClick={() =>
          setOpen(
            (current) => !current
          )
        }
        aria-expanded={open}
        style={{
          width: "100%",
          minHeight: "62px",
          padding: "10px 12px",
          display: "flex",
          alignItems: "center",
          justifyContent:
            "space-between",
          gap: "10px",
          border: "none",
          background:
            "transparent",
          color: "#FFFFFF",
          cursor: "pointer",
          textAlign: "left",
          WebkitTapHighlightColor:
            "transparent",
        }}
      >
        {/* NOMBRE Y CANTIDAD */}

        <div
          style={{
            flex: 1,
            minWidth: 0,
          }}
        >
          <div
            style={{
              fontSize: "14px",
              fontWeight: 750,
              lineHeight: 1.2,
              overflow: "hidden",
              textOverflow:
                "ellipsis",
              whiteSpace:
                "nowrap",
            }}
          >
            {name}
          </div>

          <div
            style={{
              marginTop: "4px",
              color: "#71717A",
              fontSize: "11px",
              lineHeight: 1,
            }}
          >
            {products.length}{" "}
            {products.length === 1
              ? "producto"
              : "productos"}
          </div>
        </div>

        {/* CHEVRON */}

        <span
          aria-hidden="true"
          style={{
            width: "28px",
            height: "28px",
            flexShrink: 0,
            display: "inline-flex",
            alignItems: "center",
            justifyContent:
              "center",
            borderRadius: "8px",
            background: open
              ? "rgba(249,115,22,.10)"
              : "rgba(255,255,255,.03)",
            color: open
              ? "#F97316"
              : "#71717A",
            fontSize: "17px",
            transform: open
              ? "rotate(180deg)"
              : "rotate(0deg)",
            transition:
              "all 260ms cubic-bezier(.22,.61,.36,1)",
          }}
        >
          ↓
        </span>
      </button>

      {/* =====================================================
          CONTENIDO
          ===================================================== */}

      <div
        style={{
          maxHeight: open
            ? "2000px"
            : "0px",
          opacity: open ? 1 : 0,
          transform: open
            ? "translateY(0)"
            : "translateY(-8px)",
          overflow: "hidden",
          transition: `
            max-height 520ms cubic-bezier(.34,1.56,.64,1),
            opacity 260ms cubic-bezier(.22,.61,.36,1),
            transform 260ms cubic-bezier(.22,.61,.36,1)
          `,
          willChange:
            "max-height, opacity, transform",
        }}
      >
        <div
          style={{
            padding:
              "0 8px 7px",
          }}
        >
          {products.map(
            (product) => (
              <ProductRow
                key={product.id}
                product={product}
                onToggleAvailability={
                  onToggleAvailability
                }
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}