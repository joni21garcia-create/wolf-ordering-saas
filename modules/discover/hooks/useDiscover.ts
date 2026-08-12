"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

import {
  discoverQuery,
  type DiscoverFilter,
} from "@/modules/discover/services/discoverQuery";

import { getRestaurants } from "@/modules/discover/services/discover.service";
import type { Restaurant } from "@/modules/discover/types/restaurant";

export type { DiscoverFilter };

export interface DiscoverUserLocation {
  latitude: number;
  longitude: number;
}

interface UseDiscoverResult {
  restaurants: Restaurant[];
  filteredRestaurants: Restaurant[];
  featuredRestaurants: Restaurant[];

  search: string;
  category: string | null;
  filter: DiscoverFilter;

  userLocation: DiscoverUserLocation | null;
  locationLoading: boolean;

  loading: boolean;
  error: string | null;

  setSearch: (value: string) => void;
  setCategory: (value: string | null) => void;
  setFilter: (value: DiscoverFilter) => void;

  reload: () => Promise<void>;
}

export function useDiscover(): UseDiscoverResult {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<string | null>(null);
  const [filter, setFilter] =
    useState<DiscoverFilter>("all");

  const [userLocation, setUserLocation] =
    useState<DiscoverUserLocation | null>(null);

  const [locationLoading, setLocationLoading] =
    useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error(
        "[DISCOVER] Error cargando restaurantes:",
        err,
      );

      setError(
        "No se pudieron cargar los restaurantes.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;

    async function loadInitialRestaurants() {
      setLoading(true);
      setError(null);

      try {
        const data = await getRestaurants();

        if (mounted) {
          setRestaurants(data);
        }
      } catch (err) {
        console.error(
          "[DISCOVER] Error cargando restaurantes:",
          err,
        );

        if (mounted) {
          setError(
            "No se pudieron cargar los restaurantes.",
          );
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    void loadInitialRestaurants();

    return () => {
      mounted = false;
    };
  }, []);

  /**
   * Una sola fuente de ubicación para Discover.
   *
   * La ubicación es opcional: si el usuario la rechaza,
   * Discover continúa funcionando normalmente.
   */
  useEffect(() => {
    if (
      typeof navigator === "undefined" ||
      !("geolocation" in navigator)
    ) {
      return;
    }

    let mounted = true;

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        if (!mounted) return;

        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });

        setLocationLoading(false);
      },
      (geolocationError) => {
        if (!mounted) return;

        console.info(
          "[DISCOVER] Ubicación no disponible:",
          geolocationError.message,
        );

        setLocationLoading(false);
      },
      {
        enableHighAccuracy: false,
        timeout: 9000,
        maximumAge: 5 * 60 * 1000,
      },
    );

    return () => {
      mounted = false;
    };
  }, []);

  const queryResult = useMemo(() => {
    return discoverQuery({
      restaurants,
      search,
      category,
      filter,
      location: userLocation,
    });
  }, [
    restaurants,
    search,
    category,
    filter,
    userLocation,
  ]);

  const filteredRestaurants = queryResult.restaurants;

  const featuredRestaurants = useMemo(() => {
    return restaurants.filter(
      (restaurant) =>
        Boolean(restaurant.featured_type) &&
        restaurant.featured_type !== "none",
    );
  }, [restaurants]);

  return {
    restaurants,
    filteredRestaurants,
    featuredRestaurants,

    search,
    category,
    filter,

    userLocation,
    locationLoading,

    loading,
    error,

    setSearch,
    setCategory,
    setFilter,

    reload: loadRestaurants,
  };
}