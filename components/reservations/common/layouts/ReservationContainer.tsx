import { ReactNode } from "react";
import clsx from "clsx";

export interface ReservationContainerProps {
  children: ReactNode;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  padding?: boolean;
}

const sizes = {
  sm: "max-w-2xl",
  md: "max-w-4xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-full",
};

export default function ReservationContainer({
  children,
  className,
  size = "lg",
  padding = true,
}: ReservationContainerProps) {
  return (
    <div
      className={clsx(
        "mx-auto w-full",
        sizes[size],
        padding && "px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10",
        className
      )}
    >
      {children}
    </div>
  );
}
