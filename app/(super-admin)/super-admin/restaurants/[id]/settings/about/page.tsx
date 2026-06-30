"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";
import BackToSettings from "@/components/admin/BackToSettings";
import PermissionGuard from "@/components/auth/PermissionGuard";

export default function AboutSettingsPage() {
  const params = useParams();
  const restaurantId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
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

  const loadData = async () => {
    try {
      const { data } = await supabase
        .from("restaurants")
        .select("about_title, about_description, show_about, about_stat1_value, about_stat1_label, show_about_stat1, about_stat2_value, about_stat2_label, show_about_stat2, about_stat3_value, about_stat3_label, show_about_stat3")
        .eq("id", restaurantId)
        .maybeSingle();

      if (data) {
        setForm({
          about_title: data.about_title || "Nuestra Historia",
          about_description: data.about_description || "",
          show_about: data.show_about ?? true,
          about_stat1_value: data.about_stat1_value || "5000+",
          about_stat1_label: data.about_stat1_label || "Clientes satisfechos",
          show_about_stat1: data.show_about_stat1 ?? true,
          about_stat2_value: data.about_stat2_value || "4.9★",
          about_stat2_label: data.about_stat2_label || "Calificación promedio",
          show_about_stat2: data.show_about_stat2 ?? true,
          about_stat3_value: data.about_stat3_value || "10+",
          about_stat3_label: data.about_stat3_label || "Años de experiencia",
          show_about_stat3: data.show_about_stat3 ?? true,
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
      alert("Configuración actualizada correctamente");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <main style={{ padding: "40px", color: "#fff" }}>Cargando...</main>;

  return (
    <PermissionGuard permission="about">
      <main style={{ maxWidth: "800px", margin: "0 auto", padding: "40px 20px", color: "#fff" }}>
        <div style={{ marginBottom: "30px" }}>
          <BackToSettings restaurantId={restaurantId} />
          <h1 style={{ fontSize: "32px", fontWeight: "800", marginTop: "10px" }}>📖 Nuestra Historia</h1>
          <p style={{ color: "#999", marginTop: "5px" }}>Configura la información y estadísticas de tu restaurante.</p>
        </div>

        <div style={{ background: "rgba(17,17,17,.95)", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" }}>
          <SwitchField label="Mostrar sección completa" checked={form.show_about} onChange={(v: boolean) => setForm({ ...form, show_about: v })} />
          
          <InputField label="Título" value={form.about_title} onChange={(v: string) => setForm({ ...form, about_title: v })} />
          <TextareaField label="Historia" value={form.about_description} onChange={(v: string) => setForm({ ...form, about_description: v })} />

          {[1, 2, 3].map((num) => (
            <div key={num} style={{ marginTop: "30px", padding: "20px", background: "rgba(255,255,255,.03)", borderRadius: "16px" }}>
              <h3 style={{ marginTop: 0, marginBottom: "15px", fontSize: "18px" }}>Tarjeta {num}</h3>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px" }}>
                <InputField label="Valor" value={form[`about_stat${num}_value` as keyof typeof form]} onChange={(v: string) => setForm({ ...form, [`about_stat${num}_value`]: v })} />
                <InputField label="Etiqueta" value={form[`about_stat${num}_label` as keyof typeof form]} onChange={(v: string) => setForm({ ...form, [`about_stat${num}_label`]: v })} />
              </div>
              <SwitchField label={`Mostrar tarjeta ${num}`} checked={form[`show_about_stat${num}` as keyof typeof form]} onChange={(v: boolean) => setForm({ ...form, [`show_about_stat${num}`]: v })} />
            </div>
          ))}

          <button onClick={saveData} disabled={saving}
            style={{ width: "100%", marginTop: "30px", background: "#f97316", color: "#fff", border: "none", padding: "16px", borderRadius: "14px", fontWeight: "800", cursor: "pointer" }}
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
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "13px", fontWeight: "600" }}>{label}</label>
      <input type="text" value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "12px", borderRadius: "12px", outline: "none" }}
      />
    </div>
  );
}

function TextareaField({ label, value, onChange }: any) {
  return (
    <div style={{ marginBottom: "15px" }}>
      <label style={{ display: "block", marginBottom: "8px", color: "#aaa", fontSize: "13px", fontWeight: "600" }}>{label}</label>
      <textarea rows={4} value={value || ""} onChange={(e) => onChange(e.target.value)}
        style={{ width: "100%", background: "rgba(255,255,255,.05)", border: "1px solid rgba(255,255,255,.1)", color: "#fff", padding: "12px", borderRadius: "12px", outline: "none", resize: "vertical" }}
      />
    </div>
  );
}

function SwitchField({ label, checked, onChange }: any) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0" }}>
      <span style={{ color: "#eee", fontWeight: "600" }}>{label}</span>
      <input type="checkbox" checked={checked || false} onChange={(e) => onChange(e.target.checked)}
        style={{ width: "20px", height: "20px", cursor: "pointer" }}
      />
    </div>
  );
}