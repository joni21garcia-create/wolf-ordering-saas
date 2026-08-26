"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useWolfBack } from "@/lib/navigation/useWolfBack";

type Role = {
  id: string;
  restaurant_id: string;
  code: string;
  name: string;
};

const PROTECTED_CODES = [
  "super-user",
  "owner",
  "manager",
];

export default function EditRolePage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;
  const goBack = useWolfBack(`/admin/users/${restaurantId}/roles`);
  const roleId = params.roleId as string;

  const [role, setRole] = useState<Role | null>(null);
  const [name, setName] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (restaurantId && roleId) {
      loadRole();
    }
  }, [restaurantId, roleId]);

  async function loadRole() {
    try {
      setLoading(true);
      setError("");

      const { data, error } = await supabase
        .from("restaurant_roles")
        .select("id, restaurant_id, code, name")
        .eq("id", roleId)
        .eq("restaurant_id", restaurantId)
        .single();

      if (error || !data) {
        console.error("Error cargando rol:", error);
        setError("No se encontrÃ³ el rol.");
        return;
      }

      const roleCode = String(data.code || "")
        .trim()
        .toLowerCase();

      // ProtecciÃ³n adicional por si alguien entra
      // directamente a una URL de un rol protegido.
      if (PROTECTED_CODES.includes(roleCode)) {
        setError(
          "Este rol estÃ¡ protegido y no puede editarse desde aquÃ­."
        );
        return;
      }

      setRole(data);
      setName(data.name || "");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave() {
    if (!role) return;

    setError("");
    setMessage("");

    const cleanName = name.trim();

    if (!cleanName) {
      setError("Escribe el nombre del rol.");
      return;
    }

    try {
      setSaving(true);

      const { error: updateError } = await supabase
        .from("restaurant_roles")
        .update({
          name: cleanName,
        })
        .eq("id", role.id)
        .eq("restaurant_id", restaurantId);

      if (updateError) {
        console.error(
          "Error actualizando rol:",
          updateError
        );

        setError("No se pudo actualizar el rol.");
        return;
      }

      setMessage("Rol actualizado correctamente.");

      setTimeout(() => {
        router.replace(
          `/admin/users/${restaurantId}/roles`
        );
      }, 700);
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <>
        <style>{styles}</style>

        <main className="edit-role-page">
          <div className="loading">
            Cargando rol...
          </div>
        </main>
      </>
    );
  }

  if (!role) {
    return (
      <>
        <style>{styles}</style>

        <main className="edit-role-page">
          <div className="empty">
            <div className="eyebrow">Equipo</div>

            <h1>Rol no disponible</h1>

            <p>
              {error ||
                "Este rol no puede editarse desde aquÃ­."}
            </p>

            <button
              className="back-button-large"
              onClick={goBack}
            >
              Volver a roles
            </button>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <main className="edit-role-page">
        <header className="header">
          <button
            className="back"
            onClick={goBack}
          >
            â† Roles
          </button>

          <div className="eyebrow">Equipo</div>

          <h1>Editar rol</h1>

          <p>
            Actualiza el nombre del rol operativo.
          </p>
        </header>

        <section className="card">
          <div className="field">
            <label>Nombre del rol</label>

            <input
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              placeholder="Nombre del rol"
              autoFocus
            />
          </div>

          <div className="field">
            <label>CÃ³digo</label>

            <div className="readonly-code">
              <span>{role.code}</span>
              <small>Bloqueado</small>
            </div>

            <div className="hint">
              El cÃ³digo es el identificador interno
              estandarizado del rol y no puede cambiarse.
            </div>
          </div>

          <div className="info">
            <strong>Rol operativo</strong>

            <span>
              Los permisos de este rol son administrados
              desde Wolf. AquÃ­ solamente se modifica el
              nombre que verÃ¡ el equipo.
            </span>
          </div>

          {error && (
            <div className="error">
              {error}
            </div>
          )}

          {message && (
            <div className="success">
              {message}
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
              onClick={handleSave}
              disabled={saving}
            >
              {saving
                ? "Guardando..."
                : "Guardar cambios"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = `
  .edit-role-page {
    width: 100%;
    max-width: 700px;
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

  .field input {
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

  .field input:focus {
    border-color: rgba(249,115,22,.45);
  }

  .readonly-code {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    min-height: 42px;
    box-sizing: border-box;
    padding: 0 12px;
    border-radius: 9px;
    border: 1px solid rgba(255,255,255,.05);
    background: rgba(255,255,255,.025);
  }

  .readonly-code span {
    color: rgba(255,255,255,.55);
    font-size: 12px;
    font-family: monospace;
  }

  .readonly-code small {
    color: rgba(255,255,255,.28);
    font-size: 9px;
    font-weight: 700;
  }

  .hint {
    display: block;
    margin-top: 5px;
    color: rgba(255,255,255,.28);
    font-size: 10px;
    line-height: 1.45;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 12px;
    margin-top: 4px;
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

  .error,
  .success {
    margin-top: 13px;
    padding: 9px 11px;
    border-radius: 8px;
    font-size: 11px;
  }

  .error {
    background: rgba(239,68,68,.08);
    color: #f87171;
  }

  .success {
    background: rgba(34,197,94,.08);
    color: #22c55e;
  }

  .actions {
    display: flex;
    justify-content: flex-end;
    gap: 8px;
    margin-top: 18px;
  }

  .cancel,
  .save,
  .back-button-large {
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

  .save,
  .back-button-large {
    border: 0;
    background: #f97316;
    color: #fff;
  }

  .save:disabled {
    opacity: .55;
    cursor: wait;
  }

  .loading {
    padding: 60px 20px;
    text-align: center;
    color: rgba(255,255,255,.4);
    font-size: 12px;
  }

  .empty {
    padding: 60px 20px;
    text-align: center;
  }

  .empty h1 {
    margin-bottom: 8px;
  }

  .empty p {
    color: rgba(255,255,255,.4);
    font-size: 12px;
    margin: 0 0 18px;
  }

  @media (max-width: 600px) {
    .edit-role-page {
      padding: 20px 14px 40px;
    }

    h1 {
      font-size: 25px;
    }

    .card {
      padding: 15px;
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
