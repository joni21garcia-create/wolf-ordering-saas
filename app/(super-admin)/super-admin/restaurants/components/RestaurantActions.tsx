"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type Props = {
  restaurantId: string;
  active: boolean;
  onToggleStatus?: () => void;
  onDelete?: () => void;
};

export default function RestaurantActions({
  restaurantId,
  active,
  onToggleStatus,
  onDelete,
}: Props) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutside);
    return () => document.removeEventListener("mousedown", handleOutside);
  }, []);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 12,
        marginTop: 8,
      }}
    >
      {/* Dashboard */}
      <Link
        href={`/super-admin/restaurants/${restaurantId}/finance`}
        style={{
          flex: 1,
          textDecoration: "none",
        }}
      >
        <button style={primaryButton}>Dashboard</button>
      </Link>

      {/* Configuración */}
      <Link
        href={`/super-admin/restaurants/${restaurantId}/settings`}
        style={{
          flex: 1,
          textDecoration: "none",
        }}
      >
        <button style={secondaryButton}>Configuración</button>
      </Link>

      {/* Menú de opciones */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          flexShrink: 0,
        }}
      >
        <button
          onClick={() => setOpen((v) => !v)}
          style={menuButton}
          title="Más opciones"
        >
          ⋮
        </button>

        {open && (
          <div style={dropdown}>
            {/* Flecha */}
            <div style={arrow} />

            <Link
              href={`/super-admin/restaurants/${restaurantId}/edit`}
              style={menuLink}
              onClick={() => setOpen(false)}
            >
              <span style={icon}>✏️</span>
              Editar
            </Link>

            <button
              style={menuItem}
              onClick={() => {
                setOpen(false);
                onToggleStatus?.();
              }}
            >
              <span style={icon}>{active ? "⏸" : "▶"}</span>
              {active ? "Desactivar" : "Activar"}
            </button>

            <div style={divider} />

            <button
              style={{
                ...menuItem,
                color: "#ef4444",
              }}
              onClick={() => {
                setOpen(false);
                onDelete?.();
              }}
            >
              <span style={icon}>🗑️</span>
              Eliminar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ===================================================== */
/* ESTILOS                                               */
/* ===================================================== */

const primaryButton: React.CSSProperties = {
  width: "100%",
  height: 48,
  border: "none",
  borderRadius: 14,
  background: "linear-gradient(135deg,#ff8a1f,#ff6200)",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  transition: ".25s",
};

const secondaryButton: React.CSSProperties = {
  width: "100%",
  height: 48,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.08)",
  background: "#1b1b1b",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 700,
  fontSize: 14,
  transition: ".25s",
};

const menuButton: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 14,
  border: "1px solid rgba(255,255,255,.08)",
  background: "#1b1b1b",
  color: "#fff",
  cursor: "pointer",
  fontSize: 22,
  fontWeight: 700,
  transition: ".25s",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const dropdown: React.CSSProperties = {
  position: "absolute",
  bottom: 58,
  right: 0,
  width: 235,
  overflow: "visible",
  borderRadius: 18,
  background: "linear-gradient(180deg,#1d1d1d,#171717)",
  border: "1px solid rgba(255,255,255,.08)",
  boxShadow: "0 30px 80px rgba(0,0,0,.45)",
  zIndex: 999999,
  animation: "menuOpen .18s ease-out",
};

const arrow: React.CSSProperties = {
  position: "absolute",
  right: 18,
  bottom: -8,
  width: 16,
  height: 16,
  transform: "rotate(45deg)",
  background: "#181818",
  borderRight: "1px solid rgba(255,255,255,.08)",
  borderBottom: "1px solid rgba(255,255,255,.08)",
};

const menuLink: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "15px 18px",
  color: "#fff",
  textDecoration: "none",
  fontSize: 14,
  fontWeight: 500,
  position: "relative",
  zIndex: 2,
};

const menuItem: React.CSSProperties = {
  width: "100%",
  display: "flex",
  alignItems: "center",
  gap: 14,
  padding: "15px 18px",
  border: "none",
  background: "transparent",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
  fontWeight: 500,
  textAlign: "left",
  position: "relative",
  zIndex: 2,
};

const icon: React.CSSProperties = {
  width: 20,
  display: "flex",
  justifyContent: "center",
  flexShrink: 0,
};

const divider: React.CSSProperties = {
  height: 1,
  margin: "6px 0",
  background: "rgba(255,255,255,.08)",
};