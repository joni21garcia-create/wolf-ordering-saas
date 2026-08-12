"use client";

import { getDeliveryFee } from "@/lib/configuration/delivery";
import {
  getCommissionAmount,
  getRestaurantAmount,
  getCommissionConfig,
  getOrderTotal,
} from "@/lib/configuration/pricing";

import {
  useState,
  useEffect,
} from "react";
import { useRouter } from "next/navigation";
import {
  supabase,
  getOrCreateWolfCustomerId,
} from "@/lib/supabase/client";

import { Capacitor } from "@capacitor/core";
import { Preferences } from "@capacitor/preferences";

export default function CheckoutForm() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(false);

  // Stable anonymous customer identity shared across restaurants.
  const [wolfCustomerId, setWolfCustomerId] =
    useState("");

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

  
const [bankAccounts, setBankAccounts] =
  useState<any[]>([]);

const [selectedBankAccount, setSelectedBankAccount] =
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

type CheckoutAddress = {
  id: string;
  customer_id: string;
  label: string;
  recipient_name: string | null;
  recipient_phone: string | null;
  email: string | null;
  address: string;
  zone: string | null;
  reference: string | null;
  instructions: string | null;
  is_default: boolean;
};

const [customerAddresses, setCustomerAddresses] =
  useState<CheckoutAddress[]>([]);

const [selectedAddressId, setSelectedAddressId] =
  useState<string | null>(null);

const applyCheckoutAddress = (address: CheckoutAddress) => {
  setSelectedAddressId(address.id);
  setCustomerAddress(address.address || "");
  setCustomerZone(address.zone || "");
  setCustomerReference(address.reference || "");
  setDeliveryInstructions(address.instructions || "");

  if (address.recipient_name) {
    setCustomerName(address.recipient_name);
  }

  if (address.recipient_phone) {
    setCustomerPhone(address.recipient_phone);
  }

  if (address.email) {
    setCustomerEmail(address.email);
  }

  console.log("[CHECKOUT] Dirección seleccionada:", address);
};

useEffect(() => {
  let cancelled = false;

  const initializeCheckoutCustomer = async () => {
    const customerId = getOrCreateWolfCustomerId();
    if (cancelled) return;

    setWolfCustomerId(customerId ?? "");

    const savedCart = localStorage.getItem("wolf_cart");

    if (savedCart) {
      try {
        const cart = JSON.parse(savedCart);
        console.log("CARRITO CHECKOUT:", cart);
        if (!cancelled) {
          setProducts(Array.isArray(cart) ? cart : []);
        }
      } catch (error) {
        console.error("[CHECKOUT] Error leyendo carrito:", error);
        if (!cancelled) setProducts([]);
      }
    }

    // wolf_customer queda únicamente como perfil básico/fallback.
    // La dirección SIEMPRE se obtiene desde customer_addresses
    // usando el mismo wolf_customer_id que Discover.
    const savedCustomer = localStorage.getItem("wolf_customer");

    if (savedCustomer) {
      try {
        const customer = JSON.parse(savedCustomer);

        setCustomerName(customer.name || "");
        setCustomerPhone(customer.phone || "");
        setCustomerEmail(customer.email || "");
      } catch (error) {
        console.error("[CHECKOUT] Error leyendo wolf_customer:", error);
      }
    }

    if (!customerId) {
      console.warn("[CHECKOUT] No existe wolf_customer_id");
      return;
    }

    const { data: addresses, error: addressesError } = await supabase
      .from("customer_addresses")
      .select("*")
      .eq("customer_id", customerId)
      .order("is_default", { ascending: false })
      .order("created_at", { ascending: false });

    if (addressesError) {
      console.error(
        "[CHECKOUT] Error cargando customer_addresses:",
        addressesError
      );
      return;
    }

    if (cancelled) return;

    const normalizedAddresses = (addresses || []) as CheckoutAddress[];

    setCustomerAddresses(normalizedAddresses);

    const defaultAddress =
      normalizedAddresses.find((address) => address.is_default) ??
      normalizedAddresses[0] ??
      null;

    if (defaultAddress) {
      applyCheckoutAddress(defaultAddress);
    } else {
      console.log(
        "[CHECKOUT] No hay direcciones guardadas para:",
        customerId
      );
    }
  };

  void initializeCheckoutCustomer();

  return () => {
    cancelled = true;
  };
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
      .maybeSingle();

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


    const {
      data: accounts,
      error: accountsError,
    } = await supabase
      .from("restaurant_bank_accounts")
      .select(
        "id,bank_name,account_type,account_holder,account_number,active"
      )
      .eq(
        "restaurant_id",
        restaurantId
      )
      .eq(
        "active",
        true
      )
      .order(
        "bank_name"
      );

    if (accountsError) {
      console.error(
        "Error cargando cuentas bancarias:",
        accountsError
      );
      setBankAccounts([]);
    } else {
      setBankAccounts(accounts || []);
    }

}
  };

