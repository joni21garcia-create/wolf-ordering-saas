"use client";

import type { LucideIcon } from "lucide-react";

interface Props {
  icon: LucideIcon;
  label: string;
  active?: boolean;
  collapsed?: boolean;
  onClick?: () => void;
}

export default function SidebarItem({
  icon: Icon,
  label,
  active = false,
  collapsed = false,
  onClick,
}: Props) {
  return (
    <button
      title={collapsed ? label : undefined}
      onClick={onClick}
style={{
  width: "100%",
  height: collapsed ? 44 : 46,
  display: "flex",
  alignItems: "center",
  justifyContent: collapsed ? "center" : "flex-start",
  gap: collapsed ? 0 : 12,
  padding: collapsed ? 0 : "0 14px",
  borderRadius: 12,
  cursor: "pointer",
  transition: "all .25s ease",

  background: active
  ? "rgba(249,115,22,.10)"
  : "transparent",

  borderLeft: active
    ? "3px solid #F97316"
    : "3px solid transparent",

  color: active
    ? "#F97316"
    : "#B8B8B8",

  borderTop: "none",
  borderRight: "none",
  borderBottom: "none",
}}
      onMouseEnter={(e) => {
        if (!active) {
          e.currentTarget.style.background =
            "rgba(255,255,255,.05)";
        }
      }}
      onMouseLeave={(e) => {
        if (!active) {
          e.currentTarget.style.background =
            "transparent";
        }
      }}
    >
      <Icon
        size={collapsed ? 18 : 19}
        strokeWidth={2}
        style={{
          flexShrink: 0,
        }}
      />

      {!collapsed && (
        <span
          style={{
            fontSize: 14,
            fontWeight: active ? 700 : 500,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      )}
    </button>
  );
}