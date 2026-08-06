import type { CSSProperties } from "react";

export const colors = {
  background: "#090909",
  surface: "#111111",
  surfaceLight: "#181818",

  border: "rgba(255,255,255,.06)",

  text: "#FFFFFF",
  textSecondary: "#A1A1AA",

  orange: "#f97316",
  green: "#22c55e",
  blue: "#3b82f6",
  yellow: "#fbbf24",
  red: "#ef4444",

  shadow: "0 20px 50px rgba(0,0,0,.45)",
};

export const pageStyle: CSSProperties = {
  minHeight: "100vh",
  background: colors.background,
  color: colors.text,
};

export const containerStyle: CSSProperties = {
  maxWidth: 1800,
  margin: "0 auto",
  padding: 24,
};

export const cardStyle: CSSProperties = {

  background: "transparent",

  border: "none",

  borderRadius: 0,

  boxShadow: "none",

};

export const columnStyle: CSSProperties = {
  ...cardStyle,
  padding: 18,
  minWidth: 360,
  display: "flex",
  flexDirection: "column",
  gap: 18,
};

export const sectionTitleStyle: CSSProperties = {
  fontSize: 22,
  fontWeight: 700,
  marginBottom: 18,
};

export const badgeStyle: CSSProperties = {
  padding: "6px 12px",
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 700,
  display: "inline-flex",
  alignItems: "center",
  gap: 8,
};

export const scrollStyle: CSSProperties = {
  overflowX: "auto",
  overflowY: "hidden",
  scrollbarWidth: "thin",
};

export const gridStyle: CSSProperties = {
  display: "grid",
  gap: 20,
};

export const flexBetween: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

export const flexCenter: CSSProperties = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

export const inputStyle: CSSProperties = {
  width: "100%",
  padding: "12px 16px",
  borderRadius: 14,
  border: `1px solid ${colors.border}`,
  background: "#161616",
  color: "#fff",
  outline: "none",
};

export const buttonStyle: CSSProperties = {
  padding: "12px 18px",
  borderRadius: 14,
  border: "none",
  cursor: "pointer",
  fontWeight: 700,
};

export const mobileOnly: CSSProperties = {
  display: "none",
};

export const desktopOnly: CSSProperties = {
  display: "block",
};