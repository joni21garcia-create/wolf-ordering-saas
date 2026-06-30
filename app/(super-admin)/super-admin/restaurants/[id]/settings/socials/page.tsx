"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function SocialsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [socials, setSocials] = useState({
    instagram: "",
    facebook: "",
    tiktok: "",
    whatsapp_url: "",
  });

  useEffect(() => {
    loadSocials();
  }, []);

  const loadSocials = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("instagram, facebook, tiktok, whatsapp_url")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) setSocials(data);
    } finally {
      setLoading(false);
    }
  };

  const saveSocials = async () => {
    try {
      setSaving(true);
      const { error } = await supabase
        .from("restaurants")
        .update(socials)
        .eq("id", restaurantId);

      if (error) throw error;
      alert("Redes sociales guardadas correctamente");
    } catch (err) {
      alert("Error al guardar la configuración");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando...</main>;

  return (
    <PermissionGuard permission="socials">
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginTop: "10px" }}>📱 Redes Sociales</h1>
          <p style={{ color: "#999", marginTop: "5px" }}>Configura los enlaces de contacto y perfiles sociales.</p>
        </div>

        <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px", marginBottom: "30px" }}>
          <SocialInput label="Instagram" icon="📸" value={socials.instagram} onChange={(v: string) => setSocials({ ...socials, instagram: v })} />
          <SocialInput label="Facebook" icon="📘" value={socials.facebook} onChange={(v: string) => setSocials({ ...socials, facebook: v })} />
          <SocialInput label="TikTok" icon="🎵" value={socials.tiktok} onChange={(v: string) => setSocials({ ...socials, tiktok: v })} />
          <SocialInput label="WhatsApp" icon="💬" value={socials.whatsapp_url} onChange={(v: string) => setSocials({ ...socials, whatsapp_url: v })} />
        </div>

        <div style={{ background: "rgba(17,17,17,.5)", border: "1px solid rgba(255,255,255,.05)", borderRadius: "24px", padding: "30px", marginBottom: "35px" }}>
          <h2 style={{ fontSize: "18px", marginTop: 0, marginBottom: "20px" }}>Estado de la conexión</h2>
          {Object.entries(socials).map(([key, value]) => (
            <PreviewItem key={key} label={key.replace("_url", "").toUpperCase()} active={!!value} />
          ))}
        </div>

        <button onClick={saveSocials} disabled={saving}
          style={{ width: "100%", background: "#f97316", color: "#fff", border: "none", padding: "18px", borderRadius: "14px", fontWeight: "800", cursor: "pointer" }}
        >
          {saving ? "Guardando..." : "💾 Guardar Redes"}
        </button>
      </main>
    </PermissionGuard>
  );
}

function SocialInput({ label, icon, value, onChange }: any) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "13px", fontWeight: "600" }}>{icon} {label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "12px", borderRadius: "12px", outline: "none" }}
      />
    </div>
  );
}

function PreviewItem({ label, active }: { label: string; active: boolean }) {
  return (
    <p style={{ display: "flex", alignItems: "center", gap: "10px", color: active ? "#22c55e" : "#777", margin: "8px 0" }}>
      {active ? "✅" : "❌"} {label} {active ? "configurado" : "no configurado"}
    </p>
  );
}