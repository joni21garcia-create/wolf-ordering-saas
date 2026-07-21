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
        divider && "border-b border-border pb-8",
        className
      )}
    >
      {(title || description || actions) && (
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-1">
            {title && (
              <h2 className="text-xl font-semibold tracking-tight">
                {title}
              </h2>
            )}

            {description && (
              <p className="text-sm text-muted-foreground">
                {description}
              </p>
            )}
          </div>

          {actions && (
            <div className="flex shrink-0 items-center gap-2">
              {actions}
            </div>
          )}
        </div>
      )}

      <div className={clsx(spacingClasses[spacing])}>
        {children}
      </div>
    </section>
  );
}


