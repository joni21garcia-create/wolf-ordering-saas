"use client";

import { useState } from "react";

import ProductCard from "./ProductCard";
import { section } from "./menu.styles";
import {
  getFinalPrice,
  type CommissionConfig,
} from "@/lib/configuration/pricing";


import type { Product } from "../types";

interface Props {
  title: string;
  products: Product[];

  commissionConfig: CommissionConfig;

  addToCart: (product: Product) => void;

  onOpen: (product: Product) => void;

  primaryColor?: string;

  sectionRef?: (
    element: HTMLDivElement | null
  ) => void;
}

export default function MenuSection({
  title,
  products,
  commissionConfig,
  addToCart,
  onOpen,
  primaryColor = "#f97316",
  sectionRef,
}: Props) {
  const [open, setOpen] =
    useState(false);

  return (
    <div
      ref={sectionRef}
      data-category={title}
      style={{ width: "100%" }}
    >
      <button
        onClick={() =>
          setOpen(!open)
        }
        style={{
          width: "100%",
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "center",
          background: "transparent",
          border: "none",
          color: "#fff",
          cursor: "pointer",
          padding: "12px 0",
        }}
      >
        <h2
          style={{
            ...section.title,
            margin: 0,
          }}
        >
          {title}
        </h2>

        <span
          style={{
            fontSize: 24,
            color: "#fff",
            transition: ".25s",
            transform: open
              ? "rotate(45deg)"
              : "rotate(0deg)",
          }}
        >
          +
        </span>
      </button>

      {open && (
        <div style={section.products}>
          {products.map(
            (product) => (
              <ProductCard
                key={product.id}
                product={product}
                primaryColor={
                  primaryColor
                }
                finalPrice={getFinalPrice(
                  product.price,
                  commissionConfig
                )}
                onAdd={() =>
                  addToCart(
                    product
                  )
                }
                onOpen={onOpen}
              />
            )
          )}
        </div>
      )}
    </div>
  );
}


