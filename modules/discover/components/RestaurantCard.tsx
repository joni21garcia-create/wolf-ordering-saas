"use client";

import Image from "next/image";
import Link from "next/link";

import type { Restaurant } from "../types/restaurant";

interface RestaurantCardProps {
  restaurant: Restaurant;
}

export default function RestaurantCard({
  restaurant,
}: RestaurantCardProps) {
  const isOpen = restaurant.accepting_orders;

  return (
    <Link
      href={`/${restaurant.slug}`}
      className="group block overflow-hidden rounded-2xl border border-border bg-card transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Banner */}
      <div className="relative h-52 w-full overflow-hidden">
        {restaurant.banner_url ? (
          <Image
            src={restaurant.banner_url}
            alt={restaurant.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center bg-muted text-muted-foreground">
            Sin imagen
          </div>
        )}
      </div>

      {/* Contenido */}
      <div className="relative px-5 pb-5 pt-12">
        {/* Logo */}
        <div className="absolute -top-10 left-5">
          <div className="h-20 w-20 overflow-hidden rounded-full border-4 border-background bg-background shadow-lg">
            {restaurant.logo_url ? (
              <Image
                src={restaurant.logo_url}
                alt={restaurant.name}
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">
                Logo
              </div>
            )}
          </div>
        </div>

        {/* Nombre */}
        <h3 className="text-xl font-bold leading-tight">
          {restaurant.name}
        </h3>

        {/* Categoría */}
        <p className="mt-1 text-sm text-muted-foreground">
          {restaurant.category ?? "Restaurante"}
        </p>

        {/* Estado */}
        <div className="mt-4 flex items-center justify-between">
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ${
              isOpen
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {isOpen ? "Abierto" : "Cerrado"}
          </span>

          {(restaurant.estimated_min_time !== null &&
            restaurant.estimated_max_time !== null) && (
            <span className="text-sm text-muted-foreground">
              {restaurant.estimated_min_time}–{restaurant.estimated_max_time} min
            </span>
          )}
        </div>

        {/* Dirección */}
        {restaurant.address && (
          <p className="mt-4 line-clamp-1 text-sm text-muted-foreground">
            📍 {restaurant.address}
          </p>
        )}

        {/* Botón */}
        <button
          className="mt-6 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
        >
          Ordenar ahora →
        </button>
      </div>
    </Link>
  );
}