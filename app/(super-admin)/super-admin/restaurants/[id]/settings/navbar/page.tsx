"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";
import { useImageUpload } from "@/hooks/useImageUpload";

export default function NavbarSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const { upload, uploading, progress } = useImageUpload();

  const [form, setForm] = useState({
    logo_url: "",
    name: "",
    navbar_button_text: "Ordenar Ahora",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("logo_url, name, navbar_button_text")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setForm({
          logo_url: data.logo_url || "",
          name: data.name || "",
          navbar_button_text: data.navbar_button_text || "Ordenar Ahora",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const saveData = async () => {
    try {
      setSaving(true);
      await supabase
        .from("restaurants")
        .update({
          logo_url: form.logo_url,
          name: form.name,
          navbar_button_text: form.navbar_button_text,
        })
        .eq("id", restaurantId);
      alert("Navbar actualizado");
    } finally {
      setSaving(false);
    }
  };

  const uploadLogo = async (file: File) => {
    try {
      const result = await upload({ file, restaurantId, preset: "logo" });
      if (!result.success) throw new Error(result.error);
      setForm((prev) => ({ ...prev, logo_url: result.url! }));
    } catch (err) {
      console.error(err);
      alert("Error subiendo imagen");
    }
  };

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando...</main>;

  return (
    <PermissionGuard permission="navbar">
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "36px", fontWeight: "800", marginTop: "10px" }}>🧭 Navbar</h1>
          <p style={{ color: "#999" }}>Configura la identidad del restaurante en el menú superior.</p>
        </div>

        <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
          {/* LOGO UPLOAD */}
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "block", marginBottom: "12px", color: "#aaa", fontWeight: "600" }}>Logo Restaurante</label>
            <div style={{ display: "flex", alignItems: "center", gap: "20px", flexWrap: "wrap" }}>
              {form.logo_url && (
                <img src={form.logo_url} alt="logo" style={{ width: "80px", height: "80px", borderRadius: "50%", objectFit: "cover", border: "2px solid #f97316" }} />
              )}
              <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadLogo(e.target.files[0])} />
            </div>
            {uploading && <p style={{ color: "#f97316", fontSize: "14px", marginTop: "8px" }}>Subiendo... {progress}%</p>}
          </div>

          <InputField label="Nombre Restaurante" value={form.name} onChange={(v: string) => setForm({ ...form, name: v })} />
          <InputField label="Texto Botón" value={form.navbar_button_text} onChange={(v: string) => setForm({ ...form, navbar_button_text: v })} />

          <button onClick={saveData} disabled={saving} 
            style={{ width: "100%", background: "#f97316", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "700", cursor: "pointer" }}>
            {saving ? "Guardando..." : "💾 Guardar Navbar"}
          </button>
        </div>
      </main>
    </PermissionGuard>
  );
}

function InputField({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "14px", fontWeight: "600" }}>{label}</label>
      <input value={value || ""} onChange={(e) => onChange(e.target.value)} 
        style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", padding: "14px", borderRadius: "12px", outline: "none" }} />
    </div>
  );
}
