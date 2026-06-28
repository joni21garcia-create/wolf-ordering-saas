"use client";

import {
  useEffect,
  useState,
} from "react";

import { supabase } from "@/lib/supabase/client";

import {
  useRouter,
} from "next/navigation";

interface Props {
  mode: "create" | "edit";
  restaurantId: string;
  productId?: string;
}

export default function ProductForm({
  mode,
  restaurantId,
  productId,
}: Props) {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [categories, setCategories] =
    useState<any[]>([]);

const [form, setForm] =
  useState({
    category_id: "",
    name: "",
    description: "",
    image_url: "",
    price: "",
    available: true,
    featured: false,
  });

const [uploading, setUploading] =
  useState(false);

  useEffect(() => {
    loadCategories();

    if (
      mode === "edit" &&
      productId
    ) {
      loadProduct();
    }
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

  const loadProduct =
    async () => {
      const {
        data,
        error,
      } = await supabase
        .from("products")
        .select("*")
        .eq(
          "id",
          productId
        )
        .single();

      if (error) return;

      setForm({
        category_id:
          data.category_id || "",

        name:
          data.name || "",

        description:
          data.description ||
          "",

        image_url:
          data.image_url ||
          "",

price:
  data.price !== null
    ? Number(data.price).toFixed(2)
    : "0.00",

        available:
          data.available,

        featured:
          data.featured,
      });
    };

const uploadImage =
  async (
    file: File
  ) => {
    try {

      setUploading(true);

      const formData =
        new FormData();

      formData.append(
        "file",
        file
      );

      formData.append(
        "restaurantId",
        restaurantId
      );

      formData.append(
        "preset",
        "product"
      );

      const response =
        await fetch(
          "/api/images/upload",
          {
            method: "POST",
            body: formData,
          }
        );

      const json =
        await response.json();

      if (!json.success) {
        throw new Error(
          json.error
        );
      }

      setForm(
        (prev) => ({
          ...prev,
          image_url:
            json.url,
        })
      );

    } catch (error) {

      console.error(error);

      alert(
        "Error subiendo imagen."
      );

    } finally {

      setUploading(false);

    }
  };

  const saveProduct =
    async (
      e: React.FormEvent
    ) => {
      e.preventDefault();

      try {
        setLoading(true);

        if (
          !form.category_id
        ) {
          alert(
            "Seleccione una categoría"
          );
          return;
        }

        if (
          !form.name
        ) {
          alert(
            "Ingrese un nombre"
          );
          return;
        }

        if (
          !form.price
        ) {
          alert(
            "Ingrese un precio"
          );
          return;
        }

        const payload = {
          restaurant_id:
            restaurantId,

          category_id:
            form.category_id,

          name:
            form.name,

          slug: form.name
            .toLowerCase()
            .replaceAll(
              " ",
              "-"
            ),

          description:
            form.description,

          image_url:
            form.image_url,

          price:
            Number(
              form.price
            ),

          available:
            form.available,

          featured:
            form.featured,
        };

        if (
          mode === "create"
        ) {
          const {
            error,
          } = await supabase
            .from(
              "products"
            )
            .insert(
              payload
            );

          if (error)
            throw error;

          alert(
            "Producto creado"
          );
        }

        if (
          mode === "edit" &&
          productId
        ) {
          const {
            error,
          } = await supabase
            .from(
              "products"
            )
            .update(
              payload
            )
            .eq(
              "id",
              productId
            );

          if (error)
            throw error;

          alert(
            "Producto actualizado"
          );
        }

        router.push(
          `/super-admin/restaurants/${restaurantId}/settings/products`
        );
      } catch (error) {
        console.error(
          error
        );

        alert(
          "Error guardando producto"
        );
      } finally {
        setLoading(false);
      }
    };

  return (
    <main
      style={{
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1
        style={{
          color: "#fff",
          marginBottom:
            "30px",
        }}
      >
        {mode === "create"
          ? "Nuevo Producto"
          : "Editar Producto"}
      </h1>

      <form
        onSubmit={
          saveProduct
        }
      >
        <div
          style={{
            display: "grid",
            gap: "15px",
          }}
        >
          <select
            value={
              form.category_id
            }
            onChange={(e) =>
              setForm({
                ...form,
                category_id:
                  e.target
                    .value,
              })
            }
            style={{
              padding:
                "12px",
            }}
          >
            <option value="">
              Seleccionar categoría
            </option>

            {categories.map(
              (
                category
              ) => (
                <option
                  key={
                    category.id
                  }
                  value={
                    category.id
                  }
                >
                  {
                    category.name
                  }
                </option>
              )
            )}
          </select>

          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target
                    .value,
              })
            }
            style={{
              padding:
                "12px",
            }}
          />

          <textarea
            placeholder="Descripción"
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target
                    .value,
              })
            }
            style={{
              padding:
                "12px",
              minHeight:
                "120px",
            }}
          />

<input
  type="file"
  accept="image/*"
  onChange={async (
    e
  ) => {
    const file =
      e.target.files?.[0];

    if (!file)
      return;

    await uploadImage(
      file
    );
  }}
/>

{uploading && (
  <p
    style={{
      color:
        "white",
    }}
  >
    Subiendo imagen...
  </p>
)}

{form.image_url && (
  <>
  
    <img
      src={form.image_url}
      alt="preview"
      style={{
        width: "200px",
        borderRadius: "12px",
      }}
    />
  </>
)}

          <input
            type="text"
            step="0.01"
            placeholder="Precio"
            value={
              form.price
            }
            onChange={(e) =>
              setForm({
                ...form,
               price:
  e.target.value,
              })
            }
            style={{
              padding:
                "12px",
            }}
          />

          <label
            style={{
              color:
                "white",
            }}
          >
            <input
              type="checkbox"
              checked={
                form.available
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  available:
                    e.target
                      .checked,
                })
              }
            />
            {" "}Disponible
          </label>

          <label
            style={{
              color:
                "white",
            }}
          >
            <input
              type="checkbox"
              checked={
                form.featured
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  featured:
                    e.target
                      .checked,
                })
              }
            />
            {" "}Destacado
          </label>

          <button
            type="submit"
            disabled={
              loading
            }
            style={{
              padding:
                "15px",
            }}
          >
            {loading
              ? "Guardando..."
              : "Guardar Producto"}
          </button>
        </div>
      </form>
    </main>
  );
}