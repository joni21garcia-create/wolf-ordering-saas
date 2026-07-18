"use client";

import { tabs } from "./menu.styles";

interface Props {
  categories: string[];

  activeCategory: string;

  primaryColor?: string;

  onSelect: (
    category: string
  ) => void;
}

export default function CategoryTabs({
  categories,
  activeCategory,
  primaryColor = "#f97316",
  onSelect,
}: Props) {
  return (
    <div style={tabs.container}>
      {categories.map(
        (category) => (
          <button
            key={category}
            onClick={() =>
              onSelect(
                category
              )
            }
            style={tabs.button(
              activeCategory ===
                category,
              primaryColor
            )}
          >
            {category}
          </button>
        )
      )}
    </div>
  );
}