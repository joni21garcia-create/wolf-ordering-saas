"use client";

import {
  useMemo,
  useState,
} from "react";

import OrderType from "@/components/restaurant/order/OrderType";
import CustomerForm from "@/components/restaurant/order/CustomerForm";
import RestaurantMap from "@/components/restaurant/order/RestaurantMap";
import DigitalMenu from "@/components/restaurant/order/DigitalMenu";
import Cart from "@/components/restaurant/order/Cart";

import { getCommissionConfig } from "@/lib/configuration/pricing";

import { Restaurant } from "./types";
import { useOrder } from "./hooks/useOrder";
import { useCart } from "./hooks/useCart";

interface Props {
  restaurant: Restaurant;
}

export default function OrderClient({
  restaurant,
}: Props) {
  const commissionConfig = useMemo(
    () => getCommissionConfig(restaurant),
    [restaurant]
  );

  const {
    orderType,
    setOrderType,
    customerData,
    setCustomerData,
  } = useOrder(
    restaurant.deliverySettings
  );

  const {
    cartItems,
    subtotal,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
  } = useCart(
    commissionConfig
  );

  const [showCart, setShowCart] =
    useState(false);

return (
  <>
    <main
      className="wolf-order-background"
      style={{
        minHeight: "100vh",
        padding: "40px 16px 120px",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        .wolf-grid-container{
          display:flex;
          flex-direction:column;
          gap:24px;
          max-width:1700px;
          margin:0 auto;
        }

        .wolf-map-wrapper{
          width:100%;
        }

        .wolf-menu-wrapper{
          width:100%;
        }
      `}</style>

      <div className="wolf-grid-container">
        <div className="wolf-map-wrapper">
       
        </div>

        <div className="wolf-menu-wrapper">
          <h1
            className="wolf-title"
            style={{
              fontSize: "48px",
              marginBottom: "50px",
              fontWeight: 700,
            }}
          >
            Realizar Pedido
          </h1>

          <OrderType
            selected={orderType}
            onSelect={setOrderType}
            deliveryEnabled={
              restaurant.deliverySettings?.delivery_enabled
            }
            pickupEnabled={
              restaurant.deliverySettings?.pickup_enabled
            }
            deliverySettings={restaurant.deliverySettings}
            subtotal={subtotal}
          />

          {orderType && (
            <CustomerForm
              orderType={orderType}
              customerData={customerData}
              setCustomerData={setCustomerData}
            />
          )}

          <DigitalMenu
            restaurant={restaurant}
            addToCart={addToCart}
            cartCount={cartItems.length}
            onCart={() => setShowCart(true)}
          />
        </div>
      </div>
    </main>

    {showCart && (
      <div
        onClick={() => setShowCart(false)}
        style={{
          position: "fixed",
          inset: 0,
          background: "rgba(0,0,0,.70)",
          zIndex: 9999,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          overflowY: "auto",
          padding: "40px 20px",
        }}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "100%",
            maxWidth: 420,
            background: "#141414",
            border: "1px solid rgb(4, 1, 0)",
            borderRadius: 30,
            padding: 10,
            boxShadow: "0 30px 80px rgba(0,0,0,.60)",
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
    )}
  </>
);
}