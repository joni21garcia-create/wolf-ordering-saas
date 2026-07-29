"use client";

import { useEffect, useState } from "react";
import { getRestaurants } from "../services/discover.service";
import type { Restaurant } from "../types/restaurant";

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;

    async function load() {
      try {
        setLoading(true);

        const data = await getRestaurants();

        if (mounted) {
          setRestaurants(data);
        }
      } catch (err) {
        console.error(err);

        if (mounted) {
          setError("No se pudieron cargar los restaurantes.");
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, []);

  return {
    restaurants,
    loading,
    error,
  };
}