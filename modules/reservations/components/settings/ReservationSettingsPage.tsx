"use client";

import { useMemo, useState } from "react";

import { useReservationSettings } from "./hooks/useReservationSettings";

import { CapacitySettings } from "./sections/CapacitySettings";
import { ConfirmationSettings } from "./sections/ConfirmationSettings";
import { GeneralSettings } from "./sections/GeneralSettings";
import { NotificationSettings } from "./sections/NotificationSettings";
import { PolicySettings } from "./sections/PolicySettings";
import { ScheduleSettings } from "./sections/ScheduleSettings";
import { SpecialDatesSettings } from "./sections/SpecialDatesSettings";
import { TablesSettings } from "./sections/TablesSettings";
import { DepositSettings } from "./sections/DepositSettings";

type ReservationSettingsPageProps = {
  restaurantId: string;
};

type ReservationSettingsSection =
  | "general"
  | "schedule"
  | "policy"
  | "capacity"
  | "confirmation"
  | "notifications"
  | "special-dates"
  | "tables"
  | "deposit";

type SectionDefinition = {
  id: ReservationSettingsSection;
  label: string;
  shortLabel: string;
  description: string;
};

const sections: SectionDefinition[] = [
  {
    id: "general",
    label: "General",
    shortLabel: "General",
    description: "Activa reservas y configura su comportamiento principal.",
  },
  {
    id: "schedule",
    label: "Horarios",
    shortLabel: "Horarios",
    description: "Define cuándo puede recibir reservas el restaurante.",
  },
  {
    id: "policy",
    label: "Políticas",
    shortLabel: "Políticas",
    description: "Controla anticipación, duración y cancelaciones.",
  },
  {
    id: "capacity",
    label: "Capacidad",
    shortLabel: "Capacidad",
    description: "Define límites de personas y reglas de capacidad.",
  },
  {
    id: "confirmation",
    label: "Confirmación",
    shortLabel: "Confirmación",
    description: "Configura cómo se confirman las reservas.",
  },
  {
    id: "notifications",
    label: "Notificaciones",
    shortLabel: "Avisos",
    description: "Gestiona confirmaciones, recordatorios y avisos.",
  },
  {
    id: "special-dates",
    label: "Fechas especiales",
    shortLabel: "Especiales",
    description: "Gestiona cierres, eventos y excepciones de calendario.",
  },

    {
    id: "tables",
    label: "Mesas",
    shortLabel: "Mesas",
    description:
      "Configura las mesas, capacidades y reglas de combinación.",
  },
  {
    id: "deposit",
    label: "Anticipo",
    shortLabel: "Anticipo",
    description: "Configura el anticipo opcional de las reservas.",
  },
];