useEffect(() => {
  loadRestaurant();
}, []);


const subtotal = Number(
  products
    .reduce(
      (acc, item) =>
        acc +
        (item.display_price ?? item.price) *
          item.quantity,
      0
    )
    .toFixed(2)
);

const orderType =
  typeof window !== "undefined"
    ? localStorage.getItem(
        "wolf_order_type"
      )
    : null;

const deliveryFee =
  orderType !== "delivery"
    ? 0
    : deliverySettings?.delivery_mode ===
      "manual"
    ? 0
    : getDeliveryFee(
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
      );

const total = getOrderTotal(
  subtotal,
  deliveryFee
);

  const hasFreeDelivery =
  deliverySettings?.free_delivery_enabled &&
  subtotal >=
    Number(
      deliverySettings?.free_delivery_minimum || 0
    );
    
const showPendingDeliveryMessage =
  orderType === "delivery" &&
  deliverySettings?.delivery_mode === "manual" &&
  !hasFreeDelivery;

const showFreeDeliveryMessage =
  orderType === "delivery" &&
  deliverySettings?.delivery_mode === "manual" &&
  hasFreeDelivery;

const showDeliveryRow =
  orderType === "delivery" &&
  deliverySettings?.delivery_mode !== "manual";

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
  const formData = new FormData();

  formData.append("file", paymentProof);

  const response = await fetch(
    "/api/payment-proofs/upload",
    {
      method: "POST",
      body: formData,
    }
  );

  const data = await response.json();

  if (!response.ok || !data.success) {
    throw new Error(data.error);
  }

  paymentProofUrl = data.url;
}

console.log(
  "restaurant_id enviado:",
  localStorage.getItem("restaurant_id")
);
 
let pushSubscriptionId: string | null = null;

if (Capacitor.isNativePlatform()) {

  const { value } = await Preferences.get({
    key: "push_subscription_id",
  });

  pushSubscriptionId = value;

} else {

  pushSubscriptionId =
    localStorage.getItem(
      "wolf_push_subscription_id"
    );

}

console.log(
  "[CHECKOUT] PUSH SUBSCRIPTION:",
  pushSubscriptionId
);

// Si el cliente está usando una dirección guardada, mantenemos sus datos
// sincronizados (incluido el correo) para que Discover y Checkout compartan
// la misma información.
if (selectedAddressId && customerAddresses.length > 0) {
  const selectedAddress = customerAddresses.find(
    (address) => address.id === selectedAddressId
  );

  if (selectedAddress) {
    const { error: addressUpdateError } = await supabase
      .from("customer_addresses")
      .update({
        recipient_name: customerName || null,
        recipient_phone: customerPhone || null,
        email: customerEmail.trim() || null,
        address: customerAddress.trim(),
        zone: customerZone.trim() || null,
        reference: customerReference.trim() || null,
        instructions: deliveryInstructions.trim() || null,
      })
      .eq("id", selectedAddress.id)
      .eq("customer_id", wolfCustomerId);

    if (addressUpdateError) {
      console.error(
        "[CHECKOUT] No se pudo sincronizar la dirección:",
        addressUpdateError
      );
    } else {
      console.log(
        "[CHECKOUT] Dirección sincronizada:",
        selectedAddress.id
      );
    }
  }
}

