"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { useState, useEffect } from "react";

export default function RestaurantSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const { user } = useSession();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const permissions = user?.permissions || [];

  const allModules = [
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
    { title: "PWA", description: "Configura la Progressive Web App, iconos, colores, manifest y apariencia.", icon: "📲", category: "Sistema", href: `/super-admin/restaurants/${restaurantId}/settings/pwa` },
  ];

  const modules = allModules.filter((module) => {
    const moduleMap: Record<string, string> = {
      Hero: "hero", Navbar: "navbar", "Servicios Restaurant": "serviciosrestaurant", CTA: "cta", About: "about", Footer: "footer", Socials: "socials", Themes: "themes",
      Productos: "products", Categorías: "categories", Galería: "gallery", Servicios: "services", Ubicación: "location", Horarios: "schedule", Pagos: "payments",
      "Configuración Financiera": "financial", Finanzas: "finance", "Orders Analytics Global": "analytics", Pedidos: "orders", "Historial Pedidos": "history", "Pedidos Cancelados": "cancelled",
      Usuarios: "users", Roles: "roles", Permisos: "permissions", "Editar Restaurante": "restaurant_edit", "Nuevo Restaurante": "restaurant_new", "Listado Restaurantes": "restaurants", PWA: "pwa",
    };
    return permissions.includes(moduleMap[module.title]);
  });

  if (!isMounted) return null;

  return (
    <main style={{ maxWidth: "1600px", margin: "0 auto", padding: "clamp(16px, 5vw, 40px)", color: "#fff" }}>
      <div style={{ marginBottom: "40px" }}>
        <p style={{ color: "#777", marginBottom: "10px", fontSize: "clamp(12px, 2vw, 16px)" }}>Wolf Ordering / Restaurante / Configuración</p>
        <h1 style={{ fontSize: "clamp(28px, 6vw, 52px)", fontWeight: "800", margin: 0 }}>Configuración Restaurante</h1>
        <p style={{ color: "#999", marginTop: "12px", maxWidth: "700px", lineHeight: 1.6, fontSize: "clamp(14px, 2vw, 16px)" }}>
          Administra todos los aspectos del restaurante desde un único lugar: menú, pagos, delivery, horarios, comisiones y experiencia del cliente.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
        {modules.map((module) => (
          <div key={module.title} onClick={() => router.replace(module.href)} style={{ cursor: "pointer" }}>
            <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "24px", height: "100%", backdropFilter: "blur(20px)", display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: "40px", marginBottom: "18px" }}>{module.icon}</div>
              <div style={{ display: "inline-flex", width: "fit-content", padding: "4px 12px", borderRadius: "999px", fontSize: "11px", fontWeight: "700", marginBottom: "15px", 
                background: module.category === "Experiencia" ? "rgba(59,130,246,.15)" : module.category === "Operación" ? "rgba(34,197,94,.15)" : module.category === "Negocio" ? "rgba(249,115,22,.15)" : module.category === "Administración" ? "rgba(168,85,247,.15)" : "rgba(236,72,153,.15)",
                color: module.category === "Experiencia" ? "#60a5fa" : module.category === "Operación" ? "#4ade80" : module.category === "Negocio" ? "#f97316" : module.category === "Administración" ? "#a855f7" : "#ec4899"
              }}>
                {module.category}
              </div>
              <h2 style={{ margin: 0, marginBottom: "12px", color: "#fff", fontSize: "20px" }}>{module.title}</h2>
              <p style={{ color: "#888", lineHeight: 1.6, marginBottom: "25px", fontSize: "14px", flexGrow: 1 }}>{module.description}</p>
              <div style={{ color: "#f97316", fontWeight: "700", fontSize: "14px" }}>Abrir módulo →</div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}