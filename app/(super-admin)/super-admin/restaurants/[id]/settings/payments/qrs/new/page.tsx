"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function NewPaymentQRPage() {
  const router = useRouter();
  const params = useParams();
  const restaurantId = params.id as string;

  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    qr_image_url: "",
    account_holder: "",
    account_number: "",
    active: true,
  });

  const uploadQR = async (file: File) => {
    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `payment-qrs/${fileName}`;

      const { error } = await supabase.storage
        .from("landing-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("landing-images")
        .getPublicUrl(filePath);

      setForm((prev) => ({ ...prev, qr_image_url: data.publicUrl }));
    } catch (error) {
      console.error(error);
      alert("Error subiendo imagen");
    } finally {
      setUploading(false);
    }
  };

  const saveQR = async () => {
    if (!form.name.trim() || !form.qr_image_url) return alert("Completa los campos obligatorios");

    try {
      setSaving(true);
      const { data: existing } = await supabase
        .from("restaurant_payment_qrs")
        .select("id")
        .eq("restaurant_id", restaurantId);

      const { error } = await supabase.from("restaurant_payment_qrs").insert({
        restaurant_id: restaurantId,
        ...form,
        sort_order: (existing?.length || 0) + 1,
      });

      if (error) throw error;
      router.push(`/super-admin/restaurants/${restaurantId}/settings/payments/qrs`);
    } catch (error) {
      console.error(error);
      alert("Error guardando el QR");
    } finally {
      setSaving(false);
    }
  };

  return (
    <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "40px", color: "#fff" }}>
      <div style={{ marginBottom: "30px" }}>
        <p style={{ color: "#888", marginBottom: "8px" }}>Configuración / Pagos / QRs / Nuevo</p>
        <h1 style={{ fontSize: "48px", fontWeight: "900", margin: 0 }}>Crear Nuevo QR</h1>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 400px", gap: "30px" }}>
        {/* Formulario */}
        <section style={cardStyle}>
          <h2 style={{ marginBottom: "20px" }}>Detalles del método</h2>
          
          <input placeholder="Nombre (Ej: Banco Pichincha)" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={inputStyle} />
          <input placeholder="Titular" value={form.account_holder} onChange={(e) => setForm({...form, account_holder: e.target.value})} style={inputStyle} />
          <input placeholder="Número de cuenta / Teléfono" value={form.account_number} onChange={(e) => setForm({...form, account_number: e.target.value})} style={inputStyle} />
          
          <div style={{ marginTop: "20px" }}>
            <label style={{ color: "#888", fontSize: "14px" }}>Imagen del código QR</label>
            <input type="file" accept="image/*" onChange={(e) => e.target.files?.[0] && uploadQR(e.target.files[0])} style={{ display: "block", marginTop: "10px" }} />
            {uploading && <p style={{ fontSize: "12px", color: "#f97316" }}>Subiendo...</p>}
          </div>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", marginTop: "20px" }}>
            <input type="checkbox" checked={form.active} onChange={(e) => setForm({...form, active: e.target.checked})} />
            QR Activo en el menú
          </label>

          <div style={{ display: "flex", gap: "15px", marginTop: "30px" }}>
            <button onClick={saveQR} disabled={saving} style={buttonPrimary}>{saving ? "Guardando..." : "Guardar QR"}</button>
            <button onClick={() => router.back()} style={buttonSecondary}>Cancelar</button>
          </div>
        </section>

        {/* Vista Previa */}
        <section style={cardStyle}>
          <h2>Vista Previa</h2>
          <div style={{ background: "#000", padding: "20px", borderRadius: "16px", border: "1px solid rgba(255,255,255,.1)" }}>
            {form.qr_image_url ? (
              <img src={form.qr_image_url} alt="Preview" style={{ width: "100%", borderRadius: "12px" }} />
            ) : (
              <div style={{ height: "200px", display: "flex", alignItems: "center", justifyContent: "center", color: "#444", border: "1px dashed #333" }}>Sin imagen</div>
            )}
            <h3 style={{ marginTop: "15px" }}>{form.name || "Nombre del método"}</h3>
            <p style={{ color: "#888", fontSize: "14px" }}>Titular: {form.account_holder || "-"}</p>
            <p style={{ color: "#888", fontSize: "14px" }}>Cuenta: {form.account_number || "-"}</p>
          </div>
        </section>
      </div>
    </main>
  );
}

// Estilos consistentes
const cardStyle = { background: "#111", border: "1px solid rgba(255,255,255,.08)", borderRadius: "24px", padding: "30px" };
const inputStyle = { width: "100%", padding: "14px", borderRadius: "12px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.08)", color: "#fff", marginBottom: "15px" };
const buttonPrimary = { padding: "14px 24px", borderRadius: "12px", background: "#f97316", color: "#fff", border: "none", cursor: "pointer", fontWeight: "bold" };
const buttonSecondary = { padding: "14px 24px", borderRadius: "12px", background: "transparent", color: "#fff", border: "1px solid rgba(255,255,255,.1)", cursor: "pointer" };