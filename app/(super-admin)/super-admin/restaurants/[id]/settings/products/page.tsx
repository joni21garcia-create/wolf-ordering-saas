"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";

import {
  useParams,
} from "next/navigation";

import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function ProductsPage() {
  const params =
    useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [products, setProducts] =
    useState<any[]>([]);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts =
    async () => {
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
          restaurantId
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (error) {
        console.error(error);
      }

      setProducts(
        data || []
      );

      setLoading(false);
    };

  const deleteProduct =
    async (
      productId: string
    ) => {
      const confirmDelete =
        confirm(
          "¿Eliminar producto?"
        );

      if (!confirmDelete)
        return;

      const { error } =
        await supabase
          .from("products")
          .delete()
          .eq(
            "id",
            productId
          );

      if (error) {
        alert(
          "Error eliminando producto"
        );
        return;
      }

      loadProducts();
    };


    const toggleProductVisibility =
  async (
    productId: string,
    currentValue: boolean
  ) => {
    const { error } =
      await supabase
        .from("products")
        .update({
          available:
            !currentValue,
        })
        .eq(
          "id",
          productId
        );

    if (error) {
      alert(
        "Error actualizando producto"
      );
      return;
    }

    loadProducts();
  };

const statCard = {
  background:
    "rgba(17,17,17,.95)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "22px",
  padding: "24px",
  textAlign: "center" as const,
};

return (
  <PermissionGuard permission="products">
    <div style={{
      maxWidth: "1400px",
      margin: "0 auto",
      padding: "40px",
      color: "#fff",
    }}>
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom:
            "35px",
        }}
      >
        <div>
          <p
            style={{
              color: "#777",
              marginBottom: "8px",
            }}
          >

            <BackToSettings
  restaurantId={restaurantId}
/>
            Configuración /
            Productos
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "42px",
              fontWeight: "800",
            }}
          >
            Productos
          </h1>
        </div>

        <Link
          href={`/super-admin/restaurants/${restaurantId}/settings/products/new`}
        >
          <button
            style={{
              background:
                "#f97316",
              border: "none",
              color: "#fff",
              padding:
                "16px 24px",
              borderRadius:
                "16px",
              cursor:
                "pointer",
              fontWeight:
                "700",
              fontSize:
                "15px",
              boxShadow:
                "0 15px 40px rgba(249,115,22,.35)",
            }}
          >
            + Nuevo Producto
          </button>
        </Link>
        </div>

      {/* ESTADÍSTICAS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom:
            "35px",
        }}
      >
        <div style={statCard}>
          <h2>
            {products.length}
          </h2>
          <p>
            Productos Totales
          </p>
        </div>

        <div style={statCard}>
          <h2>
            {
              products.filter(
                (p) =>
                  p.available
              ).length
            }
          </h2>
          <p>
            Disponibles
          </p>
        </div>

        <div style={statCard}>
          <h2>
            {
              products.filter(
                (p) =>
                  !p.available
              ).length
            }
          </h2>
          <p>
            Ocultos
          </p>
        </div>
      </div>

      {loading && (
        <p
          style={{
            color: "#aaa",
          }}
        >
          Cargando...
        </p>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(380px,1fr))",
          gap: "25px",
        }}
      >
        {products.map(
          (
            product
          ) => (
            <div
              key={
                product.id
              }
              style={{
                background:
                  "rgba(17,17,17,.95)",
                border:
                  "1px solid rgba(255,255,255,.08)",
                borderRadius:
                  "24px",
                overflow:
                  "hidden",
                backdropFilter:
                  "blur(20px)",
              }}
            >
              {/* IMAGEN */}

              {product.image_url && (
                <img
                  src={
                    product.image_url
                  }
                  alt={
                    product.name
                  }
                  style={{
                    width:
                      "100%",
                    height:
                      "220px",
                    objectFit:
                      "cover",
                  }}
                />
              )}

              <div
                style={{
                  padding:
                    "24px",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    marginBottom:
                      "15px",
                  }}
                >
                  <span
                    style={{
                      background:
                        "#f9731620",
                      color:
                        "#f97316",
                      padding:
                        "8px 14px",
                      borderRadius:
                        "999px",
                      fontSize:
                        "12px",
                      fontWeight:
                        "700",
                    }}
                  >
                    {
                      product
                        .categories
                        ?.name
                    }
                  </span>

                  <span
                    style={{
                      background:
                        product.available
                          ? "#22c55e20"
                          : "#ef444420",

                      color:
                        product.available
                          ? "#22c55e"
                          : "#ef4444",

                      padding:
                        "8px 14px",

                      borderRadius:
                        "999px",

                      fontSize:
                        "12px",

                      fontWeight:
                        "700",
                    }}
                  >
                    {product.available
                      ? "Disponible"
                      : "Oculto"}
                  </span>
                </div>

                <h2
                  style={{
                    marginTop: 0,
                    marginBottom:
                      "10px",
                  }}
                >
                  {
                    product.name
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#888",
                    minHeight:
                      "40px",
                  }}
                >
                  {
                    product.description
                  }
                </p>

                <div
                  style={{
                    fontSize:
                      "34px",
                    fontWeight:
                      "800",
                    color:
                      "#f97316",
                    marginTop:
                      "15px",
                  }}
                >
                  $
                  {Number(
                    product.price
                  ).toFixed(2)}
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "12px",
                    marginTop:
                      "25px",
                  }}
                >
                  <Link
                    href={`/super-admin/restaurants/${restaurantId}/settings/products/${product.id}/edit`}
                    style={{
                      flex: 1,
                    }}
                  >
                    <button
                      style={{
                        width: "100%",
                        padding: "14px",
                        border: "none",
                        borderRadius: "14px",
                        cursor: "pointer",
                        background: "#f97316",
                        color: "#fff",
                        fontWeight: "700",
                      }}
                    >
                      Editar
                    </button>
                  </Link>

                  <button
                    onClick={() =>
                      toggleProductVisibility(
                        product.id,
                        product.available
                      )
                    }
                    style={{
                      flex: 1,
                      padding: "14px",
                      border: "none",
                      borderRadius: "14px",
                      cursor: "pointer",
                      background: product.available
                        ? "rgba(234,179,8,.15)"
                        : "rgba(34,197,94,.15)",
                      color: product.available
                        ? "#eab308"
                        : "#22c55e",
                      fontWeight: "700",
                    }}
                  >
                    {product.available ? "Ocultar" : "Mostrar"}
                  </button>

                  <button
                    onClick={() => deleteProduct(product.id)}
                    style={{
                      flex: 1,
                      padding: "14px",
                      border: "none",
                      borderRadius: "14px",
                      cursor: "pointer",
                      background: "rgba(239,68,68,.15)",
                      color: "#ef4444",
                      fontWeight: "700",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
     </div>
  </PermissionGuard>
);
}