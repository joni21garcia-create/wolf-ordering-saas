export type SettingsCategory =
  | "Experiencia"
  | "Operación"
  | "Negocio"
  | "Administración"
  | "Sistema";

export interface SettingsModule {
  id: string;

  title: string;

  description: string;

  icon: string;

  category: SettingsCategory;

  href: string;

  permission: string;

  color: string;

  featured?: boolean;
}

export interface CategoryTab {
  id:
    | "Todos"
    | SettingsCategory;

  label: string;
}

export interface QuickAction {
  title: string;

  icon: string;

  href: string;

  color: string;
}

export interface SettingsStatsData {
  totalModules: number;

  configuredModules: number;

  pendingModules: number;

  categories: number;
}