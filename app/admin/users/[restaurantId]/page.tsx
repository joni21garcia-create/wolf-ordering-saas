"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type UserRow = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  active: boolean;
  role_id: string | null;
  role_name: string;
};

export default function UsersPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params.restaurantId as string;

  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (restaurantId) {
      loadUsers();
    }
  }, [restaurantId]);

  async function loadUsers() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("restaurant_users")
        .select(`
          id,
          full_name,
          email,
          phone,
          active,
          role_id,
          restaurant_roles (
            name,
            code
          )
        `)
        .eq("restaurant_id", restaurantId)
        .order("full_name", { ascending: true });

      if (error) {
        console.error("Error cargando usuarios:", error);
        return;
      }

      const mappedUsers: UserRow[] = (data || []).map((user: any) => {
        const role = Array.isArray(user.restaurant_roles)
          ? user.restaurant_roles[0]
          : user.restaurant_roles;

        return {
          id: user.id,
          full_name: user.full_name,
          email: user.email,
          phone: user.phone,
          active: Boolean(user.active),
          role_id: user.role_id,
          role_name: role?.name || "Sin rol",
        };
      });

      setUsers(mappedUsers);
    } finally {
      setLoading(false);
    }
  }

  const activeUsers = users.filter((user) => user.active).length;
  const inactiveUsers = users.length - activeUsers;

  return (
    <>
      <style>{`
        .users-page {
          width: 100%;
          max-width: 1050px;
          margin: 0 auto;
          padding: 28px 24px 60px;
          box-sizing: border-box;
          color: #fff;
        }

        .users-header {
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

        .users-title {
          margin: 0;
          font-size: 28px;
          line-height: 1.1;
          font-weight: 800;
        }

        .users-description {
          margin: 7px 0 0;
          color: rgba(255,255,255,.42);
          font-size: 12px;
          line-height: 1.5;
        }

        .primary-button {
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

        .users-list {
          background: rgba(17,24,39,.92);
          border: 1px solid rgba(255,255,255,.065);
          border-radius: 13px;
          overflow: hidden;
        }

        .user-row {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 140px 80px auto;
          align-items: center;
          gap: 16px;
          padding: 12px 14px;
          border-bottom: 1px solid rgba(255,255,255,.05);
        }

        .user-row:last-child {
          border-bottom: none;
        }

        .user-main {
          display: flex;
          align-items: center;
          gap: 11px;
          min-width: 0;
        }

        .avatar {
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 9px;
          background: rgba(249,115,22,.10);
          display: flex;
          align-items: center;
          justify-content: center;
          color: #f97316;
          font-size: 12px;
          font-weight: 800;
        }

        .user-info {
          min-width: 0;
        }

        .user-name {
          font-size: 12px;
          font-weight: 750;
          color: #fff;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-email {
          margin-top: 3px;
          color: rgba(255,255,255,.32);
          font-size: 10px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-role {
          color: rgba(255,255,255,.52);
          font-size: 11px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .user-status {
          font-size: 10px;
          font-weight: 700;
          white-space: nowrap;
        }

        .status-active {
          color: #22c55e;
        }

        .status-inactive {
          color: rgba(255,255,255,.3);
        }

        .status-dot {
          display: inline-block;
          width: 5px;
          height: 5px;
          border-radius: 50%;
          margin-right: 5px;
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

        .empty-state,
        .loading-state {
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

        @media (max-width: 700px) {
          .users-page {
            padding: 20px 14px 40px;
          }

          .users-header {
            align-items: flex-start;
            flex-direction: column;
            gap: 14px;
          }

          .users-title {
            font-size: 25px;
          }

          .primary-button {
            width: 100%;
          }

          .user-row {
            grid-template-columns: minmax(0, 1fr) auto;
            gap: 10px;
            padding: 12px;
          }

          .user-role {
            grid-column: 1;
            margin-left: 45px;
            margin-top: -4px;
            font-size: 10px;
          }

          .user-status {
            grid-column: 2;
            grid-row: 1;
          }

          .edit-button {
            grid-column: 2;
            grid-row: 2;
          }
        }

        @media (max-width: 420px) {
          .users-description {
            max-width: 290px;
          }

          .summary {
            gap: 9px;
            flex-wrap: wrap;
          }

          .user-email {
            max-width: 180px;
          }
        }
      `}</style>

      <main className="users-page">
        {/* HEADER */}
        <header className="users-header">
          <div>
            <div className="eyebrow">Equipo</div>

            <h1 className="users-title">
              Usuarios
            </h1>

            <p className="users-description">
              Personas con acceso al restaurante.
            </p>
          </div>

          <button
            className="primary-button"
            onClick={() =>
              router.push(
                `/admin/users/${restaurantId}/new`
              )
            }
          >
            + Nuevo usuario
          </button>
        </header>

        {/* TABS */}
        <div className="tabs">
          <button className="tab tab-active">
            Usuarios
          </button>

          <button
            className="tab tab-inactive"
            onClick={() =>
              router.push(
                `/admin/users/${restaurantId}/roles`
              )
            }
          >
            Roles
          </button>
        </div>

        {/* SUMMARY */}
        <div className="summary">
          <span>
            <strong>{users.length}</strong> usuarios
          </span>

          <span className="summary-dot" />

          <span>
            <strong>{activeUsers}</strong> activos
          </span>

          {inactiveUsers > 0 && (
            <>
              <span className="summary-dot" />

              <span>
                {inactiveUsers} inactivos
              </span>
            </>
          )}
        </div>

        {/* USERS */}
        <section className="users-list">
          {loading ? (
            <div className="loading-state">
              Cargando usuarios...
            </div>
          ) : users.length === 0 ? (
            <div className="empty-state">
              <div className="empty-title">
                No hay usuarios
              </div>

              Crea el primer usuario del restaurante.
            </div>
          ) : (
            users.map((user) => (
              <div
                className="user-row"
                key={user.id}
              >
                <div className="user-main">
                  <div className="avatar">
                    {(user.full_name || user.email)
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div className="user-info">
                    <div className="user-name">
                      {user.full_name || "Sin nombre"}
                    </div>

                    <div className="user-email">
                      {user.email}
                    </div>
                  </div>
                </div>

                <div className="user-role">
                  {user.role_name}
                </div>

                <div
                  className={`user-status ${
                    user.active
                      ? "status-active"
                      : "status-inactive"
                  }`}
                >
                  <span
                    className="status-dot"
                    style={{
                      background: user.active
                        ? "#22c55e"
                        : "#6b7280",
                    }}
                  />

                  {user.active
                    ? "Activo"
                    : "Inactivo"}
                </div>

                <button
                  className="edit-button"
                  onClick={() =>
                    router.push(
                      `/admin/users/${restaurantId}/edit/${user.id}`
                    )
                  }
                >
                  Editar
                </button>
              </div>
            ))
          )}
        </section>
      </main>
    </>
  );
}