import type { ReactNode } from "react";

type ReservationSettingsSectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
  action?: ReactNode;
  footer?: ReactNode;
  className?: string;
};

export function ReservationSettingsSection({
  title,
  description,
  children,
  action,
  footer,
  className = "",
}: ReservationSettingsSectionProps) {
  return (
    <section className={["w-full", className].filter(Boolean).join(" ")}>
      <div className="mb-5 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h3 className="text-base font-semibold tracking-tight text-black dark:text-white sm:text-lg">
            {title}
          </h3>

          {description ? (
            <p className="mt-1 max-w-2xl text-sm leading-6 text-black/50 dark:text-white/50">
              {description}
            </p>
          ) : null}
        </div>

        {action ? <div className="shrink-0">{action}</div> : null}
      </div>

      <div className="space-y-3">{children}</div>

      {footer ? (
        <div className="mt-5 border-t border-black/10 pt-4 dark:border-white/10">
          {footer}
        </div>
      ) : null}
    </section>
  );
}

type ReservationSettingsRowProps = {
  label: string;
  description?: string;
  children: ReactNode;
  disabled?: boolean;
  className?: string;
};

export function ReservationSettingsRow({
  label,
  description,
  children,
  disabled = false,
  className = "",
}: ReservationSettingsRowProps) {
  return (
    <div
      className={[
        "flex flex-col gap-4 rounded-2xl border",
        "border-black/10 bg-black/[0.015] px-4 py-4",
        "transition-colors duration-200",
        "dark:border-white/10 dark:bg-white/[0.025]",
        "sm:flex-row sm:items-center sm:justify-between",
        disabled ? "opacity-50" : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="min-w-0">
        <p className="text-sm font-medium text-black dark:text-white">{label}</p>

        {description ? (
          <p className="mt-1 max-w-xl text-xs leading-5 text-black/45 dark:text-white/45">
            {description}
          </p>
        ) : null}
      </div>

      <div className="shrink-0">{children}</div>
    </div>
  );
}

type ReservationSettingsDisclosureProps = {
  title: string;
  description?: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: ReactNode;
  disabled?: boolean;
};

export function ReservationSettingsDisclosure({
  title,
  description,
  open,
  onOpenChange,
  children,
  disabled = false,
}: ReservationSettingsDisclosureProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-black/10 dark:border-white/10">
      <button
        type="button"
        onClick={() => {
          if (!disabled) onOpenChange(!open);
        }}
        disabled={disabled}
        aria-expanded={open}
        className={[
          "flex w-full items-center justify-between gap-4",
          "px-4 py-4 text-left",
          "transition-colors duration-200",
          "hover:bg-black/[0.025] dark:hover:bg-white/[0.035]",
          "active:bg-black/[0.04] dark:active:bg-white/[0.05]",
          "disabled:pointer-events-none disabled:opacity-50",
        ].join(" ")}
      >
        <span className="min-w-0">
          <span className="block text-sm font-medium text-black dark:text-white">
            {title}
          </span>

          {description ? (
            <span className="mt-1 block text-xs leading-5 text-black/45 dark:text-white/45">
              {description}
            </span>
          ) : null}
        </span>

        <span
          aria-hidden="true"
          className={[
            "flex h-8 w-8 shrink-0 items-center justify-center",
            "rounded-full bg-black/5 text-sm text-black/60",
            "transition-transform duration-200",
            "dark:bg-white/10 dark:text-white/60",
            open ? "rotate-180" : "",
          ].join(" ")}
        >
          ↓
        </span>
      </button>

      {open ? (
        <div className="border-t border-black/10 p-4 dark:border-white/10">
          {children}
        </div>
      ) : null}
    </div>
  );
}