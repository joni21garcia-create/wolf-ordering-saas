"use client";

import { useEffect, useMemo, useState } from "react";

import { supabase } from "@/lib/supabase/client";

import DeleteRestaurantDialog from "./DeleteRestaurantDialog";
import RestaurantGrid from "./RestaurantGrid";
import RestaurantsHeader from "./RestaurantsHeader";
import RestaurantsStats from "./RestaurantsStats";
import RestaurantsToolbar from "./RestaurantsToolbar";

type Restaurant = {
  id: string;

  name: string;

  slug: string;

  active: boolean;

  banner_url?: string | null;

  logo_url?: string | null;

  owner_phone?: string | null;

  phone?: string | null;

  contact_email?: string | null;

  email?: string | null;

  products_count?: number;

  created_at?: string;

  updated_at?: string;
};

export default function RestaurantsPageClient() {
  const [restaurants, setRestaurants] =
    useState<Restaurant[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [search, setSearch] =
    useState("");

  const [status, setStatus] =
    useState("all");

  const [sort, setSort] =
    useState("recent");

  const [selectedRestaurant, setSelectedRestaurant] =
    useState<Restaurant | null>(null);

  const [deleting, setDeleting] =
    useState(false);

  useEffect(() => {
    loadRestaurants();
  }, []);

  async function loadRestaurants() {
    try {
      setLoading(true);

      const { data, error } =
        await supabase
          .from("restaurants")
          .select("*")
          .order("created_at", {
            ascending: false,
          });

      if (error) throw error;

      setRestaurants(
        (data ||
          []) as Restaurant[]
      );
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function deleteRestaurant() {
    if (!selectedRestaurant) return;

    try {
      setDeleting(true);

      const { error } =
        await supabase
          .from("restaurants")
          .delete()
          .eq(
            "id",
            selectedRestaurant.id
          );

      if (error) throw error;

      setRestaurants((prev) =>
        prev.filter(
          (restaurant) =>
            restaurant.id !==
            selectedRestaurant.id
        )
      );

      setSelectedRestaurant(null);
    } catch (error) {
      console.error(error);

      alert(
        "No fue posible eliminar el restaurante."
      );
    } finally {
      setDeleting(false);
    }
  }

  const filteredRestaurants =
    useMemo(() => {
      let result = [...restaurants];
            /* ========================================= */
      /* Buscar                                    */
      /* ========================================= */

      if (search.trim()) {
        const value =
          search.toLowerCase().trim();

        result = result.filter(
          (restaurant) =>
            restaurant.name
              ?.toLowerCase()
              .includes(value) ||
            restaurant.slug
              ?.toLowerCase()
              .includes(value) ||
            restaurant.contact_email
              ?.toLowerCase()
              .includes(value) ||
            restaurant.owner_phone
              ?.toLowerCase()
              .includes(value)
        );
      }

      /* ========================================= */
      /* Estado                                    */
      /* ========================================= */

      if (status === "active") {
        result = result.filter(
          (restaurant) =>
            restaurant.active
        );
      }

      if (status === "inactive") {
        result = result.filter(
          (restaurant) =>
            !restaurant.active
        );
      }

      /* ========================================= */
      /* Orden                                     */
      /* ========================================= */

      switch (sort) {
        case "az":
          result.sort((a, b) =>
            a.name.localeCompare(
              b.name
            )
          );
          break;

        case "za":
          result.sort((a, b) =>
            b.name.localeCompare(
              a.name
            )
          );
          break;

        case "oldest":
          result.sort(
            (a, b) =>
              new Date(
                a.created_at || ""
              ).getTime() -
              new Date(
                b.created_at || ""
              ).getTime()
          );
          break;

        default:
          result.sort(
            (a, b) =>
              new Date(
                b.created_at || ""
              ).getTime() -
              new Date(
                a.created_at || ""
              ).getTime()
          );
      }

      return result;
    }, [
      restaurants,
      search,
      status,
      sort,
    ]);

  const stats = useMemo(() => {
    const today = new Date();

    return {
      total:
        filteredRestaurants.length,

      active:
        filteredRestaurants.filter(
          (restaurant) =>
            restaurant.active
        ).length,

      inactive:
        filteredRestaurants.filter(
          (restaurant) =>
            !restaurant.active
        ).length,

      newThisMonth:
        filteredRestaurants.filter(
          (restaurant) => {
            if (
              !restaurant.created_at
            )
              return false;

            const created =
              new Date(
                restaurant.created_at
              );

            return (
              created.getMonth() ===
                today.getMonth() &&
              created.getFullYear() ===
                today.getFullYear()
            );
          }
        ).length,
    };
  }, [filteredRestaurants]);

  return (
    <>
      <main
        style={{
          maxWidth: 1550,

          margin: "0 auto",

          padding:
            "40px 24px 60px",

          color: "#fff",
        }}
      >
        <RestaurantsHeader />

        <RestaurantsStats
          {...stats}
        />

        <RestaurantsToolbar
          search={search}
          onSearch={setSearch}
          status={status}
          onStatusChange={
            setStatus
          }
          sort={sort}
          onSortChange={
            setSort
          }
          total={
            filteredRestaurants.length
          }
        />

        {loading ? (
          <div
            style={{
              display: "flex",

              justifyContent:
                "center",

              alignItems: "center",

              minHeight: 420,

              color: "#8f8f8f",

              fontSize: 18,

              fontWeight: 600,
            }}
          >
            Cargando
            restaurantes...
          </div>
        ) : (
          <RestaurantGrid
            restaurants={
              filteredRestaurants
            }
            onDuplicate={(
              restaurant
            ) =>
              console.log(
                "Duplicar",
                restaurant
              )
            }
            onToggleStatus={(
              restaurant
            ) =>
              console.log(
                "Cambiar estado",
                restaurant
              )
            }
            onDelete={(
              restaurant
            ) =>
              setSelectedRestaurant(
                restaurant
              )
            }
          />
        )}
      </main>

      <DeleteRestaurantDialog
        open={
          selectedRestaurant !==
          null
        }
        restaurantName={
          selectedRestaurant?.name
        }
        loading={deleting}
        onClose={() =>
          setSelectedRestaurant(
            null
          )
        }
        onConfirm={
          deleteRestaurant
        }
      />
    </>
  );
}