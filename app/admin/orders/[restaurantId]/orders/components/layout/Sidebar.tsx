"use client";

import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  BarChart3,
  Store,
  Users,
  Truck,
  Volume2,
  LogOut,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import {
  useParams,
  usePathname,
} from "next/navigation";
import {
  useEffect,
  useRef,
  type TouchEvent,
} from "react";

import { supabase } from "@/lib/supabase/client";
import SidebarItem from "./SidebarItem";
import { useSidebar } from "./SidebarContext";
import { useSession } from "@/providers/SessionProvider";

const SWIPE_THRESHOLD = 55;
const EDGE_ZONE = 28;

export default function Sidebar() {
  const pathname = usePathname();
  const params = useParams();
  const { user } = useSession();

  const roleCode = String(user?.role?.code ?? "")
    .trim()
    .toLowerCase();

  const restaurantId =
    typeof params.restaurantId === "string"
      ? params.restaurantId
      : "";

  const {
    collapsed,
    toggle,
    open,
    close,
  } = useSidebar();

  const touchStartX = useRef<number | null>(null);
  const touchStartY = useRef<number | null>(null);

  const MENU = [
    {
      label: "Pedidos",
      href: `/admin/orders/${restaurantId}/orders`,
      icon: ShoppingBag,
      highlight: true,
      roles: ["cocina", "kitchen", "cashier", "manager", "owner", "super-user"],
    },
    {
      label: "Ventas",
      href: `/admin/sales/${restaurantId}`,
      icon: BarChart3,
      highlight: false,
      roles: ["manager", "owner", "super-user"],
    },
    {
      label: "Restaurante",
      href: `/admin/restaurant/${restaurantId}`,
      icon: Store,
      highlight: false,
      roles: ["cocina", "kitchen", "cashier", "manager", "owner", "super-user"],
    },
    {
      label: "Usuarios",
      href: `/admin/users/${restaurantId}`,
      icon: Users,
      highlight: false,
      roles: ["owner", "super-user"],
    },
    {
      label: "Delivery y Pick-up",
      href: `/admin/restaurant/${restaurantId}/delivery-pickup`,
      icon: Truck,
      highlight: false,
      roles: ["owner", "super-user"],
    },
  ].filter((item) => item.roles.includes(roleCode));

  // En móvil, después de navegar cerramos el panel.
  // En desktop no afecta el comportamiento actual.
  useEffect(() => {
    const isMobile = window.matchMedia(
      "(max-width: 768px)"
    ).matches;

    if (isMobile) {
      close();
    }
  }, [pathname, close]);

  function handleTouchStart(
    event: TouchEvent<HTMLElement>
  ) {
    const touch = event.touches[0];

    if (!touch) return;

    touchStartX.current = touch.clientX;
    touchStartY.current = touch.clientY;
  }

  function handleTouchEndSafe(
    event: TouchEvent<HTMLElement>
  ) {
    const touch = event.changedTouches[0];

    if (
      !touch ||
      touchStartX.current === null ||
      touchStartY.current === null
    ) {
      return;
    }

    const startX = touchStartX.current;
    const startY = touchStartY.current;

    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;

    touchStartX.current = null;
    touchStartY.current = null;

    if (Math.abs(deltaY) > Math.abs(deltaX)) {
      return;
    }

    if (
      collapsed &&
      startX <= EDGE_ZONE &&
      deltaX >= SWIPE_THRESHOLD
    ) {
      open();
      return;
    }

    if (
      !collapsed &&
      deltaX <= -SWIPE_THRESHOLD
    ) {
      close();
    }
  }

  async function handleLogout() {
    const { error } =
      await supabase.auth.signOut();

    if (error) {
      console.error(
        "Error al cerrar sesión:",
        error
      );
      return;
    }

    window.location.replace("/login");
  }

  return (
    <>
      {/* Zona táctil invisible del borde izquierdo.
          Permite abrir el sidebar con un swipe desde el borde. */}
      {collapsed && (
        <div
          aria-hidden="true"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEndSafe}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            bottom: 0,
            width: EDGE_ZONE,
            zIndex: 190,
            touchAction: "pan-y",
          }}
        />
      )}

      {/* Overlay móvil. Tocar fuera cierra el panel. */}
      {!collapsed && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={close}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEndSafe}
          style={{
            position: "fixed",
            inset: 0,
            border: 0,
            padding: 0,
            background: "rgba(0,0,0,.42)",
            backdropFilter: "blur(2px)",
            zIndex: 195,
            cursor: "default",
          }}
        />
      )}

      <aside
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEndSafe}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          bottom: 0,
          width: collapsed ? 64 : 240,
          maxWidth: "88vw",
          background: collapsed
            ? "transparent"
            : "#111111",
          borderRight: collapsed
            ? "none"
            : "1px solid rgba(255,255,255,.05)",
          boxShadow: collapsed
            ? "none"
            : "10px 0 35px rgba(0,0,0,.28)",
          transform: "translateX(0)",
          transition:
            "width .28s ease, background .28s ease, box-shadow .28s ease",
          zIndex: 200,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          touchAction: "pan-y",
        }}
      >
        {/* HEADER / LOGO */}
        <div
          style={{
            height: 74,
            display: "flex",
            alignItems: "center",
            justifyContent: collapsed
              ? "center"
              : "space-between",
            padding: collapsed
              ? 0
              : "0 18px",
            borderBottom: collapsed
              ? "none"
              : "1px solid rgba(255,255,255,.05)",
            flexShrink: 0,
          }}
        >
          {collapsed ? (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Image
                src="/wolf-log.png"
                alt="Wolf"
                width={28}
                height={28}
                priority
                style={{
                  objectFit: "contain",
                }}
              />

              <span
                style={{
                  fontSize: 7,
                  fontWeight: 700,
                  color: "#fff",
                  lineHeight: 1,
                  letterSpacing: ".2px",
                }}
              >
                Wolf
              </span>
            </div>
          ) : (
            <>
              <Link
                href="/"
                style={{
                  color: "#fff",
                  textDecoration: "none",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 9,
                  }}
                >
                  <Image
                    src="/wolf-log.png"
                    alt="Wolf"
                    width={28}
                    height={28}
                    priority
                    style={{
                      objectFit: "contain",
                    }}
                  />

                  <span
                    style={{
                      fontSize: 16,
                      fontWeight: 800,
                      lineHeight: 1,
                    }}
                  >
                    Wolf
                  </span>
                </div>
              </Link>

              <button
                onClick={toggle}
                type="button"
                aria-label="Contraer sidebar"
                style={{
                  width: 34,
                  height: 34,
                  border: "none",
                  borderRadius: 10,
                  background:
                    "rgba(255,255,255,.08)",
                  backdropFilter: "blur(10px)",
                  cursor: "pointer",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ChevronLeft size={16} />
              </button>
            </>
          )}
        </div>

        {/* BOTÓN EXPANDIR CUANDO ESTÁ CERRADO */}
        {collapsed && (
          <button
            onClick={toggle}
            type="button"
            aria-label="Expandir sidebar"
            style={{
              position: "fixed",
              top: 78,
              left: 17,
              width: 30,
              height: 30,
              border: "none",
              borderRadius: 10,
              background:
                "rgba(255,255,255,.12)",
              backdropFilter: "blur(12px)",
              cursor: "pointer",
              color: "#fff",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              zIndex: 300,
            }}
          >
            <ChevronRight size={15} />
          </button>
        )}

        {/* MENÚ */}
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            padding: collapsed
              ? "56px 6px 12px"
              : "14px 10px",
            gap: 6,
            minHeight: 0,
          }}
        >
          {MENU.map((item) => {
            const isCurrentPath =
              pathname.startsWith(item.href);

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (
                    window.matchMedia(
                      "(max-width: 768px)"
                    ).matches
                  ) {
                    close();
                  }
                }}
                style={{
                  textDecoration: "none",
                }}
              >
                <SidebarItem
                  icon={item.icon}
                  label={item.label}
                  /*
                   * Solamente Pedidos utiliza el
                   * highlight naranja.
                   *
                   * Los demás módulos permanecen
                   * visualmente neutros.
                   */
                  active={
                    item.highlight
                      ? isCurrentPath
                      : false
                  }
                  collapsed={collapsed}
                />
              </Link>
            );
          })}

          {/* ACCIONES INFERIORES */}
          <div
            style={{
              marginTop: "auto",
              paddingTop: 10,
              borderTop:
                "1px solid rgba(255,255,255,.05)",
            }}
          >
            {/* SONIDO */}
            <Link
              href={`/admin/restaurant/${restaurantId}/sound`}
              onClick={() => {
                if (
                  window.matchMedia(
                    "(max-width: 768px)"
                  ).matches
                ) {
                  close();
                }
              }}
              style={{
                textDecoration: "none",
                display: "block",
              }}
            >
              <SidebarItem
                icon={Volume2}
                label="Sonido"
                active={false}
                collapsed={collapsed}
              />
            </Link>

            {/* SALIR */}
<SidebarItem
  icon={LogOut}
  label="Salir"
  active={false}
  collapsed={collapsed}
  onClick={handleLogout}
/>
          </div>
        </div>
      </aside>
    </>
  );
}