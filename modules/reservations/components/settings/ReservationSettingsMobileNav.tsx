"use client";

type ReservationSettingsSection =
  | "general"
  | "schedule"
  | "policy"
  | "capacity"
  | "confirmation"
  | "notifications"
  | "special-dates";

type SectionItem = {
  id: ReservationSettingsSection;
  label: string;
  shortLabel: string;
};

type ReservationSettingsMobileNavProps = {
  sections: SectionItem[];
  activeSection: ReservationSettingsSection;
  onSelect: (section: ReservationSettingsSection) => void;
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
};

export function ReservationSettingsMobileNav({
  sections,
  activeSection,
  onSelect,
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}: ReservationSettingsMobileNavProps) {
  const activeIndex = sections.findIndex(
    (section) => section.id === activeSection,
  );

  const activeItem = sections[activeIndex];

  return (
    <div className="lg:hidden">
      {/* Chips */}
      <div
        className={[
          "mb-3 flex gap-2 overflow-x-auto pb-1",
          "[scrollbar-width:none]",
          "[&::-webkit-scrollbar]:hidden",
        ].join(" ")}
      >
        {sections.map((section) => {
          const isActive = section.id === activeSection;

          return (
            <button
              key={section.id}
              type="button"
              onClick={() => onSelect(section.id)}
              aria-current={isActive ? "page" : undefined}
              className={[
                "min-h-10 shrink-0 rounded-full border px-4",
                "text-sm font-medium",
                "transition-[background-color,border-color,color,transform]",
                "duration-200",
                "active:scale-[0.96]",
                "focus:outline-none focus-visible:ring-2",
                "focus-visible:ring-black/20",
                "dark:focus-visible:ring-white/20",
                isActive
                  ? [
                      "border-black bg-black text-white",
                      "dark:border-white dark:bg-white dark:text-black",
                    ].join(" ")
                  : [
                      "border-black/10 bg-white/80 text-black/60",
                      "hover:bg-white hover:text-black",
                      "dark:border-white/10 dark:bg-white/[0.05]",
                      "dark:text-white/60 dark:hover:bg-white/10",
                    ].join(" "),
              ].join(" ")}
            >
              {section.shortLabel}
            </button>
          );
        })}
      </div>

      {/* Bottom navigation */}
      <div
        className={[
          "sticky bottom-3 z-30",
          "rounded-2xl border border-black/10",
          "bg-white/90 p-2",
          "shadow-[0_8px_30px_rgba(0,0,0,0.12)]",
          "backdrop-blur-xl",
          "dark:border-white/10 dark:bg-[#111]/90",
        ].join(" ")}
      >
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevious}
            disabled={!canGoPrevious}
            aria-label="Sección anterior"
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center",
              "rounded-xl text-lg",
              "text-black/60 dark:text-white/60",
              "transition-all duration-200",
              "active:scale-95",
              "hover:bg-black/5 dark:hover:bg-white/5",
              "disabled:pointer-events-none disabled:opacity-25",
            ].join(" ")}
          >
            ←
          </button>

          <button
            type="button"
            className={[
              "min-w-0 flex-1 rounded-xl px-3 py-2",
              "text-center",
              "transition-colors duration-200",
              "hover:bg-black/5 dark:hover:bg-white/5",
            ].join(" ")}
            onClick={() => {
              /*
               * En móvil, tocar el nombre de la sección vuelve a llevar
               * visualmente al selector de chips.
               */
              const chip = document.querySelector(
                `[aria-current="page"]`,
              );

              chip?.scrollIntoView({
                behavior: "smooth",
                block: "nearest",
                inline: "center",
              });
            }}
          >
            <span className="block truncate text-sm font-medium text-black dark:text-white">
              {activeItem?.label ?? "Configuración"}
            </span>

            <span className="mt-0.5 block text-[11px] text-black/40 dark:text-white/40">
              {activeIndex + 1} de {sections.length}
            </span>
          </button>

          <button
            type="button"
            onClick={onNext}
            disabled={!canGoNext}
            aria-label="Sección siguiente"
            className={[
              "flex h-11 w-11 shrink-0 items-center justify-center",
              "rounded-xl text-lg",
              "text-black/60 dark:text-white/60",
              "transition-all duration-200",
              "active:scale-95",
              "hover:bg-black/5 dark:hover:bg-white/5",
              "disabled:pointer-events-none disabled:opacity-25",
            ].join(" ")}
          >
            →
          </button>
        </div>
      </div>
    </div>
  );
}