"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import { useWolfBack } from "@/lib/navigation/useWolfBack";

const PROTECTED_CODES = [
  "super-user",
  "owner",
  "manager",
];

export default function NewRolePage() {
  const params = useParams();
  const router = useRouter();
  const restaurantId = params.restaurantId as string;


  const goBack = useWolfBack(`/admin/users/${restaurantId}/roles`);
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  function handleNameChange(value: string) {
    setName(value);

    const generatedCode = value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    setCode(generatedCode);
  }

  async function handleSave() {
    setError("");

    const cleanName = name.trim();
    const cleanCode = code.trim().toLowerCase();

    if (!cleanName) {
      setError("Escribe el nombre del rol.");
      return;
    }

    if (!cleanCode) {
      setError("El código del rol es obligatorio.");
      return;
    }

    if (PROTECTED_CODES.includes(cleanCode)) {
      setError("Ese código esta reservado.");
      return;
    }

    try {
      setSaving(true);

      const { data: existingRole, error: checkError } =
        await supabase
          .from("restaurant_roles")
          .select("id")
          .eq("restaurant_id", restaurantId)
          .eq("code", cleanCode)
          .maybeSingle();

      if (checkError) {
        console.error(checkError);
        setError("No se pudo validar el código.");
        return;
      }

      if (existingRole) {
        setError("Ya existe un rol con ese código.");
        return;
      }

      const { error: insertError } = await supabase
        .from("restaurant_roles")
        .insert({
          restaurant_id: restaurantId,
          name: cleanName,
          code: cleanCode,
        });

      if (insertError) {
        console.error(insertError);
        setError("No se pudo crear el rol.");
        return;
      }

      router.replace(
        `/admin/users/${restaurantId}/roles`
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <style>{styles}</style>

      <main className="new-role-page">
        <header className="header">
          <button
            className="back"
            onClick={goBack}
          >
            Roles
          </button>

          <div className="eyebrow">Equipo</div>

          <h1>Nuevo rol</h1>

          <p>
            Crea un rol operativo para el equipo del
            restaurante.
          </p>
        </header>

        <section className="card">
          <div className="field">
            <label>Nombre del rol</label>

            <input
              value={name}
              onChange={(e) =>
                handleNameChange(e.target.value)
              }
              placeholder="Ej. Cocina"
              autoFocus
            />
          </div>

          <div className="field">
            <label>Código</label>

            <input
              value={code}
              onChange={(e) =>
                setCode(
                  e.target.value
                    .toLowerCase()
                    .replace(/[^a-z0-9-_]/g, "")
                )
              }
              placeholder="cocina"
            />

            <span className="hint">
              Identificador interno del rol.
            </span>
          </div>

          <div className="info">
            <strong>Rol operativo</strong>

            <span>
              Los permisos se administran desde Wolf.
              Aqui solamente defines el rol que podrá
              asignarse a los usuarios del restaurante.
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
              onClick={handleSave}
              disabled={saving}
            >
              {saving ? "Creando..." : "Crear rol"}
            </button>
          </div>
        </section>
      </main>
    </>
  );
}

const styles = `
  .new-role-page {
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

  label {
    display: block;
    margin-bottom: 7px;
    color: rgba(255,255,255,.62);
    font-size: 11px;
    font-weight: 700;
  }

  input {
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

  input:focus {
    border-color: rgba(249,115,22,.45);
  }

  .hint {
    display: block;
    margin-top: 5px;
    color: rgba(255,255,255,.28);
    font-size: 10px;
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
    opacity: .55;
    cursor: wait;
  }

  @media (max-width: 600px) {
    .new-role-page {
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
