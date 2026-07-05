"use client";

import { useEffect, useState } from "react";
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
    setSaving(true);
    try {
      await supabase.from("role_modules").delete().eq("role_id", selectedRole);
      const rows = permissions.map((moduleCode) => ({
        role_id: selectedRole,
        module_code: moduleCode,
        can_view: true,
      }));

      if (rows.length > 0) await supabase.from("role_modules").insert(rows);
      alert("Permisos actualizados correctamente");
    } catch (error) {
      console.error(error);
      alert("Error guardando permisos");
    } finally {
      setSaving(false);
    }
  }

  return (
    <PermissionGuard permission="permissions">
      <main style={mainContainerStyle}>
        
        {/* HEADER SECTION */}
        <header style={{ marginBottom: "35px" }}>
          <p style={{ color: "#71717a", marginBottom: "8px", fontSize: "14px", fontWeight: "500" }}>
            Acceso / Gestión de Seguridad
          </p>
          <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "900", margin: 0, letterSpacing: "-1px" }}>
            🔐 Control de Permisos
          </h1>
          <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "15px", marginTop: "6px", maxWidth: "600px" }}>
            Asigna qué secciones y herramientas de la plataforma Wolf tiene permitidas visualizar cada rol.
          </p>
        </header>

        {/* CONTENEDOR PRINCIPAL */}
        <div style={panelCardStyle}>
          
          {/* SELECTOR DE ROL */}
          <div style={{ marginBottom: "35px" }}>
            <label style={{ fontSize: "13px", color: "rgba(255,255,255,0.4)", fontWeight: "600", letterSpacing: "0.2px", display: "block" }}>
              Seleccionar Rol para Configurar
            </label>
            <select 
              value={selectedRole} 
              onChange={(e) => { setSelectedRole(e.target.value); loadPermissions(e.target.value); }} 
              style={selectStyle}
            >
              {roles.map((role) => (
                <option key={role.id} value={role.id} style={{ background: "#0b0b0b", color: "#fff" }}>
                  {role.name}
                </option>
              ))}
            </select>
          </div>

          {/* GRID DE MÓDULOS DE SISTEMA */}
          <div style={gridStyle}>
            {modules.map((module) => {
              const isSelected = permissions.includes(module.code);
              return (
                <div 
                  key={module.id} 
                  onClick={() => isSelected ? setPermissions(permissions.filter(p => p !== module.code)) : setPermissions([...permissions, module.code])}
                  style={{ 
                    background: isSelected ? "rgba(249,115,22,.08)" : "rgba(255,255,255,.02)",
                    border: `1px solid ${isSelected ? "#f97316" : "rgba(255,255,255,.06)"}`,
                    borderRadius: "16px", 
                    padding: "18px 20px", 
                    cursor: "pointer", 
                    transition: "all 0.2s ease",
                    display: "flex", 
                    justifyContent: "space-between", 
                    alignItems: "center",
                    boxSizing: "border-box"
                  }}
                >
                  <span style={{ 
                    fontSize: "14px", 
                    fontWeight: isSelected ? "600" : "500", 
                    color: isSelected ? "#fff" : "rgba(255,255,255,0.8)" 
                  }}>
                    {module.name}
                  </span>
                  
                  <span style={{ 
                    fontSize: "18px", 
                    color: isSelected ? "#f97316" : "rgba(255,255,255,0.2)",
                    userSelect: "none"
                  }}>
                    {isSelected ? "●" : "○"}
                  </span>
                </div>
              );
            })}
          </div>

          {/* BOTÓN DE ACCIÓN GLOBAL */}
          <button 
            onClick={savePermissions} 
            disabled={saving}
            style={{ 
              ...saveBtnStyle,
              background: saving ? "rgba(255,255,255,0.1)" : "#f97316",
              color: saving ? "rgba(255,255,255,0.3)" : "#fff",
              boxShadow: saving ? "none" : "0 8px 24px rgba(249,115,22,0.2)"
            }}
          >
            {saving ? "Actualizando políticas de seguridad..." : "Guardar Cambios de Acceso"}
          </button>
        </div>
      </main>
    </PermissionGuard>
  );
}

// =====================================================
// ARQUITECTURA DE ESTILOS PREMIUM
// =====================================================
const mainContainerStyle = { 
  maxWidth: "1200px", 
  margin: "0 auto", 
  padding: "clamp(24px, 5vw, 50px)", 
  color: "#fff",
  fontFamily: "system-ui, sans-serif"
};

const panelCardStyle = { 
  background: "rgba(15, 15, 15, 0.6)", 
  backdropFilter: "blur(20px)",
  WebkitBackdropFilter: "blur(20px)",
  border: "1px solid rgba(255,255,255,.06)", 
  borderRadius: "28px", 
  padding: "clamp(20px, 4vw, 35px)",
  boxShadow: "0 20px 40px rgba(0,0,0,0.3)"
};

const selectStyle: React.CSSProperties = {
  width: "100%", 
  padding: "14px 16px", 
  marginTop: "10px", 
  background: "#0b0b0b", 
  color: "#fff",
  border: "1px solid rgba(255,255,255,.08)", 
  borderRadius: "14px", 
  fontSize: "15px", 
  fontWeight: "500",
  outline: "none",
  cursor: "pointer",
  colorScheme: "dark", // Sincroniza con el fix global de CSS que agregamos
  boxSizing: "border-box"
};

const gridStyle = { 
  display: "grid", 
  gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 260px), 1fr))", 
  gap: "14px", 
  marginBottom: "35px" 
};

const saveBtnStyle = { 
  border: "none", 
  padding: "16px 32px", 
  borderRadius: "14px", 
  fontWeight: "700" as const, 
  fontSize: "14px",
  cursor: "pointer", 
  width: "100%",
  letterSpacing: "0.2px",
  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)"
};