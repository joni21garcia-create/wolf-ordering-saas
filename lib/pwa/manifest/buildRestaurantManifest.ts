// lib/pwa/manifest/buildRestaurantManifest.ts

export function buildRestaurantManifest(restaurant: any) {
  // 🛠️ PRIORIDAD DE ICONO: 
  // 1. Icono PWA personalizado configurado en el panel
  // 2. Logo general del restaurante si no hay uno específico de PWA
  // 3. Imagen fallback por defecto del sistema
  const iconUrl = restaurant.pwa_icon_url || restaurant.logo_url || "/icon-192x192.png";

  // Extraemos los colores del themeSettings que se configuran en el panel
  // Si no existen, aplicamos los fallbacks oscuros por defecto de Wolf Ordering
  const themeColor = restaurant.themeSettings?.primaryColor || "#f97316";
  const backgroundColor = restaurant.themeSettings?.backgroundColor || "#111827";

  return {
    name: restaurant.name || "Wolf Ordering",
    short_name: restaurant.pwa_short_name || restaurant.name?.substring(0, 12) || "Wolf",
    description: restaurant.description || "Aplicación de restaurante",
    start_url: `/${restaurant.slug}/order`,
    display: "standalone",
    orientation: "portrait",
    background_color: backgroundColor,
    theme_color: themeColor,
    
    // 🛠️ REGLA CRÍTICA DE ANDROID Y CHROME:
    // Estructura exacta con dimensiones y propósitos requeridos para forzar el cambio de ícono
    icons: [
      {
        src: iconUrl,
        sizes: "192x192",
        type: "image/png",
        purpose: "any"
      },
      {
        src: iconUrl,
        sizes: "512x512",
        type: "image/png",
        purpose: "any"
      },
      {
        src: iconUrl,
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable" // Evita que Android le encaje un fondo blanco circular feo al ícono
      }
    ]
  };
}