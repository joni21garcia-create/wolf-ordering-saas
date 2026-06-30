"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

const ICONS = [
  { value: "truck", emoji: "🚚", label: "Delivery" },
  { value: "pickup", emoji: "🏪", label: "Retiro" },
  { value: "dinein", emoji: "🍽️", label: "Consumo Local" },
  { value: "scheduled", emoji: "📦", label: "Programados" },
  { value: "card", emoji: "💳", label: "Pago Online" },
  { value: "cash", emoji: "💵", label: "Pago Entrega" },
  { value: "whatsapp", emoji: "📱", label: "WhatsApp" },
  { value: "loyalty", emoji: "⭐", label: "Fidelidad" },

  { value: "burger", emoji: "🍔", label: "Hamburguesas" },
  { value: "pizza", emoji: "🍕", label: "Pizza" },
  { value: "taco", emoji: "🌮", label: "Mexicana" },
  { value: "chicken", emoji: "🍗", label: "Pollo" },
  { value: "grill", emoji: "🥩", label: "Parrilla" },
  { value: "healthy", emoji: "🥗", label: "Saludable" },
  { value: "pasta", emoji: "🍝", label: "Pasta" },
  { value: "sushi", emoji: "🍣", label: "Sushi" },

  { value: "cocktail", emoji: "🍹", label: "Cocteles" },
  { value: "beer", emoji: "🍺", label: "Cervezas" },
  { value: "wine", emoji: "🍷", label: "Vinos" },
  { value: "music", emoji: "🎵", label: "Música" },
  { value: "dj", emoji: "🎧", label: "DJ" },
  { value: "sports", emoji: "⚽", label: "Deportes" },
  { value: "happyhour", emoji: "🥂", label: "Happy Hour" },
  { value: "night", emoji: "🌙", label: "Nocturno" },

  { value: "events", emoji: "🎉", label: "Eventos" },
  { value: "birthday", emoji: "🎂", label: "Cumpleaños" },
  { value: "corporate", emoji: "💼", label: "Corporativo" },
  { value: "groups", emoji: "👨‍👩‍👧‍👦", label: "Grupos" },
  { value: "karaoke", emoji: "🎤", label: "Karaoke" },
  { value: "promo", emoji: "🎁", label: "Promociones" },

  { value: "coffee", emoji: "☕", label: "Café" },
  { value: "dessert", emoji: "🧁", label: "Postres" },
  { value: "cake", emoji: "🍰", label: "Tortas" },
  { value: "icecream", emoji: "🍨", label: "Helados" },
  { value: "bakery", emoji: "🥐", label: "Panadería" },
];

export default function EditServicePage() {
  const params = useParams();

  const serviceId =
    params.serviceId as string;

  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState<any>(null);

  useEffect(() => {
    loadService();
  }, []);

  async function loadService() {
    const { data } =
      await supabase
        .from("restaurant_services")
        .select("*")
        .eq("id", serviceId)
        .maybeSingle();

    setForm(data);

    setLoading(false);
  }

  async function saveService() {
    try {
      setSaving(true);

      await supabase
        .from("restaurant_services")
        .update({
          title: form.title,
          description:
            form.description,
          icon: form.icon,
          sort_order:
            form.sort_order,
          active:
            form.active,
        })
        .eq(
          "id",
          serviceId
        );

      alert(
        "Servicio actualizado"
      );

      router.back();
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main
        style={{
          padding:"40px",
          color:"#fff",
        }}
      >
        Cargando...
      </main>
    );
  }
  return (
  <main
    style={{
      maxWidth: "1200px",
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
        Configuración /
        Servicios Restaurante
      </p>

      <h1
        style={{
          fontSize: "52px",
          fontWeight: "800",
          margin: 0,
        }}
      >
        ✏️ Editar Servicio
      </h1>

      <p
        style={{
          color: "#999",
          marginTop: "12px",
          maxWidth: "700px",
        }}
      >
        Actualiza la información
        del servicio que se muestra
        en el landing premium de tu
        restaurante.
      </p>
    </div>

    <div
      style={{
        background:
          "rgba(17,17,17,.95)",
        border:
          "1px solid rgba(255,255,255,.08)",
        borderRadius: "28px",
        padding: "35px",
      }}
    >
      {/* TITULO */}

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
          Título
        </label>

        <input
          value={form.title}
          onChange={(e) =>
            setForm({
              ...form,
              title:
                e.target.value,
            })
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

      {/* DESCRIPCION */}

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
          Descripción
        </label>

        <textarea
          value={
            form.description
          }
          onChange={(e) =>
            setForm({
              ...form,
              description:
                e.target.value,
            })
          }
          rows={4}
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

      {/* ICONOS */}

      <div
        style={{
          marginBottom: "35px",
        }}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          Icono del Servicio
        </h3>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill,minmax(120px,1fr))",
            gap: "15px",
          }}
        >
          {ICONS.map(
            (icon) => (
              <button
                key={
                  icon.value
                }
                onClick={() =>
                  setForm({
                    ...form,
                    icon:
                      icon.value,
                  })
                }
                style={{
                  background:
                    form.icon ===
                    icon.value
                      ? "rgba(249,115,22,.18)"
                      : "rgba(255,255,255,.04)",

                  border:
                    form.icon ===
                    icon.value
                      ? "2px solid #f97316"
                      : "1px solid rgba(255,255,255,.08)",

                  borderRadius:
                    "18px",

                  padding:
                    "18px 12px",

                  cursor:
                    "pointer",

                  color:
                    "#fff",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "34px",
                    marginBottom:
                      "8px",
                  }}
                >
                  {icon.emoji}
                </div>

                <div
                  style={{
                    fontSize:
                      "13px",
                  }}
                >
                  {icon.label}
                </div>
              </button>
            )
          )}
        </div>
      </div>

      {/* ORDEN */}

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
          Orden
        </label>

        <input
          type="number"
          value={
            form.sort_order
          }
          onChange={(e) =>
            setForm({
              ...form,
              sort_order:
                Number(
                  e.target.value
                ),
            })
          }
          style={{
            width: "180px",
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

      {/* ACTIVO */}

      <div
        style={{
          marginBottom: "35px",
        }}
      >
        <label
          style={{
            display: "flex",
            gap: "12px",
            alignItems:
              "center",
            fontWeight: "600",
          }}
        >
          <input
            type="checkbox"
            checked={
              form.active
            }
            onChange={(e) =>
              setForm({
                ...form,
                active:
                  e.target.checked,
              })
            }
          />

          Servicio Activo
        </label>
      </div>

      {/* BOTONES */}

      <div
        style={{
          display: "flex",
          gap: "15px",
          flexWrap: "wrap",
        }}
      >
        <button
          onClick={
            saveService
          }
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
            boxShadow:
              "0 10px 35px rgba(249,115,22,.35)",
          }}
        >
          {saving
            ? "Guardando..."
            : "💾 Guardar Cambios"}
        </button>

        <button
          onClick={() =>
            router.back()
          }
          style={{
            background:
              "rgba(255,255,255,.05)",
            color: "#fff",
            border:
              "1px solid rgba(255,255,255,.08)",
            padding:
              "18px 40px",
            borderRadius:
              "18px",
            cursor: "pointer",
          }}
        >
          Cancelar
        </button>
      </div>
    </div>
  </main>
);
}