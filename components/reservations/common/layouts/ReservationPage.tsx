import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationPageProps {
  children: ReactNode;
  className?: string;
  centered?: boolean;
  fullHeight?: boolean;
  background?: "default" | "muted" | "transparent";
}

export default function ReservationPage({
  children,
  className,
  centered = false,
  fullHeight = true,
  background = "default",
}: ReservationPageProps) {
  return (
    <main
      className={clsx(
        "relative isolate w-full overflow-hidden",
        fullHeight && "min-h-screen",
        background === "default" && "bg-background",
        background === "muted" && "bg-muted/20",
        background === "transparent" && "bg-transparent",
        centered && "flex flex-col items-center justify-center",
        className
      )}
    >
      {background !== "transparent" && (
        <>
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 top-0 -z-10 h-72 bg-gradient-to-b from-primary/[0.07] via-primary/[0.025] to-transparent"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-32 top-24 -z-10 h-72 w-72 rounded-full bg-primary/[0.05] blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-40 top-[38rem] -z-10 h-80 w-80 rounded-full bg-primary/[0.035] blur-3xl"
          />
        </>
      )}

      <div className="relative">{children}</div>
    </main>
  );
}
