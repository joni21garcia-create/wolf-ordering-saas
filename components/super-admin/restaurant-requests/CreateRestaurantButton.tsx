"use client";

import { ArrowRight, Loader2, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

type CreateRestaurantButtonProps = {
  requestId: string;
  plan?: string | null;
  disabled?: boolean;
  className?: string;
  label?: string;
  onBeforeNavigate?: () => void;
};

/**
 * Bridge between the Super Admin request panel and the existing
 * seven-step restaurant creation Wizard.
 *
 * This component does not create a restaurant.
 * It only carries the request context to the existing Wizard.
 */
export default function CreateRestaurantButton({
  requestId,
  plan,
  disabled = false,
  className = "",
  label = "Crear restaurante",
  onBeforeNavigate,
}: CreateRestaurantButtonProps) {
  const router = useRouter();
  const [navigating, setNavigating] = useState(false);

  const handleCreate = () => {
    if (!requestId || disabled || navigating) {
      return;
    }

    setNavigating(true);

    try {
      onBeforeNavigate?.();

      const params = new URLSearchParams({
        restaurant_request_id: requestId,
      });

      if (plan) {
        params.set("plan", plan);
      }

      router.push(
        `/super-admin/restaurants/new?${params.toString()}`,
      );
    } catch (error) {
      console.error(
        "[CREATE RESTAURANT BUTTON] Error navegando al Wizard:",
        error,
      );

      setNavigating(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleCreate}
      disabled={disabled || navigating}
      aria-busy={navigating}
      className={`inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 text-[10px] font-bold uppercase tracking-[0.08em] text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {navigating ? (
        <>
          <Loader2
            size={14}
            className="animate-spin"
          />
          Abriendo creación...
        </>
      ) : (
        <>
          <Store size={14} />
          {label}
          <ArrowRight size={14} />
        </>
      )}
    </button>
  );
}