if (!products || products.length === 0) {
  alert("El carrito está vacío.");
  return;
}

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

          // Stable anonymous customer identity.
          // Independent from the current restaurant.
          customer_id:
            wolfCustomerId ||
            getOrCreateWolfCustomerId() ||
            "",

          push_subscription_id:
            pushSubscriptionId,

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

        

        selected_bank_account_id:
          selectedBankAccount?.id || null,

order_type:
          orderType || "pickup",


terms_accepted:
  acceptedTerms,

items: products.map((item) => ({
  product_id: item.id,
  quantity: item.quantity,
}))
      }),
    }
  );

  
const data =
  await response.json();

  if (!response.ok) {
  alert(data.error || "No se pudo crear el pedido.");
  return;
}

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
        padding: "clamp(20px, 5vw, 40px)",
        borderRadius: "24px",
        width: "100%",
        maxWidth: "680px",
        margin: "0 auto",
        boxSizing: "border-box",
      }}
    >
      <h1
        className="wolf-title"
        style={{
          fontSize: "clamp(28px, 6vw, 36px)",
          fontWeight: 800,
          marginBottom: "32px",
          textAlign: "center",
          letterSpacing: "-0.025em",
        }}
      >
        Finalizar Pedido
      </h1>

      {/* RESUMEN */}

      <div
        style={{
          marginBottom: "32px",
          padding: "24px",
          borderRadius: "20px",
          background:
            "linear-gradient(135deg, rgba(255,255,255,.04) 0%, rgba(255,255,255,.01) 100%)",
          border:
            "1px solid rgba(255,255,255,.08)",
        }}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: "18px",
            fontSize: "18px",
            fontWeight: 600,
          }}
        >
          Resumen del Pedido
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {products.map((product, index) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                color: "rgba(255,255,255,.85)",
                fontSize: "15px",
              }}
            >
              <span style={{ fontWeight: 500 }}>
                {product.name} <span style={{ color: "#f97316", marginLeft: "4px" }}>x{product.quantity}</span>
              </span>

              <span style={{ fontFamily: "monospace", fontWeight: 600 }}>
                $
                {(
                  (product.display_price ?? product.price) *
                  product.quantity
                ).toFixed(2)}
              </span>
            </div>
          ))}
        </div>

        <hr
          style={{
            margin: "20px 0",
            border: "0",
            borderTop: "1px dashed rgba(255,255,255,.12)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            marginBottom: "12px",
            color:
              "rgba(255,255,255,.6)",
            fontSize: "15px",
          }}
        >
          <span>Subtotal</span>

          <span style={{ fontFamily: "monospace" }}>
            ${subtotal.toFixed(2)}
          </span>
        </div>

