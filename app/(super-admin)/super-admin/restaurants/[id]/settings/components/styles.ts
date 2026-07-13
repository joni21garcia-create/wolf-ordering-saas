import React from "react";

export const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "radial-gradient(circle at top right,#351400 0%,#050505 45%)",
  color: "#fff",
};

export const containerStyle: React.CSSProperties = {
  maxWidth: 1700,
  margin: "0 auto",
  padding: "42px 30px 60px",
};

export const cardStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg,#141414,#0b0b0b)",

  border:
    "1px solid rgba(255,255,255,.07)",

  borderRadius: 28,

  boxShadow:
    "0 20px 60px rgba(0,0,0,.35)",
};

export const sectionTitle: React.CSSProperties = {
  color: "#fff",

  fontSize: 34,

  fontWeight: 800,

  margin: 0,
};

export const sectionSubtitle: React.CSSProperties = {
  color: "#8f8f95",

  marginTop: 8,

  fontSize: 15,

  lineHeight: 1.6,
};

export const orangeButton: React.CSSProperties = {
  background: "#f97316",

  color: "#fff",

  border: "none",

  borderRadius: 14,

  padding: "14px 22px",

  cursor: "pointer",

  fontWeight: 700,

  transition: ".25s",
};

export const darkButton: React.CSSProperties = {
  background: "#121212",

  color: "#fff",

  border:
    "1px solid rgba(255,255,255,.08)",

  borderRadius: 14,

  padding: "14px 22px",

  cursor: "pointer",

  fontWeight: 700,

  transition: ".25s",
};