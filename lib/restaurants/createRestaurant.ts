export interface CreateRestaurantPayload {
  restaurant: Record<string, any>;
  user?: Record<string, any>;
  token: string;
}

export async function createRestaurant({
  restaurant,
  user,
  token,
}: CreateRestaurantPayload) {
  const response = await fetch(
    "/api/super-admin/restaurants/create",
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },

      body: JSON.stringify({
        restaurant,
        user,
      }),
    }
  );

  const result =
    await response.json();

  if (!response.ok) {
    throw new Error(
      result.error ??
        "No se pudo crear el restaurante."
    );
  }

  return result;
}