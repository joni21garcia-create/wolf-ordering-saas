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
  boxSizing: "border-box",
};

export const cardStyle: React.CSSProperties = {
  background:
    "linear-gradient(180deg,#171717,#0b0b0b)",
  border:
    "1px solid rgba(255,255,255,.06)",
  borderRadius: 24,
  boxShadow:
    "0 15px 35px rgba(0,0,0,.15)",
  boxSizing: "border-box",
};

export const sectionTitle: React.CSSProperties = {
  color: "#fff",
  fontSize: "clamp(26px, 4vw, 34px)",
  fontWeight: 900,
  letterSpacing: "-0.5px",
  margin: 0,
};

export const sectionSubtitle: React.CSSProperties = {
  color: "#8b8b95",
  marginTop: 8,
  fontSize: 14,
  lineHeight: 1.6,
};

export const orangeButton: React.CSSProperties = {
  background: "#f97316",
  color: "#fff",
  border: "none",
  borderRadius: 16,
  padding: "14px 22px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  transition: "transform 0.2s ease, background-color 0.2s ease",
};

export const darkButton: React.CSSProperties = {
  background: "#171717",
  color: "#fff",
  border:
    "1px solid rgba(255,255,255,.06)",
  borderRadius: 16,
  padding: "14px 22px",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  transition: "transform 0.2s ease, border-color 0.2s ease",
};