"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function RestaurantsPage() {
  const [restaurants, setRestaurants] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    loadRestaurants();
  }, []);

  const loadRestaurants =
    async () => {
      const { data } =
        await supabase
          .from("restaurants")
          .select("*")
          .order(
            "created_at",
            {
              ascending: false,
            }
          );

      setRestaurants(data || []);
      setLoading(false);
    };

  const deleteRestaurant =
    async (id: string) => {
      const confirmDelete =
        confirm(
          "¿Eliminar restaurante?"
        );

      if (!confirmDelete)
        return;

      const { error } =
        await supabase
          .from("restaurants")
          .delete()
          .eq("id", id);

      if (error) {
        alert(
          "Error eliminando restaurante"
        );
        return;
      }

      loadRestaurants();
    };

return (
  <PermissionGuard permission="restaurants">
    <main
      style={{
        maxWidth: "1500px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom: "35px",
        }}
      >
        <div>
          <p
            style={{
              color: "#777",
              marginBottom: "8px",
            }}
          >
            Wolf Ordering /
            Restaurantes
          </p>

          <h1
            style={{
              margin: 0,
              fontSize: "48px",
              fontWeight: "800",
            }}
          >
            Restaurantes
          </h1>
        </div>

        <Link
          href="/super-admin/restaurants/new"
        >
          <button
            style={{
              background:
                "#f97316",
              border: "none",
              color: "#fff",
              padding:
                "16px 28px",
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
            + Nuevo Restaurante
          </button>
        </Link>
      </div>

      {/* STATS */}

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
            {
              restaurants.length
            }
          </h2>

          <p>
            Restaurantes
          </p>
        </div>

        <div style={statCard}>
          <h2>
            {
              restaurants.filter(
                (r) =>
                  r.active
              ).length
            }
          </h2>

          <p>Activos</p>
        </div>

        <div style={statCard}>
          <h2>
            {
              restaurants.filter(
                (r) =>
                  !r.active
              ).length
            }
          </h2>

          <p>
            Inactivos
          </p>
        </div>
      </div>

      {loading && (
        <div
          style={{
            textAlign:
              "center",
            padding:
              "60px",
            color: "#999",
          }}
        >
          Cargando
          restaurantes...
        </div>
      )}

      {/* LISTADO */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(420px,1fr))",
          gap: "25px",
        }}
      >
        {restaurants.map(
          (
            restaurant
          ) => (
            <div
              key={
                restaurant.id
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
              {/* BANNER */}

              <div
                style={{
                  height:
                    "140px",
                  background:
                    restaurant.banner_url
                      ? `url(${restaurant.banner_url}) center/cover`
                      : "linear-gradient(135deg,#f97316,#ea580c)",
                }}
              />

              <div
                style={{
                  padding:
                    "24px",
                }}
              >
                {/* LOGO */}

                {restaurant.logo_url && (
                  <img
                    src={
                      restaurant.logo_url
                    }
                    alt={
                      restaurant.name
                    }
                    style={{
                      width:
                        "90px",
                      height:
                        "90px",
                      borderRadius:
                        "50%",
                      objectFit:
                        "cover",
                      marginTop:
                        "-70px",
                      border:
                        "4px solid #111",
                      background:
                        "#111",
                    }}
                  />
                )}

                <h2
                  style={{
                    marginTop:
                      "15px",
                    marginBottom:
                      "8px",
                  }}
                >
                  {
                    restaurant.name
                  }
                </h2>

                <p
                  style={{
                    color:
                      "#888",
                    marginBottom:
                      "15px",
                  }}
                >
                  /
                  {
                    restaurant.slug
                  }
                </p>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "10px",
                    marginBottom:
                      "20px",
                  }}
                >
                  <span
                    style={{
                      background:
                        restaurant.active
                          ? "#22c55e20"
                          : "#ef444420",

                      color:
                        restaurant.active
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
                    {restaurant.active
                      ? "Activo"
                      : "Inactivo"}
                  </span>
                </div>

                <div
                  style={{
                    display:
                      "grid",
                    gap: "10px",
                  }}
                >
                  <Link
                    href={`/super-admin/restaurants/${restaurant.id}/edit`}
                  >
                    <button
                      style={
                        primaryButton
                      }
                    >
                      Editar
                    </button>
                  </Link>

                  <Link
                    href={`/super-admin/restaurants/${restaurant.id}/settings`}
                  >
                    <button
                      style={
                        secondaryButton
                      }
                    >
                      Configuración
                    </button>
                  </Link>

                  <button
                    onClick={() =>
                      deleteRestaurant(
                        restaurant.id
                      )
                    }
                    style={
                      deleteButton
                    }
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </main>
  </PermissionGuard>
  );
}

const statCard = {
  background:
    "rgba(17,17,17,.95)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "22px",
  padding: "24px",
  textAlign:
    "center" as const,
};

const primaryButton = {
  width: "100%",
  padding: "14px",
  border: "none",
  borderRadius: "14px",
  background: "#f97316",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
};

const secondaryButton = {
  width: "100%",
  padding: "14px",
  border:
    "1px solid rgba(255,255,255,.1)",
  borderRadius: "14px",
  background:
    "rgba(255,255,255,.03)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: "700",
};

const deleteButton = {
  width: "100%",
  padding: "14px",
  border:
    "1px solid rgba(239,68,68,.2)",
  borderRadius: "14px",
  background:
    "rgba(239,68,68,.15)",
  color: "#ef4444",
  cursor: "pointer",
  fontWeight: "700",
};