import { supabase } from "@/lib/supabase/client";

import type { Favorite } from "../types/favorite";

/**
 * Obtiene el usuario autenticado actual.
 */
async function getCurrentUserId(): Promise<string | null> {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    console.error(
      "[FAVORITES] Error obteniendo usuario:",
      error
    );

    return null;
  }

  return user?.id ?? null;
}

/**
 * Obtiene todos los restaurantes favoritos
 * del usuario autenticado.
 */
export async function getFavorites(): Promise<Favorite[]> {
  const userId = await getCurrentUserId();

  if (!userId) {
    return [];
  }

  const {
    data: favorites,
    error,
  } = await supabase
    .from("restaurant_favorites")
    .select(`
      id,
      restaurant_id,
      created_at,
      restaurants (
        id,
        name,
        slug,
        logo_url,
        banner_url,
        category,
        active,
        accepting_orders
      )
    `)
    .eq("auth_user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "[FAVORITES] Error obteniendo favoritos:",
      error
    );

    return [];
  }

  if (!favorites?.length) {
    return [];
  }

  return favorites
    .map((favorite) => {
      const restaurant = Array.isArray(
        favorite.restaurants
      )
        ? favorite.restaurants[0]
        : favorite.restaurants;

      if (!restaurant) {
        return null;
      }

      return {
        id: favorite.id,
        restaurant_id: favorite.restaurant_id,
        name: restaurant.name,
        slug: restaurant.slug,
        logo_url: restaurant.logo_url ?? null,
        banner_url: restaurant.banner_url ?? null,
        category: restaurant.category ?? null,
        active: Boolean(restaurant.active),
        accepting_orders: Boolean(
          restaurant.accepting_orders
        ),
        created_at: favorite.created_at,
      };
    })
    .filter(
      (favorite): favorite is Favorite =>
        favorite !== null
    );
}

/**
 * Comprueba si un restaurante está marcado
 * como favorito por el usuario actual.
 */
export async function isFavorite(
  restaurantId: string
): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (!userId || !restaurantId) {
    return false;
  }

  const {
    data,
    error,
  } = await supabase
    .from("restaurant_favorites")
    .select("id")
    .eq("auth_user_id", userId)
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (error) {
    console.error(
      "[FAVORITES] Error comprobando favorito:",
      error
    );

    return false;
  }

  return Boolean(data);
}

/**
 * Agrega un restaurante a favoritos.
 */
export async function addFavorite(
  restaurantId: string
): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (!userId || !restaurantId) {
    return false;
  }

  const {
    data: existing,
    error: existingError,
  } = await supabase
    .from("restaurant_favorites")
    .select("id")
    .eq("auth_user_id", userId)
    .eq("restaurant_id", restaurantId)
    .maybeSingle();

  if (existingError) {
    console.error(
      "[FAVORITES] Error comprobando favorito existente:",
      existingError
    );

    return false;
  }

  if (existing) {
    return true;
  }

  const {
    error,
  } = await supabase
    .from("restaurant_favorites")
    .insert({
      auth_user_id: userId,
      restaurant_id: restaurantId,
    });

  if (error) {
    console.error(
      "[FAVORITES] Error agregando favorito:",
      error
    );

    return false;
  }

  return true;
}

/**
 * Elimina un restaurante de favoritos.
 */
export async function removeFavorite(
  restaurantId: string
): Promise<boolean> {
  const userId = await getCurrentUserId();

  if (!userId || !restaurantId) {
    return false;
  }

  const {
    error,
  } = await supabase
    .from("restaurant_favorites")
    .delete()
    .eq("auth_user_id", userId)
    .eq("restaurant_id", restaurantId);

  if (error) {
    console.error(
      "[FAVORITES] Error eliminando favorito:",
      error
    );

    return false;
  }

  return true;
}

/**
 * Alterna el estado de favorito.
 *
 * true  → restaurante quedó guardado.
 * false → restaurante quedó eliminado.
 */
export async function toggleFavorite(
  restaurantId: string
): Promise<boolean> {
  const currentlyFavorite =
    await isFavorite(restaurantId);

  if (currentlyFavorite) {
    return removeFavorite(restaurantId);
  }

  return addFavorite(restaurantId);
}