"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export default function SectionCard({
  title,
  subtitle,
  children,
}: Props) {
  return (
    <section
      style={{
        background: "#18181b",
        border: "1px solid #2f2f2f",
        borderRadius: 18,
        padding: 28,
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
      <div>
        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontSize: 22,
            fontWeight: 700,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            style={{
              marginTop: 8,
              color: "#9ca3af",
              lineHeight: 1.5,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>

      {children}
    </section>
  );
}