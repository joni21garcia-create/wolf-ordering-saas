"use client";

import type { CSSProperties } from "react";
import {
  ChefHat,
  ChevronRight,
  Coffee,
  CookingPot,
  Croissant,
  Drumstick,
  Fish,
  Grid2X2,
  IceCreamBowl,
  Pizza,
  Salad,
  Sandwich,
  Soup,
  UtensilsCrossed,
} from "lucide-react";

export interface DiscoverCategory {
  id: string;
  label: string;
  value: string;
  icon?:
    | "burger"
    | "pizza"
    | "chicken"
    | "sushi"
    | "coffee"
    | "salad"
    | "other";
}

interface DiscoverCategoriesProps {
  categories: DiscoverCategory[];
  selectedCategory?: string | null;
  onSelect: (category: string) => void;
  onViewAll?: () => void;
}

const sectionStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
};

const headingRowStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  color: "#ffffff",
  fontSize: "16px",
  lineHeight: 1.2,
  fontWeight: 750,
  letterSpacing: "-0.02em",
};

const allButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "2px",
  padding: 0,
  border: 0,
  background: "transparent",
  color: "rgba(255,255,255,0.55)",
  fontSize: "12px",
  fontWeight: 600,
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
};

const scrollStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  gap: "10px",
  overflowX: "auto",
  overflowY: "hidden",
  padding: "2px 2px 6px",
  scrollbarWidth: "none",
  WebkitOverflowScrolling: "touch",
  overscrollBehaviorX: "contain",
};

const itemStyle: CSSProperties = {
  minWidth: "68px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  gap: "6px",
  padding: 0,
  border: 0,
  background: "transparent",
  color: "rgba(255,255,255,0.68)",
  fontSize: "10px",
  lineHeight: 1.2,
  fontWeight: 600,
  cursor: "pointer",
  flexShrink: 0,
  WebkitTapHighlightColor: "transparent",
};

const iconBoxStyle: CSSProperties = {
  width: "46px",
  height: "46px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  border: "1px solid rgba(255,255,255,0.075)",
  borderRadius: "14px",
  background: "rgba(255,255,255,0.018)",
  transition:
    "transform 160ms ease, background 160ms ease, border-color 160ms ease, box-shadow 160ms ease",
};

function CategoryIcon({
  icon,
  label,
  value,
}: {
  icon?: DiscoverCategory["icon"];
  label: string;
  value: string;
}) {
  const size = 20;
  const strokeWidth = 1.45;
  const key = `${label} ${value}`.toLowerCase();

  if (icon === "burger" || /hamburg|burger/.test(key)) {
    return <Sandwich size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (icon === "pizza" || /pizza|pizzer/.test(key)) {
    return <Pizza size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (icon === "chicken" || /pollo|chicken|alitas|wings/.test(key)) {
    return <Drumstick size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (icon === "sushi" || /sushi|japonesa|japon/.test(key)) {
    return <Fish size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (icon === "coffee" || /caf[eé]|coffee|desayuno|brunch/.test(key)) {
    return <Coffee size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (icon === "salad" || /ensalada|salad|saludable|vegetar/.test(key)) {
    return <Salad size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (/venezol|ecuator|mexican|mexic|peruan|peru|colomb|italian|italia/.test(key)) {
    return <CookingPot size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (/postre|dulce|helado|ice cream|repost/.test(key)) {
    return <IceCreamBowl size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (/pan|panader|bakery|croissant/.test(key)) {
    return <Croissant size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (/sopa|sopas/.test(key)) {
    return <Soup size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (/restaurant|restaurante|parrilla|chef|gourmet/.test(key)) {
    return <ChefHat size={size} strokeWidth={strokeWidth} aria-hidden="true" />;
  }

  if (icon === "other") {
    return (
      <UtensilsCrossed
        size={size}
        strokeWidth={strokeWidth}
        aria-hidden="true"
      />
    );
  }

  return <Grid2X2 size={19} strokeWidth={1.35} aria-hidden="true" />;
}

const styles = `
.discover-category-item:active {
  transform: scale(0.97);
}

.discover-category-item:focus-visible {
  outline: 2px solid rgba(249,115,22,0.55);
  outline-offset: 3px;
  border-radius: 12px;
}

.discover-categories-scroll::-webkit-scrollbar {
  display: none;
}
`;


export default function DiscoverCategories({
  categories,
  selectedCategory = "all",
  onSelect,
  onViewAll,
}: DiscoverCategoriesProps) {
  if (categories.length === 0) {
    return null;
  }

  return (
    <>
      <style>{styles}</style>

      <section
      aria-labelledby="discover-categories-title"
      style={sectionStyle}
    >
      <div style={headingRowStyle}>
        <h2 id="discover-categories-title" style={titleStyle}>
          Categorías
        </h2>

        {onViewAll ? (
          <button
            type="button"
            onClick={onViewAll}
            style={allButtonStyle}
            aria-label="Ver todas las categorías"
          >
            Ver todas
            <ChevronRight
              size={14}
              strokeWidth={2}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>

      <div
        style={scrollStyle}
        className="discover-categories-scroll"
        role="list"
        aria-label="Categorías de restaurantes"
      >
        {categories.map((category) => {
          const selected =
            selectedCategory === category.value ||
            (selectedCategory === "all" && category.value === "all");

          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelect(category.value)}
              aria-pressed={selected}
              aria-label={`Filtrar por ${category.label}`}
              data-category={category.value}
              style={{
                ...itemStyle,
                color: selected ? "#ffffff" : itemStyle.color,
              }}
              role="listitem"
            >
              <span
                style={{
                  ...iconBoxStyle,
                  background: selected
                    ? "rgba(249,115,22,0.08)"
                    : iconBoxStyle.background,
                  borderColor: selected
                    ? "rgba(249,115,22,0.34)"
                    : iconBoxStyle.borderColor,
                  color: selected
                    ? "#f97316"
                    : "rgba(255,255,255,0.56)",
                  transform: selected
                    ? "translateY(-1px)"
                    : "none",
                  boxShadow: selected
                    ? "0 4px 14px rgba(249,115,22,0.06)"
                    : "none",
                }}
              >
                <CategoryIcon
                  icon={category.icon}
                  label={category.label}
                  value={category.value}
                />
              </span>

              <span>{category.label}</span>
            </button>
          );
        })}
      </div>
      </section>
    </>
  );
}