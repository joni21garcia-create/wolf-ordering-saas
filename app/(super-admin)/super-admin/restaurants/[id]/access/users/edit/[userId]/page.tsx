"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type Role = {
  id: string;
  code: string;
  name: string;
};

type UserData = {
  id: string;
  full_name: string | null;
  email: string;
  phone: string | null;
  active: boolean;
  role_id: string | null;
};

const PROTECTED_ROLES = [
  "super-user",
  "owner",
  "manager",
];

export default function EditUserPage() {
  const params = useParams();
  const router = useRouter();

  // Route: /super-admin/restaurants/[id]/access/users/edit/[userId]
  const restaurantId = params.id as string;
  const userId = params.userId as string;

  const [user, setUser] = useState<UserData | null>(null);
  const [roles, setRoles] = useState<Role[]>([]);
  const [originalRole, setOriginalRole] = useState<Role | null>(null);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [roleId, setRoleId] = useState("");
  const [active, setActive] = useState(true);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (restaurantId && userId) {
      loadData();
    }
  }, [restaurantId, userId]);

  async function loadData() {
    try {
      setLoading(true);
      setMessage("");

      const [
        { data: userData, error: userError },
        { data: roleData, error: roleError },
        { data: superAdminData, error: superAdminError },
      ] = await Promise.all([
        supabase
          .from("restaurant_users")
          .select(
            `
              id,
              full_name,
              email,
              phone,
              active,
              role_id
            `
          )
          .eq("id", userId)
          .eq("restaurant_id", restaurantId)
          .single(),

        supabase
          .from("restaurant_roles")
          .select("id, code, name")
          .eq("restaurant_id", restaurantId)
          .order("name"),

        supabase.rpc("is_super_admin"),
      ]);

      if (userError) {
        console.error("Error cargando usuario:", userError);
        setMessage("No se pudo cargar el usuario.");
        return;
      }

      if (roleError) {
        console.error("Error cargando roles:", roleError);
        setMessage("No se pudieron cargar los roles.");
        return;
      }

      if (superAdminError) {
        console.error("Error verificando Super Admin:", superAdminError);
        setMessage("No se pudo verificar el nivel de acceso.");
        return;
      }

      const superAdmin = Boolean(superAdminData);
      setIsSuperAdmin(superAdmin);

      const allRoles = (roleData || []) as Role[];
      const loadedUser: UserData = {
        id: userData.id,
        full_name: userData.full_name,
        email: userData.email,
        phone: userData.phone,
        active: Boolean(userData.active),
        role_id: userData.role_id,
      };

      const original = allRoles.find((role) => role.id === userData.role_id) || null;

      setUser(loadedUser);
      setOriginalRole(original);
      setFullName(userData.full_name || "");
      setEmail(userData.email || "");
      setPhone(userData.phone || "");
      setRoleId(userData.role_id || "");
      setActive(Boolean(userData.active));

      const operationalRoles = superAdmin
        ? allRoles
        : allRoles.filter(
            (role) =>
              !PROTECTED_ROLES.includes(
                String(role.code || "").trim().toLowerCase()
              )
          );

      // El rol actual siempre debe poder resolverse en el editor.
      // Si es operativo, permanece en el selector. Si es protegido,
      // se muestra arriba como rol bloqueado.
      if (
        userData.role_id &&
        original &&
        !superAdmin &&
        !PROTECTED_ROLES.includes(
          String(original.code || "").trim().toLowerCase()
        ) &&
        !operationalRoles.some((role) => role.id === userData.role_id)
      ) {
        setRoles([original, ...operationalRoles]);
      } else {
        setRoles(operationalRoles);
      }
    } finally {
      setLoading(false);
    }
  }

  const isProtectedRole =
    !isSuperAdmin &&
    Boolean(
      originalRole &&
        PROTECTED_ROLES.includes(
          String(originalRole.code || "").trim().toLowerCase()
        )
    );

  async function handleSave() {
    if (!user) return;

    if (!fullName.trim() || !email.trim()) {
      setMessage("Completa el nombre y el email.");
      return;
    }

    if (!isProtectedRole && !roleId) {
      setMessage("Selecciona un rol operativo antes de guardar.");
      return;
    }

    try {
      setSaving(true);
      setMessage("");

      const updateData: Record<string, unknown> = {
        full_name: fullName.trim(),
        email: email.trim(),
        phone: phone.trim() || null,
        active,
      };

      // Super Admin puede cambiar cualquier rol.
      // Las protecciones siguen aplicando a usuarios no Super Admin.
      if (isSuperAdmin || !isProtectedRole) {
        updateData.role_id = roleId;
      }

      const { error } = await supabase
        .from("restaurant_users")
        .update(updateData)
        .eq("id", userId)
        .eq("restaurant_id", restaurantId);

      if (error) {
        console.error("Error actualizando usuario:", error);
        setMessage("No se pudo guardar el usuario.");
        return;
      }

      setMessage("Usuario actualizado correctamente.");

      setTimeout(() => {
        router.push(
          `/super-admin/restaurants/${restaurantId}/access/users`
        );
      }, 700);
    } catch (error) {
      console.error("Error actualizando usuario:", error);
      setMessage("Ocurrió un error inesperado.");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!user || !isSuperAdmin || deleting) return;

    const confirmed = window.confirm(
      `¿Eliminar a ${user.full_name || user.email}?\n\n` +
        "Se eliminará su acceso a este restaurante. Si no tiene otros restaurantes asociados, también se eliminará su cuenta de autenticación."
    );

    if (!confirmed) return;

    try {
      setDeleting(true);
      setMessage("");

      const response = await fetch("/api/super-admin/users/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          restaurantId,
        }),
      });

      const result = await response.json().catch(() => ({}));

      if (!response.ok || !result.success) {
        setMessage(result.error || "No se pudo eliminar el usuario.");
        return;
      }

      router.push(
        `/super-admin/restaurants/${restaurantId}/access/users`
      );
      router.refresh();
    } catch (error) {
      console.error("Error eliminando usuario:", error);
      setMessage("Ocurrió un error inesperado al eliminar el usuario.");
    } finally {
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="edit-page">
        <div className="loading">Cargando usuario...</div>
        <style>{styles}</style>
      </main>
    );
  }

  if (!user) {
    return (
      <main className="edit-page">
        <div className="empty">
          <div className="empty-icon">👤</div>
          <h1>Usuario no encontrado</h1>
          <p>No encontramos este usuario dentro del restaurante.</p>
          <button
            type="button"
            onClick={() =>
              router.push(
                `/super-admin/restaurants/${restaurantId}/access/users`
              )
            }
          >
            Volver a usuarios
          </button>
        </div>
        <style>{styles}</style>
      </main>
    );
  }

  return (
    <main className="edit-page">
      <header className="edit-header">
        <button
          type="button"
          className="back-button"
          onClick={() =>
            router.push(
              `/super-admin/restaurants/${restaurantId}/access/users`
            )
          }
          disabled={saving}
          aria-label="Volver a usuarios"
        >
          ‹ <span>Usuarios</span>
        </button>

        <div className="eyebrow">Equipo</div>

        <div className="title-row">
          <div>
            <h1>Editar usuario</h1>
            <p>Actualiza los datos y el acceso de esta persona.</p>
          </div>

          <div className={`status-chip ${active ? "is-active" : ""}`}>
            <span />
            {active ? "Activo" : "Inactivo"}
          </div>
        </div>
      </header>

      <section className="card">
        <div className="section-head">
          <div>
            <span className="section-kicker">Perfil</span>
            <h2>Datos del usuario</h2>
          </div>
          <span className="user-id">ID · {user.id.slice(0, 8)}</span>
        </div>

        <div className="form-grid">
          <div className="field full">
            <label htmlFor="fullName">Nombre completo</label>
            <input
              id="fullName"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Nombre completo"
              autoComplete="name"
            />
          </div>

          <div className="field">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@ejemplo.com"
              autoComplete="email"
            />
          </div>

          <div className="field">
            <label htmlFor="phone">Teléfono</label>
            <input
              id="phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="099..."
              autoComplete="tel"
            />
          </div>

          <div className="field full">
            <label htmlFor="role">Rol operativo</label>

            {isProtectedRole ? (
              <div className="protected-role">
                <div className="protected-top">
                  <span className="lock">🔒</span>
                  <strong>{originalRole?.name || "Rol protegido"}</strong>
                  <span className="protected-badge">Protegido</span>
                </div>
                <span>
                  Este rol administrativo no puede cambiarse desde aquí.
                </span>
              </div>
            ) : roles.length === 0 ? (
              <div className="no-roles">
                No hay roles operativos disponibles para este restaurante.
              </div>
            ) : (
              <select
                id="role"
                value={roleId}
                onChange={(e) => setRoleId(e.target.value)}
                required
                aria-required="true"
              >
                {roles.map((role) => (
                  <option key={role.id} value={role.id}>
                    {role.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="status-section">
          <div>
            <div className="status-title">Estado del usuario</div>
            <div className="status-description">
              {active
                ? "Puede acceder al restaurante."
                : "Está desactivado y no puede acceder."}
            </div>
          </div>

          <button
            type="button"
            className={`status-toggle ${active ? "active" : ""}`}
            onClick={() => setActive((value) => !value)}
            disabled={saving}
            aria-pressed={active}
            aria-label={active ? "Desactivar usuario" : "Activar usuario"}
          >
            <span />
          </button>
        </div>

        {message && (
          <div
            className={`message ${
              message.includes("correctamente") ? "success" : "error"
            }`}
          >
            {message}
          </div>
        )}

        <div className="actions">
          {isSuperAdmin && (
            <button
              type="button"
              className="delete-button"
              onClick={handleDelete}
              disabled={saving || deleting}
            >
              {deleting ? "Eliminando..." : "Eliminar usuario"}
            </button>
          )}

          <button
            type="button"
            className="cancel-button"
            onClick={() =>
              router.push(
                `/super-admin/restaurants/${restaurantId}/access/users`
              )
            }
            disabled={saving}
          >
            Cancelar
          </button>

          <button
            type="button"
            className="save-button"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Guardando..." : "Guardar cambios"}
          </button>
        </div>
      </section>

      <style>{styles}</style>
    </main>
  );
}

const styles = `
  .edit-page {
    width: 100%;
    max-width: 620px;
    margin: 0 auto;
    padding: 16px 12px 42px;
    box-sizing: border-box;
    color: #fff;
  }

  .edit-header {
    margin-bottom: 12px;
  }

  .back-button {
    display: inline-flex;
    align-items: center;
    gap: 3px;
    border: 0;
    background: transparent;
    color: rgba(255,255,255,.42);
    font-size: 10px;
    font-weight: 750;
    padding: 0;
    margin-bottom: 10px;
    cursor: pointer;
  }

  .back-button:first-letter {
    color: #f97316;
  }

  .back-button:hover {
    color: #fff;
  }

  .eyebrow {
    color: #f97316;
    font-size: 8px;
    font-weight: 800;
    letter-spacing: 1.2px;
    text-transform: uppercase;
    margin-bottom: 3px;
  }

  .title-row {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 10px;
  }

  .edit-header h1 {
    margin: 0;
    font-size: 22px;
    line-height: 1.1;
    font-weight: 800;
    letter-spacing: -.4px;
  }

  .edit-header p {
    margin: 4px 0 0;
    color: rgba(255,255,255,.38);
    font-size: 10px;
  }

  .status-chip {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    flex-shrink: 0;
    padding: 5px 7px;
    border-radius: 999px;
    background: rgba(255,255,255,.035);
    color: rgba(255,255,255,.4);
    font-size: 8px;
    font-weight: 750;
    border: 1px solid rgba(255,255,255,.055);
  }

  .status-chip span {
    width: 5px;
    height: 5px;
    border-radius: 50%;
    background: #6b7280;
  }

  .status-chip.is-active {
    color: #22c55e;
    background: rgba(34,197,94,.06);
    border-color: rgba(34,197,94,.12);
  }

  .status-chip.is-active span {
    background: #22c55e;
  }

  .card {
    background: rgba(17,24,39,.72);
    border: 1px solid rgba(255,255,255,.06);
    border-radius: 12px;
    overflow: hidden;
  }

  .section-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 11px 13px;
    border-bottom: 1px solid rgba(255,255,255,.045);
  }

  .section-kicker {
    display: block;
    color: rgba(255,255,255,.3);
    font-size: 7px;
    text-transform: uppercase;
    letter-spacing: 1px;
    font-weight: 800;
    margin-bottom: 2px;
  }

  .section-head h2 {
    margin: 0;
    font-size: 10px;
    font-weight: 750;
  }

  .user-id {
    color: rgba(255,255,255,.2);
    font-size: 7px;
    font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
  }

  .form-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    padding: 13px;
  }

  .field {
    min-width: 0;
  }

  .field.full {
    grid-column: 1 / -1;
  }

  .field label {
    display: block;
    margin-bottom: 5px;
    color: rgba(255,255,255,.55);
    font-size: 9px;
    font-weight: 750;
  }

  .field input,
  .field select {
    width: 100%;
    min-height: 38px;
    box-sizing: border-box;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,.07);
    background: #0b0f16;
    color: #fff;
    padding: 8px 10px;
    outline: none;
    font-size: 10px;
  }

  .field input::placeholder {
    color: rgba(255,255,255,.2);
  }

  .field input:focus,
  .field select:focus {
    border-color: rgba(249,115,22,.45);
    box-shadow: 0 0 0 3px rgba(249,115,22,.06);
  }

  .field select {
    color-scheme: dark;
    cursor: pointer;
  }

  .field select option {
    background: #111827;
    color: #fff;
  }

  .no-roles {
    padding: 9px 10px;
    border: 1px solid rgba(250,204,21,.12);
    background: rgba(250,204,21,.04);
    border-radius: 8px;
    color: rgba(255,255,255,.42);
    font-size: 8px;
    line-height: 1.4;
  }

  .protected-role {
    padding: 9px 10px;
    border: 1px solid rgba(249,115,22,.14);
    background: rgba(249,115,22,.045);
    border-radius: 8px;
  }

  .protected-top {
    display: flex;
    align-items: center;
    gap: 5px;
    min-width: 0;
  }

  .lock {
    font-size: 9px;
  }

  .protected-role strong {
    color: #fff;
    font-size: 9px;
    font-weight: 750;
  }

  .protected-badge {
    margin-left: auto;
    color: #f97316;
    font-size: 7px;
    font-weight: 800;
    text-transform: uppercase;
  }

  .protected-role > span:last-child {
    display: block;
    margin-top: 4px;
    color: rgba(255,255,255,.3);
    font-size: 8px;
    line-height: 1.4;
  }

  .status-section {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0 13px;
    padding: 11px 0;
    border-top: 1px solid rgba(255,255,255,.045);
    border-bottom: 1px solid rgba(255,255,255,.045);
  }

  .status-title {
    color: #fff;
    font-size: 9px;
    font-weight: 750;
  }

  .status-description {
    margin-top: 3px;
    color: rgba(255,255,255,.3);
    font-size: 8px;
  }

  .status-toggle {
    position: relative;
    width: 38px;
    height: 21px;
    min-width: 38px;
    border: 0;
    border-radius: 999px;
    background: #374151;
    cursor: pointer;
    padding: 0;
  }

  .status-toggle:disabled {
    opacity: .6;
    cursor: not-allowed;
  }

  .status-toggle span {
    position: absolute;
    width: 15px;
    height: 15px;
    top: 3px;
    left: 3px;
    border-radius: 50%;
    background: #fff;
    transition: transform .18s ease;
  }

  .status-toggle.active {
    background: #f97316;
  }

  .status-toggle.active span {
    transform: translateX(17px);
  }

  .message {
    margin: 9px 13px 0;
    padding: 8px 9px;
    border-radius: 7px;
    font-size: 9px;
  }

  .message.success {
    background: rgba(34,197,94,.07);
    color: #22c55e;
  }

  .message.error {
    background: rgba(239,68,68,.07);
    color: #f87171;
  }

  .actions {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: 7px;
    padding: 12px 13px 13px;
  }

  .cancel-button,
  .save-button {
    min-height: 38px;
    border-radius: 8px;
    padding: 0 12px;
    font-size: 10px;
    font-weight: 750;
    cursor: pointer;
  }

  .delete-button {
    min-height: 38px;
    padding: 0 12px;
    border: 1px solid rgba(239,68,68,.18);
    border-radius: 8px;
    background: rgba(239,68,68,.07);
    color: #f87171;
    font-size: 10px;
    font-weight: 800;
    cursor: pointer;
  }

  .delete-button:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .cancel-button {
    border: 1px solid rgba(255,255,255,.07);
    background: rgba(255,255,255,.035);
    color: rgba(255,255,255,.55);
  }

  .save-button {
    border: 0;
    background: #f97316;
    color: #fff;
  }

  .save-button:disabled {
    opacity: .55;
    cursor: wait;
  }

  .loading {
    padding: 70px 20px;
    text-align: center;
    color: rgba(255,255,255,.4);
    font-size: 10px;
  }

  .empty {
    padding: 55px 18px;
    text-align: center;
  }

  .empty-icon {
    width: 36px;
    height: 36px;
    margin: 0 auto 10px;
    display: grid;
    place-items: center;
    border-radius: 9px;
    background: rgba(255,255,255,.035);
    font-size: 15px;
  }

  .empty h1 {
    margin: 0;
    font-size: 18px;
  }

  .empty p {
    margin: 6px 0 14px;
    color: rgba(255,255,255,.35);
    font-size: 9px;
  }

  .empty button {
    border: 0;
    border-radius: 8px;
    background: #f97316;
    color: #fff;
    padding: 9px 13px;
    font-size: 10px;
    font-weight: 750;
    cursor: pointer;
  }

  @media (max-width: 520px) {
    .edit-page {
      padding: 14px 10px 36px;
    }

    .title-row {
      align-items: center;
    }

    .status-chip {
      padding: 4px 6px;
    }

    .form-grid {
      grid-template-columns: 1fr;
    }

    .field.full {
      grid-column: auto;
    }

    .actions {
      grid-template-columns: 1fr 1fr;
    }

    .user-id {
      display: none;
    }
  }
`;