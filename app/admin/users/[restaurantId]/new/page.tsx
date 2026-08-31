"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useWolfBack } from "@/lib/navigation/useWolfBack";
import { useSession } from "@/providers/SessionProvider";
import { getAssignableRoles } from "@/lib/navigation/roleAssignment";

type Role = {
  id: string;
  code: string;
  name: string;
};

const PROTECTED_CODES = [
  "super-user",
  "owner",
  "manager",
];

export default function NewUserPage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;

  const goBack = useWolfBack(`/admin/users/${restaurantId}`);
  const { user: sessionUser } = useSession();
  const actorRoleCode = sessionUser?.role?.code ?? "";

  const [roles, setRoles] = useState<Role[]>([]);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [roleId, setRoleId] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (restaurantId) {
      loadRoles();
    }
  }, [restaurantId, actorRoleCode]);

  async function loadRoles() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("restaurant_roles")
        .select("id, code, name")
        .eq("restaurant_id", restaurantId)
        .order("name");

      if (error) {
        console.error("Error cargando roles:", error);
        setError("No se pudieron cargar los roles.");
        return;
      }

      const assignableRoles = getAssignableRoles(
        actorRoleCode,
        (data || []).map((role: Role) => ({
          id: role.id,
          code: role.code,
          name: role.name,
        })),
      );

      setRoles(assignableRoles);

      if (assignableRoles.length > 0) {
        setRoleId(assignableRoles[0].id);
      }
    } finally {
      setLoading(false);
    }
  }

  async function createUser() {
    setError("");

    const cleanName = fullName.trim();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPhone = phone.trim();

    if (
      !cleanName ||
      !cleanEmail ||
      !cleanPhone ||
      !password ||
      !roleId
    ) {
      setError("Completa todos los campos.");
      return;
    }

    if (password.length < 6) {
      setError(
        "La contraseña debe tener al menos 6 caracteres."
      );
      return;
    }

    try {
      setSaving(true);

      const { data: existing, error: existingError } =
        await supabase
          .from("restaurant_users")
          .select("id")
          .eq("restaurant_id", restaurantId)
          .eq("email", cleanEmail)
          .maybeSingle();

      if (existingError) {
        console.error(existingError);
        setError("No se pudo validar el correo.");
        return;
      }

      if (existing) {
        setError(
          "Ese correo ya existe en este restaurante."
        );
        return;
      }

      const selectedRole = roles.find(
        (role) => role.id === roleId
      );

      if (
        !selectedRole ||
        !getAssignableRoles(actorRoleCode, [selectedRole]).length
      ) {
        setError("No puedes asignar ese rol con tu nivel de acceso.");
        return;
      }

      const { error: functionError } =
        await supabase.functions.invoke(
          "create-restaurant-user",
          {
            body: {
              email: cleanEmail,
              password,
              full_name: cleanName,
              phone: cleanPhone,
              restaurant_id: restaurantId,
              role_id: roleId,
            },
          }
        );

      if (functionError) {
        console.error(functionError);
        setError(
          functionError.message ||
            "No se pudo crear el usuario."
        );
        return;
      }

      router.replace(
        `/admin/users/${restaurantId}`
      );
    } catch (err) {
      console.error(err);
      setError("Error creando el usuario.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <main className="new-user-page">
          <div className="loading">
            Cargando roles...
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <main className="new-user-page">
        <header className="header">
          <button
            className="back"
            onClick={goBack}
          >
            Usuarios
          </button>

          <div className="eyebrow">Equipo</div>

          <h1>Nuevo usuario</h1>

          <p>
            Crea una cuenta y asignarle un rol permitido para tu nivel de acceso.
          </p>
        </header>

        <section className="card">
          <div className="field">
            <label>Nombre completo</label>

            <input
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Ej. Juan Perez"
              autoFocus
            />
          </div>

          <div className="two-columns">
            <div className="field">
              <label>Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="correo@ejemplo.com"
              />
            </div>

            <div className="field">
              <label>Teléfono</label>

              <input
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
                placeholder="099..."
              />
            </div>
          </div>

          <div className="field">
            <label>Contraseña temporal</label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              placeholder="Contraseña temporal"
            />

            <span className="hint">
              El usuario podrá utilizar esta contraseña
              para iniciar sesión.
            </span>
          </div>

          <div className="field">
            <label>Rol</label>

            {roles.length === 0 ? (
              <div className="no-roles">
                No existen roles operativos disponibles.
                Crea primero un rol desde la sección Roles.
              </div>
            ) : (
              <select
                value={roleId}
                onChange={(e) =>
                  setRoleId(e.target.value)
                }
              >
                {roles.map((role) => (
                  <option
                    key={role.id}
                    value={role.id}
                  >
                    {role.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="info">
            <strong>Acceso operativo</strong>

            <span>
              El usuario se creara con el rol seleccionado.
              Los roles disponibles dependen de tu nivel de
              acceso: Owner puede asignar Manager y operativos;
              Manager solo puede asignar operativos.
            </span>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          <div className="actions">
            <button
              className="cancel"
              onClick={goBack}
            >
              Cancelar
            </button>

            <button
              className="save"
              onClick={createUser}
              disabled={
                saving || roles.length === 0
              }
            >
              {saving
                ? "Creando..."
                : "Crear usuario"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = `
  .new-user-page {
    width: 100%;
    max-width: 760px;
    margin: 0 auto;
    padding: 28px 24px 60px;
    box-sizing: border-box;
    color: #fff;
  }

  .header {
    margin-bottom: 22px;
  }

  .back {
    border: 0;
    background: transparent;
    color: rgba(255,255,255,.42);
    padding: 0;
    margin-bottom: 20px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }

  .back:hover {
    color: #fff;
  }

  .eyebrow {
    color: #f97316;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 1.6px;
    text-transform: uppercase;
    margin-bottom: 6px;
  }

  h1 {
    margin: 0;
    font-size: 28px;
    line-height: 1.1;
    font-weight: 800;
  }

  .header p {
    margin: 7px 0 0;
    color: rgba(255,255,255,.42);
    font-size: 12px;
  }

  .card {
    background: rgba(17,24,39,.94);
    border: 1px solid rgba(255,255,255,.065);
    border-radius: 14px;
    padding: 20px;
  }

  .field {
    margin-bottom: 17px;
  }

  .field label {
    display: block;
    margin-bottom: 7px;
    color: rgba(255,255,255,.62);
    font-size: 11px;
    font-weight: 700;
  }

  .field input,
  .field select {
    width: 100%;
    height: 42px;
    box-sizing: border-box;
    border-radius: 9px;
    border: 1px solid rgba(255,255,255,.075);
    background: rgba(5,10,20,.72);
    color: #fff;
    padding: 0 12px;
    outline: none;
    font-size: 12px;
  }

  .field input:focus,
  .field select:focus {
    border-color: rgba(249,115,22,.45);
  }

  .field select option {
    background: #111827;
    color: #fff;
  }

  .two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
  }

  .hint {
    display: block;
    margin-top: 5px;
    color: rgba(255,255,255,.28);
    font-size: 10px;
    line-height: 1.45;
  }

  .no-roles {
    padding: 12px;
    border-radius: 9px;
    background: rgba(239,68,68,.06);
    border: 1px solid rgba(239,68,68,.12);
    color: rgba(255,255,255,.45);
    font-size: 10px;
    line-height: 1.5;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 12px;
    margin-top: 2px;
    border-radius: 9px;
    background: rgba(249,115,22,.055);
    border: 1px solid rgba(249,115,22,.13);
  }

  .info strong {
    font-size: 11px;
  }

  .info span {
    color: rgba(255,255,255,.38);
    font-size: 10px;
    line-height: 1.5;
  }

  .error {
    margin-top: 13px;
    padding: 9px 11px;
    border-radius: 8px;
    background: rgba(239,68,68,.08);
    color: #f87171;
    font-size: 11px;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 18px;
  }

  .cancel,
  .save {
    border-radius: 8px;
    padding: 9px 13px;
    font-size: 11px;
    font-weight: 700;
    cursor: pointer;
  }

  .cancel {
    border: 1px solid rgba(255,255,255,.07);
    background: rgba(255,255,255,.035);
    color: rgba(255,255,255,.55);
  }

  .save {
    border: 0;
    background: #f97316;
    color: #fff;
  }

  .save:disabled {
    opacity: .5;
    cursor: not-allowed;
  }

  .loading {
    padding: 60px 20px;
    text-align: center;
    color: rgba(255,255,255,.4);
    font-size: 12px;
  }

  @media (max-width: 600px) {
    .new-user-page {
      padding: 20px 14px 40px;
    }

    h1 {
      font-size: 25px;
    }

    .card {
      padding: 15px;
    }

    .two-columns {
      grid-template-columns: 1fr;
      gap: 0;
    }

    .actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
    }

    .cancel,
    .save {
      width: 100%;
    }
  }
`;
