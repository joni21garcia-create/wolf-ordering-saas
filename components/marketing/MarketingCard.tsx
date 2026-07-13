"use client";

import { ReactNode } from "react";

interface Props {
  title: string;
  description?: string;
  children: ReactNode;
  footer?: ReactNode;
}

export default function MarketingCard({
  title,
  description,
  children,
  footer,
}: Props) {
  return (
    <section
      style={{
        background:
          "linear-gradient(180deg,#1b2433 0%,#151c28 100%)",
        border: "1px solid rgba(255,255,255,.08)",
        borderRadius: 24,
        overflow: "hidden",
        boxShadow:
          "0 20px 50px rgba(0,0,0,.25)",
      }}
    >
      <div
        style={{
          padding: 28,
          borderBottom:
            "1px solid rgba(255,255,255,.06)",
        }}
      >
        <h2
          style={{
            margin: 0,
            color: "#fff",
            fontSize: 24,
            fontWeight: 700,
            letterSpacing: -.3,
          }}
        >
          {title}
        </h2>

        {description && (
          <p
            style={{
              marginTop: 10,
              marginBottom: 0,
              color: "#9ca3af",
              fontSize: 14,
              lineHeight: 1.7,
              maxWidth: 650,
            }}
          >
            {description}
          </p>
        )}
      </div>

      <div
        style={{
          padding: 28,
        }}
      >
        {children}
      </div>

      {footer && (
        <div
          style={{
            padding: 24,
            borderTop:
              "1px solid rgba(255,255,255,.06)",
            background:
              "rgba(255,255,255,.015)",
          }}
        >
          {footer}
        </div>
      )}
    </section>
  );
}