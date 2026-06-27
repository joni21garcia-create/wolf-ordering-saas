"use client";

import {
  useState,
  useEffect,
} from "react";

import { supabase } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useImageUpload } from "@/hooks/useImageUpload";

interface Props {
  mode: "create" | "edit";
  restaurantId?: string;
}


export default function RestaurantForm({
  mode,
  restaurantId,
}: Props) {

const router = useRouter();


  const [loading, setLoading] =
    useState(false);

    const [uploading, setUploading] =
  useState(false);

  const {
  upload,
  uploading: imageUploading,
  progress,
} = useImageUpload();

  const [form, setForm] =
    useState({
      name: "",
      slug: "",

      owner_name: "",
      owner_email: "",

      whatsapp: "",
      address: "",

      latitude: "",
      longitude: "",

      description: "",

      logo_url: "",
      banner_url: "",
      favicon_url: "",
      og_image_url: "",

      hero_title: "",
      hero_subtitle: "",
      hero_button_text:
        "Ordenar Ahora",

      primary_color:
        "#f97316",

      secondary_color:
        "#111827",

      background_color:
        "#000000",

      text_color:
        "#ffffff",

      button_color:
        "#f97316",

      pickup_enabled: true,
      delivery_enabled: true,

      active: true,
      accepting_orders: true,

      delivery_fee: 0,
      minimum_order: 0,
      free_delivery_from: 0,

      facebook_url: "",
      instagram_url: "",
      tiktok_url: "",
      youtube_url: "",
      website_url: "",

      meta_title: "",
      meta_description: "",

      plan_name: "FREE",
    });


    useEffect(() => {
  if (
    mode === "edit" &&
    restaurantId
  ) {
    loadRestaurant();
  }
}, [restaurantId]);

const loadRestaurant =
  async () => {
    const {
      data,
      error,
    } = await supabase
      .from("restaurants")
      .select("*")
      .eq(
        "id",
        restaurantId
      )
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setForm((prev) => ({
      ...prev,
      ...data,
    }));
  };


const uploadRestaurantImage =
  async (
    file: File,
    field:
      | "logo_url"
      | "banner_url"
  ) => {
    try {
      setUploading(true);

     const result =
  await upload({
    file,
    restaurantId:
      restaurantId ?? "new",
    preset:
      field === "logo_url"
        ? "logo"
        : "banner",
  });

if (!result.success) {
  throw new Error(
    result.error
  );
}

setForm((prev) => ({
  ...prev,
  [field]:
    result.url!,
}));

    } catch (error) {
      console.error(error);

      alert(
        "Error subiendo imagen"
      );
    } finally {
      setUploading(false);
    }
  };

  const deleteRestaurant =
  async () => {
    if (
      !restaurantId
    )
      return;

    const confirmDelete =
      confirm(
        "¿Eliminar restaurante?"
      );

    if (!confirmDelete)
      return;

    const { error } =
      await supabase
        .from("restaurants")
        .delete()
        .eq(
          "id",
          restaurantId
        );

    if (error) {
      alert(
        "Error eliminando"
      );
      return;
    }

    router.push(
      "/super-admin/restaurants"
    );
  };

 const handleSubmit = async (
  e: React.FormEvent
) => {
  e.preventDefault();

  try {
    setLoading(true);

    if (
      mode === "create"
    ) {
      const {
        data,
        error,
      } = await supabase
        .from("restaurants")
        .insert({
          ...form,

          terms_accepted:
            true,

          terms_accepted_at:
            new Date().toISOString(),
        })
        .select()
        .single();

      if (error)
        throw error;

      alert(
        "Restaurante creado correctamente"
      );

      router.push(
        "/super-admin/restaurants"
      );
    }

    if (
      mode === "edit" &&
      restaurantId
    ) {
      const {
        error,
      } = await supabase
        .from("restaurants")
        .update(form)
        .eq(
          "id",
          restaurantId
        );

      if (error)
        throw error;

      alert(
        "Restaurante actualizado"
      );

      router.push(
        "/super-admin/restaurants"
      );
    }
  } catch (error) {
    console.error(error);

    alert(
      "Ocurrió un error"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <main
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "40px",
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
          ? "Nuevo Restaurante"
          : "Editar Restaurante"}
      </h1>

      <form
        onSubmit={
          handleSubmit
        }
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "1fr 1fr",
            gap: "20px",
          }}
        >
          <input
            placeholder="Nombre"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target
                  .value,
              })
            }
          />

          <input
            placeholder="Slug"
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: e.target
                  .value,
              })
            }
          />

          <input
            placeholder="Propietario"
            value={
              form.owner_name
            }
            onChange={(e) =>
              setForm({
                ...form,
                owner_name:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Email"
            value={
              form.owner_email
            }
            onChange={(e) =>
              setForm({
                ...form,
                owner_email:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Whatsapp"
            value={
              form.whatsapp
            }
            onChange={(e) =>
              setForm({
                ...form,
                whatsapp:
                  e.target
                    .value,
              })
            }
          />

          <input
  placeholder="Latitud"
  value={form.latitude}
  onChange={(e) =>
    setForm({
      ...form,
      latitude:
        e.target.value,
    })
  }
/>

<input
  placeholder="Longitud"
  value={form.longitude}
  onChange={(e) =>
    setForm({
      ...form,
      longitude:
        e.target.value,
    })
  }
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
          />

          <div>
  <label
    style={{
      color: "#fff",
      display: "block",
      marginBottom: "10px",
    }}
  >
    Logo
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file =
        e.target.files?.[0];

      if (file) {
        uploadRestaurantImage(
          file,
          "logo_url"
        );
      }
    }}
  />

  {form.logo_url && (
    <img
      src={form.logo_url}
      alt="Logo"
      style={{
        width: "100px",
        height: "100px",
        objectFit: "cover",
        borderRadius: "50%",
        marginTop: "10px",
      }}
    />
  )}
</div>

          <div>
  <label
    style={{
      color: "#fff",
      display: "block",
      marginBottom: "10px",
    }}
  >
    Banner Principal
  </label>

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file =
        e.target.files?.[0];

      if (file) {
        uploadRestaurantImage(
          file,
          "banner_url"
        );
      }
    }}
  />

  {form.banner_url && (
    <img
      src={form.banner_url}
      alt="Banner"
      style={{
        width: "100%",
        maxWidth: "300px",
        height: "150px",
        objectFit: "cover",
        borderRadius: "12px",
        marginTop: "10px",
      }}
    />
  )}
</div>

          <input
            placeholder="Favicon URL"
            value={
              form.favicon_url
            }
            onChange={(e) =>
              setForm({
                ...form,
                favicon_url:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="OG Image URL"
            value={
              form.og_image_url
            }
            onChange={(e) =>
              setForm({
                ...form,
                og_image_url:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Hero Title"
            value={
              form.hero_title
            }
            onChange={(e) =>
              setForm({
                ...form,
                hero_title:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Hero Subtitle"
            value={
              form.hero_subtitle
            }
            onChange={(e) =>
              setForm({
                ...form,
                hero_subtitle:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Texto Botón Hero"
            value={
              form.hero_button_text
            }
            onChange={(e) =>
              setForm({
                ...form,
                hero_button_text:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Facebook"
            value={
              form.facebook_url
            }
            onChange={(e) =>
              setForm({
                ...form,
                facebook_url:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Instagram"
            value={
              form.instagram_url
            }
            onChange={(e) =>
              setForm({
                ...form,
                instagram_url:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="TikTok"
            value={
              form.tiktok_url
            }
            onChange={(e) =>
              setForm({
                ...form,
                tiktok_url:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Youtube"
            value={
              form.youtube_url
            }
            onChange={(e) =>
              setForm({
                ...form,
                youtube_url:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Website"
            value={
              form.website_url
            }
            onChange={(e) =>
              setForm({
                ...form,
                website_url:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Meta Title"
            value={
              form.meta_title
            }
            onChange={(e) =>
              setForm({
                ...form,
                meta_title:
                  e.target
                    .value,
              })
            }
          />

          <input
            placeholder="Meta Description"
            value={
              form.meta_description
            }
            onChange={(e) =>
              setForm({
                ...form,
                meta_description:
                  e.target
                    .value,
              })
            }
          />

          <input
            type="number"
            placeholder="Costo Delivery"
            value={
              form.delivery_fee
            }
            onChange={(e) =>
              setForm({
                ...form,
                delivery_fee:
                  Number(
                    e.target
                      .value
                  ),
              })
            }
          />

          <input
            type="number"
            placeholder="Pedido Mínimo"
            value={
              form.minimum_order
            }
            onChange={(e) =>
              setForm({
                ...form,
                minimum_order:
                  Number(
                    e.target
                      .value
                  ),
              })
            }
          />

          <input
            type="number"
            placeholder="Envío Gratis Desde"
            value={
              form.free_delivery_from
            }
            onChange={(e) =>
              setForm({
                ...form,
                free_delivery_from:
                  Number(
                    e.target
                      .value
                  ),
              })
            }
          />

          <label
            style={{
              color:
                "white",
            }}
          >
            Color Primario
          </label>

          <input
            type="color"
            value={
              form.primary_color
            }
            onChange={(e) =>
              setForm({
                ...form,
                primary_color:
                  e.target
                    .value,
              })
            }
          />

          <label
            style={{
              color:
                "white",
            }}
          >
            Color Secundario
          </label>

          <input
            type="color"
            value={
              form.secondary_color
            }
            onChange={(e) =>
              setForm({
                ...form,
                secondary_color:
                  e.target
                    .value,
              })
            }
          />
        </div>

        {mode === "edit" && (
  <button
    type="button"
    onClick={
      deleteRestaurant
    }
    style={{
      marginTop: "30px",
      marginRight: "15px",
      padding:
        "15px 30px",
      borderRadius:
        "12px",
      background:
        "#dc2626",
      color: "#fff",
      border: "none",
    }}
  >
    Eliminar
  </button>
)}
<button
  type="submit"
  disabled={
  loading ||
  uploading
}
  style={{
    marginTop: "30px",
    padding: "15px 30px",
    borderRadius: "12px",
    background: "#f97316",
    color: "#fff",
    border: "none",
    cursor: "pointer",
  }}
>
  {loading || uploading
  ? "Procesando..."
    : mode === "create"
    ? "Crear Restaurante"
    : "Actualizar Restaurante"}
</button>

      </form>
    </main>
  );
}