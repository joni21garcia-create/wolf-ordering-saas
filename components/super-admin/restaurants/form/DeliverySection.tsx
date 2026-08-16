"use client";

interface Props {
  form: any;
  setForm: React.Dispatch<
    React.SetStateAction<any>
  >;
}

export default function DeliverySection({
  form,
  setForm,
}: Props) {
  return (
    <section
      style={{
        display: "grid",
        gap: 28,
      }}
    >
      <div
        className="delivery-fields-grid"
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2,minmax(0,1fr))",
          gap: 22,
        }}
      >
        <div>
          <label style={label}>
            Costo Delivery
          </label>

          <input
            type="number"
            style={input}
            value={form.delivery_fee}
            onChange={(e) =>
              setForm({
                ...form,
                delivery_fee: Number(
                  e.target.value
                ),
              })
            }
          />
        </div>

        <div>
          <label style={label}>
            Pedido mínimo
          </label>

          <input
            type="number"
            style={input}
            value={form.minimum_order}
            onChange={(e) =>
              setForm({
                ...form,
                minimum_order:
                  Number(
                    e.target.value
                  ),
              })
            }
          />
        </div>

        <div>
          <label style={label}>
            Delivery gratis desde
          </label>

          <input
            type="number"
            style={input}
            value={
              form.free_delivery_from
            }
            onChange={(e) =>
              setForm({
                ...form,
                free_delivery_from:
                  Number(
                    e.target.value
                  ),
              })
            }
          />
        </div>
      </div>

      <div
        className="delivery-switches"
        style={{
          display: "flex",
          gap: 30,
          flexWrap: "wrap",
        }}
      >
        <label style={switchRow}>
          <input
            type="checkbox"
            checked={
              form.delivery_enabled
            }
            onChange={(e) =>
              setForm({
                ...form,
                delivery_enabled:
                  e.target.checked,
              })
            }
          />

          Delivery habilitado
        </label>

        <label style={switchRow}>
          <input
            type="checkbox"
            checked={
              form.pickup_enabled
            }
            onChange={(e) =>
              setForm({
                ...form,
                pickup_enabled:
                  e.target.checked,
              })
            }
          />

          Pickup habilitado
        </label>

        <label style={switchRow}>
          <input
            type="checkbox"
            checked={
              form.accepting_orders
            }
            onChange={(e) =>
              setForm({
                ...form,
                accepting_orders:
                  e.target.checked,
              })
            }
          />

          Aceptando pedidos
        </label>
      </div>
      <style jsx>{`
        @media (max-width: 640px) {
          .delivery-fields-grid {
            grid-template-columns: minmax(0, 1fr) !important;
            gap: 16px !important;
          }

          .delivery-switches {
            flex-direction: column;
            gap: 14px !important;
          }

          .delivery-switches label {
            min-height: 44px;
          }

          input[type="number"] {
            box-sizing: border-box;
            min-width: 0;
          }
        }
      `}</style>
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
} as const;

const switchRow = {
  display: "flex",
  alignItems: "center",
  gap: 10,
  color: "#fff",
  fontWeight: 600,
};
