import { CSSProperties } from "react";

export const styles = {
  container: {
    marginTop: "30px",

    display: "flex",

    flexDirection: "column",

    gap: "24px",

    width: "100%",
  } satisfies CSSProperties,

  title: {
    fontSize: "28px",

    fontWeight: 800,

    color: "#FFF",

    margin: 0,
  } satisfies CSSProperties,

  sections: {
    display: "flex",

    flexDirection: "column",

    gap: "36px",

    marginTop: "8px",
  } satisfies CSSProperties,
};

export const tabs = {
  container: {
    display: "flex",

    gap: "10px",

    overflowX: "auto",

    overflowY: "hidden",

    position: "sticky",

    top: "10px",

    zIndex: 100,

    padding: "10px 0",

    backdropFilter: "blur(22px)",

    WebkitBackdropFilter: "blur(22px)",

    scrollbarWidth: "none",

    WebkitOverflowScrolling: "touch",

    scrollBehavior: "smooth",
  } satisfies CSSProperties,

  button: (
    active: boolean,
    primaryColor: string
  ): CSSProperties => ({
    flexShrink: 0,

    padding: "10px 18px",

    borderRadius: "999px",

    border: active
      ? "none"
      : "1px solid rgba(255,255,255,.08)",

    background: active
      ? primaryColor
      : "rgba(255,255,255,.05)",

    color: "#FFF",

    fontSize: "13px",

    fontWeight: 700,

    cursor: "pointer",

    whiteSpace: "nowrap",

    transition: "all .25s ease",

    transform: active
      ? "scale(1.04)"
      : "scale(1)",

    boxShadow: active
      ? `0 0 18px ${primaryColor}45`
      : "none",
  }),
};

export const section = {
  title: {
    color: "#FFF",

    fontSize: "22px",

    fontWeight: 800,

    marginBottom: "14px",
  } satisfies CSSProperties,

  products: {
    display: "flex",

    gap: "14px",

    overflowX: "auto",

    overflowY: "hidden",

    scrollSnapType: "x mandatory",

    scrollBehavior: "smooth",

    scrollbarWidth: "none",

    WebkitOverflowScrolling: "touch",

    paddingBottom: "6px",
  } satisfies CSSProperties,
};

export const productCard = (
  primaryColor: string
): CSSProperties => ({
  flex: "0 0 190px",

  minHeight: "255px",

  borderRadius: "22px",

  overflow: "hidden",

  display: "flex",

  flexDirection: "column",

  background:
    "linear-gradient(180deg, rgba(255,255,255,.06), rgba(255,255,255,.03))",

  border: "1px solid rgba(255,255,255,.07)",

  backdropFilter: "blur(18px)",

  WebkitBackdropFilter: "blur(18px)",

  scrollSnapAlign: "start",

  cursor: "pointer",

  transition: "all .25s ease",

  boxShadow:
    "0 10px 30px rgba(0,0,0,.25)",
});

export const productImage: CSSProperties = {
  width: "100%",

  height: "130px",

  objectFit: "cover",

  display: "block",
};

export const productContent: CSSProperties = {
  padding: "14px",

  display: "flex",

  flexDirection: "column",

  justifyContent: "space-between",

  flexGrow: 1,

  gap: "8px",
};

export const productTitle: CSSProperties = {
  color: "#FFF",

  fontSize: "15px",

  fontWeight: 700,

  margin: 0,

  lineHeight: "1.3",

  display: "-webkit-box",

  WebkitLineClamp: 1,

  WebkitBoxOrient: "vertical",

  overflow: "hidden",
};

export const productDescription: CSSProperties = {
  color: "rgba(255,255,255,.65)",

  fontSize: "12px",

  lineHeight: "1.4",

  margin: 0,

  display: "-webkit-box",

  WebkitLineClamp: 1,

  WebkitBoxOrient: "vertical",

  overflow: "hidden",

  minHeight: "18px",
};

export const price: CSSProperties = {
  color: "#f97316",

  fontWeight: 800,

  fontSize: "18px",
};

export const button: CSSProperties = {
  width: "100%",

  padding: "10px",

  border: "none",

  borderRadius: "999px",

  cursor: "pointer",

  fontWeight: 700,

  fontSize: "13px",

  marginTop: "10px",

  transition: "all .25s ease",
};