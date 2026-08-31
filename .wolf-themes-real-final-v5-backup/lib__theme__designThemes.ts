export type DesignCategory = "minimal" | "premium" | "creative";

export type DesignTheme = {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: DesignCategory;
  heroStyle: string;
  menuStyle: string;
  galleryStyle: string;
  composition: string;
  mobileLabel: string;
  accent: string;
};

/**
 * Diseño = composición. Tema = colores, tipografía, botones y efectos.
 * No mezclar ambas capas: los diseños jamás sobrescriben los tokens del Tema.
 */
export const DESIGN_THEME_REGISTRY: DesignTheme[] = [
  { id: "cinematic", name: "Cinematic / Dark", slug: "cinematic", description: "Fotografía protagonista, profundidad y narrativa cinematográfica.", category: "premium", heroStyle: "cinematic", menuStyle: "cinematic", galleryStyle: "masonry", composition: "fullscreen", mobileLabel: "Fullscreen", accent: "#8b5cf6" },
  { id: "minimal", name: "Minimal / Light", slug: "minimal", description: "Composición editorial limpia con imagen lateral y jerarquía precisa.", category: "minimal", heroStyle: "minimal", menuStyle: "minimal", galleryStyle: "minimal", composition: "split", mobileLabel: "Split", accent: "#94a3b8" },
  { id: "luxury", name: "Luxury / Gold", slug: "luxury", description: "Dirección de arte premium con marco editorial y foco central.", category: "premium", heroStyle: "luxury", menuStyle: "luxury", galleryStyle: "luxury", composition: "framed", mobileLabel: "Framed", accent: "#d4a72c" },
  { id: "neon", name: "Neon / Urban", slug: "neon", description: "Arquitectura asimétrica, energía urbana y capas de profundidad.", category: "creative", heroStyle: "neon", menuStyle: "neon", galleryStyle: "neon", composition: "asymmetric", mobileLabel: "Asymmetric", accent: "#ec4899" },
  { id: "editorial", name: "Editorial / Magazine", slug: "editorial", description: "Maquetación de revista gastronómica con ritmo tipográfico y foto.", category: "minimal", heroStyle: "editorial", menuStyle: "editorial", galleryStyle: "editorial", composition: "magazine", mobileLabel: "Magazine", accent: "#b45309" },
  { id: "glass", name: "Glass / Blur", slug: "glass", description: "Panel flotante, profundidad óptica y fotografía inmersiva.", category: "premium", heroStyle: "glass", menuStyle: "glass", galleryStyle: "glass", composition: "floating", mobileLabel: "Floating", accent: "#22d3ee" },
  { id: "nature", name: "Nature / Warm", slug: "nature", description: "Composición cálida y orgánica con imagen dominante y contenido respirado.", category: "premium", heroStyle: "nature", menuStyle: "nature", galleryStyle: "nature", composition: "organic", mobileLabel: "Organic", accent: "#84cc16" },
  { id: "split", name: "Split / Clean", slug: "split", description: "Dos columnas equilibradas, minimalistas y mobile-first.", category: "minimal", heroStyle: "split", menuStyle: "cards", galleryStyle: "grid", composition: "two-column", mobileLabel: "Two column", accent: "#e5e7eb" },
  { id: "center", name: "Center / Focus", slug: "center", description: "Escena centrada con mucho aire visual y foco en el restaurante.", category: "minimal", heroStyle: "center", menuStyle: "minimal", galleryStyle: "grid", composition: "centered", mobileLabel: "Centered", accent: "#cbd5e1" },
  { id: "bold", name: "Bold / Colorful", slug: "bold", description: "Bloques visuales y tipografía a gran escala para marcas atrevidas.", category: "creative", heroStyle: "bold", menuStyle: "cards", galleryStyle: "grid", composition: "blocks", mobileLabel: "Blocks", accent: "#f59e0b" },
  { id: "classic", name: "Classic / Elegant", slug: "classic", description: "Simetría, marco y estética boutique atemporal.", category: "premium", heroStyle: "classic", menuStyle: "list", galleryStyle: "grid", composition: "classic", mobileLabel: "Classic", accent: "#d6c19b" },
  { id: "air", name: "Air / Swiss", slug: "air", description: "Minimalismo de lujo: mucho espacio, tipografía precisa y fotografía escultórica.", category: "minimal", heroStyle: "air", menuStyle: "air", galleryStyle: "air", composition: "swiss", mobileLabel: "Swiss", accent: "#e2e8f0" },
  { id: "monolith", name: "Monolith / Luxe", slug: "monolith", description: "Panel sólido, escala tipográfica monumental y fotografía recortada como pieza de arte.", category: "premium", heroStyle: "monolith", menuStyle: "monolith", galleryStyle: "monolith", composition: "monolith", mobileLabel: "Monolith", accent: "#c4b5fd" },
  { id: "atelier", name: "Atelier / Art", slug: "atelier", description: "Dirección creativa asimétrica, capas editoriales y fotografía con máscara artística.", category: "creative", heroStyle: "atelier", menuStyle: "atelier", galleryStyle: "atelier", composition: "atelier", mobileLabel: "Atelier", accent: "#f4a261" },
  { id: "noir", name: "Noir / Signature", slug: "noir", description: "Lujo silencioso con marco fino, contraste profundo y jerarquía de marca.", category: "premium", heroStyle: "noir", menuStyle: "signature", galleryStyle: "signature", composition: "signature", mobileLabel: "Signature", accent: "#f5f5f4" },
];

export function getDesignThemeBySlug(slug?: string | null) {
  return DESIGN_THEME_REGISTRY.find((theme) => theme.slug === slug) ?? DESIGN_THEME_REGISTRY[0];
}
