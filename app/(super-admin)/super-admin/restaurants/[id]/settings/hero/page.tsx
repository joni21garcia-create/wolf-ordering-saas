"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function HeroSettingsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [slides, setSlides] =
    useState<any[]>([]);

  const [
    selectedSlide,
    setSelectedSlide,
  ] = useState<any>(null);

  useEffect(() => {
    loadSlides();
  }, []);

  const loadSlides =
    async () => {
      try {
        const { data } =
          await supabase
            .from(
              "restaurant_hero_slides"
            )
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

        if (
          data &&
          data.length > 0
        ) {
          setSlides(data);

          setSelectedSlide(
            data[0]
          );
        }
      } finally {
        setLoading(false);
      }
    };

  const saveSlide =
    async () => {
      if (!selectedSlide)
        return;

      try {
        setSaving(true);

        await supabase
          .from(
            "restaurant_hero_slides"
          )
          .update({
            title:
              selectedSlide.title,

            subtitle:
              selectedSlide.subtitle,

            image_url:
              selectedSlide.image_url,

            button_text:
              selectedSlide.button_text,

            button_url:
              selectedSlide.button_url,

            active:
              selectedSlide.active,

            sort_order:
              selectedSlide.sort_order,
          })
          .eq(
            "id",
            selectedSlide.id
          );

        alert(
          "Hero actualizado"
        );

        loadSlides();
      } finally {
        setSaving(false);
      }
    };

    const uploadImage = async (
  e: React.ChangeEvent<HTMLInputElement>
) => {
  const file =
    e.target.files?.[0];

  if (!file) return;

  try {
    setSaving(true);


    const formData = new FormData();

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
  "hero"
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
  throw new Error(json.error);
}

setSelectedSlide({
  ...selectedSlide,
  image_url: json.url,
});
   

  } catch (error) {
    console.error(error);
    alert(
      "Error subiendo imagen"
    );
  } finally {
    setSaving(false);
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
        Cargando Hero...
      </main>
    );
  }

return (
  <PermissionGuard
    permission="hero"
    >
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: "40px",
          color: "#fff",
        }}
      >
      <div
        style={{
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

          Configuración / Hero
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          🚀 Hero Slides
        </h1>

        <p
          style={{
            color: "#999",
            marginTop: "12px",
          }}
        >
          Configura promociones,
          campañas y mensajes
          principales del restaurante.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "320px 1fr",
          gap: "30px",
        }}
      >
{/* SIDEBAR */}

<div
  style={{
    background:
      "rgba(17,17,17,.95)",
    border:
      "1px solid rgba(255,255,255,.08)",
    borderRadius: "28px",
    padding: "20px",
    height: "fit-content",
  }}
>
  <h3
    style={{
      color: "#fff",
      marginTop: 0,
      marginBottom: "20px",
    }}
  >
    Slides
  </h3>

{slides.length === 0 && (
  <div
    style={{
      color: "#888",
      padding: "10px",
    }}
  >
    No existen slides para este restaurante.
  </div>
)}


  {slides.map(
    (slide, index) => (
      <div
        key={slide.id}
        onClick={() =>
          setSelectedSlide(slide)
        }
        style={{
          padding: "18px",
          borderRadius: "16px",
          cursor: "pointer",
          marginBottom: "12px",
          border:
            selectedSlide?.id ===
            slide.id
              ? "1px solid #f97316"
              : "1px solid rgba(255,255,255,.08)",

          background:
            selectedSlide?.id ===
            slide.id
              ? "rgba(249,115,22,.12)"
              : "rgba(255,255,255,.03)",
        }}
      >
        <strong>
          Slide {index + 1}
        </strong>

        <div
          style={{
            color: "#888",
            fontSize: "13px",
            marginTop: "6px",
          }}
        >
          {slide.title ||
            "Sin título"}
        </div>
      </div>
    )
  )}
</div>

{/* EDITOR */}

<div
  style={{
    background:
      "rgba(17,17,17,.95)",
    border:
      "1px solid rgba(255,255,255,.08)",
    borderRadius: "28px",
    padding: "30px",
  }}
