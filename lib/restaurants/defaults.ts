/*
======================================================
RESTAURANT WIZARD
DEFAULTS
======================================================
*/

export const RESTAURANT_WIZARD_STEPS = [
  {
    id: 1,
    title: "Información",
    description:
      "Información general del restaurante.",
  },

  {
    id: 2,
    title: "Ubicación",
    description:
      "Dirección y ubicación del restaurante.",
  },

  {
    id: 3,
    title: "Branding",
    description:
      "Logo, colores e identidad visual.",
  },

  {
    id: 4,
    title: "Plan",
    description:
      "Plan comercial y configuración inicial.",
  },

  {
    id: 5,
    title: "Agreement",
    description:
      "Contrato comercial Wolf Ordering.",
  },

  {
    id: 6,
    title: "Firma",
    description:
      "Aceptación y firma electrónica.",
  },

  {
    id: 7,
    title: "Finalizar",
    description:
      "Crear restaurante.",
  },
] as const;

/*
======================================================
PLANES
======================================================
*/

export const RESTAURANT_PLANS = [
  "Starter",

  "Business",

  "Premium",

  "Enterprise",
] as const;

/*
======================================================
VERSION AGREEMENT
======================================================
*/

export const CURRENT_AGREEMENT_VERSION =
  "1.0";

/*
======================================================
DEFAULT MODULES
======================================================
*/

export const DEFAULT_MODULES = {
  analytics: true,

  finance: true,

  settings: true,

  pwa: true,

  landing: true,

  menu: true,

  orders: true,

  delivery: true,

  schedule: true,

  services: true,
};

/*
======================================================
DEFAULT THEME
======================================================
*/

export const DEFAULT_THEME = {
  primary: "#f97316",

  secondary: "#111827",

  background: "#050505",
};