"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

export default function NewPaymentQRPage() {
  const router = useRouter();
  const params = useParams();

  const restaurantId =
    params.id as string;

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [form, setForm] =
    useState({
      name: "",
      qr_image_url: "",
      account_holder: "",
      account_number: "",
      active: true,
    });

  const uploadQR =
    async (
      file: File
    ) => {
      try {
        setUploading(true);

        const ext =
          file.name
            .split(".")
            .pop();

        const fileName =
          `${Date.now()}.${ext}`;

        const filePath =
          `payment-qrs/${fileName}`;

        const { error } =
          await supabase.storage
            .from(
              "landing-images"
            )
            .upload(
              filePath,
              file
            );

        if (error)
          throw error;

        const {
          data,
        } = supabase.storage
          .from(
            "landing-images"
          )
          .getPublicUrl(
            filePath
          );

        setForm({
          ...form,
          qr_image_url:
            data.publicUrl,
        });
      } catch (error) {
        console.error(error);

        alert(
          "Error subiendo QR"
        );
      } finally {
        setUploading(false);
      }
    };

  const saveQR =
    async () => {
      if (
        !form.name.trim()
      ) {
        alert(
          "Ingresa un nombre"
        );
        return;
      }

      if (
        !form.qr_image_url
      ) {
        alert(
          "Debes subir una imagen QR"
        );
        return;
      }

      try {
        setSaving(true);

        const {
          data: existing,
        } = await supabase
          .from(
            "restaurant_payment_qrs"
          )
          .select("id")
          .eq(
            "restaurant_id",
            restaurantId
          );

        const sortOrder =
          (existing?.length ||
            0) + 1;

        const { error } =
          await supabase
            .from(
              "restaurant_payment_qrs"
            )
            .insert({
              restaurant_id:
                restaurantId,

              name:
                form.name,

              qr_image_url:
                form.qr_image_url,

              account_holder:
                form.account_holder,

              account_number:
                form.account_number,

              active:
                form.active,

              sort_order:
                sortOrder,
            });

        if (error)
          throw error;

        router.push(
          `/super-admin/restaurants/${restaurantId}/settings/payments/qrs`
        );
      } catch (error) {
        console.error(error);

        alert(
          "Error guardando QR"
        );
      } finally {
        setSaving(false);
      }
    };

  return (
    <main
      style={{
        maxWidth: "1400px",
        margin: "0 auto",
        padding: "40px",
        color: "#fff",
      }}
    >
      <div
        style={{
          marginBottom: "35px",
        }}
      >
        <p
          style={{
            color: "#888",
            marginBottom:
              "10px",
          }}
        >
          Configuración /
          Pagos / QRs /
          Nuevo
        </p>

        <h1
          style={{
            fontSize: "52px",
            fontWeight:
              "800",
            margin: 0,
          }}
        >
          Nuevo QR
        </h1>

        <p
          style={{
            color: "#888",
            marginTop: "10px",
          }}
        >
          Agrega un nuevo
          método de pago QR.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "1fr 420px",
          gap: "30px",
        }}
      >
        {/* FORM */}

        <section
          style={card}
        >
          <h2>
            Información
          </h2>

          <input
            placeholder="Nombre (Ej: Banco Pichincha)"
            value={
              form.name
            }
            onChange={(e) =>
              setForm({
                ...form,
                name:
                  e.target.value,
              })
            }
            style={input}
          />

          <input
            placeholder="Titular"
            value={
              form.account_holder
            }
            onChange={(e) =>
              setForm({
                ...form,
                account_holder:
                  e.target.value,
              })
            }
            style={input}
          />

          <input
            placeholder="Cuenta / Teléfono"
            value={
              form.account_number
            }
            onChange={(e) =>
              setForm({
                ...form,
                account_number:
                  e.target.value,
              })
            }
            style={input}
          />

          <div
            style={{
              marginTop: "20px",
            }}
          >
            <label>
              Imagen QR
            </label>

            <input
              type="file"
              accept="image/*"
              onChange={(
                e
              ) => {
                const file =
                  e.target
                    .files?.[0];

                if (
                  file
                ) {
                  uploadQR(
                    file
                  );
                }
              }}
              style={{
                marginTop:
                  "10px",
                color:
                  "#fff",
              }}
            />
          </div>

          <label
            style={{
              display:
                "flex",
              alignItems:
                "center",
              gap: "12px",
              marginTop:
                "25px",
            }}
          >
            <input
              type="checkbox"
              checked={
                form.active
              }
              onChange={(
                e
              ) =>
                setForm({
                  ...form,
                  active:
                    e.target
                      .checked,
                })
              }
            />

            QR Activo
          </label>

          <div
            style={{
              display:
                "flex",
              gap: "15px",
              marginTop:
                "35px",
            }}
          >
            <button
              onClick={
                saveQR
              }
              disabled={
                saving
              }
              style={
                saveBtn
              }
            >
              {saving
                ? "Guardando..."
                : "Guardar QR"}
            </button>

            <button
              onClick={() =>
                router.back()
              }
              style={
                cancelBtn
              }
            >
              Cancelar
            </button>
          </div>
        </section>

        {/* PREVIEW */}

        <section
          style={card}
        >
          <h2>
            Vista Previa
          </h2>

          <div
            style={{
              background:
                "rgba(255,255,255,.03)",
              border:
                "1px solid rgba(255,255,255,.08)",
              borderRadius:
                "20px",
              padding:
                "25px",
            }}
          >
            {form.qr_image_url ? (
              <img
                src={
                  form.qr_image_url
                }
                alt="QR"
                style={{
                  width:
                    "100%",
                  borderRadius:
                    "16px",
                  marginBottom:
                    "20px",
                }}
              />
            ) : (
              <div
                style={{
                  height:
                    "260px",
                  border:
                    "2px dashed rgba(255,255,255,.12)",
                  borderRadius:
                    "16px",
                  display:
                    "flex",
                  alignItems:
                    "center",
                  justifyContent:
                    "center",
                  color:
                    "#666",
                }}
              >
                QR Preview
              </div>
            )}

            <h3>
              {form.name ||
                "Nombre QR"}
            </h3>

            <p>
              Titular:
              {" "}
              {form.account_holder ||
                "-"}
            </p>

            <p>
              Cuenta:
              {" "}
              {form.account_number ||
                "-"}
            </p>

            <div
              style={{
                marginTop:
                  "15px",
              }}
            >
              <span
                style={{
                  background:
                    form.active
                      ? "#22c55e20"
                      : "#ef444420",

                  color:
                    form.active
                      ? "#22c55e"
                      : "#ef4444",

                  padding:
                    "6px 12px",

                  borderRadius:
                    "999px",

                  fontSize:
                    "12px",

                  fontWeight:
                    "700",
                }}
              >
                {form.active
                  ? "ACTIVO"
                  : "OCULTO"}
              </span>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

const card = {
  background:
    "rgba(17,17,17,.95)",
  border:
    "1px solid rgba(255,255,255,.08)",
  borderRadius: "24px",
  padding: "30px",
};

const input = {
  width: "100%",
  marginTop: "12px",
  marginBottom: "15px",
  background:
    "rgba(255,255,255,.04)",
  border:
    "1px solid rgba(255,255,255,.08)",
  color: "#fff",
  padding: "14px",
  borderRadius: "12px",
};

const saveBtn = {
  background:
    "#f97316",
  border: "none",
  color: "#fff",
  padding:
    "16px 28px",
  borderRadius:
    "14px",
  cursor:
    "pointer",
  fontWeight:
    "700",
};

const cancelBtn = {
  background:
    "transparent",
  border:
    "1px solid rgba(255,255,255,.12)",
  color: "#fff",
  padding:
    "16px 28px",
  borderRadius:
    "14px",
  cursor:
    "pointer",
};