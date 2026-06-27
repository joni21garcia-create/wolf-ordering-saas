"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function AboutSettingsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [form, setForm] =
    useState({
      about_title: "",
      about_description: "",

      show_about: true,

      about_stat1_value: "",
      about_stat1_label: "",
      show_about_stat1: true,

      about_stat2_value: "",
      about_stat2_label: "",
      show_about_stat2: true,

      about_stat3_value: "",
      about_stat3_label: "",
      show_about_stat3: true,
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
              about_title,
              about_description,

              show_about,

              about_stat1_value,
              about_stat1_label,
              show_about_stat1,

              about_stat2_value,
              about_stat2_label,
              show_about_stat2,

              about_stat3_value,
              about_stat3_label,
              show_about_stat3
            `)
            .eq(
              "id",
              restaurantId
            )
            .single();

        if (data) {
          setForm({
            about_title:
              data.about_title ||
              "Nuestra Historia",

            about_description:
              data.about_description ||
              "",

            show_about:
              data.show_about ??
              true,

            about_stat1_value:
              data.about_stat1_value ||
              "5000+",

            about_stat1_label:
              data.about_stat1_label ||
              "Clientes satisfechos",

            show_about_stat1:
              data.show_about_stat1 ??
              true,

            about_stat2_value:
              data.about_stat2_value ||
              "4.9★",

            about_stat2_label:
              data.about_stat2_label ||
              "Calificación promedio",

            show_about_stat2:
              data.show_about_stat2 ??
              true,

            about_stat3_value:
              data.about_stat3_value ||
              "10+",

            about_stat3_label:
              data.about_stat3_label ||
              "Años de experiencia",

            show_about_stat3:
              data.show_about_stat3 ??
              true,
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
            about_title:
              form.about_title,

            about_description:
              form.about_description,

            show_about:
              form.show_about,

            about_stat1_value:
              form.about_stat1_value,

            about_stat1_label:
              form.about_stat1_label,

            show_about_stat1:
              form.show_about_stat1,

            about_stat2_value:
              form.about_stat2_value,

            about_stat2_label:
              form.about_stat2_label,

            show_about_stat2:
              form.show_about_stat2,

            about_stat3_value:
              form.about_stat3_value,

            about_stat3_label:
              form.about_stat3_label,

            show_about_stat3:
              form.show_about_stat3,
          })
          .eq(
            "id",
            restaurantId
          );

        alert(
          "About actualizado"
        );
      } finally {
        setSaving(false);
      }
    };

function InputField({
  label,
  value,
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
          display:"block",
          marginBottom:"10px",
          color:"#aaa",
          fontWeight:"600",
        }}
      >
        {label}
      </label>

      <input
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

function TextareaField({
  label,
  value,
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
          display:"block",
          marginBottom:"10px",
          color:"#aaa",
          fontWeight:"600",
        }}
      >
        {label}
      </label>

      <textarea
        value={value || ""}
        onChange={(e)=>
          onChange(
            e.target.value
          )
        }
        rows={6}
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
          resize:"vertical",
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
        display:"flex",
        alignItems:"center",
        justifyContent:"space-between",
      }}
    >
      <label
        style={{
          color:"#aaa",
          fontWeight:"600",
        }}
      >
        {label}
      </label>

      <input
        type="checkbox"
        checked={checked || false}
        onChange={(e)=>
          onChange(
            e.target.checked
          )
        }
        style={{
          width:"20px",
          height:"20px",
          cursor:"pointer",
        }}
      />
    </div>
  );
}


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
  <PermissionGuard permission="about">
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
          Configuración / About
        </p>

      <h1
        style={{
          fontSize: "52px",
          fontWeight: "800",
          margin: 0,
        }}
      >
        📖 Nuestra Historia
      </h1>

      <p
        style={{
          color: "#999",
          marginTop: "12px",
          maxWidth: "700px",
        }}
      >
        Configura la sección
        Historia del restaurante.
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
      <SwitchField
        label="Mostrar Sección"
        checked={form.show_about}
        onChange={(checked:boolean)=>
          setForm({
            ...form,
            show_about:checked,
          })
        }
      />

      <InputField
        label="Título"
        value={form.about_title}
        onChange={(value:string)=>
          setForm({
            ...form,
            about_title:value,
          })
        }
      />

      <TextareaField
        label="Historia"
        value={
          form.about_description
        }
        onChange={(value:string)=>
          setForm({
            ...form,
            about_description:value,
          })
        }
      />

      <hr
        style={{
          borderColor:
            "rgba(255,255,255,.08)",
          margin:"40px 0",
        }}
      />

      <h2>Tarjeta 1</h2>

      <InputField
        label="Valor"
        value={
          form.about_stat1_value
        }
        onChange={(value:string)=>
          setForm({
            ...form,
            about_stat1_value:value,
          })
        }
      />

      <InputField
        label="Texto"
        value={
          form.about_stat1_label
        }
        onChange={(value:string)=>
          setForm({
            ...form,
            about_stat1_label:value,
          })
        }
      />

      <SwitchField
        label="Mostrar Tarjeta 1"
        checked={
          form.show_about_stat1
        }
        onChange={(checked:boolean)=>
          setForm({
            ...form,
            show_about_stat1:
              checked,
          })
        }
      />

      <hr
        style={{
          borderColor:
            "rgba(255,255,255,.08)",
          margin:"40px 0",
        }}
      />

      <h2>Tarjeta 2</h2>

      <InputField
        label="Valor"
        value={
          form.about_stat2_value
        }
        onChange={(value:string)=>
          setForm({
            ...form,
            about_stat2_value:value,
          })
        }
      />

      <InputField
        label="Texto"
        value={
          form.about_stat2_label
        }
        onChange={(value:string)=>
          setForm({
            ...form,
            about_stat2_label:value,
          })
        }
      />

      <SwitchField
        label="Mostrar Tarjeta 2"
        checked={
          form.show_about_stat2
        }
        onChange={(checked:boolean)=>
          setForm({
            ...form,
            show_about_stat2:
              checked,
          })
        }
      />

      <hr
        style={{
          borderColor:
            "rgba(255,255,255,.08)",
          margin:"40px 0",
        }}
      />

      <h2>Tarjeta 3</h2>

      <InputField
        label="Valor"
        value={
          form.about_stat3_value
        }
        onChange={(value:string)=>
          setForm({
            ...form,
            about_stat3_value:value,
          })
        }
      />

      <InputField
        label="Texto"
        value={
          form.about_stat3_label
        }
        onChange={(value:string)=>
          setForm({
            ...form,
            about_stat3_label:value,
          })
        }
      />

      <SwitchField
        label="Mostrar Tarjeta 3"
        checked={
          form.show_about_stat3
        }
        onChange={(checked:boolean)=>
          setForm({
            ...form,
            show_about_stat3:
              checked,
          })
        }
      />

      <button
        onClick={saveData}
        disabled={saving}
        style={{
          marginTop:"40px",
          background:"#f97316",
          color:"#fff",
          border:"none",
          padding:"18px 40px",
          borderRadius:"18px",
          fontWeight:"800",
          cursor:"pointer",
        }}
      >
        {saving
          ? "Guardando..."
          : "💾 Guardar About"}
      </button>
    </div>
     </main>
  </PermissionGuard>
)
}
