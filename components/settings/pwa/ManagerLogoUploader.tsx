"use client";

import { useRef } from "react";
import { useManagerLogoUpload } from "@/hooks/useManagerLogoUpload";

interface Props {
  value: string | null;
  version?: string;
  onChange: (url: string) => void;
}

export default function ManagerLogoUploader({
  value,
  version,
  onChange,
}: Props) {

  const inputRef =
    useRef<HTMLInputElement>(null);

const {
  uploading,
  progress,
  uploadLogo,
} = useManagerLogoUpload();

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
      }}
    >
      {value ? (
        <>
<img
src={`${value}?t=${Date.now()}`}
            alt="Logo"
            style={{
              width: 130,
              height: 130,
              objectFit: "cover",
              borderRadius: 24,
              display: "block",
              margin: "0 auto",
            }}
          />

          <p
            style={{
              color: "#22c55e",
              marginTop: 16,
            }}
          >
            Logo cargado correctamente
          </p>
        </>
      ) : (
       <>
  <div
    style={{
      fontSize: 60,
      marginBottom: 12,
    }}
  >
    📱
  </div>

  <h3
    style={{
      color: "#fff",
      margin: 0,
    }}
  >
    Subir logo
  </h3>

  <p
    style={{
      color: "#9ca3af",
      marginTop: 10,
    }}
  >
    Haz clic para seleccionar una imagen
  </p>

  <p
    style={{
      color: "#71717a",
      fontSize: 13,
      marginTop: 6,
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
            background: "#27272a",
            borderRadius: 999,
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