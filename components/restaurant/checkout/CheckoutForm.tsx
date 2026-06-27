"use client";

import { getDeliveryFee } from "@/lib/configuration/delivery";

import {
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import { supabase }
from "@/lib/supabase/client";

export default function CheckoutForm() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);

const [paymentMethod, setPaymentMethod] =
  useState("");

  const [
  paymentConfirmed,
  setPaymentConfirmed,
] = useState(false);

const [cashAmount, setCashAmount] =
  useState("");

const [changeAmount, setChangeAmount] =
  useState(0);

  const [paymentQrs, setPaymentQrs] =
  useState<any[]>([]);

const [selectedQr, setSelectedQr] =
  useState<any>(null);

  const [paymentProof, setPaymentProof] =
  useState<File | null>(null);

  const [customerName, setCustomerName] =
    useState("");

  const [customerPhone, setCustomerPhone] =
    useState("");

const [customerAddress, setCustomerAddress] =
  useState("");

const [customerEmail, setCustomerEmail] =
  useState("");

const [customerZone, setCustomerZone] =
  useState("");

const [customerReference, setCustomerReference] =
  useState("");

const [
  deliveryInstructions,
  setDeliveryInstructions,
] = useState("");

const [notes, setNotes] =
  useState("");

const [products, setProducts] =
  useState<any[]>([]);

  const [restaurant, setRestaurant] =
  useState<any>(null);

  const [
  deliverySettings,
  setDeliverySettings,
] = useState<any>(null);

useEffect(() => {
  const savedCart =
    localStorage.getItem(
      "wolf_cart"
    );

  if (savedCart) {
    setProducts(
      JSON.parse(savedCart)
    );
  }

  const savedCustomer =
    localStorage.getItem(
      "wolf_customer"
    );

    console.log(
  "CUSTOMER:",
  localStorage.getItem(
    "wolf_customer"
  )
);

if (savedCustomer) {
  const customer =
    JSON.parse(savedCustomer);

  setCustomerName(
    customer.name || ""
  );

  setCustomerPhone(
    customer.phone || ""
  );

  setCustomerAddress(
    customer.address || ""
  );

  setCustomerEmail(
    customer.email || ""
  );

  setCustomerZone(
    customer.zone || ""
  );

  setCustomerReference(
    customer.reference || ""
  );

  setDeliveryInstructions(
    customer.instructions || ""
  );
}
}, []);

const loadRestaurant =
  async () => {
    const restaurantId =
      localStorage.getItem(
        "restaurant_id"
      );

    if (!restaurantId)
      return;

    const {
      data,
      error,
    } = await supabase
      .from("restaurants")
      .select("*")
      .eq(
        "id",
        restaurantId
      )
      .single();

  if (!error) {
  setRestaurant(
    data
  );

  const {
  data: deliveryData,
} = await supabase
  .from(
    "restaurant_delivery_settings"
  )
  .select("*")
  .eq(
    "restaurant_id",
    restaurantId
  )
  .single();

setDeliverySettings(
  deliveryData
);

  const {
    data: qrs,
  } = await supabase
    .from(
      "restaurant_payment_qrs"
    )
    .select("*")
    .eq(
      "restaurant_id",
      restaurantId
    )
    .eq(
      "active",
      true
    )
    .order(
      "sort_order"
    );

console.log(
  "Restaurant ID QR:",
  restaurantId
);

console.log(
  "QRs cargados:",
  qrs
);

  setPaymentQrs(
    qrs || []
  );
}
  };

useEffect(() => {
  loadRestaurant();
}, []);


const subtotal = products.reduce(
  (acc, item) =>
    acc +
    (
      item.display_price ||
      item.price
    ) *
      item.quantity,
  0
);

const orderType =
  typeof window !== "undefined"
    ? localStorage.getItem(
        "wolf_order_type"
      )
    : null;

const deliveryFee =
  orderType === "delivery"
    ? getDeliveryFee(
        subtotal,

        Number(
          deliverySettings?.delivery_fee || 0
        ),

        deliverySettings
          ?.free_delivery_enabled
          ? Number(
              deliverySettings.free_delivery_minimum
            )
          : 999999999
      )
    : 0;

