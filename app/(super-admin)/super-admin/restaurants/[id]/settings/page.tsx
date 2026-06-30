"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";

export default function RestaurantSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const { user } = useSession();
  const permissions = user?.permissions || [];

  const allModules = [
    // (Tu array allModules permanece intacto para mantener tu lógica)
    { title: "Hero", description: "Slides, banners, botones y mensajes principales.", icon: "🎯", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/hero` },
    { title: "Navbar", description: "Logo, navegación y botón principal.", icon: "🧭", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/navbar` },
    { title: "Servicios Restaurant", description: "Iconos, ventajas y servicios destacados.", icon: "⭐", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant` },
    { title: "CTA", description: "Llamados a la acción y conversión.", icon: "🚀", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/CTA` },
    { title: "About", description: "Historia, estadísticas y presentación.", icon: "📖", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/about` },
    { title: "Footer", description: "Copyright, branding y datos finales.", icon: "📄", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/footer` },
    { title: "Socials", description: "Instagram, Facebook, TikTok y redes.", icon: "📱", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/socials` },
    { title: "Themes", description: "Colores, fuentes, efectos y estilos.", icon: "🎨", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/themes` },
    { title: "Productos", description: "Administra menú, precios y disponibilidad.", icon: "🍔", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/products` },
    { title: "Categorías", description: "Organiza el menú por secciones.", icon: "📂", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/categories` },
    { title: "Galería", description: "Gestiona imágenes del restaurante.", icon: "🖼️", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/gallery` },
    { title: "Servicios", description: "Delivery, Pickup y métodos de entrega.", icon: "🚚", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/services` },
    { title: "Ubicación", description: "Mapa, coordenadas y navegación.", icon: "📍", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/location` },
    { title: "Horarios", description: "Días y horarios de atención.", icon: "🕒", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/schedule` },
    { title: "Pagos", description: "Transferencias, QR y métodos de pago.", icon: "💳", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/payments` },
    { title: "Configuración Financiera", description: "Comisiones, porcentajes y reglas económicas.", icon: "⚙️💰", category: "Negocio", href: `/super-admin/restaurants/${restaurantId}/settings/financial` },
    { title: "Finanzas", description: "Dashboard financiero del restaurante.", icon: "📊💰", category: "Negocio", href: `/super-admin/restaurants/${restaurantId}/finance` },
    { title: "Orders Analytics Global", description: "Métricas generales y estadísticas.", icon: "🛍️📊", category: "Negocio", href: `/admin/analytics` },
    { title: "Pedidos", description: "Administración completa de pedidos.", icon: "🔔🖥️", category: "Negocio", href: `/admin/orders` },
    { title: "Historial Pedidos", description: "Pedidos completados.", icon: "📚", category: "Negocio", href: `/admin/orders/history` },
    { title: "Pedidos Cancelados", description: "Registro de pedidos cancelados.", icon: "❌", category: "Negocio", href: `/admin/orders/cancelled` },
    { title: "Usuarios", description: "Administración de usuarios del restaurante.", icon: "👥", category: "Administración", href: `/super-admin/restaurants/${restaurantId}/access/users` },
    { title: "Roles", description: "Roles y cargos del restaurante.", icon: "🛡️", category: "Administración", href: `/super-admin/restaurants/${restaurantId}/access/roles` },
    { title: "Permisos", description: "Permisos por módulo y acceso.", icon: "🔐", category: "Administración", href: `/super-admin/restaurants/${restaurantId}/access/permissions` },
    { title: "Editar Restaurante", description: "Configuración principal del restaurante.", icon: "✏️", category: "Sistema", href: `/super-admin/restaurants/${restaurantId}/edit` },
    { title: "Listado Restaurantes", description: "Volver al listado general.", icon: "🏪", category: "Sistema", href: `/super-admin/restaurants` },
    { title: "Nuevo Restaurante", description: "Crear restaurante nuevo.", icon: "➕", category: "Sistema", href: `/super-admin/restaurants/new` },
    { title: "PWA", description: "Configura la PWA, iconos, colores y manifiesto.", icon: "📲", category: "Sistema", href: `/super-admin/restaurants/${restaurantId}/settings/pwa` },
  ];

  const modules = allModules.filter((module) => {
    const moduleMap: Record<string, string> = {
      Hero: "hero", Navbar: "navbar", "Servicios Restaurant": "serviciosrestaurant", CTA: "cta", About: "about", Footer: "footer", Socials: "socials", Themes: "themes",
      Productos: "products", Categorías: "categories", Galería: "gallery", Servicios: "services", Ubicación: "location", Horarios: "schedule", Pagos: "payments",
      "Configuración Financiera": "financial", Finanzas: "finance", "Orders Analytics Global": "analytics", Pedidos: "orders", "Historial Pedidos": "history",
      "Pedidos Cancelados": "cancelled", Usuarios: "users", Roles: "roles", Permisos: "permissions", "Editar Restaurante": "restaurant_edit",
      "Nuevo Restaurante": "restaurant_new", "Listado Restaurantes": "restaurants", PWA: "pwa"
    };
    return permissions.includes(moduleMap[module.title]);
  });

  const getCategoryColor = (cat: string) => {
    const colors: Record<string, { bg: string, text: string }> = {
      Experiencia: { bg: "rgba(59,130,246,.15)", text: "#60a5fa" },
      Operación: { bg: "rgba(34,197,94,.15)", text: "#4ade80" },
      Negocio: { bg: "rgba(249,115,22,.15)", text: "#f97316" },
      Administración: { bg: "rgba(168,85,247,.15)", text: "#a855f7" },
      Sistema: { bg: "rgba(236,72,153,.15)", text: "#ec4899" }
    };
    return colors[cat] || { bg: "rgba(255,255,255,.1)", text: "#fff" };
  };

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ color: "#777", marginBottom: "8px", fontSize: "14px" }}>Wolf Ordering / Configuración</p>
        <h1 style={{ fontSize: "40px", fontWeight: "800", margin: 0 }}>Configuración de Restaurante</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {modules.map((module) => {
          const colors = getCategoryColor(module.category);
          return (
            <div key={module.title} onClick={() => router.replace(module.href)} style={{ 
                background: "rgba(17,17,17,.8)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "20px", 
                padding: "24px", cursor: "pointer", transition: "transform .2s", display: "flex", flexDirection: "column" 
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-4px)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              <div style={{ fontSize: "32px", marginBottom: "15px" }}>{module.icon}</div>
              <span style={{ display: "inline-block", padding: "4px 10px", borderRadius: "20px", fontSize: "11px", fontWeight: 700, marginBottom: "12px", background: colors.bg, color: colors.text, width: "fit-content" }}>
                {module.category}
              </span>
              <h2 style={{ margin: "0 0 8px 0", fontSize: "18px" }}>{module.title}</h2>
              <p style={{ color: "#888", fontSize: "14px", lineHeight: 1.5, flexGrow: 1 }}>{module.description}</p>
            </div>
          );
        })}
      </div>
    </main>
  );
}