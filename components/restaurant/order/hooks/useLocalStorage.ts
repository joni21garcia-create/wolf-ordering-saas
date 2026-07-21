"use client";

import { useEffect, useState } from "react";

export function useLocalStorage<T>(
  key: string,
  initialValue: T
) {
  const [value, setValue] = useState<T>(initialValue);

  useEffect(() => {
    try {
      const item = localStorage.getItem(key);

      if (item !== null) {
        setValue(JSON.parse(item));
      }
    } catch (error) {
      console.error(`Error loading ${key}`, error);
    }
  }, [key]);

  useEffect(() => {
    try {
      localStorage.setItem(
        key,
        JSON.stringify(value)
      );
    } catch (error) {
      console.error(`Error saving ${key}`, error);
    }
  }, [key, value]);

  return [value, setValue] as const;
}


