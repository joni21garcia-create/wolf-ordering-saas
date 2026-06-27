"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CategoriesPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [categories, setCategories] =
    useState<any[]>([]);

  const [newCategory, setNewCategory] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingName, setEditingName] =
    useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories =
    async () => {
      const { data } =
        await supabase
          .from("categories")
          .select("*")
          .eq(
            "restaurant_id",
            restaurantId
          )
          .order(
            "sort_order",
            {
              ascending: true,
            }
          );

      setCategories(data || []);
    };

  const createCategory =
    async () => {
      if (!newCategory)
        return;

      setLoading(true);

      const { error } =
        await supabase
          .from("categories")
          .insert({
            restaurant_id:
              restaurantId,
            name: newCategory,
            active: true,
            sort_order:
              categories.length + 1,
          });

      if (error) {
        console.error(error);

        alert(
          "Error creando categoría"
        );
      }

      setNewCategory("");

      await loadCategories();

      setLoading(false);
    };

  const updateCategory =
    async (
      id: string
    ) => {
      if (!editingName)
        return;

      const { error } =
        await supabase
          .from("categories")
          .update({
            name:
              editingName,
          })
          .eq("id", id);

      if (error) {
        console.error(error);

        alert(
          "Error actualizando categoría"
        );

        return;
      }

      setEditingId(null);

      setEditingName("");

      loadCategories();
    };

  const toggleCategory =
    async (
      id: string,
      active: boolean
    ) => {
      const { error } =
        await supabase
          .from("categories")
          .update({
            active:
              !active,
          })
          .eq("id", id);

      if (error) {
        console.error(error);

        alert(
          "Error actualizando categoría"
        );

        return;
      }

      loadCategories();
    };

  const deleteCategory =
    async (
      id: string
    ) => {
      const confirmDelete =
        confirm(
          "¿Eliminar categoría?"
        );

      if (!confirmDelete)
        return;

      const { error } =
        await supabase
          .from("categories")
          .delete()
          .eq("id", id);

      if (error) {
        console.error(error);

        alert(
          "Error eliminando categoría"
        );

        return;
      }

      loadCategories();
    };