{orderType === "delivery" && (

  hasFreeDelivery ? (

    <div
      style={{
        marginBottom: "15px",
        padding: "16px",
        borderRadius: "14px",
        background: "rgba(34,197,94,.08)",
        border: "1px solid rgba(34,197,94,.25)",
      }}
    >
      <div
        style={{
          color: "#22c55e",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        🎉 ¡Delivery GRATIS desbloqueado!
      </div>

      <div
        style={{
          color: "rgba(255,255,255,.75)",
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        Tu pedido ya califica para envío gratuito.
      </div>
    </div>

  ) : deliverySettings?.delivery_mode === "manual" ? (

    <div
      style={{
        marginBottom: "15px",
        padding: "16px",
        borderRadius: "14px",
        background: "rgba(37,211,102,.08)",
        border: "1px solid rgba(37,211,102,.25)",
      }}
    >
      <div
        style={{
          color: "#25D366",
          fontWeight: 700,
          marginBottom: 8,
        }}
      >
        📍 Delivery Manual
      </div>

      <div
        style={{
          color: "rgba(255,255,255,.75)",
          lineHeight: 1.7,
          fontSize: 14,
        }}
      >
        El costo del envío será calculado por el restaurante
        después de compartir tu ubicación.
      </div>
    </div>

  ) : (

    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "12px",
        color: "rgba(255,255,255,.6)",
        fontSize: "15px",
      }}
    >
      <span>Delivery</span>

      <span
        style={{
          fontFamily: "monospace",
        }}
      >
        ${deliveryFee.toFixed(2)}
      </span>
    </div>

  )

)}

        <hr
          style={{
            margin: "20px 0",
            border: "0",
            borderTop: "1px solid rgba(255,255,255,.1)",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "center",
            color: "#fff",
            fontWeight: 800,
            fontSize: "24px",
            letterSpacing: "-0.02em",
          }}
        >
          <span>Total</span>

          <span style={{ color: "#f97316", fontFamily: "monospace" }}>
            ${total.toFixed(2)}
          </span>
        </div>
      </div>

      {/* CLIENTE */}

      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "32px" }}>
        <input
          placeholder="Nombre completo"
          className="wolf-input"
          value={customerName}
          onChange={(e) =>
            setCustomerName(
              e.target.value
            )
          }
          style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", boxSizing: "border-box" }}
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
          style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", boxSizing: "border-box" }}
        />

        {orderType === "delivery" && customerAddresses.length > 0 && (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            }}
          >
            <div
              style={{
                color: "rgba(255,255,255,.72)",
                fontSize: "13px",
                fontWeight: 700,
              }}
            >
              Dirección guardada
            </div>

            <select
              value={selectedAddressId ?? ""}
              onChange={(e) => {
                const address = customerAddresses.find(
                  (item) => item.id === e.target.value
                );

                if (address) {
                  applyCheckoutAddress(address);
                }
              }}
              className="wolf-input"
              style={{
                width: "100%",
                padding: "14px 16px",
                borderRadius: "12px",
                boxSizing: "border-box",
                color: "#fff",
                background: "rgba(255,255,255,.04)",
              }}
            >
              {customerAddresses.map((address) => (
                <option key={address.id} value={address.id}>
                  {address.label}
                  {address.is_default ? " · Principal" : ""}
                </option>
              ))}
            </select>
          </div>
        )}

        <input
          placeholder="Dirección"
          className="wolf-input"
          value={customerAddress}
          onChange={(e) =>
            setCustomerAddress(
              e.target.value
            )
          }
          style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", boxSizing: "border-box" }}
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
          style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", boxSizing: "border-box" }}
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
          style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", boxSizing: "border-box", resize: "none" }}
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
          style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", boxSizing: "border-box", resize: "none" }}
        />
      </div>

     {/* MÉTODO DE PAGO */}

<div
  style={{
    marginBottom: "32px",
  }}
