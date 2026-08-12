import { searchRestaurants } from "@/lib/discover/search";
import { getRestaurantStatus } from "@/lib/schedule";
import { DISCOVER_CATEGORIES } from "@/lib/discover/categories";
import type { Restaurant } from "@/modules/discover/types/restaurant";
import { calculateDistanceKm } from "@/modules/discover/utils/distance";

export type DiscoverFilter = "all" | "open" | "fastest";

export interface DiscoverLocation {
  latitude: number;
  longitude: number;
}

export interface DiscoverQueryParams {
  restaurants: Restaurant[];
  search?: string;
  category?: string | null;
  filter?: DiscoverFilter;
  location?: DiscoverLocation | null;
}

export interface DiscoverQueryResult {
  restaurants: Restaurant[];
  total: number;
  searchTerm: string;
  category: string | null;
}

/**
 * Normaliza texto para comparar categorías sin depender
 * de mayúsculas, acentos o pequeñas diferencias.
 */
function normalize(value: string | null | undefined): string {
  return (value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

/**
 * Obtiene la categoría configurada en el catálogo de Discover.
 */
function getCategory(categoryId: string | null | undefined) {
  if (!categoryId) {
    return null;
  }

  const normalizedId = normalize(categoryId);

  return (
    DISCOVER_CATEGORIES.find(
      (category) => normalize(category.id) === normalizedId,
    ) ?? null
  );
}

/**
 * Comprueba si una categoría de restaurante corresponde
 * directamente a la categoría seleccionada.
 *
 * Esta comparación es deliberadamente estricta.
 *
 * La búsqueda semántica queda para searchRestaurants(),
 * evitando que una palabra relacionada convierta
 * accidentalmente un restaurante en otra categoría.
 */
function matchesCategory(
  restaurant: Restaurant,
  categoryId: string,
): boolean {
  const restaurantCategory = normalize(restaurant.category);
  const selectedCategory = normalize(categoryId);

  if (!restaurantCategory || !selectedCategory) {
    return false;
  }

  if (restaurantCategory === selectedCategory) {
    return true;
  }

  const category = getCategory(categoryId);

  if (!category) {
    return false;
  }

  return category.keywords.some(
    (keyword) => normalize(keyword) === restaurantCategory,
  );
}

/**
 * Filtra únicamente restaurantes abiertos y aceptando pedidos.
 */
function filterOpen(restaurants: Restaurant[]): Restaurant[] {
  return restaurants.filter((restaurant) => {
    const status = getRestaurantStatus(
      restaurant.schedule_settings,
    );

    return restaurant.accepting_orders && status.isOpen;
  });
}

/**
 * Ordena restaurantes por tiempo estimado.
 *
 * No elimina restaurantes: solamente cambia el orden.
 */
function sortFastest(restaurants: Restaurant[]): Restaurant[] {
  return [...restaurants].sort((a, b) => {
    const aMin =
      a.estimated_min_time ?? Number.MAX_SAFE_INTEGER;

    const bMin =
      b.estimated_min_time ?? Number.MAX_SAFE_INTEGER;

    if (aMin !== bMin) {
      return aMin - bMin;
    }

    const aMax =
      a.estimated_max_time ?? Number.MAX_SAFE_INTEGER;

    const bMax =
      b.estimated_max_time ?? Number.MAX_SAFE_INTEGER;

    if (aMax !== bMax) {
      return aMax - bMax;
    }

    return a.name.localeCompare(b.name, "es");
  });
}


/**
 * Ordena por proximidad cuando conocemos la ubicación del usuario.
 *
 * Los restaurantes sin coordenadas quedan al final.
 * El cálculo es local y no realiza ninguna petición externa.
 */
function sortByDistance(
  restaurants: Restaurant[],
  location: DiscoverLocation,
): Restaurant[] {
  return [...restaurants].sort((a, b) => {
    const distanceA = calculateDistanceKm(location, {
      latitude: a.latitude,
      longitude: a.longitude,
    });

    const distanceB = calculateDistanceKm(location, {
      latitude: b.latitude,
      longitude: b.longitude,
    });

    if (distanceA === null && distanceB === null) {
      return a.name.localeCompare(b.name, "es");
    }

    if (distanceA === null) {
      return 1;
    }

    if (distanceB === null) {
      return -1;
    }

    return distanceA - distanceB;
  });
}

/**
 * Filtrado principal de Discover.
 *
 * Orden de procesamiento:
 *
 * 1. búsqueda inteligente
 * 2. categoría
 * 3. filtro operativo
 * 4. orden por rapidez
 *
 * La búsqueda continúa reutilizando el motor existente
 * de normalización, correcciones, sinónimos y ranking.
 */
export function discoverQuery({
  restaurants,
  search = "",
  category = null,
  filter = "all",
  location = null,
}: DiscoverQueryParams): DiscoverQueryResult {
  const searchTerm = search.trim();

  let result = restaurants;

  /**
   * ---------------------------------------------------------
   * 1. BÚSQUEDA
   * ---------------------------------------------------------
   *
   * Aquí NO duplicamos:
   *
   * - normalización
   * - correcciones
   * - sinónimos
   * - diccionario
   * - ranking
   *
   * Todo eso ya vive en searchRestaurants().
   */
  if (searchTerm) {
    result = searchRestaurants(result, searchTerm);
  }

  /**
   * ---------------------------------------------------------
   * 2. CATEGORÍA
   * ---------------------------------------------------------
   *
   * La categoría es estricta.
   *
   * Ejemplo:
   *
   * Pizza
   * ↓
   * restaurant.category = pizza
   *
   * No usamos el diccionario completo aquí porque
   * palabras relacionadas como "pollo", "queso" o
   * "tomate" podrían producir falsos positivos.
   */
  if (category) {
    result = result.filter((restaurant) =>
      matchesCategory(restaurant, category),
    );
  }

  /**
   * ---------------------------------------------------------
   * 3. FILTROS
   * ---------------------------------------------------------
   */
  if (filter === "open") {
    result = filterOpen(result);
  }

  /**
   * ---------------------------------------------------------
   * 4. ORDEN
   * ---------------------------------------------------------
   */
  if (filter === "fastest") {
    result = sortFastest(result);
  } else if (location) {
    /**
     * Cuando el usuario no pidió explícitamente "Más rápidos",
     * la proximidad se convierte en el orden natural de Discover.
     *
     * La búsqueda y categoría ya redujeron el universo antes
     * de llegar aquí, por lo que solo ordenamos los resultados
     * relevantes por cercanía.
     */
    result = sortByDistance(result, location);
  }

  return {
    restaurants: result,
    total: result.length,
    searchTerm,
    category,
  };
}

/**
 * Helper para saber si una categoría existe en el
 * catálogo oficial de Discover.
 */
export function isDiscoverCategory(
  categoryId: string | null | undefined,
): boolean {
  return Boolean(getCategory(categoryId));
}

/**
 * Helper para recuperar una categoría por ID.
 */
export function getDiscoverCategory(
  categoryId: string | null | undefined,
) {
  return getCategory(categoryId);
}