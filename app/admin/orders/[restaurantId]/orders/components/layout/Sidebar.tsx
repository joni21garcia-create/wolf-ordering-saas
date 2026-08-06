"use client";


import {
  ChevronLeft,
  ChevronRight,
  ShoppingBag,
  BarChart3,
  Store,
  Settings,
} from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import {
  useParams,
  usePathname,
} from "next/navigation";

import SidebarItem from "./SidebarItem";
import { useSidebar } from "./SidebarContext";



export default function Sidebar() {
  const pathname = usePathname();

  const params = useParams();

const restaurantId =
  typeof params.restaurantId === "string"
    ? params.restaurantId
    : "";


  const MENU = [

  {
    label: "Pedidos",
    href: `/admin/orders/${restaurantId}/orders`,
    icon: ShoppingBag,
  },

  {
    label: "Ventas",
    href: `/admin/sales/${restaurantId}`,
    icon: BarChart3,
  },

  {
    label: "Restaurante",
    href: `/admin/restaurant/${restaurantId}`,
    icon: Store,
  },

  {
    label: "Configuración",
    href: `/admin/settings/${restaurantId}`,
    icon: Settings,
  },

];

  const {
    collapsed,
    toggle,
  } = useSidebar();

  return (
    <aside
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        bottom: 0,

        width: collapsed ? 64 : 240,

        background: collapsed
          ? "transparent"
          : "#111111",

        borderRight: collapsed
          ? "none"
          : "1px solid rgba(255,255,255,.05)",

        transition:
          "width .28s ease, background .28s ease",

        zIndex: 200,

        display: "flex",
        flexDirection: "column",

        overflow: "hidden",
      }}
    >
      {/* HEADER */}

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
        }}
      >
        {collapsed ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 3,
            }}
          >
            <Image
              src="/wolf-log.png"
              alt="Wolf"
              width={18}
              height={18}
              priority
            />

            <span
              style={{
                fontSize: 8,
                fontWeight: 700,
                color: "#fff",
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
                  gap: 8,
                }}
              >
                <Image
                  src="/wolf-log.png"
                  alt="Wolf"
                  width={20}
                  height={20}
                  priority
                />

                <span
                  style={{
                    fontSize: 19,
                    fontWeight: 800,
                  }}
                >
                  Wolf
                </span>
              </div>

              <div
                style={{
                  marginLeft: 28,
                  marginTop: 3,
                  color: "#777",
                  fontSize: 11,
                }}
              >
                Ordering SaaS
              </div>
            </Link>

            <button
              onClick={toggle}
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

      {collapsed && (
        <button
          onClick={toggle}
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

           {/* MENU */}

      <div
        style={{
          flex: 1,

          display: "flex",
          flexDirection: "column",

          padding: collapsed
            ? "56px 6px 12px"
            : "14px 10px",

          gap: 6,
        }}
      >
        {MENU.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            style={{
              textDecoration: "none",
            }}
          >
            <SidebarItem
              icon={item.icon}
              label={item.label}
              active={pathname.startsWith(item.href)}
              collapsed={collapsed}
            />
          </Link>
        ))}
      </div>

      {/* FOOTER */}

      <div
        style={{
          padding: collapsed ? 8 : 16,

          borderTop: collapsed
            ? "none"
            : "1px solid rgba(255,255,255,.05)",

          transition: ".25s",
        }}
      >
        {collapsed ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
            }}
          >
            <div
              style={{
                width: 30,
                height: 30,

                borderRadius: "50%",

                background:
                  "linear-gradient(135deg,#F97316,#EA580C)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: "#fff",
                fontWeight: 700,
                fontSize: 12,
              }}
            >
              N
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,

                borderRadius: "50%",

                background:
                  "linear-gradient(135deg,#F97316,#EA580C)",

                display: "flex",
                alignItems: "center",
                justifyContent: "center",

                color: "#fff",
                fontWeight: 700,
              }}
            >
              N
            </div>

            <div>
              <div
                style={{
                  color: "#fff",
                  fontSize: 14,
                  fontWeight: 600,
                }}
              >
                Nicolás
              </div>

              <div
                style={{
                  color: "#777",
                  fontSize: 12,
                }}
              >
                Administrador
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
