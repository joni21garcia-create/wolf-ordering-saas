"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
} from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import PermissionGuard from "@/components/auth/PermissionGuard";

type Role = {
  id: string;
  name: string;
  code: string;
};

type Module = {
  id: string;
  code: string;
  name: string;
};

export default function PermissionsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

    const searchParams =
  useSearchParams();

const roleFromUrl =
  searchParams.get("role");

  const [roles, setRoles] =
    useState<Role[]>([]);

  const [modules, setModules] =
    useState<Module[]>([]);

  const [selectedRole,
    setSelectedRole] =
    useState("");

  const [permissions,
    setPermissions] =
    useState<string[]>([]);

useEffect(() => {
  loadData();
}, [roleFromUrl]);
  async function loadData() {

    const { data: rolesData } =
      await supabase
        .from("restaurant_roles")
        .select("*")
        .eq(
          "restaurant_id",
          restaurantId
        )
        .order("name");

    const { data: modulesData } =
      await supabase
        .from("system_modules")
        .select("*")
        .order("name");

    setRoles(
      rolesData || []
    );

    setModules(
      modulesData || []
    );

    if (
  rolesData &&
  rolesData.length > 0
) {

  const initialRole =
    roleFromUrl ||
    rolesData[0].id;

  setSelectedRole(
    initialRole
  );

  loadPermissions(
    initialRole
  );
}
}

  async function loadPermissions(
    roleId: string
  ) {
    const { data } =
      await supabase
        .from("role_modules")
        .select("*")
        .eq(
          "role_id",
          roleId
        )
        .eq(
          "can_view",
          true
        );

    setPermissions(
      (data || []).map(
        (x) => x.module_code
      )
    );
  }

  async function handleRoleChange(
    roleId: string
  ) {
    setSelectedRole(roleId);

    await loadPermissions(
      roleId
    );
  }

  function togglePermission(
    moduleCode: string
  ) {
    if (
      permissions.includes(
        moduleCode
      )
    ) {
      setPermissions(
        permissions.filter(
          (x) =>
            x !== moduleCode
        )
      );
    } else {
      setPermissions([
        ...permissions,
        moduleCode,
      ]);
    }
  }

  async function savePermissions() {
    try {

      await supabase
        .from("role_modules")
        .delete()
        .eq(
          "role_id",
          selectedRole
        );

      const rows =
        permissions.map(
          (moduleCode) => ({
            role_id:
              selectedRole,
            module_code:
              moduleCode,
            can_view: true,
          })
        );

      if (rows.length > 0) {
        await supabase
          .from(
            "role_modules"
          )
          .insert(rows);
      }

      alert(
        "Permisos guardados"
      );

    } catch (error) {
      console.error(error);

      alert(
        "Error guardando permisos"
      );
    }
  }

return (
  <PermissionGuard permission="permissions">
    <main
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      <p
        style={{
          color: "#666",
        }}
      >
        Acceso / Permisos
      </p>

      <h1
        style={{
          fontSize: "52px",
          marginBottom: "30px",
        }}
      >
        🔐 Permisos
      </h1>

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius:
            "24px",
          padding: "30px",
        }}
      >
        <div
          style={{
            marginBottom:
              "30px",
          }}
        >
          <label>
            Rol
          </label>

          <select
            value={
              selectedRole
            }
            onChange={(
              e
            ) =>
              handleRoleChange(
                e.target.value
              )
            }
            style={{
              width: "100%",
              padding:
                "14px",
              marginTop:
                "10px",
              background:
                "#111",
              color:
                "#fff",
              border:
                "1px solid #333",
              borderRadius:
                "12px",
            }}
          >
            {roles.map(
              (role) => (
                <option
                  key={
                    role.id
                  }
                  value={
                    role.id
                  }
                >
                  {
                    role.name
                  }
                </option>
              )
            )}
          </select>
        </div>
                <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(250px,1fr))",
            gap: "15px",
          }}
        >
          {modules.map(
            (module) => (
              <div
                key={
                  module.id
                }
                onClick={() =>
                  togglePermission(
                    module.code
                  )
                }
                style={{
                  background:
                    permissions.includes(
                      module.code
                    )
                      ? "rgba(249,115,22,.15)"
                      : "rgba(255,255,255,.03)",

                  border:
                    permissions.includes(
                      module.code
                    )
                      ? "1px solid #f97316"
                      : "1px solid rgba(255,255,255,.08)",

                  borderRadius:
                    "18px",

                  padding:
                    "18px",

                  cursor:
                    "pointer",

                  transition:
                    ".2s",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",

                    justifyContent:
                      "space-between",

                    alignItems:
                      "center",
                  }}
                >
                  <span>
                    {
                      module.name
                    }
                  </span>

                  <span>
                    {permissions.includes(
                      module.code
                    )
                      ? "✅"
                      : "⬜"}
                  </span>
                </div>
              </div>
            )
          )}
        </div>

        <button
          onClick={
            savePermissions
          }
          style={{
            marginTop:
              "30px",

            background:
              "#f97316",

            color:
              "#fff",

            border:
              "none",

            padding:
              "14px 26px",

            borderRadius:
              "12px",

            fontWeight:
              "700",

            cursor:
              "pointer",
          }}
        >
          Guardar Permisos
        </button>
      </div>
    </main>
  </PermissionGuard>
  );
}