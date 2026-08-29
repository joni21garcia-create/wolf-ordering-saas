"use client";

import { ShoppingCart } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";

const CART_KEY = "wolf_cart";
const CART_EVENT = "wolf-cart-updated";

function readCartCount(): number {
  if (typeof window === "undefined") return 0;

  try {
    const raw = window.localStorage.getItem(CART_KEY);
    if (!raw) return 0;

    const cart = JSON.parse(raw);
    if (!Array.isArray(cart)) return 0;

    return cart.reduce((total, item) => {
      const quantity = Number(item?.quantity ?? item?.qty ?? 1);
      return total + (Number.isFinite(quantity) && quantity > 0 ? quantity : 1);
    }, 0);
  } catch {
    return 0;
  }
}

interface Props {
  slug: string;
  primaryColor?: string | null;
}

export default function PublicFloatingCart({
  slug,
  primaryColor,
}: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [count, setCount] = useState(0);

  const refresh = useCallback(() => {
    setCount(readCartCount());
  }, []);

  useEffect(() => {
    refresh();

    const handleStorage = (event: StorageEvent) => {
      if (!event.key || event.key === CART_KEY) refresh();
    };

    const handleWolfCart = () => refresh();
    const handleFocus = () => refresh();
    const handlePageShow = () => refresh();

    window.addEventListener("storage", handleStorage);
    window.addEventListener(CART_EVENT, handleWolfCart);
    window.addEventListener("focus", handleFocus);
    window.addEventListener("pageshow", handlePageShow);

    // Some existing menu actions update localStorage without dispatching
    // an event. This keeps the floating cart synchronized without touching
    // those existing flows.
    const interval = window.setInterval(refresh, 900);

    return () => {
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener(CART_EVENT, handleWolfCart);
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("pageshow", handlePageShow);
      window.clearInterval(interval);
    };
  }, [refresh]);

  // The cart belongs to the public experience, not the dedicated order page.
  if (!count || pathname === `/${slug}/order`) return null;

  const accent = primaryColor || "#f97316";

  return (
    <button
      type="button"
      onClick={() => router.push(`/${encodeURIComponent(slug)}/order`)}
      aria-label={`Ver pedido. ${count} ${count === 1 ? "producto" : "productos"} en el carrito`}
      style={{
        position: "fixed",
        left: "50%",
        bottom: "calc(16px + env(safe-area-inset-bottom))",
        transform: "translateX(-50%)",
        zIndex: 950,
        display: "inline-flex",
        alignItems: "center",
        gap: 10,
        minHeight: 48,
        padding: "0 15px 0 11px",
        border: "1px solid rgba(255,255,255,.12)",
        borderRadius: 999,
        background: "rgba(14,14,14,.90)",
        color: "#fff",
        boxShadow: "0 14px 38px rgba(0,0,0,.30)",
        backdropFilter: "blur(18px) saturate(140%)",
        WebkitBackdropFilter: "blur(18px) saturate(140%)",
        cursor: "pointer",
        fontFamily: "inherit",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <span
        aria-hidden="true"
        style={{
          position: "relative",
          width: 34,
          height: 34,
          display: "grid",
          placeItems: "center",
          borderRadius: 999,
          background: accent,
        }}
      >
        <ShoppingCart size={17} strokeWidth={2.2} />
        <span
          style={{
            position: "absolute",
            top: -4,
            right: -4,
            minWidth: 19,
            height: 19,
            padding: "0 5px",
            display: "grid",
            placeItems: "center",
            borderRadius: 999,
            background: "#fff",
            color: "#111",
            border: "2px solid #0e0e0e",
            fontSize: 10,
            fontWeight: 900,
            lineHeight: 1,
          }}
        >
          {count > 99 ? "99+" : count}
        </span>
      </span>

      <span
        style={{
          display: "grid",
          gap: 1,
          textAlign: "left",
          lineHeight: 1.05,
        }}
      >
        <strong style={{ fontSize: 13, fontWeight: 800 }}>Ver pedido</strong>
        <span style={{ fontSize: 10, color: "rgba(255,255,255,.52)" }}>
          {count} {count === 1 ? "producto" : "productos"}
        </span>
      </span>
    </button>
  );
}
