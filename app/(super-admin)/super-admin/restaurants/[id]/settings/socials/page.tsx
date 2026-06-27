"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function SocialsPage() {
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [socials, setSocials] =
    useState<any>({
      instagram: "",
      facebook: "",
      tiktok: "",
      whatsapp_url: "",
    });

  useEffect(() => {
    loadSocials();
  }, []);

  const loadSocials =
    async () => {
      const { data } =
        await supabase
          .from("restaurants")
          .select(`
            instagram,
            facebook,
            tiktok,
            whatsapp_url
          `)
          .eq("id", restaurantId)
          .single();

      if (data) {
        setSocials(data);
      }

      setLoading(false);
    };

  const saveSocials =
    async () => {
      try {
        setSaving(true);

        const { error } =
          await supabase
            .from("restaurants")
            .update({
              instagram:
                socials.instagram,

              facebook:
                socials.facebook,

              tiktok:
                socials.tiktok,

    
              whatsapp_url:
                socials.whatsapp_url,
            })
            .eq(
              "id",
              restaurantId
            );

        if (error) {
          console.error(error);

          alert(
            "Error guardando configuración"
          );

          return;
        }

        alert(
          "Redes sociales guardadas"
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
  <div
    style={{
      maxWidth: "1200px",
      margin: "0 auto",
      padding: "40px",
      color: "#fff",
    }}
  >
    <PermissionGuard permission="socials">
      {/* HEADER */}

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
          Configuración /
          Redes Sociales
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight: "800",
            margin: 0,
          }}
        >
          📱 Redes Sociales
        </h1>

        <p
          style={{
            color: "#999",
            marginTop: "12px",
            maxWidth: "700px",
            lineHeight: 1.7,
          }}
        >
          Configura las redes que se
          mostrarán en la landing,
          footer y contacto.
        </p>
      </div>

      {/* FORM */}

      <div
        style={{
          background:
            "rgba(17,17,17,.95)",
          border:
            "1px solid rgba(255,255,255,.08)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "30px",
        }}
      >
        <SocialInput
          label="Instagram"
          icon="📸"
          value={
            socials.instagram
          }
          onChange={(
            value: string
          ) =>
            setSocials({
              ...socials,
              instagram:
                value,
            })
          }
        />

        <SocialInput
          label="Facebook"
          icon="📘"
          value={
            socials.facebook
          }
          onChange={(
            value: string
          ) =>
            setSocials({
              ...socials,
              facebook:
                value,
            })
          }
        />

        <SocialInput
          label="TikTok"
          icon="🎵"
          value={
            socials.tiktok
          }
          onChange={(
            value: string
          ) =>
            setSocials({
              ...socials,
              tiktok:
                value,
            })
          }
        />

    

        <SocialInput
          label="WhatsApp"
          icon="💬"
          value={
            socials.whatsapp_url
          }
          onChange={(
            value: string
          ) =>
            setSocials({
              ...socials,
              whatsapp_url:
                value,
            })
          }
        />
      </div>

      {/* PREVIEW */}

      <div
        style={{
          background:
            "linear-gradient(135deg,#111,#181818)",
          border:
            "1px solid rgba(249,115,22,.15)",
          borderRadius: "28px",
          padding: "30px",
          marginBottom: "35px",
        }}
      >
        <h2
          style={{
            marginTop: 0,
          }}
        >
          Vista previa
        </h2>

        <PreviewItem
          label="Instagram"
          active={
            !!socials.instagram
          }
        />

        <PreviewItem
          label="Facebook"
          active={
            !!socials.facebook
          }
        />

        <PreviewItem
          label="TikTok"
          active={
            !!socials.tiktok
          }
        />


        <PreviewItem
          label="WhatsApp"
          active={
            !!socials.whatsapp_url
          }
        />
      </div>

      {/* BOTÓN */}

      <button
        onClick={
          saveSocials
        }
        disabled={saving}
        style={{
          background:
            "#f97316",
          color: "#fff",
          border: "none",
          padding:
            "18px 40px",
          borderRadius: "18px",
          fontWeight: "800",
          fontSize: "16px",
          cursor: "pointer",
          boxShadow:
            "0 20px 50px rgba(249,115,22,.35)",
        }}
      >
        {saving
          ? "Guardando..."
          : "💾 Guardar Redes"}
      </button>
    </PermissionGuard>
  </div>
)
}

function SocialInput({
  label,
  icon,
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
        {icon} {label}
      </label>

      <input
        type="text"
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

function PreviewItem({
  label,
  active,
}: any) {
  return (
    <p
      style={{
        color: active
          ? "#22c55e"
          : "#777",
      }}
    >
      {active
        ? "✅"
        : "❌"}{" "}
      {label}
    </p>
  );
}