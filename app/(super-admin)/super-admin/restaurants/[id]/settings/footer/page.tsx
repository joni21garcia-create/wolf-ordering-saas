"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function FooterSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
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

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("footer_text, slogan, whatsapp_number, address, show_footer_socials, show_footer_copyright, show_wolf_branding, show_instagram, show_facebook, show_tiktok")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setForm({
          footer_text: data.footer_text || "",
          slogan: data.slogan || "",
          whatsapp_number: data.whatsapp_number || "",
          address: data.address || "",
          show_footer_socials: data.show_footer_socials ?? true,
          show_footer_copyright: data.show_footer_copyright ?? true,
          show_wolf_branding: data.show_wolf_branding ?? true,
          show_instagram: data.show_instagram ?? true,
          show_facebook: data.show_facebook ?? true,
          show_tiktok: data.show_tiktok ?? true,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      setSaving(true);
      await supabase.from("restaurants").update(form).eq("id", restaurantId);
      alert("Footer actualizado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando...</main>;

  return (
    <PermissionGuard permission="footer">
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginTop: "10px" }}>📖 Footer</h1>
          <p style={{ color: "#999", marginTop: "5px" }}>Gestiona la información y enlaces de la sección inferior.</p>
        </div>

        <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
          
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: "20px" }}>
            <InputField label="Slogan / Descripción" value={form.slogan} onChange={(v: string) => setForm({ ...form, slogan: v })} />
            <InputField label="WhatsApp" value={form.whatsapp_number} onChange={(v: string) => setForm({ ...form, whatsapp_number: v })} />
            <InputField label="Dirección" value={form.address} onChange={(v: string) => setForm({ ...form, address: v })} />
            <InputField label="Texto Copyright" value={form.footer_text} onChange={(v: string) => setForm({ ...form, footer_text: v })} />
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,.08)", margin: "30px 0" }} />

          <h3 style={{ marginBottom: "20px" }}>Redes Sociales</h3>
          <SwitchField label="Mostrar sección de redes" checked={form.show_footer_socials} onChange={(v) => setForm({ ...form, show_footer_socials: v })} />
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "10px", marginBottom: "20px" }}>
            <SwitchField label="Instagram" checked={form.show_instagram} onChange={(v) => setForm({ ...form, show_instagram: v })} />
            <SwitchField label="Facebook" checked={form.show_facebook} onChange={(v) => setForm({ ...form, show_facebook: v })} />
            <SwitchField label="TikTok" checked={form.show_tiktok} onChange={(v) => setForm({ ...form, show_tiktok: v })} />
          </div>

          <hr style={{ borderColor: "rgba(255,255,255,.08)", margin: "30px 0" }} />

          <h3 style={{ marginBottom: "20px" }}>Preferencias de Branding</h3>
          <SwitchField label="Mostrar Copyright" checked={form.show_footer_copyright} onChange={(v) => setForm({ ...form, show_footer_copyright: v })} />
          <SwitchField label="Mostrar Wolf Branding" checked={form.show_wolf_branding} onChange={(v) => setForm({ ...form, show_wolf_branding: v })} />

          <button onClick={saveData} disabled={saving}
            style={{ width: "100%", marginTop: "30px", background: "#f97316", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "800", cursor: "pointer" }}
          >
            {saving ? "Guardando..." : "💾 Guardar Footer"}
          </button>
        </div>
      </main>
    </PermissionGuard>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: "10px" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "13px", fontWeight: "600" }}>{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "12px", borderRadius: "12px", outline: "none" }}
      />
    </div>
  );
}

function SwitchField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (checked: boolean) => void }) {
  return (
    <div style={{ display: "flex", gap: "12px", alignItems: "center", padding: "5px 0" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ width: "18px", height: "18px", cursor: "pointer" }} />
      <span style={{ fontSize: "14px", color: "#eee" }}>{label}</span>
    </div>
  );
}