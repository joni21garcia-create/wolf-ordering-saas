"use client";

import { getRestaurantStatus } from "@/lib/schedule";
import type { Restaurant } from "../types/restaurant";

interface RestaurantStatusProps {
  restaurant: Restaurant;
}

export default function RestaurantStatus({
  restaurant,
}: RestaurantStatusProps) {
  const status = getRestaurantStatus(
    restaurant.schedule_settings
  );

  /**
   * El restaurante puede recibir pedidos únicamente
   * cuando:
   *
   * 1. Está dentro de su horario.
   * 2. El administrador no lo ha cerrado manualmente.
   */
  const canReceiveOrders =
    restaurant.accepting_orders &&
    status.isOpen;

  /**
   * Color principal del estado.
   */
  const colorClass = canReceiveOrders
    ? "text-emerald-400"
    : "text-red-400";

  /**
   * Texto principal.
   */
  let badge = status.badge;

  /**
   * Texto secundario.
   */
  let message = status.message;

  /**
   * Si el administrador cerró el restaurante
   * manualmente, damos prioridad a ese estado.
   */
  if (!restaurant.accepting_orders) {
    badge = "Cerrado";
    message = "No recibe pedidos temporalmente.";
  }

  return (
    <div className="flex flex-col">
      <span
        className={`inline-flex items-center gap-1 text-xs font-medium ${colorClass}`}
      >
        <span className="h-2 w-2 rounded-full bg-current" />

        {badge}
      </span>

      {message && (
        <span className="mt-1 text-xs text-zinc-500">
          {message}
        </span>
      )}
    </div>
  );
}