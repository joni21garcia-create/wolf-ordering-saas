"use client";

import {
  useEffect,
  useState,
} from "react";

import { useImageUpload } from "@/hooks/useImageUpload";

import {
  useParams,
} from "next/navigation";

import {
  supabase,
} from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function GalleryPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [images, setImages] =
    useState<any[]>([]);

  const [uploading, setUploading] =
    useState(false);

    const {
  upload,
  uploading: imageUploading,
  progress,
} = useImageUpload();

  useEffect(() => {
    loadGallery();
  }, []);

  const loadGallery =
    async () => {
      const { data } =
        await supabase
          .from(
            "restaurant_gallery"
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

      setImages(
        data || []
      );
    };

 const uploadImage =
  async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {

    try {

      const file =
        e.target.files?.[0];

      if (!file) return;

      setUploading(true);

      const result =
  await upload({
    file,
    restaurantId,
    preset: "gallery",
  });

if (!result.success) {
  throw new Error(
    result.error
  );
}

      const {
        error: insertError,
      } =
        await supabase
          .from(
            "restaurant_gallery"
          )
          .insert({
            restaurant_id:
              restaurantId,

           image_url:
  result.url,

            active: true,

            sort_order:
              images.length + 1,
          });

      if (insertError) {
        throw insertError;
      }

      loadGallery();

    } catch (error) {

      console.error(error);

      alert(
        "Error subiendo imagen."
      );

    } finally {

      setUploading(false);

    }
  };

return (
  <PermissionGuard
    permission="gallery"
  >
    <main
      style={{
        maxWidth:
          "1500px",
        margin:
          "0 auto",
        padding:
          "40px",
        color: "#fff",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display:
            "flex",
          justifyContent:
            "space-between",
          alignItems:
            "center",
          marginBottom:
            "35px",
          flexWrap:
            "wrap",
          gap: "20px",
        }}
      >
        <div>
          <p
            style={{
              color:
                "#777",
              marginBottom:
                "8px",
            }}
          >
            <BackToSettings
  restaurantId={restaurantId}
/>
            Configuración /
            Galería
          </p>

          <h1
            style={{
              margin: 0,
              fontSize:
                "48px",
              fontWeight:
                "900",
            }}
          >
            Galería del
            Restaurante
          </h1>

          <p
            style={{
              color:
                "#888",
              marginTop:
                "12px",
            }}
          >
            Administra las
            imágenes que se
            mostrarán en el
            landing.
          </p>
        </div>

        <label
          style={{
            background:
              "#f97316",
            color:
              "#fff",
            padding:
              "14px 26px",
            borderRadius:
              "16px",
            cursor:
              "pointer",
            fontWeight:
              "700",
            boxShadow:
              "0 20px 50px rgba(249,115,22,.35)",
          }}
        >
          {uploading
            ? "Subiendo..."
            : "+ Agregar Imagen"}

          <input
            type="file"
            accept="image/*"
            hidden
            onChange={
              uploadImage
            }
          />
        </label>
      </div>

      {/* STATS */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fit,minmax(220px,1fr))",
          gap: "20px",
          marginBottom:
            "30px",
        }}
      >
        <div
          style={
            statCard
          }
        >
          <h2>
            {
              images.length
            }
          </h2>

          <p>
            Imágenes
          </p>
        </div>

        <div
          style={
            statCard
          }
        >
          <h2>
            {
              images.filter(
                (
                  img
                ) =>
                  img.active
              ).length
            }
          </h2>

          <p>
            Visibles
          </p>
        </div>
      </div>

      {/* GRID */}

      <div
        style={{
          display:
            "grid",
          gridTemplateColumns:
            "repeat(auto-fill,minmax(320px,1fr))",
          gap: "25px",
        }}
      >
      
              {images.length === 0 && (
          <div
            style={{
              gridColumn:
                "1/-1",
              background:
                "rgba(17,17,17,.95)",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius:
                "28px",
              padding:
                "60px",
              textAlign:
                "center",
            }}
          >
            <div
              style={{
                fontSize:
                  "60px",
                marginBottom:
                  "20px",
              }}
            >
              🖼️
            </div>

            <h2>
              Sin imágenes
            </h2>

            <p
              style={{
                color:
                  "#888",
              }}
            >
              Sube la primera imagen
              para comenzar.
            </p>
          </div>
        )}

        {images.map(
          (image, index) => (
            <div
              key={image.id}
              style={{
                background:
                  "rgba(17,17,17,.95)",
                border:
                  "1px solid rgba(255,255,255,.08)",
                borderRadius:
                  "24px",
                overflow:
                  "hidden",
                backdropFilter:
                  "blur(20px)",
              }}
            >
              <img
                src={
                  image.image_url
                }
                alt=""
                style={{
                  width:
                    "100%",
                  height:
                    "240px",
                  objectFit:
                    "cover",
                }}
              />

              <div
                style={{
                  padding:
                    "20px",
                }}
              >
                <div
                  style={{
                    display:
                      "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    marginBottom:
                      "15px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        color:
                          "#f97316",
                        fontSize:
                          "13px",
                      }}
                    >
                      Imagen #
                      {index +
                        1}
                    </div>

                    <h3
                      style={{
                        margin:
                          "6px 0 0 0",
                      }}
                    >
                      Galería
                    </h3>
                  </div>

                  <div
                    style={{
                      background:
                        image.active
                          ? "rgba(34,197,94,.15)"
                          : "rgba(239,68,68,.15)",

                      color:
                        image.active
                          ? "#22c55e"
                          : "#ef4444",

                      padding:
                        "8px 14px",

                      borderRadius:
                        "999px",

                      fontSize:
                        "12px",

                      fontWeight:
                        "700",
                    }}
                  >
                    {image.active
                      ? "Visible"
                      : "Oculta"}
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
                  <button
                    onClick={async () => {
                      await supabase
                        .from(
                          "restaurant_gallery"
                        )
                        .update({
                          active:
                            !image.active,
                        })
                        .eq(
                          "id",
                          image.id
                        );

                      loadGallery();
                    }}
                    style={{
                      flex: 1,
                      background:
                        image.active
                          ? "rgba(250,204,21,.15)"
                          : "rgba(34,197,94,.15)",

                      color:
                        image.active
                          ? "#facc15"
                          : "#22c55e",

                      border:
                        "none",

                      padding:
                        "12px",

                      borderRadius:
                        "12px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "700",
                    }}
                  >
                    {image.active
                      ? "Ocultar"
                      : "Mostrar"}
                  </button>

                  <button
                    onClick={async () => {
                      const confirmDelete =
                        confirm(
                          "¿Eliminar imagen?"
                        );

                      if (
                        !confirmDelete
                      )
                        return;

                      await supabase
                        .from(
                          "restaurant_gallery"
                        )
                        .delete()
                        .eq(
                          "id",
                          image.id
                        );

                      loadGallery();
                    }}
                    style={{
                      flex: 1,
                      background:
                        "rgba(239,68,68,.15)",

                      color:
                        "#ef4444",

                      border:
                        "none",

                      padding:
                        "12px",

                      borderRadius:
                        "12px",

                      cursor:
                        "pointer",

                      fontWeight:
                        "700",
                    }}
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
     </main>
  </PermissionGuard>
)
}

const statCard = {
  background:
    "rgba(17,17,17,.95)",

  border:
    "1px solid rgba(255,255,255,.08)",

  borderRadius:
    "24px",

  padding:
    "24px",

  textAlign:
    "center" as const,
};