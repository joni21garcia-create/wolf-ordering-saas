"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import { CheckCheck, EyeOff, Loader2 } from "lucide-react";

import { supabase } from "@/lib/supabase/client";

import {
  getCommissionConfig,
  getFinalPrice,
} from "@/lib/configuration/pricing";

import ProductCategory from "./ProductCategory";

interface ProductsPanelProps {
  restaurantId: string;
}

export interface RestaurantCategory {
  id: string;
  name: string;
  sort_order: number | null;
  active: boolean | null;
}

export interface RestaurantProduct {
  id: string;
  restaurant_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  image_url: string | null;
  price: string | number;
  available: boolean;

  /**
   * Precio final que debe mostrarse
   * en esta pantalla después de aplicar
   * la configuración de comisión.
   */
  display_price?: number;
}

export default function ProductsPanel({
  restaurantId,
}: ProductsPanelProps) {
  const [categories, setCategories] =
    useState<RestaurantCategory[]>([]);

  const [products, setProducts] =
    useState<RestaurantProduct[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  useEffect(() => {
    if (!restaurantId) {
      return;
    }

    loadProducts();
  }, [restaurantId]);

  async function loadProducts() {
    setLoading(true);
    setError(null);

    /*
     * Cargamos en paralelo:
     *
     * 1. Categorías
     * 2. Productos
     * 3. Configuración de comisión
     */
    const [
      categoryResult,
      productResult,
      restaurantResult,
    ] = await Promise.all([
      supabase
        .from("categories")
        .select(
          "id, name, sort_order, active"
        )
        .eq(
          "restaurant_id",
          restaurantId
        )
        .order("sort_order", {
          ascending: true,
        }),

      supabase
        .from("products")
        .select(
          "id, restaurant_id, category_id, name, description, image_url, price, available"
        )
        .eq(
          "restaurant_id",
          restaurantId
        )
        .order("created_at", {
          ascending: false,
        }),

      supabase
        .from("restaurants")
        .select(
          "commission_active, commission_type, commission_percentage"
        )
        .eq(
          "id",
          restaurantId
        )
        .maybeSingle(),
    ]);

    if (
      categoryResult.error ||
      productResult.error ||
      restaurantResult.error
    ) {
      console.error(
        "Error cargando configuración de productos:",
        {
          categoryError:
            categoryResult.error,

          productError:
            productResult.error,

          restaurantError:
            restaurantResult.error,
        }
      );

      setError(
        "No se pudieron cargar los productos."
      );

      setLoading(false);
      return;
    }

    /*
     * Usamos exactamente la configuración
     * de comisión definida por el restaurante.
     *
     * No usamos defaultSettings directamente.
     */
    const commissionConfig =
      getCommissionConfig(
        restaurantResult.data
      );

    /*
     * El precio visible se calcula mediante
     * la función oficial de pricing.
     *
     * No duplicamos la fórmula aquí.
     */
    const productsWithDisplayPrice =
      (
        productResult.data ?? []
      ).map((product) => {
        const basePrice =
          Number(product.price) || 0;

        const displayPrice =
          getFinalPrice(
            basePrice,
            commissionConfig
          );

        return {
          ...product,
          display_price:
            displayPrice,
        };
      });

    setCategories(
      categoryResult.data ?? []
    );

    setProducts(
      productsWithDisplayPrice
    );

    setLoading(false);
  }

  const [bulkUpdating, setBulkUpdating] = useState(false);

  async function setAllAvailability(available: boolean) {
    if (bulkUpdating || products.length === 0) return;

    setBulkUpdating(true);
    const previousProducts = products;

    setProducts((current) =>
      current.map((product) => ({
        ...product,
        available,
      }))
    );

    const { error: updateError } = await supabase
      .from("products")
      .update({ available })
      .eq("restaurant_id", restaurantId);

    if (updateError) {
      console.error("Error actualizando disponibilidad masiva:", updateError);
      setProducts(previousProducts);
      setError("No se pudo actualizar la disponibilidad de todos los productos.");
    }

    setBulkUpdating(false);
  }

  async function toggleAvailability(
    productId: string,
    currentAvailable: boolean
  ) {
    const nextAvailable =
      !currentAvailable;

    /*
     * Cambio inmediato en UI.
     */
    setProducts((current) =>
      current.map((product) =>
        product.id === productId
          ? {
              ...product,
              available:
                nextAvailable,
            }
          : product
      )
    );

    /*
     * Solo modificamos `available`.
     *
     * No tocamos:
     * - price
     * - name
     * - image_url
     * - category_id
     */
    const {
      error: updateError,
    } = await supabase
      .from("products")
      .update({
        available:
          nextAvailable,
      })
      .eq(
        "id",
        productId
      )
      .eq(
        "restaurant_id",
        restaurantId
      );

    if (updateError) {
      console.error(
        "Error actualizando disponibilidad:",
        updateError
      );

      /*
       * Si Supabase falla,
       * recuperamos el estado real.
       */
      await loadProducts();
    }
  }

  const normalizedSearch =
    search
      .trim()
      .toLowerCase();

  const filteredProducts =
    useMemo(() => {
      if (!normalizedSearch) {
        return products;
      }

      return products.filter(
        (product) =>
          product.name
            .toLowerCase()
            .includes(
              normalizedSearch
            )
      );
    }, [
      products,
      normalizedSearch,
    ]);

  const productsByCategory =
    (categoryId: string) =>
      filteredProducts.filter(
        (product) =>
          product.category_id ===
          categoryId
      );

  const uncategorizedProducts =
    filteredProducts.filter(
      (product) =>
        !product.category_id
    );

  if (loading) {
    return (
      <PanelMessage>
        Cargando productos...
      </PanelMessage>
    );
  }

  if (error) {
    return (
      <PanelMessage error>
        {error}
      </PanelMessage>
    );
  }

  return (
    <section
      style={{
        width: "100%",
        boxSizing:
          "border-box",
      }}
    >
      {/* =====================================================
          BUSCADOR
          ===================================================== */}

      <div
        style={{
          position:
            "relative",
          width: "100%",
          marginBottom:
            "12px",
        }}
      >
        <span
          aria-hidden="true"
          style={{
            position:
              "absolute",
            left: "13px",
            top: "50%",
            transform:
              "translateY(-50%)",
            color: "#71717A",
            fontSize: "14px",
            pointerEvents:
              "none",
          }}
        >
          ⌕
        </span>

        <input
          type="search"
          value={search}
          onChange={(event) =>
            setSearch(
              event.target.value
            )
          }
          placeholder="Buscar producto..."
          aria-label="Buscar producto"
          style={{
            width: "100%",
            height: "42px",
            boxSizing:
              "border-box",
            padding:
              "0 13px 0 36px",
            border:
              "1px solid rgba(255,255,255,.07)",
            borderRadius:
              "11px",
            outline: "none",
            background:
              "#111111",
            color:
              "#FFFFFF",
            fontSize:
              "13px",
            WebkitAppearance:
              "none",
          }}
        />
      </div>

      {/* =====================================================
          DISPONIBILIDAD GLOBAL
          ===================================================== */}

      <div
        style={{
          display: "flex",
          gap: "8px",
          marginBottom: "12px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setAllAvailability(true)}
          disabled={bulkUpdating || products.length === 0}
          style={bulkActionStyle(true, bulkUpdating)}
        >
          {bulkUpdating ? (
            <Loader2 size={14} aria-hidden="true" />
          ) : (
            <CheckCheck size={14} aria-hidden="true" />
          )}
          Activar todos
        </button>

        <button
          type="button"
          onClick={() => setAllAvailability(false)}
          disabled={bulkUpdating || products.length === 0}
          style={bulkActionStyle(false, bulkUpdating)}
        >
          <EyeOff size={14} aria-hidden="true" />
          Desactivar todos
        </button>
      </div>

      {/* =====================================================
          CATEGORÍAS
          ===================================================== */}

      <div
        style={{
          width: "100%",
        }}
      >
        {categories.map(
          (category) => {
            const categoryProducts =
              productsByCategory(
                category.id
              );

            if (
              categoryProducts.length ===
              0
            ) {
              return null;
            }

            return (
              <ProductCategory
                key={category.id}
                name={category.name}
                products={
                  categoryProducts
                }
                onToggleAvailability={
                  toggleAvailability
                }
              />
            );
          }
        )}

        {/* =================================================
            PRODUCTOS SIN CATEGORÍA
            ================================================= */}

        {uncategorizedProducts.length >
          0 && (
          <ProductCategory
            name="Sin categoría"
            products={
              uncategorizedProducts
            }
            onToggleAvailability={
              toggleAvailability
            }
          />
        )}
      </div>

      {/* =====================================================
          SIN RESULTADOS
          ===================================================== */}

      {filteredProducts.length ===
        0 && (
        <PanelMessage>
          {normalizedSearch
            ? "No encontramos productos con esa búsqueda."
            : "No hay productos disponibles."}
        </PanelMessage>
      )}
    </section>
  );
}


function bulkActionStyle(
  active: boolean,
  disabled: boolean
): React.CSSProperties {
  return {
    minHeight: 40,
    padding: "0 13px",
    borderRadius: 10,
    border: active
      ? "1px solid rgba(34,197,94,.25)"
      : "1px solid rgba(255,255,255,.08)",
    background: active
      ? "rgba(34,197,94,.08)"
      : "rgba(255,255,255,.035)",
    color: active ? "#86EFAC" : "#A1A1AA",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 7,
    fontSize: 12,
    fontWeight: 700,
    cursor: disabled ? "not-allowed" : "pointer",
    opacity: disabled ? 0.55 : 1,
    WebkitTapHighlightColor: "transparent",
  };
}

/* =========================================================
   MENSAJE DEL PANEL
   ========================================================= */

interface PanelMessageProps {
  children: React.ReactNode;
  error?: boolean;
}

function PanelMessage({
  children,
  error = false,
}: PanelMessageProps) {
  return (
    <div
      style={{
        width: "100%",
        padding:
          "34px 12px",
        boxSizing:
          "border-box",
        textAlign:
          "center",
        color: error
          ? "#EF4444"
          : "#71717A",
        fontSize: "13px",
      }}
    >
      {children}
    </div>
  );
}