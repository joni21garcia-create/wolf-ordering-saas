"use client";

import { useMemo, useState } from "react";

interface Props {
  initialUrl: string;
  onSave: (url: string) => Promise<void>;
}

const GOOGLE_HOSTS = new Set([
  "google.com",
  "www.google.com",
  "g.page",
  "goo.gl",
  "maps.google.com",
  "maps.app.goo.gl",
  "search.google.com",
]);

function isGoogleUrl(value: string) {
  if (!value.trim()) return false;

  try {
    const url = new URL(value.trim());
    const host = url.hostname.toLowerCase();

    return (
      url.protocol === "https:" &&
      (GOOGLE_HOSTS.has(host) ||
        host.endsWith(".google.com"))
    );
  } catch {
    return false;
  }
}

export default function GoogleReviewsForm({
  initialUrl,
  onSave,
}: Props) {
  const [url, setUrl] = useState(initialUrl);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const valid = useMemo(
    () => isGoogleUrl(url),
    [url]
  );

  async function handleSave() {
    setSaved(false);
    setError("");

    const cleanUrl = url.trim();

    if (cleanUrl && !isGoogleUrl(cleanUrl)) {
      setError(
        "Introduce un enlace HTTPS válido de Google Reviews."
      );
      return;
    }

    try {
      setSaving(true);

      await onSave(cleanUrl);

      setUrl(cleanUrl);
      setSaved(true);
    } catch (error) {
      console.error(error);

      setError(
        "No se pudo guardar el enlace."
      );
    } finally {
      setSaving(false);
    }
  }

  function handleOpen() {
    if (!valid) return;

    window.open(
      url.trim(),
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleCopy() {
    if (!valid) return;

    try {
      await navigator.clipboard.writeText(
        url.trim()
      );

      setSaved(true);
      setError("");
    } catch {
      setError(
        "No se pudo copiar el enlace."
      );
    }
  }

  return (
    <section className="form-card">
      <style jsx>{`
        .form-card {
          width: 100%;
          padding: 18px;
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 18px;
          background: rgba(255,255,255,.025);
          box-sizing: border-box;
        }

        .eyebrow {
          color: #f97316;
          font-size: 9px;
          font-weight: 900;
          letter-spacing: .12em;
          text-transform: uppercase;
        }

        h2 {
          margin: 5px 0 4px;
          color: #fff;
          font-size: 18px;
          line-height: 1.1;
          letter-spacing: -.02em;
        }

        .description {
          margin: 0;
          max-width: 620px;
          color: #777;
          font-size: 11px;
          line-height: 1.5;
        }

        .label {
          display: block;
          margin: 18px 0 7px;
          color: #aaa;
          font-size: 9px;
          font-weight: 800;
        }

        .input-wrap {
          display: flex;
          align-items: center;
          gap: 9px;
          min-height: 46px;
          padding: 0 12px;
          border: 1px solid
            ${url && !valid
              ? "#ef4444"
              : valid
                ? "rgba(34,197,94,.35)"
                : "rgba(255,255,255,.08)"};
          border-radius: 12px;
          background: #101010;
          box-sizing: border-box;
          transition: border-color .18s ease;
        }

        .icon {
          flex: 0 0 auto;
          color: #777;
          font-size: 13px;
        }

        input {
          width: 100%;
          min-width: 0;
          border: 0;
          outline: 0;
          background: transparent;
          color: #fff;
          font-size: 12px;
        }

        input::placeholder {
          color: #555;
        }

        .status {
          min-height: 15px;
          margin-top: 7px;
          font-size: 9px;
          font-weight: 800;
        }

        .valid {
          color: #22c55e;
        }

        .invalid {
          color: #f87171;
        }

        .help {
          margin-top: 12px;
          padding: 12px;
          border: 1px solid rgba(255,255,255,.055);
          border-radius: 12px;
          background: rgba(255,255,255,.018);
          color: #777;
          font-size: 10px;
          line-height: 1.55;
        }

        .help strong {
          color: #aaa;
        }

        .actions {
          display: flex;
          gap: 7px;
          flex-wrap: wrap;
          margin-top: 13px;
        }

        button {
          min-height: 40px;
          padding: 0 13px;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 10px;
          background: rgba(255,255,255,.04);
          color: #fff;
          font-size: 10px;
          font-weight: 800;
          cursor: pointer;
          transition:
            background .18s ease,
            border-color .18s ease,
            opacity .18s ease;
        }

        button:hover:not(:disabled) {
          background: rgba(255,255,255,.08);
        }

        button:disabled {
          opacity: .4;
          cursor: not-allowed;
        }

        .primary {
          border-color: #f97316;
          background: #f97316;
        }

        .primary:hover:not(:disabled) {
          background: #ea580c;
          border-color: #ea580c;
        }

        .success {
          color: #22c55e;
        }

        .error {
          color: #f87171;
        }

        @media (max-width: 520px) {
          .form-card {
            padding: 14px;
            border-radius: 15px;
          }

          .actions {
            display: grid;
            grid-template-columns:
              repeat(2, minmax(0, 1fr));
          }

          button {
            width: 100%;
          }
        }
      `}</style>

      <div className="eyebrow">
        Google Reviews
      </div>

      <h2>
        Enlace directo de reseñas
      </h2>

      <p className="description">
        Los clientes podrán abrir directamente la página
        de reseñas. El mismo enlace se utilizará para generar
        el código QR.
      </p>

      <label className="label">
        URL de Google Reviews
      </label>

      <div className="input-wrap">
        <span className="icon">↗</span>

        <input
          type="url"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setSaved(false);
            setError("");
          }}
          placeholder="https://g.page/r/.../review"
          inputMode="url"
          autoComplete="url"
          aria-label="URL de Google Reviews"
        />
      </div>

      <div
        className={`status ${
          url
            ? valid
              ? "valid"
              : "invalid"
            : ""
        }`}
      >
        {url
          ? valid
            ? "✓ Enlace de Google válido"
            : "El enlace todavía no parece válido"
          : ""}
      </div>

      <div className="help">
        En Google Maps abre la ficha de tu restaurante,
        entra en reseñas y selecciona{" "}
        <strong>“Escribir una reseña”</strong>.
        Copia ese enlace aquí.
      </div>

      <div className="actions">
        <button
          type="button"
          onClick={handleOpen}
          disabled={!valid}
        >
          ↗ Abrir
        </button>

        <button
          type="button"
          onClick={handleCopy}
          disabled={!valid}
        >
          ⧉ Copiar
        </button>

        <button
          type="button"
          className="primary"
          onClick={handleSave}
          disabled={saving}
        >
          {saving
            ? "Guardando..."
            : "Guardar cambios"}
        </button>
      </div>

      {saved && (
        <div className="status success">
          ✓ Guardado correctamente
        </div>
      )}

      {error && (
        <div className="status error">
          {error}
        </div>
      )}
    </section>
  );
}

