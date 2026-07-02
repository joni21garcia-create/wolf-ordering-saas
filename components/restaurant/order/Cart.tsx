"use client";

import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

// Definición de interfaces
interface CartItem {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  display_price?: number;
  quantity: number;
  image_url?: string | null;
}

interface Props {
  items: CartItem[];
  orderType: "delivery" | "pickup" | null;
  deliverySettings?: any;
  increaseQuantity?: (id: string) => void;
  decreaseQuantity?: (id: string) => void;
  removeItem?: (id: string) => void;
}

export default function Cart({
  items,
  orderType,
  deliverySettings,
  increaseQuantity,
  decreaseQuantity,
  removeItem,
}: Props) {
  const router = useRouter();
  const params = useParams();

  // --- LÓGICA DE CÁLCULOS ---
  const subtotal = items.reduce(
    (acc, item) => acc + (((item as any).display_price || item.price) * item.quantity),
    0
  );

  let deliveryFee = 0;
  if (orderType === "delivery" && items.length > 0) {
    const fee = Number(deliverySettings?.delivery_fee) || 0;
    const freeEnabled = deliverySettings?.free_delivery_enabled;
    const freeMinimum = Number(deliverySettings?.free_delivery_minimum) || 0;
    deliveryFee = (freeEnabled && subtotal >= freeMinimum) ? 0 : fee;
  }

  const total = subtotal + deliveryFee;

  // --- FUNCIÓN CORRECTAMENTE UBICADA DENTRO DEL COMPONENTE ---
  const handleContinueOrder = () => {
    const customer = localStorage.getItem("wolf_customer");
    if (!customer) {
      alert("Completa tus datos primero");
      return;
    }

    const customerData = JSON.parse(customer);
    const name = customerData.name?.trim() || "";
    const phone = customerData.phone?.trim() || "";

    if (name.length < 3 || !/[a-zA-ZáéíóúÁÉÍÓÚñÑ ]/.test(name)) {
      alert("Ingresa un nombre válido");
      return;
    }

    if (!phone || phone.replace(/\D/g, "").length < 10) {
      alert("Ingresa un teléfono válido");
      return;
    }

    const savedOrderType = localStorage.getItem("wolf_order_type");
    if (!savedOrderType) {
      alert("Debes seleccionar Delivery o Pickup");
      return;
    }

    if (savedOrderType === "delivery" && (!customerData.address?.trim() || !customerData.zone?.trim())) {
      alert("Debes ingresar dirección y sector");
      return;
    }

    if (items.length === 0) {
      alert("Debes agregar al menos un producto");
      return;
    }

    localStorage.setItem("wolf_cart", JSON.stringify(items));
    if (items.length > 0) localStorage.setItem("restaurant_id", items[0].restaurant_id);

    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    if (!slug) return;

    localStorage.setItem("restaurant_slug", slug);
    router.push(`/${slug}/checkout`);
  };

  return (
    // Se usa la clase 'container-responsive' definida en tu CSS global para evitar errores de hidratación
    <div className="glass-card wolf-shadow container-responsive">
      <h3 style={{ color: "#fff", fontSize: "24px", fontWeight: 700, marginBottom: "24px" }}>
        🛒 Mi Pedido
      </h3>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "30px 0", color: "rgba(255,255,255,.6)" }}>
          Tu carrito está vacío
        </div>
      )}

      {items.map((item) => (
        <div key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,.08)", paddingBottom: "18px", marginBottom: "18px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
            <strong style={{ color: "#fff" }}>{item.name}</strong>
            <button onClick={() => removeItem?.(item.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "18px" }}>🗑</button>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button onClick={() => decreaseQuantity?.(item.id)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#222", color: "#fff", cursor: "pointer" }}>-</button>
              <span style={{ color: "#fff", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
              <button onClick={() => increaseQuantity?.(item.id)} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "none", background: "#f97316", color: "#fff", cursor: "pointer" }}>+</button>
            </div>
            <strong style={{ color: "#f97316" }}>${(((item as any).display_price || item.price) * item.quantity).toFixed(2)}</strong>
          </div>
        </div>
      ))}

      <div style={{ marginTop: "25px" }}>
        {orderType === "delivery" && deliverySettings?.free_delivery_enabled && (
          <div style={{ background: "rgba(34,197,94,.12)", border: "1px solid rgba(34,197,94,.25)", color: "#22c55e", padding: "12px", borderRadius: "12px", marginBottom: "15px", fontWeight: "600" }}>
            🚚 Delivery gratis desde ${deliverySettings.free_delivery_minimum}
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.7)", marginBottom: "10px" }}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {orderType === "delivery" && (
          <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.7)", marginBottom: "15px" }}>
            <span>Delivery</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        )}

        <hr style={{ borderColor: "rgba(255,255,255,.08)", margin: "20px 0" }} />

        <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: "bold", fontSize: "20px", marginBottom: "20px" }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="wolf-button"
          onClick={handleContinueOrder}
          style={{ width: "100%", border: "none", borderRadius: "14px", padding: "16px", cursor: "pointer", fontWeight: "bold", color: "#fff" }}
        >
          Continuar Pedido
        </motion.button>
      </div>
    </div>
  );
}