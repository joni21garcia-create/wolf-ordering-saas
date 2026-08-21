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
        "group relative overflow-hidden rounded-3xl bg-card/95 text-card-foreground shadow-[0_18px_60px_-35px_rgba(0,0,0,0.45)] ring-1 ring-black/[0.04] backdrop-blur-xl transition-all duration-300",
        bordered && "border border-border/70",
        hover &&
          "hover:-translate-y-0.5 hover:shadow-[0_24px_70px_-32px_rgba(0,0,0,0.5)] hover:ring-black/[0.08]",
        className
      )}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-foreground/15 to-transparent"
      />

      {(header || title || description) && (
        <div
          className={clsx(
            "relative border-b border-border/60 bg-gradient-to-b from-muted/35 to-transparent",
            padding && "px-5 py-5 sm:px-6 sm:py-5"
          )}
        >
          {header ? (
            header
          ) : (
            <>
              {title && (
                <h2 className="text-base font-semibold tracking-[-0.01em] sm:text-lg">
                  {title}
                </h2>
              )}

              {description && (
                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-muted-foreground">
                  {description}
                </p>
              )}
            </>
          )}
        </div>
      )}

      <div className={clsx("relative", padding && "p-5 sm:p-6")}>
        {children}
      </div>

      {footer && (
        <div
          className={clsx(
            "relative border-t border-border/60 bg-muted/20",
            padding && "px-5 py-4 sm:px-6"
          )}
        >
          {footer}
        </div>
      )}
    </section>
  );
}
