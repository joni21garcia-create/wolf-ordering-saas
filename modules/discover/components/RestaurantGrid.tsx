"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useRef } from "react";

import RestaurantCard from "./RestaurantCard";
import type { Restaurant } from "@/modules/discover/types/restaurant";

interface RestaurantGridProps {
  restaurants: Restaurant[];
}

export default function RestaurantGrid({
  restaurants,
}: RestaurantGridProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;

    const amount = 360;

    scrollRef.current.scrollBy({
      left: direction === "right" ? amount : -amount,
      behavior: "smooth",
    });
  };

  if (restaurants.length === 0) {
    return (
      <section className="py-16">
        <div className="mx-auto max-w-2xl rounded-3xl border border-white/10 bg-zinc-950/70 px-8 py-14 text-center backdrop-blur-sm">
          <div className="mb-4 text-5xl">🍽️</div>

          <h3 className="text-2xl font-bold text-white">
            No encontramos restaurantes
          </h3>

          <p className="mt-3 text-zinc-400">
            Intenta cambiar el texto de búsqueda o vuelve a intentarlo más tarde.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full">
      {/* Flecha izquierda */}

      <button
        onClick={() => scroll("left")}
        className="
          absolute
          left-2
          top-1/2
          z-20
          hidden
          -translate-y-1/2
          rounded-full
          border
          border-white/10
          bg-zinc-900/90
          p-3
          text-white
          shadow-xl
          backdrop-blur
          transition
          hover:border-orange-500
          hover:bg-orange-500
          lg:flex
        "
      >
        <ChevronLeft size={22} />
      </button>

      {/* Flecha derecha */}

      <button
        onClick={() => scroll("right")}
        className="
          absolute
          right-2
          top-1/2
          z-20
          hidden
          -translate-y-1/2
          rounded-full
          border
          border-white/10
          bg-zinc-900/90
          p-3
          text-white
          shadow-xl
          backdrop-blur
          transition
          hover:border-orange-500
          hover:bg-orange-500
          lg:flex
        "
      >
        <ChevronRight size={22} />
      </button>

      <div
        ref={scrollRef}
        className="
          flex
          gap-6
          overflow-x-auto
          scroll-smooth
          snap-x
          snap-mandatory
          pb-4
          pr-4
          scrollbar-none
        "
      >
        {restaurants.map((restaurant) => (
          <div
            key={restaurant.id}
            className="
              snap-start
              flex-shrink-0

              w-[82%]

              sm:w-[48%]

              md:w-[340px]

              lg:w-[300px]

              xl:w-[290px]
            "
          >
            <RestaurantCard restaurant={restaurant} />
          </div>
        ))}
      </div>
    </section>
  );
}
