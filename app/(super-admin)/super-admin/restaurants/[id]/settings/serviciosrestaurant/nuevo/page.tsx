"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";

const ICONS = [
  // SERVICIOS GENERALES
  {
    value: "truck",
    emoji: "🚚",
    label: "Delivery",
  },
  {
    value: "pickup",
    emoji: "🏪",
    label: "Retiro Local",
  },
  {
    value: "dinein",
    emoji: "🍽️",
    label: "Consumo Local",
  },
  {
    value: "schedule",
    emoji: "📦",
    label: "Pedidos Programados",
  },
  {
    value: "onlinepay",
    emoji: "💳",
    label: "Pago Online",
  },
  {
    value: "cash",
    emoji: "💵",
    label: "Pago Contra Entrega",
  },
  {
    value: "whatsapp",
    emoji: "📱",
    label: "WhatsApp",
  },
  {
    value: "loyalty",
    emoji: "⭐",
    label: "Fidelización",
  },

  // COMIDA
  {
    value: "burger",
    emoji: "🍔",
    label: "Hamburguesas",
  },
  {
    value: "pizza",
    emoji: "🍕",
    label: "Pizza",
  },
  {
    value: "mexican",
    emoji: "🌮",
    label: "Comida Mexicana",
  },
  {
    value: "chicken",
    emoji: "🍗",
    label: "Pollo",
  },
  {
    value: "grill",
    emoji: "🥩",
    label: "Parrilla",
  },
  {
    value: "healthy",
    emoji: "🥗",
    label: "Saludable",
  },
  {
    value: "pasta",
    emoji: "🍝",
    label: "Pasta",
  },
  {
    value: "sushi",
    emoji: "🍣",
    label: "Sushi",
  },

  // BAR
  {
    value: "cocktail",
    emoji: "🍹",
    label: "Cocteles",
  },
  {
    value: "beer",
    emoji: "🍺",
    label: "Cervezas",
  },
  {
    value: "wine",
    emoji: "🍷",
    label: "Vinos",
  },
  {
    value: "music",
    emoji: "🎵",
    label: "Música en Vivo",
  },
  {
    value: "dj",
    emoji: "🎧",
    label: "DJ Nights",
  },
  {
    value: "sports",
    emoji: "⚽",
    label: "Eventos Deportivos",
  },
  {
    value: "happyhour",
    emoji: "🥂",
    label: "Happy Hour",
  },
  {
    value: "nightlife",
    emoji: "🌙",
    label: "Vida Nocturna",
  },

  // EVENTOS
  {
    value: "party",
    emoji: "🎉",
    label: "Eventos",
  },
  {
    value: "birthday",
    emoji: "🎂",
    label: "Cumpleaños",
  },
  {
    value: "corporate",
    emoji: "💍",
    label: "Corporativos",
  },
  {
    value: "groups",
    emoji: "👨‍👩‍👧‍👦",
    label: "Reservas Grupos",
  },
  {
    value: "karaoke",
    emoji: "🎤",
    label: "Karaoke",
  },
  {
    value: "promo",
    emoji: "🎁",
    label: "Promociones",
  },

  // CAFETERÍA
  {
    value: "coffee",
    emoji: "☕",
    label: "Café",
  },
  {
    value: "dessert",
    emoji: "🧁",
    label: "Postres",
  },
  {
    value: "cake",
    emoji: "🍰",
    label: "Tortas",
  },
  {
    value: "icecream",
    emoji: "🍨",
    label: "Helados",
  },
  {
    value: "bakery",
    emoji: "🥐",
    label: "Panadería",
  },
];

