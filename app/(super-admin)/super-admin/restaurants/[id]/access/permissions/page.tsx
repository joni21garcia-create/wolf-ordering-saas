"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

type Role = { id: string; name: string; code: string };
type Module = { id: string; code: string; name: string };

type Category = {
  key: string;
  label: string;
  color: string;
  soft: string;
};

const CATEGORIES: Category[] = [
  { key: "operacion", label: "Operación", color: "#22c55e", soft: "rgba(34,197,94,.08)" },
  { key: "experiencia", label: "Experiencia", color: "#60a5fa", soft: "rgba(96,165,250,.08)" },
  { key: "negocio", label: "Negocio", color: "#f59e0b", soft: "rgba(245,158,11,.08)" },
  { key: "marketing", label: "Marketing", color: "#ec4899", soft: "rgba(236,72,153,.08)" },
  { key: "administracion", label: "Administración", color: "#a78bfa", soft: "rgba(167,139,250,.08)" },
  { key: "sistema", label: "Sistema", color: "#94a3b8", soft: "rgba(148,163,184,.08)" },
];

function getCategory(module: Module): Category {
  const value = `${module.code} ${module.name}`.toLowerCase();

  if (
    /pedido|order|delivery|repart|cocina|kitchen|mesa|mesas|pos|inventario|stock|producto|menu|menú|horario|operacion|operación/.test(
      value
    )
  ) {
    return CATEGORIES[0];
  }

  if (
    /hero|navbar|footer|about|servicio|servicios|cta|social|reseña|resena|experiencia|landing|pwa|branding|marca|tema|diseño|diseno/.test(
      value
    )
  ) {
    return CATEGORIES[1];
  }

  if (
    /finanza|finance|factur|pago|payment|precio|venta|ventas|cliente|customer|restaurant|restaurante|negocio|analytics|estadistica|estadística|report|reporte/.test(
      value
    )
  ) {
    return CATEGORIES[2];
  }

  if (
    /marketing|promo|promoc|campaña|campana|coupon|cupon|banner|newsletter|whatsapp|ads|publicidad|seo/.test(
      value
    )
  ) {
    return CATEGORIES[3];
  }

  if (
    /usuario|user|rol|role|permiso|permission|seguridad|security|access|acceso|admin|administr/.test(
      value
    )
  ) {
    return CATEGORIES[4];
  }

  return CATEGORIES[5];
}

