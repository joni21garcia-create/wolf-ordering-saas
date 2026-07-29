import { supabase } from "@/lib/supabase/client";

export interface RestaurantFavorite {
  id: string;
  auth_user_id: string;
  restaurant_id: string;
  created_at: string;
}

class FavoriteService {
  /**
   * Obtiene el usuario autenticado.
   */
  private async getCurrentUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    return user;
  }

  /**
   * Obtiene todos los IDs de restaurantes favoritos
   * del usuario autenticado.
   */
  async getFavorites(): Promise<string[]> {
    const user = await this.getCurrentUser();

    if (!user) return [];

    const { data, error } = await supabase
      .from("restaurant_favorites")
      .select("restaurant_id")
      .eq("auth_user_id", user.id);

    if (error) throw error;

    return data?.map((item) => item.restaurant_id) ?? [];
  }

  /**
   * Verifica si un restaurante es favorito.
   */
  async isFavorite(restaurantId: string): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (!user) return false;

    const { data, error } = await supabase
      .from("restaurant_favorites")
      .select("id")
      .eq("auth_user_id", user.id)
      .eq("restaurant_id", restaurantId)
      .maybeSingle();

    if (error) throw error;

    return !!data;
  }

  /**
   * Agrega un restaurante a favoritos.
   */
  async addFavorite(restaurantId: string): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (!user) return false;

    const { error } = await supabase
      .from("restaurant_favorites")
      .insert({
        auth_user_id: user.id,
        restaurant_id: restaurantId,
      });

    if (error) throw error;

    return true;
  }

  /**
   * Elimina un restaurante de favoritos.
   */
  async removeFavorite(restaurantId: string): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (!user) return false;

    const { error } = await supabase
      .from("restaurant_favorites")
      .delete()
      .eq("auth_user_id", user.id)
      .eq("restaurant_id", restaurantId);

    if (error) throw error;

    return true;
  }

  /**
   * Agrega o elimina un favorito.
   * Retorna el nuevo estado.
   */
  async toggleFavorite(restaurantId: string): Promise<boolean> {
    const user = await this.getCurrentUser();

    if (!user) {
      return false;
    }

    const favorite = await this.isFavorite(restaurantId);

    if (favorite) {
      await this.removeFavorite(restaurantId);
      return false;
    }

    await this.addFavorite(restaurantId);
    return true;
  }

  /**
   * Indica si el usuario tiene sesión.
   */
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
}

export const favoriteService = new FavoriteService();