import {
  ShoppingCart,
  History,
  Ban,
  BarChart3,
  DollarSign,
  Users,
  Shield,
  KeyRound,
  Package,
  Grid2X2,
  Image,
  MapPin,
  Clock3,
  CreditCard,
  Palette,
  Smartphone,
  Megaphone,
  Home,
  Layout,
  MessageCircle,
  Settings,
  ClipboardList,
} from "lucide-react";

export type DashboardModule = {
  code: string;
  title: string;
  description: string;
  href: (restaurantId: string) => string;
  color: string;
  category: "operation" | "settings";
  icon: React.ReactNode;
};

export const dashboardModules: DashboardModule[] = [
  {
    code: "orders",
    title: "Pedidos",
    description: "Gestiona pedidos en tiempo real.",
    category: "operation",
    color: "#f97316",
    icon: <ShoppingCart size={34} />,
    href: (id) => `/admin/orders/${id}/orders`,
  },

  {
    code: "history",
    title: "Historial",
    description: "Consulta pedidos finalizados.",
    category: "operation",
    color: "#3b82f6",
    icon: <History size={34} />,
    href: (id) => `/admin/orders/${id}/orders/history`,
  },

  {
    code: "cancelled",
    title: "Cancelados",
    description: "Pedidos cancelados.",
    category: "operation",
    color: "#ef4444",
    icon: <Ban size={34} />,
    href: (id) => `/admin/orders/${id}/orders/cancelled`,
  },

  {
    code: "analytics",
    title: "Analytics",
    description: "Analiza el rendimiento.",
    category: "operation",
    color: "#8b5cf6",
    icon: <BarChart3 size={34} />,
    href: (id) => `/admin/orders/${id}/orders/analytics`,
  },

  {
    code: "finance",
    title: "Finanzas",
    description: "Control financiero.",
    category: "operation",
    color: "#22c55e",
    icon: <DollarSign size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/finance`,
  },

  {
    code: "users",
    title: "Usuarios",
    description: "Administra usuarios del restaurante.",
    category: "settings",
    color: "#3b82f6",
    icon: <Users size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/access/users`,
  },

  {
    code: "roles",
    title: "Roles",
    description: "Gestiona roles del sistema.",
    category: "settings",
    color: "#8b5cf6",
    icon: <Shield size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/access/roles`,
  },

  {
    code: "permissions",
    title: "Permisos",
    description: "Configura permisos por rol.",
    category: "settings",
    color: "#ef4444",
    icon: <KeyRound size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/access/permissions`,
  },

  {
    code: "products",
    title: "Productos",
    description: "Administra el menú.",
    category: "settings",
    color: "#f97316",
    icon: <Package size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/products`,
  },

  {
    code: "categories",
    title: "Categorías",
    description: "Organiza el menú.",
    category: "settings",
    color: "#06b6d4",
    icon: <Grid2X2 size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/categories`,
  },

  {
    code: "gallery",
    title: "Galería",
    description: "Imágenes del restaurante.",
    category: "settings",
    color: "#ec4899",
    icon: <Image size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/gallery`,
  },

  {
    code: "location",
    title: "Ubicación",
    description: "Dirección y mapa.",
    category: "settings",
    color: "#22c55e",
    icon: <MapPin size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/location`,
  },

  {
    code: "schedule",
    title: "Horarios",
    description: "Configura horarios.",
    category: "settings",
    color: "#f59e0b",
    icon: <Clock3 size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/schedule`,
  },

  {
    code: "payments",
    title: "Pagos",
    description: "Métodos de pago.",
    category: "settings",
    color: "#22c55e",
    icon: <CreditCard size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/payments`,
  },

  {
    code: "themes",
    title: "Tema",
    description: "Personaliza la apariencia.",
    category: "settings",
    color: "#a855f7",
    icon: <Palette size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/themes`,
  },

  {
    code: "pwa",
    title: "PWA",
    description: "Configuración de la aplicación.",
    category: "settings",
    color: "#14b8a6",
    icon: <Smartphone size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/pwa`,
  },

  {
    code: "marketing",
    title: "Marketing",
    description: "Promociones y campañas.",
    category: "settings",
    color: "#f43f5e",
    icon: <Megaphone size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/marketing`,
  },

  {
    code: "hero",
    title: "Hero",
    description: "Portada principal.",
    category: "settings",
    color: "#f97316",
    icon: <Home size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/hero`,
  },

  {
    code: "navbar",
    title: "Navbar",
    description: "Barra de navegación.",
    category: "settings",
    color: "#3b82f6",
    icon: <Layout size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/navbar`,
  },

  {
    code: "socials",
    title: "Redes Sociales",
    description: "Redes y contacto.",
    category: "settings",
    color: "#ec4899",
    icon: <MessageCircle size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/socials`,
  },

  {
    code: "services",
    title: "Servicios",
    description: "Servicios operativos.",
    category: "settings",
    color: "#22c55e",
    icon: <Settings size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/services`,
  },

{
  code: "requests",
  title: "Solicitudes",
  description:
    "Gestiona solicitudes del restaurante.",
  category: "settings",
  color: "#f97316",
  icon: <ClipboardList size={34} />,
  href: (id) =>
    `/super-admin/restaurants/${id}/settings/requests`,
},

  {
    code: "serviciosrestaurant",
    title: "Servicios Restaurante",
    description: "Servicios visibles al cliente.",
    category: "settings",
    color: "#0ea5e9",
    icon: <Settings size={34} />,
    href: (id) =>
      `/super-admin/restaurants/${id}/settings/serviciosrestaurant`,
  },
];