export default function PermissionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const restaurantId = params.id as string;
  const roleFromUrl = searchParams.get("role");

  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>({
    operacion: true,
    experiencia: false,
    negocio: false,
    marketing: false,
    administracion: false,
    sistema: false,
  });

  useEffect(() => {
    loadData();
  }, [roleFromUrl, restaurantId]);

  async function loadData() {
    const [{ data: rolesData }, { data: modulesData }] = await Promise.all([
      supabase
        .from("restaurant_roles")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("name"),
      supabase.from("system_modules").select("*").order("name"),
    ]);

    setRoles(rolesData || []);
    setModules(modulesData || []);

    if (rolesData && rolesData.length > 0) {
      const initialRole = roleFromUrl || rolesData[0].id;
      setSelectedRole(initialRole);
      loadPermissions(initialRole);
    }
  }

  async function loadPermissions(roleId: string) {
    const { data } = await supabase
      .from("role_modules")
      .select("module_code")
      .eq("role_id", roleId)
      .eq("can_view", true);

    setPermissions((data || []).map((x) => x.module_code));
  }

  async function savePermissions() {
    if (!selectedRole) {
      alert("Selecciona un rol antes de guardar.");
      return;
    }

    setSaving(true);

    try {
      const { error: deleteError } = await supabase
        .from("role_modules")
        .delete()
        .eq("role_id", selectedRole);

      if (deleteError) {
        console.error("Error eliminando permisos:", deleteError);
        alert(`No se pudieron eliminar los permisos: ${deleteError.message}`);
        return;
      }

      const rows = permissions.map((moduleCode) => ({
        role_id: selectedRole,
        module_code: moduleCode,
        can_view: true,
      }));

      if (rows.length > 0) {
        const { error: insertError } = await supabase
          .from("role_modules")
          .insert(rows);

        if (insertError) {
          console.error("Error insertando permisos:", insertError);
          alert(`No se pudieron guardar los permisos: ${insertError.message}`);
          return;
        }
      }

      const { data: savedPermissions, error: reloadError } = await supabase
        .from("role_modules")
        .select("module_code")
        .eq("role_id", selectedRole)
        .eq("can_view", true);

      if (reloadError) {
        console.error("Error verificando permisos:", reloadError);
        alert(
          `Los permisos se guardaron, pero no se pudieron verificar: ${reloadError.message}`
        );
        return;
      }

      const savedCodes = (savedPermissions || []).map(
        (item) => item.module_code
      );

      setPermissions(savedCodes);
      alert("Permisos actualizados correctamente");
    } catch (error) {
      console.error("Error inesperado guardando permisos:", error);
      alert("Error inesperado guardando permisos.");
    } finally {
      setSaving(false);
    }
  }

  const groupedModules = useMemo(() => {
    const groups: Record<string, Module[]> = {};

    for (const category of CATEGORIES) {
      groups[category.key] = [];
    }

    for (const module of modules) {
      groups[getCategory(module).key].push(module);
    }

    return groups;
  }, [modules]);

  const toggleCategory = (key: string) => {
    setOpenCategories((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const togglePermission = (moduleCode: string) => {
    setPermissions((current) =>
      current.includes(moduleCode)
        ? current.filter((p) => p !== moduleCode)
        : [...current, moduleCode]
    );
  };

  return (
    <PermissionGuard permission="permissions">
      <main style={mainContainerStyle}>
        <header style={headerStyle}>
          <div style={{ minWidth: 0 }}>
            <button
              type="button"
              onClick={() => router.back()}
              disabled={saving}
              style={backButtonStyle}
              aria-label="Volver"
            >
              <span style={backIconStyle}>‹</span>
              <span>Volver</span>
            </button>

            <div style={eyebrowStyle}>Acceso / Seguridad</div>

            <div style={titleRowStyle}>
              <div>
                <h1 style={titleStyle}>Permisos</h1>
                <p style={subtitleStyle}>
                  Organiza el acceso por categorías y activa solo lo necesario.
                </p>
              </div>

              <div style={activeSummaryStyle}>
                <strong>{permissions.length}</strong>
                <span>activos</span>
              </div>
            </div>
          </div>

          <div style={roleControlStyle}>
            <span style={roleLabelStyle}>Rol operativo</span>
            <select
              aria-label="Seleccionar rol"
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                loadPermissions(e.target.value);
              }}
              style={selectStyle}
            >
              {roles.map((role) => (
                <option
                  key={role.id}
                  value={role.id}
                  style={{ background: "#090909", color: "#fff" }}
                >
                  {role.name}
                </option>
              ))}
            </select>
          </div>
        </header>

        <section style={contentStyle}>
          <div style={moduleHeaderStyle}>
            <div>
              <span style={sectionTitleStyle}>Módulos</span>
              <span style={countStyle}>{modules.length} disponibles</span>
            </div>

            <span style={hintStyle}>
              Toca una categoría para desplegarla
            </span>
          </div>

          <div style={accordionListStyle}>
            {CATEGORIES.map((category) => {
              const categoryModules = groupedModules[category.key] || [];
              if (categoryModules.length === 0) return null;

              const isOpen = Boolean(openCategories[category.key]);
              const selectedInCategory = categoryModules.filter((module) =>
                permissions.includes(module.code)
              ).length;

              return (
                <section
                  key={category.key}
                  style={{
                    ...accordionStyle,
                    borderColor: isOpen
                      ? `${category.color}35`
                      : "rgba(255,255,255,.055)",
                    background: isOpen
                      ? category.soft
                      : "rgba(255,255,255,.018)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => toggleCategory(category.key)}
                    aria-expanded={isOpen}
                    style={accordionTriggerStyle}
                  >
                    <span
                      style={{
                        ...categoryDotStyle,
                        background: category.color,
                        boxShadow: `0 0 12px ${category.color}55`,
                      }}
                    />

                    <span style={categoryTextStyle}>
                      <strong>{category.label}</strong>
                      <small>
                        {categoryModules.length} módulo
                        {categoryModules.length === 1 ? "" : "s"}
                      </small>
                    </span>

                    <span
                      style={{
                        ...categoryCountStyle,
                        color: category.color,
                      }}
                    >
                      {selectedInCategory > 0
                        ? `${selectedInCategory}/${categoryModules.length}`
                        : "0"}
                    </span>

                    <span
                      style={{
                        ...chevronStyle,
                        transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
                      }}
                    >
                     ⌄
                    </span>
                  </button>

                  {isOpen && (
                    <div style={moduleListStyle}>
                      {categoryModules.map((module) => {
                        const isSelected = permissions.includes(module.code);

                        return (
                          <button
                            type="button"
                            key={module.id}
                            aria-pressed={isSelected}
                            onClick={() => togglePermission(module.code)}
                            style={{
                              ...moduleStyle,
                              borderColor: isSelected
                                ? `${category.color}65`
                                : "rgba(255,255,255,.055)",
                              background: isSelected
                                ? `${category.color}12`
                                : "rgba(0,0,0,.16)",
                            }}
                          >
                            <span
                              style={{
                                ...moduleNameStyle,
                                color: isSelected
                                  ? "#fff"
                                  : "rgba(255,255,255,.66)",
                              }}
                            >
                              {module.name}
                            </span>

                            <span
                              aria-hidden="true"
                              style={{
                                ...indicatorStyle,
                                background: isSelected
                                  ? category.color
                                  : "transparent",
                                borderColor: isSelected
                                  ? category.color
                                  : "rgba(255,255,255,.18)",
                                boxShadow: isSelected
                                  ? `0 0 0 3px ${category.color}18`
                                  : "none",
                              }}
                            />
                          </button>
                        );
                      })}
                    </div>
                  )}
                </section>
              );
            })}
          </div>

          <div style={footerStyle}>
            <span style={footerStatusStyle}>
              {permissions.length === 0
                ? "Sin módulos seleccionados"
                : `${permissions.length} módulo${
                    permissions.length === 1 ? "" : "s"
                  } seleccionado${
                    permissions.length === 1 ? "" : "s"
                  }`}
            </span>

            <button
              onClick={savePermissions}
              disabled={saving}
              style={{
                ...saveBtnStyle,
                opacity: saving ? 0.55 : 1,
                cursor: saving ? "wait" : "pointer",
              }}
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>
          </div>
        </section>

        <style>{`
          @media (max-width: 640px) {
            .permissions-page-header {
              gap: 14px !important;
            }

            .permissions-content {
              padding: 13px !important;
              border-radius: 16px !important;
            }

            .permissions-role {
              width: 100% !important;
            }

            .permissions-module-grid {
              grid-template-columns: 1fr !important;
            }

            .permissions-footer {
              position: sticky;
              bottom: 10px;
              z-index: 5;
              background: rgba(10,10,10,.92);
              backdrop-filter: blur(16px);
              border: 1px solid rgba(255,255,255,.07);
              border-radius: 14px;
              padding: 9px !important;
              margin-top: 12px !important;
            }

            .permissions-save {
              width: 100%;
              min-height: 42px !important;
            }

            .permissions-footer-status {
              display: none;
            }
          }
        `}</style>
      </main>
    </PermissionGuard>
  );
}

// =====================================================
// VISTA ULTRA MINIMALISTA + ACORDEÓN
// =====================================================

const mainContainerStyle: CSSProperties = {
  maxWidth: "1080px",
  margin: "0 auto",
  padding: "20px 18px 50px",
  color: "#fff",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  boxSizing: "border-box",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "20px",
  marginBottom: "16px",
  flexWrap: "wrap",
};

const backButtonStyle: CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "6px",
  border: "1px solid rgba(255,255,255,.07)",
  background: "rgba(255,255,255,.035)",
  color: "rgba(255,255,255,.62)",
  borderRadius: "999px",
  padding: "6px 10px 6px 7px",
  marginBottom: "12px",
  cursor: "pointer",
  fontSize: "11px",
  fontWeight: 700,
  transition: "all .16s ease",
};

const backIconStyle: CSSProperties = {
  display: "grid",
  placeItems: "center",
  width: "19px",
  height: "19px",
  borderRadius: "50%",
  background: "rgba(249,115,22,.12)",
  color: "#f97316",
  fontSize: "19px",
  lineHeight: "16px",
};

const eyebrowStyle: CSSProperties = {
  color: "#f97316",
  fontSize: "9px",
  fontWeight: 800,
  letterSpacing: "1.3px",
  textTransform: "uppercase",
  marginBottom: "5px",
};

const titleRowStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: "14px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(26px, 4vw, 36px)",
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "-1.4px",
};

