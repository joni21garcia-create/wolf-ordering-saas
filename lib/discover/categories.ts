export interface DiscoverCategory {
  id: string;
  label: string;
  keywords: string[];
}

export const DISCOVER_CATEGORIES: DiscoverCategory[] = [
  {
    id: "restaurant",
    label: "Restaurante",
    keywords: [
      "restaurante",
      "comida",
      "almuerzo",
      "cena",
      "food",
    ],
  },

  {
    id: "parrilla",
    label: "Parrilla",
    keywords: [
      "parrilla",
      "carne",
      "carnes",
      "asado",
      "asados",
      "bbq",
      "costillas",
      "churrasco",
      "steak",
    ],
  },

  {
    id: "pizza",
    label: "Pizzería",
    keywords: [
      "pizza",
      "pizzas",
      "pepperoni",
      "italiana",
      "mozarella",
      "napolitana",
    ],
  },

  {
    id: "hamburguesas",
    label: "Hamburguesas",
    keywords: [
      "hamburguesa",
      "hamburguesas",
      "burger",
      "burgers",
      "papas",
      "fast food",
    ],
  },

  {
    id: "pollo",
    label: "Pollo",
    keywords: [
      "pollo",
      "broaster",
      "asado",
      "crispy",
      "fried chicken",
    ],
  },

  {
    id: "mexicana",
    label: "Comida Mexicana",
    keywords: [
      "mexicana",
      "tacos",
      "burritos",
      "quesadillas",
      "nachos",
      "enchiladas",
    ],
  },

  {
    id: "italiana",
    label: "Comida Italiana",
    keywords: [
      "italiana",
      "pasta",
      "lasaña",
      "spaghetti",
      "ravioli",
    ],
  },

  {
    id: "sushi",
    label: "Sushi",
    keywords: [
      "sushi",
      "japonesa",
      "ramen",
      "tempura",
      "nigiri",
      "roll",
    ],
  },

  {
    id: "china",
    label: "Comida China",
    keywords: [
      "china",
      "arroz chino",
      "chop suey",
      "wanton",
      "oriental",
    ],
  },

  {
    id: "mariscos",
    label: "Mariscos",
    keywords: [
      "mariscos",
      "pescado",
      "ceviche",
      "camarones",
      "langosta",
    ],
  },

  {
    id: "cafeteria",
    label: "Cafetería",
    keywords: [
      "café",
      "cafetería",
      "coffee",
      "espresso",
      "capuccino",
      "postres",
    ],
  },

  {
    id: "panaderia",
    label: "Panadería",
    keywords: [
      "pan",
      "panadería",
      "panaderia",
      "pasteles",
      "croissant",
      "horno",
    ],
  },

  {
    id: "heladeria",
    label: "Heladería",
    keywords: [
      "helado",
      "heladería",
      "ice cream",
      "gelato",
      "postres",
    ],
  },

  {
    id: "saludable",
    label: "Comida Saludable",
    keywords: [
      "saludable",
      "fit",
      "vegano",
      "vegetariano",
      "ensalada",
      "healthy",
    ],
  },

  {
    id: "bebidas",
    label: "Bebidas",
    keywords: [
      "bebidas",
      "jugos",
      "smoothies",
      "limonadas",
      "cocteles",
    ],
  },
];
