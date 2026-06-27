"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CTASettingsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      show_cta: true,

      cta_title:
        "¿Listo para ordenar?",

      cta_description:
        "Haz tu pedido ahora mismo y recibe la mejor experiencia gastronómica directamente en tu hogar.",

      cta_button_text:
        "Ordenar Ahora 🚀",
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
              show_cta,
              cta_title,
              cta_description,
              cta_button_text
            `)
            .eq(
              "id",
              restaurantId
            )
            .single();

        if (data) {
          setForm({
            show_cta:
              data.show_cta ??
              true,

            cta_title:
              data.cta_title ||
              "¿Listo para ordenar?",

            cta_description:
              data.cta_description ||
              "Haz tu pedido ahora mismo y recibe la mejor experiencia gastronómica directamente en tu hogar.",

            cta_button_text:
              data.cta_button_text ||
              "Ordenar Ahora 🚀",
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
            show_cta:
              form.show_cta,

            cta_title:
              form.cta_title,

            cta_description:
              form.cta_description,

            cta_button_text:
              form.cta_button_text,
          })
          .eq(
            "id",
            restaurantId
          );

        alert(
          "CTA actualizado"
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
        Cargando...
      </main>
    );
  }
return (
  <PermissionGuard
    permission="cta"
  >
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

            <BackToSettings
  restaurantId={restaurantId}
/>
          Configuración / CTA
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          🚀 Call To Action
        </h1>

        <p
          style={{
            color: "#999",
            marginTop: "12px",
            maxWidth: "700px",
          }}
        >
          Configura la sección final
          que invita al cliente a
          realizar un pedido.
        </p>
      </div>

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
        <div
          style={{
            marginBottom: "25px",
          }}
        >
          <label
            style={{
              display: "flex",
              gap: "10px",
              alignItems: "center",
              fontWeight: "700",
            }}
          >
            <input
              type="checkbox"
              checked={
                form.show_cta
              }
              onChange={(e) =>
                setForm({
                  ...form,
                  show_cta:
                    e.target.checked,
                })
              }
            />

            Mostrar CTA
          </label>
        </div>

        <InputField
          label="Título CTA"
          value={
            form.cta_title
          }
          onChange={(
            value: string
          ) =>
            setForm({
              ...form,
              cta_title:
                value,
            })
          }
        />

        <TextAreaField
          label="Descripción CTA"
          value={
            form.cta_description
          }
          onChange={(
            value: string
          ) =>
            setForm({
              ...form,
              cta_description:
                value,
            })
          }
        />

        <InputField
          label="Texto Botón"
          value={
            form.cta_button_text
          }
          onChange={(
            value: string
          ) =>
            setForm({
              ...form,
              cta_button_text:
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
            : "💾 Guardar CTA"}
        </button>
      </div>
     </main>
  </PermissionGuard>
)
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

function TextAreaField({
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

      <textarea
        rows={5}
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
          resize: "vertical",
        }}
      />
    </div>
  );
}