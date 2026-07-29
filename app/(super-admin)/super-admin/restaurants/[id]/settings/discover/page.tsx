"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Eye } from "lucide-react";

import { supabase } from "@/lib/supabase/client";
import { DISCOVER_CATEGORIES } from "@/lib/discover/categories";

import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function DiscoverSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [discoverVisible, setDiscoverVisible] =
    useState(false);

  const [category, setCategory] =
    useState("restaurant");

  const [customCategory, setCustomCategory] =
    useState("");

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      const { data, error } = await supabase
        .from("restaurants")
        .select(`
          discover_visible,
          category
        `)
        .eq("id", restaurantId)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setDiscoverVisible(
          data.discover_visible ?? false
        );

        const currentCategory =
          data.category ?? "restaurant";

        const exists =
          DISCOVER_CATEGORIES.some(
            (item) =>
              item.id === currentCategory
          );

        if (exists) {
          setCategory(currentCategory);
        } else {
          setCategory("custom");
          setCustomCategory(currentCategory);
        }
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function saveData() {
    try {
      setSaving(true);

      const finalCategory =
        category === "custom"
          ? customCategory.trim()
          : category;

      const { error } = await supabase
        .from("restaurants")
        .update({
          discover_visible:
            discoverVisible,
          category: finalCategory,
        })
        .eq("id", restaurantId);

      if (error) throw error;

      alert(
        "Configuración de Discover actualizada."
      );
    } catch (error) {
      console.error(error);

      alert(
        "No fue posible guardar la configuración."
      );
    } finally {
      setSaving(false);
    }
  }
    if (loading) {
    return (
      <main
        style={{
          padding: "40px",
          color: "#fff",
        }}
      >
        Cargando...
      </main>
    );
  }

  return (
    <PermissionGuard permission="discover">
      <main
        style={{
          maxWidth: "800px",
          margin: "0 auto",
          padding: "40px 20px",
          color: "#fff",
        }}
      >
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />

          <h1
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              fontSize: "32px",
              fontWeight: 800,
              marginTop: "10px",
            }}
          >
            <Eye size={32} />
            Discover
          </h1>

          <p
            style={{
              color: "#999",
              marginTop: "8px",
            }}
          >
            Configura cómo aparecerá este restaurante dentro de Discover.
          </p>
        </div>

        <div
          style={{
            background: "rgba(17,17,17,.95)",
            border: "1px solid rgba(255,255,255,.08)",
            borderRadius: "24px",
            padding: "30px",
          }}
        >
          <h2
            style={{
              marginBottom: "20px",
              fontSize: "22px",
              fontWeight: 700,
            }}
          >
            Configuración
          </h2>

          <SwitchField
            label="Mostrar restaurante en Discover"
            checked={discoverVisible}
            onChange={setDiscoverVisible}
          />

          <div style={{ height: 24 }} />

          <SelectField
            label="Categoría principal"
            value={category}
            onChange={setCategory}
            options={[
              ...DISCOVER_CATEGORIES.map((item) => ({
                value: item.id,
                label: item.label,
              })),
              {
                value: "custom",
                label: "Otra categoría...",
              },
            ]}
          />

          {category === "custom" && (
            <div style={{ marginTop: "18px" }}>
              <label
                style={{
                  display: "block",
                  marginBottom: "8px",
                  color: "#ddd",
                  fontWeight: 600,
                }}
              >
                Categoría personalizada
              </label>

              <input
                type="text"
                value={customCategory}
                placeholder="Ej: Lasañas, Arepas, Desayunos..."
                onChange={(e) =>
                  setCustomCategory(e.target.value)
                }
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: "12px",
                  border:
                    "1px solid rgba(255,255,255,.12)",
                  background: "#111",
                  color: "#fff",
                  fontSize: "15px",
                  outline: "none",
                }}
              />
            </div>
          )}

          <div
            style={{
              marginTop: "25px",
              padding: "18px",
              borderRadius: "16px",
              background: "rgba(249,115,22,.08)",
              border:
                "1px solid rgba(249,115,22,.18)",
              lineHeight: 1.7,
            }}
          >
            <strong style={{ color: "#fff" }}>
              ¿Cómo funciona?
            </strong>

            <ul
              style={{
                marginTop: "15px",
                paddingLeft: "20px",
                color: "#bbb",
              }}
            >
              <li>
                El restaurante aparecerá en Discover si está
                habilitado.
              </li>

              <li>
                La categoría ayudará a organizar los
                restaurantes.
              </li>

              <li>
                El buscador utilizará esta categoría y sus
                palabras relacionadas.
              </li>

              <li>
                Más adelante servirá para recomendaciones
                inteligentes.
              </li>
            </ul>
          </div>

          <button
            onClick={saveData}
            disabled={saving}
            style={{
              width: "100%",
              marginTop: "30px",
              background: "#f97316",
              color: "#fff",
              border: "none",
              padding: "16px",
              borderRadius: "14px",
              fontWeight: 800,
              cursor: "pointer",
            }}
          >
            {saving
              ? "Guardando..."
              : "💾 Guardar configuración"}
          </button>
        </div>
      </main>
    </PermissionGuard>
  );
  }

function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        gap: "12px",
        alignItems: "center",
        padding: "6px 0",
      }}
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        style={{
          width: "18px",
          height: "18px",
          cursor: "pointer",
        }}
      />

      <span
        style={{
          fontSize: "14px",
          color: "#eee",
        }}
      >
        {label}
      </span>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: {
    value: string;
    label: string;
  }[];
}) {
  return (
    <div>
      <label
        style={{
          display: "block",
          marginBottom: "8px",
          color: "#ddd",
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          padding: "14px",
          borderRadius: "12px",
          border: "1px solid rgba(255,255,255,.12)",
          background: "#111",
          color: "#fff",
          fontSize: "15px",
          outline: "none",
          cursor: "pointer",
        }}
      >
        {options.map((option) => (
          <option
            key={option.value}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}