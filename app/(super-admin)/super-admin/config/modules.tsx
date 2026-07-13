import {
  Building2,
  Plus,
  DollarSign,
  BarChart3,
  Users,
  Shield,
  KeyRound,
  Landmark,
  Megaphone,
  Smartphone,
  Settings,
} from "lucide-react";

export type DashboardModule = {
  code: string;
  title: string;
  description: string;
  href: string;
  color: string;
  category: "operation" | "settings";
  icon: React.ReactNode;
};

export const dashboardModules: DashboardModule[] = [
  {
    code: "restaurants",
    title: "Restaurantes",
    description:
      "Administra todos los restaurantes registrados en la plataforma.",
    href: "/super-admin/restaurants",
    color: "#f97316",
    category: "operation",
    icon: <Building2 size={34} />,
  },

  {
    code: "restaurant_new",
    title: "Nuevo Restaurante",
    description:
      "Registrar un nuevo restaurante dentro del ecosistema.",
    href: "/super-admin/restaurants/new",
    color: "#22c55e",
    category: "operation",
    icon: <Plus size={34} />,
  },

  {
    code: "legal",
    title: "Centro Legal",
    description:
      "Contratos, políticas, términos y documentos legales.",
    href: "/super-admin/legal",
    color: "#6366f1",
    category: "operation",
    icon: <Shield size={34} />,
  },

];