const total =
  subtotal + deliveryFee;

  const handleSubmit = async () => {
  if (!acceptedTerms) {
    alert(
      "Debes aceptar los términos y condiciones"
    );
    return;
  }

if (!paymentMethod) {
  alert(
    "Selecciona un método de pago"
  );
  return;
}

  if (
    !customerName ||
    !customerPhone
  ) {
    alert(
      "Completa los campos obligatorios"
    );
    return;
  }

  if (products.length === 0) {
    alert(
      "No hay productos en el carrito"
    );
    return;
  }

  try {
    setLoading(true);


    let paymentProofUrl = null;

if (paymentProof) {
  const fileName =
    `${Date.now()}-${paymentProof.name}`;

  const { error: uploadError } =
    await supabase.storage
      .from("payment-proofs")
      .upload(
        fileName,
        paymentProof
      );

  if (uploadError) {
    throw uploadError;
  }

  const { data } =
    supabase.storage
      .from("payment-proofs")
      .getPublicUrl(
        fileName
      );

  paymentProofUrl =
    data.publicUrl;
}

console.log(
  "restaurant_id enviado:",
  localStorage.getItem("restaurant_id")
);

   const response =
  await fetch(
    "/api/orders/create",
    {
      method: "POST",

      headers: {
        "Content-Type":
          "application/json",
      },

      body: JSON.stringify({
        restaurant_id:
          localStorage.getItem(
            "restaurant_id"
          ),

        customer_name:
  customerName,

customer_phone:
  customerPhone,

customer_email:
  customerEmail || null,

delivery_address:
  customerAddress,

delivery_sector:
  customerZone || null,

notes:
  customerReference || null,

delivery_instructions:
  deliveryInstructions || null,

payment_method:
  paymentMethod,

          cash_amount:
  cashAmount
    ? Number(cashAmount)
    : null,

    change_amount:
  cashAmount
    ? Number(cashAmount) - total
    : null,

payment_confirmed:
  paymentConfirmed,

selected_qr_id:
  selectedQr?.id || null,

  payment_proof_url:
  paymentProofUrl,

selected_qr_name:
  selectedQr?.name || null,

        order_type:
          orderType || "pickup",

        subtotal,

        delivery_fee:
          deliveryFee,

        total,

        commission_amount: 0,

        restaurant_amount:
          subtotal,

        wolf_amount: 0,

        terms_accepted:
          acceptedTerms,

        items: products.map(
  (item) => ({
    product_id:
      item.id,

    quantity:
      item.quantity,

    price:
      item.display_price ||
      item.price,
  })
),
      }),
    }
  );

  
const data =
  await response.json();

console.log(
  "API RESPONSE:",
  data
);

if (!response.ok) {
  alert(
    JSON.stringify(data)
  );

  throw new Error(
    data.error ||
    "Error desconocido"
  );
}

const restaurantSlug =
  localStorage.getItem(
    "restaurant_slug"
  );

router.push(
  `/${restaurantSlug}/success?order=${data.orderId}`
);

  } catch (error) {
    console.error(error);

    alert(
      "Error al crear el pedido"
    );
  } finally {
    setLoading(false);
  }
};

  return (
    <div
      className="glass-card wolf-shadow"
      style={{
        padding: "40px",
        borderRadius: "28px",
      }}
    >
      <h1
        className="wolf-title"
        style={{
          fontSize: "48px",
          fontWeight: 700,
          marginBottom: "40px",
        }}
      >
        Finalizar Pedido
      </h1>

      {/* RESUMEN */}

      <div
        style={{
          marginBottom: "40px",
          padding: "25px",
          borderRadius: "18px",
          background:
            "rgba(255,255,255,.03)",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          Resumen del Pedido
        </h3>

        {products.map(
          (product, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent:
                  "space-between",
                marginBottom: "12px",
                color:
                  "rgba(255,255,255,.8)",
              }}
            >
            $
{(
  (
    product.display_price ||
    product.price
  ) *
  product.quantity
).toFixed(2)}


              <span>
                $
                {(
                  product.price *
                  product.quantity
                ).toFixed(2)}
              </span>
            </div>
          )
        )}

        <hr
          style={{
            margin: "20px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "10px",
            color:
              "rgba(255,255,255,.7)",
          }}
        >
          <span>Subtotal</span>

          <span>
            ${subtotal.toFixed(2)}
          </span>
        </div>

{orderType === "delivery" && (
  <div
    style={{
      display: "flex",
      justifyContent:
        "space-between",
      marginBottom: "10px",
      color:
        "rgba(255,255,255,.7)",
    }}
  >
    <span>Delivery</span>

    <span>
      ${deliveryFee.toFixed(2)}
    </span>
  </div>
)}

        <hr
          style={{
            margin: "15px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            color: "#fff",
            fontWeight: 700,
            fontSize: "22px",
          }}
        >
          <span>Total</span>

          <span>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* CLIENTE */}

      <input
        placeholder="Nombre completo"
        className="wolf-input"
        value={customerName}
        onChange={(e) =>
          setCustomerName(
            e.target.value
          )
        }
      />

      <input
        placeholder="Teléfono"
        className="wolf-input"
        value={customerPhone}
        onChange={(e) =>
          setCustomerPhone(
            e.target.value
          )
        }
      />


      <input
        placeholder="Dirección"
        className="wolf-input"
        value={customerAddress}
        onChange={(e) =>
          setCustomerAddress(
            e.target.value
          )
        }
      />

