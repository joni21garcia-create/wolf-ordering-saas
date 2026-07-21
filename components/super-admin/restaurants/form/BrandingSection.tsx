"use client";

interface Props {
  form: any;

  setForm: React.Dispatch<
    React.SetStateAction<any>
  >;

  uploading: boolean;

  imageUploading: boolean;

  progress: number;

  onUpload: (
    file: File,
    field:
      | "logo_url"
      | "banner_url"
  ) => void;
}

export default function BrandingSection({
  form,
  setForm,
  uploading,
  imageUploading,
  progress,
  onUpload,
}: Props) {
  return (
    <section
      style={{
        display: "grid",
        gap: 32,
      }}
    >
      <div>
        <h2
          style={{
            color: "#fff",
            fontSize: 30,
            fontWeight: 900,
            marginBottom: 8,
          }}
        >
          Branding
        </h2>

        <p
          style={{
            color: "#8b8b8b",
            lineHeight: 1.8,
          }}
        >
          Personaliza la identidad visual
          del restaurante que verán los
          clientes.
        </p>
      </div>

      {/* LOGO */}

      <div style={card}>
        <h3 style={title}>
          Logo
        </h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (file) {
              onUpload(
                file,
                "logo_url"
              );
            }
          }}
        />

        {form.logo_url && (
          <img
            src={form.logo_url}
            alt="Logo"
            style={{
              width: 120,
              height: 120,
              borderRadius: "50%",
              objectFit: "cover",
              marginTop: 20,
            }}
          />
        )}
      </div>

      {/* BANNER */}

      <div style={card}>
        <h3 style={title}>
          Banner Principal
        </h3>

        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file =
              e.target.files?.[0];

            if (file) {
              onUpload(
                file,
                "banner_url"
              );
            }
          }}
        />

        {form.banner_url && (
          <img
            src={form.banner_url}
            alt="Banner"
            style={{
              width: "100%",
              maxWidth: 600,
              height: 220,
              objectFit: "cover",
              borderRadius: 20,
              marginTop: 20,
            }}
          />
        )}
      </div>

      {(uploading ||
        imageUploading) && (
        <div
          style={{
            color: "#f97316",
            fontWeight: 700,
          }}
        >
          Subiendo imagen...
          {" "}
          {progress}%
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2,minmax(0,1fr))",
          gap: 22,
        }}
      >
        <div>
          <label style={label}>
            Hero Title
          </label>

          <input
            style={input}
            value={
              form.hero_title
            }
            onChange={(e) =>
              setForm({
                ...form,
                hero_title:
                  e.target.value,
              })
            }
          />
        </div>

        <div>
          <label style={label}>
            Hero Subtitle
          </label>

          <input
            style={input}
            value={
              form.hero_subtitle
            }
            onChange={(e) =>
              setForm({
                ...form,
                hero_subtitle:
                  e.target.value,
              })
            }
          />
        </div>

        <div
          style={{
            gridColumn:
              "1 / span 2",
          }}
        >
          <label style={label}>
            Texto botón principal
          </label>

          <input
            style={input}
            value={
              form.hero_button_text
            }
            onChange={(e) =>
              setForm({
                ...form,
                hero_button_text:
                  e.target.value,
              })
            }
          />
        </div>
      </div>
    </section>
  );
}

const card = {
  background:
    "#121212",
  padding: 24,
  borderRadius: 20,
  border:
    "1px solid rgba(255,255,255,.08)",
};

const title = {
  color: "#fff",
  marginBottom: 18,
};

const label = {
  display: "block",
  color: "#fff",
  fontWeight: 700,
  marginBottom: 10,
};

const input = {
  width: "100%",
  padding: "15px 18px",
  borderRadius: 14,
  background: "#0f0f0f",
  border:
    "1px solid rgba(255,255,255,.08)",
  color: "#fff",
  outline: "none",
} as const;


