"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function NavbarSettingsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
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
      logo_url: "",
      name: "",
      navbar_button_text:
        "Ordenar Ahora",
    });

  useEffect(() => {
    loadData();
  }, []);

  const loadData =
    async () => {
      try {
        const { data } =
          await supabase
            .from("restaurants")
            .select(`
              logo_url,
              name,
              navbar_button_text
            `)
            .eq(
              "id",
              restaurantId
            )
            .single();

        if (data) {
          setForm({
            logo_url:
              data.logo_url || "",

            name:
              data.name || "",

            navbar_button_text:
              data.navbar_button_text ||
              "Ordenar Ahora",
          });
        }
      } finally {
        setLoading(false);
      }
    };

  const saveData =
    async () => {
      try {
        setSaving(true);

        await supabase
          .from("restaurants")
          .update({
            logo_url:
              form.logo_url,

            name:
              form.name,

            navbar_button_text:
              form.navbar_button_text,
          })
          .eq(
            "id",
            restaurantId
          );

        alert(
          "Navbar actualizado"
        );
      } finally {
        setSaving(false);
      }
    };

    const uploadLogo = async (
  file: File
) => {
  try {
    setUploading(true);

   const result =
  await upload({
    file,
    restaurantId,
    preset: "logo",
  });

if (!result.success) {
  throw new Error(
    result.error
  );
}

setForm({
  ...form,
  logo_url:
    result.url!,
});

  } catch (err) {
    console.error(err);
    alert(
      "Error subiendo imagen"
    );
  } finally {
    setUploading(false);
  }
};

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
  <PermissionGuard
    permission="navbar"
    >
      <main>
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          padding: "40px",
          color: "#fff",
          marginBottom: "40px",
        }}
      >
        <p
          style={{
            color: "#777",
            marginBottom: "10px",
          }}
        >
            
<BackToSettings
  restaurantId={restaurantId}
/>

          Configuración /
          Navbar
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          🧭 Navbar
        </h1>

        <p
          style={{
            color: "#999",
            marginTop: "12px",
            maxWidth: "700px",
          }}
        >
          Configura la información
          principal que se muestra
          en el navbar del restaurante.
        </p>
      </div>

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius:
            "28px",
          padding: "30px",
        }}
      >
        <div
  style={{
    marginBottom: "30px",
  }}
>
  <label
    style={{
      display: "block",
      marginBottom: "10px",
      color: "#aaa",
      fontWeight: "600",
    }}
  >
    Logo Restaurante
  </label>

  {form.logo_url && (
    <img
      src={form.logo_url}
      alt="logo"
      style={{
        width: "120px",
        height: "120px",
        borderRadius: "50%",
        objectFit: "cover",
        marginBottom: "15px",
        border:
          "2px solid #f97316",
      }}
    />
  )}

  <input
    type="file"
    accept="image/*"
    onChange={(e) => {
      const file =
        e.target.files?.[0];

      if (file) {
        uploadLogo(file);
      }
    }}
  />

  {uploading && (
    <p
      style={{
        color: "#f97316",
        marginTop: "10px",
      }}
    >
      Subiendo imagen...
    </p>
  )}
</div>

        <InputField
          label="Nombre Restaurante"
          value={form.name}
          onChange={(value: string) =>
            setForm({
              ...form,
              name:
                value,
            })
          }
        />

        <InputField
          label="Texto Botón"
          value={
            form.navbar_button_text
          }
          onChange={(value: string) =>
            setForm({
              ...form,
              navbar_button_text:
                value,
            })
          }
        />

        <button
          onClick={saveData}
          disabled={saving}
          style={{
            background:
              "#f97316",
            color: "#fff",
            border: "none",
            padding:
              "18px 40px",
            borderRadius:
              "18px",
            fontWeight: "800",
            cursor: "pointer",
          }}
        >
          {saving
            ? "Guardando..."
            : "💾 Guardar Navbar"}
        </button>
      </div>
     </main>
  </PermissionGuard>
);
}

function InputField({
  label,
  value,
  onChange,
}: any) {
  return (
    <div
      style={{
        marginBottom: "25px",
      }}
    >
      <label
        style={{
          display: "block",
          marginBottom: "10px",
          color: "#aaa",
          fontWeight: "600",
        }}
      >
        {label}
      </label>

      <input
        value={value || ""}
        onChange={(e) =>
          onChange(
            e.target.value
          )
        }
        style={{
          width: "100%",
          background:
            "rgba(255,255,255,.04)",
          border:
            "1px solid rgba(255,255,255,.08)",
          color: "#fff",
          padding: "16px",
          borderRadius: "14px",
          outline: "none",
        }}
      />
    </div>
  );
}
