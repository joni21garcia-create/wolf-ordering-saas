"use client";

interface Props {
  orderType:
    | "delivery"
    | "pickup"
    | null;

  customerData: any;

  setCustomerData: (
    data: any
  ) => void;

  primaryColor?: string;
}

export default function CustomerForm({
  orderType,
  customerData,
  setCustomerData,
  primaryColor = "#f97316",
}: Props) {

const nameError =
  customerData.name &&
  customerData.name.trim().length < 3;

const phoneError =
  customerData.phone &&
  customerData.phone.replace(
    /\D/g,
    ""
  ).length < 10;

const addressError =
  orderType === "delivery" &&
  customerData.address &&
  customerData.address.trim().length < 5;

const zoneError =
  orderType === "delivery" &&
  customerData.zone &&
  customerData.zone.trim().length < 2;


  if (!orderType) return null;

  return (
    <div
      style={{
        marginTop: "40px",
        padding: "40px",
        borderRadius: "30px",
        background:
          "rgba(255,255,255,.04)",
        backdropFilter:
          "blur(20px)",
        border:
          "1px solid rgba(255,255,255,.08)",
      }}
    >
     <h2
  style={{
    color: "#fff",
    marginBottom: "10px",
  }}
>
  {orderType === "delivery"
    ? "🚚 Datos de Entrega"
    : "🛍️ Datos para Retiro"}
</h2>

<p
  style={{
    color:
      "rgba(255,255,255,.65)",
    marginBottom: "30px",
  }}
>
  {orderType === "delivery"
    ? "Completa la información para que podamos entregar tu pedido."
    : "Completa tus datos para retirar tu pedido en el local."}
</p>

      <div
        style={{
          display: "grid",
          gap: "20px",
        }}
      >
        <input
          placeholder="Nombre completo *"
          value={
            customerData.name || ""
          }
          onChange={(e) =>
            setCustomerData({
              ...customerData,
              name: e.target.value,
            })
          }
          style={{
  ...inputStyle,
  border: nameError
    ? "1px solid #ef4444"
    : inputStyle.border,
}}
        />

{nameError && (
  <span
    style={{
      color: "#ef4444",
      fontSize: "13px",
      marginTop: "-12px",
    }}
  >
    ❌ Ingresa un nombre válido
  </span>
)}


        <input
          placeholder="Teléfono *"
          value={
            customerData.phone || ""
          }
          onChange={(e) =>
            setCustomerData({
              ...customerData,
              phone:
                e.target.value,
            })
          }
          style={{
  ...inputStyle,
  border: phoneError
    ? "1px solid #ef4444"
    : inputStyle.border,
}}
        />
{phoneError && (
  <span
    style={{
      color: "#ef4444",
      fontSize: "13px",
      marginTop: "-12px",
    }}
  >
    ❌ Teléfono inválido
  </span>
)}
        

        <input
  placeholder="Correo electrónico (opcional)"
  value={
    customerData.email || ""
  }
  onChange={(e) =>
    setCustomerData({
      ...customerData,
      email: e.target.value,
    })
  }
  style={inputStyle}
/>

        {orderType ===
          "delivery" && (
          <>
            <input
              placeholder="Dirección *"
              value={
                customerData.address ||
                ""
              }
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  address:
                    e.target.value,
                })
              }
             style={{
  ...inputStyle,
  border: addressError
    ? "1px solid #ef4444"
    : inputStyle.border,
}}
            />

{addressError && (
  <span
    style={{
      color: "#ef4444",
      fontSize: "13px",
      marginTop: "-12px",
    }}
  >
    ❌ Ingresa una dirección válida
  </span>
)}

            <input
              placeholder="Sector *"
              value={
                customerData.zone ||
                ""
              }
              onChange={(e) =>
                setCustomerData({
                  ...customerData,
                  zone:
                    e.target.value,
                })
              }
              style={{
  ...inputStyle,
  border: zoneError
    ? "1px solid #ef4444"
    : inputStyle.border,
}}
            />
{zoneError && (
  <span
    style={{
      color: "#ef4444",
      fontSize: "13px",
      marginTop: "-12px",
    }}
  >
    ❌ Ingresa un sector válido
  </span>
)}


            <textarea
  placeholder="Ej: Casa blanca junto a la farmacia"
  value={
    customerData.reference || ""
  }
  onChange={(e) =>
    setCustomerData({
      ...customerData,
      reference:
        e.target.value,
    })
  }
  style={{
    ...inputStyle,
    minHeight: "100px",
  }}
/>

<textarea
  placeholder="Ej: Tocar timbre, entregar en portería..."
  value={
    customerData.instructions || ""
  }
  onChange={(e) =>
    setCustomerData({
      ...customerData,
      instructions:
        e.target.value,
    })
  }
  style={{
    ...inputStyle,
    minHeight: "100px",
  }}
/>
          </>
        )}
      </div>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "18px",
  borderRadius: "14px",
  border:
    "1px solid rgba(255,255,255,.08)",
  background:
    "rgba(255,255,255,.05)",
  color: "#fff",
  outline: "none",
};