export function ReservationSettingsPage({
  restaurantId,
}: ReservationSettingsPageProps) {
  const [activeSection, setActiveSection] =
    useState<ReservationSettingsSection>("general");

  const {
    settings,
    isLoading,
    isSaving,
    error,
    updateSetting,
  } = useReservationSettings(restaurantId);

  const activeSectionDefinition = useMemo(
    () => sections.find((section) => section.id === activeSection),
    [activeSection],
  );

  const activeIndex = sections.findIndex(
    (section) => section.id === activeSection,
  );

  const goToSection = (section: ReservationSettingsSection) => {
    setActiveSection(section);
  };

  const goToPreviousSection = () => {
    if (activeIndex <= 0) return;

    setActiveSection(sections[activeIndex - 1].id);
  };

  const goToNextSection = () => {
    if (activeIndex >= sections.length - 1) return;

    setActiveSection(sections[activeIndex + 1].id);
  };

  const renderSection = () => {
    if (isLoading) {
      return (
        <div className="space-y-4 animate-pulse">
          <div className="h-6 w-48 rounded-lg bg-black/10 dark:bg-white/10" />
          <div className="h-24 rounded-2xl bg-black/5 dark:bg-white/5" />
          <div className="h-24 rounded-2xl bg-black/5 dark:bg-white/5" />
        </div>
      );
    }

    switch (activeSection) {
      case "general":
        return (
          <GeneralSettings
            settings={settings}
            isSaving={isSaving}
            onUpdate={updateSetting}
          />
        );

      case "schedule":
        return (
          <ScheduleSettings
            settings={settings}
            isSaving={isSaving}
            onUpdate={updateSetting}
          />
        );

      case "policy":
        return (
          <PolicySettings
            settings={settings}
            isSaving={isSaving}
            onUpdate={updateSetting}
          />
        );

      case "capacity":
        return (
          <CapacitySettings
            settings={settings}
            isSaving={isSaving}
            onUpdate={updateSetting}
          />
        );

      case "confirmation":
        return (
          <ConfirmationSettings
            settings={settings}
            isSaving={isSaving}
            onUpdate={updateSetting}
          />
        );

      case "notifications":
        return (
          <NotificationSettings
            settings={settings}
            isSaving={isSaving}
            onUpdate={updateSetting}
          />
        );

      case "special-dates":
        return (
          <SpecialDatesSettings
            settings={settings}
            isSaving={isSaving}
            onUpdate={updateSetting}
          />
        );

      case "tables":
        return (
          <TablesSettings
            restaurantId={restaurantId}
          />
        );

      case "deposit":
        return <DepositSettings restaurantId={restaurantId} />;

      default:
        return null;
    }
  };

  return (
    <main className="w-full">
      {/* Header */}
      <header className="mb-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-xs font-medium text-black/50 dark:text-white/50">
              <span>Configuración</span>
              <span>/</span>
              <span>Reservas</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight text-black dark:text-white sm:text-3xl">
              Configuración de reservas
            </h1>

            <p className="mt-1 max-w-2xl text-sm leading-6 text-black/55 dark:text-white/55">
              Controla cómo el restaurante recibe, confirma y gestiona sus
              reservas.
            </p>
          </div>

          {/* Master status */}
          <div
            className={[
              "flex items-center gap-3 rounded-full border px-3 py-2",
              "border-black/10 bg-white/70 dark:border-white/10 dark:bg-white/5",
              "backdrop-blur-xl",
            ].join(" ")}
          >
            <span
              className={[
                "h-2.5 w-2.5 rounded-full",
                settings?.reservations_enabled
                  ? "bg-emerald-500"
                  : "bg-black/25 dark:bg-white/25",
              ].join(" ")}
            />

            <span className="text-xs font-medium text-black/70 dark:text-white/70">
              {settings?.reservations_enabled
                ? "Reservas activas"
                : "Reservas desactivadas"}
            </span>
          </div>
        </div>
      </header>

      {/* Error */}
      {error ? (
        <div className="mb-5 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      ) : null}

      {/* Mobile / tablet chips */}
      <nav
        aria-label="Secciones de configuración"
        className="mb-5 block lg:hidden"
      >
        <div className="flex gap-2 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((section) => {
            const isActive = section.id === activeSection;

            return (
              <button
                key={section.id}
                type="button"
                onClick={() => goToSection(section.id)}
                aria-current={isActive ? "page" : undefined}
                className={[
                  "shrink-0 rounded-full border px-4 py-2.5",
                  "text-sm font-medium transition-all duration-200",
                  "active:scale-[0.97]",
                  isActive
                    ? "border-black bg-black text-white dark:border-white dark:bg-white dark:text-black"
                    : "border-black/10 bg-white/70 text-black/65 hover:bg-white dark:border-white/10 dark:bg-white/5 dark:text-white/65 dark:hover:bg-white/10",
                ].join(" ")}
              >
                {section.shortLabel}
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main layout */}
      <div className="grid gap-5 lg:grid-cols-[230px_minmax(0,1fr)]">
        {/* Desktop navigation */}
        <aside className="hidden lg:block">
          <div
            className={[
              "sticky top-6 overflow-hidden rounded-3xl border",
              "border-black/10 bg-white/75 backdrop-blur-xl",
              "dark:border-white/10 dark:bg-white/[0.04]",
            ].join(" ")}
          >
            <div className="p-3">
              {sections.map((section) => {
                const isActive = section.id === activeSection;

                return (
                  <button
                    key={section.id}
                    type="button"
                    onClick={() => goToSection(section.id)}
                    className={[
                      "mb-1 w-full rounded-2xl px-3 py-3 text-left",
                      "transition-all duration-200",
                      isActive
                        ? "bg-black text-white dark:bg-white dark:text-black"
                        : "text-black/65 hover:bg-black/5 dark:text-white/65 dark:hover:bg-white/5",
                    ].join(" ")}
                  >
                    <span className="block text-sm font-medium">
                      {section.label}
                    </span>

                    <span
                      className={[
                        "mt-0.5 block text-xs",
                        isActive
                          ? "text-white/65 dark:text-black/60"
                          : "text-black/40 dark:text-white/40",
                      ].join(" ")}
                    >
                      {section.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Content */}
        <section className="min-w-0">
          <div
            className={[
              "rounded-3xl border",
              "border-black/10 bg-white/80 backdrop-blur-xl",
              "dark:border-white/10 dark:bg-white/[0.04]",
              "overflow-hidden",
            ].join(" ")}
          >
            {/* Section header */}
            <div className="border-b border-black/10 px-5 py-5 dark:border-white/10 sm:px-7 sm:py-6">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-black/40 dark:text-white/40">
                    {activeIndex + 1} de {sections.length}
                  </p>

                  <h2 className="text-lg font-semibold text-black dark:text-white sm:text-xl">
                    {activeSectionDefinition?.label}
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-black/55 dark:text-white/55">
                    {activeSectionDefinition?.description}
                  </p>
                </div>

                {isSaving ? (
                  <span className="shrink-0 text-xs text-black/40 dark:text-white/40">
                    Guardando...
                  </span>
                ) : null}
              </div>
            </div>

            {/* Section content */}
            <div
              key={activeSection}
              className="animate-in fade-in slide-in-from-right-2 duration-200"
            >
              <div className="p-5 sm:p-7">{renderSection()}</div>
            </div>

            {/* Desktop/tablet navigation */}
            <div className="hidden border-t border-black/10 px-5 py-4 dark:border-white/10 sm:flex sm:items-center sm:justify-between sm:px-7">
              <button
                type="button"
                onClick={goToPreviousSection}
                disabled={activeIndex <= 0}
                className="rounded-xl px-4 py-2.5 text-sm font-medium text-black/60 transition hover:bg-black/5 disabled:pointer-events-none disabled:opacity-30 dark:text-white/60 dark:hover:bg-white/5"
              >
                ← Anterior
              </button>

              <span className="text-xs text-black/40 dark:text-white/40">
                {activeIndex + 1} / {sections.length}
              </span>

              <button
                type="button"
                onClick={goToNextSection}
                disabled={activeIndex >= sections.length - 1}
                className="rounded-xl bg-black px-4 py-2.5 text-sm font-medium text-white transition hover:opacity-90 disabled:pointer-events-none disabled:opacity-30 dark:bg-white dark:text-black"
              >
                Siguiente →
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile bottom navigation */}
      <nav
        aria-label="Navegación de configuración"
        className={[
          "sticky bottom-3 z-20 mt-5 sm:hidden",
          "rounded-2xl border border-black/10",
          "bg-white/90 p-2 shadow-lg backdrop-blur-xl",
          "dark:border-white/10 dark:bg-black/80",
        ].join(" ")}
      >
        <div className="flex items-center justify-between gap-1">
          <button
            type="button"
            onClick={goToPreviousSection}
            disabled={activeIndex <= 0}
            aria-label="Sección anterior"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-black/60 transition active:scale-95 disabled:opacity-25 dark:text-white/60"
          >
            ←
          </button>

          <button
            type="button"
            onClick={() => {
              const nextIndex =
                activeIndex >= sections.length - 1 ? 0 : activeIndex + 1;

              setActiveSection(sections[nextIndex].id);
            }}
            className="min-w-0 flex-1 truncate rounded-xl px-3 py-2 text-center text-sm font-medium text-black dark:text-white"
          >
            {activeSectionDefinition?.label}
          </button>

          <button
            type="button"
            onClick={goToNextSection}
            disabled={activeIndex >= sections.length - 1}
            aria-label="Sección siguiente"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-lg text-black/60 transition active:scale-95 disabled:opacity-25 dark:text-white/60"
          >
            →
          </button>
        </div>
      </nav>
    </main>
  );
}