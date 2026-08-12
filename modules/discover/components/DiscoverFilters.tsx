"use client";

import type { CSSProperties } from "react";
import { Check, Clock3, SlidersHorizontal, Store } from "lucide-react";

export type DiscoverFilter = "all" | "open" | "fastest";

interface DiscoverFiltersProps {
  value: DiscoverFilter;
  onChange: (value: DiscoverFilter) => void;
  showAdvancedButton?: boolean;
  onAdvancedClick?: () => void;
}

const filters: Array<{
  value: DiscoverFilter;
  label: string;
  icon: typeof Store;
}> = [
  {
    value: "all",
    label: "Todos",
    icon: Store,
  },
  {
    value: "open",
    label: "Abiertos",
    icon: Check,
  },
  {
    value: "fastest",
    label: "Rápidos",
    icon: Clock3,
  },
];

const sectionStyle: CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: "7px",
};

const scrollStyle: CSSProperties = {
  minWidth: 0,
  flex: 1,
  display: "flex",
  alignItems: "center",
  gap: "7px",
  overflowX: "auto",
  overflowY: "hidden",
  padding: "2px 1px 5px",
  scrollbarWidth: "none",
  WebkitOverflowScrolling: "touch",
  overscrollBehaviorX: "contain",
};

const chipStyle: CSSProperties = {
  position: "relative",
  height: "34px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: "5px",
  flexShrink: 0,
  padding: "0 11px",
  border: "1px solid rgba(255,255,255,0.075)",
  borderRadius: "11px",
  background: "rgba(255,255,255,0.028)",
  color: "rgba(255,255,255,0.52)",
  fontSize: "10px",
  lineHeight: 1,
  fontWeight: 650,
  letterSpacing: "-0.01em",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  transition:
    "transform 160ms ease, background 160ms ease, border-color 160ms ease, color 160ms ease, box-shadow 160ms ease",
};

const advancedButtonStyle: CSSProperties = {
  width: "34px",
  height: "34px",
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  flexShrink: 0,
  border: "1px solid rgba(255,255,255,0.075)",
  borderRadius: "11px",
  background: "rgba(255,255,255,0.028)",
  color: "rgba(255,255,255,0.62)",
  cursor: "pointer",
  WebkitTapHighlightColor: "transparent",
  transition:
    "transform 160ms ease, background 160ms ease, border-color 160ms ease",
};

const styles = `
.discover-filters-scroll::-webkit-scrollbar {
  display: none;
}

.discover-filter-chip:active,
.discover-filter-advanced:active {
  transform: scale(.95);
}

.discover-filter-chip:focus-visible,
.discover-filter-advanced:focus-visible {
  outline: 2px solid rgba(249,115,22,.48);
  outline-offset: 2px;
}

@media (prefers-reduced-motion: reduce) {
  .discover-filter-chip,
  .discover-filter-advanced {
    transition: none !important;
  }
}
`;

export default function DiscoverFilters({
  value,
  onChange,
  showAdvancedButton = false,
  onAdvancedClick,
}: DiscoverFiltersProps) {
  return (
    <>
      <style>{styles}</style>

      <div style={sectionStyle}>
        <div
          style={scrollStyle}
          className="discover-filters-scroll"
          role="group"
          aria-label="Filtros de restaurantes"
        >
          {filters.map((filter) => {
            const selected = value === filter.value;
            const Icon = filter.icon;

            return (
              <button
                key={filter.value}
                type="button"
                onClick={() => onChange(filter.value)}
                aria-pressed={selected}
                className="discover-filter-chip"
                style={{
                  ...chipStyle,
                  background: selected
                    ? "rgba(249,115,22,0.105)"
                    : chipStyle.background,
                  borderColor: selected
                    ? "rgba(249,115,22,0.34)"
                    : chipStyle.borderColor,
                  color: selected
                    ? "rgba(255,255,255,0.92)"
                    : chipStyle.color,
                  boxShadow: selected
                    ? "inset 0 1px 0 rgba(255,255,255,.045), 0 5px 16px rgba(249,115,22,.055)"
                    : "none",
                }}
              >
                <Icon
                  size={13}
                  strokeWidth={selected ? 2 : 1.7}
                  aria-hidden="true"
                  style={{
                    color: selected
                      ? "#f97316"
                      : "rgba(255,255,255,0.43)",
                  }}
                />

                <span>{filter.label}</span>

                {selected ? (
                  <Check
                    size={11}
                    strokeWidth={2.6}
                    aria-hidden="true"
                    style={{
                      color: "#f97316",
                      marginLeft: "-1px",
                    }}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {showAdvancedButton && onAdvancedClick ? (
          <button
            type="button"
            onClick={onAdvancedClick}
            aria-label="Más filtros"
            className="discover-filter-advanced"
            style={advancedButtonStyle}
          >
            <SlidersHorizontal
              size={15}
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        ) : null}
      </div>
    </>
  );
}