>
  <h3
    style={{
      color: "#fff",
      marginBottom: "16px",
      fontSize: "18px",
      fontWeight: 600,
    }}
  >
    Método de Pago *
  </h3>

  {!restaurant && (
    <p
      style={{
        color:
          "rgba(255,255,255,.6)",
        fontSize: "14px",
      }}
    >
      Cargando métodos...
    </p>
  )}

  <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
    {restaurant?.accepts_cash && (
      <label
        style={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px",
          borderRadius: "14px",
          background: paymentMethod === "cash" ? "rgba(249,115,22,.1)" : "rgba(255,255,255,.02)",
          border: paymentMethod === "cash" ? "1px solid #f97316" : "1px solid rgba(255,255,255,.08)",
          cursor: "pointer",
          fontSize: "15px",
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
          style={{ accentColor: "#f97316", width: "18px", height: "18px" }}
        />
        Efectivo
      </label>
    )}

    {restaurant?.accepts_transfer && (
      <label
        style={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px",
          borderRadius: "14px",
          background: paymentMethod === "transfer" ? "rgba(249,115,22,.1)" : "rgba(255,255,255,.02)",
          border: paymentMethod === "transfer" ? "1px solid #f97316" : "1px solid rgba(255,255,255,.08)",
          cursor: "pointer",
          fontSize: "15px",
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
          style={{ accentColor: "#f97316", width: "18px", height: "18px" }}
        />
        Transferencia
      </label>
    )}

    {restaurant?.accepts_qr && (
      <label
        style={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "14px 16px",
          borderRadius: "14px",
          background: paymentMethod === "qr" ? "rgba(249,115,22,.1)" : "rgba(255,255,255,.02)",
          border: paymentMethod === "qr" ? "1px solid #f97316" : "1px solid rgba(255,255,255,.08)",
          cursor: "pointer",
          fontSize: "15px",
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
          style={{ accentColor: "#f97316", width: "18px", height: "18px" }}
        />
        Código QR
      </label>
    )}
  </div>

  {!restaurant?.accepts_cash &&
    !restaurant?.accepts_transfer &&
    !restaurant?.accepts_qr && (
      <p
        style={{
          marginTop: "14px",
          padding: "12px 14px",
          borderRadius: "10px",
          background: "rgba(239,68,68,.07)",
          border: "1px solid rgba(239,68,68,.16)",
          color: "#fca5a5",
          fontSize: "12px",
          lineHeight: 1.45,
        }}
      >
        Este restaurante no tiene métodos de pago activos.
      </p>
    )}
</div>

{paymentMethod === "transfer" && (
  <div
    style={{
      marginTop: "20px",
      marginBottom: "32px",
      padding: "20px",
      borderRadius: "20px",
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(255,255,255,.08)",
      color: "#fff",
    }}
  >
    <h3
      style={{
        margin: "0 0 6px",
        fontSize: "16px",
        fontWeight: 700,
      }}
    >
      Elige una cuenta
    </h3>

    <p
      style={{
        margin: "0 0 16px",
        color: "rgba(255,255,255,.55)",
        fontSize: "13px",
        lineHeight: 1.5,
      }}
    >
      Selecciona la cuenta configurada por el restaurante.
    </p>

    {bankAccounts.length === 0 ? (
      <div
        style={{
          padding: "14px",
          borderRadius: "12px",
          background: "rgba(239,68,68,.08)",
          border: "1px solid rgba(239,68,68,.2)",
          color: "#fca5a5",
          fontSize: "13px",
          lineHeight: 1.5,
        }}
      >
        No hay cuentas bancarias activas disponibles.
      </div>
    ) : (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "9px",
        }}
      >
        {bankAccounts.map((account: any) => {
          const selected =
            selectedBankAccount?.id === account.id;

          const accountType =
            account.account_type === "checking"
              ? "Corriente"
              : "Ahorros";

          return (
            <button
              key={account.id}
              type="button"
              onClick={() =>
                setSelectedBankAccount(account)
              }
              style={{
                width: "100%",
                padding: "14px",
                display: "flex",
                alignItems: "center",
                gap: "12px",
                textAlign: "left",
                borderRadius: "14px",
                border: selected
                  ? "1px solid #f97316"
                  : "1px solid rgba(255,255,255,.08)",
                background: selected
                  ? "rgba(249,115,22,.09)"
                  : "rgba(255,255,255,.02)",
                color: "#fff",
                cursor: "pointer",
                transition: "all .18s ease",
              }}
            >
              <span
                style={{
                  width: "34px",
                  height: "34px",
                  flexShrink: 0,
                  display: "grid",
                  placeItems: "center",
                  borderRadius: "10px",
                  background: selected
                    ? "#f97316"
                    : "rgba(255,255,255,.06)",
                  color: "#fff",
                  fontSize: "15px",
                }}
              >
                $
              </span>

              <span style={{ minWidth: 0, flex: 1 }}>
                <span
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    gap: "10px",
                  }}
                >
                  <strong
                    style={{
                      fontSize: "14px",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {account.bank_name}
                  </strong>

                  <span
                    style={{
                      flexShrink: 0,
                      padding: "4px 7px",
                      borderRadius: "999px",
                      background: selected
                        ? "rgba(249,115,22,.14)"
                        : "rgba(255,255,255,.05)",
                      color: selected
                        ? "#f97316"
                        : "rgba(255,255,255,.55)",
                      fontSize: "9px",
                      fontWeight: 700,
                    }}
                  >
                    {accountType}
                  </span>
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: "4px",
                    color: "rgba(255,255,255,.55)",
                    fontSize: "11px",
                  }}
                >
                  {account.account_holder}
                </span>

                <span
                  style={{
                    display: "block",
                    marginTop: "3px",
                    color: "rgba(255,255,255,.75)",
                    fontFamily: "monospace",
                    fontSize: "11px",
                  }}
                >
                  {account.account_number}
                </span>
              </span>
            </button>
          );
        })}
      </div>
    )}

    {selectedBankAccount && (
      <div
        style={{
          marginTop: "14px",
          padding: "10px 12px",
          borderRadius: "10px",
          background: "rgba(34,197,94,.06)",
          border: "1px solid rgba(34,197,94,.14)",
          color: "rgba(255,255,255,.65)",
          fontSize: "11px",
        }}
      >
        Cuenta seleccionada:{" "}
        <strong style={{ color: "#22c55e" }}>
          {selectedBankAccount.bank_name}
        </strong>
      </div>
    )}

    <label
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: "10px",
        marginTop: "20px",
        fontSize: "14px",
        color: "rgba(255,255,255,.85)",
        cursor: "pointer",
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
        style={{
          accentColor: "#f97316",
          marginTop: "2px",
          width: "16px",
          height: "16px",
        }}
      />
      Confirmo que realizaré la transferencia bancaria
    </label>

    <div
      style={{
        marginTop: "20px",
        paddingTop: "18px",
        borderTop: "1px solid rgba(255,255,255,.08)",
      }}
    >
      <label
        style={{
          display: "block",
          fontSize: "13px",
          fontWeight: 600,
          marginBottom: "9px",
        }}
      >
        Subir comprobante
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
          width: "100%",
          color: "rgba(255,255,255,.6)",
          fontSize: "13px",
        }}
      />
    </div>
  </div>
)}


