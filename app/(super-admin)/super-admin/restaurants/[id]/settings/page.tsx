"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { useState, useEffect, useMemo } from "react";

// =====================================================
// MAPEO Y ESTILOS ESTÁTICOS
// =====================================================
const MODULE_MAP: Record<string, string> = {
  Hero: "hero", Navbar: "navbar", "Servicios Restaurant": "serviciosrestaurant", CTA: "cta", About: "about", Footer: "footer", Socials: "socials", Themes: "themes",
  Productos: "products", Categorías: "categories", Galería: "gallery", Servicios: "services", Ubicación: "location", Horarios: "schedule", Pagos: "payments",
  "Configuración Financiera": "financial", Finanzas: "finance", "Orders Analytics Global": "analytics", Pedidos: "orders", "Historial Pedidos": "history", "Pedidos Cancelados": "cancelled",
  Usuarios: "users", Roles: "roles", Permisos: "permissions", "Editar Restaurante": "restaurant_edit", "Nuevo Restaurante": "restaurant_new", "Listado Restaurantes": "restaurants", PWA: "pwa",
};

const CATEGORIES = ["Todos", "Experiencia", "Operación", "Negocio", "Administración", "Sistema"] as const;

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Experiencia: { bg: "rgba(59,130,246,.12)", color: "#60a5fa" },
  Operación: { bg: "rgba(34,197,94,.12)", color: "#4ade80" },
  Negocio: { bg: "rgba(249,115,22,.12)", color: "#f97316" },
  Administración: { bg: "rgba(168,85,247,.12)", color: "#a855f7" },
  Sistema: { bg: "rgba(236,72,153,.12)", color: "#ec4899" },
};

