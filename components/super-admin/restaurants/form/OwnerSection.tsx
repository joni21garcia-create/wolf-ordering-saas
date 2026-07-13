"use client";

interface Props {
  form: any;
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export default function OwnerSection({
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
          Propietario
        </h2>

        <p
          style={{
            color: "#8b8b8b",
            lineHeight: 1.8,
          }}
        >
          Esta persona será el
          responsable administrativo del
          restaurante y quien firmará el
          Agreement.
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
            Nombre del propietario
          </label>

          <input
            style={input}
            placeholder="Juan Pérez"
            value={form.owner_name}
            onChange={(e) =>
              setForm({
                ...form,
                owner_name:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Email */}

        <div>
          <label style={label}>
            Email principal
          </label>

          <input
            type="email"
            style={input}
            placeholder="correo@empresa.com"
            value={form.owner_email}
            onChange={(e) =>
              setForm({
                ...form,
                owner_email:
                  e.target.value,
              })
            }
          />
        </div>

        {/* WhatsApp */}

        <div
          style={{
            gridColumn:
              "1 / span 2",
          }}
        >
          <label style={label}>
            WhatsApp
          </label>

          <input
            style={input}
            placeholder="+593..."
            value={form.whatsapp}
            onChange={(e) =>
              setForm({
                ...form,
                whatsapp:
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