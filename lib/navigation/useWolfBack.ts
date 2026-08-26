"use client";

import { useRouter } from "next/navigation";

export function useWolfBack(fallback: string) {
  const router = useRouter();

  return () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
      return;
    }

    router.replace(fallback);
  };
}