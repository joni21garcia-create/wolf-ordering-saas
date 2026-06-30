"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function CTASettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    show_cta: true,
    cta_title: "¿Listo para ordenar?",
    cta_description: "Haz tu pedido ahora mismo y recibe la mejor experiencia gastronómica directamente en tu hogar.",
    cta_button_text: "Ordenar Ahora 🚀",
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("show_cta, cta_title, cta_description, cta_button_text")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setForm({
          show_cta: data.show_cta ?? true,
          cta_title: data.cta_title || "¿Listo para ordenar?",
          cta_description: data.cta_description || "Haz tu pedido ahora mismo y recibe la mejor experiencia gastronómica directamente en tu hogar.",
          cta_button_text: data.cta_button_text || "Ordenar Ahora 🚀",
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
          show_cta: form.show_cta,
          cta_title: form.cta_title,
          cta_description: form.cta_description,
          cta_button_text: form.cta_button_text,
        })
        .eq("id", restaurantId);

      alert("CTA actualizado");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <main style={{ padding: "40px", color: "#fff" }}>Cargando...</main>;
  }

  return (
    <PermissionGuard permission="cta">
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "36px", fontWeight: "800", marginTop: "10px" }}>🚀 Configuración CTA</h1>
          <p style={{ color: "#999", marginTop: "10px" }}>Personaliza el llamado a la acción para tus clientes.</p>
        </div>

        <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
          
          <div style={{ marginBottom: "30px" }}>
            <label style={{ display: "flex", gap: "12px", alignItems: "center", cursor: "pointer", fontWeight: "600" }}>
              <input type="checkbox" checked={form.show_cta} onChange={(e) => setForm({ ...form, show_cta: e.target.checked })} style={{ width: "18px", height: "18px" }} />
              Mostrar sección CTA
            </label>
          </div>

          <InputField label="Título" value={form.cta_title} onChange={(v: string) => setForm({ ...form, cta_title: v })} />
          <TextAreaField label="Descripción" value={form.cta_description} onChange={(v: string) => setForm({ ...form, cta_description: v })} />
          <InputField label="Texto del Botón" value={form.cta_button_text} onChange={(v: string) => setForm({ ...form, cta_button_text: v })} />

          <button onClick={saveData} disabled={saving}
            style={{ width: "100%", background: "#f97316", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "800", cursor: "pointer" }}
          >
            {saving ? "Guardando..." : "💾 Guardar cambios"}
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
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", padding: "14px", borderRadius: "12px", outline: "none" }}
      />
    </div>
  );
}

function TextAreaField({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: "20px" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "14px", fontWeight: "600" }}>{label}</label>
      <textarea rows={4} value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "rgba(255,255,255,.04)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", padding: "14px", borderRadius: "12px", outline: "none", resize: "vertical" }}
      />
    </div>
  );
}