{paymentMethod === "qr" && (
  <div
    style={{
      marginTop: "20px",
      marginBottom: "32px",
      padding: "24px",
      borderRadius: "20px",
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(255,255,255,.08)",
      color: "#fff",
    }}
  >
    <h3
      style={{
        marginBottom: "18px",
        fontSize: "16px",
        fontWeight: 600,
      }}
    >
      Selecciona un QR
    </h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
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
                  ? "rgba(249,115,22,.15)"
                  : "rgba(255,255,255,.02)",

              color: selectedQr?.id === qr.id ? "#f97316" : "#fff",

              border:
                selectedQr?.id === qr.id
                  ? "2px solid #f97316"
                  : "1px solid rgba(255,255,255,.08)",

              borderRadius: "12px",

              padding: "14px",

              cursor: "pointer",

              textAlign: "center",
              fontSize: "14px",
              fontWeight: selectedQr?.id === qr.id ? 600 : 400,
              transition: "all 0.2s ease",
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
          marginTop: "24px",
          padding: "20px",
          borderRadius: "18px",
          background: "rgba(0,0,0,.15)",
          border: "1px solid rgba(255,255,255,.06)",
        }}
      >
        <h3
          style={{
            color: "#fff",
            marginBottom: "16px",
            fontSize: "15px",
            textAlign: "center",
          }}
        >
          {selectedQr.name}
        </h3>

        <img
          src={selectedQr.qr_image_url}
          alt={selectedQr.name}
          style={{
            width: "100%",
            maxWidth: "240px",
            borderRadius: "12px",
            display: "block",
            margin: "0 auto 20px auto",
            border: "4px solid rgba(255,255,255,0.05)",
          }}
        />

        <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", marginBottom: "20px" }}>
          {selectedQr.account_holder && (
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)" }}>
              <strong style={{ color: "#fff" }}>Titular:</strong>{" "}
              {selectedQr.account_holder}
            </p>
          )}

          {selectedQr.account_number && (
            <p style={{ margin: 0, color: "rgba(255,255,255,.7)" }}>
              <strong style={{ color: "#fff" }}>Cuenta:</strong>{" "}
              <span style={{ fontFamily: "monospace" }}>{selectedQr.account_number}</span>
            </p>
          )}
        </div>

