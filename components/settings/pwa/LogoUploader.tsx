"use client";

import { useRef } from "react";
import { useLogoUpload } from "@/hooks/useLogoUpload";

interface Props {
  restaurantId: string;
  value: string | null;
  onChange: (url: string) => void;
}

export default function LogoUploader({
  restaurantId,
  value,
  onChange,
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const {
    uploading,
    progress,
    uploadLogo,
  } = useLogoUpload(restaurantId);

  async function handleFile(file: File) {
    const result = await uploadLogo(file);

    if (
  result.success &&
  result.logo?.url
) {
  onChange(result.logo.url);
} else {
  alert(
    result.error ??
    "No fue posible subir el logo."
  );
}

}
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 20,
      }}
    >
     
      <div
        onClick={() => inputRef.current?.click()}
        style={{
          border: "2px dashed #3f3f46",
          borderRadius: 18,
          padding: 35,
          cursor: "pointer",
          background: "#18181b",
          textAlign: "center",
          transition: ".25s",
        }}
      >
        {value ? (
          <>
            <img
              src={value}
              alt="Logo"
              style={{
                width: 130,
                height: 130,
                borderRadius: 28,
                objectFit: "cover",
                display: "block",
                margin: "0 auto",
                border: "2px solid #27272a",
              }}
            />

            <p
              style={{
                color: "#22c55e",
                marginTop: 18,
                fontWeight: 700,
              }}
            >
              Logo cargado correctamente
            </p>

            <p
              style={{
                color: "#9ca3af",
                fontSize: 14,
              }}
            >
              Haz clic para cambiar la imagen.
            </p>
          </>
        ) : (
          <>
            <div
              style={{
                fontSize: 60,
              }}
            >
              📱
            </div>

            <h3
              style={{
                color: "#fff",
              }}
            >
              Subir logo
            </h3>

            <p
              style={{
                color: "#9ca3af",
              }}
            >
              PNG · JPG · WEBP
            </p>
          </>
        )}

        <input
          ref={inputRef}
          hidden
          type="file"
          accept="image/png,image/jpeg,image/jpg,image/webp"
          onChange={async (e) => {
            const file = e.target.files?.[0];

            if (file) {
              await handleFile(file);
            }
          }}
        />
      </div>

      {uploading && (
        <div>
          <div
            style={{
              color: "#fff",
              marginBottom: 10,
            }}
          >
            Subiendo... {progress}%
          </div>

          <div
            style={{
              height: 10,
              borderRadius: 999,
              background: "#27272a",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                width: `${progress}%`,
                height: "100%",
                background: "#f97316",
                transition: ".25s",
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
