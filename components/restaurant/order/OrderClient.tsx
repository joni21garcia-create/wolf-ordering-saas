"use client";

import { useState, useEffect } from "react";
import OrderType from "@/components/restaurant/order/OrderType";
import CustomerForm from "@/components/restaurant/order/CustomerForm";
import RestaurantMap from "@/components/restaurant/order/RestaurantMap";
import DigitalMenu from "@/components/restaurant/order/DigitalMenu";
import Cart from "@/components/restaurant/order/Cart";

interface Props {
  restaurant: any;
}

interface CartItem {
  id: string;
  restaurant_id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string | null;
}

export default function OrderClient({ restaurant }: Props) {
  const [orderType, setOrderType] = useState<"delivery" | "pickup" | null>(null);
  const [customerData, setCustomerData] = useState<any>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 1024);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ... (Tus useEffects de LocalStorage y Lógica de Carrito se mantienen intactos aquí)
  useEffect(() => {
    const savedCart = localStorage.getItem("wolf_cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
    const savedCustomer = localStorage.getItem("wolf_customer");
    if (savedCustomer) setCustomerData(JSON.parse(savedCustomer));
    const savedOrderType = localStorage.getItem("wolf_order_type");
    if (savedOrderType === "delivery" || savedOrderType === "pickup") setOrderType(savedOrderType);
  }, []);

  useEffect(() => {
    localStorage.setItem("wolf_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wolf_customer", JSON.stringify(customerData));
  }, [customerData]);

  useEffect(() => {
    if (orderType) localStorage.setItem("wolf_order_type", orderType);
  }, [orderType]);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, price: Number(product.price) || 0, quantity: 1 }];
    });
  };

  const increaseQuantity = (id: string) => setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  const decreaseQuantity = (id: string) => setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0));
  const removeItem = (id: string) => setCartItems((prev) => prev.filter((item) => item.id !== id));

  return (
    <main className="wolf-order-background" style={{ minHeight: "100vh", padding: isMobile ? "80px 15px 40px" : "120px 20px" }}>
      <div
        style={{
          maxWidth: "1700px",
          margin: "0 auto",
          display: "grid",
          gridTemplateColumns: isMobile ? "1fr" : "320px 1fr 380px",
          gap: "30px",
        }}
      >
        {!isMobile && (
          <div style={{ position: "sticky", top: "120px", alignSelf: "start" }}>
            <RestaurantMap restaurant={restaurant} />
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: "25px" }}>
          <h1 style={{ fontSize: isMobile ? "32px" : "48px", fontWeight: 700, textAlign: isMobile ? "center" : "left" }}>
            Realizar Pedido
          </h1>

          <OrderType
            selected={orderType}
            onSelect={setOrderType}
            deliveryEnabled={restaurant?.deliverySettings?.delivery_enabled}
            pickupEnabled={restaurant?.deliverySettings?.pickup_enabled}
            deliverySettings={restaurant?.deliverySettings}
          />

          {isMobile && <RestaurantMap restaurant={restaurant} />}

          {orderType && (
            <CustomerForm
              orderType={orderType}
              customerData={customerData}
              setCustomerData={setCustomerData}
              primaryColor={restaurant?.primary_color}
            />
          )}

          <DigitalMenu restaurant={restaurant} addToCart={addToCart} />
        </div>

        <div style={{ position: isMobile ? "static" : "sticky", top: "120px", alignSelf: "start" }}>
          <Cart
            items={cartItems}
            orderType={orderType}
            increaseQuantity={increaseQuantity}
            decreaseQuantity={decreaseQuantity}
            removeItem={removeItem}
            deliverySettings={restaurant?.deliverySettings}
          />
        </div>
      </div>
    </main>
  );
}