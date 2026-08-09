"use client";

import { useMemo, useState } from "react";
import { useSession } from "@/providers/SessionProvider";
import { dashboardModules } from "../config/modules";

export default function RestaurantDashboardClient() {
  const { user } = useSession();
  const [moduleQuery, setModuleQuery] = useState("");
  const [showModules, setShowModules] = useState(false);

  const restaurantId = user?.restaurant_id ?? "";
  const permissions = user?.permissions ?? [];

  /**
   * FUENTE DE VERDAD:
   * Los módulos continúan viniendo de dashboardModules y se filtran
   * exclusivamente por los permisos reales entregados por SessionProvider.
   */
  const allowedModules = useMemo(
    () =>
      dashboardModules
        .filter((module) => permissions.includes(module.code))
        .map((module) => ({
          ...module,
          href: module.href(restaurantId),
        })),
    [permissions, restaurantId]
  );

  const operationModules = allowedModules.filter(
    (module) => module.category === "operation"
  );

  const settingsModules = allowedModules.filter(
    (module) => module.category === "settings"
  );

  const orderModule =
    allowedModules.find(
      (module) =>
        module.code.toLowerCase().includes("order") ||
        module.code.toLowerCase().includes("pedido") ||
        module.title.toLowerCase().includes("pedido")
    ) ?? operationModules[0];

  const searchableModules = allowedModules.filter((module) => {
    const query = moduleQuery.trim().toLowerCase();

    if (!query) return true;

    return `${module.title} ${module.description} ${module.code}`
      .toLowerCase()
      .includes(query);
  });

  const groupedModules = useMemo(() => {
    const operation = searchableModules.filter(
      (module) => module.category === "operation"
    );
    const settings = searchableModules.filter(
      (module) => module.category === "settings"
    );

    return [
      operation.length ? { title: "Operación", modules: operation } : null,
      settings.length ? { title: "Configuración", modules: settings } : null,
    ].filter(Boolean) as {
      title: string;
      modules: typeof allowedModules;
    }[];
  }, [searchableModules, allowedModules]);

  const greetingName =
    user?.full_name?.trim()?.split(" ")[0] || "bienvenido";

  return (
    <main style={pageStyle}>
      <div style={shellStyle}>
        <header style={headerStyle}>
          <div style={headerIdentityStyle}>
            <div style={eyebrowStyle}>Wolf Ordering</div>
            <h1 style={greetingStyle}>Hola, {greetingName}</h1>
            <p style={restaurantStyle}>{user?.role?.name || "Restaurante"}</p>
          </div>

          <div style={headerActionsStyle}>
            <button
              type="button"
              aria-label="Notificaciones"
              style={iconButtonStyle}
            >
              <span style={{ fontSize: 18 }}>🔔</span>
              <span style={notificationDotStyle} />
            </button>

            <div style={avatarStyle}>
              {(user?.full_name?.trim()?.charAt(0) || "U").toUpperCase()}
            </div>
          </div>
        </header>

        {orderModule && (
          <a href={orderModule.href} style={ordersCardStyle}>
            <div style={ordersAccentStyle} />

            <div style={ordersHeaderStyle}>
              <div style={ordersIconStyle}>
                {orderModule.icon}
              </div>

              <span style={ordersStatusStyle}>
                <span style={ordersStatusDotStyle} />
                Disponible
              </span>
            </div>

            <div style={ordersContentStyle}>
              <div style={ordersKickerStyle}>Operación principal</div>
              <div style={ordersTitleStyle}>
                {orderModule.title || "Pedidos"}
              </div>
              <div style={ordersDescriptionStyle}>
                Gestiona los pedidos de tu restaurante en tiempo real.
              </div>
            </div>

            <div style={ordersFooterStyle}>
              <span>Entrar a pedidos</span>
              <span style={ordersArrowStyle}>→</span>
            </div>
          </a>
        )}

        <section style={modulesSectionStyle}>
          <div style={sectionHeaderStyle}>
            <div>
              <div style={sectionEyebrowStyle}>Accesos</div>
              <h2 style={sectionTitleStyle}>Tus módulos</h2>
            </div>

            <span style={moduleCountStyle}>
              {allowedModules.length}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setShowModules((value) => !value)}
            aria-expanded={showModules}
            style={modulePickerButtonStyle}
          >
            <span style={searchIconStyle}>⌕</span>
            <span style={pickerTextStyle}>
              {moduleQuery || "Buscar módulo..."}
            </span>
            <span
              style={{
                ...pickerChevronStyle,
                transform: showModules
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
              }}
            >
              ⌄
            </span>
          </button>

          {!showModules && operationModules.length > 0 && (
            <div style={compactOperationListStyle}>
              {operationModules
                .filter((module) => module.code !== orderModule?.code)
                .slice(0, 3)
                .map((module) => (
                  <ModuleRow key={module.code} module={module} />
                ))}
            </div>
          )}

          {showModules && (
            <div style={modulePickerStyle}>
              <div style={searchBoxStyle}>
                <span style={searchIconStyle}>⌕</span>
                <input
                  autoFocus
                  value={moduleQuery}
                  onChange={(event) => setModuleQuery(event.target.value)}
                  placeholder="Buscar módulo..."
                  aria-label="Buscar módulo"
                  style={searchInputStyle}
                />

                {moduleQuery && (
                  <button
                    type="button"
                    onClick={() => setModuleQuery("")}
                    aria-label="Limpiar búsqueda"
                    style={clearButtonStyle}
                  >
                    ×
                  </button>
                )}
              </div>

              <div style={moduleResultsStyle}>
                {groupedModules.length === 0 ? (
                  <div style={emptyStyle}>
                    <span style={emptyIconStyle}>⌕</span>
                    <strong>No encontramos ese módulo</strong>
                    <span>Prueba con otro nombre.</span>
                  </div>
                ) : (
                  groupedModules.map((group) => (
                    <div key={group.title}>
                      <div style={groupLabelStyle}>{group.title}</div>

                      <div style={moduleListStyle}>
                        {group.modules.map((module) => (
                          <ModuleRow
                            key={module.code}
                            module={module}
                            onNavigate={() => setShowModules(false)}
                          />
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </section>

        <footer style={footerStyle}>
          <span>Wolf Ordering</span>
          <span>Conectado</span>
        </footer>
      </div>
    </main>
  );
}

function ModuleRow({
  module,
  onNavigate,
}: {
  module: {
    code: string;
    title: string;
    description: string;
    color: string;
    category: "operation" | "settings";
    icon: React.ReactNode;
    href: string;
  };
  onNavigate?: () => void;
}) {
  return (
    <a
      href={module.href}
      onClick={onNavigate}
      style={moduleRowStyle}
    >
      <span
        style={{
          ...moduleRowIconStyle,
          color: module.color,
          background: `${module.color}0D`,
          borderColor: `${module.color}22`,
        }}
      >
        {module.icon}
      </span>

      <span style={moduleCopyStyle}>
        <span style={moduleNameStyle}>{module.title}</span>
        <span style={moduleDescriptionStyle}>
          {module.description}
        </span>
      </span>

      <span style={moduleArrowStyle}>›</span>
    </a>
  );
}

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#070707",
  color: "#fff",
};

const shellStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 720,
  margin: "0 auto",
  padding: "18px 16px 34px",
  boxSizing: "border-box",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: 14,
  marginBottom: 18,
};

const headerIdentityStyle: React.CSSProperties = {
  minWidth: 0,
};

const eyebrowStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.28)",
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "1.25px",
  textTransform: "uppercase",
  marginBottom: 5,
};

const greetingStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "clamp(24px, 7vw, 31px)",
  lineHeight: 1,
  letterSpacing: "-1px",
  fontWeight: 800,
};

const restaurantStyle: React.CSSProperties = {
  margin: "6px 0 0",
  color: "rgba(255,255,255,.38)",
  fontSize: 11,
};

const headerActionsStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 7,
  flexShrink: 0,
};

const iconButtonStyle: React.CSSProperties = {
  position: "relative",
  width: 40,
  height: 40,
  borderRadius: 12,
  border: "1px solid rgba(255,255,255,.07)",
  background: "rgba(255,255,255,.035)",
  color: "#fff",
  display: "grid",
  placeItems: "center",
  cursor: "pointer",
};

const notificationDotStyle: React.CSSProperties = {
  position: "absolute",
  top: 8,
  right: 8,
  width: 5,
  height: 5,
  borderRadius: "50%",
  background: "#f97316",
};

const avatarStyle: React.CSSProperties = {
  width: 40,
  height: 40,
  borderRadius: 12,
  background: "rgba(249,115,22,.11)",
  border: "1px solid rgba(249,115,22,.23)",
  color: "#f97316",
  display: "grid",
  placeItems: "center",
  fontWeight: 800,
  fontSize: 13,
};

const ordersCardStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  display: "block",
  minHeight: 190,
  padding: 17,
  borderRadius: 20,
  textDecoration: "none",
  color: "#fff",
  background:
    "linear-gradient(145deg, rgba(249,115,22,.16), rgba(255,255,255,.025) 54%, rgba(255,255,255,.01))",
  border: "1px solid rgba(249,115,22,.25)",
  boxShadow: "0 16px 38px rgba(0,0,0,.24)",
  boxSizing: "border-box",
  marginBottom: 25,
};

const ordersAccentStyle: React.CSSProperties = {
  position: "absolute",
  right: -70,
  top: -90,
  width: 180,
  height: 180,
  borderRadius: "50%",
  background: "rgba(249,115,22,.12)",
  filter: "blur(38px)",
};

const ordersHeaderStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
};