const subtitleStyle: CSSProperties = {
  margin: "7px 0 0",
  color: "rgba(255,255,255,.38)",
  fontSize: "11px",
  lineHeight: 1.4,
};

const activeSummaryStyle: CSSProperties = {
  display: "flex",
  alignItems: "baseline",
  gap: "4px",
  padding: "7px 10px",
  borderRadius: "9px",
  border: "1px solid rgba(249,115,22,.14)",
  background: "rgba(249,115,22,.045)",
  whiteSpace: "nowrap",
};

const roleControlStyle: CSSProperties = {
  width: "min(250px, 100%)",
};

const roleLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "5px",
  color: "rgba(255,255,255,.3)",
  fontSize: "9px",
  fontWeight: 800,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const selectStyle: CSSProperties = {
  width: "100%",
  height: "40px",
  padding: "0 11px",
  background: "rgba(8,8,8,.92)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "10px",
  fontSize: "11px",
  fontWeight: 650,
  outline: "none",
  cursor: "pointer",
  colorScheme: "dark",
  boxSizing: "border-box",
};

const contentStyle: CSSProperties = {
  background: "rgba(10,10,10,.62)",
  border: "1px solid rgba(255,255,255,.055)",
  borderRadius: "18px",
  padding: "16px",
  boxShadow: "0 18px 45px rgba(0,0,0,.20)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const moduleHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "12px",
  marginBottom: "10px",
  padding: "0 2px",
  flexWrap: "wrap",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "11px",
  fontWeight: 750,
  color: "rgba(255,255,255,.76)",
};

