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
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px", color: "#fff" }}>
        <p style={{ color: "#666", marginBottom: "8px" }}>Acceso / Permisos</p>
        <h1 style={{ fontSize: "clamp(2rem, 5vw, 3rem)", marginBottom: "30px" }}>🔐 Gestión de Permisos</h1>

        <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
          
          <div style={{ marginBottom: "30px" }}>
            <label style={{ fontSize: "14px", color: "#aaa" }}>Seleccionar Rol para configurar</label>
            <select value={selectedRole} onChange={(e) => { setSelectedRole(e.target.value); loadPermissions(e.target.value); }} 
              style={selectStyle}>
              {roles.map((role) => <option key={role.id} value={role.id}>{role.name}</option>)}
            </select>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "15px", marginBottom: "30px" }}>
            {modules.map((module) => {
              const isSelected = permissions.includes(module.code);
              return (
                <div key={module.id} onClick={() => isSelected ? setPermissions(permissions.filter(p => p !== module.code)) : setPermissions([...permissions, module.code])}
                  style={{ 
                    background: isSelected ? "rgba(249,115,22,.1)" : "rgba(255,255,255,.03)",
                    border: `1px solid ${isSelected ? "#f97316" : "rgba(255,255,255,.08)"}`,
                    borderRadius: "16px", padding: "20px", cursor: "pointer", transition: ".3s",
                    display: "flex", justifyContent: "space-between", alignItems: "center"
                  }}>
                  <span style={{ fontWeight: isSelected ? "600" : "400" }}>{module.name}</span>
                  <span style={{ fontSize: "20px" }}>{isSelected ? "✅" : "○"}</span>
                </div>
              );
            })}
          </div>

          <button onClick={savePermissions} disabled={saving}
            style={{ background: "#f97316", color: "#fff", border: "none", padding: "16px 32px", borderRadius: "14px", fontWeight: "700", cursor: "pointer" }}>
            {saving ? "Guardando..." : "Guardar Cambios"}
          </button>
        </div>
      </main>
    </PermissionGuard>
  );
}

const selectStyle: React.CSSProperties = {
  width: "100%", padding: "14px", marginTop: "10px", background: "#111", color: "#fff",
  border: "1px solid #333", borderRadius: "12px", fontSize: "16px", outline: "none"
};