const ordersIconStyle: React.CSSProperties = {
  width: 48,
  height: 48,
  borderRadius: 14,
  display: "grid",
  placeItems: "center",
  background: "rgba(249,115,22,.11)",
  border: "1px solid rgba(249,115,22,.22)",
  color: "#f97316",
  fontSize: 22,
};

const ordersStatusStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: 6,
  padding: "6px 9px",
  borderRadius: 999,
  background: "rgba(0,0,0,.18)",
  border: "1px solid rgba(255,255,255,.07)",
  color: "rgba(255,255,255,.58)",
  fontSize: 9,
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: ".7px",
};

const ordersStatusDotStyle: React.CSSProperties = {
  width: 5,
  height: 5,
  borderRadius: "50%",
  background: "#22c55e",
};

const ordersContentStyle: React.CSSProperties = {
  position: "relative",
  zIndex: 1,
  marginTop: 24,
};

const ordersKickerStyle: React.CSSProperties = {
  color: "rgba(249,115,22,.85)",
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
  marginBottom: 5,
};

const ordersTitleStyle: React.CSSProperties = {
  fontSize: 25,
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "-.65px",
};

const ordersDescriptionStyle: React.CSSProperties = {
  maxWidth: 420,
  marginTop: 7,
  color: "rgba(255,255,255,.4)",
  fontSize: 11.5,
  lineHeight: 1.4,
};