>
{!selectedSlide ? (
  <div
    style={{
      color: "#888",
    }}
  >
    Selecciona un slide.
  </div>
) : (
  <>
    <h2
      style={{
        marginTop: 0,
        color: "#fff",
      }}
    >
      Editor Hero
    </h2>
    
      {/* IMAGEN */}

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
  }}
>
  Imagen Slide
</label>

{selectedSlide.image_url && (
  <img
    src={
      selectedSlide.image_url
    }
    alt=""
    style={{
      width: "100%",
      maxHeight: "250px",
      objectFit: "cover",
      borderRadius: "18px",
      marginBottom: "15px",
    }}
  />
)}

<input
  type="file"
  accept="image/*"
  onChange={uploadImage}
/>
      </div>

      {/* TITULO */}

      <InputField
        label="Título"
        value={
          selectedSlide.title ||
          ""
        }
        onChange={(
          value: string
        ) =>
          setSelectedSlide({
            ...selectedSlide,
            title: value,
          })
        }
      />

      {/* SUBTITULO */}

      <InputField
        label="Subtítulo"
        value={
          selectedSlide.subtitle ||
          ""
        }
        onChange={(
          value: string
        ) =>
          setSelectedSlide({
            ...selectedSlide,
            subtitle: value,
          })
        }
      />

      {/* BOTON */}

      <InputField
        label="Texto Botón"
        value={
          selectedSlide.button_text ||
          ""
        }
        onChange={(
          value: string
        ) =>
          setSelectedSlide({
            ...selectedSlide,
            button_text:
              value,
          })
        }
      />

      <InputField
        label="URL Botón"
        value={
          selectedSlide.button_url ||
          ""
        }
        onChange={(
          value: string
        ) =>
          setSelectedSlide({
            ...selectedSlide,
            button_url:
              value,
          })
        }
      />

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginTop: "25px",
          marginBottom: "25px",
        }}
      >
        <label
          style={{
            color: "#fff",
          }}
        >
          <input
            type="checkbox"
            checked={
              selectedSlide.active
            }
            onChange={(e) =>
              setSelectedSlide({
                ...selectedSlide,
                active:
                  e.target.checked,
              })
            }
          />

          {" "}Activo
        </label>
      </div>

      {/* PREVIEW */}

      <div
        style={{
          marginTop: "35px",
          background:
            "rgba(255,255,255,.03)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "22px",
          padding: "25px",
        }}
      >
        <h3
          style={{
            marginTop: 0,
            color: "#fff",
          }}
        >
          Vista previa
        </h3>

        <h2
          style={{
            color: "#fff",
          }}
        >
          {
            selectedSlide.title
          }
        </h2>

        <p
          style={{
            color: "#aaa",
          }}
        >
          {
            selectedSlide.subtitle
          }
        </p>

        <button
          style={{
            background:
              "#f97316",
            color: "#fff",
            border: "none",
            padding:
              "14px 28px",
            borderRadius:
              "14px",
            fontWeight: "700",
          }}
        >
          {selectedSlide.button_text ||
            "Ordenar Ahora"}
        </button>
      </div>

      <button
        onClick={saveSlide}
        disabled={saving}
        style={{
          marginTop: "30px",
          background:
            "#f97316",
          color: "#fff",
          border: "none",
          padding:
            "18px 35px",
          borderRadius: "18px",
          fontWeight: "800",
          cursor: "pointer",
        }}
      >
        {saving
          ? "Guardando..."
          : "💾 Guardar Hero"}
      </button>
    </>
  )}
</div>
      </div>
      </div>
  </PermissionGuard>
);
}

const inputStyle = {
width: "100%",
background:
"rgba(255,255,255,.04)",
border:
"1px solid rgba(255,255,255,.08)",
color: "#fff",
padding: "16px",
borderRadius: "14px",
outline: "none",
};

function InputField({
label,
value,
onChange,
}: any) {
return (
<div
style={{
marginBottom: "20px",
}}
>
<label
style={{
display: "block",
marginBottom: "10px",
color: "#aaa",
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
style={inputStyle}
/>
</div>
);
}