const countStyle: CSSProperties = {
  marginLeft: "7px",
  color: "#f97316",
  fontSize: "9px",
  fontWeight: 750,
};

const hintStyle: CSSProperties = {
  color: "rgba(255,255,255,.22)",
  fontSize: "9px",
};

const accordionListStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "7px",
};

const accordionStyle: CSSProperties = {
  borderWidth: "1px",
  borderStyle: "solid",
  borderRadius: "12px",
  overflow: "hidden",
  transition: "border-color .16s ease, background .16s ease",
};

const accordionTriggerStyle: CSSProperties = {
  width: "100%",
  minHeight: "46px",
  border: 0,
  background: "transparent",
  color: "#fff",
  display: "flex",
  alignItems: "center",
  gap: "9px",
  padding: "7px 10px",
  cursor: "pointer",
  textAlign: "left",
  fontFamily: "inherit",
};

const categoryDotStyle: CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "50%",
  flexShrink: 0,
};

const categoryTextStyle: CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: "1px",
  minWidth: 0,
  flex: 1,
};

const categoryCountStyle: CSSProperties = {
  minWidth: "28px",
  textAlign: "right",
  fontSize: "9px",
  fontWeight: 800,
};

const chevronStyle: CSSProperties = {
  width: "18px",
  textAlign: "center",
  color: "rgba(255,255,255,.35)",
  fontSize: "15px",
  lineHeight: 1,
  transition: "transform .16s ease",
};

const moduleListStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(2, minmax(0, 1fr))",
  gap: "6px",
  padding: "0 8px 8px",
};

const moduleStyle: CSSProperties = {
  minHeight: "40px",
  padding: "0 10px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderRadius: "9px",
  cursor: "pointer",
  transition: "border-color .16s ease, background .16s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "8px",
  textAlign: "left",
  fontFamily: "inherit",
  color: "inherit",
};

const moduleNameStyle: CSSProperties = {
  fontSize: "10px",
  fontWeight: 600,
  letterSpacing: "-.05px",
};

const indicatorStyle: CSSProperties = {
  width: "7px",
  height: "7px",
  borderRadius: "999px",
  borderWidth: "1px",
  borderStyle: "solid",
  flexShrink: 0,
  transition: "all .16s ease",
};

const footerStyle: CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  gap: "12px",
  marginTop: "12px",
  paddingTop: "12px",
  borderTop: "1px solid rgba(255,255,255,.055)",
  flexWrap: "wrap",
};

const footerStatusStyle: CSSProperties = {
  color: "rgba(255,255,255,.27)",
  fontSize: "9px",
};

const saveBtnStyle: CSSProperties = {
  border: "1px solid rgba(249,115,22,.35)",
  padding: "9px 15px",
  borderRadius: "9px",
  fontWeight: 750,
  fontSize: "10px",
  background: "#f97316",
  color: "#fff",
  cursor: "pointer",
  letterSpacing: ".05px",
  transition: "all .16s ease",
};