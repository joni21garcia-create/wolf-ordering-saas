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
        className="branding-copy-grid"
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

      <style jsx>{`
        @media (max-width: 640px) {
          .branding-copy-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
          }

          .branding-copy-grid > div {
            grid-column: auto !important;
            min-width: 0;
          }

          input[type="file"] {
            width: 100%;
            max-width: 100%;
            box-sizing: border-box;
            font-size: 13px;
          }

          img {
            max-width: 100%;
            box-sizing: border-box;
          }
        }
      `}</style>
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