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

const [saveAndCreateAnother, setSaveAndCreateAnother] =
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
        .maybeSingle();

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
  !form.name.trim()
) {
  alert(
    "Ingrese un nombre"
  );
  return;
}

if (
  Number.isNaN(Number(form.price)) ||
  Number(form.price) <= 0
) {
  alert(
    "Ingrese un precio válido"
  );
  return;
}

        const payload = {
          restaurant_id:
            restaurantId,

          category_id:
            form.category_id,

name:
  form.name.trim(),

slug: form.name
  .trim()
  .toLowerCase()
  .replace(/\s+/g, "-")
  .replace(/[^a-z0-9-]/g, ""),

description:
  form.description.trim(),

          image_url:
            form.image_url,

price: Number(
  Number(form.price).toFixed(2)
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

        if (
          mode === "create" &&
          saveAndCreateAnother
        ) {
          setForm({
            category_id: form.category_id,
            name: "",
            description: "",
            image_url: "",
            price: "",
            available: true,
            featured: false,
          });

          setSaveAndCreateAnother(false);
          return;
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
    <main className="product-form-page">
      <header className="form-header">
        <span className="eyebrow">Productos</span>
        <div className="header-line">
          <div>
            <h1>{mode === "create" ? "Nuevo producto" : "Editar producto"}</h1>
            <p>
              {mode === "create"
                ? "Crea un producto rápido y continúa con el siguiente."
                : "Actualiza la información de tu producto."}
            </p>
          </div>
          <span className="mode-badge">{mode === "create" ? "Nuevo" : "Editar"}</span>
        </div>
      </header>

      <form onSubmit={saveProduct} className="product-form">
        <section className="section">
          <div className="section-heading">
            <span>01</span>
            <div>
              <strong>Información</strong>
              <small>Lo esencial del producto</small>
            </div>
          </div>

          <label className="field">
            <span>Categoría</span>
            <select
              value={form.category_id}
              onChange={(e) =>
                setForm({
                  ...form,
                  category_id: e.target.value,
                })
              }
            >
              <option value="">Seleccionar categoría</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <span>Nombre</span>
            <input
              placeholder="Ej. Hamburguesa clásica"
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              autoComplete="off"
            />
          </label>

          <label className="field">
            <span>
              Descripción <em>Opcional</em>
            </span>
            <textarea
              placeholder="Describe brevemente el producto..."
              value={form.description}
              onChange={(e) =>
                setForm({
                  ...form,
                  description: e.target.value,
                })
              }
              rows={3}
            />
          </label>

          <label className="field">
            <span>Precio</span>
            <div className="price-field">
              <b>$</b>
              <input
                type="number"
                step="0.01"
                min="0"
                inputMode="decimal"
                placeholder="0.00"
                value={form.price}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value,
                  })
                }
              />
            </div>
          </label>
        </section>

        <section className="section">
          <div className="section-heading">
            <span>02</span>
            <div>
              <strong>Imagen</strong>
              <small>Una foto clara vende mejor</small>
            </div>
          </div>

          <label className={`image-drop ${form.image_url ? "has-image" : ""}`}>
            {form.image_url ? (
              <img src={form.image_url} alt="Vista previa" />
            ) : (
              <div className="upload-empty">
                <span className="upload-icon">＋</span>
                <strong>Agregar imagen</strong>
                <small>Toca aquí para seleccionar una foto</small>
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                await uploadImage(file);
                e.currentTarget.value = "";
              }}
            />

            {uploading && (
              <div className="uploading">Subiendo imagen...</div>
            )}

            {form.image_url && !uploading && (
              <div className="change-image">Cambiar imagen</div>
            )}
          </label>
        </section>

        <section className="section">
          <div className="section-heading">
            <span>03</span>
            <div>
              <strong>Estado</strong>
              <small>Controla cómo aparece en tu menú</small>
            </div>
          </div>

          <div className="settings">
            <label className="setting">
              <div>
                <strong>Disponible</strong>
                <small>Puede recibir pedidos</small>
              </div>
              <span className="switch">
                <input
                  type="checkbox"
                  checked={form.available}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      available: e.target.checked,
                    })
                  }
                />
                <span />
              </span>
            </label>

            <label className="setting">
              <div>
                <strong>Destacado</strong>
                <small>Mostrar como producto destacado</small>
              </div>
              <span className="switch">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      featured: e.target.checked,
                    })
                  }
                />
                <span />
              </span>
            </label>
          </div>
        </section>

        <div className="actions">
          <button
            type="submit"
            className="primary"
            disabled={loading || uploading}
            onClick={() => setSaveAndCreateAnother(false)}
          >
            {loading ? "Guardando..." : "Guardar producto"}
          </button>

          {mode === "create" && (
            <button
              type="submit"
              className="secondary"
              disabled={loading || uploading}
              onClick={() => setSaveAndCreateAnother(true)}
            >
              <span>＋</span>
              Guardar y crear otro
            </button>
          )}
        </div>
      </form>

      <style jsx>{`
        .product-form-page {
          width:100%;
          max-width:620px;
          margin:0 auto;
          box-sizing:border-box;
          color:#fff;
          font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;
        }

        .form-header {
          margin-bottom:10px;
        }

        .eyebrow {
          display:block;
          margin-bottom:3px;
          color:#f97316;
          font-size:8px;
          font-weight:850;
          letter-spacing:1.15px;
          text-transform:uppercase;
        }

        .header-line {
          display:flex;
          align-items:flex-start;
          justify-content:space-between;
          gap:8px;
        }

        h1 {
          margin:0;
          font-size:22px;
          line-height:1.05;
          letter-spacing:-.55px;
          font-weight:900;
        }

        .form-header p {
          margin:4px 0 0;
          color:rgba(255,255,255,.34);
          font-size:9px;
          line-height:1.4;
        }

        .mode-badge {
          flex-shrink:0;
          padding:5px 7px;
          border:1px solid rgba(249,115,22,.18);
          border-radius:999px;
          background:rgba(249,115,22,.06);
          color:#f97316;
          font-size:7px;
          font-weight:850;
          text-transform:uppercase;
          letter-spacing:.5px;
        }

        .product-form {
          display:flex;
          flex-direction:column;
          gap:6px;
        }

        .section {
          padding:10px;
          border:1px solid rgba(255,255,255,.055);
          border-radius:11px;
          background:rgba(17,24,39,.62);
        }

        .section-heading {
          display:flex;
          align-items:center;
          gap:7px;
          margin-bottom:9px;
        }

        .section-heading > span {
          width:25px;
          height:25px;
          display:grid;
          place-items:center;
          flex-shrink:0;
          border-radius:7px;
          background:rgba(249,115,22,.07);
          color:#f97316;
          font-size:7px;
          font-weight:900;
        }

        .section-heading strong {
          display:block;
          font-size:9px;
          font-weight:850;
        }

        .section-heading small {
          display:block;
          margin-top:2px;
          color:rgba(255,255,255,.23);
          font-size:7px;
        }

        .field {
          display:block;
          margin-bottom:8px;
        }

        .field:last-child {
          margin-bottom:0;
        }

        .field > span {
          display:flex;
          align-items:center;
          gap:4px;
          margin-bottom:4px;
          color:rgba(255,255,255,.48);
          font-size:8px;
          font-weight:750;
        }

        .field em {
          color:rgba(255,255,255,.2);
          font-size:6px;
          font-style:normal;
          font-weight:500;
        }

        select,
        .field input,
        textarea {
          width:100%;
          box-sizing:border-box;
          border:1px solid rgba(255,255,255,.06);
          border-radius:7px;
          background:#0a0e14;
          color:#fff;
          outline:none;
          font:500 9px system-ui,sans-serif;
          transition:.16s;
        }

        select,
        .field input {
          height:35px;
          padding:7px 8px;
        }

        textarea {
          min-height:63px;
          padding:7px 8px;
          resize:vertical;
          line-height:1.4;
        }

        select:focus,
        .field input:focus,
        textarea:focus {
          border-color:rgba(249,115,22,.38);
          box-shadow:0 0 0 3px rgba(249,115,22,.05);
        }

        .price-field {
          position:relative;
        }

        .price-field b {
          position:absolute;
          left:9px;
          top:50%;
          transform:translateY(-50%);
          color:#f97316;
          font-size:10px;
          pointer-events:none;
        }

        .price-field input {
          padding-left:23px;
        }

        .image-drop {
          position:relative;
          display:block;
          min-height:122px;
          overflow:hidden;
          border:1px dashed rgba(249,115,22,.2);
          border-radius:9px;
          background:rgba(249,115,22,.025);
          cursor:pointer;
        }

        .image-drop input {
          position:absolute;
          inset:0;
          z-index:3;
          width:100%;
          height:100%;
          min-height:0;
          opacity:0;
          cursor:pointer;
        }

        .upload-empty {
          min-height:122px;
          display:flex;
          flex-direction:column;
          align-items:center;
          justify-content:center;
          gap:4px;
          text-align:center;
        }

        .upload-icon {
          width:31px;
          height:31px;
          display:grid;
          place-items:center;
          border-radius:8px;
          background:rgba(249,115,22,.1);
          color:#f97316;
          font-size:19px;
        }

        .upload-empty strong {
          color:rgba(255,255,255,.62);
          font-size:9px;
        }

        .upload-empty small {
          color:rgba(255,255,255,.23);
          font-size:7px;
        }

        .image-drop.has-image {
          min-height:145px;
        }

        .image-drop img {
          display:block;
          width:100%;
          height:145px;
          object-fit:cover;
        }

        .change-image {
          position:absolute;
          right:7px;
          bottom:7px;
          z-index:2;
          padding:5px 7px;
          border-radius:6px;
          background:rgba(0,0,0,.72);
          color:#fff;
          font-size:7px;
          font-weight:750;
          pointer-events:none;
        }

        .uploading {
          position:absolute;
          left:7px;
          right:7px;
          bottom:7px;
          z-index:4;
          padding:6px 7px;
          border-radius:6px;
          background:rgba(0,0,0,.78);
          color:#fff;
          font-size:8px;
          text-align:center;
        }

        .settings {
          display:flex;
          flex-direction:column;
        }

        .setting {
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap:12px;
          padding:7px 0;
        }

        .setting + .setting {
          border-top:1px solid rgba(255,255,255,.045);
        }

        .setting strong {
          display:block;
          color:rgba(255,255,255,.68);
          font-size:9px;
        }

        .setting small {
          display:block;
          margin-top:2px;
          color:rgba(255,255,255,.23);
          font-size:7px;
        }

        .switch {
          position:relative;
          width:35px;
          height:20px;
          flex-shrink:0;
        }

        .switch input {
          position:absolute;
          width:0;
          height:0;
          opacity:0;
        }

        .switch > span {
          position:absolute;
          inset:0;
          border-radius:999px;
          background:#30343a;
          cursor:pointer;
          transition:.18s;
        }

        .switch > span:before {
          content:"";
          position:absolute;
          width:16px;
          height:16px;
          top:2px;
          left:2px;
          border-radius:50%;
          background:#fff;
          box-shadow:0 1px 4px rgba(0,0,0,.35);
          transition:.18s;
        }

        .switch input:checked + span {
          background:#22c55e;
        }

        .switch input:checked + span:before {
          transform:translateX(15px);
        }

        .actions {
          display:grid;
          grid-template-columns:1fr 1fr;
          gap:5px;
        }

        .actions button {
          min-height:39px;
          border-radius:8px;
          font:850 8px system-ui,sans-serif;
          cursor:pointer;
        }

        .primary {
          border:0;
          background:#f97316;
          color:#fff;
        }

        .secondary {
          border:1px solid rgba(249,115,22,.18);
          background:rgba(249,115,22,.065);
          color:#f97316;
        }

        .secondary span {
          margin-right:3px;
          font-size:12px;
          vertical-align:-1px;
        }

        .actions button:disabled {
          opacity:.5;
          cursor:not-allowed;
        }

        @media(max-width:390px) {
          .section {
            padding:9px;
          }

          .actions {
            grid-template-columns:1fr;
          }
        }
      `}</style>
    </main>
  );
}