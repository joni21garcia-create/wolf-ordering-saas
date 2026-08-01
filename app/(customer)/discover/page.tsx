"use client";

import { useMemo, useState } from "react";


import DiscoverHeader from "@/modules/discover/components/DiscoverHeader";
import RestaurantGrid from "@/modules/discover/components/RestaurantGrid";
import SearchBar from "@/modules/discover/components/SearchBar";
import { useRestaurants } from "@/modules/discover/hooks/useRestaurants";
import PushProvider from "@/components/push/PushProvider";

export default function DiscoverPage() {
  const { restaurants, loading, error } = useRestaurants();

  const [search, setSearch] = useState("");

  const filteredRestaurants = useMemo(() => {
    const term = search.trim().toLowerCase();

    if (!term) return restaurants;

    return restaurants.filter((restaurant) =>
      restaurant.name.toLowerCase().includes(term)
    );
  }, [restaurants, search]);

return (
  <>
    <PushProvider
      restaurantId="discover"
    />

    <main className="container mx-auto space-y-8 px-4 py-8">
      <DiscoverHeader />

      <SearchBar
        value={search}
        onChange={setSearch}
      />

      {loading && (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="h-80 animate-pulse rounded-2xl bg-muted"
            />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-600">
          {error}
        </div>
      )}

      {!loading && !error && (
        <RestaurantGrid
          restaurants={filteredRestaurants}
        />
      )}
    </main>
  </>
);
}