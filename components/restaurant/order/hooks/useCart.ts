import { useMemo, useCallback } from "react";

import { STORAGE_KEYS } from "../constants";
import { useLocalStorage } from "./useLocalStorage";

import {
  CartItem,
  Product,
} from "../types";

import {
  CommissionConfig,
  getFinalPrice,
} from "@/lib/configuration/pricing";

export function useCart(
  commissionConfig: CommissionConfig
) {
  const [cartItems, setCartItems] =
    useLocalStorage<CartItem[]>(
      STORAGE_KEYS.CART,
      []
    );

  const subtotal = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );
  }, [cartItems]);

  const totalItems = useMemo(() => {
    return cartItems.reduce(
      (total, item) =>
        total + item.quantity,
      0
    );
  }, [cartItems]);

  const addToCart = useCallback(
    (product: Product) => {
      setCartItems((prev) => {
        const existing = prev.find(
          (item) => item.id === product.id
        );

        if (existing) {
          return prev.map((item) =>
            item.id === product.id
              ? {
                  ...item,
                  quantity: item.quantity + 1,
                }
              : item
          );
        }

        return [
          ...prev,
          {
            id: product.id,
            restaurant_id:
              product.restaurant_id,
            name: product.name,
            price:
              Number(product.price) || 0,
            display_price:
              getFinalPrice(
                Number(product.price),
                commissionConfig
              ),
            image_url:
              product.image_url,
            quantity: 1,
          },
        ];
      });
    },
    [commissionConfig, setCartItems]
  );

  const increaseQuantity =
    useCallback(
      (id: string) => {
        setCartItems((prev) =>
          prev.map((item) =>
            item.id === id
              ? {
                  ...item,
                  quantity:
                    item.quantity + 1,
                }
              : item
          )
        );
      },
      [setCartItems]
    );

  const decreaseQuantity =
    useCallback(
      (id: string) => {
        setCartItems((prev) =>
          prev
            .map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity:
                      item.quantity - 1,
                  }
                : item
            )
            .filter(
              (item) =>
                item.quantity > 0
            )
        );
      },
      [setCartItems]
    );

  const removeItem = useCallback(
    (id: string) => {
      setCartItems((prev) =>
        prev.filter(
          (item) => item.id !== id
        )
      );
    },
    [setCartItems]
  );

  const clearCart = useCallback(() => {
    setCartItems([]);
  }, [setCartItems]);

  return {
    cartItems,
    subtotal,
    totalItems,
    addToCart,
    increaseQuantity,
    decreaseQuantity,
    removeItem,
    clearCart,
  };
}


