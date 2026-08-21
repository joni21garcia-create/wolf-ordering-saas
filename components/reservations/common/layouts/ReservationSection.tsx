import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationSectionProps {
  children: ReactNode;
  title?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  className?: string;
  spacing?: "none" | "sm" | "md" | "lg";
  divider?: boolean;
}

const spacingClasses = {
  none: "",
  sm: "space-y-3",
  md: "space-y-5",
  lg: "space-y-8",
};

export default function ReservationSection({
  children,
  title,
  description,
  actions,
  className,
  spacing = "md",
  divider = false,
}: ReservationSectionProps) {
  return (
    <section
      className={clsx(
        spacingClasses[spacing],
        divider && "border-b border-border/60 pb-8",
        className
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="h-1 w-8 rounded-full bg-gradient-to-r from-primary to-primary/20" />

            {title && (
              <h2 className="text-lg font-semibold tracking-[-0.02em] sm:text-xl">
                {title}
              </h2>
            )}

            {description && (
              <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 flex-wrap items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className={clsx(spacingClasses[spacing])}>{children}</div>
    </section>
  );
}
