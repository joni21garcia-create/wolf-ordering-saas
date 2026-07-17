import ThemeSettingsClient from "./ThemeSettingsClient";
import { createClient } from "@supabase/supabase-js";

// Si usas tu cliente de Supabase del servidor, puedes consultar los datos iniciales aquí
export default async function ThemeSettingsPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params;

  // Opcional: Puedes hacer un fetch o consulta a Supabase para obtener el initialData
  // const initialData = ... 

  return <ThemeSettingsClient restaurantId={id} initialData={null} />;
}