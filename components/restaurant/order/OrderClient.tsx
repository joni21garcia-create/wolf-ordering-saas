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
  
  // 🛠️ Estado para responsividad
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1024); // Se activa en tablets y móviles
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ===========================
     CARGAR LOCAL STORAGE
  =========================== */
  useEffect(() => {
    const savedCart = localStorage.getItem("wolf_cart");
    if (savedCart) setCartItems(JSON.parse(savedCart));

    const savedCustomer = localStorage.getItem("wolf_customer");
    if (savedCustomer) setCustomerData(JSON.parse(savedCustomer));

    const savedOrderType = localStorage.getItem("wolf_order_type");
    if (savedOrderType === "delivery" || savedOrderType === "pickup") {
      setOrderType(savedOrderType);
    }
  }, []);

  /* ===========================
     GUARDAR LOCAL STORAGE
  =========================== */
  useEffect(() => {
    localStorage.setItem("wolf_cart", JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    localStorage.setItem("wolf_customer", JSON.stringify(customerData));
  }, [customerData]);

  useEffect(() => {
    if (orderType) localStorage.setItem("wolf_order_type", orderType);
  }, [orderType]);

  useEffect(() => {
    const deliveryEnabled = restaurant?.deliverySettings?.delivery_enabled;
    const pickupEnabled = restaurant?.deliverySettings?.pickup_enabled;

    if (deliveryEnabled === true && pickupEnabled === false) setOrderType("delivery");
    if (deliveryEnabled === false && pickupEnabled === true) setOrderType("pickup");
  }, [restaurant?.deliverySettings]);

  /* ===========================
     MANEJO DEL CARRITO
  =========================== */
  const addToCart = (product: any) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }
      return [
        ...prev,
        {
          id: product.id,
          restaurant_id: product.restaurant_id,
          name: product.name,
          price: Number(product.price) || 0,
          display_price: getDisplayPrice(product, restaurant),
          image_url: product.image_url,
          quantity: 1,
        },
      ];
    });
  };

  const increaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity: item.quantity + 1 } : item))
    );
  };

  const decreaseQuantity = (id: string) => {
    setCartItems((prev) =>
      prev
        .map((item) => (item.id === id ? { ...item, quantity: item.quantity - 1 } : item))
        .filter((item) => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  function getDisplayPrice(product: any, restaurant: any) {
    const basePrice = Number(product.price) || 0;
    if (!restaurant?.commission_active) return basePrice;
    const percentage = Number(restaurant.commission_percentage) || 0;
    if (restaurant.commission_type === "customer") {
      return basePrice + (basePrice * percentage) / 100;
    }
    return basePrice;
  }

  return (
    <main
      className="wolf-order-background"
      style={{
        minHeight: "100vh",
        padding: isMobile ? "80px 12px 40px 12px" : "120px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "1700px",
          margin: "0 auto",
          display: "grid",
          // 🛠️ Grid responsivo dinámico
          gridTemplateColumns: isMobile ? "1fr" : "320px minmax(0,1fr) 380px",
          gap: isMobile ? "24px" : "40px",
          alignItems: "start",
        }}
      >
        {/* COLUMNA 1: MAPA (Solo se muestra arriba en desktop) */}
        {!isMobile && (
          <div style={{ position: "sticky", top: "120px" }}>
            <RestaurantMap restaurant={restaurant} />
          </div>
        )}

        {/* COLUMNA 2: CONTENIDO PRINCIPAL */}
        <div style={{ display: "flex", flexDirection: "column", gap: isMobile ? "20px" : "30px" }}>
          <h1
            className="wolf-title"
            style={{
              fontSize: isMobile ? "32px" : "48px",
              marginBottom: isMobile ? "10px" : "50px",
              fontWeight: 700,
              textAlign: isMobile ? "center" : "left",
            }}
          >
            Realizar Pedido
          </h1>

          <OrderType
            selected={orderType}
            onSelect={(value) => setOrderType(value)}
            deliveryEnabled={restaurant.deliverySettings?.delivery_enabled}
            pickupEnabled={restaurant.deliverySettings?.pickup_enabled}
            deliverySettings={restaurant.deliverySettings}
          />

          {/* En móvil, mostramos el mapa debajo de la selección de tipo para guiar al usuario */}
          {isMobile && (
            <div style={{ marginTop: "10px" }}>
              <RestaurantMap restaurant={restaurant} />
            </div>
          )}

          {/* Formulario de Cliente */}
          {orderType && (
            <CustomerForm
              orderType={orderType}
              customerData={customerData}
              setCustomerData={setCustomerData}
              primaryColor={restaurant.primary_color}
            />
          )}

          {/* Menú Digital de productos */}
          <DigitalMenu restaurant={restaurant} addToCart={addToCart} />
        </div>

        {/* COLUMNA 3: CARRITO */}
        <div
          style={{
            position: isMobile ? "relative" : "sticky",
            top: isMobile ? "0" : "120px",
            marginTop: isMobile ? "20px" : "0",
          }}
        >
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
    </main>
  );
}