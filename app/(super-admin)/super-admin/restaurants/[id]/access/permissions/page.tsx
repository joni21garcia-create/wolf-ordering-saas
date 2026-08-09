"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

type Role = { id: string; name: string; code: string };
type Module = { id: string; code: string; name: string };

export default function PermissionsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const restaurantId = params.id as string;
  const roleFromUrl = searchParams.get("role");

  const [roles, setRoles] = useState<Role[]>([]);
  const [modules, setModules] = useState<Module[]>([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadData();
  }, [roleFromUrl]);

  async function loadData() {
    const { data: rolesData } = await supabase.from("restaurant_roles").select("*").eq("restaurant_id", restaurantId).order("name");
    const { data: modulesData } = await supabase.from("system_modules").select("*").order("name");

    setRoles(rolesData || []);
    setModules(modulesData || []);

    if (rolesData && rolesData.length > 0) {
      const initialRole = roleFromUrl || rolesData[0].id;
      setSelectedRole(initialRole);
      loadPermissions(initialRole);
    }
  }

  async function loadPermissions(roleId: string) {
    const { data } = await supabase.from("role_modules").select("module_code").eq("role_id", roleId).eq("can_view", true);
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

  return (
    <PermissionGuard permission="permissions">
      <main style={mainContainerStyle}>
        <header style={headerStyle}>
          <div>
            <div style={eyebrowStyle}>Acceso / Seguridad</div>
            <h1 style={titleStyle}>Permisos</h1>
            <p style={subtitleStyle}>
              Controla los módulos disponibles para cada rol.
            </p>
          </div>

          <div style={roleControlStyle}>
            <span style={roleLabelStyle}>Rol</span>
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
              <span style={countStyle}>{permissions.length} activos</span>
            </div>
            <span style={hintStyle}>Selecciona para activar o desactivar</span>
          </div>

          <div style={gridStyle}>
            {modules.map((module) => {
              const isSelected = permissions.includes(module.code);

              return (
                <button
                  type="button"
                  key={module.id}
                  aria-pressed={isSelected}
                  onClick={() =>
                    isSelected
                      ? setPermissions(
                          permissions.filter((p) => p !== module.code)
                        )
                      : setPermissions([...permissions, module.code])
                  }
                  style={{
                    ...moduleStyle,
                    borderColor: isSelected
                      ? "rgba(249,115,22,.55)"
                      : "rgba(255,255,255,.07)",
                    background: isSelected
                      ? "rgba(249,115,22,.07)"
                      : "rgba(255,255,255,.018)",
                  }}
                >
                  <span
                    style={{
                      ...moduleNameStyle,
                      color: isSelected
                        ? "#fff"
                        : "rgba(255,255,255,.72)",
                    }}
                  >
                    {module.name}
                  </span>

                  <span
                    aria-hidden="true"
                    style={{
                      ...indicatorStyle,
                      background: isSelected ? "#f97316" : "transparent",
                      borderColor: isSelected
                        ? "#f97316"
                        : "rgba(255,255,255,.22)",
                      boxShadow: isSelected
                        ? "0 0 0 3px rgba(249,115,22,.10)"
                        : "none",
                    }}
                  />
                </button>
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
      </main>
    </PermissionGuard>
  );
}

// =====================================================
// VISTA MINIMALISTA PLUS
// =====================================================

const mainContainerStyle: CSSProperties = {
  maxWidth: "1180px",
  margin: "0 auto",
  padding: "42px 28px 70px",
  color: "#fff",
  fontFamily:
    "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
};

const headerStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "flex-end",
  gap: "28px",
  marginBottom: "26px",
  flexWrap: "wrap",
};

const eyebrowStyle: CSSProperties = {
  color: "rgba(255,255,255,.38)",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "1.4px",
  textTransform: "uppercase",
  marginBottom: "8px",
};

const titleStyle: CSSProperties = {
  margin: 0,
  fontSize: "clamp(30px, 4vw, 42px)",
  lineHeight: 1,
  fontWeight: 800,
  letterSpacing: "-1.6px",
};

const subtitleStyle: CSSProperties = {
  margin: "9px 0 0",
  color: "rgba(255,255,255,.42)",
  fontSize: "13px",
};

const roleControlStyle: CSSProperties = {
  width: "min(280px, 100%)",
};

const roleLabelStyle: CSSProperties = {
  display: "block",
  marginBottom: "7px",
  color: "rgba(255,255,255,.32)",
  fontSize: "11px",
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "1px",
};

const contentStyle: CSSProperties = {
  background: "rgba(10,10,10,.62)",
  border: "1px solid rgba(255,255,255,.055)",
  borderRadius: "22px",
  padding: "22px",
  boxShadow: "0 18px 45px rgba(0,0,0,.20)",
  backdropFilter: "blur(16px)",
  WebkitBackdropFilter: "blur(16px)",
};

const moduleHeaderStyle: CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  gap: "16px",
  marginBottom: "18px",
  padding: "0 2px",
  flexWrap: "wrap",
};

const sectionTitleStyle: CSSProperties = {
  fontSize: "13px",
  fontWeight: 700,
  color: "rgba(255,255,255,.78)",
};

const countStyle: CSSProperties = {
  marginLeft: "9px",
  color: "#f97316",
  fontSize: "11px",
  fontWeight: 700,
};

const hintStyle: CSSProperties = {
  color: "rgba(255,255,255,.25)",
  fontSize: "11px",
};

const selectStyle: CSSProperties = {
  width: "100%",
  height: "44px",
  padding: "0 13px",
  background: "rgba(8,8,8,.92)",
  color: "#fff",
  border: "1px solid rgba(255,255,255,.08)",
  borderRadius: "11px",
  fontSize: "13px",
  fontWeight: 600,
  outline: "none",
  cursor: "pointer",
  colorScheme: "dark",
  boxSizing: "border-box",
};

const gridStyle: CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
  gap: "9px",
};

const moduleStyle: CSSProperties = {
  minHeight: "54px",
  padding: "0 14px",
  borderWidth: "1px",
  borderStyle: "solid",
  borderRadius: "11px",
  cursor: "pointer",
  transition:
    "border-color .16s ease, background .16s ease, transform .16s ease",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  textAlign: "left",
  fontFamily: "inherit",
  color: "inherit",
};

const moduleNameStyle: CSSProperties = {
  fontSize: "13px",
  fontWeight: 600,
  letterSpacing: "-.1px",
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
  gap: "18px",
  marginTop: "18px",
  paddingTop: "17px",
  borderTop: "1px solid rgba(255,255,255,.055)",
  flexWrap: "wrap",
};

const footerStatusStyle: CSSProperties = {
  color: "rgba(255,255,255,.30)",
  fontSize: "11px",
};

const saveBtnStyle: CSSProperties = {
  border: "1px solid rgba(249,115,22,.35)",
  padding: "10px 17px",
  borderRadius: "10px",
  fontWeight: 700,
  fontSize: "12px",
  background: "#f97316",
  color: "#fff",
  cursor: "pointer",
  letterSpacing: ".1px",
  transition: "all .16s ease",
};