const ordersFooterStyle: React.CSSProperties = {
  position: "absolute",
  zIndex: 1,
  bottom: 15,
  left: 17,
  right: 17,
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  color: "#f97316",
  fontSize: 11,
  fontWeight: 800,
};

const ordersArrowStyle: React.CSSProperties = {
  fontSize: 19,
  lineHeight: 1,
};

const modulesSectionStyle: React.CSSProperties = {
  marginBottom: 25,
};

const sectionHeaderStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  marginBottom: 10,
};

const sectionEyebrowStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.25)",
  fontSize: 9,
  fontWeight: 800,
  letterSpacing: "1.05px",
  textTransform: "uppercase",
  marginBottom: 3,
};

const sectionTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: 18,
  fontWeight: 800,
  letterSpacing: "-.35px",
};

const moduleCountStyle: React.CSSProperties = {
  minWidth: 26,
  height: 26,
  padding: "0 7px",
  borderRadius: 999,
  display: "grid",
  placeItems: "center",
  background: "rgba(255,255,255,.035)",
  border: "1px solid rgba(255,255,255,.06)",
  color: "rgba(255,255,255,.42)",
  fontSize: 10,
  fontWeight: 700,
};

const modulePickerButtonStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 48,
  display: "flex",
  alignItems: "center",
  gap: 9,
  padding: "0 13px",
  borderRadius: 13,
  border: "1px solid rgba(255,255,255,.07)",
  background: "rgba(255,255,255,.028)",
  color: "#fff",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
  boxSizing: "border-box",
};

