import { CartItem, Product } from "../types";
import {
  getFinalPrice,
  CommissionConfig,
} from "@/lib/configuration/pricing";

export function createCartItem(
  product: Product,
  commissionConfig: CommissionConfig
): CartItem {
  return {
    id: product.id,
    restaurant_id: product.restaurant_id,
    name: product.name,
    category: product.category,
    description: product.description,
    price: Number(product.price) || 0,
    display_price: getFinalPrice(
      Number(product.price),
      commissionConfig
    ),
    image_url: product.image_url,
    quantity: 1,
  };
}

export function calculateSubtotal(
  items: CartItem[]
): number {
  return items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
}

export function calculateTotalItems(
  items: CartItem[]
): number {
  return items.reduce(
    (total, item) => total + item.quantity,
    0
  );
}


