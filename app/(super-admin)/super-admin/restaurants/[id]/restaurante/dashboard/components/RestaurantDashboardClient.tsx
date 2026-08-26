"use client";

import Link from "next/link";
import { ArrowRight, Bell } from "lucide-react";

import { useSession } from "@/providers/SessionProvider";
import {
  WolfBadge,
  WolfCard,
  WolfColors,
  WolfRadius,
  WolfSpacing,
  WolfTypography,
} from "@/lib/wolf-ui";
import {
  restaurantModules,
  RESTAURANT_MODULE_COUNT,
} from "@/lib/navigation/restaurantModules";

export default function RestaurantDashboardClient() {
  const { user } = useSession();
  const restaurantId = user?.restaurant_id ?? "";
  const permissions = user?.permissions ?? [];
  const isSuperAdmin =
    user?.role?.code?.trim().toLowerCase() === "super-user";

  const allowedModules = (isSuperAdmin
    ? restaurantModules
    : restaurantModules.filter((module) => permissions.includes(module.code))
  ).map((module) => ({ ...module, href: module.href(restaurantId) }));

  const orderModule =
    allowedModules.find((module) => module.code === "orders") ??
    allowedModules.find((module) => module.category === "business");

  const greetingName = user?.full_name?.trim()?.split(" ")[0] || "bienvenido";

  return (
    <div style={{ width: "100%", maxWidth: 1180, margin: "0 auto" }}>
      <header style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 16, marginBottom: 24 }}>
        <div>
          <div style={{ color: WolfColors.textMuted, fontSize: 9, fontWeight: 800, letterSpacing: "1.2px", textTransform: "uppercase", marginBottom: 7 }}>
            Wolf Restaurant OS
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 9, flexWrap: "wrap" }}>
            <h1 style={{ margin: 0, color: WolfColors.text, fontFamily: WolfTypography.fontFamily, fontSize: "clamp(27px, 5vw, 38px)", lineHeight: 1, fontWeight: 800, letterSpacing: "-1px" }}>
              Hola, <span style={{ color: WolfColors.primary }}>{greetingName}</span>
            </h1>
            <WolfBadge variant="success" size="sm">Online</WolfBadge>
          </div>
          <p style={{ margin: "8px 0 0", color: WolfColors.textMuted, fontSize: 12 }}>
            {isSuperAdmin
              ? "Vista completa del restaurante desde Super Admin."
              : "Opera tu restaurante desde un solo lugar."}
          </p>
        </div>

        <button type="button" aria-label="Notificaciones" style={{ width: 42, height: 42, display: "grid", placeItems: "center", border: `1px solid ${WolfColors.border}`, borderRadius: WolfRadius.md, background: WolfColors.surface, color: WolfColors.textSecondary, cursor: "pointer" }}>
          <Bell size={18} />
        </button>
      </header>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 10, marginBottom: 22 }}>
        <WolfCard padding="sm" style={{ minHeight: 72 }}>
          <div style={statLabelStyle}>Rol</div>
          <div style={statValueStyle}>{user?.role?.name || "Restaurante"}</div>
        </WolfCard>
        <WolfCard padding="sm" style={{ minHeight: 72 }}>
          <div style={statLabelStyle}>Accesos</div>
          <div style={statValueStyle}>{allowedModules.length} módulos</div>
        </WolfCard>
        <WolfCard padding="sm" style={{ minHeight: 72 }}>
          <div style={statLabelStyle}>Cobertura</div>
          <div style={statValueStyle}>{isSuperAdmin ? `${allowedModules.length}/${RESTAURANT_MODULE_COUNT}` : `${allowedModules.length} asignados`}</div>
        </WolfCard>
      </div>

      {orderModule && (
        <Link href={orderModule.href} style={{ position: "relative", display: "block", overflow: "hidden", minHeight: 190, marginBottom: 24, padding: 20, boxSizing: "border-box", borderRadius: WolfRadius["2xl"], border: "1px solid rgba(249,115,22,.25)", background: "linear-gradient(145deg, rgba(249,115,22,.16), rgba(255,255,255,.025) 55%, rgba(255,255,255,.01))", color: WolfColors.text, textDecoration: "none", boxShadow: "0 18px 45px rgba(0,0,0,.22)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ width: 50, height: 50, display: "grid", placeItems: "center", borderRadius: WolfRadius.lg, background: WolfColors.primarySoft, color: WolfColors.primary }}>{orderModule.icon}</div>
            <WolfBadge variant="success" size="sm">Disponible</WolfBadge>
          </div>
          <div style={{ marginTop: 24 }}>
            <div style={{ color: WolfColors.primary, fontSize: 8, fontWeight: 800, letterSpacing: "1px", textTransform: "uppercase" }}>Operación principal</div>
            <div style={{ marginTop: 5, fontSize: 26, lineHeight: 1, fontWeight: 800 }}>{orderModule.title}</div>
            <div style={{ maxWidth: 500, marginTop: 7, color: WolfColors.textMuted, fontSize: 11.5, lineHeight: 1.45 }}>{orderModule.description}</div>
          </div>
          <div style={{ position: "absolute", right: 20, bottom: 18, display: "flex", alignItems: "center", gap: 7, color: WolfColors.primary, fontSize: 11, fontWeight: 800 }}>Entrar <ArrowRight size={16} /></div>
        </Link>
      )}

      {allowedModules.length === 0 && (
        <WolfCard variant="outlined" padding="lg" style={{ textAlign: "center" }}>
          <div style={{ color: WolfColors.text, fontSize: 15, fontWeight: 700 }}>No tienes módulos asignados</div>
          <div style={{ marginTop: 6, color: WolfColors.textMuted, fontSize: 11 }}>Contacta al administrador de Wolf Ordering.</div>
        </WolfCard>
      )}

      <footer style={{ display: "flex", justifyContent: "space-between", paddingTop: WolfSpacing.sm, color: WolfColors.textMuted, fontSize: 8, textTransform: "uppercase", letterSpacing: ".7px" }}>
        <span>Wolf Ordering</span>
        <span>{allowedModules.length} / {RESTAURANT_MODULE_COUNT} módulos</span>
      </footer>
    </div>
  );
}

const statLabelStyle = {
  color: WolfColors.textMuted,
  fontSize: 8,
  fontWeight: 800,
  letterSpacing: ".9px",
  textTransform: "uppercase" as const,
};

const statValueStyle = {
  marginTop: 6,
  color: WolfColors.text,
  fontSize: 14,
  fontWeight: 700,
};
