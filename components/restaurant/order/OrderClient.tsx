"use client";

import { useState, useEffect } from "react";

import OrderType from "@/components/restaurant/order/OrderType";
import CustomerForm from "@/components/restaurant/order/CustomerForm";
import RestaurantMap from "@/components/restaurant/order/RestaurantMap"; 
import DigitalMenu from "@/components/restaurant/order/DigitalMenu";
import Cart from "@/components/restaurant/order/Cart";

import { getFinalPrice, getCommissionConfig } from "@/lib/configuration/pricing";

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
  const [isMobile, setIsMobile] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const [orderType, setOrderType] = useState<"delivery" | "pickup" | null>(null);
  const [customerData, setCustomerData] = useState<any>({});
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setIsMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    
    const savedCart = localStorage.getItem("wolf_cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));
    
    const savedCustomer = localStorage.getItem("wolf_customer");
    if (savedCustomer) setCustomerData(JSON.parse(savedCustomer));
    
    const savedOrderType = localStorage.getItem("wolf_order_type");
    if (savedOrderType === "delivery" || savedOrderType === "pickup") setOrderType(savedOrderType);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("wolf_cart", JSON.stringify(cartItems));
      localStorage.setItem("wolf_customer", JSON.stringify(customerData));
      if (orderType) localStorage.setItem("wolf_order_type", orderType);
    }
  }, [cartItems, customerData, orderType, isMounted]);

  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, {
        id: product.id,
        restaurant_id: product.restaurant_id,
        name: product.name,
        price: Number(product.price) || 0,
        display_price: getFinalPrice(Number(product.price), getCommissionConfig(restaurant)),
        image_url: product.image_url,
        quantity: 1,
      }];
    });
  };

  const increaseQuantity = (id: string) => setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity + 1 } : item));
  const decreaseQuantity = (id: string) => setCartItems((prev) => prev.map((item) => item.id === id ? { ...item, quantity: item.quantity - 1 } : item).filter((item) => item.quantity > 0));
  const removeItem = (id: string) => setCartItems((prev) => prev.filter((item) => item.id !== id));

  if (!isMounted) return null;

  return (
    <main 
      className="wolf-order-background" 
      style={{ 
        minHeight: "100vh", 
        padding: isMobile ? "16px 8px" : "80px 20px",
        width: "100%",
        overflowX: "hidden"
      }}
    >
      <div style={{ maxWidth: "1440px", margin: "0 auto", width: "100%" }}>
        
        {/* Selector de modo */}
        <div style={{ marginBottom: "24px", maxWidth: "600px", margin: "0 auto 24px auto" }}>
          <OrderType
            selected={orderType}
            onSelect={setOrderType}
            deliveryEnabled={restaurant.deliverySettings?.delivery_enabled}
            pickupEnabled={restaurant.deliverySettings?.pickup_enabled}
            deliverySettings={restaurant.deliverySettings}
          />
        </div>

        {/* Grid de 3 columnas */}
        <div style={{ 
            display: "grid", 
            gridTemplateColumns: isMobile ? "1fr" : "280px minmax(0, 1fr) 340px", 
            gap: "16px", 
            alignItems: "start",
            width: "100%"
        }}>
          
          {/* COLUMNA 1: Mapa + Formulario (Bloque unificado) */}
          <div style={{ 
            display: "flex", 
            flexDirection: "column", 
            gap: "16px", 
            position: isMobile ? "static" : "sticky", 
            top: "100px",
            width: "100%"
          }}>
            <div className="glass-card" style={{ overflow: "hidden", borderRadius: "16px", width: "100%" }}>
              <RestaurantMap restaurant={restaurant} />
            </div>
            
            {orderType && (
              <div style={{ width: "100%" }}>
                <CustomerForm
                  orderType={orderType}
                  customerData={customerData}
                  setCustomerData={setCustomerData}
                />
              </div>
            )}
          </div>

          {/* COLUMNA 2: Menú */}
          <div style={{ width: "100%" }}>
            <DigitalMenu restaurant={restaurant} addToCart={addToCart} />
          </div>

          {/* COLUMNA 3: Carrito */}
          <div style={{ position: isMobile ? "static" : "sticky", top: "100px", width: "100%" }}>
            <Cart
              items={cartItems}
              orderType={orderType}
              increaseQuantity={increaseQuantity}
              decreaseQuantity={decreaseQuantity}
              removeItem={removeItem}
              deliverySettings={restaurant.deliverySettings}
            />
          </div>
        </div>
      </div>
    </main>
  );
}