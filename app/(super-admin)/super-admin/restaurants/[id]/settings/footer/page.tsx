"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function FooterSettingsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

 const [form, setForm] =
  useState({
    footer_text: "",
    slogan: "",
    whatsapp_number: "",
    address: "",

    show_footer_socials: true,
    show_footer_copyright: true,
    show_wolf_branding: true,

    show_instagram: true,
    show_facebook: true,
    show_tiktok: true,
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
  footer_text,
  slogan,
  whatsapp_number,
  address,

  show_footer_socials,
  show_footer_copyright,
  show_wolf_branding,

  show_instagram,
  show_facebook,
  show_tiktok,
  show_youtube
`)
            .eq(
              "id",
              restaurantId
            )
            .single();

        if (data) {
          setForm({
  footer_text:
    data.footer_text || "",

  slogan:
    data.slogan || "",

  whatsapp_number:
    data.whatsapp_number || "",

  address:
    data.address || "",

  show_footer_socials:
    data.show_footer_socials ?? true,

  show_footer_copyright:
    data.show_footer_copyright ?? true,

  show_wolf_branding:
    data.show_wolf_branding ?? true,

  show_instagram:
    data.show_instagram ?? true,

  show_facebook:
    data.show_facebook ?? true,

  show_tiktok:
    data.show_tiktok ?? true,

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
            footer_text:
              form.footer_text,

            slogan:
              form.slogan,

            whatsapp_number:
              form.whatsapp_number,

            address:
              form.address,

            show_footer_socials:
              form.show_footer_socials,

            show_footer_copyright:
              form.show_footer_copyright,

            show_wolf_branding:
              form.show_wolf_branding,

            show_instagram:
              form.show_instagram,

            show_facebook:
              form.show_facebook,

            show_tiktok:
             form.show_tiktok,

          })
          .eq(
            "id",
            restaurantId
          );

        alert(
          "Footer actualizado"
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
    <PermissionGuard permission="footer">
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
          Configuración / Footer
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          📖 Footer
        </h1>

        <p
          style={{
            color: "#999",
            marginTop: "12px",
            maxWidth: "700px",
          }}
        >
          Configura la información
          que aparece al final
          de la página.
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
        <InputField
          label="Descripción Restaurante"
          value={form.slogan}
          onChange={(value:string)=>
            setForm({
              ...form,
              slogan:value,
            })
          }
        />

        <InputField
          label="WhatsApp"
          value={
            form.whatsapp_number
          }
          onChange={(value:string)=>
            setForm({
              ...form,
              whatsapp_number:value,
            })
          }
        />

        <InputField
          label="Dirección"
          value={form.address}
          onChange={(value:string)=>
            setForm({
              ...form,
              address:value,
            })
          }
        />

        <InputField
  label="Texto Copyright"
  value={
    form.footer_text
  }
  onChange={(value: string) =>
    setForm({
      ...form,
      footer_text: value,
    })
  }
/>


        <SwitchField
          label="Mostrar Redes Sociales"
          checked={
            form.show_footer_socials
          }
onChange={(checked: boolean) =>
  setForm({
    ...form,
    show_footer_socials:
      checked,
  })
}
        />

<h3
  style={{
    color:"#fff",
    marginTop:"25px",
    marginBottom:"15px",
  }}
>
  Redes individuales
</h3>

<SwitchField
  label="Instagram"
  checked={
    form.show_instagram
  }
  onChange={(checked:boolean)=>
    setForm({
      ...form,
      show_instagram:checked,
    })
  }
/>

<SwitchField
  label="Facebook"
  checked={
    form.show_facebook
  }
  onChange={(checked:boolean)=>
    setForm({
      ...form,
      show_facebook:checked,
    })
  }
/>

<SwitchField
  label="TikTok"
  checked={
    form.show_tiktok
  }
  onChange={(checked:boolean)=>
    setForm({
      ...form,
      show_tiktok:checked,
    })
  }
/>


        <SwitchField
          label="Mostrar Copyright"
          checked={
            form.show_footer_copyright
          }
onChange={(checked: boolean) =>
  setForm({
    ...form,
    show_footer_copyright:
      checked,
  })
}
        />

        <SwitchField
          label="Mostrar Wolf Branding"
          checked={
            form.show_wolf_branding
          }
          onChange={(checked: boolean) =>
            setForm({
              ...form,
              show_wolf_branding:
                checked,
            })
          }
        />

        <button
          onClick={saveData}
          disabled={saving}
          style={{
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
            : "💾 Guardar Footer"}
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

function SwitchField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (
    checked: boolean
  ) => void;
}) {
  return (
    <div
      style={{
        marginBottom:"20px",
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