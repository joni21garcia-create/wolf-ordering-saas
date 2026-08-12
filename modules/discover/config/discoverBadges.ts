import {
  BadgePlus,
  Compass,
  Crown,
  Flame,
  Rocket,
  Sparkles,
  Star,
  type LucideIcon,
} from "lucide-react";

export interface DiscoverBadge {
  label: string;
  icon: LucideIcon;
}

export const DISCOVER_BADGES: Record<string, DiscoverBadge> = {
  wolf: {
    label: "Recomendado por Wolf",
    icon: Sparkles,
  },
  featured: {
    label: "Destacado",
    icon: Star,
  },
  discover: {
    label: "En Discover",
    icon: Compass,
  },
  premium: {
    label: "Premium",
    icon: Crown,
  },
  popular: {
    label: "Popular",
    icon: Flame,
  },
  new: {
    label: "Nuevo",
    icon: BadgePlus,
  },
  promoted: {
    label: "Impulsado",
    icon: Rocket,
  },
};

export function getDiscoverBadge(
  featuredType: string | null | undefined,
): DiscoverBadge | null {
  if (!featuredType || featuredType === "none") {
    return null;
  }

  return DISCOVER_BADGES[featuredType] ?? null;
}