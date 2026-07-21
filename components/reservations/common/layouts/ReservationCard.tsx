import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationCardProps {
  children: ReactNode;

  className?: string;

  title?: ReactNode;

  description?: ReactNode;

  header?: ReactNode;

  footer?: ReactNode;

  padding?: boolean;

  hover?: boolean;

  bordered?: boolean;
}

export default function ReservationCard({
  children,
  className,
  title,
  description,
  header,
  footer,
  padding = true,
  hover = false,
  bordered = true,
}: ReservationCardProps) {
  return (
    <section
      className={clsx(
        "overflow-hidden rounded-2xl bg-card text-card-foreground shadow-sm transition-all",

        bordered && "border border-border",

        hover && "hover:-translate-y-0.5 hover:shadow-md",

        className
      )}
    >
      {(header || title || description) && (
        <div
          className={clsx(
            "border-b border-border",
            padding && "px-6 py-5"
          )}
        >
          {header ? (
            header
          ) : (
            <>
              {title && (
                <h2 className="text-lg font-semibold tracking-tight">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1 text-sm text-muted-foreground">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className={clsx(padding && "p-6")}>
        {children}
      </div>

      {footer && (
        <div
          className={clsx(
            "border-t border-border",
            padding && "px-6 py-4"
          )}
        >
          {footer}
        </div>
      )}
    </section>
  );
}


