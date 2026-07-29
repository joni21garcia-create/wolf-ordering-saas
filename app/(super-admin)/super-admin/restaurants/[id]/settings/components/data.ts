import {
  CategoryTab,
  QuickAction,
  SettingsModule,
} from "./types";

export const CATEGORY_TABS: CategoryTab[] = [
  {
    id: "Todos",
    label: "Todos",
  },
  {
    id: "Experiencia",
    label: "Experiencia",
  },
  {
    id: "Operación",
    label: "Operación",
  },
  {
    id: "Negocio",
    label: "Negocio",
  },
  {
    id: "Administración",
    label: "Administración",
  },
  {
    id: "Sistema",
    label: "Sistema",
  },
];

export function getQuickActions(
  restaurantId: string
): QuickAction[] {
  return [
    {
      title: "Pedidos",
      icon: "🔔",
      href: `/admin/orders/${restaurantId}/orders`,
      color: "#f97316",
    },
    {
      title: "Analytics",
      icon: "📈",
      href: `/admin/orders/${restaurantId}/orders/analytics`,
      color: "#3b82f6",
    },
    {
      title: "Finanzas",
      icon: "💰",
      href: `/super-admin/restaurants/${restaurantId}/finance`,
      color: "#22c55e",
    },
    {
      title: "Marketing",
      icon: "📣",
      href: `/super-admin/restaurants/${restaurantId}/settings/marketing`,
      color: "#ec4899",
    },
    {
      title: "PWA",
      icon: "📲",
      href: `/super-admin/restaurants/${restaurantId}/settings/pwa`,
      color: "#8b5cf6",
    },
  ];
}

