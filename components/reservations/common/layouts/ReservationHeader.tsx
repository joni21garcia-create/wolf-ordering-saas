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
        "flex flex-col gap-4 md:flex-row md:items-start md:justify-between",
        divider && "border-b border-border pb-6",
        className
      )}
    >
      <div
        className={clsx(
          "space-y-1",
          centered && "w-full text-center"
        )}
      >
        <h1 className="text-3xl font-bold tracking-tight">
          {title}
        </h1>

        {subtitle && (
          <p className="max-w-3xl text-sm text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>

      {actions && (
        <div
          className={clsx(
            "flex shrink-0 items-center gap-2",
            centered && "justify-center"
          )}
        >
          {actions}
        </div>
      )}
    </header>
  );
}

