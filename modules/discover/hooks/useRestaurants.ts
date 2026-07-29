"use client";

import { useCallback, useEffect, useState } from "react";

import { getRestaurants } from "../services/discover.service";
import type { Restaurant } from "../types/restaurant";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRestaurants = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await getRestaurants();
      setRestaurants(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los restaurantes.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;

    async function load() {
      if (!active) return;

      setLoading(true);
      setError(null);

      try {
        const data = await getRestaurants();

        if (active) {
          setRestaurants(data);
        }
      } catch (err) {
        console.error(err);

        if (active) {
          setError("No se pudieron cargar los restaurantes.");
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      active = false;
    };
  }, []);

  return {
    restaurants,
    loading,
    error,
    reload: loadRestaurants,
  };
}