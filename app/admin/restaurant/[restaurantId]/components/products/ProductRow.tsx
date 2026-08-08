"use client";

import type { CSSProperties } from "react";

import type {
  RestaurantProduct,
} from "./ProductsPanel";

interface ProductRowProps {
  product: RestaurantProduct;
  onToggleAvailability: (
    productId: string,
    currentAvailable: boolean
  ) => void;
}

export default function ProductRow({
  product,
  onToggleAvailability,
}: ProductRowProps) {
  /*
   * IMPORTANTE:
   * ProductsPanel calcula display_price usando
   * la configuración real de comisión.
   *
   * Si existe display_price, usamos ese valor.
   * Solo usamos product.price como respaldo.
   */
  const displayPrice =
    product.display_price ??
    Number(product.price);

  const formattedPrice =
    Number(displayPrice).toFixed(2);

  const available =
    product.available;

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 9,
        minHeight: 56,
        padding: "7px 4px",
        borderTop:
          "1px solid rgba(255,255,255,.05)",
        boxSizing: "border-box",
      }}
    >
      {/* =====================================================
          IMAGEN
          ===================================================== */}

      <div
        style={{
          width: 34,
          height: 34,
          flexShrink: 0,
          overflow: "hidden",
          borderRadius: 7,
          background: "#1A1A1A",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          border:
            "1px solid rgba(255,255,255,.04)",
        }}
      >
        {product.image_url ? (
          <img
            src={product.image_url}
            alt=""
            width={34}
            height={34}
            loading="lazy"
            style={{
              width: 34,
              height: 34,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : (
          <span
            aria-hidden="true"
            style={{
              color: "#52525B",
              fontSize: 13,
            }}
          >
            🍽
          </span>
        )}
      </div>

      {/* =====================================================
          INFORMACIÓN
          ===================================================== */}

      <div
        style={{
          flex: 1,
          minWidth: 0,
        }}
      >
        <div
          style={{
            color: available
              ? "#FFFFFF"
              : "#71717A",
            fontSize: 13,
            fontWeight: 650,
            lineHeight: 1.2,
            overflow: "hidden",
            textOverflow:
              "ellipsis",
            whiteSpace:
              "nowrap",
            transition:
              "color 180ms cubic-bezier(.16,.84,.44,1)",
          }}
        >
          {product.name}
        </div>

        <div
          style={{
            marginTop: 3,
            color: "#F97316",
            fontSize: 11,
            fontWeight: 750,
            lineHeight: 1,
          }}
        >
          ${formattedPrice}
        </div>
      </div>

      {/* =====================================================
          ESTADO + SWITCH
          ===================================================== */}

      <div
        style={{
          flexShrink: 0,
          display: "flex",
          alignItems: "center",
          gap: 7,
        }}
      >
        <span
          style={{
            color: available
              ? "#22C55E"
              : "#71717A",
            fontSize: 10,
            fontWeight: 650,
            whiteSpace:
              "nowrap",
            transition:
              "color 180ms cubic-bezier(.16,.84,.44,1)",
          }}
        >
          {available
            ? "Disponible"
            : "No disponible"}
        </span>

        <AvailabilitySwitch
          checked={available}
          productName={
            product.name
          }
          onChange={() =>
            onToggleAvailability(
              product.id,
              available
            )
          }
        />
      </div>
    </div>
  );
}

/* =========================================================
   SWITCH DE DISPONIBILIDAD
   ========================================================= */

interface AvailabilitySwitchProps {
  checked: boolean;
  productName: string;
  onChange: () => void;
}

function AvailabilitySwitch({
  checked,
  productName,
  onChange,
}: AvailabilitySwitchProps) {
  const trackStyle: CSSProperties = {
    position: "relative",
    width: 40,
    height: 23,
    flexShrink: 0,
    padding: 0,
    border: "none",
    borderRadius: 999,
    background: checked
      ? "#F97316"
      : "#3F3F46",
    cursor: "pointer",
    WebkitTapHighlightColor:
      "transparent",
    transition:
      "all 180ms cubic-bezier(.16,.84,.44,1)",
    boxShadow: checked
      ? "0 0 18px rgba(249,115,22,.18)"
      : "none",
  };

  const thumbStyle: CSSProperties = {
    position: "absolute",
    top: 3,
    left: checked
      ? 20
      : 3,
    width: 17,
    height: 17,
    borderRadius: "50%",
    background: "#FFFFFF",
    boxShadow:
      "0 2px 5px rgba(0,0,0,.35)",
    transition:
      "left 180ms cubic-bezier(.16,.84,.44,1)",
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={
        checked
          ? `Desactivar ${productName}`
          : `Activar ${productName}`
      }
      onClick={onChange}
      style={trackStyle}
    >
      <span
        aria-hidden="true"
        style={thumbStyle}
      />
    </button>
  );
}