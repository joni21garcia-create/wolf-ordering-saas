import { CSSProperties } from "react";

export const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  } satisfies CSSProperties,

  title: {
    color: "#fff",
    fontSize: "22px",
    fontWeight: 700,
    margin: 0,
  } satisfies CSSProperties,

  subtitle: {
    color: "rgba(255,255,255,.65)",
    fontSize: "14px",
    marginTop: "4px",
  } satisfies CSSProperties,

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(2,minmax(0,1fr))",
    gap: "12px",
    alignItems: "stretch",
  } satisfies CSSProperties,
};

export const card = (
  selected: boolean,
  primaryColor: string
): CSSProperties => ({
  cursor: "pointer",

  display: "flex",
  flexDirection: "column",

  justifyContent: "space-between",

  minHeight: "205px",

  padding: "18px",

  borderRadius: "22px",

  background: selected
    ? `${primaryColor}15`
    : "rgba(255,255,255,.035)",

  border: selected
    ? `1px solid ${primaryColor}`
    : "1px solid rgba(255,255,255,.08)",

  boxShadow: selected
    ? `0 0 28px ${primaryColor}25`
    : "none",

  transition: ".25s",
});

export const chip: CSSProperties = {
  display: "inline-flex",

  alignItems: "center",

  justifyContent: "center",

  padding: "7px 11px",

  borderRadius: "999px",

  background: "rgba(255,255,255,.06)",

  fontSize: "12px",

  color: "#fff",

  fontWeight: 600,
};


