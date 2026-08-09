"use client";

import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase/client";

type QRData = {
  id: string;
  name: string;
  qr_image_url: string;
  account_holder: string | null;
  account_number: string | null;
  active: boolean;
};

export default function EditQRPage() {
  const params = useParams();
  const router = useRouter();

  const restaurantId = params.restaurantId as string;
  const qrId = params.qrId as string;

  const [qr, setQr] = useState<QRData | null>(null);

  const [name, setName] = useState("");
  const [accountHolder, setAccountHolder] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [active, setActive] = useState(true);

  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadQR() {
      if (!restaurantId || !qrId) return;

      setLoading(true);
      setError("");

      const { data, error: fetchError } = await supabase
        .from("restaurant_payment_qrs")
        .select(
          "id,name,qr_image_url,account_holder,account_number,active"
        )
        .eq("id", qrId)
        .eq("restaurant_id", restaurantId)
        .single();

      if (fetchError) {
        console.error(fetchError);
        setError("No se pudo cargar el código QR.");
        setLoading(false);
        return;
      }

      const dataQR = data as QRData;

      setQr(dataQR);
      setName(dataQR.name);
      setAccountHolder(dataQR.account_holder ?? "");
      setAccountNumber(dataQR.account_number ?? "");
      setActive(dataQR.active);
      setPreview(dataQR.qr_image_url);

      setLoading(false);
    }

    loadQR();
  }, [restaurantId, qrId]);

  function handleImageChange(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Selecciona una imagen válida.");
      return;
    }

    setImage(file);
    setError("");

    const url = URL.createObjectURL(file);
    setPreview(url);
  }

  async function uploadImage(file: File) {
    const extension =
      file.name.split(".").pop()?.toLowerCase() || "jpg";

    const fileName =
      `${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const filePath = `payment-qrs/${fileName}`;

    const { error: uploadError } =
      await supabase.storage
        .from("landing-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type,
        });

    if (uploadError) {
      throw uploadError;
    }

    const { data } = supabase.storage
      .from("landing-images")
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Escribe el nombre del QR.");
      return;
    }

    if (!accountHolder.trim()) {
      setError("Escribe el titular de la cuenta.");
      return;
    }

    if (!accountNumber.trim()) {
      setError("Escribe el número de cuenta.");
      return;
    }

    try {
      setSaving(true);

      let qrImageUrl = qr?.qr_image_url ?? "";

      if (image) {
        qrImageUrl = await uploadImage(image);
      }

      const { error: updateError } =
        await supabase
          .from("restaurant_payment_qrs")
          .update({
            name: name.trim(),
            qr_image_url: qrImageUrl,
            account_holder: accountHolder.trim(),
            account_number: accountNumber.trim(),
            active,
          })
          .eq("id", qrId)
          .eq("restaurant_id", restaurantId);

      if (updateError) {
        throw updateError;
      }

      router.push(
        `/admin/restaurant/${restaurantId}/payments`
      );

      router.refresh();
    } catch (err) {
      console.error("Error actualizando QR:", err);

      setError(
        err instanceof Error
          ? err.message
          : "No se pudo actualizar el código QR."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="loading-page">
        <style>{loadingStyles}</style>
        <div className="loader" />
        <span>Cargando QR...</span>
      </main>
    );
  }

  return (
    <main className="qr-page">
      <style>{styles}</style>

      <header className="topbar">
        <button
          type="button"
          className="back"
          onClick={() =>
            router.push(
              `/admin/restaurant/${restaurantId}/payments`
            )
          }
          aria-label="Volver a pagos"
        >
          ‹
        </button>

        <div className="title">
          <small>PAGOS PLUS</small>
          <strong>Editar QR</strong>
        </div>

        <span className="dot" />
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="kicker">
            CÓDIGO QR
          </span>

          <h1>Edita tu QR.</h1>

          <p>
            Actualiza los datos de este método de pago.
          </p>
        </div>

        <div className="hero-icon">
          ▦
        </div>
      </section>

      <form onSubmit={handleSubmit}>
        <section className="card">
          <div className="section-head">
            <span className="icon">
              ▦
            </span>

            <div>
              <strong>Información del QR</strong>

              <small>
                Datos asociados a este método.
              </small>
            </div>
          </div>

          <label className="field">
            <span>Nombre del QR</span>

            <input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Ej. Banco Pichincha"
            />
          </label>

          <label className="field">
            <span>Titular</span>

            <input
              value={accountHolder}
              onChange={(event) =>
                setAccountHolder(event.target.value)
              }
              placeholder="Nombre del titular"
              autoComplete="name"
            />
          </label>

          <label className="field">
            <span>Número de cuenta</span>

            <input
              value={accountNumber}
              onChange={(event) =>
                setAccountNumber(event.target.value)
              }
              placeholder="Número de cuenta"
              inputMode="numeric"
            />
          </label>
        </section>

        <section className="card">
          <div className="section-head">
            <span className="icon">
              ↑
            </span>

            <div>
              <strong>Imagen del QR</strong>

              <small>
                Cambia la imagen cuando sea necesario.
              </small>
            </div>
          </div>

          <label className="upload">
            {preview ? (
              <div className="preview">
                <img
                  src={preview}
                  alt="Código QR"
                />

                <span>
                  Cambiar imagen
                </span>
              </div>
            ) : (
              <div className="upload-empty">
                <div className="upload-icon">
                  ↑
                </div>

                <strong>
                  Seleccionar imagen
                </strong>

                <small>
                  PNG, JPG o JPEG
                </small>
              </div>
            )}

            <input
              type="file"
              accept="image/png,image/jpeg,image/jpg,image/webp"
              onChange={handleImageChange}
            />
          </label>
        </section>

        <section className="card compact">
          <div className="active-row">
            <div>
              <strong>QR activo</strong>

              <small>
                Disponible para recibir pagos.
              </small>
            </div>

            <button
              type="button"
              className={
                active
                  ? "switch on"
                  : "switch"
              }
              aria-pressed={active}
              onClick={() =>
                setActive((value) => !value)
              }
            >
              <span />
            </button>
          </div>
        </section>

        {error ? (
          <div className="error">
            {error}
          </div>
        ) : null}

        <div className="actions">
          <button
            type="button"
            className="cancel"
            disabled={saving}
            onClick={() =>
              router.push(
                `/admin/restaurant/${restaurantId}/payments`
              )
            }
          >
            Cancelar
          </button>

          <button
            type="submit"
            className="save"
            disabled={saving}
          >
            {saving
              ? "Guardando..."
              : "Guardar cambios"}
          </button>
        </div>
      </form>
    </main>
  );
}


const styles = `
.qr-page {
  min-height: 100dvh;
  max-width: 760px;
  margin: auto;
  padding: 14px 13px 34px;
  background: #080808;
  color: #fff;
  box-sizing: border-box;
}

.topbar {
  height: 40px;
  display: flex;
  align-items: center;
  gap: 9px;
}

.back {
  width: 34px;
  height: 34px;
  border: 1px solid #202020;
  border-radius: 10px;
  background: #101010;
  color: #fff;
  font-size: 25px;
  line-height: 1;
  cursor: pointer;
}

.title {
  flex: 1;
}

.title small {
  display: block;
  color: #555;
  font-size: 7px;
  font-weight: 900;
  letter-spacing: 1.4px;
}

.title strong {
  display: block;
  margin-top: 2px;
  font-size: 14px;
}

.dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #22c55e;
  box-shadow:
    0 0 0 4px rgba(34,197,94,.08);
}

