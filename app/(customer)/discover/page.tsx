"use client";

import { useMemo, useState } from "react";

import PushProvider from "@/components/push/PushProvider";
import DiscoverBusinessCTA from "@/modules/discover/components/DiscoverBusinessCTA";
import DiscoverBottomNav from "@/modules/discover/components/DiscoverBottomNav";
import DiscoverCategories, {
  type DiscoverCategory,
} from "@/modules/discover/components/DiscoverCategories";
import DiscoverFeatured from "@/modules/discover/components/DiscoverFeatured";
import DiscoverFilters from "@/modules/discover/components/DiscoverFilters";
import DiscoverHeader from "@/modules/discover/components/DiscoverHeader";
import DiscoverRestaurantGrid from "@/modules/discover/components/DiscoverRestaurantGrid";
import DiscoverSearch from "@/modules/discover/components/DiscoverSearch";
import DiscoverShell from "@/modules/discover/components/DiscoverShell";
import {
  useDiscover,
  type DiscoverFilter,
} from "@/modules/discover/hooks/useDiscover";
import { DISCOVER_CATEGORIES } from "@/lib/discover/categories";

function getCategoryIcon(
  value: string,
): DiscoverCategory["icon"] {
  const normalized = value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  if (
    normalized.includes("pizza") ||
    normalized.includes("pizzer")
  ) {
    return "pizza";
  }

  if (
    normalized.includes("hamburg") ||
    normalized.includes("burger")
  ) {
    return "burger";
  }

  if (
    normalized.includes("pollo") ||
    normalized.includes("chicken")
  ) {
    return "chicken";
  }

  if (
    normalized.includes("sushi") ||
    normalized.includes("jap")
  ) {
    return "sushi";
  }

  if (
    normalized.includes("cafe") ||
    normalized.includes("coffee") ||
    normalized.includes("cafeter")
  ) {
    return "coffee";
  }

  if (
    normalized.includes("ensalada") ||
    normalized.includes("salad") ||
    normalized.includes("salud")
  ) {
    return "salad";
  }

  // Estas categorías todavía no forman parte del union de iconos
  // soportado por DiscoverCategories. Se mantienen reconocibles
  // por su texto y usan el icono neutro hasta ampliar ese catálogo.
  if (
    normalized.includes("parrilla") ||
    normalized.includes("barbacoa") ||
    normalized.includes("bbq") ||
    normalized.includes("postre") ||
    normalized.includes("helad") ||
    normalized.includes("pan") ||
    normalized.includes("panader") ||
    normalized.includes("bebida") ||
    normalized.includes("drink")
  ) {
    return "other";
  }

  return "other";
}