const searchIconStyle: React.CSSProperties = {
  flexShrink: 0,
  color: "rgba(255,255,255,.32)",
  fontSize: 21,
  lineHeight: 1,
};

const pickerTextStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  color: "rgba(255,255,255,.4)",
  fontSize: 12,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const pickerChevronStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.25)",
  fontSize: 16,
  lineHeight: 1,
  transition: "transform .15s ease",
};

const compactOperationListStyle: React.CSSProperties = {
  display: "grid",
  gap: 6,
  marginTop: 7,
};

const modulePickerStyle: React.CSSProperties = {
  marginTop: 7,
  overflow: "hidden",
  borderRadius: 15,
  border: "1px solid rgba(255,255,255,.07)",
  background: "rgba(10,10,10,.98)",
  boxShadow: "0 20px 48px rgba(0,0,0,.3)",
};

const searchBoxStyle: React.CSSProperties = {
  minHeight: 47,
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: "0 12px",
  borderBottom: "1px solid rgba(255,255,255,.05)",
};

const searchInputStyle: React.CSSProperties = {
  flex: 1,
  minWidth: 0,
  border: 0,
  outline: 0,
  background: "transparent",
  color: "#fff",
  fontSize: 12,
  fontFamily: "inherit",
};

const clearButtonStyle: React.CSSProperties = {
  width: 23,
  height: 23,
  padding: 0,
  border: 0,
  borderRadius: 999,
  background: "rgba(255,255,255,.06)",
  color: "rgba(255,255,255,.48)",
  cursor: "pointer",
  fontSize: 17,
  lineHeight: 1,
};

const moduleResultsStyle: React.CSSProperties = {
  maxHeight: "min(52vh, 430px)",
  overflowY: "auto",
  padding: "7px",
};

const groupLabelStyle: React.CSSProperties = {
  padding: "8px 7px 5px",
  color: "rgba(255,255,255,.22)",
  fontSize: 8.5,
  fontWeight: 800,
  letterSpacing: "1px",
  textTransform: "uppercase",
};

const moduleListStyle: React.CSSProperties = {
  display: "grid",
  gap: 3,
  marginBottom: 5,
};

const moduleRowStyle: React.CSSProperties = {
  minHeight: 56,
  display: "flex",
  alignItems: "center",
  gap: 10,
  padding: "8px 9px",
  borderRadius: 11,
  color: "#fff",
  textDecoration: "none",
  boxSizing: "border-box",
};

const moduleRowIconStyle: React.CSSProperties = {
  width: 36,
  height: 36,
  flexShrink: 0,
  display: "grid",
  placeItems: "center",
  border: "1px solid transparent",
  borderRadius: 10,
  fontSize: 16,
};

const moduleCopyStyle: React.CSSProperties = {
  minWidth: 0,
  flex: 1,
  display: "flex",
  flexDirection: "column",
  gap: 2,
};

const moduleNameStyle: React.CSSProperties = {
  fontSize: 12.5,
  fontWeight: 700,
  lineHeight: 1.2,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const moduleDescriptionStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.25)",
  fontSize: 9.5,
  lineHeight: 1.25,
  overflow: "hidden",
  textOverflow: "ellipsis",
  whiteSpace: "nowrap",
};

const moduleArrowStyle: React.CSSProperties = {
  flexShrink: 0,
  color: "rgba(255,255,255,.23)",
  fontSize: 20,
  lineHeight: 1,
};

const emptyStyle: React.CSSProperties = {
  minHeight: 130,
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  flexDirection: "column",
  gap: 5,
  color: "rgba(255,255,255,.25)",
  textAlign: "center",
  fontSize: 10.5,
};

const emptyIconStyle: React.CSSProperties = {
  color: "rgba(255,255,255,.16)",
  fontSize: 25,
};

const footerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  gap: 12,
  paddingTop: 4,
  color: "rgba(255,255,255,.15)",
  fontSize: 8.5,
  textTransform: "uppercase",
  letterSpacing: ".7px",
};

export const dynamic = "force-dynamic";