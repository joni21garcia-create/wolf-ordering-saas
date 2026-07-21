"use client";

interface Props {
  form: any;
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export default function LocationSection({
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
          Ubicación
        </h2>

        <p
          style={{
            color: "#8b8b8b",
            lineHeight: 1.8,
          }}
        >
          Define la ubicación física del
          restaurante. Estos datos serán
          utilizados por Delivery,
          Analytics y futuras integraciones
          con mapas.
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
        {/* Dirección */}

        <div
          style={{
            gridColumn:
              "1 / span 2",
          }}
        >
          <label style={label}>
            Dirección
          </label>

          <input
            style={input}
            placeholder="Av. Principal 123..."
            value={form.address}
            onChange={(e) =>
              setForm({
                ...form,
                address:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Latitud */}

        <div>
          <label style={label}>
            Latitud
          </label>

          <input
            style={input}
            placeholder="-0.229850"
            value={form.latitude}
            onChange={(e) =>
              setForm({
                ...form,
                latitude:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Longitud */}

        <div>
          <label style={label}>
            Longitud
          </label>

          <input
            style={input}
            placeholder="-78.524950"
            value={form.longitude}
            onChange={(e) =>
              setForm({
                ...form,
                longitude:
                  e.target.value,
              })
            }
          />
        </div>

        {/* Vista futura */}

        <div
          style={{
            gridColumn:
              "1 / span 2",

            marginTop: 12,

            padding: 24,

            borderRadius: 18,

            border:
              "1px dashed rgba(249,115,22,.35)",

            background:
              "rgba(249,115,22,.05)",

            color: "#9ca3af",

            textAlign: "center",

            lineHeight: 1.8,
          }}
        >
          📍 Aquí se integrará el selector
          visual de Google Maps para
          obtener automáticamente la
          dirección y coordenadas del
          restaurante.
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


