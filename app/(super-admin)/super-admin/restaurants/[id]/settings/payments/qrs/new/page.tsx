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
 
const formData = new FormData();

formData.append("file", file);

const response = await fetch(
  "/api/payment-qrs/upload",
  {
    method: "POST",
    body: formData,
  }
);

const data = await response.json();

if (!response.ok || !data.success) {
  throw new Error(data.error);
}

setForm((prev) => ({
  ...prev,
  qr_image_url: data.url,
}));

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
    <main style={{ maxWidth: "1100px", margin: "0 auto", padding: "clamp(16px, 4vw, 40px) 16px", color: "#fff", background: "#0a0a0a", minHeight: "100vh", fontFamily: "system-ui, -apple-system, sans-serif", boxSizing: "border-box" }}>
      
      {/* ENCABEZADO */}
      <div style={{ marginBottom: "28px" }}>
        <p style={{ color: "#71717a", fontSize: "13px", marginBottom: "6px", fontWeight: "500" }}>
          Configuración / Pagos / QRs / Nuevo
        </p>
        <h1 style={{ fontSize: "clamp(24px, 5vw, 36px)", fontWeight: "800", margin: 0, letterSpacing: "-0.5px" }}>
          Crear Nuevo QR
        </h1>
      </div>

      {/* DISEÑO EN CUADRÍCULA AUTO-ADAPTATIVA CON SCROLL VERTICAL NATURAL */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 340px), 1fr))", gap: "24px" }}>
        
        {/* FORMULARIO */}
        <section style={cardStyle}>
          <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "700", marginTop: 0 }}>Detalles del método</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
            <input placeholder="Nombre (Ej: Banco Pichincha)" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} style={inputStyle} />
            <input placeholder="Titular de la cuenta" value={form.account_holder} onChange={(e) => setForm({...form, account_holder: e.target.value})} style={inputStyle} />
            <input placeholder="Número de cuenta / Teléfono" value={form.account_number} onChange={(e) => setForm({...form, account_number: e.target.value})} style={inputStyle} />
          </div>
          
          {/* SELECCIÓN DE IMAGEN PREMIUM TOTALMENTE RESPONSIVA */}
          <div style={{ marginTop: "24px" }}>
            <label style={{ color: "#a1a1aa", fontSize: "13.5px", fontWeight: "500", display: "block", marginBottom: "10px" }}>
              Imagen del código QR
            </label>
            <label style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "24px 16px",
              background: "#161616",
              border: "2px dashed #262626",
              borderRadius: "14px",
              cursor: "pointer",
              textAlign: "center",
              transition: "border-color 0.2s ease"
            }}>
              <span style={{ fontSize: "24px", marginBottom: "6px" }}>📸</span>
              <span style={{ fontSize: "13px", color: "#e4e4e7", fontWeight: "500" }}>Seleccionar o arrastrar imagen</span>
              <span style={{ fontSize: "11px", color: "#71717a", marginTop: "4px" }}>Formatos permitidos: JPG, PNG</span>
              <input 
                type="file" 
                accept="image/*" 
                onChange={(e) => e.target.files?.[0] && uploadQR(e.target.files[0])} 
                style={{ display: "none" }} 
              />
            </label>
            {uploading && <p style={{ fontSize: "13px", color: "#f97316", marginTop: "10px", fontWeight: "600", margin: "10px 0 0 0" }}>⏳ Subiendo archivo...</p>}
          </div>

          {/* SWITCH ACTIVO/INACTIVO */}
          <div style={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center", 
            padding: "14px", 
            background: "#161616", 
            border: "1px solid #262626", 
            borderRadius: "12px",
            marginTop: "24px"
          }}>
            <span style={{ fontSize: "13.5px", fontWeight: "500", color: "#e4e4e7" }}>QR Activo en el menú</span>
            <div
              onClick={() => setForm({...form, active: !form.active})}
              style={{
                width: "42px",
                height: "22px",
                background: form.active ? "#16a34a" : "#2d2d2d",
                borderRadius: "11px",
                position: "relative",
                cursor: "pointer",
                transition: "background-color 0.2s ease",
                flexShrink: 0
              }}
            >
              <div
                style={{
                  width: "16px",
                  height: "16px",
                  background: "#fff",
                  borderRadius: "50%",
                  position: "absolute",
                  top: "3px",
                  left: form.active ? "23px" : "3px",
                  transition: "left 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
                }}
              />
            </div>
          </div>

          {/* ACCIONES */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", marginTop: "30px" }}>
            <button onClick={saveQR} disabled={saving} style={{ ...buttonPrimary, flex: "1 1 140px" }}>
              {saving ? "Guardando..." : "Guardar QR"}
            </button>
            <button onClick={() => router.back()} style={{ ...buttonSecondary, flex: "1 1 100px" }}>
              Cancelar
            </button>
          </div>
        </section>

        {/* VISTA PREVIA */}
        <section style={{ ...cardStyle, height: "fit-content" }}>
          <h2 style={{ marginBottom: "20px", fontSize: "18px", fontWeight: "700", marginTop: 0 }}>Vista Previa</h2>
          <div style={{ background: "#0a0a0a", padding: "20px", borderRadius: "16px", border: "1px solid #222", textAlign: "center" }}>
            
            <div style={{ maxWidth: "220px", margin: "0 auto", display: "flex", justifyContent: "center", alignItems: "center" }}>
              {form.qr_image_url ? (
                <img src={form.qr_image_url} alt="Preview QR" style={{ width: "100%", height: "auto", borderRadius: "12px", boxShadow: "0 8px 24px rgba(0,0,0,0.4)" }} />
              ) : (
                <div style={{ width: "100%", height: "200px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", color: "#52525b", border: "2px dashed #262626", borderRadius: "12px", background: "#121212" }}>
                  <span style={{ fontSize: "32px", marginBottom: "4px" }}>🖼️</span>
                  <span style={{ fontSize: "13px" }}>Sin imagen seleccionada</span>
                </div>
              )}
            </div>

            <div style={{ textAlign: "left", marginTop: "20px", borderTop: "1px solid #161616", paddingTop: "16px" }}>
              <h3 style={{ marginTop: 0, marginBottom: "8px", fontSize: "16px", fontWeight: "700", color: "#f97316" }}>
                {form.name || "Nombre del método"}
              </h3>
              <p style={{ color: "#a1a1aa", fontSize: "13.5px", margin: "4px 0" }}>
                <strong style={{ color: "#71717a", fontWeight: "500" }}>Titular:</strong> {form.account_holder || "—"}
              </p>
              <p style={{ color: "#a1a1aa", fontSize: "13.5px", margin: "4px 0" }}>
                <strong style={{ color: "#71717a", fontWeight: "500" }}>Detalle:</strong> {form.account_number || "—"}
              </p>
            </div>

          </div>
        </section>
      </div>
    </main>
  );
}

const cardStyle = { 
  background: "#121212", 
  border: "1px solid #222", 
  borderRadius: "20px", 
  padding: "24px",
  boxSizing: "border-box" as const
};

const inputStyle = { 
  width: "100%", 
  padding: "12px 14px", 
  borderRadius: "12px", 
  background: "#161616", 
  border: "1px solid #262626", 
  color: "#fff",
  fontSize: "14px",
  outline: "none",
  boxSizing: "border-box" as const
};

const buttonPrimary = { 
  padding: "14px 24px", 
  borderRadius: "12px", 
  background: "#f97316", 
  color: "#fff", 
  border: "none", 
  cursor: "pointer", 
  fontWeight: "700" as const,
  fontSize: "14.5px",
  boxShadow: "0 4px 14px rgba(249,115,22,0.2)"
};

const buttonSecondary = { 
  padding: "14px 24px", 
  borderRadius: "12px", 
  background: "transparent", 
  color: "#a1a1aa", 
  border: "1px solid #262626", 
  cursor: "pointer",
  fontSize: "14.5px",
  fontWeight: "500" as const
};