.hero {
  min-height: 124px;
  margin: 13px 0 9px;
  padding: 18px;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
  border: 1px solid rgba(249,115,22,.13);
  border-radius: 17px;
  background:
    radial-gradient(
      circle at 90% 20%,
      rgba(249,115,22,.14),
      transparent 38%
    ),
    linear-gradient(
      145deg,
      #17110d,
      #0d0d0d
    );
  box-sizing: border-box;
}

.hero-copy {
  position: relative;
  z-index: 2;
}

.kicker {
  color: #f97316;
  font-size: 8px;
  font-weight: 900;
  letter-spacing: 1.5px;
}

.hero h1 {
  margin: 6px 0 0;
  font-size: 22px;
  line-height: 1.08;
  letter-spacing: -.6px;
}

.hero p {
  max-width: 235px;
  margin: 7px 0 0;
  color: #707070;
  font-size: 10px;
  line-height: 1.4;
}

.hero-icon {
  position: absolute;
  right: 23px;
  width: 48px;
  height: 48px;
  display: grid;
  place-items: center;
  border: 1px solid rgba(249,115,22,.3);
  border-radius: 15px;
  background: #f97316;
  color: #fff;
  font-size: 20px;
  font-weight: 900;
  box-shadow:
    0 12px 35px rgba(249,115,22,.18);
}

.card {
  margin-top: 9px;
  padding: 13px 11px;
  border: 1px solid #1a1a1a;
  border-radius: 14px;
  background: #111;
  box-sizing: border-box;
}