export default function RestaurantSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.id as string;
  const { user } = useSession();
  
  // Estados de UI
  const [isMounted, setIsMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<typeof CATEGORIES[number]>("Todos");

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const permissions = user?.permissions || [];

  // Módulos base
  const allModules = useMemo(() => [
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
    { title: "Nuevo Restaurante", description: "Crear restaurante Crypto / fiat nuevo.", icon: "➕", category: "Sistema", href: `/super-admin/restaurants/new` },
    { title: "PWA", description: "Configura la Progressive Web App, iconos, colores, manifest y apariencia.", icon: "📲", category: "Sistema", href: `/super-admin/restaurants/${restaurantId}/settings/pwa` },
  ], [restaurantId]);

  // Filtrado reactivo optimizado (Permisos + Categoría + Búsqueda)
  const filteredModules = useMemo(() => {
    return allModules.filter((module) => {
      const hasPermission = permissions.includes(MODULE_MAP[module.title]);
      const matchesCategory = activeCategory === "Todos" || module.category === activeCategory;
      const matchesSearch = 
        module.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        module.description.toLowerCase().includes(searchQuery.toLowerCase());
      
      return hasPermission && matchesCategory && matchesSearch;
    });
  }, [allModules, permissions, activeCategory, searchQuery]);

  if (!isMounted) return null;

  return (
    <main style={{ maxWidth: "1600px", margin: "0 auto", padding: "clamp(16px, 5vw, 40px)", color: "#fff", fontFamily: "system-ui, sans-serif" }}>
      
      {/* HEADER PRINCIPAL */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ color: "#71717a", marginBottom: "8px", fontSize: "14px" }}>Wolf Ordering / Restaurante / Panel</p>
        <h1 style={{ fontSize: "clamp(26px, 5vw, 38px)", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>Configuración del Sistema</h1>
      </div>

      {/* CONTROLES DE NAVEGACIÓN (Buscador + Filtros) */}
      <div style={{ 
        display: "flex", 
        flexDirection: "column", 
        gap: "16px", 
        marginBottom: "32px",
        background: "#111113",
        padding: "20px",
        borderRadius: "20px",
        border: "1px solid #222226"
      }}>
        
        {/* Input de Búsqueda Predictiva */}
        <div style={{ position: "relative", width: "100%" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#71717a", fontSize: "18px" }}>🔍</span>
          <input 
            type="text"
            placeholder="Buscar módulo por nombre o descripción... (Ej: PWA, Horarios, Pedidos)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              height: "48px",
              background: "#18181b",
              border: "1px solid #27272a",
              borderRadius: "12px",
              padding: "0 16px 0 48px",
              color: "#fff",
              fontSize: "14px",
              outline: "none",
              boxSizing: "border-box",
              transition: "border-color 0.2s"
            }}
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery("")}
              style={{ position: "absolute", right: "16px", top: "50%", transform: "translateY(-50%)", background: "none", border: "none", color: "#71717a", cursor: "pointer", fontSize: "14px" }}
            >
              ✕
            </button>
          )}
        </div>

        {/* Pestañas de Categoría Desplazables */}
        <div style={{ 
          display: "flex", 
          gap: "8px", 
          overflowX: "auto", 
          paddingBottom: "4px",
          scrollbarWidth: "none",
          WebkitOverflowScrolling: "touch"
        }}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "10px",
                  fontSize: "13px",
                  fontWeight: "600",
                  whiteSpace: "nowrap",
                  cursor: "pointer",
                  border: isActive ? "1px solid #f97316" : "1px solid #27272a",
                  background: isActive ? "rgba(249,115,22,0.15)" : "#18181b",
                  color: isActive ? "#f97316" : "#a1a1aa",
                  transition: "all 0.2s"
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* RECUENTO DE RESULTADOS */}
      <div style={{ marginBottom: "16px", fontSize: "13px", color: "#71717a" }}>
        Mostrando {filteredModules.length} módulos disponibles
      </div>

      {/* GRID DE MÓDULOS OPTIMIZADO */}
      {filteredModules.length > 0 ? (
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 310px), 1fr))", 
          gap: "16px" 
        }}>
          {filteredModules.map((module) => {
            const badge = CATEGORY_COLORS[module.category] || { bg: "#27272a", color: "#a1a1aa" };
            return (
              <div 
                key={module.title} 
                onClick={() => router.replace(module.href)} 
                style={{ 
                  cursor: "pointer",
                  background: "#141416",
                  border: "1px solid #222226",
                  borderRadius: "16px",
                  padding: "20px",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  transition: "transform 0.15s ease, border-color 0.15s ease",
                  boxSizing: "border-box"
                }}
              >
                <div>
                  {/* Encabezado de la tarjeta */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                    <span style={{ fontSize: "28px" }}>{module.icon}</span>
                    <span style={{ 
                      padding: "3px 10px", 
                      borderRadius: "6px", 
                      fontSize: "10px", 
                      fontWeight: "700", 
                      background: badge.bg, 
                      color: badge.color,
                      textTransform: "uppercase"
                    }}>
                      {module.category}
                    </span>
                  </div>
                  
                  <h3 style={{ margin: "0 0 6px 0", color: "#fff", fontSize: "16px", fontWeight: "700" }}>
                    {module.title}
                  </h3>
                  
                  <p style={{ color: "#8a8a93", lineHeight: "1.4", margin: "0 0 20px 0", fontSize: "13px" }}>
                    {module.description}
                  </p>
                </div>

                <div style={{ color: "#f97316", fontWeight: "600", fontSize: "12.5px", display: "flex", alignItems: "center", gap: "4px" }}>
                  Configurar →
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ESTADO COMPONENTE VACÍO */
        <div style={{ textAlign: "center", padding: "60px 20px", background: "#111113", borderRadius: "16px", border: "1px solid #222226" }}>
          <p style={{ fontSize: "24px", margin: "0 0 8px 0" }}>🕵️‍♂️</p>
          <h3 style={{ margin: "0 0 4px 0", color: "#fff" }}>No se encontraron módulos</h3>
          <p style={{ color: "#71717a", margin: 0, fontSize: "14px" }}>Prueba cambiando la categoría o ajustando los términos de búsqueda.</p>
        </div>
      )}
    </main>
  );
}