<input
  placeholder="Sector"
  className="wolf-input"
  value={customerZone}
  onChange={(e) =>
    setCustomerZone(
      e.target.value
    )
  }
/>

   <textarea
  placeholder="Referencia"
  className="wolf-input"
  rows={3}
  value={customerReference}
  onChange={(e) =>
    setCustomerReference(
      e.target.value
    )
  }
/>

<textarea
  placeholder="Instrucciones para entrega"
  className="wolf-input"
  rows={3}
  value={
    deliveryInstructions
  }
  onChange={(e) =>
    setDeliveryInstructions(
      e.target.value
    )
  }
/>

     {/* MÉTODO DE PAGO */}

<div
  style={{
    marginTop: "30px",
  }}
>
  <h3
    style={{
      color: "#fff",
      marginBottom: "15px",
    }}
  >
    Método de Pago *
  </h3>

  {!restaurant && (
    <p
      style={{
        color:
          "rgba(255,255,255,.6)",
      }}
    >
      Cargando métodos...
    </p>
  )}

  {restaurant?.accepts_cash && (
    <label
      style={{
        color: "#fff",
        display: "block",
        marginBottom:
          "10px",
      }}
    >
      <input
        type="radio"
        value="cash"
        checked={
          paymentMethod ===
          "cash"
        }
        onChange={(e) =>
          setPaymentMethod(
            e.target.value
          )
        }
      />
      {" "}Efectivo
    </label>
  )}

  {restaurant?.accepts_transfer && (
    <label
      style={{
        color: "#fff",
        display: "block",
        marginBottom:
          "10px",
      }}
    >
      <input
        type="radio"
        value="transfer"
        checked={
          paymentMethod ===
          "transfer"
        }
        onChange={(e) =>
          setPaymentMethod(
            e.target.value
          )
        }
      />
      {" "}Transferencia Bancaria
    </label>
  )}

  {restaurant?.accepts_qr && (
    <label
      style={{
        color: "#fff",
        display: "block",
        marginBottom:
          "10px",
      }}
    >
      <input
        type="radio"
        value="qr"
        checked={
          paymentMethod ===
          "qr"
        }
        onChange={(e) =>
          setPaymentMethod(
            e.target.value
          )
        }
      />
      {" "}Pago por QR
    </label>
  )}

  {restaurant?.accepts_delivery_payment && (
    <label
      style={{
        color: "#fff",
        display: "block",
      }}
    >
      <input
        type="radio"
        value="delivery"
        checked={
          paymentMethod ===
          "delivery"
        }
        onChange={(e) =>
          setPaymentMethod(
            e.target.value
          )
        }
      />
      {" "}Pago contra entrega
    </label>
  )}
</div>

{paymentMethod === "transfer" && (
  <div
    style={{
      marginTop: "25px",
      padding: "20px",
      borderRadius: "16px",
      background: "rgba(255,255,255,.04)",
      border:
        "1px solid rgba(255,255,255,.08)",
      color: "#fff",
    }}
  >
    <h3
      style={{
        marginBottom: "20px",
      }}
    >
      Datos Bancarios
    </h3>

    <p>
      <strong>Banco:</strong>{" "}
      {restaurant?.bank_name}
    </p>

    <p>
      <strong>Titular:</strong>{" "}
      {restaurant?.account_holder}
    </p>

    <p>
      <strong>Cuenta:</strong>{" "}
      {restaurant?.account_number}
    </p>

    <label
      style={{
        display: "block",
        marginTop: "20px",
      }}
    >
      <input
        type="checkbox"
        checked={paymentConfirmed}
        onChange={(e) =>
          setPaymentConfirmed(
            e.target.checked
          )
        }
      />

      {" "}
      Confirmo que realizaré la transferencia bancaria
    </label>

    <div
      style={{
        marginTop: "20px",
      }}
    >
      <label>
        Subir comprobante:
      </label>

      <input
        type="file"
        accept="image/*,.pdf"
        onChange={(e) =>
          setPaymentProof(
            e.target.files?.[0] || null
          )
        }
        style={{
          display: "block",
          marginTop: "10px",
          color: "#fff",
        }}
      />
    </div>
  </div>
)}

