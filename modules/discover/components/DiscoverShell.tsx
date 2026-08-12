"use client";

import type { ReactNode, CSSProperties } from "react";

interface DiscoverShellProps {
  children: ReactNode;
  className?: string;
}

const shellStyle: CSSProperties = {
  minHeight: "100dvh",
  width: "100%",
  position: "relative",
  overflowX: "hidden",
  background:
    "radial-gradient(circle at 50% -10%, rgba(249,115,22,0.10), transparent 34%), #050505",
  color: "#ffffff",
};

const contentStyle: CSSProperties = {
  width: "100%",
  maxWidth: "1280px",
  margin: "0 auto",
  boxSizing: "border-box",
  paddingTop: "max(16px, env(safe-area-inset-top))",
  paddingLeft: "max(16px, env(safe-area-inset-left))",
  paddingRight: "max(16px, env(safe-area-inset-right))",
  paddingBottom: "calc(96px + env(safe-area-inset-bottom))",
};

export default function DiscoverShell({
  children,
  className,
}: DiscoverShellProps) {
  return (
    <main
      className={className}
      style={shellStyle}
      aria-label="Discover de Wolf Ordering"
    >
      <div style={contentStyle}>{children}</div>
    </main>
  );
}