return (
  <PermissionGuard permission="categories">
    <div
      style={{
        maxWidth: "1600px",
        margin: "0 auto",
        minHeight: "100vh",
        padding: "40px",
        background:
          "radial-gradient(circle at top right,#331300 0%,#050505 45%)",
        color: "#fff",
      }}
    >
        {/* HEADER */}

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            marginBottom: "35px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <p
              style={{
                color: "#777",
                marginBottom: "8px",
              }}
            >
              <BackToSettings
  restaurantId={restaurantId}
/>
              Configuración /
              Categorías
            </p>

            <h1
              style={{
                margin: 0,
                fontSize: "52px",
                fontWeight: "900",
              }}
            >
              📂 Categorías
            </h1>
          </div>

          <div
            style={{
              background:
                "rgba(249,115,22,.15)",
              color: "#f97316",
              padding:
                "12px 18px",
              borderRadius:
                "999px",
              fontWeight: "700",
            }}
          >
            {categories.length} categorías
          </div>
        </div>

        {/* STATS */}

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(220px,1fr))",
            gap: "20px",
            marginBottom: "30px",
          }}
        >
          <div style={statCard}>
            <h2>{categories.length}</h2>
            <p>Categorías</p>
          </div>

          <div style={statCard}>
            <h2>
              {
                categories.filter(
                  (c) =>
                    c.active
                ).length
              }
            </h2>
            <p>Activas</p>
          </div>

          <div style={statCard}>
            <h2>
              {
                categories.filter(
                  (c) =>
                    !c.active
                ).length
              }
            </h2>
            <p>Ocultas</p>
          </div>
        </div>

        {/* CREAR */}

        <div
          style={{
            background:
              "rgba(17,17,17,.95)",
            border:
              "1px solid rgba(255,255,255,.08)",
            borderRadius: "24px",
            padding: "25px",
            marginBottom: "30px",
          }}
        >
          <h2>
            Crear Categoría
          </h2>

          <div
            style={{
              display: "flex",
              gap: "15px",
              flexWrap: "wrap",
            }}
          >
            <input
              placeholder="Ej: Hamburguesas"
              value={
                newCategory
              }
              onChange={(e) =>
                setNewCategory(
                  e.target.value
                )
              }
              style={{
                flex: 1,
                minWidth:
                  "300px",
                background:
                  "rgba(255,255,255,.04)",
                border:
                  "1px solid rgba(255,255,255,.08)",
                color: "#fff",
                padding: "14px",
                borderRadius:
                  "14px",
              }}
            />

            <button
              onClick={
                createCategory
              }
              disabled={
                loading
              }
              style={{
                background:
                  "#f97316",
                color: "#fff",
                border: "none",
                padding:
                  "14px 30px",
                borderRadius:
                  "14px",
                fontWeight:
                  "700",
                cursor:
                  "pointer",
              }}
            >
              {loading
                ? "Creando..."
                : "+ Crear"}
            </button>
          </div>
        </div>

        {/* LISTADO */}

        <div
          style={{
            display: "grid",
            gap: "18px",
          }}
        >
          {categories.map(
            (
              category,
              index
            ) => (
              <div
                key={
                  category.id
                }
                style={{
                  background:
                    "rgba(17,17,17,.95)",
                  border:
                    "1px solid rgba(255,255,255,.08)",
                  borderRadius:
                    "22px",
                  padding:
                    "24px",
                  display:
                    "flex",
                  justifyContent:
                    "space-between",
                  alignItems:
                    "center",
                  flexWrap:
                    "wrap",
                  gap: "20px",
                }}
              >
                <div>
                  <div
                    style={{
                      color:
                        "#f97316",
                      fontSize:
                        "13px",
                      marginBottom:
                        "8px",
                    }}
                  >
                    Categoría #
                    {index + 1}
                  </div>

                  {editingId ===
                  category.id ? (
                    <input
                      value={
                        editingName
                      }
                      onChange={(
                        e
                      ) =>
                        setEditingName(
                          e.target
                            .value
                        )
                      }
                      style={{
                        background:
                          "rgba(255,255,255,.04)",
                        border:
                          "1px solid rgba(255,255,255,.08)",
                        color:
                          "#fff",
                        padding:
                          "10px",
                        borderRadius:
                          "12px",
                      }}
                    />
                  ) : (
                    <h3
                      style={{
                        margin: 0,
                        fontSize:
                          "22px",
                      }}
                    >
                      {
                        category.name
                      }
                    </h3>
                  )}

                  <div
                    style={{
                      marginTop:
                        "12px",
                    }}
                  >
                    <span
                      style={{
                        padding:
                          "6px 12px",
                        borderRadius:
                          "999px",
                        fontSize:
                          "12px",
                        fontWeight:
                          "700",
                        background:
                          category.active
                            ? "rgba(34,197,94,.15)"
                            : "rgba(239,68,68,.15)",
                        color:
                          category.active
                            ? "#22c55e"
                            : "#ef4444",
                      }}
                    >
                      {category.active
                        ? "Activa"
                        : "Oculta"}
                    </span>
                  </div>
                </div>

                <div
                  style={{
                    display:
                      "flex",
                    gap: "10px",
                    flexWrap:
                      "wrap",
                  }}
                >
                  {editingId ===
                  category.id ? (
                    <button
                      onClick={() =>
                        updateCategory(
                          category.id
                        )
                      }
                      style={saveBtn}
                    >
                      Guardar
                    </button>
                  ) : (
                    <button
                      onClick={() => {
                        setEditingId(
                          category.id
                        );

                        setEditingName(
                          category.name
                        );
                      }}
                      style={editBtn}
                    >
                      Editar
                    </button>
                  )}

                  <button
                    onClick={() =>
                      toggleCategory(
                        category.id,
                        category.active
                      )
                    }
                    style={hideBtn}
                  >
                    {category.active
                      ? "Ocultar"
                      : "Mostrar"}
                  </button>

                  <button
                    onClick={() =>
                      deleteCategory(
                        category.id
                      )
                    }
                    style={deleteBtn}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            )
          )}
        </div>
    </div>
  </PermissionGuard>
)
}

const statCard = {
  background:
    "rgba(17,17,17,.95)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "22px",
  padding: "24px",
  textAlign:
    "center" as const,
};

const editBtn = {
  background:
    "rgba(59,130,246,.15)",
  color: "#3b82f6",
  border:
    "1px solid rgba(59,130,246,.3)",
  padding: "10px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};

const saveBtn = {
  background: "#22c55e",
  color: "#fff",
  border: "none",
  padding: "10px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};

const hideBtn = {
  background:
    "rgba(245,158,11,.15)",
  color: "#f59e0b",
  border:
    "1px solid rgba(245,158,11,.3)",
  padding: "10px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};

const deleteBtn = {
  background:
    "rgba(239,68,68,.15)",
  color: "#ef4444",
  border:
    "1px solid rgba(239,68,68,.3)",
  padding: "10px 18px",
  borderRadius: "12px",
  cursor: "pointer",
  fontWeight: "700",
};