export function getSettingsModules(
  restaurantId: string
): SettingsModule[] {
  return [

    // =====================================================
    // EXPERIENCIA
    // =====================================================

    {
      id: "hero",
      title: "Hero",
      description: "Slides, banners y mensajes principales.",
      icon: "🎯",
      category: "Experiencia",
      href: `/super-admin/restaurants/${restaurantId}/settings/hero`,
      permission: "hero",
      color: "#3b82f6",
      featured: true,
    },

    {
      id: "navbar",
      title: "Navbar",
      description: "Logo y navegación principal.",
      icon: "🧭",
      category: "Experiencia",
      href: `/super-admin/restaurants/${restaurantId}/settings/navbar`,
      permission: "navbar",
      color: "#3b82f6",
      featured: true,
    },

    {
      id: "serviciosrestaurant",
      title: "Servicios Restaurant",
      description: "Beneficios e iconos destacados.",
      icon: "⭐",
      category: "Experiencia",
      href: `/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant`,
      permission: "serviciosrestaurant",
      color: "#3b82f6",
    },

    {
      id: "cta",
      title: "CTA",
      description: "Botones y llamadas a la acción.",
      icon: "🚀",
      category: "Experiencia",
      href: `/super-admin/restaurants/${restaurantId}/settings/cta`,
      permission: "cta",
      color: "#3b82f6",
    },

    {
      id: "about",
      title: "About",
      description: "Historia y presentación.",
      icon: "📖",
      category: "Experiencia",
      href: `/super-admin/restaurants/${restaurantId}/settings/about`,
      permission: "about",
      color: "#3b82f6",
    },

    {
      id: "footer",
      title: "Footer",
      description: "Branding y datos finales.",
      icon: "📄",
      category: "Experiencia",
      href: `/super-admin/restaurants/${restaurantId}/settings/footer`,
      permission: "footer",
      color: "#3b82f6",
    },

    {
      id: "socials",
      title: "Socials",
      description: "Redes sociales y contacto.",
      icon: "📱",
      category: "Experiencia",
      href: `/super-admin/restaurants/${restaurantId}/settings/socials`,
      permission: "socials",
      color: "#3b82f6",
    },

    {
      id: "themes",
      title: "Themes",
      description: "Colores y tipografía.",
      icon: "🎨",
      category: "Experiencia",
      href: `/super-admin/restaurants/${restaurantId}/settings/themes`,
      permission: "themes",
      color: "#3b82f6",
    },

    // =====================================================
    // OPERACIÓN
    // =====================================================

    {
      id: "products",
      title: "Productos",
      description: "Menú, precios y disponibilidad.",
      icon: "🍔",
      category: "Operación",
      href: `/super-admin/restaurants/${restaurantId}/settings/products`,
      permission: "products",
      color: "#22c55e",
      featured: true,
    },

    {
      id: "categories",
      title: "Categorías",
      description: "Secciones del menú.",
      icon: "📂",
      category: "Operación",
      href: `/super-admin/restaurants/${restaurantId}/settings/categories`,
      permission: "categories",
      color: "#22c55e",
    },

    {
      id: "gallery",
      title: "Galería",
      description: "Imágenes del restaurante.",
      icon: "🖼️",
      category: "Operación",
      href: `/super-admin/restaurants/${restaurantId}/settings/gallery`,
      permission: "gallery",
      color: "#22c55e",
    },

    {
      id: "services",
      title: "Servicios",
      description: "Delivery, Pickup y entregas.",
      icon: "🚚",
      category: "Operación",
      href: `/super-admin/restaurants/${restaurantId}/settings/services`,
      permission: "services",
      color: "#22c55e",
    },

    {
      id: "location",
      title: "Ubicación",
      description: "Mapa y navegación.",
      icon: "📍",
      category: "Operación",
      href: `/super-admin/restaurants/${restaurantId}/settings/location`,
      permission: "location",
      color: "#22c55e",
    },

    {
      id: "schedule",
      title: "Horarios",
      description: "Días y horarios de atención.",
      icon: "🕒",
      category: "Operación",
      href: `/super-admin/restaurants/${restaurantId}/settings/schedule`,
      permission: "schedule",
      color: "#22c55e",
    },

    {
      id: "payments",
      title: "Pagos",
      description: "Transferencias y métodos.",
      icon: "💳",
      category: "Operación",
      href: `/super-admin/restaurants/${restaurantId}/settings/payments`,
      permission: "payments",
      color: "#22c55e",
    },

{
  id: "discover",
  title: "Discover",
  description: "Controla la visibilidad del restaurante en Discover.",
  icon: "🔎",
  category: "Operación",
  href: `/super-admin/restaurants/${restaurantId}/settings/discover`,
  permission: "discover",
  color: "#22c55e",
  featured: true,
},

    // =====================================================
    // NEGOCIO
    // =====================================================

    {
      id: "financial",
      title: "Configuración Financiera",
      description: "Comisiones y reglas.",
      icon: "⚙️",
      category: "Negocio",
      href: `/super-admin/restaurants/${restaurantId}/settings/financial`,
      permission: "financial",
      color: "#f97316",
      featured: true,
    },

    {
      id: "finance",
      title: "Finanzas",
      description: "Dashboard financiero.",
      icon: "💰",
      category: "Negocio",
      href: `/super-admin/restaurants/${restaurantId}/finance`,
      permission: "finance",
      color: "#f97316",
    },

    {
      id: "marketing",
      title: "Marketing",
      description: "QR, campañas y material promocional.",
      icon: "📣",
      category: "Negocio",
      href: `/super-admin/restaurants/${restaurantId}/settings/marketing`,
      permission: "marketing",
      color: "#f97316",
      featured: true,
    },

    {
      id: "analytics",
      title: "Orders Analytics Global",
      description: "Métricas generales.",
      icon: "📈",
      category: "Negocio",
      href: `/admin/orders/${restaurantId}/orders/analytics`,
      permission: "analytics",
      color: "#f97316",
    },

    {
      id: "orders",
      title: "Pedidos",
      description: "Panel central de pedidos.",
      icon: "🔔",
      category: "Negocio",
      href: `/admin/orders/${restaurantId}/orders`,
      permission: "orders",
      color: "#f97316",
      featured: true,
    },

    {
      id: "history",
      title: "Historial Pedidos",
      description: "Pedidos completados.",
      icon: "📚",
      category: "Negocio",
      href: `/admin/orders/${restaurantId}/orders/history`,
      permission: "history",
      color: "#f97316",
    },

    {
      id: "cancelled",
      title: "Pedidos Cancelados",
      description: "Registro de cancelaciones.",
      icon: "❌",
      category: "Negocio",
      href: `/admin/orders/${restaurantId}/orders/cancelled`,
      permission: "cancelled",
      color: "#f97316",
    },
    // =====================================================
    // ADMINISTRACIÓN
    // =====================================================

    {
      id: "users",
      title: "Usuarios",
      description: "Gestión de personal.",
      icon: "👥",
      category: "Administración",
      href: `/super-admin/restaurants/${restaurantId}/access/users`,
      permission: "users",
      color: "#8b5cf6",
    },

    {
      id: "roles",
      title: "Roles",
      description: "Cargos del restaurante.",
      icon: "🛡️",
      category: "Administración",
      href: `/super-admin/restaurants/${restaurantId}/access/roles`,
      permission: "roles",
      color: "#8b5cf6",
    },

    {
      id: "permissions",
      title: "Permisos",
      description: "Acceso a módulos.",
      icon: "🔐",
      category: "Administración",
      href: `/super-admin/restaurants/${restaurantId}/access/permissions`,
      permission: "permissions",
      color: "#8b5cf6",
      featured: true,
    },

    {
      id: "legal",
      title: "Centro Legal",
      description:
        "Acuerdos, términos, políticas y documentos legales.",
      icon: "⚖️",
      category: "Administración",
      href: "/super-admin/legal",
      permission: "legal",
      color: "#6366f1",
      featured: true,
    },

    // =====================================================
    // SISTEMA
    // =====================================================

    {
      id: "restaurant_edit",
      title: "Editar Restaurante",
      description: "Configuración principal.",
      icon: "✏️",
      category: "Sistema",
      href: `/super-admin/restaurants/${restaurantId}/edit`,
      permission: "restaurant_edit",
      color: "#ec4899",
    },

    {
      id: "restaurants",
      title: "Listado Restaurantes",
      description: "Volver al listado.",
      icon: "🏪",
      category: "Sistema",
      href: `/super-admin/restaurants`,
      permission: "restaurants",
      color: "#ec4899",
      featured: true,
    },

    {
      id: "restaurant_new",
      title: "Nuevo Restaurante",
      description: "Crear restaurante.",
      icon: "➕",
      category: "Sistema",
      href: `/super-admin/restaurants/new`,
      permission: "restaurant_new",
      color: "#ec4899",
      featured: true,
    },

    {
      id: "pwa",
      title: "PWA",
      description: "Aplicación e instalación.",
      icon: "📲",
      category: "Sistema",
      href: `/super-admin/restaurants/${restaurantId}/settings/pwa`,
      permission: "pwa",
      color: "#ec4899",
      featured: true,
    },

  ];
}