export default function DiscoverPage() {
  const {
    restaurants,
    filteredRestaurants,
    featuredRestaurants,
    search,
    category,
    filter,
    userLocation,
    loading,
    error,
    setSearch,
    setCategory,
    setFilter,
  } = useDiscover();

  const [selectedCategory, setSelectedCategory] =
    useState<string>("all");

  /**
   * Las categorías visuales salen del catálogo oficial de
   * Discover, no de los restaurantes que casualmente estén
   * cargados en este momento.
   *
   * Esto permite que:
   * - las categorías sean estables;
   * - el orden sea consistente;
   * - los iconos sean consistentes;
   * - una categoría pueda existir aunque todavía no tenga
   *   restaurantes visibles.
   */
  const categories = useMemo<DiscoverCategory[]>(() => {
    return [
      {
        id: "all",
        label: "Todos",
        value: "all",
        icon: "other",
      },
      ...DISCOVER_CATEGORIES.map((item) => ({
        id: item.id,
        label: item.label,
        value: item.id,
        icon: getCategoryIcon(
          `${item.id} ${item.label}`,
        ),
      })),
    ];
  }, []);

  /**
   * La categoría visual y el estado del query son el mismo
   * estado. "all" es solamente el estado visual de "sin
   * categoría".
   */
  const handleCategorySelect = (value: string) => {
    setSelectedCategory(value);

    if (value === "all") {
      setCategory(null);
      return;
    }

    setCategory(value);
  };

  const handleSearchClick = () => {
    document
      .getElementById("discover-search")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  const handleBusinessStart = () => {
    // El destino comercial se conectará al flujo de planes + PayPal.
    // No se inventa una ruta hasta que exista el flujo de suscripción.
  };

  const handleViewAllCategories = () => {
    document
      .getElementById("discover-categories")
      ?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  };

  /**
   * El resultado YA viene filtrado por:
   * - búsqueda inteligente;
   * - categoría;
   * - filtro de estado/velocidad.
   *
   * No hacemos un segundo filtro aquí.
   *
   * Esto es importante: antes page.tsx volvía a filtrar por
   * restaurant.category y podía duplicar/contradecir la lógica
   * centralizada de discoverQuery().
   */
  const visibleRestaurants = filteredRestaurants;

  return (
    <>
      <PushProvider />

      <DiscoverShell>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "22px",
          }}
        >
          <DiscoverHeader />

          <div id="discover-search">
            <DiscoverSearch
              value={search}
              onChange={setSearch}
            />
          </div>

          {!loading && !error ? (
            <div id="discover-categories">
              <DiscoverCategories
                categories={categories}
                selectedCategory={selectedCategory}
                onSelect={handleCategorySelect}
                onViewAll={handleViewAllCategories}
              />
            </div>
          ) : null}

          {!loading && !error ? (
            <DiscoverFeatured
              restaurants={featuredRestaurants}
              userLocation={userLocation}
            />
          ) : null}

          {!loading && !error ? (
            <section
              aria-labelledby="discover-restaurants-title"
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "14px",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "12px",
                }}
              >
                <div
                  style={{
                    minWidth: 0,
                    display: "flex",
                    flexDirection: "column",
                    gap: "3px",
                  }}
                >
                  <h2
                    id="discover-restaurants-title"
                    style={{
                      margin: 0,
                      color: "#ffffff",
                      fontSize: "18px",
                      lineHeight: 1.2,
                      fontWeight: 800,
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {search.trim()
                      ? `Resultados para “${search.trim()}”`
                      : category
                        ? categories.find(
                            (item) =>
                              item.value === category,
                          )?.label ?? "Restaurantes"
                        : "Restaurantes cerca de ti"}
                  </h2>

                  {category || search.trim() ? (
                    <button
                      type="button"
                      onClick={() => {
                        setSearch("");
                        handleCategorySelect("all");
                      }}
                      style={{
                        alignSelf: "flex-start",
                        padding: 0,
                        border: 0,
                        background: "transparent",
                        color: "rgba(249,115,22,0.86)",
                        fontSize: "11px",
                        fontWeight: 650,
                        cursor: "pointer",
                      }}
                    >
                      Limpiar búsqueda y categoría
                    </button>
                  ) : null}
                </div>

                <span
                  aria-label={`${visibleRestaurants.length} restaurantes`}
                  style={{
                    flexShrink: 0,
                    color: "rgba(255,255,255,0.42)",
                    fontSize: "11px",
                    fontWeight: 600,
                  }}
                >
                  {visibleRestaurants.length}
                </span>
              </div>

              <DiscoverFilters
                value={filter as DiscoverFilter}
                onChange={setFilter}
              />

              <DiscoverRestaurantGrid
                restaurants={visibleRestaurants}
                loading={loading}
                userLocation={userLocation}
                emptyMessage={
                  search.trim()
                    ? "No encontramos restaurantes para tu búsqueda."
                    : category
                      ? "No encontramos restaurantes en esta categoría con estos filtros."
                      : "No encontramos restaurantes con estos filtros."
                }
              />
            </section>
          ) : null}

          {loading ? (
            <DiscoverRestaurantGrid
              restaurants={[]}
              loading
            />
          ) : null}

          {!loading && error ? (
            <section
              role="alert"
              style={{
                padding: "18px",
                border: "1px solid rgba(248,113,113,0.18)",
                borderRadius: "20px",
                background: "rgba(127,29,29,0.16)",
                color: "#fecaca",
                fontSize: "13px",
                lineHeight: 1.5,
              }}
            >
              {error}
            </section>
          ) : null}

          {!loading && !error ? (
            <DiscoverBusinessCTA
              onGetStarted={handleBusinessStart}
            />
          ) : null}
        </div>
      </DiscoverShell>

      <DiscoverBottomNav
        active="home"
        onSearchClick={handleSearchClick}
      />
    </>
  );
}