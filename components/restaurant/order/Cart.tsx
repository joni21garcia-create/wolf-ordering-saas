"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter, useParams } from "next/navigation";

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
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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

  const handleContinueOrder = () => {
    const customer = localStorage.getItem("wolf_customer");
    if (!customer) { alert("Completa tus datos primero"); return; }
    const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
    if (!slug) return;
    localStorage.setItem("restaurant_slug", slug);
    router.push(`/${slug}/checkout`);
  };

  return (
    <div className="glass-card wolf-shadow" style={{ 
      padding: "24px", 
      borderRadius: "24px", 
      display: "flex", 
      flexDirection: "column",
      // En móvil, limitamos la altura para que el botón siempre sea visible
      maxHeight: isMobile ? "85vh" : "none" 
    }}>
      <h3 style={{ color: "#fff", fontSize: "20px", fontWeight: 700, marginBottom: "20px" }}>
        🛒 Mi Pedido
      </h3>

      {items.length === 0 && (
        <div style={{ textAlign: "center", padding: "20px 0", color: "rgba(255,255,255,.5)", fontSize: "14px" }}>
          Tu carrito está vacío
        </div>
      )}

      {/* ZONA DE SCROLL: Solo los productos hacen scroll */}
      <div style={{ flex: 1, overflowY: "auto", marginBottom: "16px" }}>
        {items.map((item) => (
          <div key={item.id} style={{ borderBottom: "1px solid rgba(255,255,255,.05)", paddingBottom: "16px", marginBottom: "16px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
              <strong style={{ color: "#fff", fontSize: "14px" }}>{item.name}</strong>
              <button onClick={() => removeItem?.(item.id)} style={{ background: "transparent", border: "none", cursor: "pointer", color: "#ef4444" }}>✕</button>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                <button onClick={() => decreaseQuantity?.(item.id)} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#222", color: "#fff", cursor: "pointer" }}>-</button>
                <span style={{ color: "#fff", fontSize: "14px", minWidth: "20px", textAlign: "center" }}>{item.quantity}</span>
                <button onClick={() => increaseQuantity?.(item.id)} style={{ width: "28px", height: "28px", borderRadius: "6px", border: "none", background: "#f97316", color: "#fff", cursor: "pointer" }}>+</button>
              </div>
              <strong style={{ color: "#f97316", fontSize: "14px" }}>${(((item as any).display_price || item.price) * item.quantity).toFixed(2)}</strong>
            </div>
          </div>
        ))}
      </div>

      {/* ZONA DE TOTALES: Siempre visible al final */}
      <div style={{ borderTop: "1px solid rgba(255,255,255,0.1)", paddingTop: "16px" }}>
        {orderType === "delivery" && deliverySettings?.free_delivery_enabled && subtotal < deliverySettings.free_delivery_minimum && (
          <div style={{ fontSize: "12px", color: "#22c55e", marginBottom: "15px" }}>
            Te faltan ${(deliverySettings.free_delivery_minimum - subtotal).toFixed(2)} para envío gratis.
          </div>
        )}
        
        <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.6)", fontSize: "14px", marginBottom: "8px" }}>
          <span>Subtotal</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {orderType === "delivery" && (
          <div style={{ display: "flex", justifyContent: "space-between", color: "rgba(255,255,255,.6)", fontSize: "14px", marginBottom: "15px" }}>
            <span>Delivery</span>
            <span>${deliveryFee.toFixed(2)}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", color: "#fff", fontWeight: "bold", fontSize: "18px", marginBottom: "20px" }}>
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={handleContinueOrder}
          style={{ 
            width: "100%", 
            border: "none", 
            borderRadius: "14px", 
            padding: "16px", 
            cursor: "pointer", 
            fontWeight: "bold", 
            background: "#f97316",
            color: "#fff",
            fontSize: "16px"
          }}
        >
          Continuar Pedido
        </motion.button>
      </div>
    </div>
  );
}