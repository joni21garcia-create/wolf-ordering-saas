"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useSession } from "@/providers/SessionProvider";

type Role = {
  id: string;
  code: string;
  name: string;
  usersCount: number;
};

const PROTECTED_ROLES = [
  "super-user",
  "owner",
  "manager",
];

export default function RolesPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params.restaurantId as string;
  const { user: sessionUser } = useSession();

  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadRoles();
    }
  }, [restaurantId]);

  async function loadRoles() {
    try {
      setLoading(true);

      const [
        { data: roleData, error: roleError },
        { data: userData, error: userError },
      ] = await Promise.all([
        supabase
          .from("restaurant_roles")
          .select("id, code, name")
          .eq("restaurant_id", restaurantId)
          .order("name", { ascending: true }),

        supabase
          .from("restaurant_users")
          .select("role_id")
          .eq("restaurant_id", restaurantId),
      ]);

      if (roleError) {
        console.error("Error cargando roles:", roleError);
        return;
      }

      if (userError) {
        console.error("Error contando usuarios:", userError);
        return;
      }

      const counts = new Map<string, number>();

      (userData || []).forEach((user: any) => {
        if (!user.role_id) return;

        counts.set(
          user.role_id,
          (counts.get(user.role_id) || 0) + 1
        );
      });

      const operationalRoles: Role[] = (roleData || [])
        .filter((role: any) => {
          const code = String(role.code || "")
            .trim()
            .toLowerCase();

          return !PROTECTED_ROLES.includes(code);
        })
        .map((role: any) => ({
          id: role.id,
          code: role.code,
          name: role.name,
          usersCount: counts.get(role.id) || 0,
        }));

      setRoles(operationalRoles);
    } finally {
      setLoading(false);
    }
  }

  const assignedUsers = roles.reduce(
    (total, role) => total + role.usersCount,
    0
  );

  return (
    <>
      <style>{styles}</style>

      <main className="roles-page">
        {/* HEADER */}
        <header className="roles-header">
          <div>
            <div className="eyebrow">Equipo</div>

            <h1>Roles</h1>

            <p>
              Roles utilizados por el equipo del restaurante.
            </p>
          </div>
          {["super-user", "owner", "manager"].includes(
            String(sessionUser?.role?.code || "").trim().toLowerCase()
          ) && (
            <button
              className="primary-button"
              onClick={() =>
                router.push(`/admin/users/${restaurantId}/roles/new`)
              }
            >
              <span>+</span>
              Nuevo rol
            </button>
          )}
        </header>

        {/* TABS */}
        <div className="tabs">
          <button
            className="tab tab-inactive"
            onClick={() =>
              router.push(
                `/admin/users/${restaurantId}`
              )
            }
          >
            Usuarios
          </button>

          <button className="tab tab-active">
            Roles
          </button>
        </div>

        {/* SUMMARY */}
        <div className="summary">
          <span>
            <strong>{roles.length}</strong>{" "}
            {roles.length === 1 ? "rol" : "roles"}
          </span>

          <span className="summary-dot" />

          <span>
            <strong>{assignedUsers}</strong>{" "}
            usuarios asignados
          </span>
        </div>

        {/* ROLES */}
        <section className="roles-list">
          {loading ? (
            <div className="state">
              Cargando roles...
            </div>
          ) : roles.length === 0 ? (
            <div className="state">
              <div className="empty-title">
                No hay roles operativos
              </div>

              Crea el primer rol para el equipo.
            </div>
          ) : (
            roles.map((role) => (
              <div
                className="role-row"
                key={role.id}
              >
                <div className="role-icon">
                  ◈
                </div>

                <div className="role-info">
                  <div className="role-name">
                    {role.name}
                  </div>

                  <div className="role-code">
                    {role.code}
                  </div>
                </div>

                <div className="role-users">
                  <strong>
                    {role.usersCount}
                  </strong>{" "}
                  {role.usersCount === 1
                    ? "usuario"
                    : "usuarios"}
                </div>

                <button
                  className="edit-button"
                  onClick={() =>
                    router.push(
                      `/admin/users/${restaurantId}/roles/edit/${role.id}`
                    )
                  }
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </section>

        <p className="footer-note">
          Los permisos de los roles son administrados
          desde Wolf. El restaurante trabaja únicamente
          con roles operativos.
        </p>
      </main>
    </>
  );
}

const styles = `
  .roles-page {
    width: 100%;
    max-width: 1050px;
    margin: 0 auto;
    padding: 28px 24px 60px;
    box-sizing: border-box;
    color: #fff;
  }

  .roles-header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: 20px;
    margin-bottom: 22px;
  }

  .eyebrow {
    color: #f97316;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  .roles-header h1 {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
    font-weight: 800;
  }

  .roles-header p {
    margin: 7px 0 0;
    color: rgba(255,255,255,.42);
    font-size: 12px;
    line-height: 1.5;
  }

  .primary-button {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    border: 0;
    background: #f97316;
    color: #fff;
    border-radius: 9px;
    padding: 10px 13px;
    font-size: 12px;
    font-weight: 750;
    cursor: pointer;
    white-space: nowrap;
  }

  .primary-button span {
    font-size: 16px;
    line-height: 1;
  }

  .tabs {
    display: flex;
    gap: 6px;
    border-bottom: 1px solid rgba(255,255,255,.07);
    padding-bottom: 10px;
    margin-bottom: 14px;
  }

  .tab {
    border-radius: 8px;
    padding: 7px 11px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }

  .tab-active {
    color: #fff;
    background: rgba(249,115,22,.12);
    border: 1px solid rgba(249,115,22,.28);
  }

  .tab-inactive {
    color: rgba(255,255,255,.45);
    background: rgba(255,255,255,.025);
    border: 1px solid rgba(255,255,255,.05);
  }

  .summary {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 12px;
    color: rgba(255,255,255,.38);
    font-size: 11px;
  }

  .summary strong {
    color: #fff;
  }

  .summary-dot {
    width: 3px;
    height: 3px;
    border-radius: 50%;
    background: #f97316;
  }

  .roles-list {
    background: rgba(17,24,39,.94);
    border: 1px solid rgba(255,255,255,.065);
    border-radius: 13px;
    overflow: hidden;
  }

  .role-row {
    display: grid;
    grid-template-columns: 38px minmax(0, 1fr) 120px auto;
    align-items: center;
    gap: 12px;
    padding: 13px 14px;
    border-bottom: 1px solid rgba(255,255,255,.05);
  }

  .role-row:last-child {
    border-bottom: none;
  }

  .role-icon {
    width: 34px;
    height: 34px;
    border-radius: 9px;
    background: rgba(249,115,22,.10);
    display: flex;
    align-items: center;
    justify-content: center;
    color: #f97316;
    font-size: 15px;
  }

  .role-info {
    min-width: 0;
  }

  .role-name {
    color: #fff;
    font-size: 12px;
    font-weight: 750;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .role-code {
    margin-top: 3px;
    color: rgba(255,255,255,.3);
    font-size: 10px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .role-users {
    color: rgba(255,255,255,.42);
    font-size: 10px;
    white-space: nowrap;
  }

  .role-users strong {
    color: rgba(255,255,255,.72);
  }

  .edit-button {
    border: 1px solid rgba(255,255,255,.06);
    background: rgba(255,255,255,.035);
    color: rgba(255,255,255,.58);
    border-radius: 7px;
    padding: 6px 9px;
    font-size: 10px;
    font-weight: 700;
    cursor: pointer;
  }

  .state {
    padding: 42px 20px;
    text-align: center;
    color: rgba(255,255,255,.4);
    font-size: 12px;
  }

  .empty-title {
    color: #fff;
    font-size: 13px;
    font-weight: 700;
    margin-bottom: 5px;
  }

  .footer-note {
    margin: 11px 0 0;
    color: rgba(255,255,255,.25);
    font-size: 10px;
    line-height: 1.5;
  }

  @media (max-width: 700px) {
    .roles-page {
      padding: 20px 14px 40px;
    }

    .roles-header {
      align-items: flex-start;
      flex-direction: column;
      gap: 14px;
    }

    .roles-header h1 {
      font-size: 25px;
    }

    .primary-button {
      width: 100%;
      justify-content: center;
    }

    .role-row {
      grid-template-columns: 34px minmax(0, 1fr) auto;
      gap: 10px;
      padding: 12px;
    }

    .role-users {
      display: none;
    }

    .edit-button {
      grid-column: 3;
      grid-row: 1;
    }

    .role-info {
      grid-column: 2;
      grid-row: 1;
    }

    .role-icon {
      grid-column: 1;
      grid-row: 1;
    }
  }

  @media (max-width: 420px) {
    .summary {
      gap: 9px;
      flex-wrap: wrap;
    }
  }
`;