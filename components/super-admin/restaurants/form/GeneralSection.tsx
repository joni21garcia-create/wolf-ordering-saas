"use client";

interface Props {
  form: any;
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export default function GeneralSection({
  form,
  setForm,
}: Props) {
  return (
    <section
      style={{
        display: "grid",
        gap: 26,
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
          Información General
        </h2>

        <p
          style={{
            color: "#8b8b8b",
            lineHeight: 1.8,
          }}
        >
          Esta información identifica el
          restaurante dentro de toda la
          plataforma Wolf Ordering.
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2,minmax(0,1fr))",
          gap: 22,
        }}
      >
        {/* Nombre */}

        <div>
          <label style={label}>
            Nombre Restaurante
          </label>

          <input
            style={input}
            placeholder="Restaurante Demo"
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
          />
        </div>

        {/* Slug */}

        <div>
          <label style={label}>
            Slug
          </label>

          <input
            style={input}
            placeholder="restaurante-demo"
            value={form.slug}
            onChange={(e) =>
              setForm({
                ...form,
                slug: e.target.value,
              })
            }
          />
        </div>

        {/* Descripción */}

        <div
          style={{
            gridColumn:
              "1 / span 2",
          }}
        >
          <label style={label}>
            Descripción
          </label>

          <textarea
            style={{
              ...input,
              resize: "vertical",
              minHeight: 140,
            }}
            placeholder="Describe el restaurante..."
            value={
              form.description
            }
            onChange={(e) =>
              setForm({
                ...form,
                description:
                  e.target.value,
              })
            }
          />
        </div>
      </div>
    </section>
  );
}

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
  fontSize: 15,
} as const;