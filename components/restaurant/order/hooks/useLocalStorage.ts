"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Persisted state hook used by the order flow.
 *
 * Important behavior:
 * - Hydrates once for each storage key before enabling writes.
 * - Does not depend on `initialValue` for the hydration effect because
 *   callers may create fresh [] / {} references on every render.
 * - Prevents the default value from overwriting an existing value in storage.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);
  const hydratedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (hydratedKeyRef.current === key) return;

    hydratedKeyRef.current = key;
    setHydrated(false);

    let nextValue = initialValue;

    try {
      const item = window.localStorage.getItem(key);
      if (item !== null) {
        nextValue = JSON.parse(item) as T;
      }
    } catch (error) {
      console.error(`[WOLF STORAGE] Error loading ${key}`, error);
    }

    setValue(nextValue);
    setHydrated(true);
  }, [key]);

  useEffect(() => {
    if (!hydrated) return;

    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[WOLF STORAGE] Error saving ${key}`, error);
    }
  }, [key, value, hydrated]);

  return [value, setValue] as const;
}
