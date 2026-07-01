import type { Metadata, Viewport } from "next";
import { generateRestaurantMetadata } from "./metadata";
import { getRestaurantMetadata } from "@/lib/restaurants/getRestaurantMetadata";
import InstallWidget from "@/components/pwa/InstallWidget";

interface Props {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  
  try {
    const baseMetadata = await generateRestaurantMetadata(slug);
    // Solo devolvemos el manifest si estamos seguros de que quieres usarlo
    return {
      ...baseMetadata,
      manifest: `/api/manifest/${slug}`,
    };
  } catch (error) {
    // Si falla, devolvemos metadatos vacíos o por defecto en lugar de romper
    return { title: "Restaurante" };
  }
}

export async function generateViewport({ params }: Props): Promise<Viewport> {
  const { slug } = await params;
  
  try {
    const restaurant = await getRestaurantMetadata(slug);
    
    return {
      // Usamos encadenamiento opcional para evitar errores si 'restaurant' es null
      themeColor: restaurant?.pwaSettings?.theme_color || "#3b92a5",
      width: "device-width",
      initialScale: 1,
    };
  } catch (error) {
    // Si falla la consulta, devolvemos valores seguros por defecto
    return { themeColor: "#3b92a5", width: "device-width", initialScale: 1 };
  }
}

export default function RestaurantLayout({ children }: Props) {
  return (
    <>
      {/* El widget se renderiza siempre. Asegúrate de que dentro del componente InstallWidget 
          tampoco hagas una consulta a la DB que pueda fallar sin control */}
      <InstallWidget />
      {children}
    </>
  );
}