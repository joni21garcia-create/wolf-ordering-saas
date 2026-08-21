import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationHeaderProps {
  title: ReactNode;
  subtitle?: ReactNode;
  actions?: ReactNode;
  className?: string;
  centered?: boolean;
  divider?: boolean;
}

export default function ReservationHeader({
  title,
  subtitle,
  actions,
  className,
  centered = false,
  divider = true,
}: ReservationHeaderProps) {
  return (
    <header
      className={clsx(
        "relative flex flex-col gap-5 md:flex-row md:items-end md:justify-between",
        divider &&
          "border-b border-border/60 pb-6 sm:pb-7",
        className
      )}
    >
      <div
        className={clsx(
          "min-w-0 space-y-2",
          centered && "w-full text-center"
        )}
      >
        <div
          aria-hidden="true"
          className={clsx(
            "h-1 w-10 rounded-full bg-gradient-to-r from-primary to-primary/20",
            centered && "mx-auto"
          )}
        />

        <h1 className="text-2xl font-bold tracking-[-0.035em] sm:text-3xl lg:text-[2rem]">
          {title}
        </h1>

        {subtitle && (
          <p className="max-w-3xl text-sm leading-6 text-muted-foreground sm:text-[15px]">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div
          className={clsx(
            "flex shrink-0 flex-wrap items-center gap-2",
            centered && "justify-center"
          )}
        >
          {actions}
        </div>
      )}
    </header>
  );
}