{paymentMethod === "qr" && (
  <div
    style={{
      marginTop: "25px",
      padding: "20px",
      borderRadius: "16px",
      background:
        "rgba(255,255,255,.04)",
      border:
        "1px solid rgba(255,255,255,.08)",
      color: "#fff",
    }}
  >
    <h3
      style={{
        marginBottom: "20px",
      }}
    >
      Selecciona un QR
    </h3>

    <div
      style={{
        display: "grid",
        gap: "12px",
      }}
    >
      {paymentQrs.map(
        (qr: any) => (
          <button
            key={qr.id}
            type="button"
            onClick={() =>
              setSelectedQr(qr)
            }
            style={{
              background:
                selectedQr?.id === qr.id
                  ? "#f97316"
                  : "rgba(255,255,255,.04)",

              color: "#fff",

              border:
                selectedQr?.id === qr.id
                  ? "1px solid #f97316"
                  : "1px solid rgba(255,255,255,.08)",

              borderRadius: "14px",

              padding: "14px",

              cursor: "pointer",

              textAlign: "left",
            }}
          >
            {qr.name}
          </button>
        )
      )}
    </div>

    {selectedQr && (
      <div
        style={{
          marginTop: "25px",
          padding: "20px",
          borderRadius: "18px",
          background:
            "rgba(255,255,255,.03)",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: "15px",
          }}
        >
          {selectedQr.name}
        </h3>

        <img
          src={selectedQr.qr_image_url}
          alt={selectedQr.name}
          style={{
            width: "100%",
            maxWidth: "280px",
            borderRadius: "16px",
            display: "block",
            margin: "0 auto",
          }}
        />

        {selectedQr.account_holder && (
          <p
            style={{
              color: "#fff",
              marginTop: "20px",
            }}
          >
            <strong>
              Titular:
            </strong>{" "}
            {
              selectedQr.account_holder
            }
          </p>
        )}

        {selectedQr.account_number && (
          <p
            style={{
              color: "#fff",
            }}
          >
            <strong>
              Cuenta:
            </strong>{" "}
            {
              selectedQr.account_number
            }
          </p>
        )}

<label
  style={{
    display: "block",
    marginTop: "20px",
    color: "#fff",
  }}
>
  <input
    type="checkbox"
    checked={paymentConfirmed}
    onChange={(e) =>
      setPaymentConfirmed(
        e.target.checked
      )
    }
  />

  {" "}
  Confirmo que realicé el pago mediante QR
</label>

<div
  style={{
    marginTop: "20px",
  }}
>
  <label>
    Subir comprobante:
  </label>

  <input
    type="file"
    accept="image/*,.pdf"
    onChange={(e) =>
      setPaymentProof(
        e.target.files?.[0] || null
      )
    }
    style={{
      display: "block",
      marginTop: "10px",
      color: "#fff",
    }}
  />
</div>

      </div>
    )}
  </div>
)}

{(paymentMethod === "cash" ||
  paymentMethod === "delivery") && (
  <div
    style={{
      marginTop: "25px",
      padding: "20px",
      borderRadius: "16px",
      background:
        "rgba(255,255,255,.04)",
      border:
        "1px solid rgba(255,255,255,.08)",
      color: "#fff",
    }}
  >
    <h3>
      Cambio para el pago
    </h3>

    <p
      style={{
        color:
          "rgba(255,255,255,.7)",
      }}
    >
      ¿Con cuánto vas a pagar?
    </p>

    <input
      type="number"
      min="0"
      step="0.01"
      value={cashAmount}
      onChange={(e) => {
        const value =
          e.target.value;

        setCashAmount(value);

        setChangeAmount(
          Number(value) -
            total
        );
      }}
      placeholder="Ej: 20"
      className="wolf-input"
    />

    {cashAmount && (
      <div
        style={{
          marginTop: "15px",
        }}
      >
        <strong>
          Cambio requerido:
        </strong>{" "}
        $
        {Math.max(
          changeAmount,
          0
        ).toFixed(2)}
      </div>
    )}
  </div>
)}

      {/* TÉRMINOS */}

      <div
        style={{
          marginTop: "30px",
          color: "#fff",
        }}
      >
        <label>
          <input
            type="checkbox"
            checked={
              acceptedTerms
            }
            onChange={(e) =>
              setAcceptedTerms(
                e.target.checked
              )
            }
          />

          {" "}Acepto los{" "}

          <a
            href="https://www.wolfordering.com/terminos-y-condiciones"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#f97316",
            }}
          >
            términos y condiciones
          </a>

          {" "}y la{" "}

          <a
            href="https://www.wolfordering.com/politica-de-privacidad"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              color: "#f97316",
            }}
          >
            política de privacidad
          </a>
        </label>
      </div>

      {/* BOTÓN */}

      <button
        onClick={handleSubmit}
        disabled={
          !acceptedTerms ||
          loading
        }
        className="wolf-button"
        style={{
          width: "100%",
          marginTop: "30px",
          opacity:
            !acceptedTerms ||
            loading
              ? 0.5
              : 1,
        }}
      >
        {loading
          ? "Procesando..."
          : "Confirmar Pedido"}
      </button>
    </div>
  );
}