export default function NuevoServicioPage() {
  const params = useParams();

  const router = useRouter();

  const restaurantId =
    params.id as string;

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      title: "",
      description: "",
      icon: "truck",
      sort_order: 0,
      active: true,
    });

  async function saveService() {
    try {
      setSaving(true);

      await supabase
        .from(
          "restaurant_services"
        )
        .insert({
          restaurant_id:
            restaurantId,
          title: form.title,
          description:
            form.description,
          icon: form.icon,
          sort_order:
            form.sort_order,
          active: form.active,
        });

      alert(
        "Servicio creado"
      );

      router.push(
        `/super-admin/restaurants/${restaurantId}/settings/serviciosrestaurant`
      );
    } finally {
      setSaving(false);
    }
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

    Nuevo Servicio
      </h1>

      <p
        style={{
          color: "#999",
          marginTop: "12px",
          maxWidth: "700px",
        }}
      >
        Agrega nuevos servicios
        para mostrar en el
        landing del restaurante.
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
      {/* TITULO */}

      <InputField
        label="Título"
        value={form.title}
        onChange={(value:string)=>
          setForm({
            ...form,
            title:value,
          })
        }
      />

      {/* DESCRIPCION */}

      <InputField
        label="Descripción"
        value={form.description}
        onChange={(value:string)=>
          setForm({
            ...form,
            description:value,
          })
        }
      />

      {/* ICONOS */}

      <div
        style={{
          marginBottom:"30px",
        }}
      >
        <label
          style={{
            display:"block",
            marginBottom:"15px",
            color:"#aaa",
            fontWeight:"600",
          }}
        >
          Icono Servicio
        </label>

        <div
          style={{
            display:"grid",
            gridTemplateColumns:
              "repeat(auto-fit,minmax(120px,1fr))",
            gap:"12px",
          }}
        >
          {ICONS.map(
            (icon)=>(
              <button
                key={icon.value}
                type="button"
                onClick={()=>
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
                      ? "rgba(249,115,22,.15)"
                      : "rgba(255,255,255,.03)",

                  border:
                    form.icon ===
                    icon.value
                      ? "2px solid #f97316"
                      : "1px solid rgba(255,255,255,.08)",

                  borderRadius:
                    "18px",

                  padding:
                    "16px",

                  cursor:
                    "pointer",

                  color:"#fff",

                  textAlign:
                    "center",
                }}
              >
                <div
                  style={{
                    fontSize:
                      "32px",
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
                    fontWeight:
                      "600",
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

      <InputField
        label="Orden"
        type="number"
        value={
          form.sort_order
        }
        onChange={(value:string)=>
          setForm({
            ...form,
            sort_order:
              Number(value),
          })
        }
      />

      {/* ACTIVO */}

      <SwitchField
        label="Servicio Activo"
        checked={
          form.active
        }
        onChange={(checked:boolean)=>
          setForm({
            ...form,
            active:
              checked,
          })
        }
      />

      <button
        onClick={
          saveService
        }
        disabled={saving}
        style={{
          background:
            "#f97316",
          color:"#fff",
          border:"none",
          padding:
            "18px 40px",
          borderRadius:
            "18px",
          fontWeight:"800",
          cursor:"pointer",
        }}
      >
        {saving
          ? "Guardando..."
          : "💾 Guardar Servicio"}
      </button>
    </div>
  </main>
);
}

function InputField({
  label,
  value,
  onChange,
  type = "text",
}: any) {
  return (
    <div
      style={{
        marginBottom:"25px",
      }}
    >
      <label
        style={{
          display:"block",
          marginBottom:"10px",
          color:"#aaa",
          fontWeight:"600",
        }}
      >
        {label}
      </label>

      <input
        type={type}
        value={value || ""}
        onChange={(e)=>
          onChange(
            e.target.value
          )
        }
        style={{
          width:"100%",
          background:
            "rgba(255,255,255,.04)",
          border:
            "1px solid rgba(255,255,255,.08)",
          color:"#fff",
          padding:"16px",
          borderRadius:"14px",
          outline:"none",
        }}
      />
    </div>
  );
}

function SwitchField({
  label,
  checked,
  onChange,
}: any) {
  return (
    <div
      style={{
        marginBottom:"25px",
      }}
    >
      <label
        style={{
          display:"flex",
          gap:"12px",
          alignItems:"center",
          fontWeight:"600",
        }}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={(e)=>
            onChange(
              e.target.checked
            )
          }
        />

        {label}
      </label>
    </div>
  );
}