.section-head {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
}

.section-head > .icon {
  width: 36px;
  height: 36px;
  display: grid;
  place-items: center;
  flex: 0 0 36px;
  border-radius: 10px;
  background: rgba(249,115,22,.09);
  color: #f97316;
  font-size: 15px;
}

.section-head strong,
.section-head small {
  display: block;
}

.section-head strong {
  font-size: 12px;
}

.section-head small {
  margin-top: 3px;
  color: #666;
  font-size: 9px;
  line-height: 1.3;
}

.field {
  display: block;
  margin-top: 11px;
}

.field:first-of-type {
  margin-top: 0;
}

.field > span {
  display: block;
  margin-bottom: 5px;
  color: #777;
  font-size: 9px;
  font-weight: 800;
}

.field input {
  width: 100%;
  height: 40px;
  padding: 0 10px;
  border: 1px solid #1b1b1b;
  border-radius: 9px;
  outline: none;
  background: #0d0d0d;
  color: #fff;
  font-size: 11px;
  box-sizing: border-box;
}

.field input:focus {
  border-color: rgba(249,115,22,.45);
}

.field input::placeholder {
  color: #3d3d3d;
}

.upload {
  display: block;
  position: relative;
  overflow: hidden;
  border: 1px dashed rgba(249,115,22,.28);
  border-radius: 12px;
  background: rgba(249,115,22,.025);
  cursor: pointer;
}

.upload input {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
}

.upload-empty {
  min-height: 145px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.upload-icon {
  width: 40px;
  height: 40px;
  display: grid;
  place-items: center;
  margin-bottom: 8px;
  border-radius: 12px;
  background: rgba(249,115,22,.1);
  color: #f97316;
  font-size: 17px;
  font-weight: 900;
}

.upload-empty strong {
  font-size: 10px;
}

.upload-empty small {
  margin-top: 4px;
  color: #555;
  font-size: 8px;
}

.preview {
  min-height: 180px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  padding: 12px;
  box-sizing: border-box;
}

.preview img {
  width: 135px;
  height: 135px;
  object-fit: contain;
  border-radius: 8px;
  background: #fff;
}

.preview span {
  margin-top: 8px;
  color: #f97316;
  font-size: 9px;
  font-weight: 800;
}

.compact {
  padding: 13px 11px;
}

.active-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.active-row strong,
.active-row small {
  display: block;
}

.active-row strong {
  font-size: 11px;
}

.active-row small {
  margin-top: 3px;
  color: #666;
  font-size: 9px;
}

.switch {
  width: 34px;
  height: 20px;
  padding: 2px;
  flex: 0 0 34px;
  border: 0;
  border-radius: 999px;
  background: #292929;
  cursor: pointer;
  box-sizing: border-box;
}

.switch span {
  display: block;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: #fff;
  transition: transform .15s;
}

.switch.on {
  background: #16a34a;
}

.switch.on span {
  transform: translateX(14px);
}

.error {
  margin-top: 9px;
  padding: 10px 11px;
  border: 1px solid rgba(239,68,68,.2);
  border-radius: 10px;
  background: rgba(239,68,68,.06);
  color: #fca5a5;
  font-size: 9px;
  line-height: 1.4;
}

.actions {
  display: grid;
  grid-template-columns: 1fr 1.4fr;
  gap: 7px;
  margin-top: 12px;
}

.cancel,
.save {
  height: 43px;
  border-radius: 10px;
  font-size: 10px;
  font-weight: 900;
  cursor: pointer;
}

.cancel {
  border: 1px solid #1d1d1d;
  background: #111;
  color: #aaa;
}

.save {
  border: 0;
  background: #f97316;
  color: #fff;
}

.cancel:disabled,
.save:disabled {
  opacity: .6;
  cursor: wait;
}

.loading-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  background: #080808;
  color: #555;
  font-size: 9px;
}

.loader {
  width: 22px;
  height: 22px;
  border: 2px solid #222;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 480px) {
  .qr-page {
    padding-left: 12px;
    padding-right: 12px;
  }
}

@media (min-width: 700px) {
  .qr-page {
    padding-top: 25px;
  }

  .hero {
    min-height: 145px;
  }

  .hero h1 {
    font-size: 25px;
  }
}
`;

const loadingStyles = `
.loading-page {
  min-height: 100dvh;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  background: #080808;
  color: #555;
  font-size: 9px;
}

.loader {
  width: 22px;
  height: 22px;
  border: 2px solid #222;
  border-top-color: #f97316;
  border-radius: 50%;
  animation: spin .7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
`;