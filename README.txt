Wolf Ordering - Public Floating Cart

Changes:
- Adds a minimal floating cart to the public restaurant page only.
- Reads the existing `wolf_cart` localStorage key.
- Shows total quantity (supports `quantity` or `qty`).
- Hidden when cart is empty or when already on /[slug]/order.
- Clicking routes to /[slug]/order.
- Uses Lucide ShoppingCart and Android safe-area spacing.

No database migration required.
