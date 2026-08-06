import { createSupabaseServerClient } from "@/lib/supabase/server";

import SalesClient from "./SalesClient";

interface Props {
  params: Promise<{
    restaurantId: string;
  }>;
}

export default async function SalesPage({
  params,
}: Props) {
  const { restaurantId } = await params;

  const supabase = await createSupabaseServerClient();

  // Restaurante
  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("id", restaurantId)
    .single();

  if (!restaurant) {
    return (
      <div
        style={{
          padding: 40,
          color: "#fff",
        }}
      >
        Restaurante no encontrado.
      </div>
    );
  }

  return (
    <SalesClient
      restaurant={restaurant}
    />
  );
}