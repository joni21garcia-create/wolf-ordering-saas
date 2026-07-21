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
        "w-full",
        fullHeight && "min-h-screen",

        background === "default" && "bg-background",
        background === "muted" && "bg-muted/30",
        background === "transparent" && "bg-transparent",

        centered &&
          "flex flex-col items-center justify-center",

        className
      )}
    >
      {children}
    </main>
  );
}