<label
  style={{
    display: "flex",
    alignItems: "flex-start",
    gap: "10px",
    marginTop: "16px",
    color: "rgba(255,255,255,.85)",
    fontSize: "14px",
    cursor: "pointer",
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
    style={{ accentColor: "#f97316", marginTop: "2px", width: "16px", height: "16px" }}
  />
  Confirmo que realicé el pago mediante QR
</label>

<div
  style={{
    marginTop: "20px",
    paddingTop: "16px",
    borderTop: "1px solid rgba(255,255,255,.08)",
  }}
>
  <label style={{ display: "block", fontSize: "14px", marginBottom: "8px" }}>
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
      width: "100%",
      color: "rgba(255,255,255,.6)",
      fontSize: "14px",
    }}
  />
</div>

      </div>
    )}
  </div>
)}

{paymentMethod === "cash" && (
  <div
    style={{
      marginTop: "20px",
      marginBottom: "32px",
      padding: "24px",
      borderRadius: "20px",
      background: "rgba(255,255,255,.03)",
      border: "1px solid rgba(255,255,255,.08)",
      color: "#fff",
    }}
  >
    <h3 style={{ fontSize: "16px", fontWeight: 600, margin: "0 0 6px 0" }}>
      Cambio para el pago
    </h3>

    <p
      style={{
        color:
          "rgba(255,255,255,.55)",
        fontSize: "14px",
        margin: "0 0 16px 0",
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
  Number(
    (
      Number(value) - total
    ).toFixed(2)
  )
);
      }}
      placeholder="Ej: 20"
      className="wolf-input"
      style={{ width: "100%", padding: "14px 16px", borderRadius: "12px", boxSizing: "border-box" }}
    />

    {cashAmount && (
      <div
        style={{
          marginTop: "16px",
          padding: "12px 16px",
          borderRadius: "10px",
          background: "rgba(255,255,255,.03)",
          fontSize: "15px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <span style={{ color: "rgba(255,255,255,.6)" }}>Cambio requerido:</span>
        <strong style={{ color: "#22c55e", fontFamily: "monospace" }}>
          $
          {Math.max(
            changeAmount,
            0
          ).toFixed(2)}
        </strong>
      </div>
    )}
  </div>
)}

      {/* TÉRMINOS */}

      <div
        style={{
          marginTop: "24px",
          color: "rgba(255,255,255,.8)",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        <label style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
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
            style={{ accentColor: "#f97316", marginTop: "3px", width: "16px", height: "16px", flexShrink: 0 }}
          />

          <span>
            Acepto los{" "}
            <a
              href="https://www.wolfordering.com/terminos-y-condiciones"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: "#f97316",
                textDecoration: "underline",
                fontWeight: 500,
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
                textDecoration: "underline",
                fontWeight: 500,
              }}
            >
              política de privacidad
            </a>
          </span>
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
          padding: "16px",
          borderRadius: "14px",
          fontSize: "16px",
          fontWeight: 700,
          marginTop: "32px",
          cursor: !acceptedTerms || loading ? "not-allowed" : "pointer",
          transition: "all 0.2s ease",
          opacity:
            !acceptedTerms ||
            loading
              ? 0.4
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