"use client";

import { useParams, useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { useState, useEffect, useMemo } from "react";

// =====================================================
// 1. MAPEO Y CONFIGURACIONES ESTÁTICAS
// =====================================================
const MODULE_MAP: Record<string, string> = {
  About: "about",
  Categorías: "categories",
  "Configuración Financiera": "financial",
  CTA: "cta",
  "Editar Restaurante": "restaurant_edit",
  Finanzas: "finance",
  Footer: "footer",
  Galería: "gallery",
  Hero: "hero",
  Horarios: "schedule",
  "Historial Pedidos": "history",
  "Listado Restaurantes": "restaurants",
  Marketing: "marketing",
  Navbar: "navbar",
  "Nuevo Restaurante": "restaurant_new",
  "Orders Analytics Global": "analytics",
  Pagos: "payments",
  Pedidos: "orders",
  "Pedidos Cancelados": "cancelled",
  Permisos: "permissions",
  Productos: "products",
  PWA: "pwa",
  Roles: "roles",
  Servicios: "services",
  "Servicios Restaurant": "serviciosrestaurant",
  Socials: "socials",
  Themes: "themes",
  Ubicación: "location",
  Usuarios: "users",
};

const CATEGORIES = ["Todos", "Experiencia", "Operación", "Negocio", "Administración", "Sistema"] as const;

const CATEGORY_COLORS: Record<string, { bg: string; color: string }> = {
  Experiencia: { bg: "rgba(59,130,246,.12)", color: "#60a5fa" },
  Operación: { bg: "rgba(34,197,94,.12)", color: "#4ade80" },
  Negocio: { bg: "rgba(249,115,22,.12)", color: "#f97316" },
  Administración: { bg: "rgba(168,85,247,.12)", color: "#a855f7" },
  Sistema: { bg: "rgba(236,72,153,.12)", color: "#ec4899" },
};

// =====================================================
// 2. COMPONENTE PRINCIPAL
// =====================================================
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

  // Módulos base organizados estructuradamente por su categoría correspondiente
  const allModules = useMemo(() => [
    // --- EXPERIENCIA ---
    { title: "Hero", description: "Slides, banners, botones y mensajes principales.", icon: "🎯", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/hero` },
    { title: "Navbar", description: "Logo, navegación y botón principal.", icon: "🧭", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/navbar` },
    { title: "Servicios Restaurant", description: "Iconos, ventajas y servicios destacados.", icon: "⭐", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant` },
    { title: "CTA", description: "Llamados a la acción y conversión.", icon: "🚀", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/CTA` },
    { title: "About", description: "Historia, estadísticas y presentación.", icon: "📖", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/about` },
    { title: "Footer", description: "Copyright, branding y datos finales.", icon: "📄", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/footer` },
    { title: "Socials", description: "Instagram, Facebook, TikTok y redes.", icon: "📱", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/socials` },
    { title: "Themes", description: "Colores, fuentes, efectos y estilos.", icon: "🎨", category: "Experiencia", href: `/super-admin/restaurants/${restaurantId}/settings/themes` },
    
    // --- OPERACIÓN ---
    { title: "Productos", description: "Administra menú, precios y disponibilidad.", icon: "🍔", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/products` },
    { title: "Categorías", description: "Organiza el menú por secciones.", icon: "📂", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/categories` },
    { title: "Galería", description: "Gestiona imágenes del restaurante.", icon: "🖼️", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/gallery` },
    { title: "Servicios", description: "Delivery, Pickup y métodos de entrega.", icon: "🚚", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/services` },
    { title: "Ubicación", description: "Mapa, coordenadas y navegación.", icon: "📍", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/location` },
    { title: "Horarios", description: "Días y horarios de atención.", icon: "🕒", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/schedule` },
    { title: "Pagos", description: "Transferencias, QR y métodos de pago.", icon: "💳", category: "Operación", href: `/super-admin/restaurants/${restaurantId}/settings/payments` },
    
    // --- NEGOCIO ---
    { title: "Configuración Financiera", description: "Comisiones, porcentajes y reglas económicas.", icon: "⚙️💰", category: "Negocio", href: `/super-admin/restaurants/${restaurantId}/settings/financial` },
    { title: "Finanzas", description: "Dashboard financiero del restaurante.", icon: "📊💰", category: "Negocio", href: `/super-admin/restaurants/${restaurantId}/finance` },
    { title: "Orders Analytics Global", description: "Métricas generales y estadísticas.", icon: "🛍️📊", category: "Negocio", href: `/admin/analytics` },
    { title: "Pedidos", description: "Administración completa de pedidos.", icon: "🔔🖥️", category: "Negocio", href: `/admin/orders` },
    { title: "Historial Pedidos", description: "Pedidos completados.", icon: "📚", category: "Negocio", href: `/admin/orders/history` },
    { title: "Pedidos Cancelados", description: "Registro de pedidos cancelados.", icon: "❌", category: "Negocio", href: `/admin/orders/cancelled` },
    
    // --- ADMINISTRACIÓN ---
    { title: "Usuarios", description: "Administración de usuarios del restaurante.", icon: "👥", category: "Administración", href: `/super-admin/restaurants/${restaurantId}/access/users` },
    { title: "Roles", description: "Roles y cargos del restaurante.", icon: "🛡️", category: "Administración", href: `/super-admin/restaurants/${restaurantId}/access/roles` },
    { title: "Permisos", description: "Permisos por módulo y acceso.", icon: "🔐", category: "Administración", href: `/super-admin/restaurants/${restaurantId}/access/permissions` },
    
    // --- SISTEMA ---
    { title: "Editar Restaurante", description: "Configuración principal del restaurante.", icon: "✏️", category: "Sistema", href: `/super-admin/restaurants/${restaurantId}/edit` },
    { title: "Listado Restaurantes", description: "Volver al listado general.", icon: "🏪", category: "Sistema", href: `/super-admin/restaurants` },
    { title: "Nuevo Restaurante", description: "Crear restaurante Crypto / fiat nuevo.", icon: "➕", category: "Sistema", href: `/super-admin/restaurants/new` },
    { title: "PWA", description: "Configura la Progressive Web App, iconos, colores, manifest y apariencia.", icon: "📲", category: "Sistema", href: `/super-admin/restaurants/${restaurantId}/settings/pwa` },
    { title: "Marketing", description: "Código QR, material promocional y herramientas para compartir el restaurante.", icon: "📣", category: "Sistema", href: `/super-admin/restaurants/${restaurantId}/settings/marketing` },
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
    <main style={mainContainerStyle}>
      
      {/* HEADER PRINCIPAL */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ color: "#71717a", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>Wolf Ordering / Restaurante / Panel</p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 40px)", fontWeight: "900", margin: 0, letterSpacing: "-1px" }}>Configuración del Sistema</h1>
      </div>

      {/* CONTROLES DE NAVEGACIÓN (Buscador + Filtros) */}
      <div style={controlsCardStyle}>
        
        {/* Input de Búsqueda Predictiva */}
        <div style={{ position: "relative", width: "100%" }}>
          <span style={searchIconStyle}>🔍</span>
          <input 
            type="text"
            placeholder="Buscar módulo por nombre o descripción... (Ej: Marketing, Horarios, PWA)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={searchInputStyle}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery("")} style={clearSearchBtnStyle}>✕</button>
          )}
        </div>

        {/* Pestañas de Categoría Desplazables */}
        <div style={categoryTabsWrapperStyle}>
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  ...tabBtnStyle,
                  border: isActive ? "1px solid #f97316" : "1px solid rgba(255,255,255,0.06)",
                  background: isActive ? "rgba(249,115,22,0.12)" : "rgba(255,255,255,0.03)",
                  color: isActive ? "#f97316" : "#a1a1aa",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* RECUENTO DE RESULTADOS */}
      <div style={{ marginBottom: "20px", fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: "500", letterSpacing: "0.2px" }}>
        Mostrando {filteredModules.length} módulos disponibles
      </div>

      {/* GRID DE MÓDULOS PREMIUM */}
      {filteredModules.length > 0 ? (
        <div style={gridStyle}>
          {filteredModules.map((module) => {
            const badge = CATEGORY_COLORS[module.category] || { bg: "#27272a", color: "#a1a1aa" };
            return (
              <div 
                key={module.title} 
                onClick={() => router.replace(module.href)} 
                style={moduleCardStyle}
              >
                <div>
                  {/* Encabezado de la tarjeta */}
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                    <span style={{ fontSize: "32px", filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}>{module.icon}</span>
                    <span style={{ ...badgeStyle, background: badge.bg, color: badge.color }}>
                      {module.category}
                    </span>
                  </div>
                  
                  <h3 style={{ margin: "0 0 8px 0", color: "#fff", fontSize: "16px", fontWeight: "700", letterSpacing: "-0.3px" }}>
                    {module.title}
                  </h3>
                  
                  <p style={{ color: "rgba(255,255,255,0.5)", lineHeight: "1.5", margin: "0 0 24px 0", fontSize: "13px", fontWeight: "400" }}>
                    {module.description}
                  </p>
                </div>

                <div style={{ color: "#f97316", fontWeight: "600", fontSize: "13px", display: "flex", alignItems: "center", gap: "4px" }}>
                  Configurar →
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* ESTADO COMPONENTE VACÍO */
        <div style={emptyStateStyle}>
          <p style={{ fontSize: "32px", margin: "0 0 12px 0" }}>🕵️‍♂️</p>
          <h3 style={{ margin: "0 0 6px 0", color: "#fff", fontSize: "18px", fontWeight: "700" }}>No se encontraron módulos</h3>
          <p style={{ color: "rgba(255,255,255,0.4)", margin: 0, fontSize: "14px" }}>Prueba cambiando la categoría o ajustando los términos de búsqueda.</p>
        </div>
      )}
    </main>
  );
}

// =====================================================
// 3. ARQUITECTURA DE ESTILOS LIMPIOS
// =====================================================
const mainContainerStyle = { 
  maxWidth: "1600px", 
  margin: "0 auto", 
  padding: "clamp(24px, 5vw, 50px)", 
  background: "#060606", 
  color: "#fff" 
};

const controlsCardStyle = { 
  display: "flex", 
  flexDirection: "column" as const, 
  gap: "20px", 
  marginBottom: "32px",
  background: "rgba(20, 20, 22, 0.6)",
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  padding: "24px",
  borderRadius: "24px",
  border: "1px solid rgba(255,255,255,0.05)"
};

const searchIconStyle = { 
  position: "absolute" as const, 
  left: "18px", 
  top: "50%", 
  transform: "translateY(-50%)", 
  color: "#71717a", 
  fontSize: "18px" 
};

const searchInputStyle = {
  width: "100%",
  height: "52px",
  background: "#0b0b0c",
  border: "1px solid rgba(255,255,255,0.06)",
  borderRadius: "14px",
  padding: "0 16px 0 52px",
  color: "#fff",
  fontSize: "14px",
  fontWeight: "500",
  outline: "none",
  boxSizing: "border-box" as const,
  transition: "all 0.2s ease"
};

const clearSearchBtnStyle = { 
  position: "absolute" as const, 
  right: "18px", 
  top: "50%", 
  transform: "translateY(-50%)", 
  background: "none", 
  border: "none", 
  color: "#71717a", 
  cursor: "pointer", 
  fontSize: "14px" 
};

const categoryTabsWrapperStyle = { 
  display: "flex", 
  gap: "10px", 
  overflowX: "auto" as const, 
  paddingBottom: "4px",
  scrollbarWidth: "none" as const,
  WebkitOverflowScrolling: "touch" as const
};

const tabBtnStyle = {
  padding: "10px 18px",
  borderRadius: "12px",
  fontSize: "13px",
  fontWeight: "600" as const,
  whiteSpace: "nowrap" as const,
  cursor: "pointer",
  transition: "all 0.2s ease"
};

const gridStyle = { 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 330px), 1fr))", 
  gap: "20px" 
};

const moduleCardStyle = { 
  cursor: "pointer",
  background: "rgba(18, 18, 20, 0.4)",
  backdropFilter: "blur(10px)",
  border: "1px solid rgba(255,255,255,0.04)",
  borderRadius: "20px",
  padding: "24px",
  display: "flex",
  flexDirection: "column" as const,
  justifyContent: "space-between",
  transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
  boxSizing: "border-box" as const
};

const badgeStyle = { 
  padding: "4px 12px", 
  borderRadius: "8px", 
  fontSize: "10px", 
  fontWeight: "700" as const, 
  letterSpacing: "0.5px",
  textTransform: "uppercase" as const
};

const emptyStateStyle = { 
  textAlign: "center" as const, 
  padding: "80px 20px", 
  background: "rgba(18, 18, 20, 0.5)", 
  borderRadius: "24px", 
  border: "1px solid rgba(255,255,255,0.04)" 
};